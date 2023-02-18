import { Router } from "express";
import bcrypt from "bcryptjs";
import { userRepository } from "../../appDataSource";
import { User } from "../../appDataSource/entity";
import jwt from "jsonwebtoken";
import { routeResponse } from ".";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    const userOnDb = await userRepository.findOne({ where: { email } });
    if (userOnDb) {
      const isActive = userOnDb.isActive;
      return res.send(routeResponse(false, isActive ? "User already exists" : "User deactivated"));
    }
    const newUser = new User();
    newUser.email = email;
    newUser.fullName = fullName;
    newUser.password = await bcrypt.hash(password, 10);
    await userRepository.save(newUser);

    res.send(routeResponse(true, `${newUser.email} has been created`, signToken(newUser.id)));
  } catch (error) {
    const reason = handleError(error);
    res.send(routeResponse(false, reason));
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send(routeResponse(false, "Missing data"));
    return;
  }
  try {
    const userOnDB = await userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    if (!userOnDB) {
      res.send(routeResponse(false, "User doesn't exists"));
      return;
    }
    if (userOnDB.isActive === false) {
      console.log(userOnDB.isActive);
      return res.send(routeResponse(false, "User deactivated"));
    }
    const samePassword = await bcrypt.compare(password, userOnDB.password);
    if (!samePassword) {
      res.send(routeResponse(false, "Wrong password"));
      return;
    }
    res.send(routeResponse(true, "Login successful", signToken(userOnDB.id)));
  } catch (error) {
    const reason = handleError(error);
    res.send(routeResponse(false, reason));
  }
});

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
