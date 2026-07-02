export enum EquipmentHistoryType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  LOCATION_CHANGED = "LOCATION_CHANGED",
  LINKED_TO_LOCATION = "LINKED_TO_LOCATION",
  REMOVED_FROM_LOCATION = "REMOVED_FROM_LOCATION",
  DELETED = "DELETED"
}

export type HistoryItem = {
  id: string;
  type: EquipmentHistoryType;
  equipmentId: string;
  fromLocationId?: string | null;
  toLocationId?: string | null;
  title: string;
  description: string;
  userName?: string | null;
  createdAt: string;
};

export type CreateHistoryItemInput = Omit<HistoryItem, "id" | "createdAt"> & {
  createdAt?: string;
};
