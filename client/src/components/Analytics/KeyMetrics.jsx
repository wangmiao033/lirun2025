import React, { useState, useEffect } from 'react';
import { statistics, trendAnalysis } from '../../utils/analytics';
import './KeyMetrics.css';

const KeyMetrics = ({ data }) => {
  const [metrics, setMetrics] = useState(null);
  const [comparisonPeriod, setComparisonPeriod] = useState('previous_month');

  useEffect(() => {
    if (data && data.length > 0) {
      calculateMetrics();
    }
  }, [data, comparisonPeriod]);

  const calculateMetrics = () => {
    const currentData = [...data];
    const comparisonData = getComparisonData();

    const currentMetrics = {
      // 基础财务指标
      totalRevenue: currentData.reduce((sum, item) => sum + (item.revenue || 0), 0),
      totalCost: currentData.reduce((sum, item) => sum + (item.cost || 0), 0),
      totalProfit: currentData.reduce((sum, item) => sum + (item.profit || 0), 0),
      projectCount: currentData.length,
      
      // 效率指标
      averageRevenuePerProject: 0,
      averageCostPerProject: 0,
      averageProfitPerProject: 0,
      profitMargin: 0,
      
      // 增长指标
      revenueGrowth: 0,
      profitGrowth: 0,
      costGrowth: 0,
      
      // 风险指标
      revenueVolatility: 0,
      costVolatility: 0,
      profitVolatility: 0,
      
      // 分布指标
      revenueConcentration: 0,
      costConcentration: 0,
      
      // 趋势指标
      revenueTrend: 'stable',
      profitTrend: 'stable',
      costTrend: 'stable',
      
      // 异常指标
      anomalyCount: 0,
      highValueProjects: 0
    };

    // 计算平均值
    if (currentMetrics.projectCount > 0) {
      currentMetrics.averageRevenuePerProject = currentMetrics.totalRevenue / currentMetrics.projectCount;
      currentMetrics.averageCostPerProject = currentMetrics.totalCost / currentMetrics.projectCount;
      currentMetrics.averageProfitPerProject = currentMetrics.totalProfit / currentMetrics.projectCount;
      currentMetrics.profitMargin = currentMetrics.totalRevenue > 0 ? 
        (currentMetrics.totalProfit / currentMetrics.totalRevenue) * 100 : 0;
    }

    // 计算增长率
    if (comparisonData) {
      const comparisonMetrics = {
        totalRevenue: comparisonData.reduce((sum, item) => sum + (item.revenue || 0), 0),
        totalCost: comparisonData.reduce((sum, item) => sum + (item.cost || 0), 0),
        totalProfit: comparisonData.reduce((sum, item) => sum + (item.profit || 0), 0)
      };

      currentMetrics.revenueGrowth = comparisonMetrics.totalRevenue > 0 ? 
        ((currentMetrics.totalRevenue - comparisonMetrics.totalRevenue) / comparisonMetrics.totalRevenue) * 100 : 0;
      currentMetrics.costGrowth = comparisonMetrics.totalCost > 0 ? 
        ((currentMetrics.totalCost - comparisonMetrics.totalCost) / comparisonMetrics.totalCost) * 100 : 0;
      currentMetrics.profitGrowth = comparisonMetrics.totalProfit > 0 ? 
        ((currentMetrics.totalProfit - comparisonMetrics.totalProfit) / comparisonMetrics.totalProfit) * 100 : 0;
    }

    // 计算波动性
    const revenues = currentData.map(item => item.revenue || 0);
    const costs = currentData.map(item => item.cost || 0);
    const profits = currentData.map(item => item.profit || 0);

    currentMetrics.revenueVolatility = statistics.standardDeviation(revenues);
    currentMetrics.costVolatility = statistics.standardDeviation(costs);
    currentMetrics.profitVolatility = statistics.standardDeviation(profits);

    // 计算集中度（前20%项目占比）
    const sortedByRevenue = [...currentData].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    const top20Count = Math.max(1, Math.ceil(currentData.length * 0.2));
    const top20Revenue = sortedByRevenue.slice(0, top20Count).reduce((sum, item) => sum + (item.revenue || 0), 0);
    currentMetrics.revenueConcentration = currentMetrics.totalRevenue > 0 ? 
      (top20Revenue / currentMetrics.totalRevenue) * 100 : 0;

    const sortedByCost = [...currentData].sort((a, b) => (b.cost || 0) - (a.cost || 0));
    const top20Cost = sortedByCost.slice(0, top20Count).reduce((sum, item) => sum + (item.cost || 0), 0);
    currentMetrics.costConcentration = currentMetrics.totalCost > 0 ? 
      (top20Cost / currentMetrics.totalCost) * 100 : 0;

    // 计算趋势
    currentMetrics.revenueTrend = trendAnalysis.getTrendDirection(revenues);
    currentMetrics.costTrend = trendAnalysis.getTrendDirection(costs);
    currentMetrics.profitTrend = trendAnalysis.getTrendDirection(profits);

    // 计算异常和高价值项目
    const revenueMean = statistics.mean(revenues);
    const revenueStd = statistics.standardDeviation(revenues);
    const threshold = revenueMean + 2 * revenueStd;
    
    currentMetrics.highValueProjects = currentData.filter(item => (item.revenue || 0) > threshold).length;
    
    // 异常检测（使用Z-Score）
    currentMetrics.anomalyCount = revenues.filter(revenue => 
      Math.abs((revenue - revenueMean) / revenueStd) > 2
    ).length;

    setMetrics(currentMetrics);
  };

  const getComparisonData = () => {
    if (!data || data.length === 0) return null;

    const now = new Date();
    const currentData = [...data];

    switch (comparisonPeriod) {
      case 'previous_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return currentData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate < lastMonth;
        });

      case 'previous_quarter':
        const lastQuarter = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        return currentData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate < lastQuarter;
        });

      case 'previous_year':
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return currentData.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate < lastYear;
        });

      default:
        return null;
    }
  };

  const getMetricStatus = (value, type) => {
    switch (type) {
      case 'growth':
        if (value > 10) return 'excellent';
        if (value > 5) return 'good';
        if (value > 0) return 'positive';
        if (value > -5) return 'warning';
        return 'critical';
      
      case 'concentration':
        if (value > 80) return 'critical';
        if (value > 60) return 'warning';
        if (value > 40) return 'good';
        return 'excellent';
      
      case 'margin':
        if (value > 30) return 'excellent';
        if (value > 20) return 'good';
        if (value > 10) return 'positive';
        if (value > 0) return 'warning';
        return 'critical';
      
      default:
        return 'neutral';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (!metrics) {
    return <div className="key-metrics-loading">计算指标中...</div>;
  }

  return (
    <div className="key-metrics">
      <div className="metrics-header">
        <h2>关键业务指标</h2>
        <div className="comparison-selector">
          <label>对比期间:</label>
          <select 
            value={comparisonPeriod} 
            onChange={(e) => setComparisonPeriod(e.target.value)}
          >
            <option value="previous_month">上月</option>
            <option value="previous_quarter">上季度</option>
            <option value="previous_year">上年</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        {/* 财务指标 */}
        <div className="metric-category">
          <h3>💰 财务指标</h3>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-label">总收入</div>
              <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
              <div className={`metric-growth ${getMetricStatus(metrics.revenueGrowth, 'growth')}`}>
                {formatPercentage(metrics.revenueGrowth)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">总成本</div>
              <div className="metric-value">{formatCurrency(metrics.totalCost)}</div>
              <div className={`metric-growth ${getMetricStatus(metrics.costGrowth, 'growth')}`}>
                {formatPercentage(metrics.costGrowth)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">总利润</div>
              <div className="metric-value">{formatCurrency(metrics.totalProfit)}</div>
              <div className={`metric-growth ${getMetricStatus(metrics.profitGrowth, 'growth')}`}>
                {formatPercentage(metrics.profitGrowth)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">利润率</div>
              <div className="metric-value">{metrics.profitMargin.toFixed(1)}%</div>
              <div className={`metric-status ${getMetricStatus(metrics.profitMargin, 'margin')}`}>
                {getMetricStatus(metrics.profitMargin, 'margin') === 'excellent' ? '优秀' :
                 getMetricStatus(metrics.profitMargin, 'margin') === 'good' ? '良好' :
                 getMetricStatus(metrics.profitMargin, 'margin') === 'positive' ? '正常' :
                 getMetricStatus(metrics.profitMargin, 'margin') === 'warning' ? '偏低' : '亏损'}
              </div>
            </div>
          </div>
        </div>

        {/* 效率指标 */}
        <div className="metric-category">
          <h3>⚡ 效率指标</h3>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-label">项目数量</div>
              <div className="metric-value">{metrics.projectCount}</div>
              <div className="metric-trend">
                趋势: {metrics.revenueTrend === 'increasing' ? '↗️ 上升' : 
                       metrics.revenueTrend === 'decreasing' ? '↘️ 下降' : '→ 稳定'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">平均收入/项目</div>
              <div className="metric-value">{formatCurrency(metrics.averageRevenuePerProject)}</div>
              <div className="metric-subtitle">项目效率指标</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">平均成本/项目</div>
              <div className="metric-value">{formatCurrency(metrics.averageCostPerProject)}</div>
              <div className="metric-subtitle">成本控制指标</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">平均利润/项目</div>
              <div className="metric-value">{formatCurrency(metrics.averageProfitPerProject)}</div>
              <div className="metric-subtitle">盈利能力指标</div>
            </div>
          </div>
        </div>

        {/* 风险指标 */}
        <div className="metric-category">
          <h3>⚠️ 风险指标</h3>
          <div className="metric-cards">
            <div className="metric-card">
              <div className="metric-label">收入集中度</div>
              <div className="metric-value">{metrics.revenueConcentration.toFixed(1)}%</div>
              <div className={`metric-status ${getMetricStatus(metrics.revenueConcentration, 'concentration')}`}>
                {getMetricStatus(metrics.revenueConcentration, 'concentration') === 'excellent' ? '分散' :
                 getMetricStatus(metrics.revenueConcentration, 'concentration') === 'good' ? '均衡' :
                 getMetricStatus(metrics.revenueConcentration, 'concentration') === 'warning' ? '集中' : '高度集中'}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">收入波动性</div>
              <div className="metric-value">{formatCurrency(metrics.revenueVolatility)}</div>
              <div className="metric-subtitle">标准差</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">异常项目数</div>
              <div className="metric-value">{metrics.anomalyCount}</div>
              <div className="metric-subtitle">需要关注</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">高价值项目</div>
              <div className="metric-value">{metrics.highValueProjects}</div>
              <div className="metric-subtitle">核心项目</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
