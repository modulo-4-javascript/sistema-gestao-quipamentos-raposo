import PinDropOutlined from '@mui/icons-material/PinDropOutlined'
import { Alert, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { useState } from 'react'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { useLocationList } from '../../hooks/useLocationList'
import { useLocationSummary } from '../../hooks/useLocationSummary'
import {
  formatLocationDate,
  getLocationStatusLabel,
  getLocationTypeLabel,
  type LocationDetails,
} from '../../types/location'
import {
  Container,
  Header,
  HeaderText,
  LocationCode,
  LocationName,
  SummaryGrid,
  SummaryItem,
  TableCard,
  Title,
} from './styles'

const defaultPageSize = 10

const locationColumns: TableProps<LocationDetails>['columns'] = [
  {
    title: 'Localização',
    dataIndex: 'name',
    key: 'name',
    render: (_, location) => (
      <span>
        <LocationName>{location.name}</LocationName>
        <LocationCode>{location.code}</LocationCode>
      </span>
    ),
  },
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    render: (type: LocationDetails['type']) => getLocationTypeLabel(type),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: LocationDetails['status']) => (
      <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>
        {getLocationStatusLabel(status)}
      </Tag>
    ),
  },
  {
    title: 'Prédio',
    dataIndex: 'building',
    key: 'building',
    render: (_, location) => location.building ?? 'Não informado',
  },
  {
    title: 'Equipamentos',
    dataIndex: 'equipmentCount',
    key: 'equipmentCount',
  },
  {
    title: 'Atualizado',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: LocationDetails['updatedAt']) => formatLocationDate(updatedAt),
  },
]

export function LocationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const locationListQuery = useLocationList({
    page: currentPage,
    pageSize,
  })
  const locationSummaryQuery = useLocationSummary()

  const locations = locationListQuery.data?.data ?? []
  const paginationInfo = locationListQuery.data?.meta
  const summary = locationSummaryQuery.data
  const isLoading = locationListQuery.isLoading || locationSummaryQuery.isLoading
  const loadError = locationListQuery.errorMessage || locationSummaryQuery.errorMessage

  function handlePageChange(nextPage: number, nextPageSize: number) {
    setCurrentPage(nextPage)
    setPageSize(nextPageSize)
  }

  return (
    <AppLayout currentPage="Localizações">
      <Container>
        <Header>
          <HeaderText>
            <Title>Localizações</Title>
          </HeaderText>
        </Header>

        <SummaryGrid>
          <SummaryItem>
            <PinDropOutlined fontSize="small" />
            <span>Total</span>
            <strong>{summary?.total ?? 0}</strong>
          </SummaryItem>
          <SummaryItem>
            <span>Ativas</span>
            <strong>{summary?.active ?? 0}</strong>
          </SummaryItem>
          <SummaryItem>
            <span>Inativas</span>
            <strong>{summary?.inactive ?? 0}</strong>
          </SummaryItem>
          <SummaryItem>
            <span>Equipamentos vinculados</span>
            <strong>{summary?.equipmentCount ?? 0}</strong>
          </SummaryItem>
        </SummaryGrid>

        {loadError && (
          <Alert
            showIcon
            message="Erro ao carregar localizações"
            description={loadError}
            type="error"
          />
        )}

        <TableCard styles={{ body: { padding: 0 } }}>
          <Table
            columns={locationColumns}
            dataSource={locations}
            loading={isLoading}
            locale={{ emptyText: 'Nenhuma localização encontrada.' }}
            pagination={{
              current: currentPage,
              pageSize,
              total: paginationInfo?.total ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20],
              showTotal: (total) => `${total} localizações no total`,
              onChange: handlePageChange,
            }}
            rowKey="id"
            size="middle"
            tableLayout="fixed"
            scroll={{ x: 'max-content', y: 'clamp(280px, 42vh, 520px)' }}
          />
        </TableCard>
      </Container>
    </AppLayout>
  )
}
