import type { Equipment, EquipmentHistoryItem, EquipmentStatus } from '../../equipment/types/equipment'

export type LocationStatus = 'ACTIVE' | 'INACTIVE'

export type LocationType =
  | 'LABORATORY'
  | 'OFFICE'
  | 'STORAGE'
  | 'MAINTENANCE'
  | 'NETWORK'
  | 'OTHER'

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResult<RecordData> {
  data: RecordData[]
  meta: PaginationMeta
}

export interface Location {
  id: string
  code: string
  name: string
  type: LocationType
  building?: string
  floor?: string
  room?: string
  description?: string | null
  status: LocationStatus
  createdAt: string
  updatedAt: string
}

export interface LocationSummaryResponse {
  total: number
  active: number
  inactive: number
  equipmentCount: number
}

export interface LocationDetails extends Location {
  equipmentCount: number
  equipmentSummary: {
    total: number
    available: number
    inMaintenance: number
    inactive: number
  }
}

export interface GetLocationListParams {
  search?: string
  status?: LocationStatus
  type?: LocationType
  page?: number
  pageSize?: number
}

export interface GetLocationEquipmentParams {
  status?: EquipmentStatus
  page?: number
  pageSize?: number
}

export interface CreateLocationPayload {
  code: string
  name: string
  type: LocationType
  building?: string
  floor?: string
  room?: string
  description?: string | null
  status?: LocationStatus
}

export type UpdateLocationPayload = Partial<CreateLocationPayload>

export interface UpdateLocationStatusPayload {
  status: LocationStatus
  note?: string | null
}

export type LocationEquipment = Equipment

export type LocationHistoryItem = EquipmentHistoryItem

export const locationStatusOptions: LocationStatus[] = ['ACTIVE', 'INACTIVE']

export const locationTypeOptions: LocationType[] = [
  'LABORATORY',
  'OFFICE',
  'STORAGE',
  'MAINTENANCE',
  'NETWORK',
  'OTHER',
]

const locationStatusLabels: Record<LocationStatus, string> = {
  ACTIVE: 'Ativa',
  INACTIVE: 'Inativa',
}

const locationTypeLabels: Record<LocationType, string> = {
  LABORATORY: 'Laboratório',
  OFFICE: 'Administrativo',
  STORAGE: 'Almoxarifado',
  MAINTENANCE: 'Manutenção',
  NETWORK: 'Redes',
  OTHER: 'Outro',
}

export function getLocationStatusLabel(status: LocationStatus) {
  return locationStatusLabels[status]
}

export function getLocationTypeLabel(type?: LocationType) {
  return type ? locationTypeLabels[type] : 'Não informado'
}

export function formatLocationDate(value?: string) {
  if (!value) {
    return 'Não informado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
