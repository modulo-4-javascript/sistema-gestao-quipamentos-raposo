import { Breadcrumb, Layout } from 'antd'
import styled from 'styled-components'

export const HeaderContainer = styled(Layout.Header)`
  position: sticky;
  top: 0;
  z-index: 10;
  height: 64px;
  padding: 0 24px;
  background: var(--surface-base);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
`

export const PageBreadcrumb = styled(Breadcrumb)`
  padding-left: 8px;
  border-left: 1px solid var(--border-default);
`
