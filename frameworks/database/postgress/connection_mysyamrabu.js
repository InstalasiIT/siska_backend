import { Sequelize } from "sequelize";
import config from "../../../config/config.js";

class ConnectionPostgress {
  constructor() {
    if (ConnectionPostgress.instance) {
      return ConnectionPostgress.instance;
    }

    const options = {
      reconnectInterval: 5000,
      logging: true,
    };

    const con = `postgres://${config.app_db_mysyamrabu.user}:${config.app_db_mysyamrabu.pass}@${config.app_db_mysyamrabu.host}:${config.app_db_mysyamrabu.port}/${config.app_db_mysyamrabu.name}`;

    this.sequelize = new Sequelize(con, { ...options });
    this.options = options;
    this.connectToPostgres();

    ConnectionPostgress.instance = this;
  }

  async connectToPostgres() {
    try {
      await this.sequelize.authenticate();
      console.log("DB Connected");
    } catch (error) {
      console.error("PostgreSQL connection error:", error);
      this.retryConnection();
    }
  }

  retryConnection() {
    const retryTime = this.options.reconnectInterval || 5000;
    console.info(`Reconnecting to PostgreSQL`);
    setTimeout(() => this.connectToPostgres(), retryTime);
  }
}

export default new ConnectionPostgress();
