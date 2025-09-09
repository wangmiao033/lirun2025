const express = require('express');
const router = express.Router();
const Profit = require('../models/Profit');

// 获取所有利润记录
router.get('/', async (req, res) => {
  try {
    const { department, period, project, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (department) filter.department = department;
    if (period) filter.period = period;
    if (project) filter.project = new RegExp(project, 'i');
    
    const profits = await Profit.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Profit.countDocuments(filter);
    
    res.json({
      profits,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个利润记录
router.get('/:id', async (req, res) => {
  try {
    const profit = await Profit.findById(req.params.id);
    if (!profit) {
      return res.status(404).json({ message: '利润记录未找到' });
    }
    res.json(profit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新的利润记录
router.post('/', async (req, res) => {
  try {
    const profit = new Profit(req.body);
    await profit.save();
    res.status(201).json(profit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新利润记录
router.put('/:id', async (req, res) => {
  try {
    const profit = await Profit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!profit) {
      return res.status(404).json({ message: '利润记录未找到' });
    }
    res.json(profit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除利润记录
router.delete('/:id', async (req, res) => {
  try {
    const profit = await Profit.findByIdAndDelete(req.params.id);
    if (!profit) {
      return res.status(404).json({ message: '利润记录未找到' });
    }
    res.json({ message: '利润记录已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取利润统计
router.get('/stats/summary', async (req, res) => {
  try {
    const { period, department } = req.query;
    
    const filter = {};
    if (period) filter.period = period;
    if (department) filter.department = department;
    
    const stats = await Profit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalCost: { $sum: '$cost' },
          totalProfit: { $sum: '$profit' },
          avgProfitMargin: { $avg: '$profitMargin' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      avgProfitMargin: 0,
      count: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 按部门获取利润统计
router.get('/stats/by-department', async (req, res) => {
  try {
    const { period } = req.query;
    
    const filter = {};
    if (period) filter.period = period;
    
    const stats = await Profit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$department',
          totalRevenue: { $sum: '$revenue' },
          totalCost: { $sum: '$cost' },
          totalProfit: { $sum: '$profit' },
          avgProfitMargin: { $avg: '$profitMargin' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalProfit: -1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 按时间获取利润趋势
router.get('/stats/trend', async (req, res) => {
  try {
    const { department, startPeriod, endPeriod } = req.query;
    
    const filter = {};
    if (department) filter.department = department;
    if (startPeriod && endPeriod) {
      filter.period = { $gte: startPeriod, $lte: endPeriod };
    }
    
    const stats = await Profit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$period',
          totalRevenue: { $sum: '$revenue' },
          totalCost: { $sum: '$cost' },
          totalProfit: { $sum: '$profit' },
          avgProfitMargin: { $avg: '$profitMargin' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
