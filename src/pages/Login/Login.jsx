import React, { useContext } from 'react'
import { Typography, Button, Form, Input, Divider } from 'antd'
import { useMutation } from 'react-query'
import AuthApi from '../../apis/auth.api'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile, setPermissions } = useContext(AppContext)
  const loginAccountMutation = useMutation({
    mutationFn: (body) => AuthApi.loginAccount(body)
  })
  const onFinish = (body) => {
    loginAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data?.metadata?.user)
        setPermissions(data.data?.metadata?.permissions)
        navigate(`/${data.data?.metadata?.permissions[0]}`)
      }
    })
  }
  return (
    <>
      <Title level={3}>Đăng nhập</Title>
      <Divider />
      <Form
        layout='vertical'
        name='basic'
        style={{
          maxWidth: 600
        }}
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: 'Không đúng định dạng!',
              type: 'email'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Mật khẩu'
          name='password'
          rules={[
            {
              required: true,
              message: 'Khhông được bỏ trống!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button loading={loginAccountMutation.isLoading} disabled={loginAccountMutation.isLoading} type='primary' htmlType='submit'>
            Đăng nhập
          </Button>
        </Form.Item>
        <Form.Item>
          <Text>Chưa có tài khoản ?</Text> <Link to="/register">Đăng ký</Link>
        </Form.Item>
        <Form.Item>
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default Login
