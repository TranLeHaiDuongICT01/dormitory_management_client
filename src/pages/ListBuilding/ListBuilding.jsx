import React from 'react';
import { Divider, Typography, Card, Col, Row } from 'antd';
import { useQuery } from 'react-query';
import BuildingApi from '../../apis/building.api';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { Title } = Typography;
const ListBuilding = () => {
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

  const buildings = data?.data?.metadata?.buildings || [];
  return (
    <>
      <Title level={3}>Danh sách tòa nhà</Title>
      <Divider />
      <Row gutter={[16, 16]}>
        {buildings &&
          buildings.length > 0 &&
          buildings.map((item) => (
            <Col span={6}>
              <Link to={`/list-room/${item.id}`}>
                <Card hoverable loading={isLoading}>
                  <Meta title={item.name} description={item.description} />
                </Card>
              </Link>
            </Col>
          ))}
      </Row>
    </>
  );
};

export default ListBuilding;
