import React, { useContext } from 'react'
import { Typography, Button, Form, Input, Divider, DatePicker } from 'antd'
import { useMutation } from 'react-query'
import AuthApi from '../../apis/auth.api'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'

const { Title, Text } = Typography

const Register = () => {
  const navigate = useNavigate()
  const { setIsAuthenticated, setProfile, setPermissions } = useContext(AppContext)
  const registerAccountMutation = useMutation({
    mutationFn: (body) => AuthApi.registerAccount(body)
  })
  const onFinish = (body) => {
    registerAccountMutation.mutate(body, {
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
      <Title level={3}>Đăng ký</Title>
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
          label='Họ và tên'
          name='full_name'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Input />
        </Form.Item>
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
              message: 'Bắt buộc có 8 ký tự, ít nhất 1 chữ hoặc 1 số!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='Mã sinh viên'
          name='code'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Lớp'
          name='class_name'
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Không được để trống!'
            }
          ]}
          name='date_of_birth'
          label='Ngày sinh'
        >
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button loading={registerAccountMutation.isLoading} disabled={registerAccountMutation.isLoading} type='primary' htmlType='submit'>
            Đăng ký
          </Button>
        </Form.Item>
        <Form.Item>
          <Text>Đã có tài khoản ?</Text> <Link to="/login">Đăng nhập</Link>
        </Form.Item>
        <Form.Item>
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default Register
