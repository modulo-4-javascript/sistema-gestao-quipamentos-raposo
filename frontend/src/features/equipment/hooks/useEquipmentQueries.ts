import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { equipmentService, type ListEquipmentParams } from '../services/equipmentService'
import type {
  CreateEquipmentPayload,
  UpdateEquipmentPayload,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'

const equipmentKeys = {
  all: ['equipment'] as const,
  detail: (equipmentId?: string) => ['equipment', 'detail', equipmentId] as const,
  list: (params: ListEquipmentParams) => ['equipment', 'list', params] as const,
  locations: ['locations', 'options'] as const,
  summary: ['equipment', 'summary'] as const,
}

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

export function useEquipmentList(params: ListEquipmentParams) {
  const query = useQuery({
    queryKey: equipmentKeys.list(params),
    queryFn: () => equipmentService.list(params),
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useEquipmentSummary() {
  const query = useQuery({
    queryKey: equipmentKeys.summary,
    queryFn: equipmentService.summary,
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useEquipmentDetail(equipmentId?: string) {
  const query = useQuery({
    enabled: Boolean(equipmentId),
    queryKey: equipmentKeys.detail(equipmentId),
    queryFn: () => equipmentService.getById(equipmentId ?? ''),
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useEquipmentLocationOptions() {
  const query = useQuery({
    queryKey: equipmentKeys.locations,
    queryFn: equipmentService.listLocationOptions,
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useCreateEquipmentMutation() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (payload: CreateEquipmentPayload) => equipmentService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.locations })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}

export function useUpdateEquipmentMutation() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      equipmentId,
      payload,
    }: {
      equipmentId: string
      payload: UpdateEquipmentPayload
    }) => equipmentService.update(equipmentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.locations })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}

export function useUpdateEquipmentStatusMutation() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      equipmentId,
      payload,
    }: {
      equipmentId: string
      payload: UpdateEquipmentStatusPayload
    }) => equipmentService.updateStatus(equipmentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}
