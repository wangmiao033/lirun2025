const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
  // 基本信息
  department: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    type: String,
    required: true, // 格式: 2025-01, 2025-Q1 等
    trim: true
  },
  
  // 财务数据
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  profit: {
    type: Number,
    required: true
  },
  profitMargin: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // 成本细分
  materialCost: {
    type: Number,
    default: 0,
    min: 0
  },
  laborCost: {
    type: Number,
    default: 0,
    min: 0
  },
  overheadCost: {
    type: Number,
    default: 0,
    min: 0
  },
  otherCost: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // 元数据
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// 计算利润和利润率
profitSchema.pre('save', function(next) {
  this.profit = this.revenue - this.cost;
  this.profitMargin = this.revenue > 0 ? (this.profit / this.revenue) * 100 : 0;
  next();
});

// 索引
profitSchema.index({ department: 1, period: 1 });
profitSchema.index({ project: 1 });
profitSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Profit', profitSchema);
