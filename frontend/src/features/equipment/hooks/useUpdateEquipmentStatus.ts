import { useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import type {
  EquipmentDetail,
  UpdateEquipmentStatusPayload,
} from '../types/equipment'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

interface UpdateEquipmentStatusState {
  isLoading: boolean
  errorMessage: string
  updateStatus: (
    payload: UpdateEquipmentStatusActionPayload,
  ) => Promise<EquipmentDetail>
}

interface UpdateEquipmentStatusActionPayload {
  equipmentId: string
  payload: UpdateEquipmentStatusPayload
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
