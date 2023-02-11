import { Router } from "express";
import passport from "passport";
import { User } from "../../../appDataSource/entity";
import { routeResponse } from "../index";
import { userRepository } from "../../../appDataSource";

export const userInfoRouter = Router();

userInfoRouter.get("/info", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { email, fullName, isActive, roles } = req.user as User;
  res.send({ email, fullName, isActive, roles });
});

userInfoRouter.get(
  "/addresses",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.user as User;

    try {
      const userInformation = await userRepository.findOne({
        where: { id },
        relations: { addresses: true },
      });
      res.send(routeResponse(true, "User addresses fetched", userInformation?.addresses));
    } catch (err) {
      res.send(routeResponse(false, (err as Error).message));
    }
  }
);
