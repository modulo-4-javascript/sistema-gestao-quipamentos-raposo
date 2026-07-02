import { equipmentSeed } from "../../features/equipment/equipment.seed";
import { historySeed } from "../../features/history/history.seed";
import { locationsSeed } from "../../features/locations/locations.seed";
import { isDatabaseEnabled } from "./config";
import { getPool } from "./connection";

const createTablesSql = `
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY,
  code varchar(20) NOT NULL UNIQUE,
  name varchar(120) NOT NULL,
  type varchar(40) NOT NULL,
  building varchar(120),
  floor varchar(40),
  room varchar(40),
  description text,
  status varchar(40) NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY,
  code varchar(20) NOT NULL UNIQUE,
  name varchar(120) NOT NULL,
  type varchar(40) NOT NULL,
  model varchar(120),
  serial_number varchar(80),
  status varchar(40) NOT NULL,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  responsible_user_name varchar(120),
  notes text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment_history (
  id uuid PRIMARY KEY,
  type varchar(60) NOT NULL,
  equipment_id uuid NOT NULL,
  from_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  to_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  title varchar(160) NOT NULL,
  description text NOT NULL,
  user_name varchar(120),
  created_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_equipment_location_id ON equipment(location_id);
CREATE INDEX IF NOT EXISTS idx_history_equipment_id ON equipment_history(equipment_id);
CREATE INDEX IF NOT EXISTS idx_history_locations
  ON equipment_history(from_location_id, to_location_id);
`;

export async function initializeDatabase(): Promise<void> {
  if (!isDatabaseEnabled()) {
    console.log("DATABASE_URL not configured. Using in-memory storage.");
    return;
  }

  const pool = getPool();
  await pool.query(createTablesSql);
  await pool.query(`
    ALTER TABLE equipment
      ADD COLUMN IF NOT EXISTS responsible_user_name varchar(120);

    ALTER TABLE equipment_history
      ADD COLUMN IF NOT EXISTS user_name varchar(120);
  `);
  await seedLocations();
  await seedEquipment();
  await seedHistory();
}

async function seedLocations(): Promise<void> {
  const pool = getPool();

  for (const location of locationsSeed) {
    await pool.query(
      `
      INSERT INTO locations (
        id, code, name, type, building, floor, room, description, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO NOTHING
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
  }
}

async function seedEquipment(): Promise<void> {
  const pool = getPool();

  for (const equipment of equipmentSeed) {
    await pool.query(
      `
      INSERT INTO equipment (
        id, code, name, type, model, serial_number, status, location_id,
        responsible_user_name, notes, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE
      SET responsible_user_name = COALESCE(
        equipment.responsible_user_name,
        EXCLUDED.responsible_user_name
      )
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
        equipment.responsibleUserName ?? null,
        equipment.notes ?? null,
        equipment.createdAt,
        equipment.updatedAt
      ]
    );
  }
}

async function seedHistory(): Promise<void> {
  const pool = getPool();

  for (const history of historySeed) {
    const equipmentExists = await pool.query("SELECT 1 FROM equipment WHERE id = $1", [
      history.equipmentId
    ]);

    if (equipmentExists.rowCount === 0 && history.type !== "DELETED") {
      continue;
    }

    await pool.query(
      `
      INSERT INTO equipment_history (
        id, type, equipment_id, from_location_id, to_location_id, title, description,
        user_name, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        history.id,
        history.type,
        history.equipmentId,
        history.fromLocationId ?? null,
        history.toLocationId ?? null,
        history.title,
        history.description,
        history.userName ?? null,
        history.createdAt
      ]
    );
  }
}
