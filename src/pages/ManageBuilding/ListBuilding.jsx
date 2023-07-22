import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Col, Row, message } from 'antd';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import BuildingApi from '../../apis/building.api';
import { Link } from 'react-router-dom';
const { Meta } = Card;

const ListBuilding = ({ setOpen, setBuildingId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return BuildingApi.getBuildings();
    },
    keepPreviousData: true,
    retry: 0,
  });

  const openEdit = (id) => {
    setBuildingId(id);
    setOpen(true);
  };

  const deleteBuildingMutation = useMutation({
    mutationFn: (id) => BuildingApi.deleteBuilding(id),
    onSuccess: (_) => {
      message.success(`Xóa thành công tòa nhà`);
      queryClient.invalidateQueries({ queryKey: ['buildings'], exact: true });
    },
  });

  const handleDelete = (id) => {
    deleteBuildingMutation.mutate(id);
  };

  const buildings = data?.data?.metadata?.buildings || [];
  return (
    <>
      <Row gutter={[16, 16]}>
        {buildings &&
          buildings.length > 0 &&
          buildings.map((item) => (
            <Col span={6}>
              <Card
                loading={isLoading}
                actions={[
                  <Link to={`/manage-room/${item.id}`}>
                    <EyeOutlined key={'view'} />
                  </Link>,
                  <EditOutlined onClick={() => openEdit(item.id)} key='edit' />,
                  <DeleteOutlined onClick={() => handleDelete(item.id)} key='delete' />,
                ]}
              >
                <Meta title={item.name} description={item.description} />
              </Card>
            </Col>
          ))}
      </Row>
    </>
  );
};

export default ListBuilding;
