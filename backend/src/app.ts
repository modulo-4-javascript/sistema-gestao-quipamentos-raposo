import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { equipmentRoutes } from "./features/equipment/equipment.routes";
import { locationsRoutes } from "./features/locations/locations.routes";
import { AppError } from "./shared/errors/AppError";
import { errorHandler } from "./shared/errors/errorHandler";

export const app = express();
const openApiDocument = YAML.load("docs/openapi.yaml");

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/locations", locationsRoutes);
app.get("/docs/openapi.yaml", (_request, response) => {
  response.sendFile("docs/openapi.yaml", { root: process.cwd() });
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use((_request, _response, next) => {
  next(new AppError(404, "ROUTE_NOT_FOUND", "Route not found."));
});

app.use(errorHandler);
