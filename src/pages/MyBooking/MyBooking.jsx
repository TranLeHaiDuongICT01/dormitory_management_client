import { Button, Col, Descriptions, Input, Modal, Result, Row, Spin, Typography, message } from 'antd';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import BookingApi from '../../apis/booking.api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;

const MyBooking = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    handleCancelBooking();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setReason('');
  };
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['my-booking'],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return BookingApi.getMyBooking();
    },
    keepPreviousData: true,
    retry: 0,
  });
  const cancelBookingMutation = useMutation({
    mutationFn: (id) => BookingApi.cancelMyBooking(id, { reason }),
    onSuccess: (_) => {
      message.success(`Hủy yêu cầu thành công`);
      handleCancel();
      queryClient.invalidateQueries({ queryKey: ['my-booking'], exact: true });
    },
  });
  const quitRoomMutation = useMutation({
    mutationFn: (id) => BookingApi.quitRoom(id, { reason }),
    onSuccess: (_) => {
      message.success(`Rời phòng thành công`);
      handleCancel();
      queryClient.invalidateQueries({ queryKey: ['my-booking'], exact: true });
    },
  });
  const booking = data?.data?.metadata?.booking || null;
  const building = data?.data?.metadata?.building || null;
  const handleCancelBooking = () => {
    if (booking.status === 'SUCCESS_PAYMENT') {
      return quitRoomMutation.mutate(booking.id);
    }
    cancelBookingMutation.mutate(booking.id);
  };

  return (
    <>
      <Title level={3}>Phòng của tôi</Title>
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
      <Row gutter={16}>
        {!isLoading && !booking && !building && (
          <Col span={24}>
            <Result
              status='404'
              title='Bạn chưa đặt phòng nào cả!'
              extra={[
                <Button onClick={() => navigate('/list-building')} type='primary' key='console'>
                  Xem danh sách các phòng
                </Button>,
                // <Button key='buy'>Buy Again</Button>
              ]}
            />
          </Col>
        )}
        <Col span={16}>
          {booking && booking.room && (
            <Descriptions layout='vertical' column={2} title='Thông tin' bordered>
              <Descriptions.Item label='Tên phòng'>{booking.room?.name}</Descriptions.Item>
              <Descriptions.Item label='Tòa nhà'>{building?.name}</Descriptions.Item>
              <Descriptions.Item label='Thời gian thuê phòng'>{booking.months} tháng</Descriptions.Item>
              <Descriptions.Item label='Ngày ở'>
                {booking.start_date ? dayjs(booking.start_date).format('DD/MM/YYYY') : 'Chưa vào ở'}
              </Descriptions.Item>
              <Descriptions.Item label='Ngày hết hạn'>
                {booking.start_date
                  ? dayjs(booking.start_date).add(booking.months, 'months').format('DD/MM/YYYY')
                  : 'Chưa xác định'}
              </Descriptions.Item>
              <Descriptions.Item label='Tiền phòng'>{booking.room?.price * booking.months}</Descriptions.Item>
            </Descriptions>
          )}
        </Col>
        {booking && (
          <Col span={8}>
            {booking.status === 'WAITING' && (
              <Result
                status='warning'
                title='Bạn đã yêu cầu thuê phòng!'
                subTitle='Vui lòng chờ đến khi được xác nhận'
                extra={[
                  <Button onClick={showModal} type='primary' key='console'>
                    Hủy yêu cầu
                  </Button>,
                  // <Button key='buy'>Buy Again</Button>
                ]}
              />
            )}
            {booking.status === 'WAITING_PAYMENT' && (
              <Result
                status='info'
                title='Yêu cầu thuê phòng đã được xác nhận!'
                subTitle={
                  <>
                    <p>Bạn đã được chuyển vào phòng</p>
                    <p>Vui lòng thanh toán để hoàn tất</p>
                    <p>Sau 3 ngày không thanh toán thì yêu cầu đặt phòng sẽ bị hủy</p>
                  </>
                }
                extra={[
                  <>
                    <p>Thông tin thanh toán</p>
                    <ul>
                      <li>Ngân hàng: Agribank</li>
                      <li>Số tài khoản: XXXXXXXXX</li>
                      <li>
                        Nội dung chuyển khoản: {booking.room?.name} - {booking.code_payment}
                      </li>
                    </ul>
                  </>,
                ]}
              />
            )}
            {booking.status === 'SUCCESS_PAYMENT' && (
              <Result
                status='success'
                title='Đã thanh toán!'
                extra={[
                  <Button onClick={showModal} type='primary' key='console'>
                    Rời phòng
                  </Button>,
                  // <Button key='buy'>Buy Again</Button>
                ]}
              />
            )}
          </Col>
        )}
      </Row>
      <Modal
        title='Xác nhận'
        open={isModalOpen}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            loading={cancelBookingMutation.isLoading || quitRoomMutation.isLoading}
            disabled={cancelBookingMutation.isLoading || quitRoomMutation.isLoading}
            key='submit'
            type='primary'
            onClick={handleOk}
          >
            {'Xác nhận'}
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <TextArea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder='Nhập lý do...' />
      </Modal>
    </>
  );
};

export default MyBooking;
