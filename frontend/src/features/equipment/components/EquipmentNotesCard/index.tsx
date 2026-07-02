import { NotesCard, NotesText, Title } from './styles'

interface EquipmentNotesCardProps {
  notes: string
}

export function EquipmentNotesCard({ notes }: EquipmentNotesCardProps) {
  return (
    <NotesCard styles={{ body: { padding: 24 } }}>
      <Title>Observações</Title>
      <NotesText>{notes}</NotesText>
    </NotesCard>
  )
}
