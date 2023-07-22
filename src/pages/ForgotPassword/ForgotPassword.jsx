import React, { useContext } from 'react'
import { Typography, Button, Form, Input, Divider, message } from 'antd'
import { useMutation } from 'react-query'
import AuthApi from '../../apis/auth.api'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const ForgotPassword = () => {
  const navigate = useNavigate()
  const forgotPasswordMutation = useMutation({
    mutationFn: (body) => AuthApi.forgotPassword(body)
  })
  const onFinish = (body) => {
    forgotPasswordMutation.mutate(body, {
      onSuccess: () => {
        message.success('Hãy kiểm tra mail của bạn!')
        navigate('/login')
      }
    })
  }
  return (
    <>
    <Title level={3}>Quên mật khẩu</Title>
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
      <Form.Item>
        <Button loading={forgotPasswordMutation.isLoading} disabled={forgotPasswordMutation.isLoading}  type='primary' htmlType='submit'>
          Tiếp tục
        </Button>
      </Form.Item>
      <Form.Item>
        <Link to="/login">Đăng nhập</Link>
      </Form.Item>
    </Form>
  </>
  )
}

export default ForgotPassword