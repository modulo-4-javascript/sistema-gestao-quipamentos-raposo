import { useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

interface DeleteEquipmentState {
  isLoading: boolean
  errorMessage: string
  remove: (equipmentId: string) => Promise<void>
}

// Hook de exclusão: chama o DELETE e controla loading/erro do modal de confirmação.
export function useDeleteEquipment(): DeleteEquipmentState {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function remove(equipmentId: string) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      await equipmentService.deleteEquipment(equipmentId)
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
    remove,
  }
}
