import { axiosApi } from '../../../services/api'
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

export interface GetEquipmentListParams {
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
  async getEquipmentList(params: GetEquipmentListParams = {}) {
    // GET busca dados. Aqui a API devolve { data, meta } e a tela usa data na tabela.
    const response = await axiosApi.get<PaginatedResult<Equipment>>('/equipment', {
      params: {
        page: 1,
        pageSize: 100,
        // ...params é um spread operator que pega os parâmetros passados e adiciona ao objeto params.
        // spread operator é uma forma de copiar propriedades de um objeto para outro.
        ...params,
      },
    })

    return response.data
  },

  async getEquipmentSummary() {
    // GET /summary devolve os números usados nos cards do topo.
    const response = await axiosApi.get<EquipmentSummaryResponse>('/equipment/summary')

    return response.data
  },

  async getEquipmentById(equipmentId: string) {
    // GET com ID busca apenas um equipamento para a tela de detalhes.
    const response = await axiosApi.get<EquipmentDetail>(`/equipment/${equipmentId}`)

    return response.data
  },

  async createEquipment(payload: CreateEquipmentPayload) {
    // POST cria um novo registro no backend.
    const response = await axiosApi.post<EquipmentDetail>('/equipment', payload)

    return response.data
  },

  async updateEquipment(equipmentId: string, payload: UpdateEquipmentPayload) {
    // PUT substitui/atualiza os dados principais do equipamento.
    const response = await axiosApi.put<EquipmentDetail>(
      `/equipment/${equipmentId}`,
      payload,
    )

    return response.data
  },

  async updateEquipmentStatus(
    equipmentId: string,
    payload: UpdateEquipmentStatusPayload,
  ) {
    // PATCH altera apenas uma parte do recurso: aqui, o status.
    const response = await axiosApi.patch<EquipmentDetail>(
      `/equipment/${equipmentId}/status`,
      payload,
    )

    return response.data
  },

  async getEquipmentLocationOptions() {
    // Base didática para a aula: usamos localizações apenas para preencher o select.
    // TODO Projeto Final: mover esta lógica para um locationService completo.
    const response = await axiosApi.get<PaginatedResult<ApiLocation>>('/locations', {
      params: {
        page: 1,
        pageSize: 100,
      },
    })

    // Aqui transformamos a resposta da API para o formato que a tela espera.
    return response.data.data.map<EquipmentLocationOption>((location) => ({
      id: location.id,
      label: `${location.code} - ${location.name}`,
    }))
  },
}
