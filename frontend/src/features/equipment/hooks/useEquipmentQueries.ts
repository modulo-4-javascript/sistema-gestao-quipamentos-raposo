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
  update: (payload: UpdateEquipmentMutationPayload) => Promise<EquipmentDetail>
}

interface UpdateEquipmentStatusState {
  isLoading: boolean
  errorMessage: string
  updateStatus: (
    payload: UpdateEquipmentStatusMutationPayload,
  ) => Promise<EquipmentDetail>
}

interface UpdateEquipmentMutationPayload {
  equipmentId: string
  payload: UpdateEquipmentPayload
}

interface UpdateEquipmentStatusMutationPayload {
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

export function useEquipmentList(
  params: GetEquipmentListParams,
): RequestState<PaginatedResult<Equipment>> {
  const { page, pageSize, search, status, type } = params
  const [data, setData] = useState<PaginatedResult<Equipment>>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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

export function useEquipmentSummary(): RequestState<EquipmentSummaryResponse> {
  const [data, setData] = useState<EquipmentSummaryResponse>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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

export function useEquipmentDetails(equipmentId?: string): RequestState<EquipmentDetail> {
  const [data, setData] = useState<EquipmentDetail>()
  const [isLoading, setIsLoading] = useState(Boolean(equipmentId))
  const [errorMessage, setErrorMessage] = useState('')

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

export function useEquipmentLocationOptions(): RequestState<EquipmentLocationOption[]> {
  const [data, setData] = useState<EquipmentLocationOption[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

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

export function useCreateEquipment(): CreateEquipmentState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

export function useUpdateEquipment(): UpdateEquipmentState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function update({ equipmentId, payload }: UpdateEquipmentMutationPayload) {
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

export function useUpdateEquipmentStatus(): UpdateEquipmentStatusState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function updateStatus({
    equipmentId,
    payload,
  }: UpdateEquipmentStatusMutationPayload) {
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
