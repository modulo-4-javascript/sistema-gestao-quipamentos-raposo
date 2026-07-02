import { LOCATION_SEED_IDS } from "../locations/locations.seed";
import { EquipmentStatus, EquipmentType, type Equipment } from "./equipment.types";

export const EQUIPMENT_SEED_IDS = {
  notebook: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  monitor: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  printer: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  router: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  keyboard: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  projector: "ffffffff-ffff-4fff-8fff-ffffffffffff"
};

export const equipmentSeed: Equipment[] = [
  {
    id: EQUIPMENT_SEED_IDS.notebook,
    code: "EQP-001",
    name: "Dell Notebook",
    type: EquipmentType.NOTEBOOK,
    model: "Latitude 5420",
    serialNumber: "DL-5420-2026",
    status: EquipmentStatus.AVAILABLE,
    locationId: LOCATION_SEED_IDS.lab01,
    notes: "Equipment available for practical classes.",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: EQUIPMENT_SEED_IDS.monitor,
    code: "EQP-002",
    name: "LG Monitor",
    type: EquipmentType.MONITOR,
    model: "UltraWide 29",
    serialNumber: "LG-29-2026",
    status: EquipmentStatus.AVAILABLE,
    locationId: LOCATION_SEED_IDS.lab01,
    notes: "Monitor used with the instructor workstation.",
    createdAt: "2026-01-15T10:05:00.000Z",
    updatedAt: "2026-01-15T10:05:00.000Z"
  },
  {
    id: EQUIPMENT_SEED_IDS.printer,
    code: "EQP-003",
    name: "HP Printer",
    type: EquipmentType.PRINTER,
    model: "LaserJet Pro",
    serialNumber: "HP-LJ-2026",
    status: EquipmentStatus.IN_MAINTENANCE,
    locationId: LOCATION_SEED_IDS.maintenance,
    notes: "Waiting for toner replacement.",
    createdAt: "2026-01-15T10:10:00.000Z",
    updatedAt: "2026-01-15T10:10:00.000Z"
  },
  {
    id: EQUIPMENT_SEED_IDS.router,
    code: "EQP-004",
    name: "Network Router",
    type: EquipmentType.NETWORK,
    model: "EdgeRouter X",
    serialNumber: "NET-RTR-2026",
    status: EquipmentStatus.AVAILABLE,
    locationId: LOCATION_SEED_IDS.network,
    notes: "Backup router for lab network.",
    createdAt: "2026-01-15T10:15:00.000Z",
    updatedAt: "2026-01-15T10:15:00.000Z"
  },
  {
    id: EQUIPMENT_SEED_IDS.keyboard,
    code: "EQP-005",
    name: "Keyboard Kit",
    type: EquipmentType.PERIPHERAL,
    model: "USB Standard",
    serialNumber: "KEY-KIT-2026",
    status: EquipmentStatus.AVAILABLE,
    locationId: LOCATION_SEED_IDS.storage,
    notes: "Spare keyboard and mouse kit.",
    createdAt: "2026-01-15T10:20:00.000Z",
    updatedAt: "2026-01-15T10:20:00.000Z"
  },
  {
    id: EQUIPMENT_SEED_IDS.projector,
    code: "EQP-006",
    name: "Projector",
    type: EquipmentType.OTHER,
    model: "Epson X39",
    serialNumber: "EPS-X39-2026",
    status: EquipmentStatus.INACTIVE,
    locationId: LOCATION_SEED_IDS.storage,
    notes: "Older projector kept as backup.",
    createdAt: "2026-01-15T10:25:00.000Z",
    updatedAt: "2026-01-15T10:25:00.000Z"
  }
];
