import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { equipmentService, type GetEquipmentListParams } from '../services/equipmentService'
import type {
  CreateEquipmentPayload,
  EquipmentDetail,
  EquipmentLocationOption,
  EquipmentSummaryResponse,
  PaginatedResult,
  Equipment,
  UpdateEquipmentPayload,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'

interface RequestState<TData> {
  data?: TData
  isLoading: boolean
  errorMessage: string
  reload: () => Promise<void>
}

interface CreateEquipmentState {
  isLoading: boolean
  errorMessage: string
  create: (payload: CreateEquipmentPayload) => Promise<EquipmentDetail>
}

interface UpdateEquipmentState {
  isLoading: boolean
  errorMessage: string
  update: (payload: UpdateEquipmentActionPayload) => Promise<EquipmentDetail>
}

interface UpdateEquipmentStatusState {
  isLoading: boolean
  errorMessage: string
  updateStatus: (
    payload: UpdateEquipmentStatusActionPayload,
  ) => Promise<EquipmentDetail>
}

interface UpdateEquipmentActionPayload {
  equipmentId: string
  payload: UpdateEquipmentPayload
}

interface UpdateEquipmentStatusActionPayload {
  equipmentId: string
  payload: UpdateEquipmentStatusPayload
}

// Converte erros do Axios ou do JavaScript em uma mensagem simples para a tela.
export function getRequestErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      'Não foi possível completar a comunicação com a API.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível completar a comunicação com a API.'
}

// Hook da listagem: guarda dados, loading e erro, e recarrega quando os filtros mudam.
export function useEquipmentList(
  params: GetEquipmentListParams,
): RequestState<PaginatedResult<Equipment>> {
  const { page, pageSize, search, status, type } = params
  const [data, setData] = useState<PaginatedResult<Equipment>>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Função que chama o service e atualiza o estado usado pela tabela.
  const loadEquipmentList = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await equipmentService.getEquipmentList({
        page,
        pageSize,
        search,
        status,
        type,
      })
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, search, status, type])

  // Quando filtros ou paginação mudam, buscamos a lista novamente.
  useEffect(() => {
    void Promise.resolve().then(loadEquipmentList)
  }, [loadEquipmentList])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadEquipmentList,
  }
}

// Hook do resumo: busca os números usados nos cards do topo.
export function useEquipmentSummary(): RequestState<EquipmentSummaryResponse> {
  const [data, setData] = useState<EquipmentSummaryResponse>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Função que chama o endpoint de resumo e guarda a resposta em data.
  const loadEquipmentSummary = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await equipmentService.getEquipmentSummary()
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Busca os totais exibidos nos cards do topo da página.
  useEffect(() => {
    void Promise.resolve().then(loadEquipmentSummary)
  }, [loadEquipmentSummary])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadEquipmentSummary,
  }
}

// Hook do detalhe: recebe o ID da rota e busca um único equipamento.
export function useEquipmentDetails(equipmentId?: string): RequestState<EquipmentDetail> {
  const [data, setData] = useState<EquipmentDetail>()
  const [isLoading, setIsLoading] = useState(Boolean(equipmentId))
  const [errorMessage, setErrorMessage] = useState('')

  // Se não houver ID, não existe o que buscar; se houver, chamamos o service.
  const loadEquipmentDetails = useCallback(async () => {
    if (!equipmentId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await equipmentService.getEquipmentById(equipmentId)
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [equipmentId])

  // Busca os dados de um equipamento específico para a tela de detalhes.
  useEffect(() => {
    void Promise.resolve().then(loadEquipmentDetails)
  }, [loadEquipmentDetails])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadEquipmentDetails,
  }
}

// Hook das localizações: transforma a rota de locais em opções para os selects.
export function useEquipmentLocationOptions(): RequestState<EquipmentLocationOption[]> {
  const [data, setData] = useState<EquipmentLocationOption[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Busca as localizações já formatadas pelo service para uso no formulário.
  const loadEquipmentLocationOptions = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await equipmentService.getEquipmentLocationOptions()
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Busca localizações em formato pronto para preencher selects.
  useEffect(() => {
    void Promise.resolve().then(loadEquipmentLocationOptions)
  }, [loadEquipmentLocationOptions])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadEquipmentLocationOptions,
  }
}

// Hook de criação: expõe uma função create e controla loading/erro do botão de salvar.
export function useCreateEquipment(): CreateEquipmentState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Envia o payload para o backend; quem chama decide quando recarregar a tela.
  async function create(payload: CreateEquipmentPayload) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      return await equipmentService.createEquipment(payload)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    errorMessage,
    create,
  }
}

// Hook de edição: expõe uma função update para atualizar um equipamento existente.
export function useUpdateEquipment(): UpdateEquipmentState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Recebe o ID e os dados editados, chama o service e devolve a resposta da API.
  async function update({ equipmentId, payload }: UpdateEquipmentActionPayload) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      return await equipmentService.updateEquipment(equipmentId, payload)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    errorMessage,
    update,
  }
}

// Hook de status: expõe uma função updateStatus para alterar só o status do equipamento.
export function useUpdateEquipmentStatus(): UpdateEquipmentStatusState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Recebe o ID e o novo status, chama o PATCH do service e controla loading/erro.
  async function updateStatus({
    equipmentId,
    payload,
  }: UpdateEquipmentStatusActionPayload) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      return await equipmentService.updateEquipmentStatus(equipmentId, payload)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    errorMessage,
    updateStatus,
  }
}
