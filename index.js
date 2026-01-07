import express from "express";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import ConnectionPostgress from "./frameworks/database/postgress/connection.js";
import serverConfig from "./frameworks/webserver/server.js";
import expressConfig from "./frameworks/webserver/express.js";
import httpLogger from "./frameworks/webserver/logger.js";
import { createServer } from "http";
import appRoutes from "./routes/indexRoute.js";
import connectMongo from "./frameworks/database/mongo/mongo.js";
import swaggerSetup from "./utils/swagger.js";

const app = express();
app.use(cookieParser());
expressConfig(app);
httpLogger(app);

const server = createServer(app);
connectMongo();
const { startServer } = serverConfig(
  app,
  ConnectionPostgress.sequelize,
  connectMongo,
  server,
  config
);
startServer();

swaggerSetup(app);
appRoutes(app);
