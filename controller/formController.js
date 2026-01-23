import e from "cors";
import formService from "../application/services/formService.js";
import response from "../utils/response.js";
import fs from "fs";
import path from "path";
import multer from "multer";


export default class formController {
  constructor() {
    this.services = new formService();
  }

  formatRM(value) {
    const hurufAngka = /^([A-Z]+)(\d+)$/i;
    const match = value.match(hurufAngka);

    if (match) {
      return `${match[1]}-${match[2]}`;
    }

    // jika hanya angka
    if (/^\d+$/.test(value)) {
      const result = [];
      let s = value;

      while (s.length > 2) {
        result.unshift(s.slice(-2));
        s = s.slice(0, -2);
      }

      if (s.length > 0) {
        result.unshift(s);
      }

      return result.join("-");
    }

    return value;
  }

  getPasien() {
    return async (req, res, next) => {
      try {
        const no_bpjs = String(req.params.no_bpjs || "");

        let bpjs = no_bpjs;
        if (no_bpjs.length < 10) {
          bpjs = this.formatRM(no_bpjs);
        }

        const results = await this.services.pasienByNoBpjs(bpjs);
        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  getDataPasien() {
    return async (req, res, next) => {
      try {
        const no_bpjs = String(req.params.no_bpjs || "");

        let bpjs = no_bpjs;
        if (no_bpjs.length < 10) {
          bpjs = this.formatRM(no_bpjs);
        }

        const results = await this.services.getDataPasien(bpjs);
        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  getKelas() {
    return async (req, res, next) => {
      try {
        const results = await this.services.kelas();
        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  async getYMD() {
    const d = new Date();

    return {
      year: String(d.getFullYear()),
      month: String(d.getMonth() + 1).padStart(2, "0"),
      day: String(d.getDate()).padStart(2, "0"),
    };
  }

  async uploadImage(image) {
    const matches = image.match(/^data:(.+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return "Gambar tidak valid";
    }

    const mimeType = matches[1];
    let base64Data = matches[2].replace(/\s/g, "");

    const sizeInMB = (base64Data.length * 3) / 4 / 1024 / 1024;
    if (sizeInMB > 10) {
      throw new Error("Ukuran gambar maksimal 10MB");
    }

    let ext = mimeType.split("/")[1].toLowerCase();
    if (ext === "jpeg") ext = "jpg";

    const fileName = `image_${Date.now()}.${ext}`;

    const { year, month, day } = await this.getYMD();

    const baseDir = path.resolve(
      "assets",
      "images",
      String(year),
      String(month),
      String(day),
    );

    fs.mkdirSync(baseDir, { recursive: true });
    const savePath = path.join(baseDir, fileName);
    fs.writeFileSync(savePath, Buffer.from(base64Data, "base64"));

    return savePath.split("\\siska_backend\\")[1];
  }

  save() {
    return async (req, res, next) => {
      try {
        let no_bpjs = req.body.no_rm;
        let no_rm = no_bpjs;
        if (no_bpjs.length < 10) {
          no_rm = this.formatRM(no_bpjs);
        }
        let nama = req.body.nama;
        let alamat = req.body.alamat;
        let tempat_lahir = req.body.tempat_lahir;
        let tanggal_lahir = req.body.tanggal_lahir;
        let kelas_sebelumnya = req.body.kelas_sebelumnya;
        let kelas_setelahnya = req.body.kelas_setelahnya;
        let saksi = req.body.saksi;
        let keluarga_pasien = req.body.keluarga_pasien;
        let ttd_petugas = req.body.ttd_petugas;
        let no_hp = req.body.hp;
        let hubungan = req.body.hubungan;
        // let umur = req.body.umur;

        let path_ttd_saksi = await this.uploadImage(saksi.ttd);
        let path_ttd_keluarga = await this.uploadImage(keluarga_pasien.ttd);
        let path_ttd_petugas = await this.uploadImage(ttd_petugas);

        let username = req.body.username;
        let password = req.body.password;

        let cek = await this.services.cekUser(username, password);

        let pasien = await this.services.pasienByNoBpjs(no_rm);
        pasien = pasien.data[0];

        if (Object.keys(cek.data).length > 0) {
          const id_user = cek.data.id;
          const nama_petugas = cek.data.nama;

          const results = this.services.saveNaikKelas(
            id_user,
            pasien.no_medicalrecord,
            nama,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            kelas_sebelumnya,
            kelas_setelahnya,
            pasien.nama_pasien,
            pasien.tempat_lahir,
            pasien.tanggal_lahir,
            pasien.alamat,
            saksi.nama,
            path_ttd_saksi,
            keluarga_pasien.nama,
            path_ttd_keluarga,
            path_ttd_petugas,
            nama_petugas,
            no_hp,
            hubungan,
          );

          response(200, "success", results, res);
        } else {
          response(500, "GAGAL", cek, res);
        }
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }

  saveKelasPenuh() {
    return async (req, res, next) => {
      try {
        let no_bpjs = req.body.no_rm;
        let no_rm = no_bpjs;
        if (no_bpjs.length < 10) {
          no_rm = this.formatRM(no_bpjs);
        }
        let nama = req.body.nama;
        let alamat = req.body.alamat;
        let tempat_lahir = req.body.tempat_lahir;
        let tanggal_lahir = req.body.tanggal_lahir;
        let kelas_sebelumnya = req.body.kelas_sebelumnya;
        let kelas_setelahnya = req.body.kelas_setelahnya;
        let ruang_sebelumnya = req.body.ruang_sebelumnya;
        let ruang_setelahnya = req.body.ruang_setelahnya;
        let saksi = req.body.saksi;
        let keluarga_pasien = req.body.keluarga_pasien;
        let ttd_petugas = req.body.ttd_petugas;
        let no_hp = req.body.hp;
        let hubungan = req.body.hubungan;
        // let umur = req.body.umur;

        let path_ttd_saksi = await this.uploadImage(saksi.ttd);
        let path_ttd_keluarga = await this.uploadImage(keluarga_pasien.ttd);
        let path_ttd_petugas = await this.uploadImage(ttd_petugas);

        let username = req.body.username;
        let password = req.body.password;

        let cek = await this.services.cekUser(username, password);

        let pasien = await this.services.pasienByNoBpjs(no_rm);
        pasien = pasien.data[0];

        if (Object.keys(cek.data).length > 0) {
          const id_user = cek.data.id;
          const nama_petugas = cek.data.nama;
          const results = await this.services.saveKelasPenuh(
            id_user,
            pasien.no_medicalrecord,
            nama,
            tempat_lahir,
            tanggal_lahir,
            alamat,
            kelas_sebelumnya,
            kelas_setelahnya,
            ruang_sebelumnya,
            ruang_setelahnya,
            pasien.nama_pasien,
            pasien.tempat_lahir,
            pasien.tanggal_lahir,
            pasien.alamat,
            saksi.nama,
            path_ttd_saksi,
            keluarga_pasien.nama,
            path_ttd_keluarga,
            path_ttd_petugas,
            nama_petugas,
            no_hp,
            hubungan,
          );
          response(200, "success", results, res);
        } else {
          response(500, "GAGAL", cek, res);
        }
      } catch (error) {
        response(500, "error", error.message, res);
      }
    };
  }
}

