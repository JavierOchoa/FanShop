import { Router } from "express";
import passport from "passport";
import { Address, User } from "../../../appDataSource/entity";
import { routeResponse } from "..";
import { addressRepository, userRepository } from "../../../appDataSource";
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
        return res.send(routeResponse(false, "Incorrect Password"));
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

accountRouter.post(
  "/address/new",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.user as User;
    const { fullName, address, phone, city, state, country } = req.body;
    try {
      const userOnDb = await userRepository.findOne({ where: { id } });
      if (!userOnDb) {
        return res.send(routeResponse(false, "User Not Found"));
      }
      const newAddress = new Address();
      newAddress.fullName = fullName;
      newAddress.address = address;
      newAddress.phone = phone;
      newAddress.city = city;
      newAddress.state = state;
      newAddress.country = country;
      newAddress.user = userOnDb;
      await addressRepository.save(newAddress);
      res.send(routeResponse(true, "Address successfully created"));
    } catch (e) {
      res.send(routeResponse(false, (e as Error).message));
    }
  }
);

accountRouter.post(
  "/address/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id: userId } = req.user as User;
    const { id } = req.params;
    try {
      const addressOnDb = await addressRepository.findOne({
        where: { id },
        relations: { user: true },
      });
      if (!addressOnDb) return res.send(routeResponse(false, "No Address Found"));
      if (addressOnDb.user.id !== userId) {
        return res.status(401).send(routeResponse(false, "Address owner mismatch"));
      }
      await addressRepository
        .createQueryBuilder("address")
        .delete()
        .from(Address)
        .where("id = :id", { id })
        .execute();
      res.send(routeResponse(true, "Address successfully deleted"));
    } catch (e) {
      res.send(routeResponse(false, (e as Error).message));
    }
  }
);

accountRouter.post(
  "/address/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id: userId } = req.user as User;
    const { id, fullName, address, phone, city, state, country } = req.body;
    try {
      const addressOnDb = await addressRepository.findOne({
        where: { id },
        relations: { user: true },
      });
      if (!addressOnDb) return res.send(routeResponse(false, "No Address Found"));
      if (addressOnDb.user.id !== userId) {
        return res.status(401).send(routeResponse(false, "Address owner mismatch"));
      }
      addressOnDb.fullName = fullName;
      addressOnDb.address = address;
      addressOnDb.phone = phone;
      addressOnDb.city = city;
      addressOnDb.state = state;
      addressOnDb.country = country;
      await addressRepository.save(addressOnDb);
      res.send(routeResponse(true, "Address successfully updated"));
    } catch (e) {
      res.send(routeResponse(false, (e as Error).message));
    }
  }
);
