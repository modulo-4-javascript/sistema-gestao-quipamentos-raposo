import { App as AntDesignApp, ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { appTheme } from './theme/appTheme'

function App() {
  // Providers globais: tema/idioma do Ant Design, recursos do Ant Design e rotas.
  return (
    <ConfigProvider locale={ptBR} theme={appTheme}>
      <AntDesignApp>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AntDesignApp>
    </ConfigProvider>
  )
}

export default App
