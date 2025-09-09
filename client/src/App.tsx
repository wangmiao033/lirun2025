import React from 'react';
import { Layout, Typography, Card, Row, Col } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
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
              <Title level={2} style={{ color: '#52c41a' }}>¥0</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>总成本</Title>
              <Title level={2} style={{ color: '#ff4d4f' }}>¥0</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>总利润</Title>
              <Title level={2} style={{ color: '#1890ff' }}>¥0</Title>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Title level={4}>利润率</Title>
              <Title level={2} style={{ color: '#faad14' }}>0%</Title>
            </Card>
          </Col>
        </Row>
        
        <Card style={{ marginTop: '24px' }}>
          <Title level={3}>欢迎使用利润管理系统</Title>
          <p>系统正在初始化中，请稍候...</p>
          <p>功能包括：</p>
          <ul>
            <li>利润数据管理</li>
            <li>部门信息维护</li>
            <li>数据导入导出</li>
            <li>报表分析</li>
          </ul>
        </Card>
      </Content>
    </Layout>
  );
};

export default App;