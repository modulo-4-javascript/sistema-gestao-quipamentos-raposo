import type { QueryResultRow } from "pg";

import { getPool } from "../../shared/database/connection";
import { isDatabaseEnabled } from "../../shared/database/config";
import { locationsSeed } from "./locations.seed";
import type { Location } from "./locations.types";

function cloneLocation(location: Location): Location {
  return { ...location };
}

function rowToLocation(row: QueryResultRow): Location {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    building: row.building ?? undefined,
    floor: row.floor ?? undefined,
    room: row.room ?? undefined,
    description: row.description,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

export class LocationsRepository {
  private locations = locationsSeed.map(cloneLocation);

  reset(): void {
    this.locations = locationsSeed.map(cloneLocation);
  }

  async findAll(): Promise<Location[]> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query("SELECT * FROM locations ORDER BY code ASC");
      return result.rows.map(rowToLocation);
    }

    return this.locations.map(cloneLocation);
  }

  async findById(id: string): Promise<Location | null> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query("SELECT * FROM locations WHERE id = $1", [id]);
      return result.rows[0] ? rowToLocation(result.rows[0]) : null;
    }

    const location = this.locations.find((item) => item.id === id);
    return location ? cloneLocation(location) : null;
  }

  async findByCode(code: string): Promise<Location | null> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query("SELECT * FROM locations WHERE code = $1", [
        code
      ]);
      return result.rows[0] ? rowToLocation(result.rows[0]) : null;
    }

    const location = this.locations.find((item) => item.code === code);
    return location ? cloneLocation(location) : null;
  }

  async create(location: Location): Promise<Location> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query(
        `
        INSERT INTO locations (
          id, code, name, type, building, floor, room, description, status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
        `,
        [
          location.id,
          location.code,
          location.name,
          location.type,
          location.building ?? null,
          location.floor ?? null,
          location.room ?? null,
          location.description ?? null,
          location.status,
          location.createdAt,
          location.updatedAt
        ]
      );

      return rowToLocation(result.rows[0]);
    }

    this.locations.push(cloneLocation(location));
    return cloneLocation(location);
  }

  async update(id: string, changes: Partial<Location>): Promise<Location | null> {
    if (isDatabaseEnabled()) {
      const entries = Object.entries(changes);

      if (entries.length === 0) {
        return this.findById(id);
      }

      const columns: Record<string, string> = {
        code: "code",
        name: "name",
        type: "type",
        building: "building",
        floor: "floor",
        room: "room",
        description: "description",
        status: "status",
        createdAt: "created_at",
        updatedAt: "updated_at"
      };

      const setClauses = entries.map(([key], index) => `${columns[key]} = $${index + 2}`);
      const values = entries.map(([, value]) => value ?? null);
      const result = await getPool().query(
        `UPDATE locations SET ${setClauses.join(", ")} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

      return result.rows[0] ? rowToLocation(result.rows[0]) : null;
    }

    const index = this.locations.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    this.locations[index] = {
      ...this.locations[index],
      ...changes
    };

    return cloneLocation(this.locations[index]);
  }

  async delete(id: string): Promise<boolean> {
    if (isDatabaseEnabled()) {
      const result = await getPool().query("DELETE FROM locations WHERE id = $1", [id]);
      return (result.rowCount ?? 0) > 0;
    }

    const initialLength = this.locations.length;
    this.locations = this.locations.filter((item) => item.id !== id);
    return this.locations.length < initialLength;
  }
}

export const locationsRepository = new LocationsRepository();
