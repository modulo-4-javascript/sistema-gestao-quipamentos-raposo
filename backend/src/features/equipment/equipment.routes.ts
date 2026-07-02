import { Router } from "express";

import { asyncHandler } from "../../shared/http/asyncHandler";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { equipmentController } from "./equipment.controller";
import {
  createEquipmentBodySchema,
  equipmentIdParamsSchema,
  listEquipmentQuerySchema,
  updateEquipmentBodySchema,
  updateEquipmentStatusBodySchema
} from "./equipment.schemas";

export const equipmentRoutes = Router();

equipmentRoutes.get("/summary", asyncHandler(equipmentController.summary));

equipmentRoutes.get(
  "/",
  validateRequest({ query: listEquipmentQuerySchema }),
  asyncHandler(equipmentController.list)
);

equipmentRoutes.post(
  "/",
  validateRequest({ body: createEquipmentBodySchema }),
  asyncHandler(equipmentController.create)
);

equipmentRoutes.patch(
  "/:equipmentId/status",
  validateRequest({
    params: equipmentIdParamsSchema,
    body: updateEquipmentStatusBodySchema
  }),
  asyncHandler(equipmentController.updateStatus)
);

equipmentRoutes.get(
  "/:equipmentId/history",
  validateRequest({ params: equipmentIdParamsSchema }),
  asyncHandler(equipmentController.history)
);

equipmentRoutes.get(
  "/:equipmentId",
  validateRequest({ params: equipmentIdParamsSchema }),
  asyncHandler(equipmentController.getById)
);

equipmentRoutes.put(
  "/:equipmentId",
  validateRequest({
    params: equipmentIdParamsSchema,
    body: updateEquipmentBodySchema
  }),
  asyncHandler(equipmentController.update)
);

equipmentRoutes.delete(
  "/:equipmentId",
  validateRequest({ params: equipmentIdParamsSchema }),
  asyncHandler(equipmentController.delete)
);
