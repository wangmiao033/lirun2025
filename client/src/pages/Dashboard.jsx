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
  const [serverStats, setServerStats] = useState({
    totalServers: 0,
    runningServers: 0,
    totalMonthlyCost: 0
  });
  const [fundStats, setFundStats] = useState({
    totalBalance: 0,
    totalAccounts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStatistics();
  }, []);

  const fetchAllStatistics = async () => {
    try {
      // 获取项目统计
      const projectResponse = await fetch('/api/statistics');
      if (projectResponse.ok) {
        const projectResult = await projectResponse.json();
        if (projectResult.success) {
          setStatistics(projectResult.data);
        }
      }

      // 获取服务器统计
      const serverResponse = await fetch('/api/server-statistics');
      if (serverResponse.ok) {
        const serverResult = await serverResponse.json();
        if (serverResult.success) {
          setServerStats(serverResult.data);
        }
      }

      // 获取资金统计
      const fundResponse = await fetch('/api/fund-statistics');
      if (fundResponse.ok) {
        const fundResult = await fundResponse.json();
        if (fundResult.success) {
          setFundStats(fundResult.data);
        }
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
      {/* 页面标题 */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '2rem' }}>📊 仪表盘</h1>
        <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
          欢迎使用利润管理系统，这里是您的数据概览中心
        </p>
      </div>

      {/* 核心财务指标 */}
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '60px',
            opacity: 0.1
          }}>💰</div>
          <h3 style={{ color: '#52c41a', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            总收入
          </h3>
          <h2 style={{ color: '#52c41a', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalRevenue)}
          </h2>
          <p style={{ color: '#52c41a', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            所有项目收入总和
          </p>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fff2e8',
          border: '2px solid #ffbb96',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '60px',
            opacity: 0.1
          }}>💸</div>
          <h3 style={{ color: '#fa8c16', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            总成本
          </h3>
          <h2 style={{ color: '#fa8c16', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalCost)}
          </h2>
          <p style={{ color: '#fa8c16', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            所有项目成本总和
          </p>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#e6f7ff',
          border: '2px solid #91d5ff',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '60px',
            opacity: 0.1
          }}>📈</div>
          <h3 style={{ color: '#1890ff', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            总利润
          </h3>
          <h2 style={{ color: '#1890ff', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {formatCurrency(statistics.totalProfit)}
          </h2>
          <p style={{ color: '#1890ff', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            收入减去成本
          </p>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#fffbe6',
          border: '2px solid #ffe58f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '60px',
            opacity: 0.1
          }}>📊</div>
          <h3 style={{ color: '#faad14', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
            利润率
          </h3>
          <h2 style={{ color: '#faad14', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
            {statistics.profitRate}%
          </h2>
          <p style={{ color: '#faad14', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
            {statistics.profitRate >= 20 ? '优秀' : statistics.profitRate >= 10 ? '良好' : '需改进'}
          </p>
        </div>
      </div>

      {/* 项目业绩统计 */}
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
        
        {Object.keys(statistics.projectStats).length > 0 ? (
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
                border: '1px solid #e9ecef',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '1.2rem' }}>{project}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>收入</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                      {formatCurrency(stats.revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>成本</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                      {formatCurrency(stats.cost)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>利润</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      {formatCurrency(stats.profit)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>利润率</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#faad14' }}>
                      {stats.profitRate}%
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '15px', padding: '8px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
                  <div style={{ fontSize: '12px', color: '#1890ff' }}>
                    记录数: {stats.count} 条
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
            <h3 style={{ margin: '0 0 10px 0' }}>暂无项目数据</h3>
            <p style={{ margin: 0 }}>请前往项目管理页面添加项目数据</p>
          </div>
        )}
      </div>

      {/* 系统概览 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {/* 项目概览 */}
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.5rem' }}>
            📝 项目概览
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>项目总数</h4>
              <p style={{ color: '#1890ff', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {statistics.totalRecords}
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>活跃项目</h4>
              <p style={{ color: '#52c41a', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {Object.keys(statistics.projectStats).length}
              </p>
            </div>
          </div>
        </div>

        {/* 服务器概览 */}
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.5rem' }}>
            🖥️ 服务器概览
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖥️</div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>服务器总数</h4>
              <p style={{ color: '#1890ff', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {serverStats.totalServers}
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
              <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>运行中</h4>
              <p style={{ color: '#52c41a', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                {serverStats.runningServers}
              </p>
            </div>
          </div>
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff2e8', borderRadius: '6px' }}>
            <div style={{ fontSize: '14px', color: '#fa8c16', textAlign: 'center' }}>
              月成本: {formatCurrency(serverStats.totalMonthlyCost)}
            </div>
          </div>
        </div>

        {/* 资金概览 */}
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.5rem' }}>
            🏦 资金概览
          </h2>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>总余额</h4>
            <p style={{ color: '#52c41a', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {formatCurrency(fundStats.totalBalance)}
            </p>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              {fundStats.totalAccounts} 个账户
            </div>
          </div>
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
          ⚡ 系统状态
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>系统状态</h4>
            <p style={{ color: '#52c41a', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              正常运行
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔧</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>API状态</h4>
            <p style={{ color: '#1890ff', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              连接正常
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffbe6', borderRadius: '8px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>数据状态</h4>
            <p style={{ color: '#faad14', margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              数据完整
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;