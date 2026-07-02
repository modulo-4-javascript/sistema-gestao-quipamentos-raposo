import { Form, Input, Select } from 'antd'
import { useEffect } from 'react'
import type { Equipment, EquipmentStatus, EquipmentType } from '../../types/equipment'
import { FormGrid, FormModal, FullField } from './styles'

export type EquipmentFormMode = 'create' | 'edit'

interface EquipmentFormModalProps {
  equipment?: Equipment
  mode: EquipmentFormMode
  open: boolean
  locationOptions: string[]
  statusOptions: EquipmentStatus[]
  typeOptions: EquipmentType[]
  onCancel: () => void
  onSubmit: () => void
}

const emptyEquipmentForm = {
  name: '',
  type: undefined,
  model: '',
  status: undefined,
  location: undefined,
  serialNumber: '',
  observations: '',
}

export function EquipmentFormModal({
  equipment,
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
      form.setFieldsValue(emptyEquipmentForm)
    }
  }, [form, open])

  function handleSubmit() {
    form
      .validateFields()
      .then(() => {
        onSubmit();
      })
      .catch(() => undefined);
  }

  return (
    <FormModal
      centered
      destroyOnHidden
      open={open}
      title={isEditing ? "Editar equipamento" : "Novo equipamento"}
      okText="Salvar"
      cancelText="Cancelar"
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
            <Input placeholder="Ex: SN-12345" />
          </Form.Item>

          <Form.Item label="Tipo" name="type">
            <Select
              placeholder="Selecione o tipo..."
              options={typeOptions.map((type) => ({
                label: type,
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

          <Form.Item label="Localização" name="location">
            <Select
              placeholder="Selecione o local..."
              options={locationOptions.map((location) => ({
                label: location,
                value: location,
              }))}
            />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select
              placeholder="Selecione o status..."
              options={statusOptions.map((status) => ({
                label: status,
                value: status,
              }))}
            />
          </Form.Item>

          <FullField>
            <Form.Item label="Observações" name="observations">
              <Input.TextArea placeholder="Informações adicionais sobre o equipamento..." />
            </Form.Item>
          </FullField>
        </FormGrid>
      </Form>
    </FormModal>
  );
}
