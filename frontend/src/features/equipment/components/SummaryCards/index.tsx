import BlockOutlined from '@mui/icons-material/BlockOutlined'
import BuildOutlined from '@mui/icons-material/BuildOutlined'
import CheckCircleOutlineOutlined from '@mui/icons-material/CheckCircleOutlineOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import type { EquipmentSummary, SummaryIconName } from '../../types/equipment'
import { CardContent, CardHeader, Grid, IconBox, Label, SummaryCard, Value } from './styles'

interface SummaryCardsProps {
  // A lista de cards vem por props para o componente não depender diretamente do mock.
  summaries: EquipmentSummary[]
}

function renderSummaryIcon(icon: SummaryIconName) {
  // Esta função simples troca o ícone de acordo com o tipo de card.
  if (icon === 'available') {
    return <CheckCircleOutlineOutlined fontSize="small" />
  }

  if (icon === 'maintenance') {
    return <BuildOutlined fontSize="small" />
  }

  if (icon === 'inactive') {
    return <BlockOutlined fontSize="small" />
  }

  return <Inventory2Outlined fontSize="small" />
}

export function SummaryCards({ summaries }: SummaryCardsProps) {
  return (
    <Grid aria-label="Resumo dos equipamentos">
      {/* O map transforma cada item do mock em um card na tela. */}
      {summaries.map((summary) => (
        <SummaryCard
          key={summary.id}
          $lineColor={summary.lineColor}
          styles={{ body: { padding: 25 } }}
        >
          <CardContent>
            <CardHeader>
              <Label>{summary.title}</Label>
              <IconBox $iconBackground={summary.iconBackground}>
                {renderSummaryIcon(summary.icon)}
              </IconBox>
            </CardHeader>

            <Value>{summary.value}</Value>
          </CardContent>
        </SummaryCard>
      ))}
    </Grid>
  )
}
