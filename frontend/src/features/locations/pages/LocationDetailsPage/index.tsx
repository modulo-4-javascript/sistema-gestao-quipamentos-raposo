import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import { Alert, App as AntDesignApp, Button, Empty, Spin } from 'antd'
import type { TableProps } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { DataTable } from '../../../../shared/components/DataTable'
import {
  ResourceCell,
  ResourceCode,
  ResourceIcon,
  ResourceName,
} from '../../../../shared/components/DataTable/styles'
import {
  SummaryCards,
  type SummaryCardItem,
} from '../../../../shared/components/SummaryCards'
import { getRequestErrorMessage } from '../../../../shared/http/getRequestErrorMessage'
import {
  getEquipmentStatusLabel,
  getEquipmentTypeLabel,
  type EquipmentStatus,
} from '../../../equipment/types/equipment'
import {
  LocationFormModal,
  type LocationFormValues,
} from '../../components/LocationFormModal'
import { LocationRemoveModal } from '../../components/LocationRemoveModal'
import {
  LocationStatusModal,
  type LocationStatusFormValues,
} from '../../components/LocationStatusModal'
import { useDeleteLocation } from '../../hooks/useDeleteLocation'
import { useLocationDetails } from '../../hooks/useLocationDetails'
import { useLocationEquipment } from '../../hooks/useLocationEquipment'
import { useLocationHistory } from '../../hooks/useLocationHistory'
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
  type LocationEquipment,
} from '../../types/location'
import {
  Actions,
  BackButton,
  BrandButton,
  Code,
  Container,
  ContentGrid,
  DescriptionList,
  DescriptionText,
  Detail,
  EquipmentStatusTag,
  HeaderContainer,
  HistoryDate,
  HistoryDescription,
  HistoryEvent,
  HistoryList,
  HistoryTitle,
  InfoCard,
  LocationStatusTag,
  MainColumn,
  SectionTitle,
  SideColumn,
  StarterBox,
  Term,
  Title,
  TitleGroup,
  TitleRow,
  Value,
} from './styles'

const defaultPageSize = 5
const historyPageSize = 8

function buildLocationPayload(
  values: LocationFormValues,
): CreateLocationPayload {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    type: values.type,
    building: values.building?.trim() || undefined,
    floor: values.floor?.trim() || undefined,
    room: values.room?.trim() || undefined,
    description: values.description?.trim() || null,
    status: values.status,
  } as CreateLocationPayload
}

function formatLocationAddress(location: LocationDetails) {
  return [location.building, location.floor, location.room]
    .filter(Boolean)
    .join(' • ') || 'Não informado'
}

function buildDetailCards(location: LocationDetails): SummaryCardItem[] {
  return [
    {
      id: 'equipment-total',
      title: 'Equipamentos',
      value: location.equipmentSummary.total,
      icon: 'equipment',
      lineColor: 'linear-gradient(90deg, #002A64, #007C8C)',
      iconBackground: '#E1E8FD',
    },
    {
      id: 'available',
      title: 'Disponíveis',
      value: location.equipmentSummary.available,
      icon: 'available',
      lineColor: '#25B8A7',
      iconBackground: '#E6FFFB',
    },
    {
      id: 'maintenance',
      title: 'Em manutenção',
      value: location.equipmentSummary.inMaintenance,
      icon: 'maintenance',
      lineColor: '#007C8C',
      iconBackground: '#E6F4FF',
    },
    {
      id: 'inactive',
      title: 'Inativos',
      value: location.equipmentSummary.inactive,
      icon: 'inactive',
      lineColor: '#6B7280',
      iconBackground: '#F3F4F6',
    },
  ]
}

function getEquipmentColumns(): TableProps<LocationEquipment>['columns'] {
  return [
    {
      title: 'Equipamento',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (_, equipment) => (
        <ResourceCell>
          <ResourceIcon>
            <Inventory2Outlined fontSize="small" />
          </ResourceIcon>
          <span>
            <ResourceName>{equipment.name}</ResourceName>
            <ResourceCode>{equipment.code}</ResourceCode>
          </span>
        </ResourceCell>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: LocationEquipment['type']) => getEquipmentTypeLabel(type),
    },
    {
      title: 'Modelo',
      dataIndex: 'model',
      key: 'model',
      width: 180,
      render: (model?: string) => model ?? 'Não informado',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: EquipmentStatus) => (
        <EquipmentStatusTag $status={status}>
          {getEquipmentStatusLabel(status)}
        </EquipmentStatusTag>
      ),
    },
    {
      title: 'Atualizado',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 130,
      render: (updatedAt: string) => formatLocationDate(updatedAt),
    },
  ]
}

export function LocationDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()
  const { locationId } = useParams()

  const [currentEquipmentPage, setCurrentEquipmentPage] = useState(1)
  const [locationInForm, setLocationInForm] = useState<LocationDetails>()
  const [locationInStatus, setLocationInStatus] = useState<LocationDetails>()
  const [locationToRemove, setLocationToRemove] = useState<LocationDetails>()

  const locationQuery = useLocationDetails(locationId)
  const equipmentQuery = useLocationEquipment(locationId, {
    page: currentEquipmentPage,
    pageSize: defaultPageSize,
  })
  const historyQuery = useLocationHistory(locationId, {
    page: 1,
    pageSize: historyPageSize,
  })
  const updateLocation = useUpdateLocation()
  const updateLocationStatus = useUpdateLocationStatus()
  const deleteLocation = useDeleteLocation()

  const location = locationQuery.data
  const equipments = equipmentQuery.data?.data ?? []
  const equipmentPagination = equipmentQuery.data?.meta
  const history = historyQuery.data?.data ?? []
  const isLoading =
    locationQuery.isLoading || equipmentQuery.isLoading || historyQuery.isLoading
  const loadError =
    (!locationId ? 'ID do local não encontrado na rota.' : '') ||
    locationQuery.errorMessage ||
    equipmentQuery.errorMessage ||
    historyQuery.errorMessage
  const isSavingForm = updateLocation.isLoading
  const isSavingStatus = updateLocationStatus.isLoading
  const isRemovingLocation = deleteLocation.isLoading

  async function reloadDetails() {
    await Promise.all([
      locationQuery.reload(),
      equipmentQuery.reload(),
      historyQuery.reload(),
    ])
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
      await reloadDetails()
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
      await reloadDetails()
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

  if (isLoading && !location) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>
            <Spin /> Carregando local...
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
            message="Local não encontrado"
            description={loadError || 'Não foi possível exibir este local.'}
            type="error"
          />
        </Container>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <HeaderContainer>
          <TitleGroup>
            <BackButton
              icon={<ArrowBackOutlined fontSize="small" />}
              type="text"
              onClick={() => navigate('/locations')}
            >
              Voltar para localizações
            </BackButton>

            <TitleRow>
              <Title>{location.name}</Title>
              <LocationStatusTag $status={location.status}>
                {getLocationStatusLabel(location.status)}
              </LocationStatusTag>
            </TitleRow>

            <Code>{location.code}</Code>
          </TitleGroup>

          <Actions>
            <BrandButton
              type="primary"
              icon={<EditOutlined fontSize="small" />}
              onClick={() => setLocationInForm(location)}
            >
              Editar
            </BrandButton>

            <Button
              icon={<AutorenewOutlined fontSize="small" />}
              onClick={() => setLocationInStatus(location)}
            >
              Alterar situação
            </Button>

            <Button
              danger
              icon={<DeleteOutlineOutlined fontSize="small" />}
              onClick={() => setLocationToRemove(location)}
            >
              Excluir
            </Button>
          </Actions>
        </HeaderContainer>

        <SummaryCards
          ariaLabel="Resumo dos equipamentos do local"
          summaries={buildDetailCards(location)}
        />

        <ContentGrid>
          <MainColumn>
            <InfoCard styles={{ body: { padding: 24 } }}>
              <SectionTitle>Informações gerais</SectionTitle>

              <DescriptionList>
                <Detail>
                  <Term>Tipo</Term>
                  <Value>{getLocationTypeLabel(location.type)}</Value>
                </Detail>

                <Detail>
                  <Term>Endereço</Term>
                  <Value>{formatLocationAddress(location)}</Value>
                </Detail>

                <Detail>
                  <Term>Prédio</Term>
                  <Value>{location.building ?? 'Não informado'}</Value>
                </Detail>

                <Detail>
                  <Term>Andar</Term>
                  <Value>{location.floor ?? 'Não informado'}</Value>
                </Detail>

                <Detail>
                  <Term>Sala</Term>
                  <Value>{location.room ?? 'Não informado'}</Value>
                </Detail>

                <Detail>
                  <Term>Cadastrado em</Term>
                  <Value>{formatLocationDate(location.createdAt)}</Value>
                </Detail>

                <Detail>
                  <Term>Última atualização</Term>
                  <Value>{formatLocationDate(location.updatedAt)}</Value>
                </Detail>
              </DescriptionList>

              <DescriptionText>
                {location.description ?? 'Nenhuma descrição cadastrada.'}
              </DescriptionText>
            </InfoCard>

            <DataTable
              columns={getEquipmentColumns()}
              dataSource={equipments}
              emptyText="Nenhum equipamento vinculado a este local."
              loading={equipmentQuery.isLoading}
              pagination={{
                current: currentEquipmentPage,
                pageSize: defaultPageSize,
                total: equipmentPagination?.total ?? 0,
                showSizeChanger: false,
                showTotal: (total) => `${total} equipamentos vinculados`,
                onChange: (page) => setCurrentEquipmentPage(page),
              }}
              rowKey="id"
            />
          </MainColumn>

          <SideColumn>
            <InfoCard styles={{ body: { padding: 24 } }}>
              <SectionTitle>Histórico de movimentações</SectionTitle>

              {history.length === 0 ? (
                <Empty description="Nenhuma movimentação encontrada." />
              ) : (
                <HistoryList>
                  {history.map((event) => (
                    <HistoryEvent key={event.id}>
                      <HistoryDate>{formatLocationDate(event.createdAt)}</HistoryDate>
                      <HistoryTitle>{event.title}</HistoryTitle>
                      <HistoryDescription>{event.description}</HistoryDescription>
                    </HistoryEvent>
                  ))}
                </HistoryList>
              )}
            </InfoCard>
          </SideColumn>
        </ContentGrid>

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
