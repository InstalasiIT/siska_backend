import laporanService from "../application/services/laporanService.js";
import response from "../utils/response.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";


export default class laporanController {
  constructor() {
    this.services = new laporanService();
  }

  laporanDatatable() {
    return async (req, res, next) => {
      try {
        const {page, rows} = req.params
        const offset = (page - 1) * rows

        const {q, sort} = req.body
        const id_user = req.user?.id || 1453;

        const data = await this.services.laporanDatatable(id_user, parseInt(rows), offset, q, sort);

        let total = await this.services.laporanDatatable(
          id_user,
          "",
          "",
          q,
          sort
        );
        response(200, "success", { data, total}, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  naikKelasDatatable() {
    return async (req, res, next) => {
      try {
        const {page, rows} = req.params
        const offset = (page - 1) * rows

        const {q, sort} = req.body
        const id_user = req.user?.id || 1453;

        const data = await this.services.naikKelasDatatable(id_user, parseInt(rows), offset, q, sort);

        let total = await this.services.naikKelasDatatable(
          id_user,
          "",
          "",
          q,
          sort
        );
        response(200, "success", { data, total}, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  editDataNaikKelas() {
    return async (req, res, next) => {
      try {
        let id = req.body.id;
        let kelas_sebelumnya = req.body.kelas_sebelumnya;
        let kelas_setelahnya = req.body.kelas_setelahnya;

        const results = this.services.editNaikKelas(
          id,
          kelas_sebelumnya,
          kelas_setelahnya,
        );

        console.log(results);

        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  editDataKelasFull() {
    return async (req, res, next) => {
      try {
        let id = req.body.id;
        let kelas_sebelumnya = req.body.kelas_sebelumnya;
        let kelas_setelahnya = req.body.kelas_setelahnya;
        let ruang_sebelumnya = req.body.ruang_sebelumnya;
        let ruang_setelahnya = req.body.ruang_setelahnya;

        const results = await this.services.editKelasPenuh(
          id,
          kelas_sebelumnya,
          kelas_setelahnya,
          ruang_sebelumnya,
          ruang_setelahnya,
        );
        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  hapusDataNaikKelas() {
    return async (req, res, next) => {
      try {
        const id = req.params.id
      

        const data = await this.services.hapus(id, "history_naik_kelas");

        response(200, "success", data, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  hapusDataKelasFull() {
    return async (req, res, next) => {
      try {
        const id = req.params.id
      

        const data = await this.services.hapus(id, "history_kelas_full");

        response(200, "success", data, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

}
