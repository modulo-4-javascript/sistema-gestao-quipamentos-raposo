import type { Request, Response } from "express";

import { created, noContent, ok } from "../../shared/http/response";
import { locationsService } from "./locations.service";
import type {
  CreateLocationInput,
  ListLocationEquipmentQuery,
  ListLocationsQuery,
  UpdateLocationInput,
  UpdateLocationStatusInput
} from "./locations.types";

export const locationsController = {
  async summary(_request: Request, response: Response): Promise<Response> {
    return ok(response, await locationsService.summary());
  },

  async list(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await locationsService.list(request.query as unknown as ListLocationsQuery)
    );
  },

  async create(request: Request, response: Response): Promise<Response> {
    return created(
      response,
      await locationsService.create(request.body as CreateLocationInput)
    );
  },

  async getById(request: Request, response: Response): Promise<Response> {
    return ok(response, await locationsService.getById(request.params.locationId));
  },

  async update(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await locationsService.update(
        request.params.locationId,
        request.body as UpdateLocationInput
      )
    );
  },

  async delete(request: Request, response: Response): Promise<Response> {
    await locationsService.delete(request.params.locationId);
    return noContent(response);
  },

  async updateStatus(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await locationsService.updateStatus(
        request.params.locationId,
        request.body as UpdateLocationStatusInput
      )
    );
  },

  async equipment(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await locationsService.listEquipment(
        request.params.locationId,
        request.query as unknown as ListLocationEquipmentQuery
      )
    );
  },

  async equipmentHistory(request: Request, response: Response): Promise<Response> {
    return ok(
      response,
      await locationsService.listEquipmentHistory(
        request.params.locationId,
        request.query as unknown as { page: number; pageSize: number }
      )
    );
  }
};
