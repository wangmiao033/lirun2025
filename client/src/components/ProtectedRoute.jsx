import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return <Loading message="正在验证用户身份..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 检查权限
  if (requiredPermission) {
    const [module, action] = requiredPermission.split(':');
    if (!hasPermission(module, action)) {
      return (
        <div className="permission-error">
          <div className="error-content">
            <div className="error-icon">🚫</div>
            <h2>权限不足</h2>
            <p>您没有访问此页面的权限，请联系管理员</p>
            <button 
              className="back-button"
              onClick={() => window.history.back()}
            >
              返回上一页
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
