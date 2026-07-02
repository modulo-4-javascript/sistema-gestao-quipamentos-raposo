import type { Equipment } from '../../types/equipment'
import { Hint, Message, RemoveModal } from './styles'

interface EquipmentRemoveModalProps {
  equipment?: Equipment
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function EquipmentRemoveModal({
  equipment,
  open,
  onCancel,
  onConfirm,
}: EquipmentRemoveModalProps) {
  const equipmentLabel = equipment ? `${equipment.name} ${equipment.model}` : 'este equipamento'

  return (
    <RemoveModal
      centered
      open={open}
      title="Excluir equipamento"
      okText="Excluir"
      cancelText="Cancelar"
      okButtonProps={{ danger: true }}
      width={440}
      maskStyle={{
        backdropFilter: 'blur(2px)',
        background: 'rgb(0 0 0 / 45%)',
      }}
      onCancel={onCancel}
      onOk={onConfirm}
    >
      <Message>Deseja excluir "{equipmentLabel}"?</Message>
      <Hint>Essa ação não poderá ser desfeita.</Hint>
    </RemoveModal>
  )
}
