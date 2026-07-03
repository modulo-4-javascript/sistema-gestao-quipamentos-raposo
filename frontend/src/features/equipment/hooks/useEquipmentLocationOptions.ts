import { useCallback, useEffect, useState } from 'react'
import { equipmentService } from '../services/equipmentService'
import type { EquipmentLocationOption } from '../types/equipment'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

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
