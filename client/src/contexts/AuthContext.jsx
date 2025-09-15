import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // 设置默认管理员用户信息，无需登录
  const [user, setUser] = useState({
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin',
    department: '管理部',
    isActive: true,
    lastLogin: new Date().toISOString().split('T')[0],
    profile: {
      firstName: '系统',
      lastName: '管理员',
      phone: '13800138000',
      avatar: ''
    },
    permissions: [
      { module: 'dashboard', actions: ['read', 'write'] },
      { module: 'projects', actions: ['read', 'write', 'delete'] },
      { module: 'servers', actions: ['read', 'write', 'delete'] },
      { module: 'bank', actions: ['read', 'write', 'delete'] },
      { module: 'prepayments', actions: ['read', 'write', 'delete'] },
      { module: 'advertising', actions: ['read', 'write', 'delete'] },
      { module: 'channels', actions: ['read', 'write', 'delete'] },
      { module: 'suppliers', actions: ['read', 'write', 'delete'] },
      { module: 'research', actions: ['read', 'write', 'delete'] },
      { module: 'reports', actions: ['read', 'write', 'delete'] },
      { module: 'users', actions: ['read', 'write', 'delete'] },
      { module: 'departments', actions: ['read', 'write', 'delete'] },
      { module: 'games', actions: ['read', 'write', 'delete'] },
      { module: 'billing', actions: ['read', 'write', 'delete'] },
      { module: 'backups', actions: ['read', 'write', 'delete'] },
      { module: 'data-import', actions: ['read', 'write', 'delete'] },
      { module: 'advanced-analytics', actions: ['read', 'write', 'delete'] }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 直接设置用户为已登录状态，无需检查token
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasPermission = (module, action) => {
    // 管理员拥有所有权限
    if (user && user.role === 'admin') return true;
    
    const permission = user?.permissions?.find(p => p.module === module);
    return permission?.actions?.includes(action) || false;
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
