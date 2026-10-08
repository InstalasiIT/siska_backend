import formController from "../controller/formController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
// import upload from "../middleware/uploadMiddleware.js";

export default function userRoute() {
  const controller = new formController();
  const formRoutes = express.Router();

  formRoutes.get("/naik-kelas/get-datapasien/:no_bpjs", controller.getPasien());
  formRoutes.get("/naik-kelas/get-pasien/:no_bpjs", controller.getDataPasien());
  formRoutes.get("/naik-kelas/get-kelas", controller.getKelas());
  formRoutes.post("/naik-kelas/save", controller.save());
  formRoutes.post("/rawat-inap-penuh/save", controller.saveKelasPenuh());

  return formRoutes;
}
