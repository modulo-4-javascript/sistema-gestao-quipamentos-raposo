import { EQUIPMENT_SEED_IDS } from "../equipment/equipment.seed";
import { LOCATION_SEED_IDS } from "../locations/locations.seed";
import { EquipmentHistoryType, type HistoryItem } from "./history.types";

export const historySeed: HistoryItem[] = [
  {
    id: "10101010-1010-4010-8010-101010101010",
    type: EquipmentHistoryType.CREATED,
    equipmentId: EQUIPMENT_SEED_IDS.notebook,
    toLocationId: LOCATION_SEED_IDS.lab01,
    title: "Equipment created",
    description: "Dell Notebook was registered in the inventory.",
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "20202020-2020-4020-8020-202020202020",
    type: EquipmentHistoryType.LINKED_TO_LOCATION,
    equipmentId: EQUIPMENT_SEED_IDS.monitor,
    toLocationId: LOCATION_SEED_IDS.lab01,
    title: "Linked to location",
    description: "LG Monitor was linked to Lab 01.",
    createdAt: "2026-01-15T10:06:00.000Z"
  },
  {
    id: "30303030-3030-4030-8030-303030303030",
    type: EquipmentHistoryType.STATUS_CHANGED,
    equipmentId: EQUIPMENT_SEED_IDS.printer,
    toLocationId: LOCATION_SEED_IDS.maintenance,
    title: "Status updated",
    description: "HP Printer status changed from AVAILABLE to IN_MAINTENANCE.",
    createdAt: "2026-01-15T10:11:00.000Z"
  },
  {
    id: "40404040-4040-4040-8040-404040404040",
    type: EquipmentHistoryType.LINKED_TO_LOCATION,
    equipmentId: EQUIPMENT_SEED_IDS.router,
    toLocationId: LOCATION_SEED_IDS.network,
    title: "Linked to location",
    description: "Network Router was linked to Network Room.",
    createdAt: "2026-01-15T10:16:00.000Z"
  },
  {
    id: "50505050-5050-4050-8050-505050505050",
    type: EquipmentHistoryType.LINKED_TO_LOCATION,
    equipmentId: EQUIPMENT_SEED_IDS.keyboard,
    toLocationId: LOCATION_SEED_IDS.storage,
    title: "Linked to location",
    description: "Keyboard Kit was linked to Storage.",
    createdAt: "2026-01-15T10:21:00.000Z"
  },
  {
    id: "60606060-6060-4060-8060-606060606060",
    type: EquipmentHistoryType.STATUS_CHANGED,
    equipmentId: EQUIPMENT_SEED_IDS.projector,
    toLocationId: LOCATION_SEED_IDS.storage,
    title: "Status updated",
    description: "Projector status changed from AVAILABLE to INACTIVE.",
    createdAt: "2026-01-15T10:26:00.000Z"
  }
];
