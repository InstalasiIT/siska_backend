import connection from "../../frameworks/database/postgress/connection.js";

export default class GenericServices {
  constructor() {
    this.sequelize = connection.sequelize;
  }

  async getAll(tableName) {
    if (!tableName) throw new AppError("Nama table harus ada!", 500);

    let query = `SELECT * FROM ${tableName}`;
    let results = await this.sequelize.query(query, {
      replacements: {},
      type: this.sequelize.QueryTypes.SELECT,
    });

    return results;
  }
}
