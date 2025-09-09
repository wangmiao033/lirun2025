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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setResult(result);
      
      if (result.success) {
        setFile(null);
        // 重置文件输入
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('上传失败:', error);
      setResult({
        success: false,
        message: '上传失败，请检查网络连接'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // 创建模板数据
    const templateData = [
      {
        '项目名称': '王者荣耀充值项目',
        '公司收入': 1000000,
        '游戏充值流水': 800000,
        '异常退款': 50000,
        '测试费': 10000,
        '代金券': 20000,
        '通道': 30000,
        '代扣税率': 0.06,
        '分成': 400000,
        '分成比例': 0.5,
        '产品成本': 200000,
        '预付': 50000,
        '服务器': 80000,
        '广告费': 100000,
        '日期': '2024-12-01',
        '描述': '王者荣耀游戏充值流水项目'
      },
      {
        '项目名称': '和平精英推广项目',
        '公司收入': 800000,
        '游戏充值流水': 600000,
        '异常退款': 30000,
        '测试费': 8000,
        '代金券': 15000,
        '通道': 25000,
        '代扣税率': 0.06,
        '分成': 300000,
        '分成比例': 0.5,
        '产品成本': 150000,
        '预付': 40000,
        '服务器': 60000,
        '广告费': 80000,
        '日期': '2024-12-02',
        '描述': '和平精英游戏推广和充值项目'
      }
    ];

    // 创建CSV内容
    const headers = [
      '项目名称', '公司收入', '游戏充值流水', '异常退款', '测试费', '代金券', '通道',
      '代扣税率', '分成', '分成比例', '产品成本', '预付', '服务器', '广告费', '日期', '描述'
    ];
    const csvContent = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
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
        <h1 style={{ margin: 0, color: '#333' }}>数据导入</h1>
        <p style={{ color: '#666', margin: '10px 0 0 0' }}>
          支持Excel文件批量导入项目数据
        </p>
      </div>

      {/* 导入区域 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📤 文件上传</h2>
        
        {/* 拖拽上传区域 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? '#1890ff' : '#d9d9d9'}`,
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: dragOver ? '#f0f8ff' : '#fafafa',
            transition: 'all 0.3s',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
          <p style={{ fontSize: '16px', color: '#666', margin: '0 0 16px 0' }}>
            拖拽Excel文件到此处，或点击选择文件
          </p>
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => document.getElementById('file-input').click()}
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
            选择文件
          </button>
        </div>

        {/* 文件信息 */}
        {file && (
          <div style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>📄</span>
              <div>
                <div style={{ fontWeight: 'bold', color: '#52c41a' }}>{file.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  大小: {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 上传按钮 */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              backgroundColor: file && !uploading ? '#52c41a' : '#d9d9d9',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '6px',
              cursor: file && !uploading ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '16px'
            }}
          >
            {uploading ? '上传中...' : '开始上传'}
          </button>
          
          <button
            onClick={downloadTemplate}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📥 下载模板
          </button>
        </div>
      </div>

      {/* 导入结果 */}
      {result && (
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📊 导入结果</h2>
          
          <div style={{
            backgroundColor: result.success ? '#f6ffed' : '#fff2f0',
            border: `1px solid ${result.success ? '#b7eb8f' : '#ffccc7'}`,
            borderRadius: '6px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '24px' }}>
                {result.success ? '✅' : '❌'}
              </span>
              <div>
                <div style={{
                  fontWeight: 'bold',
                  color: result.success ? '#52c41a' : '#ff4d4f',
                  fontSize: '16px'
                }}>
                  {result.success ? '导入成功' : '导入失败'}
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {result.message}
                </div>
              </div>
            </div>
            
            {result.success && result.data && (
              <div>
                <p style={{ margin: '0 0 12px 0', fontWeight: 'bold' }}>
                  导入的项目数据预览：
                </p>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '8px', border: '1px solid #e9ecef' }}>项目名称</th>
                        <th style={{ padding: '8px', border: '1px solid #e9ecef' }}>公司收入</th>
                        <th style={{ padding: '8px', border: '1px solid #e9ecef' }}>成本合计</th>
                        <th style={{ padding: '8px', border: '1px solid #e9ecef' }}>毛利</th>
                        <th style={{ padding: '8px', border: '1px solid #e9ecef' }}>毛利率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.slice(0, 5).map((item, index) => (
                        <tr key={index}>
                          <td style={{ padding: '8px', border: '1px solid #e9ecef' }}>{item.projectName}</td>
                          <td style={{ padding: '8px', border: '1px solid #e9ecef' }}>{item.companyRevenue}</td>
                          <td style={{ padding: '8px', border: '1px solid #e9ecef' }}>{item.costTotal}</td>
                          <td style={{ padding: '8px', border: '1px solid #e9ecef' }}>{item.grossProfit}</td>
                          <td style={{ padding: '8px', border: '1px solid #e9ecef' }}>{item.grossProfitRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.data.length > 5 && (
                    <p style={{ textAlign: 'center', color: '#666', margin: '8px 0 0 0' }}>
                      还有 {result.data.length - 5} 条记录...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 导入说明 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📋 导入说明</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>支持的文件格式</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>Excel文件（.xlsx, .xls）</li>
            <li>文件大小不超过10MB</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>Excel文件格式要求</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>第一行必须是标题行</li>
            <li>必须包含以下列：项目名称、公司收入、日期</li>
            <li>可选列：游戏充值流水、异常退款、测试费、代金券、通道、代扣税率、分成、分成比例、产品成本、预付、服务器、广告费、描述</li>
            <li>日期格式：YYYY-MM-DD</li>
            <li>所有金额字段必须是数字</li>
            <li>系统会自动计算成本合计、毛利和毛利率</li>
          </ul>
        </div>
        
        <div>
          <h3 style={{ color: '#333', margin: '0 0 12px 0' }}>注意事项</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '20px' }}>
            <li>系统会自动计算成本合计、毛利和毛利率</li>
            <li>重复的项目数据会被覆盖</li>
            <li>建议先下载模板文件，按照模板格式填写数据</li>
            <li>导入前请确保数据格式正确</li>
            <li>项目名称不能为空</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataImport;