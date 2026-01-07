import setHttpLogger from "../../utils/httpLogger.js";

export default function httpLogger(app){
    app.use((req, res, next) => {
      req.startTime = Date.now();

      res.locals = res.locals || {}
      res.locals.ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip;
      next();
    });

    app.use(setHttpLogger);
}