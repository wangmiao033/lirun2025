import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🎉 简单测试页面
      </h1>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '20px auto',
        maxWidth: '600px'
      }}>
        <h2>✅ React 应用正常工作</h2>
        <p>如果您能看到这个页面，说明：</p>
        <ul>
          <li>✅ React 组件正常渲染</li>
          <li>✅ JavaScript 文件正常加载</li>
          <li>✅ 路由系统正常工作</li>
          <li>✅ 基础功能没有问题</li>
        </ul>
        
        <div style={{
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: '4px',
          padding: '12px',
          marginTop: '20px'
        }}>
          <h3>🔧 如果主页面有问题，可能的原因：</h3>
          <ol>
            <li>特定组件有错误</li>
            <li>API调用失败</li>
            <li>数据加载问题</li>
            <li>CSS样式冲突</li>
          </ol>
        </div>
        
        <div style={{
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '4px',
          padding: '12px',
          marginTop: '20px'
        }}>
          <h3>💡 解决建议：</h3>
          <p>请检查浏览器控制台（F12）是否有错误信息，这将帮助我们定位具体问题。</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
