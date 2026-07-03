import { Alert, App as AntDesignApp, Empty } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { EquipmentFilters } from '../../components/EquipmentFilters'
import { EquipmentFormModal } from '../../components/EquipmentFormModal'
import type {
  EquipmentFormMode,
  EquipmentFormValues,
} from '../../components/EquipmentFormModal'
import { EquipmentRemoveModal } from '../../components/EquipmentRemoveModal'
import { EquipmentStatusModal } from '../../components/EquipmentStatusModal'
import type { EquipmentStatusFormValues } from '../../components/EquipmentStatusModal'
import { EquipmentTable } from '../../components/EquipmentTable'
import { PageHeader } from '../../components/PageHeader'
import { SummaryCards } from '../../components/SummaryCards'
import {
  getRequestErrorMessage,
  useCreateEquipment,
  useEquipmentList,
  useEquipmentLocationOptions,
  useEquipmentSummary,
  useUpdateEquipment,
  useUpdateEquipmentStatus,
} from '../../hooks/useEquipmentQueries'
import {
  statusOptions,
  typeOptions,
  type CreateEquipmentPayload,
  type Equipment,
  type EquipmentSummary,
  type EquipmentSummaryResponse,
  type EquipmentType,
  type EquipmentStatus,
} from '../../types/equipment'
import { Container } from './styles'

const emptySummary: EquipmentSummaryResponse = {
  total: 0,
  available: 0,
  inMaintenance: 0,
  inactive: 0,
}

function buildSummaryCards(summary: EquipmentSummaryResponse): EquipmentSummary[] {
  return [
    {
      id: 'total',
      title: 'Total',
      value: summary.total,
      icon: 'total',
      lineColor: 'linear-gradient(90deg, #002A64, #007C8C)',
      iconBackground: '#E1E8FD',
    },
    {
      id: 'available',
      title: 'Disponíveis',
      value: summary.available,
      icon: 'available',
      lineColor: '#25B8A7',
      iconBackground: '#E6FFFB',
    },
    {
      id: 'maintenance',
      title: 'Em manutenção',
      value: summary.inMaintenance,
      icon: 'maintenance',
      lineColor: '#007C8C',
      iconBackground: '#E6F4FF',
    },
    {
      id: 'inactive',
      title: 'Inativos',
      value: summary.inactive,
      icon: 'inactive',
      lineColor: '#6B7280',
      iconBackground: '#F3F4F6',
    },
  ]
}

function withLocationName(
  equipment: Equipment,
  locationLabelById: Map<string, string>,
): Equipment {
  return {
    ...equipment,
    locationName: equipment.locationId
      ? locationLabelById.get(equipment.locationId) ?? 'Localização não encontrada'
      : 'Sem localização',
  }
}

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

export function EquipmentPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()

  // Estados visuais continuam na página. Dados de API ficam nos hooks.
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>()
  const [selectedType, setSelectedType] = useState<EquipmentType>()
  const [formMode, setFormMode] = useState<EquipmentFormMode>('create')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [equipmentInForm, setEquipmentInForm] = useState<Equipment>()
  const [equipmentInStatus, setEquipmentInStatus] = useState<Equipment>()
  const [equipmentToRemove, setEquipmentToRemove] = useState<Equipment>()

  const listParams = useMemo(
    () => ({
      // TODO Aula 07: evoluir este ponto para debounce, paginação ou busca ao pressionar Enter.
      search: searchText,
      status: selectedStatus,
      type: selectedType,
    }),
    [searchText, selectedStatus, selectedType],
  )

  const equipmentListQuery = useEquipmentList(listParams)
  const equipmentSummaryQuery = useEquipmentSummary()
  const locationOptionsQuery = useEquipmentLocationOptions()
  const createEquipment = useCreateEquipment()
  const updateEquipment = useUpdateEquipment()
  const updateEquipmentStatus = useUpdateEquipmentStatus()

  const locationOptions = useMemo(
    () => locationOptionsQuery.data ?? [],
    [locationOptionsQuery.data],
  )
  const equipments = useMemo(
    () => equipmentListQuery.data?.data ?? [],
    [equipmentListQuery.data],
  )
  const summary = equipmentSummaryQuery.data ?? emptySummary
  const isLoading =
    equipmentListQuery.isLoading ||
    equipmentSummaryQuery.isLoading ||
    locationOptionsQuery.isLoading
  const loadError =
    equipmentListQuery.errorMessage ||
    equipmentSummaryQuery.errorMessage ||
    locationOptionsQuery.errorMessage
  const isSavingForm = createEquipment.isPending || updateEquipment.isPending
  const isSavingStatus = updateEquipmentStatus.isPending

  const locationLabelById = useMemo(
    () => new Map(locationOptions.map((location) => [location.id, location.label])),
    [locationOptions],
  )

  const visibleEquipment = useMemo(
    () => equipments.map((equipment) => withLocationName(equipment, locationLabelById)),
    [equipments, locationLabelById],
  )

  const summaryCards = useMemo(() => buildSummaryCards(summary), [summary])

  function handleViewEquipment(equipment: Equipment) {
    navigate(`/equipment/${equipment.id}`)
  }

  function handleCreateEquipment() {
    setFormMode('create')
    setEquipmentInForm(undefined)
    setIsFormModalOpen(true)
  }

  function handleEditEquipment(equipment: Equipment) {
    setFormMode('edit')
    setEquipmentInForm(equipment)
    setIsFormModalOpen(true)
  }

  function handleCloseFormModal() {
    setIsFormModalOpen(false)
    setEquipmentInForm(undefined)
  }

  async function handleSubmitFormModal(values: EquipmentFormValues) {
    const payload = buildEquipmentPayload(values)

    try {
      if (formMode === 'edit' && equipmentInForm) {
        await updateEquipment.mutateAsync({
          equipmentId: equipmentInForm.id,
          payload,
        })
        messageApi.success('Equipamento atualizado com sucesso.')
      } else {
        await createEquipment.mutateAsync(payload)
        messageApi.success('Equipamento cadastrado com sucesso.')
      }

      handleCloseFormModal()
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  function handleConfirmRemoveEquipment() {
    // TODO Aula futura: conectar DELETE /equipment/:equipmentId se o escopo incluir exclusão.
    messageApi.info('Exclusão deixada como evolução após a integração principal.')
    setEquipmentToRemove(undefined)
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

  function handleClearFilters() {
    setSearchText('')
    setSelectedStatus(undefined)
    setSelectedType(undefined)
  }

  return (
    <AppLayout currentPage="Equipamentos">
      <Container>
        <PageHeader onCreateEquipment={handleCreateEquipment} />

        <SummaryCards summaries={summaryCards} />

        <EquipmentFilters
          searchText={searchText}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onSearchChange={setSearchText}
          onStatusChange={setSelectedStatus}
          onTypeChange={setSelectedType}
          onClear={handleClearFilters}
        />

        {loadError && (
          <Alert
            showIcon
            message="Erro ao carregar equipamentos"
            description={loadError}
            type="error"
          />
        )}

        {!isLoading && !loadError && visibleEquipment.length === 0 ? (
          <Empty description="Nenhum equipamento encontrado." />
        ) : (
          <EquipmentTable
            equipments={visibleEquipment}
            loading={isLoading}
            onChangeStatusEquipment={setEquipmentInStatus}
            onEditEquipment={handleEditEquipment}
            onRemoveEquipment={setEquipmentToRemove}
            onViewEquipment={handleViewEquipment}
          />
        )}

        <EquipmentFormModal
          confirmLoading={isSavingForm}
          equipment={equipmentInForm}
          locationOptions={locationOptions}
          mode={formMode}
          open={isFormModalOpen}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onCancel={handleCloseFormModal}
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
