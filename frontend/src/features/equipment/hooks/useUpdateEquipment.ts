import { useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import type { EquipmentDetail, UpdateEquipmentPayload } from '../types/equipment'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

interface UpdateEquipmentState {
  isLoading: boolean
  errorMessage: string
  update: (payload: UpdateEquipmentActionPayload) => Promise<EquipmentDetail>
}

interface UpdateEquipmentActionPayload {
  equipmentId: string
  payload: UpdateEquipmentPayload
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
