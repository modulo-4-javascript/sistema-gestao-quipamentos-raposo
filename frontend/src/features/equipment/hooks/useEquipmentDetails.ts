import { useCallback, useEffect, useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import type { EquipmentDetail } from '../types/equipment'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

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
