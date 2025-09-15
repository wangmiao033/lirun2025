import React from 'react';

const DashboardMinimal = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
        📊 利润管理系统 - 简化版
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 统计卡片 */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>总项目数</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1890ff', margin: '0' }}>25</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>总收入</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#52c41a', margin: '0' }}>¥1,250,000</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>总成本</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#faad14', margin: '0' }}>¥850,000</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>总利润</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f5222d', margin: '0' }}>¥400,000</p>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '30px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>系统状态</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', margin: '10px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🟢</div>
            <div style={{ color: '#666' }}>服务器正常</div>
          </div>
          <div style={{ textAlign: 'center', margin: '10px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🟢</div>
            <div style={{ color: '#666' }}>数据库连接</div>
          </div>
          <div style={{ textAlign: 'center', margin: '10px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🟢</div>
            <div style={{ color: '#666' }}>API服务</div>
          </div>
          <div style={{ textAlign: 'center', margin: '10px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🟢</div>
            <div style={{ color: '#666' }}>前端应用</div>
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '4px',
        padding: '15px',
        marginTop: '30px',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h3 style={{ color: '#1890ff', marginBottom: '10px' }}>💡 测试说明</h3>
        <p style={{ margin: '0', color: '#666' }}>
          这是一个最小化的Dashboard版本，用于测试基础功能是否正常。
          如果您能看到这个页面，说明React应用的基本渲染没有问题。
        </p>
      </div>
    </div>
  );
};

export default DashboardMinimal;
