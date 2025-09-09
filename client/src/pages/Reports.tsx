import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Typography,
  Space,
  Table,
  message,
} from 'antd';
import {
  DownloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from 'react-query';
import { profitApi, uploadApi } from '../services/api';
import ProfitChart from '../components/ProfitChart';
import DepartmentStats from '../components/DepartmentStats';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
  const [filters, setFilters] = useState({
    department: '',
    period: '',
    startDate: '',
    endDate: '',
  });

  const { data: summaryStats } = useQuery(
    ['profitSummary', filters],
    () => profitApi.getSummary(filters)
  );

  const { data: departmentStats } = useQuery(
    ['departmentStats', filters],
    () => profitApi.getDepartmentStats(filters)
  );

  const { data: trendData } = useQuery(
    ['profitTrend', filters],
    () => profitApi.getTrend(filters)
  );

  const exportMutation = useMutation(uploadApi.exportData, {
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `利润报表_${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      message.success('报表导出成功');
    },
    onError: () => {
      message.error('报表导出失败');
    },
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (dates: any) => {
    setFilters({
      ...filters,
      startDate: dates ? dates[0].format('YYYY-MM-DD') : '',
      endDate: dates ? dates[1].format('YYYY-MM-DD') : '',
    });
  };

  const handleExport = () => {
    exportMutation.mutate(filters);
  };

  const summaryColumns = [
    {
      title: '指标',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: any) => {
        if (record.type === 'currency') {
          return `¥${value.toLocaleString()}`;
        } else if (record.type === 'percentage') {
          return `${value.toFixed(2)}%`;
        }
        return value.toLocaleString();
      },
    },
  ];

  const summaryData = summaryStats ? [
    {
      key: '1',
      metric: '总收入',
      value: summaryStats.totalRevenue,
      type: 'currency',
    },
    {
      key: '2',
      metric: '总成本',
      value: summaryStats.totalCost,
      type: 'currency',
    },
    {
      key: '3',
      metric: '总利润',
      value: summaryStats.totalProfit,
      type: 'currency',
    },
    {
      key: '4',
      metric: '平均利润率',
      value: summaryStats.avgProfitMargin,
      type: 'percentage',
    },
    {
      key: '5',
      metric: '记录数量',
      value: summaryStats.count,
      type: 'number',
    },
  ] : [];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>报表分析</Title>
      </div>

      {/* 筛选条件 */}
      <Card className="stats-card" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="选择部门"
              style={{ width: '100%' }}
              allowClear
              value={filters.department}
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
              value={filters.period}
              onChange={(value) => handleFilterChange('period', value)}
            >
              <Option value="2025-01">2025-01</Option>
              <Option value="2025-02">2025-02</Option>
              <Option value="2025-Q1">2025-Q1</Option>
              <Option value="2025-Q2">2025-Q2</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                loading={exportMutation.isLoading}
              >
                导出报表
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 汇总统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="汇总统计" className="stats-card">
            <Table
              columns={summaryColumns}
              dataSource={summaryData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="部门利润分布" className="stats-card">
            <DepartmentStats data={departmentStats} />
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="利润趋势分析" className="chart-container">
            <ProfitChart data={trendData} />
          </Card>
        </Col>
      </Row>

      {/* 部门详细统计 */}
      {departmentStats && departmentStats.length > 0 && (
        <Card title="部门详细统计" className="table-container" style={{ marginTop: 24 }}>
          <Table
            columns={[
              {
                title: '部门',
                dataIndex: '_id',
                key: 'department',
              },
              {
                title: '总收入',
                dataIndex: 'totalRevenue',
                key: 'totalRevenue',
                render: (value: number) => `¥${value.toLocaleString()}`,
              },
              {
                title: '总成本',
                dataIndex: 'totalCost',
                key: 'totalCost',
                render: (value: number) => `¥${value.toLocaleString()}`,
              },
              {
                title: '总利润',
                dataIndex: 'totalProfit',
                key: 'totalProfit',
                render: (value: number) => (
                  <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    ¥{value.toLocaleString()}
                  </span>
                ),
              },
              {
                title: '平均利润率',
                dataIndex: 'avgProfitMargin',
                key: 'avgProfitMargin',
                render: (value: number) => (
                  <span style={{ 
                    color: value >= 20 ? '#52c41a' : 
                           value >= 10 ? '#faad14' : '#ff4d4f'
                  }}>
                    {value.toFixed(2)}%
                  </span>
                ),
              },
              {
                title: '项目数量',
                dataIndex: 'count',
                key: 'count',
              },
            ]}
            dataSource={departmentStats}
            pagination={false}
            rowKey="_id"
          />
        </Card>
      )}
    </div>
  );
};

export default Reports;
