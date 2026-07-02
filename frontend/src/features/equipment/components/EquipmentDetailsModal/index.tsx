import ComputerOutlined from '@mui/icons-material/ComputerOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { Button, Modal } from 'antd'
import type { Equipment } from '../../types/equipment'
import { StatusBadge } from '../StatusBadge'
import {
  Code,
  DetailItem,
  DetailLabel,
  DetailsGrid,
  DetailValue,
  Header,
  IconBox,
  Title,
  TitleGroup,
} from './styles'

interface EquipmentDetailsModalProps {
  equipment?: Equipment
  open: boolean
  onCancel: () => void
  onEdit: (equipment: Equipment) => void
}

export function EquipmentDetailsModal({
  equipment,
  open,
  onCancel,
  onEdit,
}: EquipmentDetailsModalProps) {
  return (
    <Modal
      open={open}
      title="Detalhes do equipamento"
      width={680}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Fechar
        </Button>,
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined fontSize="small" />}
          disabled={!equipment}
          onClick={() => equipment && onEdit(equipment)}
        >
          Editar
        </Button>,
      ]}
    >
      {equipment && (
        <>
          <Header>
            <IconBox>
              <ComputerOutlined fontSize="small" />
            </IconBox>

            <TitleGroup>
              <Title>{equipment.name}</Title>
              <Code>{equipment.id}</Code>
              <StatusBadge status={equipment.status} />
            </TitleGroup>
          </Header>

          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Tipo</DetailLabel>
              <DetailValue>{equipment.type}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Modelo</DetailLabel>
              <DetailValue>{equipment.model}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Localização</DetailLabel>
              <DetailValue>{equipment.location}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Última atualização</DetailLabel>
              <DetailValue>{equipment.lastUpdate}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Número de série</DetailLabel>
              <DetailValue>{equipment.serialNumber}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Responsável</DetailLabel>
              <DetailValue>Equipe de patrimônio</DetailValue>
            </DetailItem>
          </DetailsGrid>
        </>
      )}
    </Modal>
  )
}
