import { Tag } from 'antd'
import styled from 'styled-components'
import type { EquipmentStatus } from '../../types/equipment'

interface StatusTagProps {
  $status: EquipmentStatus
}

function getTextColor(status: EquipmentStatus) {
  if (status === 'AVAILABLE') {
    return '#007c8c'
  }

  if (status === 'IN_MAINTENANCE') {
    return '#002a64'
  }

  return '#6b7280'
}

function getBackgroundColor(status: EquipmentStatus) {
  if (status === 'AVAILABLE') {
    return '#e6fffb'
  }

  if (status === 'IN_MAINTENANCE') {
    return '#e6f4ff'
  }

  return '#f3f4f6'
}

function getBorderColor(status: EquipmentStatus) {
  if (status === 'AVAILABLE') {
    return '#b5f5ec'
  }

  if (status === 'IN_MAINTENANCE') {
    return '#bae0ff'
  }

  return '#dde6ee'
}

export const StatusTag = styled(Tag)<StatusTagProps>`
  &.ant-tag {
    margin: 0;
    color: ${({ $status }) => getTextColor($status)};
    background: ${({ $status }) => getBackgroundColor($status)};
    border-color: ${({ $status }) => getBorderColor($status)};
    border-radius: 999px;
    font-weight: 600;
  }
`
