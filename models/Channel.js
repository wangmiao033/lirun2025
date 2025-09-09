const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  // 基本信息
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['online', 'offline', 'partner', 'direct'],
    default: 'online'
  },
  
  // 联系信息
  manager: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  
  // 财务信息
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  monthlySales: {
    type: Number,
    default: 0,
    min: 0
  },
  quarterlySales: {
    type: Number,
    default: 0,
    min: 0
  },
  yearlySales: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // 渠道特性
  targetMarket: [String], // 目标市场
  productCategories: [String], // 产品类别
  customerSegments: [String], // 客户群体
  geographicCoverage: [String], // 地理覆盖范围
  
  // 绩效指标
  conversionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  customerRetentionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // 合同信息
  contractStartDate: {
    type: Date
  },
  contractEndDate: {
    type: Date
  },
  contractValue: {
    type: Number,
    min: 0,
    default: 0
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  
  // 状态信息
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active'
  },
  
  // 描述和备注
  description: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  strengths: [String], // 优势
  weaknesses: [String], // 劣势
  opportunities: [String], // 机会
  threats: [String], // 威胁
  
  // 元数据
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

// 索引
channelSchema.index({ code: 1 });
channelSchema.index({ name: 1 });
channelSchema.index({ type: 1 });
channelSchema.index({ manager: 1 });
channelSchema.index({ isActive: 1 });
channelSchema.index({ status: 1 });
channelSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Channel', channelSchema);
