import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { equipmentService, type GetEquipmentListParams } from '../services/equipmentService'
import type {
  CreateEquipmentPayload,
  UpdateEquipmentPayload,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'

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

export function useEquipmentList(params: GetEquipmentListParams) {
  const query = useQuery({
    queryKey: ['equipment', params],
    queryFn: () => equipmentService.getEquipmentList(params),
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useEquipmentSummary() {
  const query = useQuery({
    queryKey: ['equipment', 'summary'],
    queryFn: equipmentService.getEquipmentSummary,
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useEquipmentDetails(equipmentId?: string) {
  const query = useQuery({
    enabled: Boolean(equipmentId),
    queryKey: ['equipment', equipmentId],
    queryFn: () => equipmentService.getEquipmentById(equipmentId ?? ''),
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useEquipmentLocationOptions() {
  const query = useQuery({
    queryKey: ['locations'],
    queryFn: equipmentService.getEquipmentLocationOptions,
  })

  return {
    ...query,
    errorMessage: query.error ? getRequestErrorMessage(query.error) : '',
  }
}

export function useCreateEquipment() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (payload: CreateEquipmentPayload) => equipmentService.createEquipment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      equipmentId,
      payload,
    }: {
      equipmentId: string
      payload: UpdateEquipmentPayload
    }) => equipmentService.updateEquipment(equipmentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}

export function useUpdateEquipmentStatus() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      equipmentId,
      payload,
    }: {
      equipmentId: string
      payload: UpdateEquipmentStatusPayload
    }) => equipmentService.updateEquipmentStatus(equipmentId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['equipment'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? getRequestErrorMessage(mutation.error) : '',
  }
}
