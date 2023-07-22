import React, { useState } from 'react';
import { Button, Divider, Space, Typography } from 'antd';
import ListUser from './ListUser';
import { PlusOutlined } from '@ant-design/icons';
import CreateUser from './CreateUser';

const { Title } = Typography;

const ManageUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  return (
    <>
      <Title level={3}>Danh sách user</Title>
      <Space style={{ float: 'right', marginBottom: 20 }}>
        <Button onClick={() => setIsModalOpen(true)} type='primary' icon={<PlusOutlined />}>
          Tạo mới
        </Button>
      </Space>
      <Divider />
      <ListUser setUserId={setUserId} setIsModalOpen={setIsModalOpen} />
      <CreateUser setUserId={setUserId} userId={userId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default ManageUser;
