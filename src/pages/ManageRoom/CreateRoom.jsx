import React, { useEffect } from 'react'
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import RoomApi from '../../apis/room.api'
import { useParams } from 'react-router-dom'

const CreateRoom = ({ open, setOpen, roomId, setRoomId }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { buildingId } = useParams()

  const onClose = () => {
    setOpen(false)
    setRoomId(null)
    form.resetFields()
  }

  const { data } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => RoomApi.getRoom(roomId),
    enabled: roomId !== null,
    staleTime: 1000 * 10
  })

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.data?.metadata?.room
      })
    }
  }, [data])

  const addRoomMutation = useMutation({
    mutationFn: () => RoomApi.createRoom({ ...form.getFieldsValue(), building: buildingId }),
    onSuccess: () => {
      message.success('Tạo phòng thành công')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['rooms', buildingId], exact: true })
    }
  })
  const updateRoomMutation = useMutation({
    mutationFn: (_) => RoomApi.updateRoom(roomId, form.getFieldsValue()),
    onSuccess: (data) => {
      queryClient.setQueryData(['room', roomId], data.data.metadata.room)
      message.success('Cập nhật phòng thành công')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['rooms', buildingId], exact: true })
    }
  })

  const handleSubmit = () => {
    if(roomId){
      return updateRoomMutation.mutate()
    }
    addRoomMutation.mutate()
  }
  return (
    <>
      <Drawer
        title={roomId ? 'Cập nhật phòng' : 'Tạo mới phòng'}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button
              loading={addRoomMutation.isLoading || updateRoomMutation.isLoading}
              disabled={addRoomMutation.isLoading || updateRoomMutation.isLoading}
              onClick={handleSubmit}
              type='primary'
            >
              {roomId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='name'
                label='Tên phòng'
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống'
                  }
                ]}
              >
                <Input placeholder='Nhập tên phòng...' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='max_people'
                label='Số người tối đa'
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống'
                  }
                ]}
              >
                <InputNumber
                  style={{
                    width: '100%'
                  }}
                  min={1}
                  max={20}
                  defaultValue={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='price'
                label='Giá thuê phòng / tháng'
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống'
                  }
                ]}
              >
                <InputNumber
                  style={{
                    width: '100%'
                  }}
                  min={1}
                  defaultValue={0}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='description'
                label='Miêu tả'
                rules={[
                  {
                    required: true,
                    message: 'Nhập miêu tả phòng...'
                  }
                ]}
              >
                <Input.TextArea rows={4} placeholder='please enter url description' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateRoom
