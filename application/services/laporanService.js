import { where } from "sequelize";
import connection from "../../frameworks/database/postgress/connection.js";
import queryHelper from "../../utils/queryHelper.js";
import CommonFunction from "../../utils/common.js";
CommonFunction

export default class laporanService {
  constructor() {
    this.db = new queryHelper(connection.sequelize);
    this.common = new CommonFunction(connection.sequelize);
  }

  sortByKey(arr, key, order = "asc") {
    return [...arr].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (!isNaN(valA) && !isNaN(valB)) {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  sortByDate(arr, key, order = "asc") {
    return [...arr].sort((a, b) => {
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);

      return order === "asc"
        ? dateA - dateB
        : dateB - dateA;
    });
  }
  

  async laporanDatatable(id_user, limit, offset, q, sort) {
    let lim = ""
    let filter = ""
    if (q) {
      filter += ` AND nama ILIKE '%${q}%'
        OR nama_pasien ILIKE '%${q}%'
        OR no_bpjs ILIKE '%${q}%'
        OR alamat ILIKE '%${q}%'
        OR kelas_sebelumnya ILIKE '%${q}%'
        OR kelas_setelahnya ILIKE '%${q}%'`;
    }

    if (limit) {
      lim += "limit :limit offset :offset";
    }

    if(!limit){
      const dataLaporan = await this.db.select({
        query: `select * from history_kelas_full where id_user = :id_user ${filter}`,
        replacements: { id_user},
        softDelete: false,
      });

      return dataLaporan.length
    }
    
    
    const dataLaporan = await this.db.select({
      query: `select id, nama, alamat, tempat_lahir,tanggal_lahir, umur, no_hp, hubungan, kelas_sebelumnya, kelas_setelahnya, ruang_sebelumnya, ruang_setelahnya, no_rm, nama_pasien, tempat_lahir_pasien, tanggal_lahir_pasien, alamat_pasien, ttd_keluarga as ttd_keluarga_pasien, ttd_saksi, nama_saksi, ttd_petugas, nama_petugas, created_at from history_kelas_full where id_user = :id_user ${filter} ${lim}`,
      replacements: { id_user, limit, offset },
      softDelete: false,
    });

    let sorted = dataLaporan;
    if (sort.kolom == "tanggal_lahir") {
      sorted = this.sortByDate(dataLaporan, sort.kolom, sort.direction);
    }else if (sort.kolom!=""){
      sorted = this.sortByKey(dataLaporan, sort.kolom, sort.direction);
    }
    return sorted;
  }

  async naikKelasDatatable(id_user, limit, offset, q, sort) {
    let lim = ""
    let filter = ""
    if (q) {
      filter += ` AND nama ILIKE '%${q}%'
        OR nama_pasien ILIKE '%${q}%'
        OR no_rm ILIKE '%${q}%'
        OR alamat ILIKE '%${q}%'
        OR kelas_sebelumnya ILIKE '%${q}%'
        OR kelas_setelahnya ILIKE '%${q}%'`;
    }

    if (limit) {
      lim += "limit :limit offset :offset";
    }

    if(!limit){
      const dataLaporan = await this.db.select({
        query: `select * from history_naik_kelas where id_user = :id_user ${filter}`,
        replacements: { id_user},
        softDelete: false,
      });

      return dataLaporan.length
    }
    
    
    const dataLaporan = await this.db.select({
      query: `select id, nama, alamat, tempat_lahir,tanggal_lahir, umur, no_hp, hubungan, kelas_sebelumnya, kelas_setelahnya,  no_rm, nama_pasien, tempat_lahir_pasien, tanggal_lahir_pasien, alamat_pasien, ttd_keluarga as ttd_keluarga_pasien, ttd_saksi, nama_saksi, ttd_petugas, nama_petugas, created_at from history_naik_kelas where id_user = :id_user ${filter} ${lim}`,
      replacements: { id_user, limit, offset },
      softDelete: false,
    });

    let sorted = dataLaporan;
    if (sort.kolom == "tanggal_lahir") {
      sorted = this.sortByDate(dataLaporan, sort.kolom, sort.direction);
    }else if (sort.kolom!=""){
      sorted = this.sortByKey(dataLaporan, sort.kolom, sort.direction);
    }
    return sorted;
  }

  async editNaikKelas(
      id,
      kelas_sebelumnya,
      kelas_setelahnya,
    ) {
      try {

        console.log(id)

        const date = await this.common.getNowDate();

        console.log(date)
        await this.db.update({
          table: "history_naik_kelas",
          where : {id: id},
          replacements: {
            kelas_sebelumnya: kelas_sebelumnya,
            kelas_setelahnya: kelas_setelahnya,
            updated_at: date,
          },
        });
  
        return true;
      } catch (error) {
        console.log(error.message);
        return false;
      }
    }
  
  async editKelasPenuh(
    id,
    kelas_sebelumnya,
    kelas_setelahnya,
    ruang_sebelumnya,
    ruang_setelahnya,
  ) {

    const date = await this.common.getNowDate();
    console.log(date);
    await this.db.update({
      table: "history_kelas_full",
      where: { id: id },
      replacements: {
        kelas_sebelumnya: kelas_sebelumnya,
        kelas_setelahnya: kelas_setelahnya,
        ruang_sebelumnya: ruang_sebelumnya,
        ruang_setelahnya: ruang_setelahnya,
        updated_at: date,
      },
    });

    return true;
  }

  async hapus(id, dbTransaction) {
    await this.db.delete({
      table: dbTransaction,
      replacements: { id: id },
    });

    return true;
  }

}
