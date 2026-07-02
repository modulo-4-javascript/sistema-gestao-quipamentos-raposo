import SearchOutlined from '@mui/icons-material/SearchOutlined'
import { Button, Input, Select } from 'antd'
import {
  getEquipmentStatusLabel,
  getEquipmentTypeLabel,
  type EquipmentStatus,
  type EquipmentType,
} from '../../types/equipment'
import { Field, FieldLabel, FilterCard, FiltersGrid } from './styles'

interface EquipmentFiltersProps {
  // Estes valores vêm da página principal.
  // Assim, a página continua sendo dona dos filtros.
  searchText: string
  selectedStatus?: EquipmentStatus
  selectedType?: EquipmentType
  statusOptions: EquipmentStatus[]
  typeOptions: EquipmentType[]
  onSearchChange: (value: string) => void
  onStatusChange: (value?: EquipmentStatus) => void
  onTypeChange: (value?: EquipmentType) => void
  onClear: () => void
}

export function EquipmentFilters({
  searchText,
  selectedStatus,
  selectedType,
  statusOptions,
  typeOptions,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onClear,
}: EquipmentFiltersProps) {
  return (
    <FilterCard styles={{ body: { padding: 24 } }}>
      <FiltersGrid>
        <Field>
          <FieldLabel>Busca</FieldLabel>
          <Input
            allowClear
            prefix={<SearchOutlined fontSize="small" />}
            placeholder="Nome, modelo ou ID..."
            value={searchText}
            // A cada digitação, avisamos a página para atualizar o estado da busca.
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            allowClear
            placeholder="Todos"
            value={selectedStatus}
            // O Select chama esta função quando o usuário escolhe ou limpa um status.
            onChange={(value?: EquipmentStatus) => onStatusChange(value)}
            options={statusOptions.map((status) => ({
              label: getEquipmentStatusLabel(status),
              value: status,
            }))}
            style={{ width: '100%' }}
          />
        </Field>

        <Field>
          <FieldLabel>Tipo</FieldLabel>
          <Select
            allowClear
            placeholder="Selecione um tipo..."
            value={selectedType}
            // O tipo também fica salvo na página principal.
            onChange={(value?: EquipmentType) => onTypeChange(value)}
            options={typeOptions.map((type) => ({
              label: getEquipmentTypeLabel(type),
              value: type,
            }))}
            style={{ width: '100%' }}
          />
        </Field>

        <Button onClick={onClear}>Limpar filtros</Button>
      </FiltersGrid>
    </FilterCard>
  )
}
