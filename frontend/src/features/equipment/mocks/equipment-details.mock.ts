import {
  formatEquipmentDate,
  getEquipmentStatusLabel,
  type EquipmentDetail,
  type EquipmentDetailSummary,
} from '../types/equipment'

// AULA 06:
// Este mock representa o retorno futuro de GET /equipment/{equipmentId}.
// Na Aula 07, a tela passa a buscar estes dados na API real.
export const equipmentDetailsMock: EquipmentDetail[] = [
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    code: 'EQP-001',
    name: 'Notebook Dell',
    type: 'NOTEBOOK',
    model: 'Latitude 5420',
    status: 'AVAILABLE',
    locationId: '11111111-1111-4111-8111-111111111111',
    locationName: 'LAB-01 - Lab 01',
    serialNumber: 'DL-5420-2026',
    responsibleUserName: 'Equipe de patrimônio',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    notes:
      'Equipamento disponível para uso em aulas práticas. Última revisão realizada sem pendências.',
    recentHistory: [
      {
        id: 'history-001',
        type: 'STATUS_CHANGED',
        equipmentId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        title: 'Status updated',
        description: 'Changed from IN_MAINTENANCE to AVAILABLE.',
        createdAt: '2026-01-20T14:30:00.000Z',
      },
      {
        id: 'history-002',
        type: 'CREATED',
        equipmentId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        title: 'Equipment created',
        description: 'Dell Notebook was registered in the inventory.',
        createdAt: '2026-01-15T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    code: 'EQP-002',
    name: 'Monitor LG',
    type: 'MONITOR',
    model: 'UltraWide 29"',
    status: 'AVAILABLE',
    locationId: '11111111-1111-4111-8111-111111111111',
    locationName: 'LAB-01 - Lab 01',
    serialNumber: 'LG-29-042',
    responsibleUserName: 'Equipe de patrimônio',
    createdAt: '2026-01-15T10:05:00.000Z',
    updatedAt: '2026-01-15T10:05:00.000Z',
    notes: 'Monitor usado junto à estação do professor.',
    recentHistory: [
      {
        id: 'history-003',
        type: 'CREATED',
        equipmentId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        title: 'Equipment created',
        description: 'LG Monitor was registered in the inventory.',
        createdAt: '2026-01-15T10:05:00.000Z',
      },
    ],
  },
]

export function getEquipmentDetailSummary(equipment: EquipmentDetail): EquipmentDetailSummary[] {
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

export const equipmentDetailSummaryMock: EquipmentDetailSummary[] = equipmentDetailsMock[0]
  ? getEquipmentDetailSummary(equipmentDetailsMock[0])
  : []

export function findEquipmentDetailById(equipmentId?: string) {
  return equipmentDetailsMock.find((equipment) => equipment.id === equipmentId)
}
