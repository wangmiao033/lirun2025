const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    gameId: 1, // 关联王者荣耀
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
    gameId: 2, // 关联和平精英
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
  },
  {
    id: 3,
    gameId: 5, // 关联圣树唤歌
    companyRevenue: 500000,
    gameRechargeFlow: 400000,
    abnormalRefund: 20000,
    testFee: 5000,
    voucher: 10000,
    channel: 15000,
    withholdingTaxRate: 0.06,
    sharing: 100000, // 研发20%
    sharingRatio: 0.2,
    productCost: 80000,
    prepaid: 20000,
    server: 30000,
    advertisingFee: 40000,
    costTotal: 170000,
    grossProfit: 330000,
    grossProfitRate: 66.0,
    revenue: 500000,
    date: '2024-12-03',
    description: '圣树唤歌充值流水项目'
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

// 模拟数据库 - 预付款数据
let prepayments = [
  {
    id: 1,
    prepaymentName: '阿里云服务器预付费',
    vendor: '阿里云',
    amount: 50000,
    paidAmount: 50000,
    remainingAmount: 0,
    prepaymentDate: '2024-01-01',
    expiryDate: '2024-12-31',
    status: '已用完',
    project: '王者荣耀',
    description: '阿里云ECS服务器年度预付费',
    usageRecords: [
      { date: '2024-01-01', amount: 5000, description: '服务器费用' },
      { date: '2024-02-01', amount: 5000, description: '服务器费用' },
      { date: '2024-03-01', amount: 5000, description: '服务器费用' }
    ]
  },
  {
    id: 2,
    prepaymentName: '腾讯云广告预付费',
    vendor: '腾讯云',
    amount: 100000,
    paidAmount: 100000,
    remainingAmount: 30000,
    prepaymentDate: '2024-06-01',
    expiryDate: '2025-05-31',
    status: '使用中',
    project: '和平精英',
    description: '腾讯云广告投放预付费',
    usageRecords: [
      { date: '2024-06-01', amount: 20000, description: '广告投放' },
      { date: '2024-07-01', amount: 25000, description: '广告投放' },
      { date: '2024-08-01', amount: 25000, description: '广告投放' }
    ]
  },
  {
    id: 3,
    prepaymentName: '华为云存储预付费',
    vendor: '华为云',
    amount: 20000,
    paidAmount: 20000,
    remainingAmount: 20000,
    prepaymentDate: '2024-11-01',
    expiryDate: '2025-10-31',
    status: '未使用',
    project: '测试环境',
    description: '华为云对象存储预付费',
    usageRecords: []
  }
];

// 模拟数据库 - 对账数据（按游戏生成月度对账单）
let bills = [
  {
    id: 1,
    gameId: 1, // 关联王者荣耀
    billNumber: 'BILL-2024-001',
    billType: '研发商对账单',
    recipient: '腾讯游戏工作室',
    recipientType: '研发商',
    billingPeriod: '2024-12',
    rechargeAmount: 1000000, // 充值金额
    testFee: 10000, // 测试费
    voucher: 20000, // 代金券
    settlementAmount: 970000, // 结算金额（充值-测试费-代金券）
    channelFee: 50000, // 通道费
    channelFeeRate: 0.05, // 通道费比例
    settlementRate: 0.7, // 分成比例
    finalAmount: 644000, // 最终结算金额
    status: '待发送',
    createDate: '2024-12-01',
    dueDate: '2024-12-31',
    description: '王者荣耀2024年12月对账单'
  },
  {
    id: 2,
    gameId: 2, // 关联和平精英
    billNumber: 'BILL-2024-002',
    billType: '研发商对账单',
    recipient: '腾讯光子工作室群',
    recipientType: '研发商',
    billingPeriod: '2024-12',
    rechargeAmount: 800000,
    testFee: 8000,
    voucher: 15000,
    settlementAmount: 777000,
    channelFee: 40000,
    channelFeeRate: 0.05,
    settlementRate: 0.65,
    finalAmount: 479050,
    status: '已发送',
    createDate: '2024-12-02',
    dueDate: '2024-12-31',
    description: '和平精英2024年12月对账单'
  },
  {
    id: 3,
    gameId: 5, // 关联圣树唤歌
    billNumber: 'BILL-2024-003',
    billType: '研发商对账单',
    recipient: '广州趣炫网络科技有限公司',
    recipientType: '研发商',
    billingPeriod: '2024-12',
    rechargeAmount: 500000,
    testFee: 5000,
    voucher: 10000,
    settlementAmount: 485000,
    channelFee: 0, // 0%通道费
    channelFeeRate: 0,
    settlementRate: 0.2, // 研发20%
    finalAmount: 97000,
    status: '已确认',
    createDate: '2024-12-03',
    dueDate: '2024-12-31',
    description: '圣树唤歌2024年12月对账单'
  },
  {
    id: 4,
    totalAmount: 15000,
    status: '已确认',
    items: [
      { name: '云服务器费用', amount: 10000, description: '测试环境服务器' },
      { name: '存储费用', amount: 3000, description: '数据存储服务' },
      { name: '网络费用', amount: 2000, description: '网络带宽费用' }
    ],
    createDate: '2024-12-05',
    sendDate: '2024-12-06',
    dueDate: '2024-12-20',
    description: '12月份测试环境费用'
  }
];

// 模拟数据库 - 供应商数据
let suppliers = [
  {
    id: 1,
    name: '腾讯游戏',
    type: '研发商',
    contact: '张三',
    phone: '13800138001',
    email: 'zhangsan@tencent.com',
    address: '深圳市南山区科技园',
    description: '腾讯游戏研发团队'
  },
  {
    id: 2,
    name: '华为应用市场',
    type: '渠道商',
    contact: '李四',
    phone: '13800138002',
    email: 'lisi@huawei.com',
    address: '深圳市龙岗区华为基地',
    description: '华为应用市场渠道'
  },
  {
    id: 3,
    name: '小米应用商店',
    type: '渠道商',
    contact: '王五',
    phone: '13800138003',
    email: 'wangwu@xiaomi.com',
    address: '北京市海淀区小米科技园',
    description: '小米应用商店渠道'
  }
];

// 模拟数据库 - 用户数据
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    department: '技术部',
    isActive: true,
    lastLogin: '2024-12-10',
    profile: {
      firstName: '管理员',
      lastName: '系统',
      phone: '13800138000',
      avatar: ''
    },
    permissions: [
      { module: 'projects', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'servers', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'bank', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'prepayments', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'advertising', actions: ['read', 'write', 'delete', 'export'] },
      { module: 'users', actions: ['read', 'write', 'delete'] }
    ]
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@company.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'manager',
    department: '财务部',
    isActive: true,
    lastLogin: '2024-12-09',
    profile: {
      firstName: '财务',
      lastName: '经理',
      phone: '13800138001',
      avatar: ''
    },
    permissions: [
      { module: 'projects', actions: ['read', 'write', 'export'] },
      { module: 'servers', actions: ['read', 'write'] },
      { module: 'bank', actions: ['read', 'write', 'export'] },
      { module: 'prepayments', actions: ['read', 'write', 'export'] },
      { module: 'advertising', actions: ['read', 'write', 'export'] }
    ]
  },
  {
    id: 3,
    username: 'user',
    email: 'user@company.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    department: '运营部',
    isActive: true,
    lastLogin: '2024-12-08',
    profile: {
      firstName: '普通',
      lastName: '用户',
      phone: '13800138002',
      avatar: ''
    },
    permissions: [
      { module: 'projects', actions: ['read', 'write'] },
      { module: 'servers', actions: ['read'] },
      { module: 'bank', actions: ['read'] },
      { module: 'prepayments', actions: ['read'] },
      { module: 'advertising', actions: ['read'] }
    ]
  }
];

// 认证中间件
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问被拒绝，请提供有效的token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token无效或用户已被禁用'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token无效'
    });
  }
};

// 权限检查中间件
const authorize = (module, action) => {
  return (req, res, next) => {
    try {
      const user = users.find(u => u.id === req.user.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户不存在'
        });
      }

      if (user.role === 'admin' || user.permissions.some(p => p.module === module && p.actions.includes(action))) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: '权限不足'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '权限检查失败',
        error: error.message
      });
    }
  };
};

// 模拟数据库 - 游戏产品主数据
let games = [
  {
    id: 1,
    gameName: '王者荣耀',
    gameCode: 'WZRY',
    category: 'MOBA',
    platform: 'Mobile',
    developer: '腾讯游戏',
    publisher: '腾讯游戏',
    releaseDate: '2015-11-26',
    status: 'active',
    description: '5V5英雄公平对战手游，腾讯最受欢迎的游戏之一',
    icon: '🎮',
    tags: ['MOBA', '竞技', '团队合作']
  },
  {
    id: 2,
    gameName: '和平精英',
    gameCode: 'HPJY',
    category: 'Battle Royale',
    platform: 'Mobile',
    developer: '腾讯光子工作室群',
    publisher: '腾讯游戏',
    releaseDate: '2019-05-08',
    status: 'active',
    description: '腾讯光子工作室群自研反恐军事竞赛体验手游',
    icon: '🔫',
    tags: ['大逃杀', '射击', '竞技']
  },
  {
    id: 3,
    gameName: '原神',
    gameCode: 'YS',
    category: 'RPG',
    platform: 'Multi-Platform',
    developer: '米哈游',
    publisher: '米哈游',
    releaseDate: '2020-09-28',
    status: 'active',
    description: '米哈游开发的开放世界冒险RPG游戏',
    icon: '⚔️',
    tags: ['开放世界', 'RPG', '冒险']
  },
  {
    id: 4,
    gameName: '英雄联盟手游',
    gameCode: 'LOLM',
    category: 'MOBA',
    platform: 'Mobile',
    developer: 'Riot Games',
    publisher: '腾讯游戏',
    releaseDate: '2021-10-08',
    status: 'active',
    description: '英雄联盟正版手游，经典MOBA体验',
    icon: '🏆',
    tags: ['MOBA', '竞技', '策略']
  },
  {
    id: 5,
    gameName: '圣树唤歌',
    gameCode: 'SSHG',
    category: 'RPG',
    platform: 'Mobile',
    developer: '广州趣炫网络科技有限公司',
    publisher: '广州趣炫网络科技有限公司',
    releaseDate: '2024-01-01',
    status: 'active',
    description: '奇幻冒险RPG手游，探索神秘圣树世界',
    icon: '🌳',
    tags: ['RPG', '冒险', '奇幻']
  }
];

// 模拟数据库 - 游戏研发项目数据（关联游戏产品）
let researchProjects = [
  {
    id: 1,
    gameId: 1, // 关联王者荣耀
    prepayment: 1000000,
    status: 'active',
    revenueShare: 70,
    channelFee: 50000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: '王者荣耀研发项目'
  },
  {
    id: 2,
    gameId: 2, // 关联和平精英
    prepayment: 800000,
    status: 'active',
    revenueShare: 65,
    channelFee: 40000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: '和平精英研发项目'
  },
  {
    id: 3,
    gameId: 3, // 关联原神
    prepayment: 2000000,
    status: 'completed',
    revenueShare: 80,
    channelFee: 100000,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    description: '原神研发项目'
  },
  {
    id: 4,
    gameId: 5, // 关联圣树唤歌
    prepayment: 0,
    status: 'active',
    revenueShare: 20, // 研发20%
    channelFee: 0, // 0%/5% 通道费
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    description: '圣树唤歌研发项目 - 研发商：广州趣炫网络科技有限公司，发行公司分成80%'
  }
];

// 模拟数据库 - 渠道数据
let channels = [
  {
    id: 1,
    name: '华为应用市场',
    type: 'huawei',
    manager: '李四',
    contact: '李四',
    phone: '13800138002',
    email: 'lisi@huawei.com',
    status: 'active',
    description: '华为应用市场渠道'
  },
  {
    id: 2,
    name: '小米应用商店',
    type: 'xiaomi',
    manager: '王五',
    contact: '王五',
    phone: '13800138003',
    email: 'wangwu@xiaomi.com',
    status: 'active',
    description: '小米应用商店渠道'
  },
  {
    id: 3,
    name: 'OPPO软件商店',
    type: 'oppo',
    manager: '赵六',
    contact: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@oppo.com',
    status: 'testing',
    description: 'OPPO软件商店渠道'
  }
];

// 模拟数据库 - 广告费数据
let advertisingFees = [
  {
    id: 1,
    gameId: 1, // 关联王者荣耀
    campaignName: '王者荣耀春节推广',
    platform: '腾讯广告',
    adType: '信息流广告',
    targetAudience: '18-35岁游戏用户',
    budget: 50000,
    spent: 45000,
    remaining: 5000,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    status: '进行中',
    impressions: 1000000,
    clicks: 50000,
    conversions: 5000,
    ctr: 5.0,
    cpc: 0.9,
    cpa: 9.0,
    description: '春节期间的王者荣耀推广活动'
  },
  {
    id: 2,
    gameId: 2, // 关联和平精英
    campaignName: '和平精英夏日活动',
    platform: '字节跳动',
    adType: '视频广告',
    targetAudience: '16-30岁手游用户',
    budget: 80000,
    spent: 60000,
    remaining: 20000,
    startDate: '2024-07-01',
    endDate: '2024-08-31',
    status: '进行中',
    impressions: 2000000,
    clicks: 80000,
    conversions: 8000,
    ctr: 4.0,
    cpc: 0.75,
    cpa: 7.5,
    description: '夏日主题的和平精英推广活动'
  },
  {
    id: 3,
    gameId: 5, // 关联圣树唤歌
    campaignName: '圣树唤歌奇幻冒险',
    platform: 'B站推广',
    adType: 'UP主合作',
    targetAudience: 'RPG游戏爱好者',
    budget: 30000,
    spent: 30000,
    remaining: 0,
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    status: '已完成',
    impressions: 500000,
    clicks: 25000,
    conversions: 2500,
    ctr: 5.0,
    cpc: 1.2,
    cpa: 12.0,
    description: '圣树唤歌奇幻RPG游戏推广'
  }
];

// 认证相关API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 检查用户是否激活
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 更新最后登录时间
    user.lastLogin = new Date().toISOString().split('T')[0];

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          profile: user.profile,
          permissions: user.permissions
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
});

// 获取当前用户信息
app.get('/api/auth/me', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        profile: user.profile,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

// 获取所有用户（管理员）
app.get('/api/users', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    const userList = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      department: u.department,
      isActive: u.isActive,
      lastLogin: u.lastLogin,
      profile: u.profile,
      permissions: u.permissions
    }));

    res.json({
      success: true,
      data: userList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

// 游戏产品管理API
app.get('/api/games', (req, res) => {
  res.json({
    success: true,
    data: games,
    total: games.length
  });
});

app.get('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const game = games.find(g => g.id === id);
  
  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏不存在'
    });
  }
  
  res.json({
    success: true,
    data: game
  });
});

app.post('/api/games', (req, res) => {
  const { gameName, gameCode, category, platform, developer, publisher, releaseDate, status, description, icon, tags } = req.body;
  
  if (!gameName || !gameCode || !category) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newGame = {
    id: games.length + 1,
    gameName,
    gameCode,
    category,
    platform: platform || 'Mobile',
    developer: developer || '',
    publisher: publisher || '',
    releaseDate: releaseDate || '',
    status: status || 'active',
    description: description || '',
    icon: icon || '🎮',
    tags: tags || []
  };
  
  games.push(newGame);
  
  res.json({
    success: true,
    data: newGame,
    message: '游戏产品创建成功'
  });
});

app.put('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const gameIndex = games.findIndex(g => g.id === id);
  
  if (gameIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '游戏不存在'
    });
  }
  
  games[gameIndex] = {
    ...games[gameIndex],
    ...req.body
  };
  
  res.json({
    success: true,
    data: games[gameIndex],
    message: '游戏产品更新成功'
  });
});

app.delete('/api/games/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const gameIndex = games.findIndex(g => g.id === id);
  
  if (gameIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '游戏不存在'
    });
  }
  
  games.splice(gameIndex, 1);
  
  res.json({
    success: true,
    message: '游戏产品删除成功'
  });
});

// 获取所有项目数据
app.get('/api/projects', (req, res) => {
  // 返回关联游戏信息的项目
  const projectsWithGames = projects.map(project => {
    const game = games.find(g => g.id === project.gameId);
    return {
      ...project,
      game: game || null
    };
  });
  
  res.json({
    success: true,
    data: projectsWithGames,
    total: projectsWithGames.length
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
    gameId, companyRevenue, gameRechargeFlow, abnormalRefund, testFee,
    voucher, channel, withholdingTaxRate, sharing, sharingRatio,
    productCost, prepaid, server, advertisingFee, date, description
  } = req.body;
  
  if (!gameId || !companyRevenue || !date) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  // 检查游戏是否存在
  const game = games.find(g => g.id === parseInt(gameId));
  if (!game) {
    return res.status(400).json({
      success: false,
      message: '选择的游戏不存在'
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
    gameId: parseInt(gameId),
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
  // 返回关联游戏信息的服务器
  const serversWithGames = servers.map(server => {
    const game = games.find(g => g.id === server.gameId);
    return {
      ...server,
      game: game || null
    };
  });
  
  res.json({
    success: true,
    data: serversWithGames,
    total: serversWithGames.length
  });
});

app.post('/api/servers', (req, res) => {
  const {
    gameId, serverName, instanceId, region, instanceType, cpu, memory,
    disk, bandwidth, monthlyCost, status, startDate, endDate, description
  } = req.body;
  
  if (!gameId || !serverName || !instanceId || !monthlyCost) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  // 检查游戏是否存在
  const game = games.find(g => g.id === parseInt(gameId));
  if (!game) {
    return res.status(400).json({
      success: false,
      message: '选择的游戏不存在'
    });
  }
  
  const newServer = {
    id: servers.length + 1,
    gameId: parseInt(gameId),
    serverName,
    instanceId,
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

// 预付款管理API
app.get('/api/prepayments', (req, res) => {
  res.json({
    success: true,
    data: prepayments,
    total: prepayments.length
  });
});

app.post('/api/prepayments', (req, res) => {
  const {
    prepaymentName, vendor, amount, prepaymentDate, expiryDate, project, description
  } = req.body;
  
  if (!prepaymentName || !vendor || !amount) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newPrepayment = {
    id: prepayments.length + 1,
    prepaymentName,
    vendor,
    amount: parseFloat(amount),
    paidAmount: parseFloat(amount),
    remainingAmount: parseFloat(amount),
    prepaymentDate: prepaymentDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || '',
    status: '未使用',
    project: project || '',
    description: description || '',
    usageRecords: []
  };
  
  prepayments.push(newPrepayment);
  
  res.json({
    success: true,
    data: newPrepayment,
    message: '预付款创建成功'
  });
});

app.put('/api/prepayments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const prepaymentIndex = prepayments.findIndex(p => p.id === id);
  
  if (prepaymentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '预付款不存在'
    });
  }
  
  prepayments[prepaymentIndex] = {
    ...prepayments[prepaymentIndex],
    ...req.body,
    amount: parseFloat(req.body.amount) || prepayments[prepaymentIndex].amount
  };
  
  res.json({
    success: true,
    data: prepayments[prepaymentIndex],
    message: '预付款更新成功'
  });
});

app.delete('/api/prepayments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const prepaymentIndex = prepayments.findIndex(p => p.id === id);
  
  if (prepaymentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '预付款不存在'
    });
  }
  
  prepayments.splice(prepaymentIndex, 1);
  
  res.json({
    success: true,
    message: '预付款删除成功'
  });
});

// 供应商管理API
app.get('/api/suppliers', (req, res) => {
  res.json({
    success: true,
    data: suppliers,
    total: suppliers.length
  });
});

app.post('/api/suppliers', (req, res) => {
  const { name, type, contact, phone, email, address, description } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newSupplier = {
    id: suppliers.length + 1,
    name,
    type,
    contact: contact || '',
    phone: phone || '',
    email: email || '',
    address: address || '',
    description: description || ''
  };
  
  suppliers.push(newSupplier);
  
  res.json({
    success: true,
    data: newSupplier,
    message: '供应商创建成功'
  });
});

app.put('/api/suppliers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const supplierIndex = suppliers.findIndex(s => s.id === id);
  
  if (supplierIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '供应商不存在'
    });
  }
  
  suppliers[supplierIndex] = {
    ...suppliers[supplierIndex],
    ...req.body
  };
  
  res.json({
    success: true,
    data: suppliers[supplierIndex],
    message: '供应商更新成功'
  });
});

app.delete('/api/suppliers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const supplierIndex = suppliers.findIndex(s => s.id === id);
  
  if (supplierIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '供应商不存在'
    });
  }
  
  suppliers.splice(supplierIndex, 1);
  
  res.json({
    success: true,
    message: '供应商删除成功'
  });
});

// 研发项目管理API
app.get('/api/research-projects', (req, res) => {
  // 返回关联游戏信息的研发项目
  const projectsWithGames = researchProjects.map(project => {
    const game = games.find(g => g.id === project.gameId);
    return {
      ...project,
      game: game || null
    };
  });
  
  res.json({
    success: true,
    data: projectsWithGames,
    total: projectsWithGames.length
  });
});

app.post('/api/research-projects', (req, res) => {
  const { gameId, prepayment, status, revenueShare, channelFee, startDate, endDate, description } = req.body;
  
  if (!gameId || !status) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  // 检查游戏是否存在
  const game = games.find(g => g.id === parseInt(gameId));
  if (!game) {
    return res.status(400).json({
      success: false,
      message: '选择的游戏不存在'
    });
  }
  
  // 检查是否已经存在该游戏的研发项目
  const existingProject = researchProjects.find(p => p.gameId === parseInt(gameId));
  if (existingProject) {
    return res.status(400).json({
      success: false,
      message: '该游戏已存在研发项目'
    });
  }
  
  const newProject = {
    id: researchProjects.length + 1,
    gameId: parseInt(gameId),
    prepayment: prepayment ? parseFloat(prepayment) : 0,
    status,
    revenueShare: revenueShare ? parseFloat(revenueShare) : 0,
    channelFee: channelFee ? parseFloat(channelFee) : 0,
    startDate: startDate || '',
    endDate: endDate || '',
    description: description || ''
  };
  
  researchProjects.push(newProject);
  
  // 返回包含游戏信息的数据
  const projectWithGame = {
    ...newProject,
    game: game
  };
  
  res.json({
    success: true,
    data: projectWithGame,
    message: '研发项目创建成功'
  });
});

app.put('/api/research-projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const projectIndex = researchProjects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '研发项目不存在'
    });
  }
  
  researchProjects[projectIndex] = {
    ...researchProjects[projectIndex],
    ...req.body,
    prepayment: req.body.prepayment ? parseFloat(req.body.prepayment) : researchProjects[projectIndex].prepayment,
    revenueShare: req.body.revenueShare ? parseFloat(req.body.revenueShare) : researchProjects[projectIndex].revenueShare,
    channelFee: req.body.channelFee ? parseFloat(req.body.channelFee) : researchProjects[projectIndex].channelFee
  };
  
  res.json({
    success: true,
    data: researchProjects[projectIndex],
    message: '研发项目更新成功'
  });
});

app.delete('/api/research-projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const projectIndex = researchProjects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '研发项目不存在'
    });
  }
  
  researchProjects.splice(projectIndex, 1);
  
  res.json({
    success: true,
    message: '研发项目删除成功'
  });
});

// 渠道管理API
app.get('/api/channels', (req, res) => {
  res.json({
    success: true,
    data: channels,
    total: channels.length
  });
});

app.post('/api/channels', (req, res) => {
  const { name, type, manager, contact, phone, email, status, description } = req.body;
  
  if (!name || !type || !manager || !status) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const newChannel = {
    id: channels.length + 1,
    name,
    type,
    manager,
    contact: contact || '',
    phone: phone || '',
    email: email || '',
    status,
    description: description || ''
  };
  
  channels.push(newChannel);
  
  res.json({
    success: true,
    data: newChannel,
    message: '渠道创建成功'
  });
});

app.put('/api/channels/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const channelIndex = channels.findIndex(c => c.id === id);
  
  if (channelIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '渠道不存在'
    });
  }
  
  channels[channelIndex] = {
    ...channels[channelIndex],
    ...req.body
  };
  
  res.json({
    success: true,
    data: channels[channelIndex],
    message: '渠道更新成功'
  });
});

app.delete('/api/channels/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const channelIndex = channels.findIndex(c => c.id === id);
  
  if (channelIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '渠道不存在'
    });
  }
  
  channels.splice(channelIndex, 1);
  
  res.json({
    success: true,
    message: '渠道删除成功'
  });
});

// 广告费管理API
app.get('/api/advertising-fees', (req, res) => {
  // 返回关联游戏信息的广告费
  const advertisingFeesWithGames = advertisingFees.map(ad => {
    const game = games.find(g => g.id === ad.gameId);
    return {
      ...ad,
      game: game || null
    };
  });
  
  res.json({
    success: true,
    data: advertisingFeesWithGames,
    total: advertisingFeesWithGames.length
  });
});

app.post('/api/advertising-fees', (req, res) => {
  const {
    gameId, campaignName, platform, adType, targetAudience, budget, startDate, endDate, description
  } = req.body;
  
  if (!gameId || !campaignName || !platform || !budget) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  // 检查游戏是否存在
  const game = games.find(g => g.id === parseInt(gameId));
  if (!game) {
    return res.status(400).json({
      success: false,
      message: '选择的游戏不存在'
    });
  }
  
  const newAdvertisingFee = {
    id: advertisingFees.length + 1,
    gameId: parseInt(gameId),
    campaignName,
    platform,
    adType: adType || '',
    targetAudience: targetAudience || '',
    budget: parseFloat(budget),
    spent: 0,
    remaining: parseFloat(budget),
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '',
    status: '未开始',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    cpa: 0,
    description: description || ''
  };
  
  advertisingFees.push(newAdvertisingFee);
  
  res.json({
    success: true,
    data: newAdvertisingFee,
    message: '广告活动创建成功'
  });
});

app.put('/api/advertising-fees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const advertisingIndex = advertisingFees.findIndex(a => a.id === id);
  
  if (advertisingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '广告活动不存在'
    });
  }
  
  const updatedData = {
    ...advertisingFees[advertisingIndex],
    ...req.body,
    budget: parseFloat(req.body.budget) || advertisingFees[advertisingIndex].budget
  };
  
  // 重新计算剩余金额
  updatedData.remaining = updatedData.budget - updatedData.spent;
  
  advertisingFees[advertisingIndex] = updatedData;
  
  res.json({
    success: true,
    data: advertisingFees[advertisingIndex],
    message: '广告活动更新成功'
  });
});

app.delete('/api/advertising-fees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const advertisingIndex = advertisingFees.findIndex(a => a.id === id);
  
  if (advertisingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '广告活动不存在'
    });
  }
  
  advertisingFees.splice(advertisingIndex, 1);
  
  res.json({
    success: true,
    message: '广告活动删除成功'
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
    const gameName = server.game?.gameName || '未知游戏';
    if (!gameStats[gameName]) {
      gameStats[gameName] = {
        count: 0,
        monthlyCost: 0,
        running: 0
      };
    }
    gameStats[gameName].count += 1;
    gameStats[gameName].monthlyCost += server.monthlyCost;
    if (server.status === '运行中') {
      gameStats[gameName].running += 1;
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

// 获取预付款统计
app.get('/api/prepayment-statistics', (req, res) => {
  const totalPrepayments = prepayments.length;
  const totalAmount = prepayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = prepayments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalRemaining = prepayments.reduce((sum, p) => sum + p.remainingAmount, 0);
  
  // 按供应商统计
  const vendorStats = {};
  prepayments.forEach(prepayment => {
    if (!vendorStats[prepayment.vendor]) {
      vendorStats[prepayment.vendor] = {
        count: 0,
        totalAmount: 0,
        remainingAmount: 0
      };
    }
    vendorStats[prepayment.vendor].count += 1;
    vendorStats[prepayment.vendor].totalAmount += prepayment.amount;
    vendorStats[prepayment.vendor].remainingAmount += prepayment.remainingAmount;
  });
  
  // 按状态统计
  const statusStats = {
    '未使用': prepayments.filter(p => p.status === '未使用').length,
    '使用中': prepayments.filter(p => p.status === '使用中').length,
    '已用完': prepayments.filter(p => p.status === '已用完').length
  };
  
  res.json({
    success: true,
    data: {
      totalPrepayments,
      totalAmount,
      totalPaid,
      totalRemaining,
      vendorStats,
      statusStats
    }
  });
});

// 账单管理API
app.get('/api/bills', (req, res) => {
  res.json({
    success: true,
    data: bills,
    total: bills.length
  });
});

app.post('/api/bills', (req, res) => {
  const {
    billType, recipient, recipientType, project, period, items, dueDate, description
  } = req.body;
  
  if (!billType || !recipient || !project || !period || !items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }
  
  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const billNumber = `BILL-${new Date().getFullYear()}-${String(bills.length + 1).padStart(3, '0')}`;
  
  const newBill = {
    id: bills.length + 1,
    billNumber,
    billType,
    recipient,
    recipientType: recipientType || '供应商',
    project,
    period,
    totalAmount,
    status: '待发送',
    items: items.map(item => ({
      name: item.name || '',
      amount: parseFloat(item.amount) || 0,
      description: item.description || ''
    })),
    createDate: new Date().toISOString().split('T')[0],
    sendDate: '',
    dueDate: dueDate || '',
    description: description || ''
  };
  
  bills.push(newBill);
  
  res.json({
    success: true,
    data: newBill,
    message: '账单创建成功'
  });
});

app.put('/api/bills/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const billIndex = bills.findIndex(b => b.id === id);
  
  if (billIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '账单不存在'
    });
  }
  
  const { status, sendDate } = req.body;
  
  if (status) {
    bills[billIndex].status = status;
  }
  
  if (sendDate) {
    bills[billIndex].sendDate = sendDate;
  }
  
  res.json({
    success: true,
    data: bills[billIndex],
    message: '账单更新成功'
  });
});

app.delete('/api/bills/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const billIndex = bills.findIndex(b => b.id === id);
  
  if (billIndex === -1) {
    return res.status(404).json({
      success: false,
      message: '账单不存在'
    });
  }
  
  bills.splice(billIndex, 1);
  
  res.json({
    success: true,
    message: '账单删除成功'
  });
});

// 获取账单统计
app.get('/api/bill-statistics', (req, res) => {
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  
  const statusStats = {
    '待发送': bills.filter(b => b.status === '待发送').length,
    '已发送': bills.filter(b => b.status === '已发送').length,
    '已确认': bills.filter(b => b.status === '已确认').length,
    '已付款': bills.filter(b => b.status === '已付款').length
  };
  
  const typeStats = {
    '供应商账单': bills.filter(b => b.billType === '供应商账单').length,
    '研发商账单': bills.filter(b => b.billType === '研发商账单').length
  };
  
  const recipientStats = {};
  bills.forEach(bill => {
    if (!recipientStats[bill.recipient]) {
      recipientStats[bill.recipient] = {
        count: 0,
        totalAmount: 0
      };
    }
    recipientStats[bill.recipient].count += 1;
    recipientStats[bill.recipient].totalAmount += bill.totalAmount;
  });
  
  res.json({
    success: true,
    data: {
      totalBills,
      totalAmount,
      statusStats,
      typeStats,
      recipientStats
    }
  });
});

// 获取广告费统计
app.get('/api/advertising-statistics', (req, res) => {
  const totalCampaigns = advertisingFees.length;
  const totalBudget = advertisingFees.reduce((sum, a) => sum + a.budget, 0);
  const totalSpent = advertisingFees.reduce((sum, a) => sum + a.spent, 0);
  const totalRemaining = advertisingFees.reduce((sum, a) => sum + a.remaining, 0);
  
  // 按平台统计
  const platformStats = {};
  advertisingFees.forEach(ad => {
    if (!platformStats[ad.platform]) {
      platformStats[ad.platform] = {
        count: 0,
        budget: 0,
        spent: 0
      };
    }
    platformStats[ad.platform].count += 1;
    platformStats[ad.platform].budget += ad.budget;
    platformStats[ad.platform].spent += ad.spent;
  });
  
  // 按游戏统计
  const gameStats = {};
  advertisingFees.forEach(ad => {
    const gameName = ad.game?.gameName || '未知游戏';
    if (!gameStats[gameName]) {
      gameStats[gameName] = {
        count: 0,
        budget: 0,
        spent: 0
      };
    }
    gameStats[gameName].count += 1;
    gameStats[gameName].budget += ad.budget;
    gameStats[gameName].spent += ad.spent;
  });
  
  // 按状态统计
  const statusStats = {
    '未开始': advertisingFees.filter(a => a.status === '未开始').length,
    '进行中': advertisingFees.filter(a => a.status === '进行中').length,
    '已完成': advertisingFees.filter(a => a.status === '已完成').length
  };
  
  // 总体效果统计
  const totalImpressions = advertisingFees.reduce((sum, a) => sum + a.impressions, 0);
  const totalClicks = advertisingFees.reduce((sum, a) => sum + a.clicks, 0);
  const totalConversions = advertisingFees.reduce((sum, a) => sum + a.conversions, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
  const avgCpc = totalClicks > 0 ? (totalSpent / totalClicks).toFixed(2) : 0;
  const avgCpa = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : 0;
  
  res.json({
    success: true,
    data: {
      totalCampaigns,
      totalBudget,
      totalSpent,
      totalRemaining,
      platformStats,
      gameStats,
      statusStats,
      totalImpressions,
      totalClicks,
      totalConversions,
      avgCtr: parseFloat(avgCtr),
      avgCpc: parseFloat(avgCpc),
      avgCpa: parseFloat(avgCpa)
    }
  });
});

// 导出广告费数据
app.get('/api/advertising-fees/export', (req, res) => {
  try {
    const XLSX = require('xlsx');
    
    // 准备导出数据
    const exportData = advertisingFees.map(ad => ({
      '活动名称': ad.campaignName,
      '平台': ad.platform,
      '广告类型': ad.adType,
      '目标受众': ad.targetAudience,
      '预算': ad.budget,
      '已花费': ad.spent,
      '剩余预算': ad.remaining,
      '开始日期': ad.startDate,
      '结束日期': ad.endDate,
      '状态': ad.status,
      '项目': ad.project,
      '曝光量': ad.impressions,
      '点击量': ad.clicks,
      '转化量': ad.conversions,
      'CTR(%)': ad.ctr,
      'CPC(元)': ad.cpc,
      'CPA(元)': ad.cpa,
      '描述': ad.description
    }));
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // 设置列宽
    const colWidths = [
      { wch: 20 }, // 活动名称
      { wch: 12 }, // 平台
      { wch: 12 }, // 广告类型
      { wch: 15 }, // 目标受众
      { wch: 10 }, // 预算
      { wch: 10 }, // 已花费
      { wch: 10 }, // 剩余预算
      { wch: 12 }, // 开始日期
      { wch: 12 }, // 结束日期
      { wch: 8 },  // 状态
      { wch: 12 }, // 项目
      { wch: 12 }, // 曝光量
      { wch: 10 }, // 点击量
      { wch: 10 }, // 转化量
      { wch: 8 },  // CTR
      { wch: 8 },  // CPC
      { wch: 8 },  // CPA
      { wch: 30 }  // 描述
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, '广告费数据');
    
    // 生成Excel文件
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="广告费数据_${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.send(excelBuffer);
    
  } catch (error) {
    console.error('导出广告费数据失败:', error);
    res.status(500).json({
      success: false,
      message: '导出失败'
    });
  }
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
  
  // 按游戏统计
  const projectStats = {};
  projects.forEach(project => {
    const gameName = project.game?.gameName || '未知游戏';
    if (!projectStats[gameName]) {
      projectStats[gameName] = {
        revenue: 0,
        cost: 0,
        profit: 0,
        count: 0
      };
    }
    projectStats[gameName].revenue += project.companyRevenue;
    projectStats[gameName].cost += project.costTotal;
    projectStats[gameName].profit += project.grossProfit;
    projectStats[gameName].count += 1;
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
    console.log('开始导出数据，项目数量:', projects.length);
    console.log('xlsx模块状态:', typeof xlsx);
    
    if (!projects || projects.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有数据可导出'
      });
    }
    
    const exportData = projects.map(p => ({
      '项目名称': p.projectName || '',
      '公司收入': p.companyRevenue || 0,
      '游戏充值流水': p.gameRechargeFlow || 0,
      '异常退款': p.abnormalRefund || 0,
      '测试费': p.testFee || 0,
      '代金券': p.voucher || 0,
      '通道': p.channel || 0,
      '代扣税率': p.withholdingTaxRate || 0,
      '分成': p.sharing || 0,
      '分成比例': p.sharingRatio || 0,
      '产品成本': p.productCost || 0,
      '预付': p.prepaid || 0,
      '服务器': p.server || 0,
      '广告费': p.advertisingFee || 0,
      '成本合计': p.costTotal || 0,
      '毛利': p.grossProfit || 0,
      '毛利率(%)': p.grossProfitRate || 0,
      '日期': p.date || '',
      '描述': p.description || ''
    }));
    
    console.log('准备导出数据:', exportData.length, '条记录');
    
    // 尝试使用xlsx模块导出Excel
    if (xlsx && xlsx.utils) {
      try {
        console.log('使用xlsx模块导出Excel');
        
        // 创建Excel工作表
        const worksheet = xlsx.utils.json_to_sheet(exportData);
        console.log('工作表创建成功');
        
        // 创建工作簿
        const workbook = xlsx.utils.book_new();
        console.log('工作簿创建成功');
        
        // 添加工作表到工作簿
        xlsx.utils.book_append_sheet(workbook, worksheet, '项目数据');
        console.log('工作表添加到工作簿成功');
        
        // 生成Excel文件缓冲区
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        console.log('Excel文件生成成功，大小:', buffer.length, 'bytes');
        
        // 设置响应头
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=项目数据.xlsx');
        res.setHeader('Content-Length', buffer.length);
        
        // 发送文件
        res.send(buffer);
        console.log('Excel文件发送完成');
        return;
        
      } catch (xlsxError) {
        console.error('xlsx导出失败，尝试CSV导出:', xlsxError);
        // 如果xlsx失败，继续使用CSV导出
      }
    }
    
    // 备用方案：导出CSV格式
    console.log('使用CSV格式导出');
    
    // 获取所有字段名
    const headers = Object.keys(exportData[0] || {});
    
    // 创建CSV内容
    let csvContent = '\uFEFF'; // BOM for UTF-8
    csvContent += headers.join(',') + '\n';
    
    exportData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // 处理包含逗号或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });
    
    console.log('CSV文件生成成功，大小:', csvContent.length, 'bytes');
    
    // 设置响应头
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=项目数据.csv');
    res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
    
    // 发送文件
    res.send(csvContent);
    console.log('CSV文件发送完成');
    
  } catch (error) {
    console.error('导出失败详细错误:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({
      success: false,
      message: '导出失败: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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