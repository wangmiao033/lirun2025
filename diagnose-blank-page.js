const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 开始诊断空白页面问题...\n');

// 1. 检查本地构建文件
function checkLocalBuild() {
  console.log('📁 检查本地构建文件...');
  
  const buildDir = path.join(__dirname, 'client', 'build');
  const indexPath = path.join(buildDir, 'index.html');
  const jsPath = path.join(buildDir, 'assets');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ client/build 目录不存在');
    return false;
  }
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html 不存在');
    return false;
  }
  
  console.log('✅ index.html 存在');
  
  // 检查assets目录
  if (!fs.existsSync(jsPath)) {
    console.log('❌ assets 目录不存在');
    return false;
  }
  
  const assets = fs.readdirSync(jsPath);
  console.log('📦 构建文件:', assets);
  
  return true;
}

// 2. 检查远程文件
function checkRemoteFiles() {
  console.log('\n🌐 检查远程文件...');
  
  const urls = [
    'https://lirun2025.onrender.com/',
    'https://lirun2025.onrender.com/dashboard',
    'https://lirun2025.onrender.com/assets/index-4cca429e.js',
    'https://lirun2025.onrender.com/assets/index-a958f3cb.css'
  ];
  
  return Promise.all(urls.map(url => {
    return new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`✅ ${url} - 状态: ${res.statusCode} - 大小: ${data.length} 字符`);
          if (url.includes('.html')) {
            // 检查HTML内容
            if (data.includes('<div id="root"></div>')) {
              console.log('  ✅ 包含正确的root div');
            } else {
              console.log('  ❌ 缺少root div');
            }
            if (data.includes('index-4cca429e.js')) {
              console.log('  ✅ 包含正确的JS文件引用');
            } else {
              console.log('  ❌ JS文件引用不匹配');
            }
          }
          resolve({ url, status: res.statusCode, size: data.length, content: data });
        });
      }).on('error', (err) => {
        console.log(`❌ ${url} - 错误: ${err.message}`);
        resolve({ url, status: 'error', error: err.message });
      });
    });
  }));
}

// 3. 检查React应用初始化
function checkReactInit() {
  console.log('\n⚛️ 检查React应用初始化...');
  
  const mainJsxPath = path.join(__dirname, 'client', 'src', 'main.jsx');
  const appJsxPath = path.join(__dirname, 'client', 'src', 'App.jsx');
  
  if (!fs.existsSync(mainJsxPath)) {
    console.log('❌ main.jsx 不存在');
    return false;
  }
  
  const mainContent = fs.readFileSync(mainJsxPath, 'utf8');
  if (mainContent.includes('ReactDOM.createRoot')) {
    console.log('✅ main.jsx 包含正确的React初始化代码');
  } else {
    console.log('❌ main.jsx React初始化代码有问题');
  }
  
  if (!fs.existsSync(appJsxPath)) {
    console.log('❌ App.jsx 不存在');
    return false;
  }
  
  const appContent = fs.readFileSync(appJsxPath, 'utf8');
  if (appContent.includes('export default App')) {
    console.log('✅ App.jsx 包含正确的导出');
  } else {
    console.log('❌ App.jsx 导出有问题');
  }
  
  return true;
}

// 4. 检查依赖问题
function checkDependencies() {
  console.log('\n📦 检查依赖...');
  
  const packageJsonPath = path.join(__dirname, 'client', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ client/package.json 不存在');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} 缺失或版本有问题`);
    }
  });
  
  return true;
}

// 5. 检查服务器配置
function checkServerConfig() {
  console.log('\n🖥️ 检查服务器配置...');
  
  const serverPath = path.join(__dirname, 'server-simple.js');
  if (!fs.existsSync(serverPath)) {
    console.log('❌ server-simple.js 不存在');
    return false;
  }
  
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('express.static')) {
    console.log('✅ 服务器配置包含静态文件服务');
  } else {
    console.log('❌ 服务器缺少静态文件配置');
  }
  
  if (serverContent.includes('client/build')) {
    console.log('✅ 服务器指向正确的构建目录');
  } else {
    console.log('❌ 服务器构建目录配置有问题');
  }
  
  return true;
}

// 主诊断函数
async function runDiagnosis() {
  console.log('🚀 利润管理系统空白页面诊断工具\n');
  
  // 1. 检查本地构建
  const localBuildOk = checkLocalBuild();
  
  // 2. 检查React初始化
  const reactOk = checkReactInit();
  
  // 3. 检查依赖
  const depsOk = checkDependencies();
  
  // 4. 检查服务器配置
  const serverOk = checkServerConfig();
  
  // 5. 检查远程文件
  const remoteResults = await checkRemoteFiles();
  
  // 总结
  console.log('\n📋 诊断总结:');
  console.log(`本地构建: ${localBuildOk ? '✅' : '❌'}`);
  console.log(`React初始化: ${reactOk ? '✅' : '❌'}`);
  console.log(`依赖检查: ${depsOk ? '✅' : '❌'}`);
  console.log(`服务器配置: ${serverOk ? '✅' : '❌'}`);
  
  const remoteOk = remoteResults.every(r => r.status === 200);
  console.log(`远程文件: ${remoteOk ? '✅' : '❌'}`);
  
  // 分析可能的问题
  console.log('\n🔍 可能的问题分析:');
  
  if (!localBuildOk) {
    console.log('❌ 本地构建有问题 - 运行 npm run build 重新构建');
  }
  
  if (!reactOk) {
    console.log('❌ React应用初始化有问题 - 检查main.jsx和App.jsx');
  }
  
  if (!depsOk) {
    console.log('❌ 依赖有问题 - 运行 npm install 重新安装');
  }
  
  if (!serverOk) {
    console.log('❌ 服务器配置有问题 - 检查server-simple.js');
  }
  
  if (!remoteOk) {
    console.log('❌ 远程文件有问题 - 检查部署状态');
  }
  
  if (localBuildOk && reactOk && depsOk && serverOk && remoteOk) {
    console.log('✅ 所有检查都通过，问题可能在:');
    console.log('   - JavaScript运行时错误');
    console.log('   - 浏览器缓存问题');
    console.log('   - 网络连接问题');
    console.log('   - 组件内部错误');
  }
  
  console.log('\n💡 建议的解决步骤:');
  console.log('1. 清除浏览器缓存 (Ctrl+Shift+R)');
  console.log('2. 检查浏览器控制台错误');
  console.log('3. 尝试无痕模式访问');
  console.log('4. 重新构建并部署');
}

// 运行诊断
runDiagnosis().catch(console.error);
