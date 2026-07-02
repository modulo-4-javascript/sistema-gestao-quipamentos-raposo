import type { EquipmentHistoryItem } from '../../types/equipment'
import { DateText, Description, Event, EventTitle, HistoryCard, Timeline, Title } from './styles'

interface EquipmentHistoryCardProps {
  history: EquipmentHistoryItem[]
}

export function EquipmentHistoryCard({ history }: EquipmentHistoryCardProps) {
  return (
    <HistoryCard styles={{ body: { padding: 24 } }}>
      <Title>Histórico recente</Title>

      <Timeline>
        {history.map((event) => (
          <Event key={event.id}>
            <DateText>{event.date}</DateText>
            <EventTitle>{event.title}</EventTitle>
            <Description>{event.description}</Description>
          </Event>
        ))}
      </Timeline>
    </HistoryCard>
  )
}
