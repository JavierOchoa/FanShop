import { Router } from "express";
import bcrypt from "bcrypt";
import { userRepository } from "../../../appDataSource";
import { User } from "../../../appDataSource/entity";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    const newUser = new User();
    newUser.email = email;
    newUser.fullName = fullName;
    newUser.password = await bcrypt.hash(password, 10);
    await userRepository.save(newUser);

    res.send(responseRouter(true, `${newUser.email} has been created`, signToken(newUser.id)));
  } catch (error) {
    const reason = handleError(error);
    res.send(responseRouter(false, reason));
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send(responseRouter(false, "Missing data"));
    return;
  }
  try {
    const userOnDB = await userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    if (!userOnDB) {
      res.send(responseRouter(false, "User doesn't exists"));
      return;
    }
    const samePassword = await bcrypt.compare(password, userOnDB.password);
    if (!samePassword) {
      res.send(responseRouter(false, "Wrong password"));
      return;
    }
    res.send(responseRouter(true, "Login successful", signToken(userOnDB.id)));
  } catch (error) {
    const reason = handleError(error);
    res.send(responseRouter(false, reason));
  }
});

const responseRouter = (successful: boolean, message: string, token?: string) => {
  return {
    successful,
    message,
    ...(token && { token }),
  };
};

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "8d" });
};

const handleError = (error: any) => {
  if (error.code === "23505") {
    return "User already exists";
  }
  console.log(error);
  return "Unknown error, please check console";
};
