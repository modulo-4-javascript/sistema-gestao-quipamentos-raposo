import { Form, Select } from 'antd'
import type { Equipment, EquipmentStatus } from '../../types/equipment'
import { CurrentStatusText, StatusModal } from './styles'

interface EquipmentStatusModalProps {
  equipment?: Equipment
  open: boolean
  statusOptions: EquipmentStatus[]
  onCancel: () => void
  onSubmit: () => void
}

export function EquipmentStatusModal({
  equipment,
  open,
  statusOptions,
  onCancel,
  onSubmit,
}: EquipmentStatusModalProps) {
  return (
    <StatusModal
      centered
      destroyOnHidden
      open={open}
      title="Alterar status"
      okText="Salvar"
      cancelText="Cancelar"
      width={480}
      maskStyle={{
        backdropFilter: 'blur(2px)',
        background: 'rgb(0 0 0 / 45%)',
      }}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form layout="vertical">
        <Form.Item label="Novo status" name="status">
          <Select
            placeholder="Selecione o status..."
            options={statusOptions.map((status) => ({
              label: status,
              value: status,
            }))}
          />
        </Form.Item>
      </Form>

      <CurrentStatusText>Status atual: {equipment?.status ?? '-'}</CurrentStatusText>
    </StatusModal>
  )
}
