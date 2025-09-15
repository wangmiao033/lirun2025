/**
 * 部署状态检查脚本
 */

const https = require('https');

function checkDeployment() {
    console.log('🔍 检查部署状态...\n');
    
    const urls = [
        'https://lirun2025.onrender.com',
        'https://lirun2025.onrender.com/dashboard',
        'https://lirun2025.onrender.com/simple.html'
    ];
    
    let completed = 0;
    
    urls.forEach((url, index) => {
        setTimeout(() => {
            checkURL(url);
        }, index * 1000);
    });
    
    function checkURL(url) {
        const req = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`✅ ${url}`);
                console.log(`   状态: ${res.statusCode}`);
                console.log(`   大小: ${data.length} 字符`);
                console.log(`   内容预览: ${data.substring(0, 100)}...`);
                console.log('');
                
                completed++;
                if (completed === urls.length) {
                    console.log('🎉 所有页面检查完成！');
                    console.log('\n📋 如果页面显示正常内容，说明部署成功！');
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ ${url}`);
            console.log(`   错误: ${error.message}`);
            console.log('');
            
            completed++;
            if (completed === urls.length) {
                console.log('⚠️ 部分页面检查失败');
            }
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            console.log(`⏰ ${url} - 请求超时`);
            completed++;
        });
    }
}

// 运行检查
checkDeployment();
