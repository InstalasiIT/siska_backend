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

  app_db_evo: {
    host: process.env.DB_HOST_EVO,
    port: process.env.DB_PORT_EVO,
    user: process.env.DB_USER_EVO,
    pass: process.env.DB_PASS_EVO,
    name: process.env.DB_NAME_EVO,
  },

  app_db_mysyamrabu: {
    host: process.env.DB_HOST_MYSYAMRABU,
    port: process.env.DB_PORT_MYSYAMRABU,
    user: process.env.DB_USER_MYSYAMRABU,
    pass: process.env.DB_PASS_MYSYAMRABU,
    name: process.env.DB_NAME_MYSYAMRABU,
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
