import EndpointGenerator from "./utils/endPointGenerator.js";

new EndpointGenerator({
  name: {
    fileName: "agama",
    route: "agama",
  },
  table: {
    tableName: "master_agama",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "statusPernikahan",
    route: "status_pernikahan",
  },
  table: {
    tableName: "master_status_pernikahan",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "golonganDarah",
    route: "golongan_darah",
  },
  table: {
    tableName: "master_golongan_darah",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "propinsi",
    route: "propinsi",
  },
  table: {
    tableName: "master_propinsi",
    tableColumn: [
      { name: "kd_propinsi", type: "integer" },
      { name: "nama_propinsi", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "kabupaten",
    route: "kabupaten",
  },
  table: {
    tableName: "master_kabupaten",
    tableColumn: [
      { name: "kd_kabupaten", type: "integer" },
      { name: "kd_propinsi", type: "integer" },
      { name: "nama_kabupaten", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "kecamatan",
    route: "kecamatan",
  },
  table: {
    tableName: "master_kecamatan",
    tableColumn: [
      { name: "kd_kecamatan", type: "integer" },
      { name: "kd_kabupaten", type: "integer" },
      { name: "nama_kecamatan", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "kelurahan",
    route: "kelurahan",
  },
  table: {
    tableName: "master_kelurahan",
    tableColumn: [
      { name: "kd_kelurahan", type: "integer" },
      { name: "kd_kecamatan", type: "integer" },
      { name: "nama_kelurahan", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jenisKelamin",
    route: "jenis_kelamin",
  },
  table: {
    tableName: "master_jenis_kelamin",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "statusKaryawan",
    route: "status_karyawan",
  },
  table: {
    tableName: "master_status_karyawan",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "pangkatGolongan",
    route: "pangkat_golongan",
  },
  table: {
    tableName: "master_pangkat_golongan",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jenisTenaga",
    route: "jenis_tenaga",
  },
  table: {
    tableName: "master_jenis_tenaga",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jenisPendidikan",
    route: "jenis_pendidikan",
  },
  table: {
    tableName: "master_jenis_pendidikan",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jenisJabatan",
    route: "jenis_jabatan",
  },
  table: {
    tableName: "master_jenis_jabatan",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jenisDetailTenaga",
    route: "jenis_detail_tenaga",
  },
  table: {
    tableName: "master_jenis_detail_tenaga",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jabatanSk",
    route: "jabatan_sk",
  },
  table: {
    tableName: "master_jabatan_sk",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "jabatan",
    route: "jabatan",
  },
  table: {
    tableName: "master_jabatan",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "aplikasi",
    route: "aplikasi",
  },
  table: {
    tableName: "aplikasi",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "icon", type: "string" },
      { name: "title", type: "string" },
      { name: "link", type: "string" },
      { name: "link_api", type: "string" },
    ],
  },
});

new EndpointGenerator({
  name: {
    fileName: "suku",
    route: "suku",
  },
  table: {
    tableName: "master_suku",
    tableColumn: [
      { name: "uuid", type: "string" },
      { name: "nama", type: "string" },
    ],
  },
});
