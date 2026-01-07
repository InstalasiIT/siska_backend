import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import connection from "../database/postgress/connection.js";
import queryHelper from "../../utils/queryHelper.js";

export default class JWTService {
  constructor() {
    this.db = new queryHelper(connection.sequelize);
  }

  async createAccessToken(payload, time) {
    try {
      const token = jwt.sign(payload, config.jwtAccessSecret, {
        expiresIn: time,
      });
      return token;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async createRefreshToken(payload, time) {
    try {
      const token = jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: time,
      });
      return token;
    } catch (error) {
      throw new AppError(error);
    }
  }
  async verifyAccessToken(token) {
    const decoded = jwt.verify(token, config.jwtAccessSecret);
    return decoded;
  }

  async verifyRefreshToken(token) {
    const decoded = jwt.verify(token, config.jwtRefreshSecret);
    return decoded;
  }

  async deleteToken(id) {
    await this.db.update({
      table: "users",
      replacements: {
        token: null,
      },
    });
    return;
  }

  async decode(token) {
    return jwt.decode(token);
  }
}
