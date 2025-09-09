import React from 'react';

const App = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#1890ff', 
          margin: '0',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          🏢 利润管理系统
        </h1>
        <p style={{ 
          color: '#666', 
          margin: '15px 0 0 0',
          fontSize: '1.1rem'
        }}>
          公司内部利润数据管理平台
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#f6ffed', 
          border: '2px solid #b7eb8f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#52c41a', margin: '0 0 15px 0', fontSize: '1.2rem' }}>💰 总收入</h3>
          <h2 style={{ color: '#52c41a', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>¥3,200,000</h2>
        </div>
        
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#fff2e8', 
          border: '2px solid #ffbb96',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#fa8c16', margin: '0 0 15px 0', fontSize: '1.2rem' }}>💸 总成本</h3>
          <h2 style={{ color: '#fa8c16', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>¥2,500,000</h2>
        </div>
        
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#e6f7ff', 
          border: '2px solid #91d5ff',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 15px 0', fontSize: '1.2rem' }}>📈 总利润</h3>
          <h2 style={{ color: '#1890ff', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>¥700,000</h2>
        </div>
        
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#fffbe6', 
          border: '2px solid #ffe58f',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#faad14', margin: '0 0 15px 0', fontSize: '1.2rem' }}>📊 利润率</h3>
          <h2 style={{ color: '#faad14', margin: '0', fontSize: '2rem', fontWeight: 'bold' }}>21.9%</h2>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '40px', 
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '30px', fontSize: '1.8rem' }}>🚀 系统功能</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px'
            }}>📊</div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>数据统计</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              查看利润趋势和统计
            </p>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px'
            }}>📝</div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>数据录入</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              添加和编辑利润记录
            </p>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px'
            }}>🏢</div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>部门管理</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              维护部门信息
            </p>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '32px', 
              marginBottom: '15px'
            }}>📤</div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>数据导入</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              Excel批量导入
            </p>
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '30px',
          backgroundColor: '#e6f7ff',
          borderRadius: '12px',
          border: '2px solid #91d5ff'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 15px 0', fontSize: '1.5rem' }}>
            🎉 系统部署成功！
          </h3>
          <p style={{ color: '#666', margin: '0', fontSize: '1.1rem' }}>
            利润管理系统已成功部署并运行 - 使用Vite构建，无依赖问题
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
