import React, { useState, useEffect } from 'react';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ProjectOverview from '../components/Dashboard/ProjectOverview';
import SystemStatus from '../components/Dashboard/SystemStatus';
import './Dashboard.css';

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
    <div className="dashboard">
      {/* 页面标题 */}
      <div className="page-header">
        <h1 className="page-title">📊 仪表盘</h1>
        <p className="page-subtitle">
          欢迎使用利润管理系统，这里是您的数据概览中心
        </p>
      </div>

      {/* 核心财务指标 */}
      <DashboardStats statistics={statistics} loading={loading} />

      {/* 项目业绩统计 */}
      <ProjectOverview projectStats={statistics.projectStats} loading={loading} />

      {/* 系统状态 */}
      <SystemStatus 
        serverStats={serverStats} 
        fundStats={fundStats} 
        statistics={statistics}
      />
    </div>
  );
};

export default Dashboard;