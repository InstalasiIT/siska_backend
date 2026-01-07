import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import path from "path";

import config from "../config/config.js";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: config.swagger.title || "API Documentation",
      version: "1.0.0",
      description: config.swagger.desc || "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5380",
      },
    ],
  },
  apis: [path.resolve("./frameworks/doc/swagger/*.txt")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default (app) => {
  app.use(
    config.swagger.url || "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      explorer: true, // ada sidebar pencarian
      swaggerOptions: {
        docExpansion: "none",
        defaultModelsExpandDepth: -1,
        persistAuthorization: true,
        // opsional lain:
        // deepLinking: true,
        // displayRequestDuration: true,
        // tryItOutEnabled: true,
        // operationsSorter: "alpha",
        // tagsSorter: "alpha",
      },
      // Bisa juga tambah CSS kecil untuk rapikan UI
      // customCss: '.models { display:none !important }'
    })
  );
};
