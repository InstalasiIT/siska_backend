import GenericServices from "../application/services/genericServices.js";
import config from "../config/config.js";
import connection from "../frameworks/database/postgress/connection.js";
import CommonFunction from "../utils/common.js";
import response from "../utils/response.js";
import { v4 as uuidv4 } from "uuid";

export default class GenericController {
  constructor() {
    this.services = new GenericServices();
    this.common = new CommonFunction();
    this.sequelize = connection.sequelize;
  }

  getAll(tableName) {
    return async (req, res, next) => {
      try {
        if (!tableName) throw new AppError("Nama table harus ada!", 500);
        let dataFromRedis = await this.common.cekRedis(
          `${tableName} :${config.redisName}`
        );

        if (dataFromRedis.status) {
          return response(
            200,
            "success",
            { status: true, data: dataFromRedis.data },
            res
          );
        }

        let query = `SELECT * FROM ${tableName}`;
        let results = await this.sequelize.query(query, {
          replacements: {},
          type: this.sequelize.QueryTypes.SELECT,
        });

        await this.common.setRedis(
          `${tableName} :${config.redisName}`,
          results
        );

        response(200, "success", results, res);
      } catch (error) {
        response(500, "error", { status: false, message: error.message }, res);
      }
    };
  }

  getByUuid(tableName) {
    return async (req, res, next) => {
      try {
        if (!tableName) throw new Error("Table name is required");
        const { id } = req.params;

        const query = `SELECT * FROM ${tableName} WHERE uuid = :id LIMIT 1`;
        const results = await this.sequelize.query(query, {
          replacements: { id },
          type: this.sequelize.QueryTypes.SELECT,
        });

        if (!results || results.length === 0) {
          return response(
            200,
            "error",
            { status: false, message: "Data tidak ditemukan" },
            res
          );
        }
        response(200, "success", { status: true, data: results[0] }, res);
      } catch (error) {
        response(500, "error", { status: false, message: error.message }, res);
      }
    };
  }

  create(tableName, timestamp = true) {
    return async (req, res, next) => {
      try {
        if (!tableName) throw new Error("Table name is required");
        const id = uuidv4();

        let data = {
          uuid: id,
          ...req.body,
          created_at: await this.common.getNowDate(true),
        };

        if (!timestamp) {
          data = { uuid: id, ...req.body };
        }

        const columns = Object.keys(data)
          .map((col) => col)
          .join(", ");
        const values = Object.values(data);
        const placeholders = values.map(() => "?").join(", ");

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

        await this.sequelize.query(query, {
          replacements: values,
          type: this.sequelize.QueryTypes.INSERT,
        });

        const [results] = await this.sequelize.query(
          `SELECT * FROM ${tableName}`
        );

        this.common.setRedis(`${tableName} :${config.redisName}`, results);

        response(201, "success", null, res);
      } catch (error) {
        response(200, "error", { status: false, message: error.message }, res);
      }
    };
  }

  update(tableName, timestamp = true) {
    return async (req, res, next) => {
      try {
        if (!tableName) throw new Error("Table name is required");

        const { id } = req.params;
        let data = {
          ...req.body,
          updated_at: await this.common.getNowDate(true),
        };
        if (!timestamp) {
          data = { ...req.body };
        }
        const keys = Object.keys(data);
        if (keys.length === 0) {
          return response(
            400,
            "error",
            {
              status: false,
              message: "Data yang diupdate tidak boleh kosong",
            },
            res
          );
        }

        const setClause = keys.map((col) => `${col} = ?`).join(", ");
        const values = Object.values(data);

        const query = `UPDATE ${tableName} SET ${setClause} WHERE uuid = ?`;

        const [result] = await this.sequelize.query(query, {
          replacements: [...values, id],
          type: this.sequelize.QueryTypes.UPDATE,
        });

        if (result.affectedRows === 0) {
          return response(
            404,
            "error",
            { status: false, message: "Data tidak ditemukan" },
            res
          );
        }

        const [resultsBaru] = await this.sequelize.query(
          `SELECT * FROM ${tableName}`
        );
        this.common.setRedis(`${tableName} :${config.redisName}`, resultsBaru);

        response(200, "suuccess", null, res);
      } catch (error) {
        response(200, "error", { status: false, message: error.message }, res);
      }
    };
  }

  removePermanent(tableName) {
    return async (req, res, next) => {
      try {
        if (!tableName) throw new Error("Table name is required");

        const { id } = req.params;

        const query = `DELETE FROM ${tableName} WHERE uuid =:id`;

        const result = await this.sequelize.query(query, {
          replacements: { id },
          type: this.sequelize.QueryTypes.DELETE,
        });

        const [results] = await this.sequelize.query(
          `SELECT * FROM ${tableName}`
        );
        this.common.setRedis(`${tableName} :${config.redisName}`, results);

        response(200, "success", null, res);
      } catch (error) {
        response(500, "error", { status: false, message: error.message }, res);
      }
    };
  }

  remove(tableName) {
    return async (req, res, next) => {
      try {
        if (!tableName) throw new Error("Table name is required");

        const { id } = req.params;

        const query = `UPDATE ${tableName} set deleted_at = '${await getNowDate(
          true
        )}' WHERE uuid = ?`;

        const [result] = await this.sequelize.query(query, {
          replacements: [id],
          type: this.sequelize.QueryTypes.UPDATE,
        });

        if (result.affectedRows === 0) {
          return response(
            404,
            "error",
            { status: false, message: "Data tidak ditemukan" },
            res
          );
        }

        let dataFromRedis = this.common.cekRedis(
          `${tableName} :${config.redisName}`
        );

        if (dataFromRedis.status) {
          const [results] = await this.sequelize.query(
            `SELECT * FROM ${tableName}`
          );
          this.common.setRedis(`${tableName} :${config.redisName}`, results);
        }

        response(
          200,
          "success",
          { status: true, message: "Data berhasil dihapus" },
          res
        );
      } catch (error) {
        response(500, "error", { status: false, message: error.message }, res);
      }
    };
  }
}
