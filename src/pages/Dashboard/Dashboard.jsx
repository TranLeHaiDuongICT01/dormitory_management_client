import { Card, Col, Divider, Row, Statistic, Typography } from 'antd';
import CountUp from 'react-countup';
import { useQuery } from 'react-query';
import UserApi from '../../apis/user.api';
const formatter = (value) => <CountUp end={value} separator=',' />;
const { Title } = Typography;
const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return UserApi.getSummary();
    },
    keepPreviousData: true,
    retry: 0,
  });
  const summary = data?.data?.metadata || null;
  return (
    <>
      <Title level={3}>Dashboard</Title>
      <Divider />
      <Row gutter={16}>
        <Col span={6}>
          <Card hoverable>
            <Statistic title='Tổng số người dùng' value={summary && summary.totalUser} formatter={formatter} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic title='Tổng số phòng' value={summary && summary.totalRoom} formatter={formatter} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic title='Tổng số đơn đặt phòng' value={summary && summary.totalBooking} formatter={formatter} />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable>
            <Statistic title='Tổng doanh thu' value={summary && summary.totalPrice} formatter={formatter} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
