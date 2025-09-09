import React, { useState } from 'react';

const DataImport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('请选择Excel文件（.xlsx格式）');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('请先选择文件');
      return;
    }

    setUploading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setResult({
          success: true,
          message: `✅ 成功导入 ${result.data.length} 条项目数据`,
          data: result.data
        });
        setFile(null);
      } else {
        setResult({
          success: false,
          message: `❌ 导入失败: ${result.message || '未知错误'}`
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: `❌ 上传失败: ${error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // 创建模板数据
    const templateData = [
      {
        '项目名称': '示例项目',
        '公司收入': 100000,
        '游戏充值流水': 80000,
        '异常退款': 5000,
        '测试费': 2000,
        '代金券': 1000,
        '通道': 3000,
        '代扣税率': 0.06,
        '分成': 40000,
        '分成比例': 0.5,
        '产品成本': 20000,
        '预付': 5000,
        '服务器': 8000,
        '广告费': 10000,
        '日期': '2024-12-10',
        '描述': '示例项目描述'
      }
    ];

    // 创建CSV内容
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    // 下载文件
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '项目数据导入模板.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '2rem' }}>📤 数据导入</h1>
        <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '1rem' }}>
          支持Excel文件批量导入项目数据，提高数据录入效率
        </p>
      </div>

      {/* 导入区域 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? '#1890ff' : '#d9d9d9'}`,
            borderRadius: '8px',
            padding: '40px',
            backgroundColor: dragOver ? '#f0f8ff' : '#fafafa',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {file ? file.name : '点击或拖拽文件到此处'}
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#666' }}>
            支持 .xlsx 格式的Excel文件
          </p>
          
          <input
            id="fileInput"
            type="file"
            accept=".xlsx"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          
          <button
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            选择文件
          </button>
        </div>

        {file && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                backgroundColor: uploading ? '#d9d9d9' : '#52c41a',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              {uploading ? '上传中...' : '开始导入'}
            </button>
            
            <button
              onClick={() => setFile(null)}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #d9d9d9',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              取消
            </button>
          </div>
        )}
      </div>

      {/* 结果显示 */}
      {result && (
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          border: `2px solid ${result.success ? '#52c41a' : '#ff4d4f'}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '20px' }}>
              {result.success ? '✅' : '❌'}
            </div>
            <h3 style={{ margin: 0, color: result.success ? '#52c41a' : '#ff4d4f' }}>
              {result.success ? '导入成功' : '导入失败'}
            </h3>
          </div>
          <p style={{ margin: 0, color: '#666' }}>{result.message}</p>
        </div>
      )}

      {/* 导入说明 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📋 导入说明</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>Excel文件格式要求</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>文件格式：.xlsx（Excel 2007及以上版本）</li>
            <li>第一行必须是列标题</li>
            <li>数据从第二行开始</li>
            <li>必填字段：项目名称、公司收入、日期</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>支持的列名</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '10px',
            color: '#666'
          }}>
            <div>• 项目名称</div>
            <div>• 公司收入</div>
            <div>• 游戏充值流水</div>
            <div>• 异常退款</div>
            <div>• 测试费</div>
            <div>• 代金券</div>
            <div>• 通道</div>
            <div>• 代扣税率</div>
            <div>• 分成</div>
            <div>• 分成比例</div>
            <div>• 产品成本</div>
            <div>• 预付</div>
            <div>• 服务器</div>
            <div>• 广告费</div>
            <div>• 日期</div>
            <div>• 描述</div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>注意事项</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>数值字段请填写数字，不要包含货币符号</li>
            <li>日期格式：YYYY-MM-DD（如：2024-12-10）</li>
            <li>税率和比例请填写小数（如：0.06 表示6%）</li>
            <li>如果某列数据为空，系统会自动设置为0</li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={downloadTemplate}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📥 下载模板文件
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataImport;