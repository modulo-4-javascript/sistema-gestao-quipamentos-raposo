import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { ContentLayout, MainContent, PageLayout } from './styles'

interface AppLayoutProps {
  children: ReactNode
  currentPage: string
}

export function AppLayout({ children, currentPage }: AppLayoutProps) {
  return (
    <PageLayout>
      <Sidebar />

      <ContentLayout>
        <Header currentPage={currentPage} />
        <MainContent>{children}</MainContent>
      </ContentLayout>
    </PageLayout>
  )
}
