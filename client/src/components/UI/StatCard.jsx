import React from 'react';
import './StatCard.css';

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  color = 'primary', 
  trend, 
  trendValue,
  onClick,
  loading = false 
}) => {
  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  if (loading) {
    return (
      <div className={`stat-card ${color} loading`}>
        <div className="loading-spinner"></div>
        <div className="stat-label">{title}</div>
        <div className="stat-value">--</div>
      </div>
    );
  }

  return (
    <div 
      className={`stat-card ${color} ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
      {description && <div className="stat-description">{description}</div>}
      {trend && trendValue && (
        <div className={`stat-trend ${trend}`}>
          <span className="trend-icon">
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </span>
          <span className="trend-value">{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
