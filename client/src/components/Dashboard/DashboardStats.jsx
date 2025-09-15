import React from 'react';
import StatCard from '../UI/StatCard';

const DashboardStats = ({ statistics, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProfitTrend = () => {
    if (!statistics.profitRate) return null;
    
    if (statistics.profitRate >= 20) {
      return { trend: 'up', value: '优秀' };
    } else if (statistics.profitRate >= 10) {
      return { trend: 'neutral', value: '良好' };
    } else {
      return { trend: 'down', value: '需改进' };
    }
  };

  const profitTrend = getProfitTrend();

  return (
    <div className="dashboard-stats grid grid-cols-1 grid-cols-2 grid-cols-4">
      <StatCard
        title="总收入"
        value={formatCurrency(statistics.totalRevenue || 0)}
        description="所有项目收入总和"
        icon="💰"
        color="success"
        loading={loading}
      />
      
      <StatCard
        title="总成本"
        value={formatCurrency(statistics.totalCost || 0)}
        description="所有项目成本总和"
        icon="💸"
        color="warning"
        loading={loading}
      />
      
      <StatCard
        title="总利润"
        value={formatCurrency(statistics.totalProfit || 0)}
        description="收入减去成本"
        icon="📈"
        color="info"
        loading={loading}
      />
      
      <StatCard
        title="利润率"
        value={`${statistics.profitRate || 0}%`}
        description={profitTrend?.value || ''}
        icon="📊"
        color="primary"
        trend={profitTrend?.trend}
        trendValue={profitTrend?.value}
        loading={loading}
      />
    </div>
  );
};

export default DashboardStats;
