import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { profitApi } from '../services/api';
import ProfitChart from '../components/ProfitChart';
import DepartmentStats from '../components/DepartmentStats';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { data: summaryStats, isLoading: summaryLoading } = useQuery(
    'profitSummary',
    () => profitApi.getSummary()
  );

  const { data: departmentStats, isLoading: deptLoading } = useQuery(
    'departmentStats',
    () => profitApi.getDepartmentStats()
  );

  const { data: trendData, isLoading: trendLoading } = useQuery(
    'profitTrend',
    () => profitApi.getTrend()
  );

  const stats = summaryStats || {
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    avgProfitMargin: 0,
    count: 0
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2}>仪表盘</Title>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={stats.totalRevenue}
              precision={2}
              prefix="¥"
              loading={summaryLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总成本"
              value={stats.totalCost}
              precision={2}
              prefix="¥"
              loading={summaryLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总利润"
              value={stats.totalProfit}
              precision={2}
              prefix="¥"
              valueStyle={{ 
                color: stats.totalProfit >= 0 ? '#3f8600' : '#cf1322' 
              }}
              prefix={stats.totalProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              loading={summaryLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均利润率"
              value={stats.avgProfitMargin}
              precision={2}
              suffix="%"
              valueStyle={{ 
                color: stats.avgProfitMargin >= 20 ? '#3f8600' : 
                       stats.avgProfitMargin >= 10 ? '#faad14' : '#cf1322'
              }}
              loading={summaryLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="利润趋势" className="chart-container">
            <ProfitChart data={trendData} loading={trendLoading} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="部门利润分布" className="chart-container">
            <DepartmentStats data={departmentStats} loading={deptLoading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
