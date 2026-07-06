import { useCallback, useEffect, useState } from 'react'
import type { RequestState } from '../../../shared/hooks/requestState'
import { getRequestErrorMessage } from '../../../shared/http/getRequestErrorMessage'
import { locationService } from '../services/locationService'
import type { LocationHistoryItem, PaginatedResult } from '../types/location'

interface UseLocationHistoryParams {
  page?: number
  pageSize?: number
}

export function useLocationHistory(
  locationId?: string,
  params: UseLocationHistoryParams = {},
): RequestState<PaginatedResult<LocationHistoryItem>> {
  const { page, pageSize } = params
  const [data, setData] = useState<PaginatedResult<LocationHistoryItem>>()
  const [isLoading, setIsLoading] = useState(Boolean(locationId))
  const [errorMessage, setErrorMessage] = useState('')

  const loadLocationHistory = useCallback(async () => {
    if (!locationId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await locationService.getLocationHistory(locationId, {
        page,
        pageSize,
      })
      setData(result)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [locationId, page, pageSize])

  useEffect(() => {
    void Promise.resolve().then(loadLocationHistory)
  }, [loadLocationHistory])

  return {
    data,
    isLoading,
    errorMessage,
    reload: loadLocationHistory,
  }
}
