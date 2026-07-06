import type { DetailSummaryCardItem } from '../../../shared/components/DetailSummaryCards'
import {
  formatEquipmentDate,
  getEquipmentStatusLabel,
  type EquipmentDetail,
} from '../types/equipment'

// AULA 06:
// Este mock representa o retorno futuro de GET /equipment/{equipmentId}.
// Na Aula 07, a tela passa a buscar estes dados na API real.
export const equipmentDetailsMock: EquipmentDetail[] = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    code: 'EQP-001',
    name: 'Notebook do Professor',
    type: 'NOTEBOOK',
    model: 'Dell Latitude 5420',
    status: 'AVAILABLE',
    locationId: '11111111-1111-4111-8111-111111111111',
    locationName: 'LAB-1 - Lab Info 1',
    serialNumber: 'NB-DENKEN-001',
    responsibleUserName: 'Professor da disciplina',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    notes:
      'Equipamento usado para projetar exemplos e testar a aplicação durante a aula.',
    recentHistory: [
      {
        id: 'history-001',
        type: 'STATUS_CHANGED',
        equipmentId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        title: 'Status atualizado',
        description: 'Notebook do Professor voltou a ficar disponível.',
        createdAt: '2026-01-20T14:30:00.000Z',
      },
      {
        id: 'history-002',
        type: 'CREATED',
        equipmentId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        title: 'Equipamento cadastrado',
        description: 'Notebook do Professor foi registrado no inventário.',
        createdAt: '2026-01-15T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    code: 'EQP-002',
    name: 'Monitor da Bancada 01',
    type: 'MONITOR',
    model: 'LG UltraWide 29',
    status: 'AVAILABLE',
    locationId: '11111111-1111-4111-8111-111111111111',
    locationName: 'LAB-1 - Lab Info 1',
    serialNumber: 'MON-LAB01-001',
    responsibleUserName: 'Equipe de patrimônio',
    createdAt: '2026-01-15T10:05:00.000Z',
    updatedAt: '2026-01-15T10:05:00.000Z',
    notes: 'Monitor extra disponível para demonstrações e atividades em dupla.',
    recentHistory: [
      {
        id: 'history-003',
        type: 'CREATED',
        equipmentId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        title: 'Equipamento cadastrado',
        description: 'Monitor da Bancada 01 foi registrado no inventário.',
        createdAt: '2026-01-15T10:05:00.000Z',
      },
    ],
  },
]

export function getEquipmentDetailSummary(
  equipment: EquipmentDetail,
): DetailSummaryCardItem[] {
  return [
    {
      id: 'status',
      title: 'Status',
      value: getEquipmentStatusLabel(equipment.status),
      description: equipment.status === 'AVAILABLE' ? 'Pronto para uso' : 'Acompanha restrição',
    },
    {
      id: 'location',
      title: 'Localização',
      value: equipment.locationName ?? 'Sem localização',
      description: 'Setor atual',
    },
    {
      id: 'responsible',
      title: 'Responsável',
      value: equipment.responsibleUserName ?? 'Equipe de patrimônio',
      description: 'Pessoa de referência',
    },
    {
      id: 'updatedAt',
      title: 'Atualizado',
      value: formatEquipmentDate(equipment.updatedAt),
      description: 'Última alteração',
    },
  ]
}

export const equipmentDetailSummaryMock: DetailSummaryCardItem[] = equipmentDetailsMock[0]
  ? getEquipmentDetailSummary(equipmentDetailsMock[0])
  : []

export function findEquipmentDetailById(equipmentId?: string) {
  return equipmentDetailsMock.find((equipment) => equipment.id === equipmentId)
}
