import laporanController from "../controller/laporanController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

export default function userRoute() {
  const controller = new laporanController();
  const laporanRoutes = express.Router();

  laporanRoutes.post(
    "/rekap/get-data/:page/:rows",
    authMiddleware,
    controller.laporanDatatable()
  );

  return laporanRoutes;
}
