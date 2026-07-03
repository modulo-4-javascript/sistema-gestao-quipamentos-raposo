import { api } from '../../../services/api'
import type {
  CreateEquipmentPayload,
  Equipment,
  EquipmentDetail,
  EquipmentLocationOption,
  EquipmentStatus,
  EquipmentSummaryResponse,
  EquipmentType,
  PaginatedResult,
  UpdateEquipmentPayload,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'

export interface ListEquipmentParams {
  search?: string
  status?: EquipmentStatus
  type?: EquipmentType
  page?: number
  pageSize?: number
}

interface ApiLocation {
  id: string
  code: string
  name: string
}

// Este service é o lugar onde o frontend conversa com o backend.
// A tela chama funções em TypeScript; o service transforma isso em GET, POST, PUT e PATCH.
export const equipmentService = {
  list(params: ListEquipmentParams = {}) {
    // GET busca dados. Aqui a API devolve { data, meta } e a tela usa data na tabela.
    return api
      .get<PaginatedResult<Equipment>>('/equipment', {
        params: {
          page: 1,
          pageSize: 100,
          ...params,
        },
      })
      .then((response) => response.data)
  },

  summary() {
    // GET /summary devolve os números usados nos cards do topo.
    return api
      .get<EquipmentSummaryResponse>('/equipment/summary')
      .then((response) => response.data)
  },

  getById(equipmentId: string) {
    // GET com ID busca apenas um equipamento para a tela de detalhes.
    return api
      .get<EquipmentDetail>(`/equipment/${equipmentId}`)
      .then((response) => response.data)
  },

  create(payload: CreateEquipmentPayload) {
    // POST cria um novo registro no backend.
    return api.post<EquipmentDetail>('/equipment', payload).then((response) => response.data)
  },

  update(equipmentId: string, payload: UpdateEquipmentPayload) {
    // PUT substitui/atualiza os dados principais do equipamento.
    return api
      .put<EquipmentDetail>(`/equipment/${equipmentId}`, payload)
      .then((response) => response.data)
  },

  updateStatus(equipmentId: string, payload: UpdateEquipmentStatusPayload) {
    // PATCH altera apenas uma parte do recurso: aqui, o status.
    return api
      .patch<EquipmentDetail>(`/equipment/${equipmentId}/status`, payload)
      .then((response) => response.data)
  },

  async listLocationOptions() {
    // Base didática para a aula: usamos localizações apenas para preencher o select.
    // TODO Projeto Final: mover esta lógica para um locationService completo.
    const response = await api.get<PaginatedResult<ApiLocation>>('/locations', {
      params: {
        page: 1,
        pageSize: 100,
      },
    })

    return response.data.data.map<EquipmentLocationOption>((location) => ({
      id: location.id,
      label: `${location.code} - ${location.name}`,
    }))
  },
}
