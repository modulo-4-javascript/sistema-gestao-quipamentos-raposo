import { axiosApi } from '../../../services/api'
import type {
  CreateLocationPayload,
  GetLocationEquipmentParams,
  GetLocationListParams,
  LocationDetails,
  LocationEquipment,
  LocationHistoryItem,
  LocationSummaryResponse,
  PaginatedResult,
  UpdateLocationPayload,
  UpdateLocationStatusPayload,
} from '../types/location'

// AULA 08: service semipronto para os alunos completarem usando equipmentService como modelo.
export const locationService = {
  async getLocationList(
    params: GetLocationListParams = {},
  ): Promise<PaginatedResult<LocationDetails>> {
    const response = await axiosApi.get<PaginatedResult<LocationDetails>>('/locations', {
      params: {
        page: 1,
        pageSize: 10,
        ...params,
      },
    })

    return response.data
  },

  async getLocationSummary(): Promise<LocationSummaryResponse> {
    const response = await axiosApi.get<LocationSummaryResponse>('/locations/summary')

    return response.data
  },

  async getLocationById(locationId: string): Promise<LocationDetails> {
    const response = await axiosApi.get<LocationDetails>(`/locations/${locationId}`)

    return response.data
  },

  async createLocation(payload: CreateLocationPayload): Promise<LocationDetails> {
    const response = await axiosApi.post<LocationDetails>('/locations', payload)

    return response.data
  },

  async updateLocation(
    locationId: string,
    payload: UpdateLocationPayload,
  ): Promise<LocationDetails> {
    const response = await axiosApi.put<LocationDetails>(
      `/locations/${locationId}`,
      payload,
    )

    return response.data
  },

  async updateLocationStatus(
    locationId: string,
    payload: UpdateLocationStatusPayload,
  ): Promise<LocationDetails> {
    const response = await axiosApi.patch<LocationDetails>(
      `/locations/${locationId}/status`,
      payload,
    )

    return response.data
  },

  async deleteLocation(locationId: string): Promise<void> {
    await axiosApi.delete(`/locations/${locationId}`)
  },

  async getLocationEquipment(
    locationId: string,
    params: GetLocationEquipmentParams = {},
  ): Promise<PaginatedResult<LocationEquipment>> {
    const response = await axiosApi.get<PaginatedResult<LocationEquipment>>(
      `/locations/${locationId}/equipment`,
      {
        params: {
          page: 1,
          pageSize: 10,
          ...params,
        },
      },
    )

    return response.data
  },

  async getLocationHistory(
    locationId: string,
    params: { page?: number; pageSize?: number } = {},
  ): Promise<PaginatedResult<LocationHistoryItem>> {
    const response = await axiosApi.get<PaginatedResult<LocationHistoryItem>>(
      `/locations/${locationId}/equipment-history`,
      {
        params: {
          page: 1,
          pageSize: 10,
          ...params,
        },
      },
    )

    return response.data
  },
}
