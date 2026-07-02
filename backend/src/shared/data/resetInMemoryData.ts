import { equipmentRepository } from "../../features/equipment/equipment.repository";
import { historyRepository } from "../../features/history/history.repository";
import { locationsRepository } from "../../features/locations/locations.repository";

export function resetInMemoryData(): void {
  locationsRepository.reset();
  equipmentRepository.reset();
  historyRepository.reset();
}
