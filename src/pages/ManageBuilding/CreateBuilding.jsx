import React, { useEffect } from 'react'
import { Button, Col, Drawer, Form, Input, Row, Space, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import BuildingApi from '../../apis/building.api'

const CreateBuilding = ({ open, setOpen, buildingId, setBuildingId }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const onClose = () => {
    setOpen(false)
    setBuildingId(null)
    form.resetFields()
  }

  const { data } = useQuery({
    queryKey: ['building', buildingId],
    queryFn: () => BuildingApi.getBuilding(buildingId),
    enabled: buildingId !== null,
    staleTime: 1000 * 10
  })

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data.data?.metadata?.building
      })
    }
  }, [data])

  const addBuildingMutation = useMutation({
    mutationFn: () => BuildingApi.createBuilding(form.getFieldsValue()),
    onSuccess: () => {
      message.success('Tạo tòa nhà thành công')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['buildings'], exact: true })
    }
  })

  const updateBuildingMutation = useMutation({
    mutationFn: (_) => BuildingApi.updateBuilding(buildingId, form.getFieldsValue()),
    onSuccess: (data) => {
      queryClient.setQueryData(['building', buildingId], data.data.metadata.building)
      message.success('Cập nhật tòa nhà thành công')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['buildings'], exact: true })
    }
  })

  const handleSubmit = () => {
    if (buildingId) {
      return updateBuildingMutation.mutate()
    }
    addBuildingMutation.mutate()
  }
  return (
    <>
      <Drawer
        title={buildingId ? 'Cập nhật tòa nhà' : 'Tạo mới tòa nhà'}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button
              loading={addBuildingMutation.isLoading || updateBuildingMutation.isLoading}
              disabled={addBuildingMutation.isLoading || updateBuildingMutation.isLoading}
              onClick={handleSubmit}
              type='primary'
            >
              {buildingId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='name'
                label='Tên tòa nhà'
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống'
                  }
                ]}
              >
                <Input placeholder='Nhập tên tòa nhà...' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='description'
                label='Miêu tả'
                rules={[
                  {
                    required: true,
                    message: 'Nhập miêu tả tòa nhà...'
                  }
                ]}
              >
                <Input.TextArea rows={4} placeholder='please enter url description' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateBuilding
