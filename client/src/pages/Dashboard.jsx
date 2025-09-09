import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitRate: 0,
    totalRecords: 0,
    projectStats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>加载中...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: '#f6ffed',
          border: '2px solid #b7eb8f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#52c41a', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            💰 总收入
          </h3>
          <h2 style={{ color: '#52c41a', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalRevenue)}
          </h2>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fff2e8',
          border: '2px solid #ffbb96',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#fa8c16', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            💸 总成本
          </h3>
          <h2 style={{ color: '#fa8c16', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalCost)}
          </h2>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#e6f7ff',
          border: '2px solid #91d5ff',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            📈 总利润
          </h3>
          <h2 style={{ color: '#1890ff', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalProfit)}
          </h2>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fffbe6',
          border: '2px solid #ffe58f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#faad14', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            📊 利润率
          </h3>
          <h2 style={{ color: '#faad14', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {statistics.profitRate}%
          </h2>
        </div>
      </div>

      {/* 项目统计 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#333', fontSize: '1.8rem' }}>
          🎯 项目业绩统计
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(statistics.projectStats).map(([project, stats]) => (
            <div key={project} style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{project}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>收入</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                    {formatCurrency(stats.revenue)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>成本</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {formatCurrency(stats.cost)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>利润</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                    {formatCurrency(stats.profit)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#666' }}>利润率</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#faad14' }}>
                    {stats.profitRate}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 系统状态 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.8rem' }}>
          📊 系统概览
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>项目总数</h4>
            <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {statistics.totalRecords}
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>活跃项目</h4>
            <p style={{ color: '#666', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {Object.keys(statistics.projectStats).length}
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>系统状态</h4>
            <p style={{ color: '#52c41a', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              正常运行
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;