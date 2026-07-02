import { apiRequest } from '../../../services/api'
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

interface ListEquipmentParams {
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

function toQueryString(params: ListEquipmentParams) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  })

  return query.toString()
}

// Este service é o lugar onde o frontend conversa com o backend.
// A tela chama funções em TypeScript; o service transforma isso em GET, POST, PUT e PATCH.
export const equipmentService = {
  list(params: ListEquipmentParams = {}) {
    // GET busca dados. Aqui a API devolve { data, meta } e a tela usa data na tabela.
    const query = toQueryString({
      page: 1,
      pageSize: 100,
      ...params,
    })

    return apiRequest<PaginatedResult<Equipment>>(`/equipment?${query}`)
  },

  summary() {
    // GET /summary devolve os números usados nos cards do topo.
    return apiRequest<EquipmentSummaryResponse>('/equipment/summary')
  },

  getById(equipmentId: string) {
    // GET com ID busca apenas um equipamento para a tela de detalhes.
    return apiRequest<EquipmentDetail>(`/equipment/${equipmentId}`)
  },

  create(payload: CreateEquipmentPayload) {
    // POST cria um novo registro no backend.
    return apiRequest<EquipmentDetail>('/equipment', {
      method: 'POST',
      body: payload,
    })
  },

  update(equipmentId: string, payload: UpdateEquipmentPayload) {
    // PUT substitui/atualiza os dados principais do equipamento.
    return apiRequest<EquipmentDetail>(`/equipment/${equipmentId}`, {
      method: 'PUT',
      body: payload,
    })
  },

  updateStatus(equipmentId: string, payload: UpdateEquipmentStatusPayload) {
    // PATCH altera apenas uma parte do recurso: aqui, o status.
    return apiRequest<EquipmentDetail>(`/equipment/${equipmentId}/status`, {
      method: 'PATCH',
      body: payload,
    })
  },

  async listLocationOptions() {
    // Base didática para a aula: usamos localizações apenas para preencher o select.
    // TODO Projeto Final: mover esta lógica para um locationService completo.
    const response = await apiRequest<PaginatedResult<ApiLocation>>(
      '/locations?page=1&pageSize=100',
    )

    return response.data.map<EquipmentLocationOption>((location) => ({
      id: location.id,
      label: `${location.code} - ${location.name}`,
    }))
  },
}
