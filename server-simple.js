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

// 模拟数据库 - 项目数据
let projects = [
  {
    id: 1,
    projectName: '王者荣耀充值项目',
    companyRevenue: 1000000,
    gameRechargeFlow: 800000,
    abnormalRefund: 50000,
    testFee: 10000,
    voucher: 20000,
    channel: 30000,
    withholdingTaxRate: 0.06,
    sharing: 400000,
    sharingRatio: 0.5,
    productCost: 200000,
    prepaid: 50000,
    server: 80000,
    advertisingFee: 100000,
    costTotal: 430000,
    grossProfit: 570000,
    grossProfitRate: 57.0,
    revenue: 1000000,
    date: '2024-12-01',
    description: '王者荣耀游戏充值流水项目'
  },
  {
    id: 2,
    projectName: '和平精英推广项目',
    companyRevenue: 800000,
    gameRechargeFlow: 600000,
    abnormalRefund: 30000,
    testFee: 8000,
    voucher: 15000,
    channel: 25000,
    withholdingTaxRate: 0.06,
    sharing: 300000,
    sharingRatio: 0.5,
    productCost: 150000,
    prepaid: 40000,
    server: 60000,
    advertisingFee: 80000,
    costTotal: 330000,
    grossProfit: 470000,
    grossProfitRate: 58.8,
    revenue: 800000,
    date: '2024-12-02',
    description: '和平精英游戏推广和充值项目'
  }
];

// 模拟数据库 - 服务器数据
let servers = [
  {
    id: 1,
    serverName: '阿里云ECS-游戏服务器1',
    instanceId: 'i-bp1234567890abcdef',
    game: '王者荣耀',
    region: '华东1（杭州）',
    instanceType: 'ecs.c6.large',
    cpu: '2核',
    memory: '4GB',
    disk: '40GB SSD',
    bandwidth: '5Mbps',
    monthlyCost: 800,
    status: '运行中',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: '王者荣耀游戏主服务器'
  },
  {
    id: 2,
    serverName: '腾讯云CVM-数据库服务器',
    instanceId: 'ins-1234567890abcdef',
    game: '和平精英',
    region: '北京',
    instanceType: 'S5.MEDIUM4',
    cpu: '2核',
    memory: '4GB',
    disk: '50GB SSD',
    bandwidth: '3Mbps',
    monthlyCost: 600,
    status: '运行中',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    description: '和平精英数据库服务器'
  },
  {
    id: 3,
    serverName: '华为云ECS-测试服务器',
    instanceId: 'i-1234567890abcdef',
    game: '测试环境',
    region: '华北-北京四',
    instanceType: 's6.large.2',
    cpu: '2核',
    memory: '4GB',
    disk: '40GB SSD',
    bandwidth: '2Mbps',
    monthlyCost: 400,
    status: '已停止',
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    description: '游戏测试环境服务器'
  }
];

// 模拟数据库 - 银行账户数据
let bankAccounts = [
  {
    id: 1,
    bankName: '中国工商银行',
    accountName: '公司基本账户',
    accountNumber: '6222****1234',
    accountType: '基本账户',
    balance: 2500000,
    currency: 'CNY',
    lastUpdate: '2024-12-09',
    description: '公司主要经营账户'
  },
  {
    id: 2,
    bankName: '中国建设银行',
    accountName: '公司专用账户',
    accountNumber: '6217****5678',
    accountType: '专用账户',
    balance: 800000,
    currency: 'CNY',
    lastUpdate: '2024-12-09',
    description: '游戏充值专用账户'
  },
  {
    id: 3,
    bankName: '招商银行',
    accountName: '公司备用金账户',
    accountNumber: '6225****9012',
    accountType: '一般账户',
    balance: 500000,
    currency: 'CNY',
    lastUpdate: '2024-12-09',
    description: '公司备用资金账户'
  }
];

// 模拟数据库 - 资金流水数据
let fundFlows = [
  {
    id: 1,
    accountId: 1,
    transactionType: '收入',
    amount: 1000000,
    description: '王者荣耀充值收入',
    date: '2024-12-01',
    balance: 2500000,
    reference: 'PROJ001'
  },
  {
    id: 2,
    accountId: 1,
    transactionType: '支出',
    amount: 80000,
    description: '服务器费用',
    date: '2024-12-02',
    balance: 2420000,
    reference: 'SERVER001'
  },
  {
    id: 3,
    accountId: 2,
    transactionType: '收入',
    amount: 800000,
    description: '和平精英充值收入',
    date: '2024-12-02',
    balance: 800000,
    reference: 'PROJ002'
  }
];

// 获取所有项目数据
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    data: projects,
    total: projects.length
  });
});

// 获取单个项目数据
app.get('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  
  if (project) {
    res.json({
      success: true,
      data: project
    });
  } else {
    res.status(404).json({
      success: false,
      message: '项目不存在'
    });
  }
});

// 创建新的项目数据
app.post('/api/projects', (req, res) => {
  const {
    projectName, companyRevenue, gameRechargeFlow, abnormalRefund, testFee,
    voucher, channel, withholdingTaxRate, sharing, sharingRatio,
    productCost, prepaid, server, advertisingFee, date, description
  } = req.body;
  
  if (!projectName || !companyRevenue || !date) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  // 计算成本合计
  const costTotal = (productCost || 0) + (prepaid || 0) + (server || 0) + (advertisingFee || 0);
  
  // 计算毛利
  const grossProfit = companyRevenue - costTotal;
  
  // 计算毛利率
  const grossProfitRate = companyRevenue > 0 ? ((grossProfit / companyRevenue) * 100).toFixed(1) : 0;
  
  const newProject = {
    id: projects.length + 1,
    projectName,
    companyRevenue: parseFloat(companyRevenue),
    gameRechargeFlow: parseFloat(gameRechargeFlow) || 0,
    abnormalRefund: parseFloat(abnormalRefund) || 0,
    testFee: parseFloat(testFee) || 0,
    voucher: parseFloat(voucher) || 0,
    channel: parseFloat(channel) || 0,
    withholdingTaxRate: parseFloat(withholdingTaxRate) || 0,
    sharing: parseFloat(sharing) || 0,
    sharingRatio: parseFloat(sharingRatio) || 0,
    productCost: parseFloat(productCost) || 0,
    prepaid: parseFloat(prepaid) || 0,
    server: parseFloat(server) || 0,
    advertisingFee: parseFloat(advertisingFee) || 0,
    costTotal: parseFloat(costTotal),
    grossProfit: parseFloat(grossProfit),
    grossProfitRate: parseFloat(grossProfitRate),
    revenue: parseFloat(companyRevenue),
    date,
    description: description || ''
  };
  
  projects.push(newProject);
  
  res.json({
    success: true,
    data: newProject,
    message: '项目创建成功'
  });
});

// 更新项目数据
app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const {
    projectName, companyRevenue, gameRechargeFlow, abnormalRefund, testFee,
    voucher, channel, withholdingTaxRate, sharing, sharingRatio,
    productCost, prepaid, server, advertisingFee, date, description
  } = req.body;
  
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '项目不存在'
    });
  }
  
  // 计算成本合计
  const costTotal = (productCost || 0) + (prepaid || 0) + (server || 0) + (advertisingFee || 0);
  
  // 计算毛利
  const grossProfit = companyRevenue - costTotal;
  
  // 计算毛利率
  const grossProfitRate = companyRevenue > 0 ? ((grossProfit / companyRevenue) * 100).toFixed(1) : 0;
  
  projects[projectIndex] = {
    ...projects[projectIndex],
    projectName,
    companyRevenue: parseFloat(companyRevenue),
    gameRechargeFlow: parseFloat(gameRechargeFlow) || 0,
    abnormalRefund: parseFloat(abnormalRefund) || 0,
    testFee: parseFloat(testFee) || 0,
    voucher: parseFloat(voucher) || 0,
    channel: parseFloat(channel) || 0,
    withholdingTaxRate: parseFloat(withholdingTaxRate) || 0,
    sharing: parseFloat(sharing) || 0,
    sharingRatio: parseFloat(sharingRatio) || 0,
    productCost: parseFloat(productCost) || 0,
    prepaid: parseFloat(prepaid) || 0,
    server: parseFloat(server) || 0,
    advertisingFee: parseFloat(advertisingFee) || 0,
    costTotal: parseFloat(costTotal),
    grossProfit: parseFloat(grossProfit),
    grossProfitRate: parseFloat(grossProfitRate),
    revenue: parseFloat(companyRevenue),
    date,
    description: description || ''
  };
  
  res.json({
    success: true,
    data: projects[projectIndex],
    message: '项目更新成功'
  });
});

// 删除项目数据
app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '项目不存在'
    });
  }
  
  projects.splice(projectIndex, 1);
  
  res.json({
    success: true,
    message: '项目删除成功'
  });
});

// 服务器管理API
app.get('/api/servers', (req, res) => {
  res.json({
    success: true,
    data: servers,
    total: servers.length
  });
});

app.post('/api/servers', (req, res) => {
  const {
    serverName, instanceId, game, region, instanceType, cpu, memory,
    disk, bandwidth, monthlyCost, status, startDate, endDate, description
  } = req.body;
  
  if (!serverName || !instanceId || !monthlyCost) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newServer = {
    id: servers.length + 1,
    serverName,
    instanceId,
    game: game || '',
    region: region || '',
    instanceType: instanceType || '',
    cpu: cpu || '',
    memory: memory || '',
    disk: disk || '',
    bandwidth: bandwidth || '',
    monthlyCost: parseFloat(monthlyCost),
    status: status || '运行中',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '',
    description: description || ''
  };
  
  servers.push(newServer);
  
  res.json({
    success: true,
    data: newServer,
    message: '服务器创建成功'
  });
});

app.put('/api/servers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const serverIndex = servers.findIndex(s => s.id === id);
  
  if (serverIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '服务器不存在'
    });
  }
  
  servers[serverIndex] = {
    ...servers[serverIndex],
    ...req.body,
    monthlyCost: parseFloat(req.body.monthlyCost) || servers[serverIndex].monthlyCost
  };
  
  res.json({
    success: true,
    data: servers[serverIndex],
    message: '服务器更新成功'
  });
});

app.delete('/api/servers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const serverIndex = servers.findIndex(s => s.id === id);
  
  if (serverIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '服务器不存在'
    });
  }
  
  servers.splice(serverIndex, 1);
  
  res.json({
    success: true,
    message: '服务器删除成功'
  });
});

// 银行账户管理API
app.get('/api/bank-accounts', (req, res) => {
  res.json({
    success: true,
    data: bankAccounts,
    total: bankAccounts.length
  });
});

app.post('/api/bank-accounts', (req, res) => {
  const {
    bankName, accountName, accountNumber, accountType, balance, currency, description
  } = req.body;
  
  if (!bankName || !accountName || !accountNumber) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newAccount = {
    id: bankAccounts.length + 1,
    bankName,
    accountName,
    accountNumber,
    accountType: accountType || '一般账户',
    balance: parseFloat(balance) || 0,
    currency: currency || 'CNY',
    lastUpdate: new Date().toISOString().split('T')[0],
    description: description || ''
  };
  
  bankAccounts.push(newAccount);
  
  res.json({
    success: true,
    data: newAccount,
    message: '银行账户创建成功'
  });
});

app.put('/api/bank-accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const accountIndex = bankAccounts.findIndex(a => a.id === id);
  
  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '银行账户不存在'
    });
  }
  
  bankAccounts[accountIndex] = {
    ...bankAccounts[accountIndex],
    ...req.body,
    balance: parseFloat(req.body.balance) || bankAccounts[accountIndex].balance,
    lastUpdate: new Date().toISOString().split('T')[0]
  };
  
  res.json({
    success: true,
    data: bankAccounts[accountIndex],
    message: '银行账户更新成功'
  });
});

app.delete('/api/bank-accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const accountIndex = bankAccounts.findIndex(a => a.id === id);
  
  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '银行账户不存在'
    });
  }
  
  bankAccounts.splice(accountIndex, 1);
  
  res.json({
    success: true,
    message: '银行账户删除成功'
  });
});

// 资金流水管理API
app.get('/api/fund-flows', (req, res) => {
  res.json({
    success: true,
    data: fundFlows,
    total: fundFlows.length
  });
});

app.post('/api/fund-flows', (req, res) => {
  const {
    accountId, transactionType, amount, description, date, reference
  } = req.body;
  
  if (!accountId || !transactionType || !amount || !description) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const account = bankAccounts.find(a => a.id === parseInt(accountId));
  if (!account) {
    return res.status(404).json({
      success: false,
      message: '银行账户不存在'
    });
  }
  
  const transactionAmount = parseFloat(amount);
  const newBalance = transactionType === '收入' 
    ? account.balance + transactionAmount 
    : account.balance - transactionAmount;
  
  const newFlow = {
    id: fundFlows.length + 1,
    accountId: parseInt(accountId),
    transactionType,
    amount: transactionAmount,
    description,
    date: date || new Date().toISOString().split('T')[0],
    balance: newBalance,
    reference: reference || ''
  };
  
  // 更新账户余额
  account.balance = newBalance;
  account.lastUpdate = newFlow.date;
  
  fundFlows.push(newFlow);
  
  res.json({
    success: true,
    data: newFlow,
    message: '资金流水创建成功'
  });
});

// 获取服务器成本统计
app.get('/api/server-statistics', (req, res) => {
  const totalServers = servers.length;
  const runningServers = servers.filter(s => s.status === '运行中').length;
  const totalMonthlyCost = servers.reduce((sum, s) => sum + s.monthlyCost, 0);
  const totalAnnualCost = totalMonthlyCost * 12;
  
  // 按游戏统计
  const gameStats = {};
  servers.forEach(server => {
    if (!gameStats[server.game]) {
      gameStats[server.game] = {
        count: 0,
        monthlyCost: 0,
        running: 0
      };
    }
    gameStats[server.game].count += 1;
    gameStats[server.game].monthlyCost += server.monthlyCost;
    if (server.status === '运行中') {
      gameStats[server.game].running += 1;
    }
  });
  
  res.json({
    success: true,
    data: {
      totalServers,
      runningServers,
      totalMonthlyCost,
      totalAnnualCost,
      gameStats
    }
  });
});

// 获取资金统计
app.get('/api/fund-statistics', (req, res) => {
  const totalBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalAccounts = bankAccounts.length;
  
  // 按银行统计
  const bankStats = {};
  bankAccounts.forEach(account => {
    if (!bankStats[account.bankName]) {
      bankStats[account.bankName] = {
        count: 0,
        balance: 0
      };
    }
    bankStats[account.bankName].count += 1;
    bankStats[account.bankName].balance += account.balance;
  });
  
  // 最近30天资金流水统计
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentFlows = fundFlows.filter(flow => 
    new Date(flow.date) >= thirtyDaysAgo
  );
  
  const totalIncome = recentFlows
    .filter(flow => flow.transactionType === '收入')
    .reduce((sum, flow) => sum + flow.amount, 0);
  
  const totalExpense = recentFlows
    .filter(flow => flow.transactionType === '支出')
    .reduce((sum, flow) => sum + flow.amount, 0);
  
  res.json({
    success: true,
    data: {
      totalBalance,
      totalAccounts,
      bankStats,
      recentFlows: recentFlows.length,
      totalIncome,
      totalExpense,
      netFlow: totalIncome - totalExpense
    }
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
    const importedProjects = data.map((row, index) => {
      const companyRevenue = parseFloat(row['公司收入'] || row['companyRevenue'] || 0);
      const productCost = parseFloat(row['产品成本'] || row['productCost'] || 0);
      const prepaid = parseFloat(row['预付'] || row['prepaid'] || 0);
      const server = parseFloat(row['服务器'] || row['server'] || 0);
      const advertisingFee = parseFloat(row['广告费'] || row['advertisingFee'] || 0);
      
      const costTotal = productCost + prepaid + server + advertisingFee;
      const grossProfit = companyRevenue - costTotal;
      const grossProfitRate = companyRevenue > 0 ? ((grossProfit / companyRevenue) * 100).toFixed(1) : 0;
      
      return {
        id: projects.length + index + 1,
        projectName: row['项目名称'] || row['projectName'] || '未知项目',
        companyRevenue,
        gameRechargeFlow: parseFloat(row['游戏充值流水'] || row['gameRechargeFlow'] || 0),
        abnormalRefund: parseFloat(row['异常退款'] || row['abnormalRefund'] || 0),
        testFee: parseFloat(row['测试费'] || row['testFee'] || 0),
        voucher: parseFloat(row['代金券'] || row['voucher'] || 0),
        channel: parseFloat(row['通道'] || row['channel'] || 0),
        withholdingTaxRate: parseFloat(row['代扣税率'] || row['withholdingTaxRate'] || 0),
        sharing: parseFloat(row['分成'] || row['sharing'] || 0),
        sharingRatio: parseFloat(row['分成比例'] || row['sharingRatio'] || 0),
        productCost,
        prepaid,
        server,
        advertisingFee,
        costTotal: parseFloat(costTotal),
        grossProfit: parseFloat(grossProfit),
        grossProfitRate: parseFloat(grossProfitRate),
        revenue: companyRevenue,
        date: row['日期'] || row['date'] || new Date().toISOString().split('T')[0],
        description: row['描述'] || row['description'] || ''
      };
    });
    
    // 添加到现有数据
    projects.push(...importedProjects);
    
    res.json({
      success: true,
      data: importedProjects,
      message: `成功导入 ${importedProjects.length} 个项目数据`
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
  const totalRevenue = projects.reduce((sum, p) => sum + p.companyRevenue, 0);
  const totalCost = projects.reduce((sum, p) => sum + p.costTotal, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitRate = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
  
  // 按项目统计
  const projectStats = {};
  projects.forEach(project => {
    if (!projectStats[project.projectName]) {
      projectStats[project.projectName] = {
        revenue: 0,
        cost: 0,
        profit: 0,
        count: 0
      };
    }
    projectStats[project.projectName].revenue += project.companyRevenue;
    projectStats[project.projectName].cost += project.costTotal;
    projectStats[project.projectName].profit += project.grossProfit;
    projectStats[project.projectName].count += 1;
  });
  
  // 计算项目利润率
  Object.keys(projectStats).forEach(project => {
    const stats = projectStats[project];
    stats.profitRate = stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : 0;
  });
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      totalCost,
      totalProfit,
      profitRate: parseFloat(profitRate),
      projectStats,
      totalRecords: projects.length
    }
  });
});

// 导出数据为Excel
app.get('/api/export', (req, res) => {
  try {
    const worksheet = xlsx.utils.json_to_sheet(projects.map(p => ({
      '项目名称': p.projectName,
      '公司收入': p.companyRevenue,
      '游戏充值流水': p.gameRechargeFlow,
      '异常退款': p.abnormalRefund,
      '测试费': p.testFee,
      '代金券': p.voucher,
      '通道': p.channel,
      '代扣税率': p.withholdingTaxRate,
      '分成': p.sharing,
      '分成比例': p.sharingRatio,
      '产品成本': p.productCost,
      '预付': p.prepaid,
      '服务器': p.server,
      '广告费': p.advertisingFee,
      '成本合计': p.costTotal,
      '毛利': p.grossProfit,
      '毛利率(%)': p.grossProfitRate,
      '日期': p.date,
      '描述': p.description
    })));
    
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '项目数据');
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=项目数据.xlsx');
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