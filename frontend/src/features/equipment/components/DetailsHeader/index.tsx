import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { Button } from 'antd'
import type { EquipmentDetail } from '../../types/equipment'
import { StatusBadge } from '../StatusBadge'
import {
  Actions,
  BackButton,
  BrandButton,
  Code,
  HeaderContainer,
  Title,
  TitleGroup,
  TitleRow,
} from './styles'

interface DetailsHeaderProps {
  equipment: EquipmentDetail
  onBack: () => void
  onChangeStatus: () => void
  onEdit: () => void
  onRemove: () => void
}

export function DetailsHeader({
  equipment,
  onBack,
  onChangeStatus,
  onEdit,
  onRemove,
}: DetailsHeaderProps) {
  return (
    <HeaderContainer>
      <TitleGroup>
        <BackButton icon={<ArrowBackOutlined fontSize="small" />} type="text" onClick={onBack}>
          Voltar para equipamentos
        </BackButton>

        <TitleRow>
          <Title>{equipment.name}</Title>
          <StatusBadge status={equipment.status} />
        </TitleRow>

        <Code>{equipment.id}</Code>
      </TitleGroup>

      <Actions>
        <BrandButton type="primary" icon={<EditOutlined fontSize="small" />} onClick={onEdit}>
          Editar
        </BrandButton>

        <Button icon={<AutorenewOutlined fontSize="small" />} onClick={onChangeStatus}>
          Alterar status
        </Button>

        <Button danger icon={<DeleteOutlineOutlined fontSize="small" />} onClick={onRemove}>
          Excluir
        </Button>
      </Actions>
    </HeaderContainer>
  )
}
