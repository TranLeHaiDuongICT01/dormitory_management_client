import React, { useState } from 'react';
import { Button, Descriptions, Drawer, Radio, Select, Space, message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import RoomApi from '../../apis/room.api';
import BookingApi from '../../apis/booking.api';

const RequestRoom = ({ open, setOpen, roomId, setRoomId }) => {
  const [months, setMonths] = useState(0);
  const { data } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => RoomApi.getRoom(roomId),
    enabled: roomId !== null,
    staleTime: 1000 * 10,
  });
  const onClose = () => {
    setOpen(false);
    setRoomId(null);
    setMonths(0);
  };
  const handleChange = (value) => {
    setMonths(value);
  };
  const room = data?.data?.metadata?.room;

  const requestBookingMutation = useMutation({
    mutationFn: () => BookingApi.requestBooking({ room: roomId, months }),
    onSuccess: () => {
      message.success('Yêu cầu đặt phòng thành công');
      onClose();
    },
  });

  const handleSubmit = () => {
    if (months <= 0) return message.error('Vui lòng chọn số tháng muốn thuê');
    if (roomId) {
      return requestBookingMutation.mutate();
    }
  };
  return (
    <>
      <Drawer
        title='Yêu cầu thuê phòng'
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button
              loading={requestBookingMutation.isLoading}
              disabled={requestBookingMutation.isLoading}
              type='primary'
              onClick={handleSubmit}
            >
              Xác nhận
            </Button>
          </Space>
        }
      >
        {room && (
          <Descriptions bordered layout='vertical' column={2}>
            <Descriptions.Item label='Phòng'>{room.name}</Descriptions.Item>
            <Descriptions.Item label='Tòa nhà'>{room.building.name}</Descriptions.Item>
            <Descriptions.Item label='Số lượng thành viên'>
              {room.current_people}/{room.max_people}
            </Descriptions.Item>
            <Descriptions.Item label='Giá tiền/ tháng'>{room.price}</Descriptions.Item>
            <Descriptions.Item label='Miêu tả'>{room.description}</Descriptions.Item>
            <Descriptions.Item label='Số tháng muốn thuê'>
              <Select
                value={months}
                placeholder={'Chọn số tháng muốn thuê'}
                style={{
                  width: '100%',
                }}
                onChange={handleChange}
                options={[
                  {
                    value: 1,
                    label: '1 tháng',
                  },
                  {
                    value: 3,
                    label: '3 tháng',
                  },
                  {
                    value: 6,
                    label: '6 tháng',
                  },
                  {
                    value: 9,
                    label: '9 tháng',
                  },
                  {
                    value: 12,
                    label: '12 tháng',
                  },
                ]}
              />
            </Descriptions.Item>
            <Descriptions.Item label='Số tiền cần thanh toán'>{room.price * months}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default RequestRoom;
