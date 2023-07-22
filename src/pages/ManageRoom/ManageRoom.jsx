import React, { useState } from 'react'
import { Button, Divider, Space, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CreateRoom from './CreateRoom'
import ListRoom from './ListRoom'

const { Title } = Typography
const ManageRoom = () => {
  const [open, setOpen] = useState(false)
  const [roomId, setRoomId] = useState(null)
  return (
    <>
      <Title level={3}>Danh sách phòng </Title>
      <Space style={{ float: 'right', marginBottom: 20 }}>
        <Button onClick={() => setOpen(true)} type='primary' icon={<PlusOutlined />}>
          Tạo mới
        </Button>
      </Space>
      <Divider />
      <CreateRoom roomId={roomId} setRoomId={setRoomId} open={open} setOpen={setOpen} />
      <ListRoom setOpen={setOpen} setRoomId={setRoomId} />
    </>
  )
}

export default ManageRoom
