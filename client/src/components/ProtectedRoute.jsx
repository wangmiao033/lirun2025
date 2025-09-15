import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  // 移除所有认证和权限检查，直接返回子组件
  return children;
};

export default ProtectedRoute;
