import {
  formatEquipmentDate,
  getEquipmentTypeLabel,
  type EquipmentDetail,
} from '../../types/equipment'
import {
  Avatar,
  DescriptionList,
  Detail,
  InfoCard,
  Responsible,
  Term,
  Title,
  Value,
} from './styles'

interface EquipmentInfoCardProps {
  equipment: EquipmentDetail
}

export function EquipmentInfoCard({ equipment }: EquipmentInfoCardProps) {
  const responsibleLabel = equipment.responsibleUserName ?? 'Equipe de patrimônio'

  return (
    <InfoCard styles={{ body: { padding: 24 } }}>
      <Title>Informações gerais</Title>

      <DescriptionList>
        <Detail>
          <Term>Tipo</Term>
          <Value>{getEquipmentTypeLabel(equipment.type)}</Value>
        </Detail>

        <Detail>
          <Term>Modelo</Term>
          <Value>{equipment.model ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>S/N (Serial Number)</Term>
          <Value>{equipment.serialNumber ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Localização</Term>
          <Value>{equipment.locationName ?? 'Sem localização'}</Value>
        </Detail>

        <Detail>
          <Term>Responsável</Term>
          <Value>
            <Responsible>
              <Avatar>{responsibleLabel.slice(0, 2).toUpperCase()}</Avatar>
              {responsibleLabel}
            </Responsible>
          </Value>
        </Detail>

        <Detail>
          <Term>Data de cadastro</Term>
          <Value>{formatEquipmentDate(equipment.createdAt)}</Value>
        </Detail>

        <Detail>
          <Term>Última atualização</Term>
          <Value>{formatEquipmentDate(equipment.updatedAt)}</Value>
        </Detail>
      </DescriptionList>
    </InfoCard>
  )
}
