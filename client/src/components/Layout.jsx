import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';

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
        {
          key: '/games',
          icon: '🎮',
          label: '游戏管理',
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
    {
      key: '/analytics',
      icon: '🔬',
      label: '高级分析',
    },
    {
      key: '/backup',
      icon: '💾',
      label: '数据备份',
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
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* 侧边栏 */}
      <div style={{
        width: collapsed ? '80px' : '280px',
        background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* 头部 */}
        <div style={{
          padding: '24px 20px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '8px',
              marginRight: collapsed ? '0' : '12px',
              color: '#fff',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {collapsed ? '☰' : '✕'}
          </button>
          {!collapsed && (
            <h2 style={{ 
              margin: 0, 
              color: '#fff', 
              fontSize: '20px',
              fontWeight: '600',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px'
            }}>
              利润管理系统
            </h2>
          )}
        </div>

        {/* 菜单 */}
        <div style={{ padding: '16px 0' }}>
          {menuItems.map(item => (
            <div key={item.key}>
              {/* 主菜单项 */}
              <div
                onClick={() => handleMenuClick(item.key, item.hasChildren)}
                style={{
                  padding: '16px 24px',
                  cursor: 'pointer',
                  backgroundColor: location.pathname === item.key ? 'rgba(52, 152, 219, 0.2)' : 'transparent',
                  borderRight: location.pathname === item.key ? '4px solid #3498db' : '4px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: location.pathname === item.key ? '#3498db' : '#ecf0f1',
                  margin: '4px 12px',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.key) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.key) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '20px', 
                    marginRight: collapsed ? '0' : '16px',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{ 
                      fontSize: '15px', 
                      fontWeight: location.pathname === item.key ? '600' : '400',
                      letterSpacing: '0.3px'
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!collapsed && item.hasChildren && (
                  <span style={{ 
                    fontSize: '14px', 
                    transform: expandedMenus[item.key] ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: '#bdc3c7'
                  }}>
                    ▶
                  </span>
                )}
              </div>
              
              {/* 子菜单 */}
              {!collapsed && item.hasChildren && expandedMenus[item.key] && (
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%)',
                  margin: '0 12px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)'
                }}>
                  {item.children.map(child => (
                    <div
                      key={child.key}
                      onClick={() => handleMenuClick(child.key, false)}
                      style={{
                        padding: '14px 24px 14px 60px',
                        cursor: 'pointer',
                        backgroundColor: location.pathname === child.key ? 'rgba(52, 152, 219, 0.3)' : 'transparent',
                        borderRight: location.pathname === child.key ? '3px solid #3498db' : '3px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: location.pathname === child.key ? '#3498db' : '#bdc3c7',
                        fontSize: '14px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== child.key) {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          e.target.style.color = '#ecf0f1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== child.key) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#bdc3c7';
                        }
                      }}
                    >
                      <span style={{ 
                        fontSize: '16px', 
                        marginRight: '12px',
                        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                      }}>
                        {child.icon}
                      </span>
                      <span style={{ 
                        fontWeight: location.pathname === child.key ? '500' : '400',
                        letterSpacing: '0.2px'
                      }}>
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
        marginLeft: collapsed ? '80px' : '280px',
        flex: 1,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}>
        {/* 顶部导航栏 */}
        <Header />

        {/* 页面内容 */}
        <div style={{ 
          padding: '40px',
          minHeight: 'calc(100vh - 90px)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;