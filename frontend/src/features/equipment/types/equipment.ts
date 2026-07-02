export type EquipmentStatus = 'Disponível' | 'Em manutenção' | 'Inativo'

export type EquipmentType =
  | 'Informática'
  | 'Imagem'
  | 'Laboratório'
  | 'Rede'
  | 'Impressão'

export type SummaryIconName = 'total' | 'available' | 'maintenance' | 'inactive'

// Tipo principal usado pela tabela de equipamentos.
// Ele descreve o formato mínimo que a tela precisa para renderizar a listagem.
export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  model: string
  status: EquipmentStatus
  location: string
  lastUpdate: string
  serialNumber: string
}

export interface EquipmentSummary {
  id: string
  title: string
  value: number
  icon: SummaryIconName
  lineColor: string
  iconBackground: string
}

export interface EquipmentResponsible {
  initials: string
  name: string
}

export interface EquipmentHistoryItem {
  id: string
  date: string
  title: string
  description: string
}

export interface EquipmentDetail extends Equipment {
  responsible: EquipmentResponsible
  createdAt: string
  notes: string
  history: EquipmentHistoryItem[]
}

export interface EquipmentDetailSummary {
  id: string
  title: string
  value: string
  description: string
}
