// 高级数据分析工具

// 基础统计函数
export const statistics = {
  // 平均值
  mean: (data) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, value) => sum + value, 0) / data.length;
  },

  // 中位数
  median: (data) => {
    if (!data || data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  },

  // 众数
  mode: (data) => {
    if (!data || data.length === 0) return null;
    const frequency = {};
    data.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    
    let maxFreq = 0;
    let mode = null;
    Object.entries(frequency).forEach(([value, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = parseFloat(value);
      }
    });
    
    return mode;
  },

  // 标准差
  standardDeviation: (data) => {
    if (!data || data.length === 0) return 0;
    const avg = statistics.mean(data);
    const squaredDiffs = data.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(statistics.mean(squaredDiffs));
  },

  // 方差
  variance: (data) => {
    if (!data || data.length === 0) return 0;
    const avg = statistics.mean(data);
    const squaredDiffs = data.map(value => Math.pow(value - avg, 2));
    return statistics.mean(squaredDiffs);
  },

  // 百分位数
  percentile: (data, percent) => {
    if (!data || data.length === 0) return 0;
    const sorted = [...data].sort((a, b) => a - b);
    const index = (percent / 100) * (sorted.length - 1);
    
    if (Number.isInteger(index)) {
      return sorted[index];
    } else {
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index - lower;
      return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
  },

  // 四分位数
  quartiles: (data) => {
    return {
      q1: statistics.percentile(data, 25),
      q2: statistics.percentile(data, 50),
      q3: statistics.percentile(data, 75)
    };
  },

  // 极值
  range: (data) => {
    if (!data || data.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...data),
      max: Math.max(...data)
    };
  }
};

// 趋势分析
export const trendAnalysis = {
  // 线性趋势
  linearTrend: (data) => {
    if (!data || data.length < 2) return { slope: 0, intercept: 0, r2: 0 };
    
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // 计算R²
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const r2 = 1 - (ssRes / ssTot);
    
    return { slope, intercept, r2 };
  },

  // 移动平均
  movingAverage: (data, windowSize) => {
    if (!data || data.length < windowSize) return data;
    
    const result = [];
    for (let i = windowSize - 1; i < data.length; i++) {
      const window = data.slice(i - windowSize + 1, i + 1);
      result.push(statistics.mean(window));
    }
    return result;
  },

  // 指数移动平均
  exponentialMovingAverage: (data, alpha = 0.3) => {
    if (!data || data.length === 0) return [];
    
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
      const ema = alpha * data[i] + (1 - alpha) * result[i - 1];
      result.push(ema);
    }
    return result;
  },

  // 趋势方向
  getTrendDirection: (data) => {
    const trend = trendAnalysis.linearTrend(data);
    if (Math.abs(trend.slope) < 0.01) return 'stable';
    return trend.slope > 0 ? 'increasing' : 'decreasing';
  }
};

// 预测算法
export const forecasting = {
  // 简单线性回归预测
  linearForecast: (data, periods) => {
    const trend = trendAnalysis.linearTrend(data);
    const lastIndex = data.length - 1;
    const predictions = [];
    
    for (let i = 1; i <= periods; i++) {
      const predicted = trend.slope * (lastIndex + i) + trend.intercept;
      predictions.push(predicted);
    }
    
    return {
      predictions,
      confidence: trend.r2,
      trend: trend
    };
  },

  // 移动平均预测
  movingAverageForecast: (data, windowSize, periods) => {
    const ma = trendAnalysis.movingAverage(data, windowSize);
    if (ma.length === 0) return { predictions: [], confidence: 0 };
    
    const lastMA = ma[ma.length - 1];
    const predictions = Array(periods).fill(lastMA);
    
    return {
      predictions,
      confidence: 0.7, // 移动平均的置信度较低
      method: 'moving_average'
    };
  },

  // 指数平滑预测
  exponentialSmoothingForecast: (data, alpha = 0.3, periods) => {
    const ema = trendAnalysis.exponentialMovingAverage(data, alpha);
    if (ema.length === 0) return { predictions: [], confidence: 0 };
    
    const lastEMA = ema[ema.length - 1];
    const predictions = Array(periods).fill(lastEMA);
    
    return {
      predictions,
      confidence: 0.6,
      method: 'exponential_smoothing'
    };
  },

  // 季节性分解
  seasonalDecomposition: (data, period = 12) => {
    if (data.length < period * 2) return null;
    
    // 计算趋势
    const trend = trendAnalysis.linearTrend(data);
    const detrended = data.map((value, index) => value - (trend.slope * index + trend.intercept));
    
    // 计算季节性
    const seasonal = Array(period).fill(0);
    const seasonalCount = Array(period).fill(0);
    
    detrended.forEach((value, index) => {
      const seasonIndex = index % period;
      seasonal[seasonIndex] += value;
      seasonalCount[seasonIndex]++;
    });
    
    seasonal.forEach((sum, index) => {
      seasonal[index] = sum / seasonalCount[index];
    });
    
    // 计算残差
    const residuals = data.map((value, index) => {
      const seasonIndex = index % period;
      const trendValue = trend.slope * index + trend.intercept;
      return value - trendValue - seasonal[seasonIndex];
    });
    
    return {
      trend,
      seasonal,
      residuals,
      detrended
    };
  }
};

// 相关性分析
export const correlation = {
  // 皮尔逊相关系数
  pearson: (x, y) => {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  },

  // 斯皮尔曼相关系数
  spearman: (x, y) => {
    if (x.length !== y.length || x.length === 0) return 0;
    
    // 计算排名
    const rankX = getRanks(x);
    const rankY = getRanks(y);
    
    return correlation.pearson(rankX, rankY);
  }
};

// 辅助函数：计算排名
const getRanks = (data) => {
  const sorted = data.map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value);
  
  const ranks = new Array(data.length);
  let currentRank = 1;
  
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].value !== sorted[i - 1].value) {
      currentRank = i + 1;
    }
    ranks[sorted[i].index] = currentRank;
  }
  
  return ranks;
};

// 异常检测
export const anomalyDetection = {
  // Z-Score异常检测
  zScore: (data, threshold = 2) => {
    const mean = statistics.mean(data);
    const std = statistics.standardDeviation(data);
    
    return data.map((value, index) => ({
      value,
      index,
      zScore: (value - mean) / std,
      isAnomaly: Math.abs((value - mean) / std) > threshold
    }));
  },

  // IQR异常检测
  iqr: (data, multiplier = 1.5) => {
    const { q1, q3 } = statistics.quartiles(data);
    const iqr = q3 - q1;
    const lowerBound = q1 - multiplier * iqr;
    const upperBound = q3 + multiplier * iqr;
    
    return data.map((value, index) => ({
      value,
      index,
      isAnomaly: value < lowerBound || value > upperBound
    }));
  },

  // 移动平均异常检测
  movingAverageAnomaly: (data, windowSize = 10, threshold = 2) => {
    const ma = trendAnalysis.movingAverage(data, windowSize);
    const anomalies = [];
    
    for (let i = windowSize - 1; i < data.length; i++) {
      const actual = data[i];
      const predicted = ma[i - windowSize + 1];
      const error = Math.abs(actual - predicted);
      const avgError = statistics.mean(
        data.slice(Math.max(0, i - windowSize), i).map((val, idx) => 
          Math.abs(val - ma[Math.max(0, idx - windowSize + 1)])
        )
      );
      
      anomalies.push({
        value: actual,
        index: i,
        isAnomaly: error > threshold * avgError
      });
    }
    
    return anomalies;
  }
};

// 数据分组和聚合
export const aggregation = {
  // 按时间分组
  groupByTime: (data, timeField, valueField, interval = 'day') => {
    const groups = {};
    
    data.forEach(item => {
      const date = new Date(item[timeField]);
      let key;
      
      switch (interval) {
        case 'hour':
          key = date.toISOString().slice(0, 13);
          break;
        case 'day':
          key = date.toISOString().slice(0, 10);
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().slice(0, 10);
          break;
        case 'month':
          key = date.toISOString().slice(0, 7);
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().slice(0, 10);
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item[valueField]);
    });
    
    return Object.entries(groups).map(([time, values]) => ({
      time,
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      mean: statistics.mean(values),
      min: Math.min(...values),
      max: Math.max(...values)
    }));
  },

  // 按类别分组
  groupByCategory: (data, categoryField, valueField) => {
    const groups = {};
    
    data.forEach(item => {
      const category = item[categoryField];
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item[valueField]);
    });
    
    return Object.entries(groups).map(([category, values]) => ({
      category,
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      mean: statistics.mean(values),
      min: Math.min(...values),
      max: Math.max(...values)
    }));
  }
};
