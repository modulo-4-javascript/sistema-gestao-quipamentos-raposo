import { LocationStatus, LocationType, type Location } from "./locations.types";

export const LOCATION_SEED_IDS = {
  lab01: "11111111-1111-4111-8111-111111111111",
  lab02: "22222222-2222-4222-8222-222222222222",
  coordination: "33333333-3333-4333-8333-333333333333",
  storage: "44444444-4444-4444-8444-444444444444",
  maintenance: "55555555-5555-4555-8555-555555555555",
  network: "66666666-6666-4666-8666-666666666666"
};

export const locationsSeed: Location[] = [
  {
    id: LOCATION_SEED_IDS.lab01,
    code: "LAB-01",
    name: "Lab 01",
    type: LocationType.LABORATORY,
    building: "Main Building",
    floor: "1st floor",
    room: "101",
    description: "Main computer laboratory for practical classes.",
    status: LocationStatus.ACTIVE,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z"
  },
  {
    id: LOCATION_SEED_IDS.lab02,
    code: "LAB-02",
    name: "Lab 02",
    type: LocationType.LABORATORY,
    building: "Main Building",
    floor: "1st floor",
    room: "102",
    description: "Secondary laboratory used for workshops.",
    status: LocationStatus.ACTIVE,
    createdAt: "2026-01-10T10:05:00.000Z",
    updatedAt: "2026-01-10T10:05:00.000Z"
  },
  {
    id: LOCATION_SEED_IDS.coordination,
    code: "COORD",
    name: "Coordination",
    type: LocationType.OFFICE,
    building: "Administrative Building",
    floor: "2nd floor",
    room: "201",
    description: "Course coordination office.",
    status: LocationStatus.ACTIVE,
    createdAt: "2026-01-10T10:10:00.000Z",
    updatedAt: "2026-01-10T10:10:00.000Z"
  },
  {
    id: LOCATION_SEED_IDS.storage,
    code: "STORAGE",
    name: "Storage",
    type: LocationType.STORAGE,
    building: "Support Building",
    floor: "Ground floor",
    room: "S01",
    description: "Temporary storage for available equipment.",
    status: LocationStatus.ACTIVE,
    createdAt: "2026-01-10T10:15:00.000Z",
    updatedAt: "2026-01-10T10:15:00.000Z"
  },
  {
    id: LOCATION_SEED_IDS.maintenance,
    code: "MAINT",
    name: "Maintenance Room",
    type: LocationType.MAINTENANCE,
    building: "Support Building",
    floor: "Ground floor",
    room: "M01",
    description: "Place used for repairs and preventive maintenance.",
    status: LocationStatus.ACTIVE,
    createdAt: "2026-01-10T10:20:00.000Z",
    updatedAt: "2026-01-10T10:20:00.000Z"
  },
  {
    id: LOCATION_SEED_IDS.network,
    code: "NET-ROOM",
    name: "Network Room",
    type: LocationType.NETWORK,
    building: "Main Building",
    floor: "Ground floor",
    room: "N01",
    description: "Restricted room for network infrastructure.",
    status: LocationStatus.ACTIVE,
    createdAt: "2026-01-10T10:25:00.000Z",
    updatedAt: "2026-01-10T10:25:00.000Z"
  }
];
