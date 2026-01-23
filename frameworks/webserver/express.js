import morgan from "morgan";
import compression from "compression";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import config from "../../config/config.js";
import express from "express";
import path from "path";

export default function expressConfig(app) {
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow all origins (jangan lupa di matikan)
      //   return callback(null, true);

      if (!origin) return callback(null, true);

      if (config.nodeEnv === "development") {
        return callback(null, true);
      }

      const allowedOrigins = [
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1",
        "http://127.0.0.1:3000",
        "http://172.16.32.11",
        "http://192.168.114.27",
        "http://172.16.32.150",
        "http://172.16.32.67",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "Pragma",
    ],
  };

  // Use CORS middleware
  app.use(cors(corsOptions));

  // security middleware
  // app.use(helmet());

  app.use(compression());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));


  app.use(morgan("combined"));
}
