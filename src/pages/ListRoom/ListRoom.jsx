import React, { useState } from 'react';
import { Divider, Typography, Card, Col, Row, Space, Button, Spin } from 'antd';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import RoomApi from '../../apis/room.api';
import { EditOutlined, DeleteOutlined, TeamOutlined, FileAddOutlined } from '@ant-design/icons';
import RequestRoom from './RequestRoom';

const { Meta } = Card;
const { Title, Text } = Typography;

const ListRoom = () => {
  const { buildingId } = useParams();
  const [roomId, setRoomId] = useState(null);
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['rooms', buildingId],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return RoomApi.getRooms(buildingId);
    },
    enabled: buildingId !== undefined,
    keepPreviousData: true,
    retry: 0,
  });
  const rooms = data?.data?.metadata?.rooms || [];
  const openRequest = (id) => {
    setOpen(true);
    setRoomId(id);
  };
  return (
    <>
      <Title level={3}>Danh sách phòng </Title>
      <Divider />
      {isLoading && (
        <Spin
          style={{
            marginTop: 40,
          }}
          tip='Loading'
          size='large'
        >
          <div className='content' />
        </Spin>
      )}
      <Row gutter={[16, 16]}>
        {rooms &&
          rooms.length > 0 &&
          rooms.map((item) => (
            <Col span={6}>
              <Card
                onClick={() => openRequest(item.id)}
                hoverable
                loading={isLoading}
                actions={[
                  <Space>
                    <TeamOutlined />
                    <Text>
                      {item.current_people}/{item.max_people}
                    </Text>
                  </Space>,
                  <Button onClick={() => openRequest(item.id)} type='ghost' key={'sign'} icon={<FileAddOutlined />}>
                    Thuê
                  </Button>,
                ]}
              >
                <Meta title={item.name} description={item.description} />
              </Card>
            </Col>
          ))}
      </Row>
      <RequestRoom roomId={roomId} setRoomId={setRoomId} open={open} setOpen={setOpen} />
    </>
  );
};

export default ListRoom;
