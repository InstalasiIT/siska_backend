import userController from "../controller/userController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

export default function userRoute() {
  const controller = new userController();
  const userRoutes = express.Router();

  userRoutes.get("/user/auth-me", authMiddleware, controller.authMe());
  userRoutes.get("/user/permit-me", authMiddleware, controller.permitMe());

  return userRoutes;
}
