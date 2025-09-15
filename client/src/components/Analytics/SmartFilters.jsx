import React, { useState, useEffect } from 'react';
import { aggregation, statistics } from '../../utils/analytics';
import './SmartFilters.css';

const SmartFilters = ({ data, onFilteredData }) => {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    department: 'all',
    project: 'all',
    minRevenue: '',
    maxRevenue: '',
    minProfit: '',
    maxProfit: '',
    profitMargin: 'all',
    anomalyOnly: false,
    highValueOnly: false
  });

  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    projects: [],
    dateRanges: []
  });

  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonFilters, setComparisonFilters] = useState({
    dateRange: 'previous_month',
    department: 'all'
  });

  useEffect(() => {
    if (data && data.length > 0) {
      generateFilterOptions();
      applyFilters();
    }
  }, [data, filters, comparisonMode, comparisonFilters]);

  const generateFilterOptions = () => {
    const departments = [...new Set(data.map(item => item.department).filter(Boolean))];
    const projects = [...new Set(data.map(item => item.project).filter(Boolean))];
    
    // 生成日期范围选项
    const dates = data.map(item => new Date(item.createdAt)).sort((a, b) => a - b);
    const dateRanges = [
      { value: 'last_7_days', label: '最近7天' },
      { value: 'last_30_days', label: '最近30天' },
      { value: 'last_90_days', label: '最近90天' },
      { value: 'last_year', label: '最近1年' },
      { value: 'this_month', label: '本月' },
      { value: 'this_quarter', label: '本季度' },
      { value: 'this_year', label: '本年' }
    ];

    setFilterOptions({
      departments,
      projects,
      dateRanges
    });
  };

  const applyFilters = () => {
    let filteredData = [...data];

    // 日期范围筛选
    if (filters.dateRange !== 'all') {
      filteredData = filterByDateRange(filteredData, filters.dateRange);
    }

    // 部门筛选
    if (filters.department !== 'all') {
      filteredData = filteredData.filter(item => item.department === filters.department);
    }

    // 项目筛选
    if (filters.project !== 'all') {
      filteredData = filteredData.filter(item => item.project === filters.project);
    }

    // 收入范围筛选
    if (filters.minRevenue) {
      filteredData = filteredData.filter(item => (item.revenue || 0) >= parseFloat(filters.minRevenue));
    }
    if (filters.maxRevenue) {
      filteredData = filteredData.filter(item => (item.revenue || 0) <= parseFloat(filters.maxRevenue));
    }

    // 利润范围筛选
    if (filters.minProfit) {
      filteredData = filteredData.filter(item => (item.profit || 0) >= parseFloat(filters.minProfit));
    }
    if (filters.maxProfit) {
      filteredData = filteredData.filter(item => (item.profit || 0) <= parseFloat(filters.maxProfit));
    }

    // 利润率筛选
    if (filters.profitMargin !== 'all') {
      filteredData = filteredData.filter(item => {
        const margin = item.revenue > 0 ? (item.profit / item.revenue) * 100 : 0;
        switch (filters.profitMargin) {
          case 'high': return margin > 30;
          case 'medium': return margin >= 10 && margin <= 30;
          case 'low': return margin > 0 && margin < 10;
          case 'negative': return margin <= 0;
          default: return true;
        }
      });
    }

    // 异常检测筛选
    if (filters.anomalyOnly) {
      const revenues = data.map(item => item.revenue || 0);
      const mean = statistics.mean(revenues);
      const std = statistics.standardDeviation(revenues);
      filteredData = filteredData.filter(item => {
        const zScore = Math.abs(((item.revenue || 0) - mean) / std);
        return zScore > 2;
      });
    }

    // 高价值项目筛选
    if (filters.highValueOnly) {
      const revenues = data.map(item => item.revenue || 0);
      const threshold = statistics.percentile(revenues, 80); // 前20%
      filteredData = filteredData.filter(item => (item.revenue || 0) >= threshold);
    }

    // 获取对比数据
    let comparisonData = null;
    if (comparisonMode) {
      comparisonData = getComparisonData(filteredData);
    }

    onFilteredData(filteredData, comparisonData);
  };

  const filterByDateRange = (data, range) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (range) {
      case 'last_7_days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'last_30_days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'last_90_days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'last_year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'this_month':
        cutoffDate.setDate(1);
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        cutoffDate.setMonth(quarter * 3, 1);
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'this_year':
        cutoffDate.setMonth(0, 1);
        cutoffDate.setHours(0, 0, 0, 0);
        break;
    }

    return data.filter(item => new Date(item.createdAt) >= cutoffDate);
  };

  const getComparisonData = (currentData) => {
    if (!currentData || currentData.length === 0) return null;

    const now = new Date();
    let comparisonCutoff = new Date();

    switch (comparisonFilters.dateRange) {
      case 'previous_month':
        comparisonCutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'previous_quarter':
        comparisonCutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'previous_year':
        comparisonCutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    let comparisonData = data.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate < comparisonCutoff;
    });

    if (comparisonFilters.department !== 'all') {
      comparisonData = comparisonData.filter(item => item.department === comparisonFilters.department);
    }

    return comparisonData;
  };

  const resetFilters = () => {
    setFilters({
      dateRange: 'all',
      department: 'all',
      project: 'all',
      minRevenue: '',
      maxRevenue: '',
      minProfit: '',
      maxProfit: '',
      profitMargin: 'all',
      anomalyOnly: false,
      highValueOnly: false
    });
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    
    if (filters.dateRange !== 'all') {
      activeFilters.push(`时间: ${filterOptions.dateRanges.find(r => r.value === filters.dateRange)?.label}`);
    }
    if (filters.department !== 'all') {
      activeFilters.push(`部门: ${filters.department}`);
    }
    if (filters.project !== 'all') {
      activeFilters.push(`项目: ${filters.project}`);
    }
    if (filters.minRevenue || filters.maxRevenue) {
      const range = `${filters.minRevenue || '0'} - ${filters.maxRevenue || '∞'}`;
      activeFilters.push(`收入: ${range}`);
    }
    if (filters.minProfit || filters.maxProfit) {
      const range = `${filters.minProfit || '0'} - ${filters.maxProfit || '∞'}`;
      activeFilters.push(`利润: ${range}`);
    }
    if (filters.profitMargin !== 'all') {
      const marginLabels = {
        high: '高利润率(>30%)',
        medium: '中等利润率(10-30%)',
        low: '低利润率(0-10%)',
        negative: '负利润率'
      };
      activeFilters.push(`利润率: ${marginLabels[filters.profitMargin]}`);
    }
    if (filters.anomalyOnly) {
      activeFilters.push('仅异常项目');
    }
    if (filters.highValueOnly) {
      activeFilters.push('仅高价值项目');
    }

    return activeFilters;
  };

  return (
    <div className="smart-filters">
      <div className="filters-header">
        <h3>智能筛选器</h3>
        <div className="filters-actions">
          <button 
            className="reset-btn"
            onClick={resetFilters}
          >
            重置筛选
          </button>
          <label className="comparison-toggle">
            <input
              type="checkbox"
              checked={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.checked)}
            />
            <span>对比模式</span>
          </label>
        </div>
      </div>

      <div className="filters-grid">
        {/* 基础筛选 */}
        <div className="filter-group">
          <label>时间范围</label>
          <select 
            value={filters.dateRange} 
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="all">全部时间</option>
            {filterOptions.dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>部门</label>
          <select 
            value={filters.department} 
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          >
            <option value="all">全部部门</option>
            {filterOptions.departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>项目</label>
          <select 
            value={filters.project} 
            onChange={(e) => setFilters({...filters, project: e.target.value})}
          >
            <option value="all">全部项目</option>
            {filterOptions.projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>

        {/* 数值范围筛选 */}
        <div className="filter-group range-group">
          <label>收入范围</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="最小值"
              value={filters.minRevenue}
              onChange={(e) => setFilters({...filters, minRevenue: e.target.value})}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="最大值"
              value={filters.maxRevenue}
              onChange={(e) => setFilters({...filters, maxRevenue: e.target.value})}
            />
          </div>
        </div>

        <div className="filter-group range-group">
          <label>利润范围</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder="最小值"
              value={filters.minProfit}
              onChange={(e) => setFilters({...filters, minProfit: e.target.value})}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="最大值"
              value={filters.maxProfit}
              onChange={(e) => setFilters({...filters, maxProfit: e.target.value})}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>利润率</label>
          <select 
            value={filters.profitMargin} 
            onChange={(e) => setFilters({...filters, profitMargin: e.target.value})}
          >
            <option value="all">全部</option>
            <option value="high">高利润率 (>30%)</option>
            <option value="medium">中等利润率 (10-30%)</option>
            <option value="low">低利润率 (0-10%)</option>
            <option value="negative">负利润率</option>
          </select>
        </div>

        {/* 高级筛选 */}
        <div className="filter-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filters.anomalyOnly}
              onChange={(e) => setFilters({...filters, anomalyOnly: e.target.checked})}
            />
            仅显示异常项目
          </label>
        </div>

        <div className="filter-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filters.highValueOnly}
              onChange={(e) => setFilters({...filters, highValueOnly: e.target.checked})}
            />
            仅显示高价值项目
          </label>
        </div>
      </div>

      {/* 对比模式设置 */}
      {comparisonMode && (
        <div className="comparison-settings">
          <h4>对比设置</h4>
          <div className="comparison-filters">
            <div className="filter-group">
              <label>对比期间</label>
              <select 
                value={comparisonFilters.dateRange} 
                onChange={(e) => setComparisonFilters({...comparisonFilters, dateRange: e.target.value})}
              >
                <option value="previous_month">上月</option>
                <option value="previous_quarter">上季度</option>
                <option value="previous_year">上年</option>
              </select>
            </div>
            <div className="filter-group">
              <label>对比部门</label>
              <select 
                value={comparisonFilters.department} 
                onChange={(e) => setComparisonFilters({...comparisonFilters, department: e.target.value})}
              >
                <option value="all">全部部门</option>
                {filterOptions.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 筛选摘要 */}
      <div className="filter-summary">
        <h4>当前筛选条件</h4>
        <div className="active-filters">
          {getFilterSummary().length > 0 ? (
            getFilterSummary().map((filter, index) => (
              <span key={index} className="filter-tag">
                {filter}
              </span>
            ))
          ) : (
            <span className="no-filters">无筛选条件</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartFilters;
