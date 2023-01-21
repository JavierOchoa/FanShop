import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { userRepository } from "../../../appDataSource";
import { User } from "../../../appDataSource/entity";

export const usersAdminRouter = Router();

usersAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user as User;

  if (!user.roles.includes("admin")) {
    res.status(401).send({
      successful: false,
      message: "Unauthorized",
    });
    return;
  }
  try {
    const usersOnDb = await userRepository.find();
    res.send(usersOnDb);
  } catch (err) {
    res.send({
      successful: false,
      message: (err as Error).message,
    });
  }
});

usersAdminRouter.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { email, fullName, password, roles } = req.body;
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.status(401).send({
        successful: false,
        message: "Unauthorized",
      });
      return;
    }
    try {
      const newUser = new User();
      newUser.email = email;
      newUser.fullName = fullName;
      newUser.password = await bcrypt.hash(password, 10);
      newUser.roles = roles;
      await userRepository.save(newUser);
      res.send(responseRouter(true, "User Created"));
    } catch (err) {
      handleError(err);
    }
  }
);

usersAdminRouter.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id, fullName, email, roles } = req.body;
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.status(401).send({
        successful: false,
        message: "Unauthorized",
      });
      return;
    }
    if (!id) {
      res.send({
        successful: false,
        message: "User ID missing",
      });
      return;
    }
    if (
      !/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(fullName) ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) ||
      roles.length < 1
    ) {
      res.send({
        successful: false,
        message: "Missing information or Wrong data.",
      });
      return;
    }
    try {
      const userOnDb = await userRepository.findOne({ where: { id } });
      if (!userOnDb) {
        res.send({
          successful: false,
          message: `No user found with ID: ${id}`,
        });
        return;
      }
      userOnDb.fullName = fullName;
      userOnDb.email = email;
      userOnDb.roles = roles;
      await userRepository.save(userOnDb);
      res.send({
        successful: true,
        message: `User ${id} has been updated successfully`,
      });
    } catch (err) {
      res.send({
        successful: false,
        message: (err as Error).message,
      });
      return;
    }
  }
);

usersAdminRouter.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user as User;
  const { id } = req.params;
  if (!user.roles.includes("admin")) {
    res.status(401).send({
      successful: false,
      message: "Unauthorized",
    });
    return;
  }
  try {
    const userOnDb = await userRepository.findOne({ where: { id } });
    if (!userOnDb) {
      res.status(400).send({
        successful: false,
        message: `No user with ID: ${id}`,
      });
      return;
    }
    res.send(userOnDb);
  } catch (err) {
    res.send({
      successful: false,
      message: (err as Error).message,
    });
  }
});

usersAdminRouter.patch(
  "/activate/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const { id } = req.params;
    if (!user.roles.includes("admin")) {
      res.status(401).send({
        successful: false,
        message: "Unauthorized",
      });
    }
    try {
      const userOnDb = await userRepository.findOne({ where: { id } });
      if (!userOnDb) {
        res.send({
          successful: false,
          message: `No user with ID: ${id}`,
        });
        return;
      }
      userOnDb.isActive = true;
      userRepository.save(userOnDb);
      res.send({
        successful: true,
        message: `User with ID: ${id} is now inactive`,
      });
    } catch (err) {
      res.send({
        successful: true,
        message: (err as Error).message,
      });
    }
  }
);

usersAdminRouter.patch(
  "/deactivate/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const { id } = req.params;
    if (!user.roles.includes("admin")) {
      res.status(401).send({
        successful: false,
        message: "Unauthorized",
      });
    }
    try {
      const userOnDb = await userRepository.findOne({ where: { id } });
      if (!userOnDb) {
        res.send({
          successful: false,
          message: `No user with ID: ${id}`,
        });
        return;
      }
      userOnDb.isActive = false;
      userRepository.save(userOnDb);
      res.send({
        successful: true,
        message: `User with ID: ${id} is now inactive`,
      });
    } catch (err) {
      res.send({
        successful: true,
        message: (err as Error).message,
      });
    }
  }
);

usersAdminRouter.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const { id } = req.params;
    if (!user.roles.includes("admin")) {
      res.status(401).send({
        successful: false,
        message: "Unauthorized",
      });
    }
    try {
      const userOnDb = await userRepository.findOne({ where: { id } });
      if (!userOnDb) {
        res.send({
          successful: false,
          message: `No user with ID: ${id}`,
        });
        return;
      }
      await userRepository
        .createQueryBuilder("user")
        .delete()
        .from(User)
        .where("id = :id", { id })
        .execute();

      res.send({
        successful: true,
        message: `User with ID: ${id} has been deleted`,
      });
    } catch (err) {
      res.send({
        successful: true,
        message: (err as Error).message,
      });
    }
  }
);

const responseRouter = (successful: boolean, message: string) => {
  return {
    successful,
    message,
  };
};

const handleError = (error: any) => {
  if (error.code === "23505") {
    return "User already exists";
  }
  console.log(error);
  return "Unknown error, please check console";
};
