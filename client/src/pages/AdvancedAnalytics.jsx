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
    const revenue = data.map(p => p.revenue);
    const costs = data.map(p => p.cost);
    const profits = data.map(p => p.profit);

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
        <h1>高级数据分析</h1>
        <div className="controls">
          <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <option value="revenue">收入</option>
            <option value="costs">成本</option>
            <option value="profits">利润</option>
          </select>
          <input
            type="number"
            value={forecastPeriods}
            onChange={(e) => setForecastPeriods(parseInt(e.target.value))}
            min="1"
            max="12"
            placeholder="预测期数"
          />
        </div>
      </div>

      {analytics && (
        <div className="analytics-content">
          {/* 统计概览 */}
          <div className="stats-overview">
            <h2>统计概览</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>平均值</h3>
                <p>{analytics[selectedMetric].stats.mean.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>中位数</h3>
                <p>{analytics[selectedMetric].stats.median.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>标准差</h3>
                <p>{analytics[selectedMetric].stats.std.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>趋势</h3>
                <p className={`trend ${analytics[selectedMetric].stats.trend}`}>
                  {analytics[selectedMetric].stats.trend === 'increasing' ? '↗️ 上升' : 
                   analytics[selectedMetric].stats.trend === 'decreasing' ? '↘️ 下降' : '→ 稳定'}
                </p>
              </div>
            </div>
          </div>

          {/* 预测分析 */}
          <div className="forecast-section">
            <h2>预测分析</h2>
            <div className="forecast-chart">
              <div className="forecast-data">
                <h3>未来 {forecastPeriods} 期预测</h3>
                <div className="forecast-values">
                  {analytics[selectedMetric].forecast.predictions.map((value, index) => (
                    <div key={index} className="forecast-item">
                      <span>第 {index + 1} 期</span>
                      <span>{value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <p className="confidence">
                  置信度: {(analytics[selectedMetric].forecast.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* 相关性分析 */}
          <div className="correlation-section">
            <h2>相关性分析</h2>
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
            <h2>异常检测</h2>
            <div className="anomaly-list">
              {analytics.anomalies[selectedMetric]
                .filter(item => item.isAnomaly)
                .map((item, index) => (
                  <div key={index} className="anomaly-item">
                    <span>项目 {item.index + 1}</span>
                    <span>值: {item.value.toLocaleString()}</span>
                    <span>Z-Score: {item.zScore.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
