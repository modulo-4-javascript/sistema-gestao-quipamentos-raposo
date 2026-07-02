import type { QueryResultRow } from "pg";

import { getPool } from "../../shared/database/connection";
import { isDatabaseEnabled } from "../../shared/database/config";
import { equipmentSeed } from "./equipment.seed";
import type { Equipment } from "./equipment.types";

function cloneEquipment(equipment: Equipment): Equipment {
  return { ...equipment };
}

function rowToEquipment(row: QueryResultRow): Equipment {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    model: row.model ?? undefined,
    serialNumber: row.serial_number ?? undefined,
    status: row.status,
    locationId: row.location_id,
    responsibleUserId: row.responsible_user_id,
    notes: row.notes,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

export class EquipmentRepository {
  private equipment = equipmentSeed.map(cloneEquipment);

  reset(): void {
    this.equipment = equipmentSeed.map(cloneEquipment);
  }

  async findAll(): Promise<Equipment[]> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        "SELECT * FROM equipment ORDER BY created_at ASC"
      );
      return result.rows.map(rowToEquipment);
    }

    return this.equipment.map(cloneEquipment);
  }

  async findById(id: string): Promise<Equipment | null> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query("SELECT * FROM equipment WHERE id = $1", [id]);
      return result.rows[0] ? rowToEquipment(result.rows[0]) : null;
    }

    const equipment = this.equipment.find((item) => item.id === id);
    return equipment ? cloneEquipment(equipment) : null;
  }

  async findByLocationId(locationId: string): Promise<Equipment[]> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        "SELECT * FROM equipment WHERE location_id = $1 ORDER BY created_at ASC",
        [locationId]
      );
      return result.rows.map(rowToEquipment);
    }

    return this.equipment
      .filter((item) => item.locationId === locationId)
      .map(cloneEquipment);
  }

  async create(equipment: Equipment): Promise<Equipment> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        `
        INSERT INTO equipment (
          id, code, name, type, model, serial_number, status, location_id,
          responsible_user_id, notes, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        `,
        [
          equipment.id,
          equipment.code,
          equipment.name,
          equipment.type,
          equipment.model ?? null,
          equipment.serialNumber ?? null,
          equipment.status,
          equipment.locationId ?? null,
          equipment.responsibleUserId ?? null,
          equipment.notes ?? null,
          equipment.createdAt,
          equipment.updatedAt
        ]
      );

      return rowToEquipment(result.rows[0]);
    }

    this.equipment.push(cloneEquipment(equipment));
    return cloneEquipment(equipment);
  }

  async update(id: string, changes: Partial<Equipment>): Promise<Equipment | null> {
    if (isDatabaseEnabled()) {
      const entries = Object.entries(changes);

      if (entries.length === 0) {
        return this.findById(id);
      }

      const columns: Record<string, string> = {
        code: "code",
        name: "name",
        type: "type",
        model: "model",
        serialNumber: "serial_number",
        status: "status",
        locationId: "location_id",
        responsibleUserId: "responsible_user_id",
        notes: "notes",
        createdAt: "created_at",
        updatedAt: "updated_at"
      };

      const setClauses = entries.map(([key], index) => `${columns[key]} = $${index + 2}`);
      const values = entries.map(([, value]) => value ?? null);
      const result = await getPool().query(
        `UPDATE equipment SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

      return result.rows[0] ? rowToEquipment(result.rows[0]) : null;
    }

    const index = this.equipment.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.equipment[index] = {
      ...this.equipment[index],
      ...changes
    };

    return cloneEquipment(this.equipment[index]);
  }

  async delete(id: string): Promise<boolean> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query("DELETE FROM equipment WHERE id = $1", [id]);
      return (result.rowCount ?? 0) > 0;
    }

    const initialLength = this.equipment.length;
    this.equipment = this.equipment.filter((item) => item.id !== id);
    return this.equipment.length < initialLength;
  }
}

export const equipmentRepository = new EquipmentRepository();
