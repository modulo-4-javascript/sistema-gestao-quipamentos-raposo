import type { QueryResultRow } from "pg";

import { getPool } from "../../shared/database/connection";
import { isDatabaseEnabled } from "../../shared/database/config";
import { historySeed } from "./history.seed";
import type { HistoryItem } from "./history.types";

function cloneHistoryItem(item: HistoryItem): HistoryItem {
  return { ...item };
}

function sortByNewest(first: HistoryItem, second: HistoryItem): number {
  return second.createdAt.localeCompare(first.createdAt);
}

function rowToHistoryItem(row: QueryResultRow): HistoryItem {
  return {
    id: row.id,
    type: row.type,
    equipmentId: row.equipment_id,
    fromLocationId: row.from_location_id,
    toLocationId: row.to_location_id,
    title: row.title,
    description: row.description,
    userId: row.user_id,
    createdAt: new Date(row.created_at).toISOString()
  };
}

export class HistoryRepository {
  private history = historySeed.map(cloneHistoryItem);

  reset(): void {
    this.history = historySeed.map(cloneHistoryItem);
  }

  async findAll(): Promise<HistoryItem[]> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        "SELECT * FROM equipment_history ORDER BY created_at DESC"
      );
      return result.rows.map(rowToHistoryItem);
    }

    return this.history.map(cloneHistoryItem).sort(sortByNewest);
  }

  async findByEquipmentId(equipmentId: string): Promise<HistoryItem[]> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        "SELECT * FROM equipment_history WHERE equipment_id = $1 ORDER BY created_at DESC",
        [equipmentId]
      );
      return result.rows.map(rowToHistoryItem);
    }

    return this.history
      .filter((item) => item.equipmentId === equipmentId)
      .map(cloneHistoryItem)
      .sort(sortByNewest);
  }

  async findByLocationId(locationId: string): Promise<HistoryItem[]> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        `
        SELECT *
        FROM equipment_history
        WHERE from_location_id = $1 OR to_location_id = $1
        ORDER BY created_at DESC
        `,
        [locationId]
      );
      return result.rows.map(rowToHistoryItem);
    }

    return this.history
      .filter(
        (item) => item.fromLocationId === locationId || item.toLocationId === locationId
      )
      .map(cloneHistoryItem)
      .sort(sortByNewest);
  }

  async create(item: HistoryItem): Promise<HistoryItem> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        `
        INSERT INTO equipment_history (
          id, type, equipment_id, from_location_id, to_location_id, title,
          description, user_id, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
          item.id,
          item.type,
          item.equipmentId,
          item.fromLocationId ?? null,
          item.toLocationId ?? null,
          item.title,
          item.description,
          item.userId ?? null,
          item.createdAt
        ]
      );

      return rowToHistoryItem(result.rows[0]);
    }

    this.history.push(cloneHistoryItem(item));
    return cloneHistoryItem(item);
  }
}

export const historyRepository = new HistoryRepository();
