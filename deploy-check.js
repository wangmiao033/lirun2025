/**
 * 部署状态检查脚本
 * 用于检查网站部署状态和常见问题
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 检查网站状态
function checkWebsiteStatus(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 1000), // 只取前1000字符
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      reject({
        error: error.message,
        url: url
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        url: url
      });
    });
  });
}

// 检查本地构建文件
function checkBuildFiles() {
  const buildPath = path.join(__dirname, 'client', 'build');
  const indexPath = path.join(buildPath, 'index.html');
  
  const checks = {
    buildDirExists: fs.existsSync(buildPath),
    indexHtmlExists: fs.existsSync(indexPath),
    buildFiles: []
  };
  
  if (checks.buildDirExists) {
    try {
      checks.buildFiles = fs.readdirSync(buildPath);
    } catch (error) {
      checks.buildError = error.message;
    }
  }
  
  return checks;
}

// 检查package.json配置
function checkPackageConfig() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    return {
      version: packageData.version,
      scripts: packageData.scripts,
      dependencies: Object.keys(packageData.dependencies || {}),
      main: packageData.main
    };
  } catch (error) {
    return { error: error.message };
  }
}

// 主检查函数
async function runDeployCheck() {
  console.log('🔍 开始部署状态检查...\n');
  
  // 检查网站状态
  console.log('1. 检查网站状态...');
  try {
    const websiteStatus = await checkWebsiteStatus('https://lirun2025.onrender.com/dashboard');
    console.log(`✅ 网站状态: ${websiteStatus.status}`);
    console.log(`📄 响应类型: ${websiteStatus.headers['content-type'] || '未知'}`);
    console.log(`📊 数据预览: ${websiteStatus.data.substring(0, 200)}...`);
  } catch (error) {
    console.log(`❌ 网站访问失败: ${error.error}`);
    console.log(`🌐 URL: ${error.url}`);
  }
  
  console.log('\n2. 检查本地构建文件...');
  const buildCheck = checkBuildFiles();
  console.log(`📁 构建目录存在: ${buildCheck.buildDirExists ? '✅' : '❌'}`);
  console.log(`📄 index.html存在: ${buildCheck.indexHtmlExists ? '✅' : '❌'}`);
  if (buildCheck.buildFiles.length > 0) {
    console.log(`📋 构建文件: ${buildCheck.buildFiles.join(', ')}`);
  }
  
  console.log('\n3. 检查package.json配置...');
  const packageCheck = checkPackageConfig();
  console.log(`📦 版本: ${packageCheck.version}`);
  console.log(`🚀 主文件: ${packageCheck.main}`);
  console.log(`📜 脚本: ${Object.keys(packageCheck.scripts || {}).join(', ')}`);
  
  console.log('\n4. 建议修复步骤:');
  console.log('   a) 运行 npm run build 重新构建前端');
  console.log('   b) 检查 Render 部署日志');
  console.log('   c) 确认环境变量配置');
  console.log('   d) 检查服务器端口配置');
  
  console.log('\n✨ 检查完成！');
}

// 运行检查
if (require.main === module) {
  runDeployCheck().catch(console.error);
}

module.exports = { runDeployCheck, checkWebsiteStatus, checkBuildFiles, checkPackageConfig };
