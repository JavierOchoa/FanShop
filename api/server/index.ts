import express from "express";
import cors from "cors";
import { routes } from "./routes";
import passport from "passport";

export const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(passport.initialize());

require("./config/passport");

server.use("/", routes);
