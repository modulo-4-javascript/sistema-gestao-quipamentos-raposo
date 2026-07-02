import { Form, Input, Select } from 'antd'
import { useEffect } from 'react'
import {
  getEquipmentStatusLabel,
  type Equipment,
  type EquipmentStatus,
} from '../../types/equipment'
import { CurrentStatusText, StatusModal } from './styles'

export interface EquipmentStatusFormValues {
  status: EquipmentStatus
  note?: string
}

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
  const [form] = Form.useForm<EquipmentStatusFormValues>()

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        status: equipment?.status,
        note: '',
      })
    }
  }, [equipment, form, open])

  function handleSubmit() {
    form
      .validateFields()
      .then((values) => onSubmit(values))
      .catch(() => undefined)
  }

  return (
    <StatusModal
      centered
      destroyOnHidden
      open={open}
      title="Alterar status"
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      width={480}
      maskStyle={{
        backdropFilter: 'blur(2px)',
        background: 'rgb(0 0 0 / 45%)',
      }}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Novo status"
          name="status"
          rules={[{ required: true, message: 'Selecione o novo status.' }]}
        >
          <Select
            placeholder="Selecione o status..."
            options={statusOptions.map((status) => ({
              label: getEquipmentStatusLabel(status),
              value: status,
            }))}
          />
        </Form.Item>

        <Form.Item label="Observação" name="note">
          <Input.TextArea placeholder="Ex: equipamento enviado para manutenção preventiva." />
        </Form.Item>
      </Form>

      <CurrentStatusText>
        Status atual: {equipment ? getEquipmentStatusLabel(equipment.status) : '-'}
      </CurrentStatusText>
    </StatusModal>
  )
}
