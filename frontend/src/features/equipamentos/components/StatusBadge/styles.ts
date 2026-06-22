import { Tag } from 'antd'
import styled from 'styled-components'
import type { EquipmentStatus } from '../../types/equipamento'

interface StatusTagProps {
  $status: EquipmentStatus
}

function getTextColor(status: EquipmentStatus) {
  if (status === 'Disponível') {
    return '#007c8c'
  }

  if (status === 'Em manutenção') {
    return 'var(--brand-primary)'
  }

  return 'var(--text-muted)'
}

function getBackgroundColor(status: EquipmentStatus) {
  if (status === 'Disponível') {
    return 'var(--success-bg)'
  }

  if (status === 'Em manutenção') {
    return 'var(--info-bg)'
  }

  return '#f3f4f6'
}

function getBorderColor(status: EquipmentStatus) {
  if (status === 'Disponível') {
    return '#b5f5ec'
  }

  if (status === 'Em manutenção') {
    return '#bae0ff'
  }

  return 'var(--border-default)'
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
