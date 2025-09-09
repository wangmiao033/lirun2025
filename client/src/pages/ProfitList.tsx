import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { profitApi } from '../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ProfitList: React.FC = () => {
  const [filters, setFilters] = useState({
    department: '',
    project: '',
    period: '',
    page: 1,
    limit: 10,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery(
    ['profits', filters],
    () => profitApi.getProfits(filters)
  );

  const deleteMutation = useMutation(profitApi.deleteProfit, {
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries('profits');
    },
    onError: () => {
      message.error('删除失败');
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      width: 200,
    },
    {
      title: '期间',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '利润',
      dataIndex: 'profit',
      key: 'profit',
      width: 120,
      render: (value: number) => (
        <span className={value >= 0 ? 'profit-positive' : 'profit-negative'}>
          ¥{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: '利润率',
      dataIndex: 'profitMargin',
      key: 'profitMargin',
      width: 100,
      render: (value: number) => (
        <span className={
          value >= 20 ? 'margin-high' : 
          value >= 10 ? 'margin-medium' : 'margin-low'
        }>
          {value.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          draft: { color: 'orange', text: '草稿' },
          confirmed: { color: 'green', text: '已确认' },
          archived: { color: 'gray', text: '已归档' },
        };
        const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
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
            onClick={() => navigate(`/profits/${record._id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
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

  const handleSearch = (value: string) => {
    setFilters({ ...filters, project: value, page: 1 });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleTableChange = (pagination: any) => {
    setFilters({ ...filters, page: pagination.current, limit: pagination.pageSize });
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2}>利润管理</Title>
      </div>

      <Card className="table-container">
        {/* 搜索和筛选 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="搜索项目"
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="选择部门"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => handleFilterChange('department', value)}
            >
              <Option value="销售部">销售部</Option>
              <Option value="技术部">技术部</Option>
              <Option value="市场部">市场部</Option>
              <Option value="财务部">财务部</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="选择期间"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => handleFilterChange('period', value)}
            >
              <Option value="2025-01">2025-01</Option>
              <Option value="2025-02">2025-02</Option>
              <Option value="2025-Q1">2025-Q1</Option>
              <Option value="2025-Q2">2025-Q2</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/profits/new')}
              >
                新增利润
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={data?.profits || []}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default ProfitList;
