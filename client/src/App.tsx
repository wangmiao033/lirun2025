import React from 'react';

const App = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px'
      }}>
        <h1 style={{ color: '#1890ff', margin: '0' }}>利润管理系统</h1>
        <p style={{ color: '#666', margin: '10px 0 0 0' }}>
          公司内部利润数据管理平台
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#52c41a', margin: '0 0 10px 0' }}>总收入</h3>
          <h2 style={{ color: '#52c41a', margin: '0' }}>¥3,200,000</h2>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff2e8', 
          border: '1px solid #ffbb96',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#fa8c16', margin: '0 0 10px 0' }}>总成本</h3>
          <h2 style={{ color: '#fa8c16', margin: '0' }}>¥2,500,000</h2>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e6f7ff', 
          border: '1px solid #91d5ff',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 10px 0' }}>总利润</h3>
          <h2 style={{ color: '#1890ff', margin: '0' }}>¥700,000</h2>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fffbe6', 
          border: '1px solid #ffe58f',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#faad14', margin: '0 0 10px 0' }}>利润率</h3>
          <h2 style={{ color: '#faad14', margin: '0' }}>21.9%</h2>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>系统功能</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '10px',
              color: '#1890ff'
            }}>📊</div>
            <h4 style={{ margin: '0 0 5px 0' }}>数据统计</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              查看利润趋势和统计
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '10px',
              color: '#52c41a'
            }}>📝</div>
            <h4 style={{ margin: '0 0 5px 0' }}>数据录入</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              添加和编辑利润记录
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '10px',
              color: '#fa8c16'
            }}>🏢</div>
            <h4 style={{ margin: '0 0 5px 0' }}>部门管理</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              维护部门信息
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '10px',
              color: '#722ed1'
            }}>📤</div>
            <h4 style={{ margin: '0 0 5px 0' }}>数据导入</h4>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
              Excel批量导入
            </p>
          </div>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#1890ff', margin: '0 0 10px 0' }}>
            🎉 系统部署成功！
          </h3>
          <p style={{ color: '#666', margin: '0' }}>
            利润管理系统已成功部署并运行
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;