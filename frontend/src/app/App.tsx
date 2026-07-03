import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntDesignApp, ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { appTheme } from './theme/appTheme'

const queryClient = new QueryClient()

function App() {
  return (
    <ConfigProvider locale={ptBR} theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <AntDesignApp>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AntDesignApp>
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
