import CommonFunction from "./common.js";

export default class queryHelper {
  constructor(Connection) {
    this.db = Connection;
    this.common = new CommonFunction();
  }

  async raw(options = {}) {
    const query = options.query;
    return await this.db.query(query, {
      replacements: options.replacements,
      type: options.type,
      transaction: options.t || null,
    });
  }

  async select(options = {}) {
    let softDelete =
      options.softDelete !== undefined ? options.softDelete : true;
    if (softDelete) {
      let q = options.query;

      if (/where/i.test(q)) {
        q = q.replace(/where/i, "WHERE deleted_at IS NULL AND");
      } else {
        q = q.replace(/(limit|group|offset)/i, "WHERE deleted_at IS NULL $1");

        if (q === options.query) {
          q += " WHERE deleted_at IS NULL";
        }
      }

      options.query = q;
    }

    let results = await this.db.query(options.query, {
      replacements: options.replacements || {},
      type: this.db.QueryTypes.SELECT,
      transaction: options.t || null,
    });

    return results;
  }

  async update(options = {}) {
    const data = options.replacements || {};
    const where = options.where || {};

    const setKeys = Object.keys(data);
    const setClause = setKeys.map((col) => `${col} = ?`).join(", ");
    const setValues = Object.values(data);

    const whereKeys = Object.keys(where);
    const whereClause = whereKeys.map((col) => `${col} = ?`).join(" AND ");
    const whereValues = Object.values(where);

    const query = `
    UPDATE ${options.table}
    SET ${setClause}
    WHERE ${whereClause}
  `;

    return await this.db.query(query, {
      replacements: [...setValues, ...whereValues],
      type: this.db.QueryTypes.UPDATE,
      transaction: options.t || null,
    });
  }

  async insert(options = {}) {

    console.log(options)
    const data = options.replacements;

    const keys = Object.keys(data);
    const columns = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const values = Object.values(data);

    const query = `
    INSERT INTO ${options.table} (${columns})
    VALUES (${placeholders})
  `;

    return await this.db.query(query, {
      replacements: values,
      type: this.db.QueryTypes.INSERT,
      transaction: options.t || null,
    });
  }
}
