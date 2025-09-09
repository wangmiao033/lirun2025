import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitRate: 0,
    totalRecords: 0,
    departmentStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `利润数据_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败');
    } finally {
      setExporting(false);
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
      {/* 页面头部 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>报表分析</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            backgroundColor: exporting ? '#d9d9d9' : '#52c41a',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {exporting ? '导出中...' : '📊 导出Excel报表'}
        </button>
      </div>

      {/* 总体统计 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#333' }}>📈 总体财务分析</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            padding: '24px',
            backgroundColor: '#f6ffed',
            border: '2px solid #b7eb8f',
            borderRadius: '12px',
            textAlign: 'center'
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
            textAlign: 'center'
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
            textAlign: 'center'
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
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#faad14', margin: '0 0 15px 0', fontSize: '1.2rem' }}>
              📊 利润率
            </h3>
            <h2 style={{ color: '#faad14', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>
              {statistics.profitRate}%
            </h2>
          </div>
        </div>
      </div>

      {/* 部门业绩分析 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#333' }}>🏢 部门业绩分析</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '600px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>部门</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>收入</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>成本</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>利润</th>
                <th style={{ padding: '16px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>利润率</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>项目数</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(statistics.departmentStats).map(([dept, stats]) => (
                <tr key={dept} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{dept}</td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#52c41a', fontWeight: 'bold' }}>
                    {formatCurrency(stats.revenue)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#fa8c16', fontWeight: 'bold' }}>
                    {formatCurrency(stats.cost)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#1890ff', fontWeight: 'bold' }}>
                    {formatCurrency(stats.profit)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#faad14', fontWeight: 'bold' }}>
                    {stats.profitRate}%
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{stats.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 财务健康度分析 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 30px 0', color: '#333' }}>💡 财务健康度分析</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* 利润率分析 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>📊 利润率分析</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>当前利润率</span>
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{statistics.profitRate}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(statistics.profitRate, 100)}%`,
                  height: '100%',
                  backgroundColor: statistics.profitRate >= 20 ? '#52c41a' : statistics.profitRate >= 10 ? '#faad14' : '#ff4d4f',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              {statistics.profitRate >= 20 ? '✅ 优秀' : statistics.profitRate >= 10 ? '⚠️ 良好' : '❌ 需要改进'}
            </p>
          </div>

          {/* 成本控制分析 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>💸 成本控制分析</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>成本收入比</span>
                <span style={{ fontWeight: 'bold', color: '#fa8c16' }}>
                  {statistics.totalRevenue > 0 ? ((statistics.totalCost / statistics.totalRevenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${statistics.totalRevenue > 0 ? (statistics.totalCost / statistics.totalRevenue) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: statistics.totalRevenue > 0 && (statistics.totalCost / statistics.totalRevenue) < 0.7 ? '#52c41a' : '#faad14',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              {statistics.totalRevenue > 0 && (statistics.totalCost / statistics.totalRevenue) < 0.7 ? '✅ 成本控制良好' : '⚠️ 成本偏高'}
            </p>
          </div>

          {/* 收入增长分析 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>📈 收入分析</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>平均项目收入</span>
                <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                  {formatCurrency(statistics.totalRecords > 0 ? statistics.totalRevenue / statistics.totalRecords : 0)}
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              共 {statistics.totalRecords} 个项目
            </p>
          </div>
        </div>
      </div>

      {/* 导出说明 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📋 报表说明</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>导出功能</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>支持导出Excel格式的完整利润数据</li>
            <li>包含所有字段：部门、项目、收入、成本、利润、利润率、日期、描述</li>
            <li>文件名自动包含导出日期</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>分析指标</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li><strong>利润率</strong>：反映盈利能力，建议保持在20%以上</li>
            <li><strong>成本收入比</strong>：反映成本控制能力，建议控制在70%以下</li>
            <li><strong>部门业绩</strong>：按部门统计收入和利润情况</li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>建议</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>定期导出数据进行备份</li>
            <li>关注利润率较低的部门，制定改进计划</li>
            <li>分析高利润项目的特点，推广成功经验</li>
            <li>建立月度、季度财务分析报告</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
