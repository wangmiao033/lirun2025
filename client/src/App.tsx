import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space } from 'antd';
import { DashboardOutlined, BarChartOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff', lineHeight: '64px' }}>
          利润管理系统
        </Title>
      </Header>
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>总收入</Title>
              <Title level={2} style={{ color: '#52c41a' }}>¥3,200,000</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>总成本</Title>
              <Title level={2} style={{ color: '#ff4d4f' }}>¥2,500,000</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>总利润</Title>
              <Title level={2} style={{ color: '#1890ff' }}>¥700,000</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>利润率</Title>
              <Title level={2} style={{ color: '#faad14' }}>21.9%</Title>
            </Card>
          </Col>
        </Row>
        
        <Card style={{ marginTop: '24px' }}>
          <Title level={3}>欢迎使用利润管理系统</Title>
          <Paragraph>
            这是一个功能完整的公司内部利润管理系统，支持利润数据的录入、管理、分析和报表生成。
          </Paragraph>
          
          <Title level={4}>主要功能</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <DashboardOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={5}>仪表盘</Title>
                <Paragraph>查看整体利润统计和趋势</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <BarChartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <Title level={5}>利润管理</Title>
                <Paragraph>管理利润数据记录</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                <Title level={5}>部门管理</Title>
                <Paragraph>维护部门信息</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <UploadOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                <Title level={5}>数据导入</Title>
                <Paragraph>Excel批量导入数据</Paragraph>
              </Card>
            </Col>
          </Row>
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Space>
              <Button type="primary" size="large">
                开始使用
              </Button>
              <Button size="large">
                查看文档
              </Button>
            </Space>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default App;