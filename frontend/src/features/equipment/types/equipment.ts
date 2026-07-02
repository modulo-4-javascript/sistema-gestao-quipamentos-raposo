// Estes tipos espelham os valores aceitos pela API.
// Usamos tipos para o TypeScript avisar quando a tela tenta enviar um dado inválido.
export type EquipmentStatus = 'AVAILABLE' | 'IN_MAINTENANCE' | 'INACTIVE'

export type EquipmentType =
  | 'NOTEBOOK'
  | 'MONITOR'
  | 'PRINTER'
  | 'NETWORK'
  | 'PERIPHERAL'
  | 'OTHER'

export type SummaryIconName = 'total' | 'available' | 'maintenance' | 'inactive'

// Tipo principal usado pela tabela de equipamentos.
// Ele descreve o formato mínimo que a tela precisa para renderizar a listagem.
export interface Equipment {
  id: string
  code: string
  name: string
  type: EquipmentType
  model?: string
  serialNumber?: string
  status: EquipmentStatus
  locationId?: string | null
  locationName?: string
  responsibleUserId?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface EquipmentSummary {
  id: string
  title: string
  value: number
  icon: SummaryIconName
  lineColor: string
  iconBackground: string
}

export interface EquipmentSummaryResponse {
  total: number
  available: number
  inMaintenance: number
  inactive: number
}

export interface EquipmentHistoryItem {
  id: string
  type: string
  equipmentId: string
  fromLocationId?: string | null
  toLocationId?: string | null
  title: string
  description: string
  userId?: string | null
  createdAt: string
}

export interface EquipmentDetail extends Equipment {
  recentHistory: EquipmentHistoryItem[]
}

export interface EquipmentDetailSummary {
  id: string
  title: string
  value: string
  description: string
}

export interface EquipmentLocationOption {
  id: string
  label: string
}

export interface CreateEquipmentPayload {
  name: string
  type?: EquipmentType
  model?: string
  serialNumber?: string
  status?: EquipmentStatus
  locationId?: string | null
  responsibleUserId?: string | null
  notes?: string | null
}

export type UpdateEquipmentPayload = Partial<CreateEquipmentPayload>

export interface UpdateEquipmentStatusPayload {
  status: EquipmentStatus
  note?: string | null
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PaginationMeta
}

export const statusOptions: EquipmentStatus[] = ['AVAILABLE', 'IN_MAINTENANCE', 'INACTIVE']

export const typeOptions: EquipmentType[] = [
  'NOTEBOOK',
  'MONITOR',
  'PRINTER',
  'NETWORK',
  'PERIPHERAL',
  'OTHER',
]

const statusLabels: Record<EquipmentStatus, string> = {
  AVAILABLE: 'Disponível',
  IN_MAINTENANCE: 'Em manutenção',
  INACTIVE: 'Inativo',
}

const typeLabels: Record<EquipmentType, string> = {
  NOTEBOOK: 'Notebook',
  MONITOR: 'Monitor',
  PRINTER: 'Impressora',
  NETWORK: 'Rede',
  PERIPHERAL: 'Periférico',
  OTHER: 'Outro',
}

export function getEquipmentStatusLabel(status: EquipmentStatus) {
  return statusLabels[status]
}

export function getEquipmentTypeLabel(type?: EquipmentType) {
  return type ? typeLabels[type] : 'Não informado'
}

export function formatEquipmentDate(value?: string) {
  if (!value) {
    return 'Não informado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
