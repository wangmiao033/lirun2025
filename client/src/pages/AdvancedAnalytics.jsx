import React, { useState, useEffect } from 'react';
import { useApiError } from '../hooks/useApiError';
import { statistics, trendAnalysis, forecasting, correlation, anomalyDetection } from '../utils/analytics';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = () => {
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [forecastPeriods, setForecastPeriods] = useState(6);
  const { handleApiCall, loading, error } = useApiError();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await handleApiCall(async () => {
      const response = await fetch('/api/profits');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
        calculateAnalytics(data.data);
      }
    });
  };

  const calculateAnalytics = (data) => {
    const revenue = data.map(p => p.revenue || 0);
    const costs = data.map(p => p.cost || 0);
    const profits = data.map(p => p.profit || 0);

    const analytics = {
      revenue: {
        data: revenue,
        stats: {
          mean: statistics.mean(revenue),
          median: statistics.median(revenue),
          std: statistics.standardDeviation(revenue),
          trend: trendAnalysis.getTrendDirection(revenue)
        },
        forecast: forecasting.linearForecast(revenue, forecastPeriods)
      },
      costs: {
        data: costs,
        stats: {
          mean: statistics.mean(costs),
          median: statistics.median(costs),
          std: statistics.standardDeviation(costs),
          trend: trendAnalysis.getTrendDirection(costs)
        },
        forecast: forecasting.linearForecast(costs, forecastPeriods)
      },
      profits: {
        data: profits,
        stats: {
          mean: statistics.mean(profits),
          median: statistics.median(profits),
          std: statistics.standardDeviation(profits),
          trend: trendAnalysis.getTrendDirection(profits)
        },
        forecast: forecasting.linearForecast(profits, forecastPeriods)
      }
    };

    // 相关性分析
    analytics.correlations = {
      revenueCosts: correlation.pearson(revenue, costs),
      revenueProfits: correlation.pearson(revenue, profits),
      costsProfits: correlation.pearson(costs, profits)
    };

    // 异常检测
    analytics.anomalies = {
      revenue: anomalyDetection.zScore(revenue),
      costs: anomalyDetection.zScore(costs),
      profits: anomalyDetection.zScore(profits)
    };

    setAnalytics(analytics);
  };

  if (loading) return <div className="loading">分析中...</div>;
  if (error) return <div className="error">加载失败: {error}</div>;

  return (
    <div className="advanced-analytics">
      <div className="analytics-header">
        <h1>📊 高级数据分析中心</h1>
        <p>深度洞察业务数据，发现隐藏的商业机会</p>
      </div>

      {/* 数据概览 */}
      <div className="data-overview">
        <h2>数据概览</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>总项目数</h3>
            <p className="overview-value">{projects.length}</p>
          </div>
          <div className="overview-card">
            <h3>总收入</h3>
            <p className="overview-value">
              ¥{projects.reduce((sum, p) => sum + (p.revenue || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="overview-card">
            <h3>总成本</h3>
            <p className="overview-value">
              ¥{projects.reduce((sum, p) => sum + (p.cost || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="overview-card">
            <h3>总利润</h3>
            <p className="overview-value">
              ¥{projects.reduce((sum, p) => sum + (p.profit || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 详细分析 */}
      {analytics && (
        <div className="detailed-analytics">
          <div className="analytics-tabs">
            <button className={`tab ${selectedMetric === 'revenue' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('revenue')}>
              收入分析
            </button>
            <button className={`tab ${selectedMetric === 'costs' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('costs')}>
              成本分析
            </button>
            <button className={`tab ${selectedMetric === 'profits' ? 'active' : ''}`}
              onClick={() => setSelectedMetric('profits')}>
              利润分析
            </button>
          </div>

          <div className="analytics-content">
            {/* 统计概览 */}
            <div className="stats-overview">
              <h3>统计概览</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">平均值</div>
                  <div className="stat-value">{analytics[selectedMetric].stats.mean.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">中位数</div>
                  <div className="stat-value">{analytics[selectedMetric].stats.median.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">标准差</div>
                  <div className="stat-value">{analytics[selectedMetric].stats.std.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">趋势</div>
                  <div className={`stat-value trend-${analytics[selectedMetric].stats.trend}`}>
                    {analytics[selectedMetric].stats.trend === 'increasing' ? '↗️ 上升' : 
                     analytics[selectedMetric].stats.trend === 'decreasing' ? '↘️ 下降' : '→ 稳定'}
                  </div>
                </div>
              </div>
            </div>

            {/* 预测分析 */}
            <div className="forecast-section">
              <h3>预测分析</h3>
              <div className="forecast-controls">
                <label>预测期数:</label>
                <input
                  type="number"
                  value={forecastPeriods}
                  onChange={(e) => setForecastPeriods(parseInt(e.target.value))}
                  min="1"
                  max="12"
                />
              </div>
              <div className="forecast-results">
                <div className="forecast-predictions">
                  {analytics[selectedMetric].forecast.predictions.map((value, index) => (
                    <div key={index} className="forecast-item">
                      <span className="period">第 {index + 1} 期</span>
                      <span className="value">{value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="forecast-confidence">
                  <span>置信度: {(analytics[selectedMetric].forecast.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* 相关性分析 */}
            <div className="correlation-section">
              <h3>相关性分析</h3>
              <div className="correlation-matrix">
                <div className="correlation-item">
                  <span>收入 vs 成本</span>
                  <span className={`correlation ${Math.abs(analytics.correlations.revenueCosts) > 0.7 ? 'strong' : 'weak'}`}>
                    {analytics.correlations.revenueCosts.toFixed(3)}
                  </span>
                </div>
                <div className="correlation-item">
                  <span>收入 vs 利润</span>
                  <span className={`correlation ${Math.abs(analytics.correlations.revenueProfits) > 0.7 ? 'strong' : 'weak'}`}>
                    {analytics.correlations.revenueProfits.toFixed(3)}
                  </span>
                </div>
                <div className="correlation-item">
                  <span>成本 vs 利润</span>
                  <span className={`correlation ${Math.abs(analytics.correlations.costsProfits) > 0.7 ? 'strong' : 'weak'}`}>
                    {analytics.correlations.costsProfits.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            {/* 异常检测 */}
            <div className="anomaly-section">
              <h3>异常检测</h3>
              <div className="anomaly-list">
                {analytics.anomalies[selectedMetric]
                  .filter(item => item.isAnomaly)
                  .slice(0, 10)
                  .map((item, index) => (
                    <div key={index} className="anomaly-item">
                      <span className="anomaly-index">项目 {item.index + 1}</span>
                      <span className="anomaly-value">值: {item.value.toLocaleString()}</span>
                      <span className="anomaly-score">Z-Score: {item.zScore.toFixed(2)}</span>
                    </div>
                  ))}
                {analytics.anomalies[selectedMetric].filter(item => item.isAnomaly).length === 0 && (
                  <div className="no-anomalies">未发现异常数据</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
