import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Typography,
  Popconfirm,
  Select,
  InputNumber,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { channelApi } from '../services/api';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const ChannelManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: channels, isLoading } = useQuery(
    'channels',
    channelApi.getChannels
  );

  const createMutation = useMutation(channelApi.createChannel, {
    onSuccess: () => {
      message.success('创建成功');
      queryClient.invalidateQueries('channels');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => channelApi.updateChannel(id, data),
    {
      onSuccess: () => {
        message.success('更新成功');
        queryClient.invalidateQueries('channels');
        setIsModalVisible(false);
        form.resetFields();
        setEditingChannel(null);
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败');
      },
    }
  );

  const deleteMutation = useMutation(channelApi.deleteChannel, {
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries('channels');
    },
    onError: () => {
      message.error('删除失败');
    },
  });

  const handleAdd = () => {
    setEditingChannel(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setEditingChannel(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingChannel) {
        updateMutation.mutate({ id: editingChannel._id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      message.error('提交失败');
    }
  };

  const columns = [
    {
      title: '渠道代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '渠道类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap: { [key: string]: { text: string; color: string } } = {
          'online': { text: '线上渠道', color: 'blue' },
          'offline': { text: '线下渠道', color: 'green' },
          'partner': { text: '合作伙伴', color: 'orange' },
          'direct': { text: '直销', color: 'purple' },
        };
        const typeInfo = typeMap[type] || { text: type, color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 120,
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
      width: 150,
    },
    {
      title: '佣金比例',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      width: 120,
      render: (rate: number) => `${rate}%`,
    },
    {
      title: '月销售额',
      dataIndex: 'monthlySales',
      key: 'monthlySales',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个渠道吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>
          <ShopOutlined style={{ marginRight: 8 }} />
          渠道管理
        </Title>
      </div>

      <Card className="table-container">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="搜索渠道"
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增渠道
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={channels || []}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingChannel ? '编辑渠道' : '新增渠道'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingChannel(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="code"
              label="渠道代码"
              rules={[{ required: true, message: '请输入渠道代码' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="如：CH001" />
            </Form.Item>

            <Form.Item
              name="name"
              label="渠道名称"
              rules={[{ required: true, message: '请输入渠道名称' }]}
              style={{ flex: 2 }}
            >
              <Input placeholder="请输入渠道名称" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="type"
              label="渠道类型"
              rules={[{ required: true, message: '请选择渠道类型' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择渠道类型">
                <Option value="online">线上渠道</Option>
                <Option value="offline">线下渠道</Option>
                <Option value="partner">合作伙伴</Option>
                <Option value="direct">直销</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="manager"
              label="负责人"
              rules={[{ required: true, message: '请输入负责人' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="contact"
              label="联系方式"
              rules={[{ required: true, message: '请输入联系方式' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入联系电话或邮箱" />
            </Form.Item>

            <Form.Item
              name="commissionRate"
              label="佣金比例"
              rules={[
                { required: true, message: '请输入佣金比例' },
                { type: 'number', min: 0, max: 100, message: '佣金比例应在0-100之间' }
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="请输入佣金比例"
                suffix="%"
                style={{ width: '100%' }}
                min={0}
                max={100}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="monthlySales"
            label="月销售额"
            rules={[{ type: 'number', min: 0, message: '月销售额不能为负数' }]}
          >
            <InputNumber
              placeholder="请输入月销售额"
              prefix="¥"
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={true}>启用</Option>
              <Option value={false}>禁用</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="渠道描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入渠道描述"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {editingChannel ? '更新' : '创建'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingChannel(null);
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChannelManagement;
