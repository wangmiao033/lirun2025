import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectOverview.css';

const ProjectOverview = ({ projectStats, loading }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleProjectClick = (projectName) => {
    // 导航到项目管理页面并过滤特定项目
    navigate('/profits', { state: { filterProject: projectName } });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎯 项目业绩统计</h2>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  const projects = Object.entries(projectStats || {});

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🎯 项目业绩统计</h2>
        <p className="card-subtitle">
          点击项目卡片查看详细信息
        </p>
      </div>
      
      {projects.length > 0 ? (
        <div className="projects-grid grid grid-cols-1 grid-cols-2 grid-cols-3">
          {projects.map(([projectName, stats]) => (
            <div
              key={projectName}
              className="project-card"
              onClick={() => handleProjectClick(projectName)}
            >
              <div className="project-header">
                <h3 className="project-name">{projectName}</h3>
                <div className="project-count">{stats.count} 条记录</div>
              </div>
              
              <div className="project-stats">
                <div className="stat-row">
                  <span className="stat-label">收入</span>
                  <span className="stat-value success">
                    {formatCurrency(stats.revenue)}
                  </span>
                </div>
                
                <div className="stat-row">
                  <span className="stat-label">成本</span>
                  <span className="stat-value warning">
                    {formatCurrency(stats.cost)}
                  </span>
                </div>
                
                <div className="stat-row">
                  <span className="stat-label">利润</span>
                  <span className={`stat-value ${stats.profit >= 0 ? 'success' : 'error'}`}>
                    {formatCurrency(stats.profit)}
                  </span>
                </div>
                
                <div className="stat-row">
                  <span className="stat-label">利润率</span>
                  <span className={`stat-value ${stats.profitRate >= 20 ? 'success' : stats.profitRate >= 10 ? 'warning' : 'error'}`}>
                    {stats.profitRate}%
                  </span>
                </div>
              </div>
              
              <div className="project-footer">
                <div className="project-performance">
                  {stats.profitRate >= 20 && (
                    <span className="performance-badge success">优秀</span>
                  )}
                  {stats.profitRate >= 10 && stats.profitRate < 20 && (
                    <span className="performance-badge warning">良好</span>
                  )}
                  {stats.profitRate < 10 && (
                    <span className="performance-badge error">需改进</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">暂无项目数据</h3>
          <p className="empty-state-description">
            请前往项目管理页面添加项目数据
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectOverview;
