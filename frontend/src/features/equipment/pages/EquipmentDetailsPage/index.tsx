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
  useEquipmentDetails,
  useEquipmentLocationOptions,
  useUpdateEquipment,
  useUpdateEquipmentStatus,
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

// A API devolve os dados completos; esta função escolhe o que vira card de resumo.
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

// O detalhe vem com locationId. Aqui adicionamos o nome da localização para a tela.
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

  // O ID vem da URL /equipment/:equipmentId e decide qual equipamento buscar.
  const { equipmentId } = useParams()

  // Estes estados controlam apenas os modais da página de detalhes.
  const [equipmentInForm, setEquipmentInForm] = useState<EquipmentDetail>()
  const [equipmentInStatus, setEquipmentInStatus] = useState<EquipmentDetail>()
  const [equipmentToRemove, setEquipmentToRemove] = useState<EquipmentDetail>()

  // Hooks que usam useEffect + axios para buscar e salvar dados na API.
  const equipmentQuery = useEquipmentDetails(equipmentId)
  const locationOptionsQuery = useEquipmentLocationOptions()
  const updateEquipment = useUpdateEquipment()
  const updateEquipmentStatus = useUpdateEquipmentStatus()

  // Garante que a tela sempre tenha uma lista de localizações, mesmo antes da API responder.
  const locationOptions = useMemo(
    () => locationOptionsQuery.data ?? [],
    [locationOptionsQuery.data],
  )

  // Junta os dados do equipamento com o nome da localização antes de renderizar.
  const equipment = useMemo(
    () =>
      equipmentQuery.data
        ? withLocationName(equipmentQuery.data, locationOptions)
        : undefined,
    [equipmentQuery.data, locationOptions],
  )

  // Loading e erro combinam as duas buscas necessárias para montar o detalhe.
  const isLoading = equipmentQuery.isLoading || locationOptionsQuery.isLoading
  const loadError =
    (!equipmentId ? 'ID do equipamento não encontrado na rota.' : '') ||
    equipmentQuery.errorMessage ||
    locationOptionsQuery.errorMessage
  const isSavingForm = updateEquipment.isLoading
  const isSavingStatus = updateEquipmentStatus.isLoading

  // Cards de resumo são derivados do equipamento carregado.
  const summaries = useMemo(
    () => (equipment ? buildDetailSummary(equipment) : []),
    [equipment],
  )

  // Abre o modal de edição usando o equipamento já carregado.
  function handleEditEquipment() {
    if (equipment) {
      setEquipmentInForm(equipment)
    }
  }

  // Abre o modal de alteração de status usando o equipamento já carregado.
  function handleChangeStatus() {
    if (equipment) {
      setEquipmentInStatus(equipment)
    }
  }

  // Salva a edição e depois recarrega o detalhe para mostrar os dados atualizados.
  async function handleSubmitFormModal(values: EquipmentFormValues) {
    if (!equipmentInForm) {
      return
    }

    try {
      await updateEquipment.update({
        equipmentId: equipmentInForm.id,
        payload: buildEquipmentPayload(values),
      })
      await equipmentQuery.reload()
      messageApi.success('Equipamento atualizado com sucesso.')
      setEquipmentInForm(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  // Salva o novo status e depois recarrega o detalhe para atualizar cards e histórico.
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
      await equipmentQuery.reload()
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

  // Enquanto o detalhe ou as localizações carregam, mostramos um estado simples de espera.
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

  // Se a API falhar ou o equipamento não existir, mostramos uma mensagem de erro didática.
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
        {/* Cabeçalho com ações principais: voltar, editar, status e excluir. */}
        <DetailsHeader
          equipment={equipment}
          onBack={() => navigate('/equipment')}
          onChangeStatus={handleChangeStatus}
          onEdit={handleEditEquipment}
          onRemove={() => setEquipmentToRemove(equipment)}
        />

        {/* Cards calculados a partir do equipamento carregado pela API. */}
        <DetailSummaryCards summaries={summaries} />

        {/* Conteúdo principal: informações gerais, observações e histórico recente. */}
        <ContentGrid>
          <MainColumn>
            <EquipmentInfoCard equipment={equipment} />
            <EquipmentNotesCard notes={equipment.notes} />
          </MainColumn>

          <SideColumn>
            <EquipmentHistoryCard history={equipment.recentHistory} />
          </SideColumn>
        </ContentGrid>

        {/* Modal de edição do equipamento atual. */}
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
