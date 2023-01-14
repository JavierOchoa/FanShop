import { Router } from "express";
import passport from "passport";
import { User } from "../../../appDataSource/entity";

export const userInfoRouter = Router();

userInfoRouter.get("/info", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { email, fullName, isActive, roles } = req.user as User;
  res.send({ email, fullName, isActive, roles });
});
