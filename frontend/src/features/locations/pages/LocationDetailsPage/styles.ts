import { Button, Card, Tag } from 'antd'
import styled from 'styled-components'
import type { EquipmentStatus } from '../../../equipment/types/equipment'
import type { LocationStatus } from '../../types/location'

interface LocationStatusTagProps {
  $status: LocationStatus
}

interface EquipmentStatusTagProps {
  $status: EquipmentStatus
}

export const Container = styled.section`
  width: 100%;
  max-width: 1440px;
`

export const HeaderContainer = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`

export const TitleGroup = styled.div`
  display: grid;
  gap: 8px;
`

export const BackButton = styled(Button)`
  &.ant-btn {
    width: fit-content;
    height: auto;
    padding: 0;
    color: #007c8c;
    font-weight: 700;
  }
`

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const Title = styled.h1`
  margin: 0;
  color: #111827;
  font-size: 32px;
  font-weight: 800;
  line-height: 40px;
`

export const Code = styled.span`
  color: #6b7280;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 14px;
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;

  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`

export const BrandButton = styled(Button)`
  &.ant-btn-primary {
    border: 0;
    background: linear-gradient(90deg, #003f8f, #007c8c);
  }

  &.ant-btn-primary:hover,
  &.ant-btn-primary:focus {
    background: linear-gradient(90deg, #003f8f, #007c8c) !important;
  }
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.75fr);
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

export const MainColumn = styled.div`
  display: grid;
  gap: 24px;
`

export const SideColumn = styled.aside`
  display: flex;
  flex-direction: column;
`

export const InfoCard = styled(Card)`
  &.ant-card {
    border-color: #dde6ee;
    box-shadow: 0 1px 2px rgb(17 24 39 / 5%);
  }
`

export const SectionTitle = styled.h2`
  margin: 0 0 20px;
  color: #111827;
  font-size: 18px;
  font-weight: 800;
  line-height: 26px;
`

export const DescriptionList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
  margin: 0;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const Detail = styled.div`
  display: grid;
  gap: 4px;
`

export const Term = styled.dt`
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
`

export const Value = styled.dd`
  margin: 0;
  color: #111827;
  font-size: 14px;
  line-height: 22px;
`

export const DescriptionText = styled.p`
  margin: 18px 0 0;
  color: #374151;
  font-size: 14px;
  line-height: 22px;
`

export const HistoryList = styled.div`
  display: grid;
  gap: 16px;
`

export const HistoryEvent = styled.article`
  position: relative;
  padding-left: 18px;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 0;
    width: 8px;
    height: 8px;
    background: #007c8c;
    border-radius: 999px;
  }
`

export const HistoryDate = styled.span`
  display: block;
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
`

export const HistoryTitle = styled.strong`
  display: block;
  color: #111827;
  font-size: 14px;
  line-height: 20px;
`

export const HistoryDescription = styled.p`
  margin: 4px 0 0;
  color: #4b5563;
  font-size: 13px;
  line-height: 20px;
`

export const StarterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px;
  color: #6b7280;
  background: #ffffff;
  border: 1px dashed #b7c6d8;
  border-radius: 8px;
  font-size: 14px;
  line-height: 22px;
`

function getLocationStatusTextColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#007c8c' : '#6b7280'
}

function getLocationStatusBackgroundColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#e6fffb' : '#f3f4f6'
}

function getLocationStatusBorderColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#b5f5ec' : '#dde6ee'
}

function getEquipmentStatusTextColor(status: EquipmentStatus) {
  if (status === 'AVAILABLE') {
    return '#007c8c'
  }

  if (status === 'IN_MAINTENANCE') {
    return '#003f8f'
  }

  return '#6b7280'
}

export const LocationStatusTag = styled(Tag)<LocationStatusTagProps>`
  &.ant-tag {
    margin: 0;
    color: ${({ $status }) => getLocationStatusTextColor($status)};
    background: ${({ $status }) => getLocationStatusBackgroundColor($status)};
    border-color: ${({ $status }) => getLocationStatusBorderColor($status)};
    border-radius: 999px;
    font-weight: 600;
  }
`

export const EquipmentStatusTag = styled(Tag)<EquipmentStatusTagProps>`
  &.ant-tag {
    margin: 0;
    color: ${({ $status }) => getEquipmentStatusTextColor($status)};
    background: #f3f7fb;
    border-color: #dde6ee;
    border-radius: 999px;
    font-weight: 600;
  }
`
