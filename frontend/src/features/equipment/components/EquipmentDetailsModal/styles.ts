import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 4px 0 24px;
`

export const IconBox = styled.span`
  display: inline-flex;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  color: #002a64;
  background: #e6f4ff;
  border-radius: 8px;
`

export const TitleGroup = styled.div`
  min-width: 0;
`

export const Title = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`

export const Code = styled.span`
  display: block;
  margin: 2px 0 10px;
  color: #6b7280;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
  line-height: 18px;
`

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const DetailItem = styled.div`
  padding: 14px;
  background: #f9f9ff;
  border: 1px solid #dde6ee;
  border-radius: 8px;
`

export const DetailLabel = styled.span`
  display: block;
  margin-bottom: 4px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
`

export const DetailValue = styled.strong`
  display: block;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
`
