import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import UserApi from '../../apis/user.api'
import dayjs from 'dayjs'

const dateFormat = 'YYYY-MM-DD'

const CreateUser = ({ isModalOpen, setIsModalOpen, userId = null, setUserId }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const handleOk = async () => {
    await form.validateFields()
    handleCreateUser()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setUserId(null)
    form.resetFields()
  }
  const addUserMutation = useMutation({
    mutationFn: (body) => UserApi.createUser(body),
    onSuccess: () => {
      message.success('Tạo user thành công')
      form.resetFields()
      setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
    }
  })

  const handleCreateUser = () => {
    console.log('100 đ', form.getFieldsValue())
    if (userId) {
      updateUserMutation.mutateAsync()
    } else {
      addUserMutation.mutateAsync(form.getFieldsValue())
    }
  }

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserApi.getUser(userId),
    enabled: userId !== null,
    staleTime: 1000 * 10
  })
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.data?.metadata?.user,
        date_of_birth: dayjs(data.data?.metadata?.user.date_of_birth, dateFormat)
      })
    }
  }, [data])

  const updateUserMutation = useMutation({
    mutationFn: (_) => UserApi.updateUser(userId, form.getFieldsValue()),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', userId], data.data.metadata.user)
      message.success('Cập nhật user thành công')
      form.resetFields()
      setIsModalOpen(false)
      setUserId(null)
      queryClient.invalidateQueries({ queryKey: ['users'], exact: true })
    }
  })
  return (
    <>
      <Modal
        footer={[
          <Button key='back' onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            loading={addUserMutation.isLoading || updateUserMutation.isLoading}
            disabled={addUserMutation.isLoading || updateUserMutation.isLoading}
            key='submit'
            type='primary'
            onClick={handleOk}
          >
            {userId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        ]}
        width={800}
        title={userId ? 'Cập nhật user' : 'Tạo mới user'}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout='vertical'
          name='basic'
          style={{
            maxWidth: 800
          }}
          initialValues={{
            remember: true
          }}
          // onFinish={onFinish}
          autoComplete='off'
        >
          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Mã sinh viên' name='code'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!'
                  }
                ]}
                name='role'
                label='Role'
              >
                <Select
                  style={{
                    width: 120
                  }}
                  // onChange={handleChange}
                  options={[
                    {
                      value: 'USER',
                      label: 'User'
                    },
                    {
                      value: 'MANAGER',
                      label: 'Manager'
                    },
                    {
                      value: 'ADMIN',
                      label: 'Admin'
                    }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Lớp' name='class_name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          {!userId && (
            <Row gutter={16}>
              <Col span={12}>
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
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default CreateUser
