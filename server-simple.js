const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 文件上传配置
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 模拟数据库 - 利润数据
let profits = [
  {
    id: 1,
    department: '销售部',
    project: '产品A销售',
    revenue: 500000,
    cost: 350000,
    profit: 150000,
    profitRate: 30.0,
    date: '2024-12-01',
    description: 'Q4季度产品A销售业绩'
  },
  {
    id: 2,
    department: '技术部',
    project: '软件开发',
    revenue: 800000,
    cost: 600000,
    profit: 200000,
    profitRate: 25.0,
    date: '2024-12-02',
    description: '客户定制软件开发项目'
  },
  {
    id: 3,
    department: '市场部',
    project: '品牌推广',
    revenue: 300000,
    cost: 250000,
    profit: 50000,
    profitRate: 16.7,
    date: '2024-12-03',
    description: '年度品牌推广活动'
  }
];

// 模拟数据库 - 部门数据
let departments = [
  { id: 1, name: '销售部', manager: '张三', budget: 1000000, description: '负责产品销售和客户维护' },
  { id: 2, name: '技术部', manager: '李四', budget: 1500000, description: '负责产品研发和技术支持' },
  { id: 3, name: '市场部', manager: '王五', budget: 800000, description: '负责市场推广和品牌建设' },
  { id: 4, name: '财务部', manager: '赵六', budget: 500000, description: '负责财务管理和成本控制' }
];

// 获取所有利润数据
app.get('/api/profits', (req, res) => {
  res.json({
    success: true,
    data: profits,
    total: profits.length
  });
});

// 获取单个利润数据
app.get('/api/profits/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const profit = profits.find(p => p.id === id);
  
  if (profit) {
    res.json({
      success: true,
      data: profit
    });
  } else {
    res.status(404).json({
      success: false,
      message: '利润数据不存在'
    });
  }
});

// 创建新的利润数据
app.post('/api/profits', (req, res) => {
  const { department, project, revenue, cost, date, description } = req.body;
  
  if (!department || !project || !revenue || !cost || !date) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const profit = revenue - cost;
  const profitRate = ((profit / revenue) * 100).toFixed(1);
  
  const newProfit = {
    id: profits.length + 1,
    department,
    project,
    revenue: parseFloat(revenue),
    cost: parseFloat(cost),
    profit: parseFloat(profit),
    profitRate: parseFloat(profitRate),
    date,
    description: description || ''
  };
  
  profits.push(newProfit);
  
  res.json({
    success: true,
    data: newProfit,
    message: '利润数据创建成功'
  });
});

// 更新利润数据
app.put('/api/profits/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { department, project, revenue, cost, date, description } = req.body;
  
  const profitIndex = profits.findIndex(p => p.id === id);
  
  if (profitIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '利润数据不存在'
    });
  }
  
  const profit = revenue - cost;
  const profitRate = ((profit / revenue) * 100).toFixed(1);
  
  profits[profitIndex] = {
    ...profits[profitIndex],
    department,
    project,
    revenue: parseFloat(revenue),
    cost: parseFloat(cost),
    profit: parseFloat(profit),
    profitRate: parseFloat(profitRate),
    date,
    description: description || ''
  };
  
  res.json({
    success: true,
    data: profits[profitIndex],
    message: '利润数据更新成功'
  });
});

// 删除利润数据
app.delete('/api/profits/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const profitIndex = profits.findIndex(p => p.id === id);
  
  if (profitIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '利润数据不存在'
    });
  }
  
  profits.splice(profitIndex, 1);
  
  res.json({
    success: true,
    message: '利润数据删除成功'
  });
});

// 获取所有部门
app.get('/api/departments', (req, res) => {
  res.json({
    success: true,
    data: departments,
    total: departments.length
  });
});

// 创建新部门
app.post('/api/departments', (req, res) => {
  const { name, manager, budget, description } = req.body;
  
  if (!name || !manager) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newDepartment = {
    id: departments.length + 1,
    name,
    manager,
    budget: parseFloat(budget) || 0,
    description: description || ''
  };
  
  departments.push(newDepartment);
  
  res.json({
    success: true,
    data: newDepartment,
    message: '部门创建成功'
  });
});

// 更新部门
app.put('/api/departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, manager, budget, description } = req.body;
  
  const departmentIndex = departments.findIndex(d => d.id === id);
  
  if (departmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '部门不存在'
    });
  }
  
  departments[departmentIndex] = {
    ...departments[departmentIndex],
    name,
    manager,
    budget: parseFloat(budget) || 0,
    description: description || ''
  };
  
  res.json({
    success: true,
    data: departments[departmentIndex],
    message: '部门更新成功'
  });
});

// 删除部门
app.delete('/api/departments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const departmentIndex = departments.findIndex(d => d.id === id);
  
  if (departmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '部门不存在'
    });
  }
  
  departments.splice(departmentIndex, 1);
  
  res.json({
    success: true,
    message: '部门删除成功'
  });
});

// Excel文件上传和解析
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '没有上传文件'
    });
  }
  
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // 处理导入的数据
    const importedProfits = data.map((row, index) => {
      const revenue = parseFloat(row['收入'] || row['revenue'] || 0);
      const cost = parseFloat(row['成本'] || row['cost'] || 0);
      const profit = revenue - cost;
      const profitRate = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
      
      return {
        id: profits.length + index + 1,
        department: row['部门'] || row['department'] || '未知部门',
        project: row['项目'] || row['project'] || '未知项目',
        revenue,
        cost,
        profit: parseFloat(profit),
        profitRate: parseFloat(profitRate),
        date: row['日期'] || row['date'] || new Date().toISOString().split('T')[0],
        description: row['描述'] || row['description'] || ''
      };
    });
    
    // 添加到现有数据
    profits.push(...importedProfits);
    
    res.json({
      success: true,
      data: importedProfits,
      message: `成功导入 ${importedProfits.length} 条利润数据`
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件解析失败: ' + error.message
    });
  }
});

// 获取统计数据
app.get('/api/statistics', (req, res) => {
  const totalRevenue = profits.reduce((sum, p) => sum + p.revenue, 0);
  const totalCost = profits.reduce((sum, p) => sum + p.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitRate = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
  
  // 按部门统计
  const departmentStats = {};
  profits.forEach(profit => {
    if (!departmentStats[profit.department]) {
      departmentStats[profit.department] = {
        revenue: 0,
        cost: 0,
        profit: 0,
        count: 0
      };
    }
    departmentStats[profit.department].revenue += profit.revenue;
    departmentStats[profit.department].cost += profit.cost;
    departmentStats[profit.department].profit += profit.profit;
    departmentStats[profit.department].count += 1;
  });
  
  // 计算部门利润率
  Object.keys(departmentStats).forEach(dept => {
    const stats = departmentStats[dept];
    stats.profitRate = stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : 0;
  });
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      totalCost,
      totalProfit,
      profitRate: parseFloat(profitRate),
      departmentStats,
      totalRecords: profits.length
    }
  });
});

// 导出数据为Excel
app.get('/api/export', (req, res) => {
  try {
    const worksheet = xlsx.utils.json_to_sheet(profits.map(p => ({
      '部门': p.department,
      '项目': p.project,
      '收入': p.revenue,
      '成本': p.cost,
      '利润': p.profit,
      '利润率(%)': p.profitRate,
      '日期': p.date,
      '描述': p.description
    })));
    
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '利润数据');
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=利润数据.xlsx');
    res.send(buffer);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '导出失败: ' + error.message
    });
  }
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