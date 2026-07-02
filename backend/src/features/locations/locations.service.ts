import { randomUUID } from "node:crypto";

import { AppError } from "../../shared/errors/AppError";
import { paginate } from "../../shared/http/pagination";
import type { PaginatedResult, PaginationOptions } from "../../shared/types/pagination";
import { equipmentRepository } from "../equipment/equipment.repository";
import { EquipmentStatus, type Equipment } from "../equipment/equipment.types";
import { historyService } from "../history/history.service";
import { locationsRepository } from "./locations.repository";
import {
  LocationStatus,
  type CreateLocationInput,
  type ListLocationEquipmentQuery,
  type ListLocationsQuery,
  type Location,
  type LocationDetails,
  type LocationSummary,
  type UpdateLocationInput,
  type UpdateLocationStatusInput
} from "./locations.types";

function removeUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined)
  ) as Partial<T>;
}

function includesText(value: string | null | undefined, search: string): boolean {
  return value?.toLowerCase().includes(search) ?? false;
}

export class LocationsService {
  async list(query: ListLocationsQuery): Promise<PaginatedResult<LocationDetails>> {
    const search = query.search?.toLowerCase();
    let locations = await locationsRepository.findAll();

    if (search) {
      locations = locations.filter(
        (item) =>
          includesText(item.name, search) ||
          includesText(item.code, search) ||
          includesText(item.building, search) ||
          includesText(item.floor, search) ||
          includesText(item.room, search) ||
          includesText(item.description, search)
      );
    }

    if (query.status) {
      locations = locations.filter((item) => item.status === query.status);
    }

    if (query.type) {
      locations = locations.filter((item) => item.type === query.type);
    }

    return paginate(
      await Promise.all(locations.map((location) => this.toDetails(location))),
      {
        page: query.page,
        pageSize: query.pageSize
      }
    );
  }

  async summary(): Promise<LocationSummary> {
    const locations = await locationsRepository.findAll();
    const equipmentCount = (await equipmentRepository.findAll()).filter((equipment) =>
      Boolean(equipment.locationId)
    ).length;

    return {
      total: locations.length,
      active: locations.filter((location) => location.status === LocationStatus.ACTIVE)
        .length,
      inactive: locations.filter(
        (location) => location.status === LocationStatus.INACTIVE
      ).length,
      equipmentCount
    };
  }

  async getById(locationId: string): Promise<LocationDetails> {
    return await this.toDetails(await this.getExistingLocation(locationId));
  }

  async create(input: CreateLocationInput): Promise<LocationDetails> {
    await this.ensureUniqueCode(input.code);

    const now = new Date().toISOString();
    const location = await locationsRepository.create({
      id: randomUUID(),
      code: input.code,
      name: input.name,
      type: input.type,
      building: input.building,
      floor: input.floor,
      room: input.room,
      description: input.description ?? null,
      status: input.status ?? LocationStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    });

    return await this.toDetails(location);
  }

  async update(locationId: string, input: UpdateLocationInput): Promise<LocationDetails> {
    const current = await this.getExistingLocation(locationId);

    if (input.code && input.code !== current.code) {
      await this.ensureUniqueCode(input.code);
    }

    const updated = await locationsRepository.update(
      locationId,
      removeUndefined({
        ...input,
        updatedAt: new Date().toISOString()
      })
    );

    if (!updated) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    return await this.toDetails(updated);
  }

  async delete(locationId: string): Promise<void> {
    await this.getExistingLocation(locationId);

    if ((await equipmentRepository.findByLocationId(locationId)).length > 0) {
      throw new AppError(
        409,
        "LOCATION_HAS_LINKED_EQUIPMENT",
        "This location has linked equipment and cannot be deleted."
      );
    }

    await locationsRepository.delete(locationId);
  }

  async updateStatus(
    locationId: string,
    input: UpdateLocationStatusInput
  ): Promise<LocationDetails> {
    await this.getExistingLocation(locationId);

    const updated = await locationsRepository.update(locationId, {
      status: input.status,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    return await this.toDetails(updated);
  }

  async listEquipment(
    locationId: string,
    query: ListLocationEquipmentQuery
  ): Promise<PaginatedResult<Equipment>> {
    await this.getExistingLocation(locationId);
    let equipment = await equipmentRepository.findByLocationId(locationId);

    if (query.status) {
      equipment = equipment.filter((item) => item.status === query.status);
    }

    return paginate(equipment, { page: query.page, pageSize: query.pageSize });
  }

  async listEquipmentHistory(locationId: string, pagination: PaginationOptions) {
    await this.getExistingLocation(locationId);
    return await historyService.listByLocationId(locationId, pagination);
  }

  private async getExistingLocation(locationId: string): Promise<Location> {
    const location = await locationsRepository.findById(locationId);

    if (!location) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    return location;
  }

  private async ensureUniqueCode(code: string): Promise<void> {
    if (await locationsRepository.findByCode(code)) {
      throw new AppError(
        409,
        "LOCATION_CODE_ALREADY_EXISTS",
        "Location code already exists."
      );
    }
  }

  private async toDetails(location: Location): Promise<LocationDetails> {
    const equipment = await equipmentRepository.findByLocationId(location.id);

    return {
      ...location,
      equipmentCount: equipment.length,
      equipmentSummary: {
        total: equipment.length,
        available: equipment.filter((item) => item.status === EquipmentStatus.AVAILABLE)
          .length,
        inMaintenance: equipment.filter(
          (item) => item.status === EquipmentStatus.IN_MAINTENANCE
        ).length,
        inactive: equipment.filter((item) => item.status === EquipmentStatus.INACTIVE)
          .length
      }
    };
  }
}

export const locationsService = new LocationsService();
