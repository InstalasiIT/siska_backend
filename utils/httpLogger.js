import pinoHttp from "pino-http";
import LoggerMongo from "./logger.js";


const logger = new LoggerMongo().logger;
const setHttpLogger = pinoHttp({
  logger,
  serializers: {
    req(req) {
      return {
        // clientIp : req.locals.ip,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: req.headers,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    err: pinoHttp.stdSerializers.err,
  },
  customLogLevel(req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage(req, res) {
    return res.locals.messageLog || `${req.method} ${req.url} completed`;
  },
  customErrorMessage(req, res, err) {
    return res.locals.messageLog || `${req.method} ${req.url} failed`;
  },
  customProps(req, res) {
    return {
      ip: res.locals.ip,
      duration: Date.now() - req.startTime,
    };
  },
  autoLogging: {
    ignore: (req) => {
      return req.url === "/health" || req.url === "/favicon.ico";
    },
  },
});

export default setHttpLogger;
