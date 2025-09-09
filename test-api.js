const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// 测试API连接
async function testAPI() {
  console.log('开始测试API接口...\n');

  try {
    // 测试获取部门列表
    console.log('1. 测试获取部门列表...');
    const departmentsResponse = await axios.get(`${API_BASE}/departments`);
    console.log(`✅ 成功获取 ${departmentsResponse.data.length} 个部门`);
    console.log('部门列表:', departmentsResponse.data.map(d => d.name).join(', '));

    // 测试获取利润列表
    console.log('\n2. 测试获取利润列表...');
    const profitsResponse = await axios.get(`${API_BASE}/profits`);
    console.log(`✅ 成功获取 ${profitsResponse.data.profits.length} 条利润记录`);

    // 测试获取利润统计
    console.log('\n3. 测试获取利润统计...');
    const statsResponse = await axios.get(`${API_BASE}/profits/stats/summary`);
    const stats = statsResponse.data;
    console.log('✅ 利润统计:');
    console.log(`   总收入: ¥${stats.totalRevenue.toLocaleString()}`);
    console.log(`   总成本: ¥${stats.totalCost.toLocaleString()}`);
    console.log(`   总利润: ¥${stats.totalProfit.toLocaleString()}`);
    console.log(`   平均利润率: ${stats.avgProfitMargin.toFixed(2)}%`);

    // 测试获取部门统计
    console.log('\n4. 测试获取部门统计...');
    const deptStatsResponse = await axios.get(`${API_BASE}/profits/stats/by-department`);
    console.log('✅ 部门利润统计:');
    deptStatsResponse.data.forEach(dept => {
      console.log(`   ${dept._id}: 利润 ¥${dept.totalProfit.toLocaleString()}`);
    });

    // 测试获取趋势数据
    console.log('\n5. 测试获取趋势数据...');
    const trendResponse = await axios.get(`${API_BASE}/profits/stats/trend`);
    console.log(`✅ 成功获取 ${trendResponse.data.length} 个期间的趋势数据`);

    // 测试创建新利润记录
    console.log('\n6. 测试创建新利润记录...');
    const newProfit = {
      department: '测试部',
      project: 'API测试项目',
      period: '2025-03',
      revenue: 100000,
      cost: 80000,
      description: 'API功能测试',
      status: 'draft',
      createdBy: 'test_user',
      lastModifiedBy: 'test_user'
    };
    
    const createResponse = await axios.post(`${API_BASE}/profits`, newProfit);
    console.log('✅ 成功创建新利润记录，ID:', createResponse.data._id);

    // 测试更新利润记录
    console.log('\n7. 测试更新利润记录...');
    const updateData = { ...newProfit, revenue: 120000 };
    const updateResponse = await axios.put(`${API_BASE}/profits/${createResponse.data._id}`, updateData);
    console.log('✅ 成功更新利润记录，新收入:', updateResponse.data.revenue);

    // 测试删除利润记录
    console.log('\n8. 测试删除利润记录...');
    await axios.delete(`${API_BASE}/profits/${createResponse.data._id}`);
    console.log('✅ 成功删除测试利润记录');

    console.log('\n🎉 所有API测试通过！系统运行正常。');

  } catch (error) {
    console.error('❌ API测试失败:', error.response?.data?.message || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 提示: 请确保后端服务正在运行 (npm start)');
    }
  }
}

// 检查服务器是否运行
async function checkServer() {
  try {
    await axios.get(`${API_BASE}/departments`);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('利润管理系统 API 测试工具\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ 无法连接到后端服务器');
    console.log('请确保:');
    console.log('1. MongoDB 服务正在运行');
    console.log('2. 后端服务已启动 (npm start)');
    console.log('3. 服务器运行在 http://localhost:5000');
    return;
  }

  await testAPI();
}

main();
