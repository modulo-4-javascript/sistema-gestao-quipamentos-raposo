import { AppLayout } from '../../../../app/layout/AppLayout'
import { Container, StarterBox } from './styles'

export function EquipmentDetailsPage() {
  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <StarterBox>
          AULA 06: esta página está pronta para ser conectada aos mocks de detalhe.
          O passo a passo está em frontend/docs/aula-06/README-alunos.md.
        </StarterBox>

        {/*
          AULA 06 - roteiro de implementação:

          1. Importar useNavigate e useParams de react-router-dom.
          2. Importar findEquipmentDetailById e getEquipmentDetailSummary.
          3. Importar os componentes DetailsHeader, DetailSummaryCards,
             EquipmentInfoCard, EquipmentNotesCard e EquipmentHistoryCard.
          4. Ler o equipmentId da URL.
          5. Buscar o equipamento no mock.
          6. Montar os cards de resumo a partir do equipamento.
          7. Renderizar o layout de detalhes.

          O README dos alunos mostra o código de cada etapa.
        */}
      </Container>
    </AppLayout>
  )
}
