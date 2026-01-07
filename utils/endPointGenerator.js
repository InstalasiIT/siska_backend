import fs from "fs";
import path from "path";
import url from "url";
import config from "../config/config.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default class EndpointGenerator {
  constructor(options = {}) {
    this.baseDir = __dirname;

    this.paths = {
      controllerDir: path.join(this.baseDir, `controller`),
      serviceDir: path.join(this.baseDir, `application`, `services`),
      routesDir: path.join(this.baseDir, "..", "routes"),
      restDir: path.join(this.baseDir, "..", "test"),
      swaggerDir: path.join(this.baseDir, "..", "frameworks", "doc", "swagger"),
    };

    this.fileName = options.name.fileName;
    this.route = options.name.route;
    this.tableName = options.table.tableName;
    this.isGeneric = true;
    this.tableColumn = options.table.tableColumn;

    this.files = {};
    this.generate();
  }

  async generate() {
    this.files = {
      controller: path.join(
        this.paths.controllerDir,
        `${this.fileName}Controller.js`
      ),
      service: path.join(this.paths.routesDir, `${this.fileName}Services.js`),
      route: path.join(this.paths.routesDir, `${this.fileName}Routes.js`),
      rest: path.join(this.paths.restDir, `${this.fileName}.rest`),
      swagger: path.join(this.paths.swaggerDir, `${this.fileName}.txt`),
    };
    console.log(`🚀 Generate End Point ${this.fileName}`);
    this.generateRoute();
    this.generateRest();
    this.generateSwagger();
  }

  async generateRoute() {
    if (fs.existsSync(this.files.route)) {
      console.log(`⚠️ Route file already exists, skipped`);
      return;
    }
    if (this.isGeneric) {
      const content = `
import GenericController from "../controller/genericController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

export default function ${this.fileName}Route() {
    const controller = new GenericController();
    const router = express.Router();
    const tableName = "${this.tableName}";

    router.get("/${this.route}",authMiddleware, controller.getAll(tableName));
    router.get("/${this.route}/:id",authMiddleware, controller.getByUuid(tableName, false));
    router.post("/${this.route}",authMiddleware, controller.create(tableName, false));
    router.put("/${this.route}/:id",authMiddleware, controller.update(tableName, false));
    router.delete("/${this.route}/:id",authMiddleware, controller.removePermanent(tableName));

    return router;
}
        `;
      fs.writeFileSync(this.files.route, content);
    }
    console.log(`✅ Route created`);
  }

  async generateRest() {
    if (fs.existsSync(this.files.rest)) {
      console.log(`⚠️ Rest file already exists, skipped`);
      return;
    }

    const getDefaultValue = (type) => {
      switch (type.toLowerCase()) {
        case "string":
          return `"example"`;
        case "integer":
        case "number":
          return 0;
        case "boolean":
          return true;
        case "date":
          return `"2025-01-01T00:00:00.000Z"`;
        default:
          return `null`;
      }
    };

    const bodyContent = this.tableColumn
      .map((col) => `  "${col.name}": ${getDefaultValue(col.type)}`)
      .join(",\n");
    if (this.isGeneric) {
      const content = `
### Get
GET http://localhost:${config.port}/${this.route}
Content-Type: application/json
Accept: application/json

### Get by uuid
GET http://localhost:${config.port}/${this.route}/:uuid
Content-Type: application/json
Accept: application/json

### Insert
POST http://localhost:${config.port}/${this.route}
Content-Type: application/json
Accept: application/json

{
    ${bodyContent}
}

### Update 
PUT http://localhost:${config.port}/${this.route}/:uuid
Content-Type: application/json
Accept: application/json

{
    ${bodyContent}
}


### Delete
DELETE http://localhost:${config.port}/${this.route}/:uuid
Content-Type: application/json
Accept: application/json
`;
      fs.writeFileSync(this.files.rest, content);
    }
    console.log(`✅ Rest created`);
  }

  async generateSwagger() {
    if (fs.existsSync(this.files.swagger)) {
      console.log(`⚠️ Swagger file already exists, skipped`);
      return;
    }

    const getDefaultValue = (type) => {
      switch (type.toLowerCase()) {
        case "string":
          return `"example"`;
        case "integer":
        case "number":
          return 0;
        case "boolean":
          return true;
        case "date":
          return `"2025-01-01T00:00:00.000Z"`;
        default:
          return `null`;
      }
    };

    const bodyContent = this.tableColumn
      .map((col) => `  "${col.name}": ${getDefaultValue(col.type)}`)
      .join("\n *                    ");

    const bodyContentId = this.tableColumn
      .map((col) => `  "${col.name}": ${getDefaultValue(col.type)}`)
      .join("\n *                 ");

    const properties = this.tableColumn
      .map(
        (col) =>
          `  ${col.name}:\n *                 type: ${
            col.type
          }\n *                 example: ${getDefaultValue(col.type)}`
      )
      .join("\n *             ");
    if (this.isGeneric) {
      const content = `
 /**
 * @swagger
 * tags:
 *   - name: ${this.fileName}
 *     description: API untuk ${this.fileName}
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /${this.route}:
 *   get:
 *     summary: Mendapatkan data
 *     tags: [${this.fileName}]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data Berhasil di peroleh
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               status: ok
 *               messages: success
 *               status: true
 *               data:
 *                 -${bodyContent}
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /${this.route}/{id}:
 *   get:
 *     summary: Mendapatkan 1 data
 *     tags: [${this.fileName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID ${this.fileName}
 *     responses:
 *       200:
 *         description: Data Berhasil
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               status: ok
 *               messages: success
 *               status: true
 *               data:
 *               ${bodyContentId}
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /${this.route}:
 *   post:
 *     summary: Insert data
 *     tags: [${this.fileName}]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *             ${properties}
 *     responses:
 *       200:
 *         description: Data ${this.fileName} Berhasil diTambah
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               status: ok
 *               messages: Data berhasil
 */

 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /${this.route}/{id}:
 *   put:
 *     summary: Update data
 *     tags: [${this.fileName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID ${this.fileName}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *             ${properties}
 *     responses:
 *       200:
 *         description: Data ${this.fileName} Berhasil di Ubah
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               status: ok
 *               messages: Data berhasil diupdate
 */

    /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /${this.route}/{id}:
 *   delete:
 *     summary: Mendapatkan data
 *     tags: [${this.fileName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID ${this.fileName}
 *     responses:
 *       200:
 *         description: Data Berhasil
 *         content:
 *           application/json:
 *             example:
 *               code: 200
 *               status: ok
 *               messages: Data berhasil dihapus
 */

`;
      fs.writeFileSync(this.files.swagger, content);
    }
    console.log(`✅ Swagger created`);
  }
}
