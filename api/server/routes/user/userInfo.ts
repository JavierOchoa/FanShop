import { Router } from "express";
import passport from "passport";
import { User } from "../../../appDataSource/entity";

export const userInfoRouter = Router();

userInfoRouter.get("/info", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { fullName, email } = req.user as User;

  res.send({
    fullName: fullName,
    email: email,
  });
});
