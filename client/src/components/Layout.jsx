import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
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
      icon: '🎯',
      label: '项目管理',
    },
    {
      key: 'supplier-group',
      icon: '🏢',
      label: '供应商管理',
      hasChildren: true,
      children: [
        {
          key: '/servers',
          icon: '🖥️',
          label: '服务器管理',
        },
        {
          key: '/advertising',
          icon: '📢',
          label: '广告费管理',
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
      ]
    },
    {
      key: '/bank',
      icon: '🏦',
      label: '银行资金',
    },
    {
      key: '/prepayments',
      icon: '💳',
      label: '预付款管理',
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
      key: '/import',
      icon: '📤',
      label: '数据导入',
    },
    {
      key: '/reports',
      icon: '📈',
      label: '报表分析',
    },
  ];

  const handleMenuClick = (key, hasChildren) => {
    if (hasChildren) {
      setExpandedMenus(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    } else {
      navigate(key);
    }
  };

  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 侧边栏 */}
      <div style={{
        width: collapsed ? '80px' : '250px',
        backgroundColor: '#fff',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        {/* 头部 */}
        <div style={{
          padding: '20px',
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              marginRight: collapsed ? '0' : '10px'
            }}
          >
            {collapsed ? '☰' : '✕'}
          </button>
          {!collapsed && (
            <h2 style={{ margin: 0, color: '#1890ff', fontSize: '18px' }}>
              利润管理系统
            </h2>
          )}
        </div>

        {/* 菜单 */}
        <div style={{ padding: '20px 0' }}>
          {menuItems.map(item => (
            <div key={item.key}>
              {/* 主菜单项 */}
              <div
                onClick={() => handleMenuClick(item.key, item.hasChildren)}
                style={{
                  padding: '15px 20px',
                  cursor: 'pointer',
                  backgroundColor: location.pathname === item.key ? '#e6f7ff' : 'transparent',
                  borderRight: location.pathname === item.key ? '3px solid #1890ff' : '3px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s',
                  color: location.pathname === item.key ? '#1890ff' : '#333'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', marginRight: collapsed ? '0' : '12px' }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{ fontSize: '14px', fontWeight: location.pathname === item.key ? 'bold' : 'normal' }}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!collapsed && item.hasChildren && (
                  <span style={{ 
                    fontSize: '12px', 
                    transform: expandedMenus[item.key] ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    ▶
                  </span>
                )}
              </div>
              
              {/* 子菜单 */}
              {!collapsed && item.hasChildren && expandedMenus[item.key] && (
                <div style={{ backgroundColor: '#f8f9fa' }}>
                  {item.children.map(child => (
                    <div
                      key={child.key}
                      onClick={() => handleMenuClick(child.key, false)}
                      style={{
                        padding: '12px 20px 12px 50px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === child.key ? '#e6f7ff' : 'transparent',
                        borderRight: location.pathname === child.key ? '3px solid #1890ff' : '3px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.3s',
                        color: location.pathname === child.key ? '#1890ff' : '#666',
                        fontSize: '13px'
                      }}
                    >
                      <span style={{ fontSize: '16px', marginRight: '8px' }}>
                        {child.icon}
                      </span>
                      <span style={{ fontWeight: location.pathname === child.key ? 'bold' : 'normal' }}>
                        {child.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <div style={{
        marginLeft: collapsed ? '80px' : '250px',
        flex: 1,
        transition: 'margin-left 0.3s'
      }}>
        {/* 顶部导航栏 */}
        <div style={{
          backgroundColor: '#fff',
          padding: '0 30px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>
            {(() => {
              // 查找当前路径对应的菜单项
              for (const item of menuItems) {
                if (item.key === location.pathname) {
                  return item.label;
                }
                if (item.children) {
                  const child = item.children.find(child => child.key === location.pathname);
                  if (child) {
                    return child.label;
                  }
                }
              }
              return '仪表盘';
            })()}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              {new Date().toLocaleDateString('zh-CN')}
            </span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              管
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;