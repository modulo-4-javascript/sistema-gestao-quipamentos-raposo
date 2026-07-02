import { Form, Input, Select } from 'antd'
import { useEffect } from 'react'
import {
  getEquipmentStatusLabel,
  getEquipmentTypeLabel,
  type Equipment,
  type EquipmentLocationOption,
  type EquipmentStatus,
  type EquipmentType,
} from '../../types/equipment'
import { FormGrid, FormModal, FullField } from './styles'

export type EquipmentFormMode = 'create' | 'edit'

export interface EquipmentFormValues {
  name: string
  type?: EquipmentType
  model?: string
  status?: EquipmentStatus
  locationId?: string
  responsibleUserName?: string
  serialNumber?: string
  notes?: string
}

interface EquipmentFormModalProps {
  equipment?: Equipment
  confirmLoading?: boolean
  mode: EquipmentFormMode
  open: boolean
  locationOptions: EquipmentLocationOption[]
  statusOptions: EquipmentStatus[]
  typeOptions: EquipmentType[]
  onCancel: () => void
  onSubmit: (values: EquipmentFormValues) => void
}

const emptyEquipmentForm: Partial<EquipmentFormValues> = {
  name: '',
  type: undefined,
  model: '',
  status: undefined,
  locationId: undefined,
  responsibleUserName: '',
  serialNumber: '',
  notes: '',
}

export function EquipmentFormModal({
  equipment,
  confirmLoading,
  mode,
  open,
  locationOptions,
  statusOptions,
  typeOptions,
  onCancel,
  onSubmit,
}: EquipmentFormModalProps) {
  const [form] = Form.useForm()
  const isEditing = mode === 'edit'

  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue(
        equipment
          ? {
              name: equipment.name,
              type: equipment.type,
              model: equipment.model,
              status: equipment.status,
              locationId: equipment.locationId ?? undefined,
              responsibleUserName: equipment.responsibleUserName ?? '',
              serialNumber: equipment.serialNumber,
              notes: equipment.notes ?? '',
            }
          : emptyEquipmentForm,
      )
    }
  }, [equipment, form, open])

  function handleSubmit() {
    form
      .validateFields()
      .then((values: EquipmentFormValues) => {
        // Fluxo da aula: formulário -> payload -> service -> API -> atualização da tela.
        onSubmit(values)
      })
      .catch(() => undefined)
  }

  return (
    <FormModal
      centered
      destroyOnHidden
      open={open}
      title={isEditing ? "Editar equipamento" : "Novo equipamento"}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      width={800}
      styles={{
        mask: { backdropFilter: "blur(2px)", background: "rgb(0 0 0 / 45%)" },
      }}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        key={`${mode}-${equipment?.id ?? "empty"}`}
        layout="vertical"
        initialValues={emptyEquipmentForm}
        requiredMark={false}
      >
        <FormGrid>
          <Form.Item
            label="Nome do equipamento *"
            name="name"
            rules={[
              { required: true, message: "Informe o nome do equipamento." },
            ]}
          >
            <Input placeholder="Ex: Notebook Dell" />
          </Form.Item>

          <Form.Item label="Tipo" name="type">
            <Select
              placeholder="Selecione o tipo..."
              options={typeOptions.map((type) => ({
                label: getEquipmentTypeLabel(type),
                value: type,
              }))}
            />
          </Form.Item>

          <Form.Item label="Modelo" name="model">
            <Input placeholder="Ex: Sigma 300" />
          </Form.Item>

          <Form.Item label="Número de série" name="serialNumber">
            <Input placeholder="Ex: SN-12345" />
          </Form.Item>

          <Form.Item label="Localização" name="locationId">
            <Select
              allowClear
              placeholder="Selecione o local..."
              options={locationOptions.map((location) => ({
                label: location.label,
                value: location.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              placeholder="Selecione o status..."
              options={statusOptions.map((status) => ({
                label: getEquipmentStatusLabel(status),
                value: status,
              }))}
            />
          </Form.Item>

          <Form.Item label="Responsável" name="responsibleUserName">
            <Input placeholder="Ex: Equipe de patrimônio" />
          </Form.Item>

          <FullField>
            <Form.Item label="Observações" name="notes">
              <Input.TextArea placeholder="Informações adicionais sobre o equipamento..." />
            </Form.Item>
          </FullField>
        </FormGrid>
      </Form>
    </FormModal>
  )
}
