const mongoose = require('mongoose');
const Department = require('../models/Department');
const Profit = require('../models/Profit');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/profit_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initData = async () => {
  try {
    console.log('开始初始化数据...');

    // 清空现有数据
    await Department.deleteMany({});
    await Profit.deleteMany({});

    // 创建部门数据
    const departments = [
      {
        name: '销售部',
        code: 'SALES',
        manager: '张三',
        description: '负责产品销售和客户维护',
        budget: 5000000,
        createdBy: 'system'
      },
      {
        name: '技术部',
        code: 'TECH',
        manager: '李四',
        description: '负责产品研发和技术支持',
        budget: 8000000,
        createdBy: 'system'
      },
      {
        name: '市场部',
        code: 'MARKET',
        manager: '王五',
        description: '负责市场推广和品牌建设',
        budget: 3000000,
        createdBy: 'system'
      },
      {
        name: '财务部',
        code: 'FINANCE',
        manager: '赵六',
        description: '负责财务管理和成本控制',
        budget: 2000000,
        createdBy: 'system'
      }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`创建了 ${createdDepartments.length} 个部门`);

    // 创建利润数据
    const profits = [
      // 销售部数据
      {
        department: '销售部',
        project: '企业客户项目A',
        period: '2025-01',
        revenue: 1200000,
        cost: 900000,
        materialCost: 400000,
        laborCost: 300000,
        overheadCost: 150000,
        otherCost: 50000,
        description: '大型企业客户定制项目',
        status: 'confirmed',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      {
        department: '销售部',
        project: '中小企业项目B',
        period: '2025-01',
        revenue: 800000,
        cost: 600000,
        materialCost: 250000,
        laborCost: 200000,
        overheadCost: 100000,
        otherCost: 50000,
        description: '中小企业标准化产品',
        status: 'confirmed',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      {
        department: '销售部',
        project: '在线销售项目C',
        period: '2025-02',
        revenue: 1500000,
        cost: 1100000,
        materialCost: 500000,
        laborCost: 350000,
        overheadCost: 200000,
        otherCost: 50000,
        description: '在线平台销售项目',
        status: 'draft',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },

      // 技术部数据
      {
        department: '技术部',
        project: '产品研发项目D',
        period: '2025-01',
        revenue: 2000000,
        cost: 1600000,
        materialCost: 600000,
        laborCost: 800000,
        overheadCost: 150000,
        otherCost: 50000,
        description: '新产品研发项目',
        status: 'confirmed',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      {
        department: '技术部',
        project: '技术升级项目E',
        period: '2025-01',
        revenue: 1000000,
        cost: 800000,
        materialCost: 300000,
        laborCost: 400000,
        overheadCost: 80000,
        otherCost: 20000,
        description: '现有产品技术升级',
        status: 'confirmed',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      {
        department: '技术部',
        project: '技术支持项目F',
        period: '2025-02',
        revenue: 600000,
        cost: 400000,
        materialCost: 100000,
        laborCost: 250000,
        overheadCost: 40000,
        otherCost: 10000,
        description: '客户技术支持服务',
        status: 'draft',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },

      // 市场部数据
      {
        department: '市场部',
        project: '品牌推广项目G',
        period: '2025-01',
        revenue: 500000,
        cost: 400000,
        materialCost: 200000,
        laborCost: 150000,
        overheadCost: 40000,
        otherCost: 10000,
        description: '品牌宣传和推广活动',
        status: 'confirmed',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },
      {
        department: '市场部',
        project: '市场调研项目H',
        period: '2025-02',
        revenue: 300000,
        cost: 250000,
        materialCost: 100000,
        laborCost: 120000,
        overheadCost: 25000,
        otherCost: 5000,
        description: '市场趋势调研分析',
        status: 'draft',
        createdBy: 'system',
        lastModifiedBy: 'system'
      },

      // 财务部数据
      {
        department: '财务部',
        project: '财务管理系统I',
        period: '2025-01',
        revenue: 400000,
        cost: 300000,
        materialCost: 100000,
        laborCost: 150000,
        overheadCost: 40000,
        otherCost: 10000,
        description: '财务管理系统优化',
        status: 'confirmed',
        createdBy: 'system',
        lastModifiedBy: 'system'
      }
    ];

    const createdProfits = await Profit.insertMany(profits);
    console.log(`创建了 ${createdProfits.length} 条利润记录`);

    console.log('数据初始化完成！');
    console.log('\n示例数据概览:');
    console.log('- 4个部门: 销售部、技术部、市场部、财务部');
    console.log('- 9条利润记录，涵盖2025年1-2月数据');
    console.log('- 包含不同状态: 草稿、已确认');
    console.log('- 涵盖不同项目类型和成本结构');

  } catch (error) {
    console.error('初始化数据失败:', error);
  } finally {
    mongoose.connection.close();
  }
};

initData();
