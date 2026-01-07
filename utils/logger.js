import { Writable } from "stream";
import LoggerDB from "../frameworks/database/mongo/logSchema.js";
import pino from "pino";

export default class LoggerMongo {
  constructor() {
    this.isProduction = true;
    this.mongoStream = this.createMongoStream(); // Promise, tapi OK
    this.loggerInstance = this.createPinoLogger(); // logger asli
  }

  createMongoStream() {
    return new Writable({
      objectMode: true,
      write: async (logObj, encoding, callback) => {
        try {
          const parsed =
            typeof logObj === "string" ? JSON.parse(logObj) : logObj;

          const mappingLevel = {
            60: "Fatal",
            50: "Error",
            40: "Warning",
            30: "Info",
            20: "Debug",
            10: "Trace",
          };

          const value = {
            level: mappingLevel[parsed.level] || "info",
            timestamp: new Date(parsed.timestamp),
            pid: String(parsed.pid || ""),
            hostname: parsed.hostname || "",
            msg: parsed.msg || "Berhasil",
            req: parsed.req || {},
            res: parsed.res || {},
            responTime: parsed.responseTime,
            note: parsed.clientIp,
          };
          console.log("berhasil bikin pino logger");
          await LoggerDB.create(value);
          callback();
        } catch (err) {
          console.error("❌ Error saving log to MongoDB:", err);
          callback(err);
        }
      },
    });
  }

  createPinoLogger() {
    const transport = pino.transport({
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
          level: "info",
        },
      ],
    });

    return pino(
      {
        level: "info",
        timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      },
      pino.multistream(this.isProduction ? [{ stream: this.mongoStream }] : [])
    );
  }
  
  get logger() {
    return this.loggerInstance;
  }
}
