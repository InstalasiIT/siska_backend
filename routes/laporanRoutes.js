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

  laporanRoutes.post(
    "/rekap/naik-kelas/:page/:rows",
    authMiddleware,
    controller.naikKelasDatatable()
  );

  laporanRoutes.put(
    "/rekap/naik-kelas",
    authMiddleware,
    controller.editDataNaikKelas(),
  );

  laporanRoutes.put(
    "/rekap/kelas-full",
    authMiddleware,
    controller.editDataKelasFull(),
  );

  laporanRoutes.delete(
    "/rekap/naik-kelas/:id",
    authMiddleware,
    controller.hapusDataNaikKelas(),
  );

  laporanRoutes.delete(
    "/rekap/kelas-full/:id",
    authMiddleware,
    controller.hapusDataKelasFull(),
  );

  return laporanRoutes;
}
