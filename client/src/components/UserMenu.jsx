import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleText = (role) => {
    const roleMap = {
      admin: '管理员',
      manager: '经理',
      user: '用户',
      viewer: '查看者'
    };
    return roleMap[role] || role;
  };

  if (!user) return null;

  return (
    <div className="user-menu">
      <div 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {user.profile?.firstName?.[0] || user.username[0].toUpperCase()}
        </div>
        <div className="user-info">
          <div className="user-name">
            {user.profile?.firstName && user.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user.username
            }
          </div>
          <div className="user-role">{getRoleText(user.role)}</div>
        </div>
        <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </div>
      </div>
      
      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-avatar-large">
              {user.profile?.firstName?.[0] || user.username[0].toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name-large">
                {user.profile?.firstName && user.profile?.lastName 
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user.username
                }
              </div>
              <div className="user-email">{user.email}</div>
              <div className="user-department">{user.department}</div>
            </div>
          </div>
          
          <div className="user-menu-divider"></div>
          
          <div className="user-menu-items">
            <div className="menu-item" onClick={() => setIsOpen(false)}>
              <span>个人设置</span>
            </div>
            <div className="menu-item" onClick={() => setIsOpen(false)}>
              <span>修改密码</span>
            </div>
            <div className="menu-item" onClick={() => setIsOpen(false)}>
              <span>帮助中心</span>
            </div>
          </div>
          
          <div className="user-menu-divider"></div>
          
          <div className="user-menu-items">
            <div className="menu-item logout" onClick={handleLogout}>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="user-menu-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;
