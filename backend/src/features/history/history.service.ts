import { randomUUID } from "node:crypto";

import { paginate } from "../../shared/http/pagination";
import type { PaginatedResult, PaginationOptions } from "../../shared/types/pagination";
import { historyRepository } from "./history.repository";
import type { CreateHistoryItemInput, HistoryItem } from "./history.types";

export class HistoryService {
  async register(input: CreateHistoryItemInput): Promise<HistoryItem> {
    const { createdAt, ...historyData } = input;

    return await historyRepository.create({
      id: randomUUID(),
      ...historyData,
      createdAt: createdAt ?? new Date().toISOString()
    });
  }

  async listByEquipmentId(equipmentId: string): Promise<HistoryItem[]> {
    return await historyRepository.findByEquipmentId(equipmentId);
  }

  async listByLocationId(
    locationId: string,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<HistoryItem>> {
    return paginate(await historyRepository.findByLocationId(locationId), pagination);
  }
}

export const historyService = new HistoryService();
