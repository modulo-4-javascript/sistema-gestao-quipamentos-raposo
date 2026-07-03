import { useCallback, useEffect, useState } from 'react'
import {
  equipmentService,
  type GetEquipmentListParams,
} from '../services/equipmentService'
import type { Equipment, PaginatedResult } from '../types/equipment'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'

// Hook da listagem: guarda dados, loading e erro, e recarrega quando os filtros mudam.
export function useEquipmentList(
  params: GetEquipmentListParams,
): RequestState<PaginatedResult<Equipment>> {
  const { page, pageSize, search, status, type } = params
  const [data, setData] = useState<PaginatedResult<Equipment>>()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Função que chama o service e atualiza o estado usado pela tabela.
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
