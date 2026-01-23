import formController from "../controller/formController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
// import upload from "../middleware/uploadMiddleware.js";

export default function userRoute() {
  const controller = new formController();
  const formRoutes = express.Router();

  formRoutes.get(
    "/naik-kelas/get-datapasien/:no_bpjs",
    authMiddleware,
    controller.getPasien()
  );
  formRoutes.get(
    "/naik-kelas/get-pasien/:no_bpjs",
    authMiddleware,
    controller.getDataPasien(),
  );
  formRoutes.get(
    "/naik-kelas/get-kelas",
    authMiddleware,
    controller.getKelas()
  );
  formRoutes.post(
    "/naik-kelas/save",
    authMiddleware,
    controller.save()
  );
  formRoutes.post(
    "/rawat-inap-penuh/save",
    authMiddleware,
    controller.saveKelasPenuh()
  );

  return formRoutes;
}
