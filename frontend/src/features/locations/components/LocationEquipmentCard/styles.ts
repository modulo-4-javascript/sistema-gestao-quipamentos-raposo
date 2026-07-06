import { Card } from 'antd'
import styled from 'styled-components'

export const ListCard = styled(Card)`
  &.ant-card {
    height: 100%;
    border-color: #dde6ee;
    border-radius: 8px;
    box-shadow:
      0 1px 2px rgb(17 24 39 / 6%),
      0 8px 20px rgb(17 24 39 / 4%);
  }

  .ant-card-body {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`

export const CardTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

export const HeaderDivider = styled.div`
  height: 1px;
  margin: 16px 0 24px;
  background: #dde6ee;
`

export const StateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  line-height: 22px;
`

export const Timeline = styled.ol`
  position: relative;
  display: grid;
  gap: 24px;
  max-height: 310px;
  margin: 0;
  overflow-y: auto;
  padding: 0 8px 0 30px;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    bottom: 16px;
    left: 7px;
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
    left: -30px;
    width: 12px;
    height: 12px;
    background: #007c8c;
    border-radius: 999px;
    box-shadow: 0 0 0 3px #ffffff;
  }

  .ant-btn-link {
    height: auto;
    padding: 0;
    color: #111827;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }
`

export const EventEyebrow = styled.span`
  display: block;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`

export const EventTitle = styled.strong`
  display: block;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`

export const EventDescription = styled.span`
  display: block;
  color: #4b5563;
  font-size: 12px;
  line-height: 18px;
`
