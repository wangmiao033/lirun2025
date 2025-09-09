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
  DatePicker,
  InputNumber,
} from 'antd';
import moment from 'moment';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { researchApi } from '../services/api';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const ResearchManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResearch, setEditingResearch] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: researchProjects, isLoading } = useQuery(
    'researchProjects',
    researchApi.getResearchProjects
  );

  const createMutation = useMutation(researchApi.createResearchProject, {
    onSuccess: () => {
      message.success('创建成功');
      queryClient.invalidateQueries('researchProjects');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '创建失败');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => researchApi.updateResearchProject(id, data),
    {
      onSuccess: () => {
        message.success('更新成功');
        queryClient.invalidateQueries('researchProjects');
        setIsModalVisible(false);
        form.resetFields();
        setEditingResearch(null);
      },
      onError: (error: any) => {
        message.error(error.response?.data?.message || '更新失败');
      },
    }
  );

  const deleteMutation = useMutation(researchApi.deleteResearchProject, {
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries('researchProjects');
    },
    onError: () => {
      message.error('删除失败');
    },
  });

  const handleAdd = () => {
    setEditingResearch(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setEditingResearch(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = async (values: any) => {
    try {
      const submitData = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      };
      
      if (editingResearch) {
        updateMutation.mutate({ id: editingResearch._id, data: submitData });
      } else {
        createMutation.mutate(submitData);
      }
    } catch (error) {
      message.error('提交失败');
    }
  };

  const columns = [
    {
      title: '项目编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 120,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 120,
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      key: 'projectType',
      width: 120,
      render: (type: string) => {
        const typeMap: { [key: string]: string } = {
          'basic': '基础研究',
          'applied': '应用研究',
          'development': '开发研究',
          'innovation': '创新研究',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: { [key: string]: { text: string; color: string } } = {
          'planning': { text: '规划中', color: '#1890ff' },
          'active': { text: '进行中', color: '#52c41a' },
          'completed': { text: '已完成', color: '#52c41a' },
          'suspended': { text: '暂停', color: '#faad14' },
          'cancelled': { text: '已取消', color: '#ff4d4f' },
        };
        const statusInfo = statusMap[status] || { text: status, color: '#666' };
        return <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>;
      },
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
            title="确定要删除这个研发项目吗？"
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
          <ExperimentOutlined style={{ marginRight: 8 }} />
          研发管理
        </Title>
      </div>

      <Card className="table-container">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="搜索研发项目"
            style={{ width: 300 }}
            enterButton={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增项目
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={researchProjects || []}
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
        title={editingResearch ? '编辑研发项目' : '新增研发项目'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingResearch(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="projectCode"
              label="项目编号"
              rules={[{ required: true, message: '请输入项目编号' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="如：RD2025001" />
            </Form.Item>

            <Form.Item
              name="projectName"
              label="项目名称"
              rules={[{ required: true, message: '请输入项目名称' }]}
              style={{ flex: 2 }}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="manager"
              label="负责人"
              rules={[{ required: true, message: '请输入负责人' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>

            <Form.Item
              name="projectType"
              label="项目类型"
              rules={[{ required: true, message: '请选择项目类型' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择项目类型">
                <Option value="basic">基础研究</Option>
                <Option value="applied">应用研究</Option>
                <Option value="development">开发研究</Option>
                <Option value="innovation">创新研究</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="budget"
              label="预算"
              rules={[{ type: 'number', min: 0, message: '预算不能为负数' }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                placeholder="请输入预算金额"
                prefix="¥"
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择状态">
                <Option value="planning">规划中</Option>
                <Option value="active">进行中</Option>
                <Option value="completed">已完成</Option>
                <Option value="suspended">暂停</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="startDate"
              label="开始日期"
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="结束日期"
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="项目描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入项目描述"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isLoading || updateMutation.isLoading}
              >
                {editingResearch ? '更新' : '创建'}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingResearch(null);
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

export default ResearchManagement;
