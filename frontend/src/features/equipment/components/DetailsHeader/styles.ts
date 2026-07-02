import { Button } from 'antd'
import styled from 'styled-components'

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
  min-width: 0;
`

export const BackButton = styled(Button)`
  &.ant-btn {
    margin-bottom: 16px;
    padding-inline: 0;
    color: #6b7280;
    font-weight: 600;
  }
`

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const Title = styled.h2`
  margin: 0;
  color: #002a64;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
`

export const Code = styled.span`
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 13px;
  line-height: 20px;
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
  &.ant-btn {
    border: 0;
    color: #ffffff;
    background: linear-gradient(90deg, #002a64, #007c8c);
    box-shadow: 0 4px 8px rgb(0 42 100 / 12%);
  }

  &.ant-btn:hover,
  &.ant-btn:focus {
    color: #ffffff !important;
    background: linear-gradient(90deg, #003f8f, #007c8c) !important;
  }
`
