import connection_evo from "../../frameworks/database/postgress/connection_evo.js";
import connection_syamrabu from "../../frameworks/database/postgress/connection_mysyamrabu.js";

import connection from "../../frameworks/database/postgress/connection.js";
import queryHelper from "../../utils/queryHelper.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, verifyPassword } from "../../utils/encryptPassword.js";
import CommonFunction from "../../utils/common.js";

export default class formService {
  constructor() {
    this.db_syamrabu = new queryHelper(connection_syamrabu.sequelize);
    this.CommonFunction = new CommonFunction(connection_syamrabu.sequelize);
    this.db_evo = new queryHelper(connection_evo.sequelize);
    this.db = new queryHelper(connection.sequelize);
  }

  async pasienByNoBpjs(bpjs) {
    const dataPasien = await this.db_evo.select({
      query: `select * from pasien where no_bpjs = :bpjs or no_medicalrecord = :bpjs`,
      replacements: { bpjs },
      softDelete: false,
    });

    return {
      data: dataPasien,
    };
  }

  async getDataPasien(nomor) {
    const pasien = await this.db_evo.select({
      query: `SELECT a.no_medicalrecord,p.nama_pasien,p.tempat_lahir,p.tanggal_lahir,p.no_bpjs,p.alamat,
          	cast(a.tgl_masuk as date) as tgl_masuk,
						cast(a.tgl_keluar as date) as tgl_keluar,
						CAST ( A.tgl_keluar_rm AS DATE ) AS tgl_keluar_rm,
						a.NO_REGISTRASIKUNJUNGAN
            from kunjungan a
            inner join transaksi e on e.no_registrasikunjungan = a.no_registrasikunjungan
						left join pasien p on p.no_medicalrecord = a.no_medicalrecord
            where 1=1 and substr(e.no_transaksi,1,2) in ('01', '02', '03','04','07','06') and (A .STATUS = 0 or a.status is null) and (p.no_medicalrecord = :nomor or p.no_bpjs = :nomor) and a.tgl_keluar_rm is null and a.tgl_keluar is null group by a.no_medicalrecord,a.tgl_masuk,a.tgl_keluar,a.no_registrasikunjungan,p.nama_pasien,p.tempat_lahir,p.tanggal_lahir,p.no_bpjs,p.alamat`,
      replacements: { nomor },
      softDelete: false,
    });

    return {
      data: pasien,
    };
  }

  async kelas() {
    const dataKelas = await this.db_evo.select({
      query: `select distinct on (nama_ruangperawatan) kd_ruangperawatan, nama_ruangperawatan as nama
      from ruang_perawatan where nama_ruangperawatan != '-' and nama_ruangperawatan != '1'`,
      replacements: {},
      softDelete: false,
    });


    return {
      data: dataKelas,
    };
  }

  async getkelas() {
    const dataKelas = await this.db_evo.select({
      query: `select rp.kd_ruangperawatan, rp.nama_ruangperawatan, kp.kd_kelasperawatan, kp.nama_kelasperawatan, kmp.kd_kamarperawatan, kmp.nama_kamarperawatan, dk.status
      from ruang_perawatan rp left join kelas_perawatan kp on rp.kd_kelasperawatan = kp.kd_kelasperawatan left join kamar_perawatan kmp on rp.kd_ruangperawatan = kmp.kd_ruangperawatan left join detail_kamarperawatan dk on dk.kd_kamarperawatan = kmp.kd_kamarperawatan where dk.status = '0'`,
      replacements: {},
      softDelete: false,
    });

    const hasil = dataKelas.map((item) => ({
      kd_ruangperawatan: item.kd_ruangperawatan,
      kd_kelasperawatan: item.kd_kelasperawatan,
      kd_kamarperawatan: item.kd_kamarperawatan,
      ruang_pilihan: `${item.nama_ruangperawatan}`,
      nama: `${item.nama_ruangperawatan} (${item.nama_kamarperawatan}) - ${item.nama_kelasperawatan}`,
      status: item.status,
    }));

    return {
      data: hasil,
    };
  }

  async cekUser(username, password) {
    try {
      const user = await this.db_syamrabu.select({
        query: `select u.id, u.username, u.password, p.nama from users u left join pegawai p on p.id = u.id_pegawai left join user_aplikasi ua on ua.id_user = u.id where username = :username and ua.id_aplikasi = 5`,
        replacements: { username },
        softDelete: false,
      });

      if (user.length > 0) {
        let verify = await verifyPassword(password, user[0].password);
        if (verify) {
          return {
            data: user[0],
          };
        }
      }else{
        return false
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  hitungUmur(tanggalLahir) {
    const today = new Date();
    const birthDate = new Date(tanggalLahir);

    let umur = today.getFullYear() - birthDate.getFullYear();
    const bulanSekarang = today.getMonth();
    const bulanLahir = birthDate.getMonth();

    // Kurangi 1 tahun jika belum ulang tahun di tahun ini
    if (
      bulanSekarang < bulanLahir ||
      (bulanSekarang === bulanLahir && today.getDate() < birthDate.getDate())
    ) {
      umur--;
    }

    return umur;
  }

  async saveNaikKelas(
    id_user,
    no_rm,
    nama,
    tempat_lahir,
    tanggal_lahir,
    alamat,
    kelas_sebelumnya,
    kelas_setelahnya,
    nama_pasien,
    tempat_lahir_pasien,
    tanggal_lahir_pasien,
    alamat_pasien,
    nama_saksi,
    path_ttd_saksi,
    keluarga_pasien,
    path_ttd_keluarga,
    path_ttd_petugas,
    nama_petugas,
    no_hp,
    hubungan,
  ) {
    try {
      const uuid = uuidv4();
      console.log(uuid);

      const date = await this.CommonFunction.getNowDate();
      await this.db.insert({
        table: "history_naik_kelas",
        replacements: {
          uuid: uuid,
          id_user: id_user,
          nama: nama,
          tempat_lahir: tempat_lahir,
          tanggal_lahir: tanggal_lahir,
          no_rm: no_rm,
          alamat: alamat,
          kelas_sebelumnya: kelas_sebelumnya,
          kelas_setelahnya: kelas_setelahnya,
          alamat_pasien: alamat_pasien,
          nama_pasien: nama_pasien,
          tempat_lahir_pasien: tempat_lahir_pasien,
          tanggal_lahir_pasien: tanggal_lahir_pasien,
          nama_saksi: nama_saksi,
          ttd_saksi: path_ttd_saksi,
          nama_keluarga: keluarga_pasien,
          ttd_keluarga: path_ttd_keluarga,
          ttd_petugas: path_ttd_petugas,
          nama_petugas: nama_petugas,
          no_hp: no_hp,
          hubungan: hubungan,
          created_at: date,
        },
      });

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  async saveKelasPenuh(
    id_user,
    no_rm,
    nama,
    tempat_lahir,
    tanggal_lahir,
    alamat,
    kelas_sebelumnya,
    kelas_setelahnya,
    ruang_sebelumnya,
    ruang_setelahnya,
    nama_pasien,
    tempat_lahir_pasien,
    tanggal_lahir_pasien,
    alamat_pasien,
    nama_saksi,
    path_ttd_saksi,
    keluarga_pasien,
    path_ttd_keluarga,
    path_ttd_petugas,
    nama_petugas,
    no_hp,
    hubungan,
  ) {
    const uuid = uuidv4();

    const date = await this.CommonFunction.getNowDate();
    await this.db.insert({
      table: "history_kelas_full",
      replacements: {
        uuid: uuid,
        id_user: id_user,
        nama: nama,
        tempat_lahir: tempat_lahir,
        tanggal_lahir: tanggal_lahir,
        no_rm: no_rm,
        alamat: alamat,
        kelas_sebelumnya: kelas_sebelumnya,
        kelas_setelahnya: kelas_setelahnya,
        ruang_sebelumnya: ruang_sebelumnya,
        ruang_setelahnya: ruang_setelahnya,
        alamat_pasien: alamat_pasien,
        nama_pasien: nama_pasien,
        tempat_lahir_pasien: tempat_lahir_pasien,
        tanggal_lahir_pasien: tanggal_lahir_pasien,
        nama_saksi: nama_saksi,
        ttd_saksi: path_ttd_saksi,
        nama_keluarga: keluarga_pasien,
        ttd_keluarga: path_ttd_keluarga,
        ttd_petugas: path_ttd_petugas,
        nama_petugas: nama_petugas,
        no_hp: no_hp,
        hubungan: hubungan,
        created_at: date,
      },
    });

    return true;
  }
}
