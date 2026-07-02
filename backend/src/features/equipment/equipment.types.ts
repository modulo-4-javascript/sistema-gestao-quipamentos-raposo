import type { HistoryItem } from "../history/history.types";

export enum EquipmentStatus {
  AVAILABLE = "AVAILABLE",
  IN_MAINTENANCE = "IN_MAINTENANCE",
  INACTIVE = "INACTIVE"
}

export enum EquipmentType {
  NOTEBOOK = "NOTEBOOK",
  MONITOR = "MONITOR",
  PRINTER = "PRINTER",
  NETWORK = "NETWORK",
  PERIPHERAL = "PERIPHERAL",
  OTHER = "OTHER"
}

export type Equipment = {
  id: string;
  code: string;
  name: string;
  type: EquipmentType;
  model?: string;
  serialNumber?: string;
  status: EquipmentStatus;
  locationId?: string | null;
  responsibleUserId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EquipmentSummary = {
  total: number;
  available: number;
  inMaintenance: number;
  inactive: number;
};

export type EquipmentDetails = Equipment & {
  recentHistory: HistoryItem[];
};

export type CreateEquipmentInput = {
  name: string;
  type?: EquipmentType;
  model?: string;
  serialNumber?: string;
  status?: EquipmentStatus;
  locationId?: string | null;
  responsibleUserId?: string | null;
  notes?: string | null;
};

export type UpdateEquipmentInput = Partial<CreateEquipmentInput>;

export type UpdateEquipmentStatusInput = {
  status: EquipmentStatus;
  note?: string | null;
};

export type ListEquipmentQuery = {
  search?: string;
  status?: EquipmentStatus;
  type?: EquipmentType;
  locationId?: string;
  page: number;
  pageSize: number;
};
