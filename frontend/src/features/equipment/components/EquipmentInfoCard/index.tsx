import type { EquipmentDetail } from '../../types/equipment'
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
  return (
    <InfoCard styles={{ body: { padding: 24 } }}>
      <Title>Informações gerais</Title>

      <DescriptionList>
        <Detail>
          <Term>Tipo</Term>
          <Value>{equipment.type}</Value>
        </Detail>

        <Detail>
          <Term>Modelo</Term>
          <Value>{equipment.model}</Value>
        </Detail>

        <Detail>
          <Term>S/N (Serial Number)</Term>
          <Value>{equipment.serialNumber}</Value>
        </Detail>

        <Detail>
          <Term>Localização</Term>
          <Value>{equipment.location}</Value>
        </Detail>

        <Detail>
          <Term>Responsável</Term>
          <Value>
            <Responsible>
              <Avatar>{equipment.responsible.initials}</Avatar>
              {equipment.responsible.name}
            </Responsible>
          </Value>
        </Detail>

        <Detail>
          <Term>Data de cadastro</Term>
          <Value>{equipment.createdAt}</Value>
        </Detail>

        <Detail>
          <Term>Última atualização</Term>
          <Value>{equipment.lastUpdate}</Value>
        </Detail>
      </DescriptionList>
    </InfoCard>
  )
}
