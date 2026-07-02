import type { EquipmentSummary } from "../equipment/equipment.types";
import type { EquipmentStatus } from "../equipment/equipment.types";

export enum LocationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum LocationType {
  LABORATORY = "LABORATORY",
  OFFICE = "OFFICE",
  STORAGE = "STORAGE",
  MAINTENANCE = "MAINTENANCE",
  NETWORK = "NETWORK",
  OTHER = "OTHER"
}

export type Location = {
  id: string;
  code: string;
  name: string;
  type: LocationType;
  building?: string;
  floor?: string;
  room?: string;
  description?: string | null;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
};

export type LocationDetails = Location & {
  equipmentCount: number;
  equipmentSummary: EquipmentSummary;
};

export type LocationSummary = {
  total: number;
  active: number;
  inactive: number;
  equipmentCount: number;
};

export type CreateLocationInput = {
  code: string;
  name: string;
  type: LocationType;
  building?: string;
  floor?: string;
  room?: string;
  description?: string | null;
  status?: LocationStatus;
};

export type UpdateLocationInput = Partial<CreateLocationInput>;

export type UpdateLocationStatusInput = {
  status: LocationStatus;
  note?: string | null;
};

export type ListLocationsQuery = {
  search?: string;
  status?: LocationStatus;
  type?: LocationType;
  page: number;
  pageSize: number;
};

export type ListLocationEquipmentQuery = {
  status?: EquipmentStatus;
  page: number;
  pageSize: number;
};
