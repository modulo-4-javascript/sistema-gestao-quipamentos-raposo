import { useCallback, useEffect, useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import type { EquipmentSummaryResponse } from '../types/equipment'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

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
