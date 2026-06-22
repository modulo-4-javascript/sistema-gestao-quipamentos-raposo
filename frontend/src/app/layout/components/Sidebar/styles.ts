import { Layout, Menu } from 'antd'
import styled from 'styled-components'

export const NavSider = styled(Layout.Sider)`
  background: var(--surface-base) !important;
  border-right: 1px solid var(--border-default);
  box-shadow: 1px 0 8px rgb(17 24 39 / 4%);

  @media (max-width: 800px) {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
  }
`

export const Logo = styled.div`
  padding: 24px;

  @media (max-width: 800px) {
    padding: 18px 20px 10px;
  }
`

export const Title = styled.h1`
  margin: 0;
  color: var(--brand-primary);
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
`

export const Subtitle = styled.p`
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 18px;
`

export const MenuList = styled(Menu)`
  &.ant-menu {
    border-inline-end: 0;
    padding: 0 16px;
  }

  .ant-menu-item {
    height: 45px;
    margin-inline: 0;
    color: var(--text-muted);
    border-radius: 8px;
  }

  .ant-menu-item-selected {
    background: var(--info-bg);
    color: var(--brand-primary);
    font-weight: 700;
  }

  @media (max-width: 800px) {
    &.ant-menu {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 8px 16px 16px;
    }

    .ant-menu-item {
      flex: 0 0 auto;
    }
  }
`
