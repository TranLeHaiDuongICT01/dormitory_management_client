import React, { useContext, useEffect, useState } from 'react'
import { FileDoneOutlined, BarChartOutlined, TeamOutlined, GoldOutlined, HomeOutlined } from '@ant-design/icons'

import { Layout, Menu, theme } from 'antd'
import Header from '../../components/Header/Header'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'
const { Sider, Content } = Layout

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { permissions } = useContext(AppContext)
  const [menu, setMenu] = useState([])
  const navigate = useNavigate()
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const listMenu = [
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: <Link to={'/dashboard'}>Dashboard</Link>
    },
    {
      key: 'my-booking',
      icon: <HomeOutlined />,
      label: <Link to={'/my-booking'}>Phòng của tôi</Link>
    },
    {
      key: 'list-building',
      icon: <GoldOutlined />,
      label: <Link to={'/list-building'}>Danh sách tòa nhà</Link>
    },
    {
      key: 'manage-user',
      icon: <TeamOutlined />,
      label: <Link to={'/manage-user'}>Quản lý User</Link>
    },
    {
      key: 'manage-building',
      icon: <GoldOutlined />,
      label: <Link to={'/manage-building'}>Quản lý tòa nhà</Link>
    },
    {
      key: 'manage-booking',
      icon: <FileDoneOutlined />,
      label: <Link to={'/manage-booking'}>Quản lý đặt phòng</Link>
    }
  ]

  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const newMenu = []
      listMenu.forEach((item) => {
        if (permissions.includes(item.key)) {
          newMenu.push(item)
        }
      })
      setMenu(newMenu)
      if (newMenu.length > 0 && window.location.pathname === '/') {
        navigate(newMenu[0].key)
      }
    }
  }, [permissions])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light' trigger={null} collapsible collapsed={collapsed}>
        <div className='demo-logo-vertical'>
          <Link to={`/${menu && menu[0]?.key}`}>
            <h3>Admin</h3>
          </Link>
        </div>
        <Menu theme='light' mode='inline' selectedKeys={window.location.pathname.split('/')[1]} items={menu} />
      </Sider>
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
