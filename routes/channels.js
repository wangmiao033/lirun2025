const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');

// 获取所有渠道
router.get('/', async (req, res) => {
  try {
    const { type, status, manager, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (manager) query.manager = new RegExp(manager, 'i');
    
    const skip = (page - 1) * limit;
    const channels = await Channel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Channel.countDocuments(query);
    
    res.json({
      data: channels,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个渠道
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: '渠道未找到' });
    }
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新渠道
router.post('/', async (req, res) => {
  try {
    const channel = new Channel(req.body);
    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '渠道代码已存在' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// 更新渠道
router.put('/:id', async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!channel) {
      return res.status(404).json({ message: '渠道未找到' });
    }
    res.json(channel);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '渠道代码已存在' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// 删除渠道（软删除）
router.delete('/:id', async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!channel) {
      return res.status(404).json({ message: '渠道未找到' });
    }
    res.json({ message: '渠道已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取渠道统计
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { isActive: true };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const stats = await Channel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalChannels: { $sum: 1 },
          totalMonthlySales: { $sum: '$monthlySales' },
          totalQuarterlySales: { $sum: '$quarterlySales' },
          totalYearlySales: { $sum: '$yearlySales' },
          avgCommissionRate: { $avg: '$commissionRate' },
          avgConversionRate: { $avg: '$conversionRate' },
          activeChannels: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const typeStats = await Channel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalSales: { $sum: '$monthlySales' },
          avgCommissionRate: { $avg: '$commissionRate' }
        }
      }
    ]);
    
    res.json({
      summary: stats[0] || {
        totalChannels: 0,
        totalMonthlySales: 0,
        totalQuarterlySales: 0,
        totalYearlySales: 0,
        avgCommissionRate: 0,
        avgConversionRate: 0,
        activeChannels: 0
      },
      byType: typeStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
