#!/usr/bin/env node
import fs from "fs";
import path from "path";
import url from "url";
import config from "../config/config.js";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const nameArgIndex = args.findIndex((arg) => arg === "--name");
const routeArgIndex = args.findIndex((arg) => arg === "--route");

if (nameArgIndex === -1 || !args[nameArgIndex + 1]) {
  console.error('Usage: npm run makeEndPoint --name "Coba"');
  process.exit(1);
}

if (routeArgIndex === -1 || !args[routeArgIndex + 1]) {
  console.error('Route harus diisi. Contoh: --route "users"');
  process.exit(1);
}

const name = args[nameArgIndex + 1];
const lowerName = name.toLowerCase();

const route = args[routeArgIndex + 1];
const lowerRoute = route.toLowerCase();

// Direktori
const controllersDir = path.join(__dirname, "..", "controller");
const servicesDir = path.join(__dirname, "..", "application", "services");
const routesDir = path.join(__dirname, "..", "routes");
const testDir = path.join(__dirname, "..", "test");
const swaggerDir = path.join(__dirname, "..", "frameworks", "doc", "swagger");

// Pastikan folder ada
[controllersDir, servicesDir, routesDir, testDir, swaggerDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// File paths
const controllerFile = path.join(controllersDir, `${name}Controller.js`);
const serviceFile = path.join(servicesDir, `${name}Service.js`);
const routeFile = path.join(routesDir, `${lowerName}Routes.js`);
const restFile = path.join(testDir, `${lowerName}.rest`);
const swaggerFile = path.join(swaggerDir, `${lowerName}.txt`);

// Template Controller
const controllerTemplate = `import ${name}Service from "../application/services/${name}Service.js";
import response from "../utils/response.js";

export default class ${name}Controller {
  constructor() {
    this.services = new ${name}Service();
  }

  example() {
    return async (req, res, next) => {
        try {
            const results = await this.services.example();
            response(200, "success", { status: true, data: results }, res);
        } catch (error) {
            response(500, "error", error.message, res);
        }
    };
   
  }
}
`;

// Template Service
const serviceTemplate = `export default class ${name}Service {
  constructor() {}

  async example() {
    return "Berhasil bikin Endpoint pertama";
  }
}
`;

// Template Route
const routeTemplate = `import ${name}Controller from "../controller/${name}Controller.js";
import express from "express";

export default function ${name}Route() {
  const controller = new ${name}Controller();
  const ${lowerName}Routes = express.Router();

  ${lowerName}Routes.get("/${lowerRoute}/example", controller.example());

  return ${lowerName}Routes;
}
`;

// Template REST (.rest untuk VSCode REST Client)
const restTemplate = `### Test endpoint ${name}
GET http://127.0.0.1:${config.port}/${lowerRoute}/example
Content-Type: application/json
Accept: application/json
`;

// Template Swagger
const swaggerTemplate = `/**
 * @swagger
 * tags:
 *   - name: ${name}
 *     description: API untuk ${name}
 */

/**
 * @swagger
 * /${lowerRoute}/example:
 *   get:
 *     summary: Contoh endpoint
 *     tags: [${name}]
 *     responses:
 *       200:
 *         description: Example Berhasil
 */
`;

// Tulis file
fs.writeFileSync(controllerFile, controllerTemplate);
fs.writeFileSync(serviceFile, serviceTemplate);
fs.writeFileSync(routeFile, routeTemplate);
fs.writeFileSync(restFile, restTemplate);
fs.writeFileSync(swaggerFile, swaggerTemplate);

console.log(`✅ Created:
- ${controllerFile}
- ${serviceFile}
- ${routeFile}
- ${restFile}
- ${swaggerFile}`);
