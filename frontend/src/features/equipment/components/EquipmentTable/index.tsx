import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined'
import ComputerOutlined from '@mui/icons-material/ComputerOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import { Dropdown, Table } from 'antd'
import type { TableProps } from 'antd'
import type { Equipment } from '../../types/equipment'
import { StatusBadge } from '../StatusBadge'
import {
  ActionButton,
  EquipmentCell,
  EquipmentCode,
  EquipmentIcon,
  EquipmentName,
  TableCard,
} from './styles'

interface EquipmentTableProps {
  equipments: Equipment[]
  onChangeStatusEquipment: (equipment: Equipment) => void
  onEditEquipment: (equipment: Equipment) => void
  onRemoveEquipment: (equipment: Equipment) => void
  onViewEquipment?: (equipment: Equipment) => void
}

interface EquipmentTableActions {
  onChangeStatusEquipment: (equipment: Equipment) => void
  onEditEquipment: (equipment: Equipment) => void
  onRemoveEquipment: (equipment: Equipment) => void
  onViewEquipment?: (equipment: Equipment) => void
}

// As colunas dizem para o Ant Design como a tabela deve montar cada campo.
function getColumns({
  onChangeStatusEquipment,
  onEditEquipment,
  onRemoveEquipment,
  onViewEquipment,
}: EquipmentTableActions): TableProps<Equipment>['columns'] {
  return [
    {
      title: 'Equipamento',
      dataIndex: 'name',
      key: 'name',
      render: (_, equipment) => (
        // Render customizado: em vez de mostrar só texto, criamos ícone + nome + ID.
        <EquipmentCell>
          <EquipmentIcon>
            <ComputerOutlined fontSize="small" />
          </EquipmentIcon>
          <span>
            <EquipmentName>{equipment.name}</EquipmentName>
            <EquipmentCode>{equipment.id}</EquipmentCode>
          </span>
        </EquipmentCell>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Modelo',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Equipment['status']) => <StatusBadge status={status} />,
    },
    {
      title: 'Localização',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Última Atualização',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, equipment) => (
        // Menu de ações. Ainda está visual, mas já prepara a conversa sobre CRUD.
        <Dropdown
          trigger={['click']}
          menu={{
            onClick: ({ key }) => {
              if (key === 'view' && onViewEquipment) {
                onViewEquipment(equipment)
              }

              if (key === 'edit') {
                onEditEquipment(equipment)
              }

              if (key === 'status') {
                onChangeStatusEquipment(equipment)
              }

              if (key === 'remove') {
                onRemoveEquipment(equipment)
              }
            },
            items: [
              ...(onViewEquipment
                ? [
                    {
                      key: 'view',
                      icon: <VisibilityOutlined fontSize="small" />,
                      label: 'Visualizar',
                    },
                  ]
                : []),
              {
                key: 'edit',
                icon: <EditOutlined fontSize="small" />,
                label: 'Editar',
              },
              {
                key: 'status',
                icon: <AutorenewOutlined fontSize="small" />,
                label: 'Alterar status',
              },
              {
                key: 'remove',
                icon: <DeleteOutlineOutlined fontSize="small" />,
                label: 'Excluir',
                danger: true,
              },
            ],
          }}
        >
          <ActionButton
            aria-label={`Abrir ações de ${equipment.name}`}
            icon={<MoreHorizOutlined fontSize="small" />}
            type="text"
          />
        </Dropdown>
      ),
    },
  ]
}

export function EquipmentTable({
  equipments,
  onChangeStatusEquipment,
  onEditEquipment,
  onRemoveEquipment,
  onViewEquipment,
}: EquipmentTableProps) {
  return (
    <TableCard styles={{ body: { padding: 0 } }}>
      {/* Este componente foi separado para reaproveitarmos em outras telas */}
      <Table
        columns={getColumns({
          onChangeStatusEquipment,
          onEditEquipment,
          onRemoveEquipment,
          onViewEquipment,
        })}
        dataSource={equipments}
        pagination={false}
        // rowKey informa qual campo identifica cada linha de forma única.
        rowKey="id"
        scroll={{ x: 980 }}
      />
    </TableCard>
  )
}
