import { Card } from 'antd'
import styled from 'styled-components'

export const HistoryCard = styled(Card)`
  &.ant-card {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 100%;
    border-color: #dde6ee;
    box-shadow: 0 1px 2px rgb(17 24 39 / 5%);
  }

  .ant-card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  @media (max-width: 1100px) {
    &.ant-card {
      flex: initial;
      min-height: auto;
    }
  }
`

export const Title = styled.h3`
  margin: 0 0 24px;
  color: #002a64;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`

export const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: 24px;
  align-content: start;
  margin: 0;
  padding: 0 0 0 24px;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 5px;
    width: 1px;
    background: #dde6ee;
  }
`

export const Event = styled.li`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: -24px;
    width: 12px;
    height: 12px;
    background: #007c8c;
    border: 3px solid #e6fffb;
    border-radius: 999px;
  }
`

export const DateText = styled.span`
  display: block;
  color: #6b7280;
  font-size: 12px;
  line-height: 18px;
`

export const EventTitle = styled.strong`
  display: block;
  color: #111827;
  font-size: 14px;
  line-height: 22px;
`

export const Description = styled.span`
  display: block;
  color: #6b7280;
  font-size: 13px;
  line-height: 20px;
`
