import dotenv from "dotenv";

dotenv.config();

export default {
  appName: process.env.APP_NAME,
  appNameSyamrabu: process.env.APP_NAME_MYSYAMRABU,
  nodeEnv: process.env.NODE_ENV,
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
  redisName: process.env.REDIS_NAME,

  app_db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },

  mongo: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT) || 27017,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    name: process.env.MONGO_NAME,
    logName: process.env.SCHEMA_LOG_NAME,
  },

  swagger: {
    url: process.env.SWAGGER_URL,
    title: process.env.SWAGGER_TITLE,
    desc: process.env.SWAGGER_DESC,
  },

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
