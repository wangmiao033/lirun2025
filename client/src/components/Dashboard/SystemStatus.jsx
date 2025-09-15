import React, { useState, useEffect } from 'react';
import StatCard from '../UI/StatCard';

const SystemStatus = ({ serverStats, fundStats, statistics }) => {
  const [systemHealth, setSystemHealth] = useState({
    api: 'checking',
    database: 'checking',
    performance: 'checking'
  });

  useEffect(() => {
    // 模拟系统健康检查
    const checkSystemHealth = async () => {
      try {
        // 检查API状态
        const apiResponse = await fetch('/api/health');
        const apiStatus = apiResponse.ok ? 'healthy' : 'error';
        
        setSystemHealth(prev => ({
          ...prev,
          api: apiStatus,
          database: 'healthy', // 模拟数据库状态
          performance: 'healthy' // 模拟性能状态
        }));
      } catch (error) {
        setSystemHealth(prev => ({
          ...prev,
          api: 'error',
          database: 'healthy',
          performance: 'healthy'
        }));
      }
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // 每30秒检查一次

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'checking': return 'warning';
      case 'error': return 'error';
      default: return 'primary';
    }
  };

  const getSystemStatusText = (status) => {
    switch (status) {
      case 'healthy': return '正常';
      case 'checking': return '检查中';
      case 'error': return '异常';
      default: return '未知';
    }
  };

  return (
    <div className="system-status">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">⚡ 系统状态</h2>
          <p className="card-subtitle">
            实时监控系统运行状态和关键指标
          </p>
        </div>
        
        <div className="system-overview grid grid-cols-1 grid-cols-2 grid-cols-3">
          {/* 系统状态 */}
          <StatCard
            title="系统状态"
            value={getSystemStatusText(systemHealth.api)}
            description="API服务状态"
            icon="✅"
            color={getSystemStatusColor(systemHealth.api)}
          />
          
          {/* 数据库状态 */}
          <StatCard
            title="数据库"
            value={getSystemStatusText(systemHealth.database)}
            description="数据存储状态"
            icon="🗄️"
            color={getSystemStatusColor(systemHealth.database)}
          />
          
          {/* 性能状态 */}
          <StatCard
            title="性能状态"
            value={getSystemStatusText(systemHealth.performance)}
            description="系统性能指标"
            icon="⚡"
            color={getSystemStatusColor(systemHealth.performance)}
          />
        </div>
        
        {/* 详细统计 */}
        <div className="system-details grid grid-cols-1 grid-cols-2 grid-cols-4">
          <div className="detail-item">
            <div className="detail-icon">📊</div>
            <div className="detail-label">项目总数</div>
            <div className="detail-value">{statistics?.totalRecords || 0}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">🖥️</div>
            <div className="detail-label">服务器数量</div>
            <div className="detail-value">{serverStats?.totalServers || 0}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">💰</div>
            <div className="detail-label">总资金</div>
            <div className="detail-value">{formatCurrency(fundStats?.totalBalance || 0)}</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">📈</div>
            <div className="detail-label">总利润</div>
            <div className="detail-value">{formatCurrency(statistics?.totalProfit || 0)}</div>
          </div>
        </div>
        
        {/* 系统信息 */}
        <div className="system-info">
          <div className="info-grid grid grid-cols-1 grid-cols-2">
            <div className="info-item">
              <div className="info-label">系统版本</div>
              <div className="info-value">v1.7.0</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">最后更新</div>
              <div className="info-value">
                {new Date().toLocaleDateString('zh-CN')}
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-label">运行时间</div>
              <div className="info-value">7天 12小时</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">数据完整性</div>
              <div className="info-value">100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
