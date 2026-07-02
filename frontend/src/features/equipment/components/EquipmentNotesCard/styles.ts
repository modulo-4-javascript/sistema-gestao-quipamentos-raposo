import { Card } from 'antd'
import styled from 'styled-components'

export const NotesCard = styled(Card)`
  &.ant-card {
    border-color: #dde6ee;
    box-shadow: 0 1px 2px rgb(17 24 39 / 5%);
  }
`

export const Title = styled.h3`
  margin: 0 0 16px;
  color: #002a64;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`

export const NotesText = styled.p`
  margin: 0;
  padding: 16px;
  color: #111827;
  background: #f9f9ff;
  border: 1px solid #dde6ee;
  border-radius: 8px;
  font-size: 14px;
  line-height: 22px;
`
