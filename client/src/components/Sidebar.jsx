import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: '📊',
      label: '仪表盘',
    },
    {
      key: '/profits',
      icon: '💰',
      label: '利润管理',
    },
    {
      key: '/servers',
      icon: '🖥️',
      label: '服务器管理',
    },
    {
      key: '/bank',
      icon: '🏦',
      label: '银行管理',
    },
    {
      key: '/prepayments',
      icon: '💳',
      label: '预付款管理',
    },
    {
      key: '/advertising',
      icon: '📢',
      label: '广告费管理',
    },
    {
      key: '/billing',
      icon: '📋',
      label: '对账管理',
    },
    {
      key: '/departments',
      icon: '👥',
      label: '部门管理',
    },
    {
      key: '/suppliers',
      icon: '🏢',
      label: '供应商管理',
    },
    {
      key: '/research',
      icon: '🔬',
      label: '研发管理',
    },
    {
      key: '/channels',
      icon: '📺',
      label: '渠道管理',
    },
    {
      key: '/import',
      icon: '📤',
      label: '数据导入',
    },
    {
      key: '/reports',
      icon: '📈',
      label: '报表分析',
    },
    {
      key: '/analytics',
      icon: '📊',
      label: '高级分析',
    },
    {
      key: '/backup',
      icon: '💾',
      label: '数据备份',
    },
  ];

  const handleMenuClick = (key) => {
    navigate(key);
  };

  const isActive = (key) => {
    return location.pathname === key;
  };

  return (
    <div style={{
      width: collapsed ? '80px' : '250px',
      height: '100vh',
      backgroundColor: '#fff',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '16px', 
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: '40px',
            height: '40px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {collapsed ? '▶' : '◀'}
        </button>
        {!collapsed && (
          <span style={{ 
            marginLeft: '10px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            管理系统
          </span>
        )}
      </div>
      
      <div style={{
        padding: '8px 0',
        height: 'calc(100vh - 80px)',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            style={{
              padding: collapsed ? '12px 20px' : '12px 20px',
              cursor: 'pointer',
              backgroundColor: isActive(item.key) ? '#e6f7ff' : 'transparent',
              borderRight: isActive(item.key) ? '3px solid #1890ff' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              margin: '2px 0'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.key)) {
                e.target.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.key)) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ 
              fontSize: '16px', 
              marginRight: collapsed ? '0' : '12px',
              minWidth: '20px',
              textAlign: 'center'
            }}>
              {item.icon}
            </span>
            {!collapsed && (
              <span style={{ 
                fontSize: '14px',
                color: isActive(item.key) ? '#1890ff' : '#333',
                fontWeight: isActive(item.key) ? 'bold' : 'normal'
              }}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
