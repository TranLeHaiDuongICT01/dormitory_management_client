import React, { useState } from 'react'
import { Button, Divider, Space, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CreateBuilding from './CreateBuilding'
import ListBuilding from './ListBuilding'

const { Title } = Typography
const ManageBuilding = () => {
  const [open, setOpen] = useState(false)
  const [buildingId, setBuildingId] = useState(null)
  return (
    <>
      <Title level={3}>Danh sách tòa nhà</Title>
      <Space style={{ float: 'right', marginBottom: 20 }}>
        <Button onClick={() => setOpen(true)} type='primary' icon={<PlusOutlined />}>
          Tạo mới
        </Button>
      </Space>
      <Divider />
      <ListBuilding setOpen={setOpen} setBuildingId={setBuildingId} />
      <CreateBuilding buildingId={buildingId} setBuildingId={setBuildingId} open={open} setOpen={setOpen} />
    </>
  )
}

export default ManageBuilding
