import type { EquipmentDetailSummary } from '../../types/equipment'
import { Description, Grid, Label, SummaryCard, Value } from './styles'

interface DetailSummaryCardsProps {
  summaries: EquipmentDetailSummary[]
}

export function DetailSummaryCards({ summaries }: DetailSummaryCardsProps) {
  return (
    <Grid aria-label="Resumo do equipamento">
      {summaries.map((summary) => (
        <SummaryCard key={summary.id} styles={{ body: { padding: 16 } }}>
          <Label>{summary.title}</Label>
          <Value>{summary.value}</Value>
          <Description>{summary.description}</Description>
        </SummaryCard>
      ))}
    </Grid>
  )
}
