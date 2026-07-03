import { Alert, App as AntDesignApp, Empty } from 'antd'
import { useEffect, useState } from 'react'
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
  type EquipmentLocationOption,
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

const defaultPageSize = 10

// A API devolve números simples. Esta função adapta esses números para os cards da tela.
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

// A listagem vem com locationId. Aqui adicionamos o nome da localização para a tabela.
function withLocationName(
  equipment: Equipment,
  locationOptions: EquipmentLocationOption[],
): Equipment {
  const location = locationOptions.find((option) => option.id === equipment.locationId)

  return {
    ...equipment,
    locationName: equipment.locationId
      ? location?.label ?? 'Localização não encontrada'
      : 'Sem localização',
  }
}

// Antes de enviar para a API, limpamos espaços e transformamos campos vazios em undefined/null.
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

  // Filtros e paginação controlam quais equipamentos a API deve devolver.
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>()
  const [selectedType, setSelectedType] = useState<EquipmentType>()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  // Estes estados controlam apenas os modais da página.
  const [formMode, setFormMode] = useState<EquipmentFormMode>('create')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [equipmentInForm, setEquipmentInForm] = useState<Equipment>()
  const [equipmentInStatus, setEquipmentInStatus] = useState<Equipment>()
  const [equipmentToRemove, setEquipmentToRemove] = useState<Equipment>()

  // Debounce da busca:
  // 1. searchText muda a cada tecla digitada.
  // 2. esperamos 400ms antes de copiar esse valor para debouncedSearchText.
  // 3. como a API usa debouncedSearchText, evitamos uma request a cada tecla.
  useEffect(() => {
    // Agenda a atualização da busca para daqui a 400ms.
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setCurrentPage(1)
    }, 400)

    // Se o usuário digitar de novo antes dos 400ms, cancelamos o timer anterior.
    return () => clearTimeout(timeoutId)
  }, [searchText])

  // Estes parâmetros vão para a API. Quando algum muda, a listagem é buscada de novo.
  const listParams = {
    search: debouncedSearchText,
    status: selectedStatus,
    type: selectedType,
    page: currentPage,
    pageSize,
  }

  // Hooks que usam useEffect + axios para buscar e salvar dados na API.
  const equipmentListQuery = useEquipmentList(listParams)
  const equipmentSummaryQuery = useEquipmentSummary()
  const locationOptionsQuery = useEquipmentLocationOptions()
  const createEquipment = useCreateEquipment()
  const updateEquipment = useUpdateEquipment()
  const updateEquipmentStatus = useUpdateEquipmentStatus()

  // Aqui tiramos os dados de dentro dos hooks e colocamos valores seguros para renderizar.
  const locationOptions = locationOptionsQuery.data ?? []
  const equipments = equipmentListQuery.data?.data ?? []
  const paginationInfo = equipmentListQuery.data?.meta
  const summary = equipmentSummaryQuery.data ?? emptySummary

  // A tela considera carregando enquanto qualquer dado principal ainda está chegando.
  const isLoading =
    equipmentListQuery.isLoading ||
    equipmentSummaryQuery.isLoading ||
    locationOptionsQuery.isLoading

  // Mostramos a primeira mensagem de erro encontrada.
  const loadError =
    equipmentListQuery.errorMessage ||
    equipmentSummaryQuery.errorMessage ||
    locationOptionsQuery.errorMessage
  const isSavingForm = createEquipment.isLoading || updateEquipment.isLoading
  const isSavingStatus = updateEquipmentStatus.isLoading

  // A tabela espera receber o nome da localização, não apenas o ID.
  const visibleEquipment = equipments.map((equipment) =>
    withLocationName(equipment, locationOptions),
  )
  const summaryCards = buildSummaryCards(summary)

  // Ações simples de navegação e abertura de modais.
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

  // O mesmo modal serve para criar e editar. O formMode decide qual chamada será feita.
  async function handleSubmitFormModal(values: EquipmentFormValues) {
    const payload = buildEquipmentPayload(values)

    try {
      if (formMode === 'edit' && equipmentInForm) {
        await updateEquipment.update({
          equipmentId: equipmentInForm.id,
          payload,
        })
        messageApi.success('Equipamento atualizado com sucesso.')
      } else {
        await createEquipment.create(payload)
        messageApi.success('Equipamento cadastrado com sucesso.')
      }

      await Promise.all([equipmentListQuery.reload(), equipmentSummaryQuery.reload()])
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

  // Alterar status é uma ação menor, por isso usa um modal separado do formulário completo.
  async function handleSubmitStatusModal(values: EquipmentStatusFormValues) {
    if (!equipmentInStatus) {
      return
    }

    try {
      await updateEquipmentStatus.updateStatus({
        equipmentId: equipmentInStatus.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })

      await Promise.all([equipmentListQuery.reload(), equipmentSummaryQuery.reload()])
      messageApi.success('Status atualizado com sucesso.')
      setEquipmentInStatus(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  // Quando filtros mudam, voltamos para a primeira página para evitar páginas vazias.
  function handleClearFilters() {
    setSearchText('')
    setDebouncedSearchText('')
    setSelectedStatus(undefined)
    setSelectedType(undefined)
    setCurrentPage(1)
  }

  function handleSearchChange(value: string) {
    setSearchText(value)
  }

  function handleStatusChange(value?: EquipmentStatus) {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  function handleTypeChange(value?: EquipmentType) {
    setSelectedType(value)
    setCurrentPage(1)
  }

  function handlePageChange(nextPage: number, nextPageSize: number) {
    setCurrentPage(nextPage)
    setPageSize(nextPageSize)
  }

  return (
    <AppLayout currentPage="Equipamentos">
      <Container>
        {/* Cabeçalho da página e botão para abrir o cadastro. */}
        <PageHeader onCreateEquipment={handleCreateEquipment} />

        {/* Cards com totais vindos de GET /equipment/summary. */}
        <SummaryCards summaries={summaryCards} />

        {/* Filtros controlados pela página. Cada alteração refaz a busca da lista. */}
        <EquipmentFilters
          searchText={searchText}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onTypeChange={handleTypeChange}
          onClear={handleClearFilters}
        />

        {/* Erros de carregamento aparecem acima da tabela. */}
        {loadError && (
          <Alert
            showIcon
            message="Erro ao carregar equipamentos"
            description={loadError}
            type="error"
          />
        )}

        {/* Se não houver dados, mostramos estado vazio; caso contrário, mostramos a tabela. */}
        {!isLoading && !loadError && visibleEquipment.length === 0 ? (
          <Empty description="Nenhum equipamento encontrado." />
        ) : (
          <EquipmentTable
            equipments={visibleEquipment}
            loading={isLoading}
            pagination={{
              // A tabela usa o total que veio no meta da API para montar a paginação.
              current: currentPage,
              pageSize,
              total: paginationInfo?.total ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20],
              showTotal: (total) => `${total} equipamentos no total`,
              onChange: handlePageChange,
            }}
            onChangeStatusEquipment={setEquipmentInStatus}
            onEditEquipment={handleEditEquipment}
            onRemoveEquipment={setEquipmentToRemove}
            onViewEquipment={handleViewEquipment}
          />
        )}

        {/* Modal compartilhado para criar e editar equipamento. */}
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

        {/* Modal específico para mudança rápida de status. */}
        <EquipmentStatusModal
          confirmLoading={isSavingStatus}
          equipment={equipmentInStatus}
          open={Boolean(equipmentInStatus)}
          statusOptions={statusOptions}
          onCancel={() => setEquipmentInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />

        {/* Exclusão ainda é visual nesta aula; o DELETE fica como evolução. */}
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
