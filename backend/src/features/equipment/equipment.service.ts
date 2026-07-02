import { randomUUID } from "node:crypto";

import { AppError } from "../../shared/errors/AppError";
import { paginate } from "../../shared/http/pagination";
import type { PaginatedResult } from "../../shared/types/pagination";
import { historyService } from "../history/history.service";
import { EquipmentHistoryType } from "../history/history.types";
import { locationsRepository } from "../locations/locations.repository";
import { equipmentRepository } from "./equipment.repository";
import {
  EquipmentStatus,
  EquipmentType,
  type CreateEquipmentInput,
  type Equipment,
  type EquipmentDetails,
  type EquipmentSummary,
  type ListEquipmentQuery,
  type UpdateEquipmentInput,
  type UpdateEquipmentStatusInput
} from "./equipment.types";

function removeUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined)
  ) as Partial<T>;
}

function includesText(value: string | null | undefined, search: string): boolean {
  return value?.toLowerCase().includes(search) ?? false;
}

function buildSummary(equipment: Equipment[]): EquipmentSummary {
  return {
    total: equipment.length,
    available: equipment.filter((item) => item.status === EquipmentStatus.AVAILABLE)
      .length,
    inMaintenance: equipment.filter(
      (item) => item.status === EquipmentStatus.IN_MAINTENANCE
    ).length,
    inactive: equipment.filter((item) => item.status === EquipmentStatus.INACTIVE).length
  };
}

export class EquipmentService {
  async list(query: ListEquipmentQuery): Promise<PaginatedResult<Equipment>> {
    const search = query.search?.toLowerCase();
    let equipment = await equipmentRepository.findAll();

    if (search) {
      equipment = equipment.filter(
        (item) =>
          includesText(item.name, search) ||
          includesText(item.code, search) ||
          includesText(item.model, search) ||
          includesText(item.serialNumber, search) ||
          includesText(item.notes, search)
      );
    }

    if (query.status) {
      equipment = equipment.filter((item) => item.status === query.status);
    }

    if (query.type) {
      equipment = equipment.filter((item) => item.type === query.type);
    }

    if (query.locationId) {
      equipment = equipment.filter((item) => item.locationId === query.locationId);
    }

    return paginate(equipment, { page: query.page, pageSize: query.pageSize });
  }

  async summary(): Promise<EquipmentSummary> {
    return buildSummary(await equipmentRepository.findAll());
  }

  async summaryForLocation(locationId: string): Promise<EquipmentSummary> {
    return buildSummary(await equipmentRepository.findByLocationId(locationId));
  }

  async getById(equipmentId: string): Promise<EquipmentDetails> {
    const equipment = await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    return {
      ...equipment,
      recentHistory: (await historyService.listByEquipmentId(equipmentId)).slice(0, 5)
    };
  }

  async create(input: CreateEquipmentInput): Promise<EquipmentDetails> {
    await this.ensureLocationExists(input.locationId);

    const now = new Date().toISOString();
    const equipment = await equipmentRepository.create({
      id: randomUUID(),
      code: await this.generateEquipmentCode(),
      name: input.name,
      type: input.type ?? EquipmentType.OTHER,
      model: input.model,
      serialNumber: input.serialNumber,
      status: input.status ?? EquipmentStatus.AVAILABLE,
      locationId: input.locationId ?? null,
      responsibleUserName: input.responsibleUserName ?? null,
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now
    });

    await historyService.register({
      type: EquipmentHistoryType.CREATED,
      equipmentId: equipment.id,
      toLocationId: equipment.locationId,
      title: "Equipment created",
      description: `${equipment.name} was registered in the inventory.`
    });

    return await this.getById(equipment.id);
  }

  async update(
    equipmentId: string,
    input: UpdateEquipmentInput
  ): Promise<EquipmentDetails> {
    const current = await this.getExistingEquipment(equipmentId);
    await this.ensureLocationExists(input.locationId);

    const updatedAt = new Date().toISOString();
    const changes = removeUndefined({
      ...input,
      updatedAt
    });

    const updated = await equipmentRepository.update(equipmentId, changes);

    if (!updated) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    await this.registerStatusChange(current, updated);
    await this.registerLocationChange(current, updated);

    await historyService.register({
      type: EquipmentHistoryType.UPDATED,
      equipmentId: updated.id,
      fromLocationId: current.locationId,
      toLocationId: updated.locationId,
      title: "Equipment updated",
      description: `${updated.name} data was updated.`
    });

    return await this.getById(equipmentId);
  }

  async delete(equipmentId: string): Promise<void> {
    const equipment = await this.getExistingEquipment(equipmentId);

    await historyService.register({
      type: EquipmentHistoryType.DELETED,
      equipmentId: equipment.id,
      fromLocationId: equipment.locationId,
      title: "Equipment deleted",
      description: `${equipment.name} was removed from the inventory.`
    });

    await equipmentRepository.delete(equipmentId);
  }

  async updateStatus(
    equipmentId: string,
    input: UpdateEquipmentStatusInput
  ): Promise<EquipmentDetails> {
    const current = await this.getExistingEquipment(equipmentId);
    const updated = await equipmentRepository.update(equipmentId, {
      status: input.status,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    await this.registerStatusChange(current, updated, input.note);
    return await this.getById(equipmentId);
  }

  async listHistory(
    equipmentId: string
  ): Promise<Awaited<ReturnType<typeof historyService.listByEquipmentId>>> {
    await this.getExistingEquipment(equipmentId);
    return await historyService.listByEquipmentId(equipmentId);
  }

  private async getExistingEquipment(equipmentId: string): Promise<Equipment> {
    const equipment = await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new AppError(404, "RESOURCE_NOT_FOUND", "Resource not found.");
    }

    return equipment;
  }

  private async ensureLocationExists(
    locationId: string | null | undefined
  ): Promise<void> {
    if (!locationId) {
      return;
    }

    if (!(await locationsRepository.findById(locationId))) {
      throw new AppError(404, "LOCATION_NOT_FOUND", "Location not found.");
    }
  }

  private async generateEquipmentCode(): Promise<string> {
    const nextNumber =
      (await equipmentRepository.findAll())
        .map((item) => Number(item.code.replace("EQP-", "")))
        .filter(Number.isFinite)
        .reduce((max, value) => Math.max(max, value), 0) + 1;

    return `EQP-${String(nextNumber).padStart(3, "0")}`;
  }

  private async registerStatusChange(
    current: Equipment,
    updated: Equipment,
    note?: string | null
  ): Promise<void> {
    if (current.status === updated.status) {
      return;
    }

    await historyService.register({
      type: EquipmentHistoryType.STATUS_CHANGED,
      equipmentId: updated.id,
      fromLocationId: current.locationId,
      toLocationId: updated.locationId,
      title: "Status updated",
      description: note ?? `Changed from ${current.status} to ${updated.status}.`
    });
  }

  private async registerLocationChange(
    current: Equipment,
    updated: Equipment
  ): Promise<void> {
    const fromLocationId = current.locationId ?? null;
    const toLocationId = updated.locationId ?? null;

    if (fromLocationId === toLocationId) {
      return;
    }

    const type = this.resolveLocationHistoryType(fromLocationId, toLocationId);

    await historyService.register({
      type,
      equipmentId: updated.id,
      fromLocationId,
      toLocationId,
      title: "Location updated",
      description: this.buildLocationChangeDescription(
        updated.name,
        fromLocationId,
        toLocationId
      )
    });
  }

  private resolveLocationHistoryType(
    fromLocationId: string | null,
    toLocationId: string | null
  ): EquipmentHistoryType {
    if (!fromLocationId && toLocationId) {
      return EquipmentHistoryType.LINKED_TO_LOCATION;
    }

    if (fromLocationId && !toLocationId) {
      return EquipmentHistoryType.REMOVED_FROM_LOCATION;
    }

    return EquipmentHistoryType.LOCATION_CHANGED;
  }

  private buildLocationChangeDescription(
    equipmentName: string,
    fromLocationId: string | null,
    toLocationId: string | null
  ): string {
    if (!fromLocationId && toLocationId) {
      return `${equipmentName} was linked to a location.`;
    }

    if (fromLocationId && !toLocationId) {
      return `${equipmentName} was removed from its location.`;
    }

    return `${equipmentName} was moved to another location.`;
  }
}

export const equipmentService = new EquipmentService();
