import PinDropOutlined from '@mui/icons-material/PinDropOutlined'
import PrecisionManufacturingOutlined from '@mui/icons-material/PrecisionManufacturingOutlined'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo, MenuList, NavSider, Subtitle, Title } from './styles'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <NavSider width={280}>
      <Logo>
        <Title>DenkenHub</Title>
        <Subtitle>Gestão de recursos</Subtitle>
      </Logo>

      <MenuList
        mode="inline"
        selectedKeys={[location.pathname.startsWith('/equipamentos') ? '/equipamentos' : '']}
        onClick={({ key }) => navigate(key)}
        items={[
          {
            key: '/equipamentos',
            icon: <PrecisionManufacturingOutlined fontSize="small" />,
            label: 'Equipamentos',
          },
          {
            key: '/localizacoes',
            icon: <PinDropOutlined fontSize="small" />,
            label: 'Localizações',
            disabled: true,
          },
        ]}
      />
    </NavSider>
  )
}
