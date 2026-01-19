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

}
