import { EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Col, Row, message, Typography, Space } from 'antd'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import RoomApi from '../../apis/room.api'

const { Meta } = Card
const { Text } = Typography

const ListRoom = ({ setOpen, setRoomId }) => {
  const { buildingId } = useParams()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['rooms', buildingId],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return RoomApi.getRooms(buildingId)
    },
    enabled: buildingId !== undefined,
    keepPreviousData: true,
    retry: 0
  })

  const openEdit = (id) => {
    setRoomId(id)
    setOpen(true)
  }

  const deleteRoomMutation = useMutation({
    mutationFn: (id) => RoomApi.deleteRoom(id),
    onSuccess: (_) => {
      message.success(`Xóa thành công phòng`)
      queryClient.invalidateQueries({ queryKey: ['rooms', buildingId], exact: true })
    }
  })

  const handleDelete = (id) => {
    deleteRoomMutation.mutate(id)
  }

  const rooms = data?.data?.metadata?.rooms || []

  return (
    <>
      <Row gutter={[16, 16]}>
        {rooms &&
          rooms.length > 0 &&
          rooms.map((item) => (
            <Col span={6}>
              <Card
                loading={isLoading}
                actions={[
                  <Space>
                    <TeamOutlined />
                    <Text>{item.current_people}/{item.max_people}</Text>
                  </Space>,
                  <EditOutlined onClick={() => openEdit(item.id)} key='edit' />,
                  <DeleteOutlined onClick={() => handleDelete(item.id)} key='delete' />
                ]}
              >
                <Meta title={item.name} description={item.description} />
              </Card>
            </Col>
          ))}
      </Row>
    </>
  )
}

export default ListRoom
