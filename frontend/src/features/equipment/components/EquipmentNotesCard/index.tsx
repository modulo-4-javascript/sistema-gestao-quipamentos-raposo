import { NotesCard, NotesText, Title } from './styles'

interface EquipmentNotesCardProps {
  notes?: string | null
}

export function EquipmentNotesCard({ notes }: EquipmentNotesCardProps) {
  return (
    <NotesCard styles={{ body: { padding: 24 } }}>
      <Title>Observações</Title>
      <NotesText>{notes || 'Nenhuma observação cadastrada.'}</NotesText>
    </NotesCard>
  )
}
