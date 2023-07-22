import { Button, Input, Modal, Segmented, Space, Table, Tag, Typography, message } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import BookingApi from '../../apis/booking.api';

const { Title } = Typography;
const { TextArea } = Input;
const status = [
  {
    label: 'Đang yêu cầu',
    value: 'WAITING',
  },
  {
    label: 'Chưa thanh toán',
    value: 'WAITING_PAYMENT',
  },
  {
    label: 'Đã thanh toán',
    value: 'SUCCESS_PAYMENT',
  },
  {
    label: 'Đã hủy',
    value: 'CANCELED',
  },
  {
    label: 'Đã rời',
    value: 'QUITTED',
  },
  {
    label: 'Đã bị đuổi',
    value: 'KICKED',
  },
];
const ManageBooking = () => {
  const [value, setValue] = useState(status[0].value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [reason, setReason] = useState('');
  const showModal = (id) => {
    setIsModalOpen(true);
    setBookingId(id);
  };
  const handleOk = () => {
    handleCancelBooking();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setReason('');
    setBookingId(null);
  };
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', value],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return BookingApi.getBookings(value);
    },
    keepPreviousData: true,
    retry: 0,
  });
  const queryClient = useQueryClient();
  const cancelBookingMutation = useMutation({
    mutationFn: (id) => BookingApi.cancelBooking(id, { reason }),
    onSuccess: (_) => {
      message.success(`Hủy yêu cầu thành công`);
      handleCancel();
      queryClient.invalidateQueries({ queryKey: ['bookings', value], exact: true });
    },
  });
  const acceptBookingMutation = useMutation({
    mutationFn: (id) => BookingApi.acceptBooking(id),
    onSuccess: (_) => {
      message.success(`Xác nhận yêu cầu thành công`);
      queryClient.invalidateQueries({ queryKey: ['bookings', value], exact: true });
    },
  });
  const acceptPaymentMutation = useMutation({
    mutationFn: (id) => BookingApi.acceptPayment(id),
    onSuccess: (_) => {
      message.success(`Xác nhận thanh toán thành công`);
      queryClient.invalidateQueries({ queryKey: ['bookings', value], exact: true });
    },
  });
  const kickOutMutation = useMutation({
    mutationFn: (id) => BookingApi.kickOutRoom(id, { reason }),
    onSuccess: (_) => {
      message.success(`Đuổi thành công`);
      oncancel();
      queryClient.invalidateQueries({ queryKey: ['bookings', value], exact: true });
    },
  });

  const handleCancelBooking = () => {
    if (value === 'SUCCESS_PAYMENT') {
      return kickOutMutation.mutate(bookingId);
    }
    cancelBookingMutation.mutate(bookingId);
  };
  const handleAcceptBooking = (id) => {
    acceptBookingMutation.mutate(id);
  };
  const handleAcceptPayment = (id) => {
    acceptPaymentMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Tên sinh viên',
      dataIndex: '',
      key: 'user.full_name',
      ellipsis: true,
      render: (data) => data.user.full_name,
    },
    {
      title: 'Tên phòng',
      dataIndex: '',
      key: 'room.name',
      ellipsis: true,
      render: (data) => data.room.name,
    },

    {
      title: 'Giá',
      dataIndex: '',
      key: 'status',
      ellipsis: true,
      render: (data) => data.months * data.room.price,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      ellipsis: true,
      render: (data) => {
        return (
          <>
            <Space>
              {data.status === 'WAITING' && (
                <Button
                  disabled={acceptBookingMutation.isLoading}
                  onClick={() => handleAcceptBooking(data.id)}
                  type='primary'
                >
                  Xác nhận
                </Button>
              )}
              {data.status === 'WAITING' && (
                <Button onClick={() => showModal(data.id)} type='default'>
                  Hủy
                </Button>
              )}
              {data.status === 'WAITING_PAYMENT' && (
                <Button
                  disabled={acceptPaymentMutation.isLoading}
                  onClick={() => handleAcceptPayment(data.id)}
                  type='primary'
                >
                  Xác nhận
                </Button>
              )}
              {data.status === 'SUCCESS_PAYMENT' && (
                <Button disabled={kickOutMutation.isLoading} onClick={() => showModal(data.id)} type='default'>
                  Đuổi
                </Button>
              )}
            </Space>
          </>
        );
      },
    },
  ];
  const bookings = data?.data?.metadata?.bookings || [];
  return (
    <>
      <Title level={3}>Quản lý đặt phòng</Title>
      <Space direction='vertical'>
        <Segmented options={status} value={value} onChange={setValue} />
        <Table loading={isLoading} columns={columns} dataSource={bookings} />
      </Space>
      <Modal
        title='Xác nhận'
        open={isModalOpen}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            loading={cancelBookingMutation.isLoading}
            disabled={cancelBookingMutation.isLoading}
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

export default ManageBooking;
