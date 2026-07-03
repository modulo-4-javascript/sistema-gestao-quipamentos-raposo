import { Alert, App as AntDesignApp, Spin } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { DetailSummaryCards } from '../../components/DetailSummaryCards'
import { DetailsHeader } from '../../components/DetailsHeader'
import { EquipmentFormModal } from '../../components/EquipmentFormModal'
import type { EquipmentFormValues } from '../../components/EquipmentFormModal'
import { EquipmentHistoryCard } from '../../components/EquipmentHistoryCard'
import { EquipmentInfoCard } from '../../components/EquipmentInfoCard'
import { EquipmentNotesCard } from '../../components/EquipmentNotesCard'
import { EquipmentRemoveModal } from '../../components/EquipmentRemoveModal'
import { EquipmentStatusModal } from '../../components/EquipmentStatusModal'
import type { EquipmentStatusFormValues } from '../../components/EquipmentStatusModal'
import {
  getRequestErrorMessage,
  useEquipmentDetail,
  useEquipmentLocationOptions,
  useUpdateEquipmentMutation,
  useUpdateEquipmentStatusMutation,
} from '../../hooks/useEquipmentQueries'
import {
  formatEquipmentDate,
  getEquipmentStatusLabel,
  statusOptions,
  typeOptions,
  type CreateEquipmentPayload,
  type EquipmentDetail,
  type EquipmentDetailSummary,
  type EquipmentLocationOption,
} from '../../types/equipment'

import {
  Container,
  ContentGrid,
  MainColumn,
  SideColumn,
  StarterBox,
} from './styles'

function buildEquipmentPayload(values: EquipmentFormValues): CreateEquipmentPayload {
  return {
    name: values.name.trim(),
    type: values.type,
    model: values.model?.trim() || undefined,
    serialNumber: values.serialNumber?.trim() || undefined,
    status: values.status,
    locationId: values.locationId ?? null,
    responsibleUserName: values.responsibleUserName?.trim() || null,
    notes: values.notes?.trim() || null,
  }
}

function buildDetailSummary(equipment: EquipmentDetail): EquipmentDetailSummary[] {
  return [
    {
      id: 'status',
      title: 'Status',
      value: getEquipmentStatusLabel(equipment.status),
      description: equipment.status === 'AVAILABLE' ? 'Pronto para uso' : 'Acompanha restrição',
    },
    {
      id: 'location',
      title: 'Localização',
      value: equipment.locationName ?? 'Sem localização',
      description: 'Setor atual',
    },
    {
      id: 'responsible',
      title: 'Responsável',
      value: equipment.responsibleUserName ?? 'Equipe de patrimônio',
      description: 'Pessoa de referência',
    },
    {
      id: 'updatedAt',
      title: 'Atualizado',
      value: formatEquipmentDate(equipment.updatedAt),
      description: 'Última alteração',
    },
  ]
}

function withLocationName(
  equipment: EquipmentDetail,
  locationOptions: EquipmentLocationOption[],
): EquipmentDetail {
  const locationLabelById = new Map(
    locationOptions.map((location) => [location.id, location.label]),
  )

  return {
    ...equipment,
    locationName: equipment.locationId
      ? locationLabelById.get(equipment.locationId) ?? 'Localização não encontrada'
      : 'Sem localização',
  }
}

export function EquipmentDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()
  const { equipmentId } = useParams()

  const [equipmentInForm, setEquipmentInForm] = useState<EquipmentDetail>()
  const [equipmentInStatus, setEquipmentInStatus] = useState<EquipmentDetail>()
  const [equipmentToRemove, setEquipmentToRemove] = useState<EquipmentDetail>()

  const equipmentQuery = useEquipmentDetail(equipmentId)
  const locationOptionsQuery = useEquipmentLocationOptions()
  const updateEquipment = useUpdateEquipmentMutation()
  const updateEquipmentStatus = useUpdateEquipmentStatusMutation()

  const locationOptions = useMemo(
    () => locationOptionsQuery.data ?? [],
    [locationOptionsQuery.data],
  )
  const equipment = useMemo(
    () =>
      equipmentQuery.data
        ? withLocationName(equipmentQuery.data, locationOptions)
        : undefined,
    [equipmentQuery.data, locationOptions],
  )
  const isLoading = equipmentQuery.isLoading || locationOptionsQuery.isLoading
  const loadError =
    (!equipmentId ? 'ID do equipamento não encontrado na rota.' : '') ||
    equipmentQuery.errorMessage ||
    locationOptionsQuery.errorMessage
  const isSavingForm = updateEquipment.isPending
  const isSavingStatus = updateEquipmentStatus.isPending

  const summaries = useMemo(
    () => (equipment ? buildDetailSummary(equipment) : []),
    [equipment],
  )

  function handleEditEquipment() {
    if (equipment) {
      setEquipmentInForm(equipment)
    }
  }

  function handleChangeStatus() {
    if (equipment) {
      setEquipmentInStatus(equipment)
    }
  }

  async function handleSubmitFormModal(values: EquipmentFormValues) {
    if (!equipmentInForm) {
      return
    }

    try {
      await updateEquipment.mutateAsync({
        equipmentId: equipmentInForm.id,
        payload: buildEquipmentPayload(values),
      })
      messageApi.success('Equipamento atualizado com sucesso.')
      setEquipmentInForm(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleSubmitStatusModal(values: EquipmentStatusFormValues) {
    if (!equipmentInStatus) {
      return
    }

    try {
      await updateEquipmentStatus.mutateAsync({
        equipmentId: equipmentInStatus.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })
      messageApi.success('Status atualizado com sucesso.')
      setEquipmentInStatus(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  function handleConfirmRemoveEquipment() {
    // TODO Aula futura: conectar DELETE /equipment/:equipmentId se o escopo incluir exclusão.
    messageApi.info('Exclusão deixada como evolução após a integração principal.')
    setEquipmentToRemove(undefined)
  }

  if (isLoading) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>
            <Spin /> Carregando equipamento...
          </StarterBox>
        </Container>
      </AppLayout>
    )
  }

  if (loadError || !equipment) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <Alert
            showIcon
            message="Equipamento não encontrado"
            description={loadError || 'Não foi possível exibir este equipamento.'}
            type="error"
          />
        </Container>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <DetailsHeader
          equipment={equipment}
          onBack={() => navigate('/equipment')}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEditEquipment}
          onRemove={() => setEquipmentToRemove(equipment)}
        />

        <DetailSummaryCards summaries={summaries} />

        <ContentGrid>
          <MainColumn>
            <EquipmentInfoCard equipment={equipment} />
            <EquipmentNotesCard notes={equipment.notes} />
          </MainColumn>

          <SideColumn>
            <EquipmentHistoryCard history={equipment.recentHistory} />
          </SideColumn>
        </ContentGrid>

        <EquipmentFormModal
          confirmLoading={isSavingForm}
          equipment={equipmentInForm}
          locationOptions={locationOptions}
          mode="edit"
          open={Boolean(equipmentInForm)}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onCancel={() => setEquipmentInForm(undefined)}
          onSubmit={handleSubmitFormModal}
        />

        <EquipmentStatusModal
          confirmLoading={isSavingStatus}
          equipment={equipmentInStatus}
          open={Boolean(equipmentInStatus)}
          statusOptions={statusOptions}
          onCancel={() => setEquipmentInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />

        <EquipmentRemoveModal
          equipment={equipmentToRemove}
          open={Boolean(equipmentToRemove)}
          onCancel={() => setEquipmentToRemove(undefined)}
          onConfirm={handleConfirmRemoveEquipment}
        />
      </Container>
    </AppLayout>
  )
}
