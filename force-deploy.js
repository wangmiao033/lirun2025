/**
 * 强制部署更新脚本
 * 用于触发Render平台重新部署
 */

const fs = require('fs');
const path = require('path');

// 更新package.json中的版本号以触发重新部署
function updateVersion() {
  const packagePath = path.join(__dirname, 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // 增加版本号
  const versionParts = packageData.version.split('.');
  const patchVersion = parseInt(versionParts[2]) + 1;
  packageData.version = `${versionParts[0]}.${versionParts[1]}.${patchVersion}`;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
  console.log(`✅ 版本号已更新为: ${packageData.version}`);
  return packageData.version;
}

// 创建部署标记文件
function createDeployMarker() {
  const markerContent = {
    timestamp: new Date().toISOString(),
    version: require('./package.json').version,
    buildId: Math.random().toString(36).substring(7),
    message: 'Force deploy update'
  };
  
  const markerPath = path.join(__dirname, 'deploy-marker.json');
  fs.writeFileSync(markerPath, JSON.stringify(markerContent, null, 2));
  console.log(`✅ 部署标记文件已创建: deploy-marker.json`);
  console.log(`📋 构建ID: ${markerContent.buildId}`);
}

// 更新构建时间戳
function updateBuildTimestamp() {
  const timestamp = new Date().toISOString();
  const buildInfo = {
    buildTime: timestamp,
    version: require('./package.json').version,
    environment: process.env.NODE_ENV || 'production'
  };
  
  const buildInfoPath = path.join(__dirname, 'client/build/build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  console.log(`✅ 构建信息已更新: ${timestamp}`);
}

// 主函数
function forceDeploy() {
  console.log('🚀 开始强制部署更新...\n');
  
  try {
    const newVersion = updateVersion();
    createDeployMarker();
    updateBuildTimestamp();
    
    console.log('\n📋 部署更新步骤:');
    console.log('1. ✅ 版本号已更新');
    console.log('2. ✅ 部署标记已创建');
    console.log('3. ✅ 构建时间戳已更新');
    console.log('4. 🔄 请提交更改到Git仓库');
    console.log('5. 🌐 Render将自动检测更改并重新部署');
    
    console.log('\n💡 如果Render没有自动部署，请:');
    console.log('   - 检查Render控制台');
    console.log('   - 手动触发重新部署');
    console.log('   - 检查环境变量配置');
    
    console.log(`\n🎯 新版本: ${newVersion}`);
    console.log('✨ 强制部署准备完成！');
    
  } catch (error) {
    console.error('❌ 强制部署失败:', error.message);
  }
}

// 运行
if (require.main === module) {
  forceDeploy();
}

module.exports = { forceDeploy, updateVersion, createDeployMarker };
