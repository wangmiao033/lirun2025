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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { departmentApi } from '../services/api';

const { Title } = Typography;
const { Search } = Input;

const DepartmentManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery(
    'departments',
    departmentApi.getDepartments
  );

  const createMutation = useMutation(departmentApi.createDepartment, {
    onSuccess: () => {
      message.success('创建成功');
      queryClient.invalidateQueries('departments');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => departmentApi.updateDepartment(id, data),
    {
      onSuccess: () => {
        message.success('更新成功');
        queryClient.invalidateQueries('departments');
        setIsModalVisible(false);
        form.resetFields();
        setEditingDepartment(null);
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败');
      },
    }
  );

  const deleteMutation = useMutation(departmentApi.deleteDepartment, {
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries('departments');
    },
    onError: () => {
      message.error('删除失败');
    },
  });

  const handleAdd = () => {
    setEditingDepartment(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setEditingDepartment(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingDepartment) {
        updateMutation.mutate({ id: editingDepartment._id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      message.error('提交失败');
    }
  };

  const columns = [
    {
      title: '部门代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 120,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? '启用' : '禁用'}
        </span>
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
            title="确定要删除这个部门吗？"
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
        <Title level={2}>部门管理</Title>
      </div>

      <Card className="table-container">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="搜索部门"
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增部门
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={departments || []}
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
        title={editingDepartment ? '编辑部门' : '新增部门'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingDepartment(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="部门代码"
            rules={[{ required: true, message: '请输入部门代码' }]}
          >
            <Input placeholder="如：SALES, TECH" />
          </Form.Item>

          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item
            name="manager"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人' }]}
          >
            <Input placeholder="请输入负责人姓名" />
          </Form.Item>

          <Form.Item
            name="budget"
            label="预算"
            rules={[{ type: 'number', min: 0, message: '预算不能为负数' }]}
          >
            <Input
              type="number"
              placeholder="请输入预算金额"
              addonBefore="¥"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入部门描述"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {editingDepartment ? '更新' : '创建'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingDepartment(null);
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

export default DepartmentManagement;
