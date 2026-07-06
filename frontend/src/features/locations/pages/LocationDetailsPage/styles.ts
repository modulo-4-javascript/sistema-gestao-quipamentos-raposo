import styled from 'styled-components'

export const Container = styled.section`
  width: 100%;
  max-width: 1440px;
`

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(360px, 0.85fr);
  align-items: stretch;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

export const MainColumn = styled.div`
  display: grid;
  align-content: start;
  gap: 24px;
`

export const SideColumn = styled.aside`
  display: grid;
  align-content: start;
  gap: 24px;
`

export const StarterBox = styled.div`
  padding: 24px;
  color: #6b7280;
  background: #ffffff;
  border: 1px dashed #b7c6d8;
  border-radius: 8px;
  font-size: 14px;
  line-height: 22px;
`
