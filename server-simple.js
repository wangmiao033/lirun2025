const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据
const mockData = {
  profits: [
    {
      id: 1,
      department: '销售部',
      project: '企业客户项目A',
      period: '2025-01',
      revenue: 1200000,
      cost: 900000,
      profit: 300000,
      profitMargin: 25.0,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      department: '技术部',
      project: '产品研发项目B',
      period: '2025-01',
      revenue: 2000000,
      cost: 1600000,
      profit: 400000,
      profitMargin: 20.0,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ],
  departments: [
    { id: 1, name: '销售部', code: 'SALES', manager: '张三', budget: 5000000 },
    { id: 2, name: '技术部', code: 'TECH', manager: '李四', budget: 8000000 },
    { id: 3, name: '市场部', code: 'MARKET', manager: '王五', budget: 3000000 },
    { id: 4, name: '财务部', code: 'FINANCE', manager: '赵六', budget: 2000000 }
  ]
};

// API路由
app.get('/api/profits', (req, res) => {
  res.json({
    profits: mockData.profits,
    total: mockData.profits.length,
    totalPages: 1,
    currentPage: 1
  });
});

app.get('/api/profits/stats/summary', (req, res) => {
  const totalRevenue = mockData.profits.reduce((sum, p) => sum + p.revenue, 0);
  const totalCost = mockData.profits.reduce((sum, p) => sum + p.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  res.json({
    totalRevenue,
    totalCost,
    totalProfit,
    avgProfitMargin,
    count: mockData.profits.length
  });
});

app.get('/api/profits/stats/by-department', (req, res) => {
  const deptStats = mockData.departments.map(dept => {
    const deptProfits = mockData.profits.filter(p => p.department === dept.name);
    const totalRevenue = deptProfits.reduce((sum, p) => sum + p.revenue, 0);
    const totalCost = deptProfits.reduce((sum, p) => sum + p.cost, 0);
    const totalProfit = totalRevenue - totalCost;
    const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    return {
      _id: dept.name,
      totalRevenue,
      totalCost,
      totalProfit,
      avgProfitMargin,
      count: deptProfits.length
    };
  });
  
  res.json(deptStats);
});

app.get('/api/departments', (req, res) => {
  res.json(mockData.departments);
});

// 静态文件服务（仅在构建后可用）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});
