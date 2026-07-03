import { useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import type { CreateEquipmentPayload, EquipmentDetail } from '../types/equipment'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

interface CreateEquipmentState {
  isLoading: boolean
  errorMessage: string
  create: (payload: CreateEquipmentPayload) => Promise<EquipmentDetail>
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
