/**
 * 格式化工具函数测试
 */

// 模拟格式化函数
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('zh-CN').format(number || 0);
};

const formatPercentage = (value) => {
  return `${(value || 0).toFixed(2)}%`;
};

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('zh-CN') : '-';
};

// 测试用例
describe('Format Utils', () => {
  describe('formatCurrency', () => {
    test('formats positive numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('¥1,000,000');
      expect(formatCurrency(1234.56)).toBe('¥1,235');
      expect(formatCurrency(0)).toBe('¥0');
    });

    test('handles negative numbers', () => {
      expect(formatCurrency(-1000)).toBe('-¥1,000');
    });

    test('handles null and undefined', () => {
      expect(formatCurrency(null)).toBe('¥0');
      expect(formatCurrency(undefined)).toBe('¥0');
    });
  });

  describe('formatNumber', () => {
    test('formats numbers with thousand separators', () => {
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(0)).toBe('0');
    });

    test('handles decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });
  });

  describe('formatPercentage', () => {
    test('formats percentages correctly', () => {
      expect(formatPercentage(15.5)).toBe('15.50%');
      expect(formatPercentage(0)).toBe('0.00%');
      expect(formatPercentage(100)).toBe('100.00%');
    });
  });

  describe('formatDate', () => {
    test('formats valid dates', () => {
      const testDate = '2024-12-11';
      const formatted = formatDate(testDate);
      expect(formatted).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/);
    });

    test('handles invalid dates', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });
});
