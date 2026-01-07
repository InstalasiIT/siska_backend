import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function appRoutes(app) {
  const routesPath = path.join(__dirname);
  const files = fs
    .readdirSync(routesPath)
    .filter((file) => file !== "indexRoute.js");

  const imports = files.map(async (file) => {
    try {
      const routeFilePath = path.join(routesPath, file);
      const routeFileURL = pathToFileURL(routeFilePath).href;
      const module = await import(routeFileURL);
      let router = module.default;
      if (typeof router === "function") {
        router = router();
      }

      const routeName = file.replace(/Routes\.js$/, "").toLowerCase();
      app.use(router);
    } catch (err) {
      console.error(`Failed to load route from ${file}`, err);
    }
  });

  await Promise.all(imports);
}
