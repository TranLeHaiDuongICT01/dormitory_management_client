import { Button, DatePicker, Divider, Form, Input, Typography, message } from 'antd';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/app.context';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import AuthApi from '../../apis/auth.api';
import Auth from '../../utils/auth';

const { Title } = Typography;

const dateFormat = 'YYYY-MM-DD';

const Profile = () => {
  const { profile, setProfile } = useContext(AppContext);
  const [form] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      ...profile,
      date_of_birth: dayjs(profile.date_of_birth, dateFormat),
    });
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (body) => AuthApi.updateProfile(body),
    onSuccess: (data) => {
      setProfile(data.data?.metadata?.user);
      Auth.setProfileToLS(data.data?.metadata?.user);
      message.success('Cập nhật thông tin thành công!');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body) => AuthApi.changePassword(body),
    onSuccess: () => {
      message.success('Đổi mật khẩu thành công!');
      formChangePassword.resetFields();
    },
  });

  const onFinish = (body) => {
    updateProfileMutation.mutate({
      ...body,
    });
  };
  const onFinishChangePassword = (body) => {
    changePasswordMutation.mutate(body);
  };
  return (
    <>
      <Title level={2}>Thông tin cá nhân</Title>
      <Divider />
      <Form
        form={form}
        layout='vertical'
        name='basic'
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
        initialValues={{
          remember: true,
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
              message: 'Không được để trống!',
            },
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
              type: 'email',
            },
          ]}
        >
          <Input disabled />
        </Form.Item>

        {/* <Form.Item
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
        </Form.Item> */}
        <Form.Item
          label='Mã sinh viên'
          name='code'
          rules={[
            {
              required: true,
              message: 'Không được để trống!',
            },
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
              message: 'Không được để trống!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Không được để trống!',
            },
          ]}
          name='date_of_birth'
          label='Ngày sinh'
        >
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button
            loading={updateProfileMutation.isLoading}
            disabled={updateProfileMutation.isLoading}
            type='primary'
            htmlType='submit'
          >
            Cập nhập
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Title level={2}>Đổi mật khẩu</Title>
      <Divider />
      <Form
        layout='vertical'
        name='chnage_pass'
        style={{
          maxWidth: 600,
          margin: '0 auto',
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinishChangePassword}
        autoComplete='off'
        form={formChangePassword}
      >
        <Form.Item
          label='Mật khẩu cũ'
          name='oldPassword'
          rules={[
            {
              required: true,
              message: 'Không được để trống!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label='Mật khẩu mới'
          name='password'
          rules={[
            {
              required: true,
              message: 'Bắt buộc có 8 ký tự, ít nhất 1 chữ hoặc 1 số!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            // loading={loginAccountMutation.isLoading}
            // disabled={loginAccountMutation.isLoading}
            type='primary'
            htmlType='submit'
          >
            Đổi
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Profile;
