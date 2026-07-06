import { Alert, App as AntDesignApp, Spin } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import {
  DetailSummaryCards,
  type DetailSummaryCardItem,
} from '../../../../shared/components/DetailSummaryCards'
import { DetailTextCard } from '../../../../shared/components/DetailTextCard'
import { getRequestErrorMessage } from '../../../../shared/http/getRequestErrorMessage'
import { LocationDetailsHeader } from '../../components/LocationDetailsHeader'
import { LocationEquipmentCard } from '../../components/LocationEquipmentCard'
import { LocationFormModal } from '../../components/LocationFormModal'
import type { LocationFormValues } from '../../components/LocationFormModal'
import { LocationInfoCard } from '../../components/LocationInfoCard'
import { LocationRemoveModal } from '../../components/LocationRemoveModal'
import { LocationStatusModal } from '../../components/LocationStatusModal'
import type { LocationStatusFormValues } from '../../components/LocationStatusModal'
import { useDeleteLocation } from '../../hooks/useDeleteLocation'
import { useLocationDetails } from '../../hooks/useLocationDetails'
import { useLocationEquipment } from '../../hooks/useLocationEquipment'
import { useUpdateLocation } from '../../hooks/useUpdateLocation'
import { useUpdateLocationStatus } from '../../hooks/useUpdateLocationStatus'
import {
  formatLocationDate,
  getLocationStatusLabel,
  getLocationTypeLabel,
  locationStatusOptions,
  locationTypeOptions,
  type CreateLocationPayload,
  type LocationDetails,
} from '../../types/location'
import {
  Container,
  ContentGrid,
  MainColumn,
  SideColumn,
  StarterBox,
} from './styles'

const locationEquipmentPageSize = 100

function buildLocationPayload(values: LocationFormValues): CreateLocationPayload {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    type: values.type,
    building: values.building?.trim() || undefined,
    floor: values.floor?.trim() || undefined,
    room: values.room?.trim() || undefined,
    description: values.description?.trim() || null,
    status: values.status,
  }
}

function buildLocationDetailSummary(
  location: LocationDetails,
): DetailSummaryCardItem[] {
  return [
    {
      id: 'status',
      title: 'Situação',
      tone: location.status === 'ACTIVE' ? 'success' : 'default',
      value: getLocationStatusLabel(location.status),
      description: location.status === 'ACTIVE' ? 'Local disponível' : 'Uso pausado',
    },
    {
      id: 'type',
      title: 'Tipo',
      value: getLocationTypeLabel(location.type),
      description: location.building ?? 'Sem prédio informado',
    },
    {
      id: 'equipment',
      title: 'Equipamentos',
      value: String(location.equipmentSummary.total),
      description: 'Vinculados ao local',
    },
    {
      id: 'updatedAt',
      title: 'Atualizado',
      value: formatLocationDate(location.updatedAt),
      description: 'Última alteração',
    },
  ]
}

export function LocationDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()
  const { locationId } = useParams()

  const [locationInForm, setLocationInForm] = useState<LocationDetails>()
  const [locationInStatus, setLocationInStatus] = useState<LocationDetails>()
  const [locationToRemove, setLocationToRemove] = useState<LocationDetails>()

  const locationQuery = useLocationDetails(locationId)
  const equipmentQuery = useLocationEquipment(locationId, {
    page: 1,
    pageSize: locationEquipmentPageSize,
  })
  const updateLocation = useUpdateLocation()
  const updateLocationStatus = useUpdateLocationStatus()
  const deleteLocation = useDeleteLocation()

  const location = locationQuery.data
  const linkedEquipment = equipmentQuery.data?.data ?? []
  const isSavingForm = updateLocation.isLoading
  const isSavingStatus = updateLocationStatus.isLoading
  const isRemovingLocation = deleteLocation.isLoading

  const summaries = useMemo(
    () => (location ? buildLocationDetailSummary(location) : []),
    [location],
  )

  const loadError =
    (!locationId ? 'ID da localização não encontrado na rota.' : '') ||
    locationQuery.errorMessage

  function handleEditLocation() {
    if (location) {
      setLocationInForm(location)
    }
  }

  function handleChangeStatus() {
    if (location) {
      setLocationInStatus(location)
    }
  }

  async function handleSubmitLocationForm(values: LocationFormValues) {
    if (!locationInForm) {
      return
    }

    try {
      await updateLocation.update({
        locationId: locationInForm.id,
        payload: buildLocationPayload(values),
      })
      await locationQuery.reload()
      messageApi.success('Local atualizado com sucesso.')
      setLocationInForm(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleSubmitStatusModal(values: LocationStatusFormValues) {
    if (!locationInStatus) {
      return
    }

    try {
      await updateLocationStatus.updateStatus({
        locationId: locationInStatus.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })
      await locationQuery.reload()
      messageApi.success('Situação atualizada com sucesso.')
      setLocationInStatus(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleConfirmRemoveLocation() {
    if (!locationToRemove) {
      return
    }

    try {
      await deleteLocation.remove(locationToRemove.id)
      messageApi.success('Local excluído com sucesso.')
      setLocationToRemove(undefined)
      navigate('/locations')
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  if (locationQuery.isLoading) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>
            <Spin /> Carregando localização...
          </StarterBox>
        </Container>
      </AppLayout>
    )
  }

  if (loadError || !location) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <Alert
            showIcon
            message="Localização não encontrada"
            description={loadError || 'Não foi possível exibir esta localização.'}
            type="error"
          />
        </Container>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <LocationDetailsHeader
          location={location}
          onBack={() => navigate('/locations')}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEditLocation}
          onRemove={() => setLocationToRemove(location)}
        />

        <DetailSummaryCards
          ariaLabel="Resumo da localização"
          summaries={summaries}
        />

        <ContentGrid>
          <MainColumn>
            <LocationInfoCard location={location} />
          </MainColumn>

          <SideColumn>
            <LocationEquipmentCard
              equipment={linkedEquipment}
              errorMessage={equipmentQuery.errorMessage}
              loading={equipmentQuery.isLoading}
              onViewEquipment={(equipment) => navigate(`/equipment/${equipment.id}`)}
            />
          </SideColumn>
        </ContentGrid>

        <DetailTextCard
          emptyText="Nenhuma descrição cadastrada."
          text={location.description}
          title="Descrição"
        />

        <LocationFormModal
          confirmLoading={isSavingForm}
          location={locationInForm}
          mode="edit"
          open={Boolean(locationInForm)}
          statusOptions={locationStatusOptions}
          typeOptions={locationTypeOptions}
          onCancel={() => setLocationInForm(undefined)}
          onSubmit={handleSubmitLocationForm}
        />

        <LocationStatusModal
          confirmLoading={isSavingStatus}
          location={locationInStatus}
          open={Boolean(locationInStatus)}
          statusOptions={locationStatusOptions}
          onCancel={() => setLocationInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />

        <LocationRemoveModal
          confirmLoading={isRemovingLocation}
          location={locationToRemove}
          open={Boolean(locationToRemove)}
          onCancel={() => setLocationToRemove(undefined)}
          onConfirm={handleConfirmRemoveLocation}
        />
      </Container>
    </AppLayout>
  )
}
