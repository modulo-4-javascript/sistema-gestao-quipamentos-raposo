import { StatusModal } from '../../../../shared/components/StatusModal'
import type { StatusFormValues } from '../../../../shared/components/StatusModal'
import {
  getEquipmentStatusLabel,
  type Equipment,
  type EquipmentStatus,
} from '../../types/equipment'

export type EquipmentStatusFormValues = StatusFormValues<EquipmentStatus>

interface EquipmentStatusModalProps {
  equipment?: Equipment
  confirmLoading?: boolean
  open: boolean
  statusOptions: EquipmentStatus[]
  onCancel: () => void
  onSubmit: (values: EquipmentStatusFormValues) => void
}

export function EquipmentStatusModal({
  equipment,
  confirmLoading,
  open,
  statusOptions,
  onCancel,
  onSubmit,
}: EquipmentStatusModalProps) {
  return (
    <StatusModal
      confirmLoading={confirmLoading}
      currentStatus={equipment?.status}
      currentStatusPrefix="Status atual"
      getStatusLabel={getEquipmentStatusLabel}
      notePlaceholder="Ex: equipamento enviado para manutenção preventiva."
      open={open}
      statusLabel="Novo status"
      statusOptions={statusOptions}
      title="Alterar status"
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
}
