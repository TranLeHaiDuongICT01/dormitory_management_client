import { Breadcrumb, Layout, Menu, theme } from 'antd'
const { Header, Content, Footer } = Layout

const AuthLayout = ({ children }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        className='site-layout'
        style={{
          padding: '50px 50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            width: 600,
            borderRadius: 8
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  )
}

export default AuthLayout
