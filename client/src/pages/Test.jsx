import React from 'react';

const Test = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>测试页面</h1>
      <p>如果你能看到这个页面，说明前端路由工作正常。</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default Test;
