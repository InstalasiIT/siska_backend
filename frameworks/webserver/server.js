import { createTerminus } from "@godaddy/terminus";
import LoggerMongo from "../../utils/logger.js";

export default function serverConfig(app, sequelize, connectMongo, serverInit, config) {
  async function healthCheck() {
    try {
      await sequelize.connectToPostgres();
      await connectMongo()
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(new Error("PostgreSQL is not connected"));
    }
  }

  async function onSignal() {
    console.log("server is starting cleanup");

    try {
      await sequelize.close();
      console.info("Sequelize (PostgreSQL) connection closed");
    } catch (err) {
      console.error("Error during disconnection:", err);
    }
  }


  function beforeShutdown() {
    return new Promise((resolve) => {
      setTimeout(resolve, 15000);
    });
  }

  function onShutdown() {
    console.log("cleanup finished, server is shutting down");
  }

  function startServer() {
    createTerminus(serverInit, {
      logger: console.log,
      signal: "SIGINT",
      healthChecks: {
        "/healthcheck": healthCheck
      },
      onSignal,
      beforeShutdown,
      onShutdown,
    }).listen(config.port, config.host, () => {
      console.log(
        "Express server listening on %d, in %s mode",
        config.port,
        app.get("env")
      );
    });
  }

  return {
    startServer,
  };
}
