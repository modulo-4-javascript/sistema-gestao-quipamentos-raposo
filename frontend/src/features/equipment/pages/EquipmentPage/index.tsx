import { Alert, App as AntDesignApp, Empty } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { equipmentService } from '../../services/equipmentService'
import {
  statusOptions,
  typeOptions,
  type CreateEquipmentPayload,
  type Equipment,
  type EquipmentLocationOption,
  type EquipmentStatus,
  type EquipmentSummary,
  type EquipmentSummaryResponse,
  type EquipmentType,
  type UpdateEquipmentPayload,
} from '../../types/equipment'
import { Container } from './styles'

const emptySummary: EquipmentSummaryResponse = {
  total: 0,
  available: 0,
  inMaintenance: 0,
  inactive: 0,
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Não foi possível carregar os equipamentos.'
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

  // Estados dos filtros. Cada campo da área de filtros controla um estado aqui.
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>()
  const [selectedType, setSelectedType] = useState<EquipmentType>()
  const [formMode, setFormMode] = useState<EquipmentFormMode>('create')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [equipmentInForm, setEquipmentInForm] = useState<Equipment>()
  const [equipmentInStatus, setEquipmentInStatus] = useState<Equipment>()
  const [equipmentToRemove, setEquipmentToRemove] = useState<Equipment>()

  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [summary, setSummary] = useState<EquipmentSummaryResponse>(emptySummary)
  const [locationOptions, setLocationOptions] = useState<EquipmentLocationOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSavingForm, setIsSavingForm] = useState(false)
  const [isSavingStatus, setIsSavingStatus] = useState(false)

  const navigate = useNavigate()

  const locationLabelById = useMemo(
    () => new Map(locationOptions.map((location) => [location.id, location.label])),
    [locationOptions],
  )

  const visibleEquipment = useMemo(
    () => equipments.map((equipment) => withLocationName(equipment, locationLabelById)),
    [equipments, locationLabelById],
  )

  const summaryCards = useMemo(() => buildSummaryCards(summary), [summary])

  const loadEquipment = useCallback(async () => {
    setIsLoading(true)
    setLoadError('')

    try {
      const [equipmentResponse, summaryResponse, locationResponse] = await Promise.all([
        equipmentService.list({
          // TODO Aula 07: evoluir este ponto para debounce, paginação ou busca ao pressionar Enter.
          search: searchText,
          status: selectedStatus,
          type: selectedType,
        }),
        equipmentService.summary(),
        equipmentService.listLocationOptions(),
      ])

      setEquipments(equipmentResponse.data)
      setSummary(summaryResponse)
      setLocationOptions(locationResponse)
    } catch (error) {
      setLoadError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [searchText, selectedStatus, selectedType])

  useEffect(() => {
    void Promise.resolve().then(loadEquipment)
  }, [loadEquipment])

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

    setIsSavingForm(true)

    try {
      if (formMode === 'edit' && equipmentInForm) {
        await equipmentService.update(equipmentInForm.id, payload as UpdateEquipmentPayload)
        messageApi.success('Equipamento atualizado com sucesso.')
      } else {
        await equipmentService.create(payload)
        messageApi.success('Equipamento cadastrado com sucesso.')
      }

      handleCloseFormModal()
      await loadEquipment()
    } catch (error) {
      messageApi.error(getErrorMessage(error))
    } finally {
      setIsSavingForm(false)
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

    setIsSavingStatus(true)

    try {
      await equipmentService.updateStatus(equipmentInStatus.id, {
        status: values.status,
        note: values.note?.trim() || null,
      })

      messageApi.success('Status atualizado com sucesso.')
      setEquipmentInStatus(undefined)
      await loadEquipment()
    } catch (error) {
      messageApi.error(getErrorMessage(error))
    } finally {
      setIsSavingStatus(false)
    }
  }

  function handleClearFilters() {
    // Limpa todos os filtros e volta a tabela para o estado inicial.
    setSearchText('')
    setSelectedStatus(undefined)
    setSelectedType(undefined)
  }

  return (
    <AppLayout currentPage="Equipamentos">
      <Container>
        {/* Cabeçalho da feature: título, descrição e botão principal. */}
        <PageHeader onCreateEquipment={handleCreateEquipment} />

        {/* Cards de resumo: agora os números vêm do endpoint GET /equipment/summary. */}
        <SummaryCards summaries={summaryCards} />

        {/* Filtros controlados: os valores viram query params no service. */}
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
