import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ComposedChart
} from 'recharts';
import './AdvancedCharts.css';

const AdvancedCharts = ({ data, type = 'line', title, height = 300 }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    if (data) {
      processChartData();
    }
  }, [data, selectedMetric, timeRange]);

  const processChartData = () => {
    let processedData = [...data];
    
    // 时间范围筛选
    if (timeRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeRange) {
        case '7days':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      processedData = data.filter(item => new Date(item.createdAt) >= cutoffDate);
    }

    // 按日期分组聚合数据
    const groupedData = {};
    processedData.forEach(item => {
      const date = new Date(item.createdAt).toISOString().split('T')[0];
      if (!groupedData[date]) {
        groupedData[date] = {
          date,
          revenue: 0,
          cost: 0,
          profit: 0,
          count: 0
        };
      }
      groupedData[date].revenue += item.revenue || 0;
      groupedData[date].cost += item.cost || 0;
      groupedData[date].profit += item.profit || 0;
      groupedData[date].count += 1;
    });

    const chartData = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
    setChartData(chartData);
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), name]}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), name]}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stackId="1" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), name]}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Legend />
            <Bar dataKey={selectedMetric} fill="#8884d8" />
          </BarChart>
        );

      case 'pie':
        const pieData = chartData.map(item => ({
          name: item.date,
          value: item[selectedMetric]
        }));
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="revenue" name="收入" />
            <YAxis dataKey="profit" name="利润" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => [value.toLocaleString(), name]}
            />
            <Legend />
            <Scatter name="项目" dataKey="profit" fill="#8884d8" />
          </ScatterChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), name]}
              labelFormatter={(label) => `日期: ${label}`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="收入" />
            <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={2} name="利润" />
            <Area type="monotone" dataKey="cost" fill="#82ca9d" fillOpacity={0.3} name="成本" />
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  const getChartInsights = () => {
    if (chartData.length === 0) return null;

    const values = chartData.map(item => item[selectedMetric]);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const trend = values.length > 1 ? 
      (values[values.length - 1] - values[0]) / values.length : 0;

    return {
      total: total.toLocaleString(),
      average: average.toLocaleString(),
      max: max.toLocaleString(),
      min: min.toLocaleString(),
      trend: trend > 0 ? '上升' : trend < 0 ? '下降' : '稳定',
      trendValue: trend.toLocaleString()
    };
  };

  const insights = getChartInsights();

  return (
    <div className="advanced-charts">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-controls">
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <option value="revenue">收入</option>
            <option value="cost">成本</option>
            <option value="profit">利润</option>
            <option value="count">项目数量</option>
          </select>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">全部时间</option>
            <option value="7days">最近7天</option>
            <option value="30days">最近30天</option>
            <option value="90days">最近90天</option>
            <option value="1year">最近1年</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {insights && (
        <div className="chart-insights">
          <h4>数据洞察</h4>
          <div className="insights-grid">
            <div className="insight-item">
              <span className="label">总计:</span>
              <span className="value">{insights.total}</span>
            </div>
            <div className="insight-item">
              <span className="label">平均值:</span>
              <span className="value">{insights.average}</span>
            </div>
            <div className="insight-item">
              <span className="label">最大值:</span>
              <span className="value">{insights.max}</span>
            </div>
            <div className="insight-item">
              <span className="label">最小值:</span>
              <span className="value">{insights.min}</span>
            </div>
            <div className="insight-item">
              <span className="label">趋势:</span>
              <span className={`value trend-${insights.trend}`}>
                {insights.trend} ({insights.trendValue})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCharts;
