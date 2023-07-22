import React, { useContext } from 'react';
import { Typography, Button, Form, Input, Divider, message } from 'antd';
import { useMutation } from 'react-query';
import AuthApi from '../../apis/auth.api';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const resetPasswordMutation = useMutation({
    mutationFn: (body) => AuthApi.resetPassword(token, body),
  });
  const onFinish = (body) => {
    resetPasswordMutation.mutate(body, {
      onSuccess: () => {
        message.success('Reset mật khẩu thành công!');
        navigate('/login');
      },
    });
  };
  return (
    <>
      <Title level={3}>Reset mật khẩu</Title>
      <Divider />
      <Form
        layout='vertical'
        name='basic'
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          label='Mật khẩu mới'
          name='password'
          rules={[
            {
              required: true,
              message: 'Khhông được bỏ trống!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            loading={resetPasswordMutation.isLoading}
            disabled={resetPasswordMutation.isLoading}
            type='primary'
            htmlType='submit'
          >
            Xác nhận
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to='/login'>Đăng nhập</Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default ResetPassword;
