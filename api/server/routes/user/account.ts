import { Router } from "express";
import passport from "passport";
import { User } from "../../../appDataSource/entity";
import { routeResponse } from "..";
import { userRepository } from "../../../appDataSource";
import bcrypt from "bcrypt";

export const accountRouter = Router();

accountRouter.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const { fullName, email, newPassword, currentPassword } = req.body;

    try {
      const userOnDb = await userRepository.findOne({
        where: { id: user.id },
        select: { id: true, password: true },
      });

      if (!userOnDb) return;
      const samePassword = await bcrypt.compare(currentPassword, userOnDb.password);
      if (!samePassword) {
        throw new Error("Incorrect Password");
      }
      if (fullName) {
        userOnDb.fullName = fullName;
      }
      if (email) {
        userOnDb.email = email;
      }
      if (newPassword) {
        userOnDb.password = await bcrypt.hash(newPassword, 10);
      }
      await userRepository.save(userOnDb);
      res.send(routeResponse(true, "User updated"));
    } catch (e) {
      res.send(routeResponse(false, (e as Error).message));
    }
  }
);
