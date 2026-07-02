import type { Request, Response } from "express";

import { created, noContent, ok } from "../../shared/http/response";
import { equipmentService } from "./equipment.service";
import type {
  CreateEquipmentInput,
  ListEquipmentQuery,
  UpdateEquipmentInput,
  UpdateEquipmentStatusInput
} from "./equipment.types";

export const equipmentController = {
  async summary(_request: Request, response: Response): Promise<Response> {
    return ok(response, await equipmentService.summary());
  },

  async list(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await equipmentService.list(request.query as unknown as ListEquipmentQuery)
    );
  },

  async create(request: Request, response: Response): Promise<Response> {
    return created(
      response,
      await equipmentService.create(request.body as CreateEquipmentInput)
    );
  },

  async getById(request: Request, response: Response): Promise<Response> {
    return ok(response, await equipmentService.getById(request.params.equipmentId));
  },

  async update(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await equipmentService.update(
        request.params.equipmentId,
        request.body as UpdateEquipmentInput
      )
    );
  },

  async delete(request: Request, response: Response): Promise<Response> {
    await equipmentService.delete(request.params.equipmentId);
    return noContent(response);
  },

  async updateStatus(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await equipmentService.updateStatus(
        request.params.equipmentId,
        request.body as UpdateEquipmentStatusInput
      )
    );
  },

  async history(request: Request, response: Response): Promise<Response> {
    return ok(response, await equipmentService.listHistory(request.params.equipmentId));
  }
};
