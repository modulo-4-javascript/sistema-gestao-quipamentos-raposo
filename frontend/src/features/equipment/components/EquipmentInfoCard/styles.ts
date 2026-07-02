import { Card } from 'antd'
import styled from 'styled-components'

export const InfoCard = styled(Card)`
  &.ant-card {
    border-color: #dde6ee;
    box-shadow: 0 1px 2px rgb(17 24 39 / 5%);
  }
`

export const Title = styled.h3`
  margin: 0 0 24px;
  color: #002a64;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`

export const DescriptionList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 32px;
  margin: 0;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

export const Detail = styled.div`
  min-width: 0;
`

export const Term = styled.dt`
  margin: 0 0 4px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
`

export const Value = styled.dd`
  margin: 0;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
`

export const Responsible = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const Avatar = styled.span`
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  color: #002a64;
  background: #e6f4ff;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
`
