import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { locationsController } from "./locations.controller";
import {
  createLocationBodySchema,
  listLocationEquipmentQuerySchema,
  listLocationsQuerySchema,
  locationHistoryQuerySchema,
  locationIdParamsSchema,
  updateLocationBodySchema,
  updateLocationStatusBodySchema
} from "./locations.schemas";

export const locationsRoutes = Router();

locationsRoutes.get("/summary", asyncHandler(locationsController.summary));

locationsRoutes.get(
  "/",
  validateRequest({ query: listLocationsQuerySchema }),
  asyncHandler(locationsController.list)
);

locationsRoutes.post(
  "/",
  validateRequest({ body: createLocationBodySchema }),
  asyncHandler(locationsController.create)
);

locationsRoutes.patch(
  "/:locationId/status",
  validateRequest({
    params: locationIdParamsSchema,
    body: updateLocationStatusBodySchema
  }),
  asyncHandler(locationsController.updateStatus)
);

locationsRoutes.get(
  "/:locationId/equipment",
  validateRequest({
    params: locationIdParamsSchema,
    query: listLocationEquipmentQuerySchema
  }),
  asyncHandler(locationsController.equipment)
);

locationsRoutes.get(
  "/:locationId/equipment-history",
  validateRequest({
    params: locationIdParamsSchema,
    query: locationHistoryQuerySchema
  }),
  asyncHandler(locationsController.equipmentHistory)
);

locationsRoutes.get(
  "/:locationId",
  validateRequest({ params: locationIdParamsSchema }),
  asyncHandler(locationsController.getById)
);

locationsRoutes.put(
  "/:locationId",
  validateRequest({
    params: locationIdParamsSchema,
    body: updateLocationBodySchema
  }),
  asyncHandler(locationsController.update)
);

locationsRoutes.delete(
  "/:locationId",
  validateRequest({ params: locationIdParamsSchema }),
  asyncHandler(locationsController.delete)
);
