const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();
const Profit = require('../models/Profit');

// 配置文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('只支持Excel文件格式'), false);
    }
  }
});

// 上传并解析Excel文件
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的文件' });
    }

    // 解析Excel文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'Excel文件为空或格式不正确' });
    }

    // 验证数据格式
    const requiredFields = ['department', 'project', 'period', 'revenue', 'cost'];
    const missingFields = requiredFields.filter(field => 
      !data[0].hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Excel文件缺少必要字段: ${missingFields.join(', ')}` 
      });
    }

    // 转换数据格式
    const profits = data.map(row => ({
      department: String(row.department || '').trim(),
      project: String(row.project || '').trim(),
      period: String(row.period || '').trim(),
      revenue: parseFloat(row.revenue) || 0,
      cost: parseFloat(row.cost) || 0,
      materialCost: parseFloat(row.materialCost) || 0,
      laborCost: parseFloat(row.laborCost) || 0,
      overheadCost: parseFloat(row.overheadCost) || 0,
      otherCost: parseFloat(row.otherCost) || 0,
      description: String(row.description || '').trim(),
      status: 'draft',
      createdBy: req.body.createdBy || 'system',
      lastModifiedBy: req.body.createdBy || 'system'
    }));

    // 批量插入数据
    const result = await Profit.insertMany(profits);
    
    res.json({
      message: `成功导入 ${result.length} 条利润记录`,
      count: result.length,
      data: result
    });

  } catch (error) {
    console.error('Excel导入错误:', error);
    res.status(500).json({ 
      message: '文件导入失败: ' + error.message 
    });
  }
});

// 导出Excel模板
router.get('/template', (req, res) => {
  try {
    // 创建模板数据
    const templateData = [
      {
        department: '销售部',
        project: '示例项目A',
        period: '2025-01',
        revenue: 100000,
        cost: 80000,
        materialCost: 40000,
        laborCost: 25000,
        overheadCost: 10000,
        otherCost: 5000,
        description: '示例描述'
      }
    ];

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // 设置列宽
    const colWidths = [
      { wch: 15 }, // department
      { wch: 20 }, // project
      { wch: 12 }, // period
      { wch: 15 }, // revenue
      { wch: 15 }, // cost
      { wch: 15 }, // materialCost
      { wch: 15 }, // laborCost
      { wch: 15 }, // overheadCost
      { wch: 15 }, // otherCost
      { wch: 30 }  // description
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, '利润数据模板');
    
    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=利润数据模板.xlsx');
    res.send(excelBuffer);

  } catch (error) {
    res.status(500).json({ message: '模板生成失败: ' + error.message });
  }
});

// 导出利润数据为Excel
router.post('/export', async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.body;
    
    // 构建查询条件
    const query = {};
    if (filter.department) query.department = filter.department;
    if (filter.period) query.period = filter.period;
    if (filter.project) query.project = new RegExp(filter.project, 'i');
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // 获取数据
    const profits = await Profit.find(query).sort({ createdAt: -1 });
    
    if (profits.length === 0) {
      return res.status(404).json({ message: '没有找到符合条件的数据' });
    }

    // 转换为Excel格式
    const excelData = profits.map(profit => ({
      '部门': profit.department,
      '项目': profit.project,
      '期间': profit.period,
      '收入': profit.revenue,
      '成本': profit.cost,
      '利润': profit.profit,
      '利润率(%)': profit.profitMargin.toFixed(2),
      '材料成本': profit.materialCost,
      '人工成本': profit.laborCost,
      '管理费用': profit.overheadCost,
      '其他成本': profit.otherCost,
      '描述': profit.description,
      '状态': profit.status,
      '创建时间': profit.createdAt.toLocaleString('zh-CN')
    }));

    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // 设置列宽
    const colWidths = [
      { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
      { wch: 10 }, { wch: 20 }
    ];
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, '利润数据');
    
    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    });

    const filename = `利润数据导出_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(excelBuffer);

  } catch (error) {
    res.status(500).json({ message: '数据导出失败: ' + error.message });
  }
});

module.exports = router;
