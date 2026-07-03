import { Card } from 'antd'
import styled from 'styled-components'

export const Container = styled.section`
  display: flex;
  width: 100%;
  max-width: 1440px;
  flex-direction: column;
  gap: 24px;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`

export const HeaderText = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`

export const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

export const SummaryGrid = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const SummaryItem = styled(Card)`
  border: 1px solid #d9e2ec;

  .ant-card-body {
    display: grid;
    min-height: 112px;
    align-content: space-between;
    gap: 12px;
    padding: 20px;
  }

  span {
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
  }

  strong {
    color: #111827;
    font-size: 32px;
    font-weight: 700;
    line-height: 40px;
  }
`

export const TableCard = styled(Card)`
  overflow: hidden;
  border: 1px solid #d9e2ec;
`

export const LocationName = styled.strong`
  display: block;
  overflow: hidden;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const LocationCode = styled.span`
  display: block;
  color: #6b7280;
  font-size: 13px;
  line-height: 18px;
`
