// 数据验证工具函数

export const validators = {
  // 必填验证
  required: (value, message = '此字段为必填项') => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    return null;
  },

  // 邮箱验证
  email: (value, message = '请输入有效的邮箱地址') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  // 手机号验证
  phone: (value, message = '请输入有效的手机号码') => {
    if (!value) return null;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value) ? null : message;
  },

  // 数字验证
  number: (value, message = '请输入有效的数字') => {
    if (value === null || value === undefined || value === '') return null;
    return !isNaN(Number(value)) ? null : message;
  },

  // 正整数验证
  positiveInteger: (value, message = '请输入正整数') => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return Number.isInteger(num) && num > 0 ? null : message;
  },

  // 正数验证
  positiveNumber: (value, message = '请输入正数') => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return !isNaN(num) && num > 0 ? null : message;
  },

  // 最小长度验证
  minLength: (min, message) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : (message || `最少需要${min}个字符`);
  },

  // 最大长度验证
  maxLength: (max, message) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : (message || `最多允许${max}个字符`);
  },

  // 范围验证
  range: (min, max, message) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    if (isNaN(num)) return '请输入有效的数字';
    return num >= min && num <= max ? null : (message || `数值必须在${min}到${max}之间`);
  },

  // 日期验证
  date: (value, message = '请输入有效的日期') => {
    if (!value) return null;
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : message;
  },

  // 未来日期验证
  futureDate: (value, message = '日期必须是未来日期') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today ? null : message;
  },

  // 过去日期验证
  pastDate: (value, message = '日期必须是过去日期') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date < today ? null : message;
  },

  // 自定义正则验证
  pattern: (regex, message) => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  // 数组非空验证
  arrayNotEmpty: (value, message = '至少需要选择一项') => {
    return Array.isArray(value) && value.length > 0 ? null : message;
  },

  // 文件类型验证
  fileType: (allowedTypes, message) => (value) => {
    if (!value) return null;
    const file = value instanceof File ? value : value[0];
    if (!file) return null;
    const fileType = file.type;
    const isValidType = allowedTypes.some(type => 
      fileType === type || fileType.startsWith(type + '/')
    );
    return isValidType ? null : (message || `只允许上传${allowedTypes.join(', ')}格式的文件`);
  },

  // 文件大小验证
  fileSize: (maxSizeMB, message) => (value) => {
    if (!value) return null;
    const file = value instanceof File ? value : value[0];
    if (!file) return null;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes ? null : (message || `文件大小不能超过${maxSizeMB}MB`);
  }
};

// 组合验证器
export const combineValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

// 表单验证函数
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const fieldRules = rules[field];
    const value = data[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // 只显示第一个错误
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// 常用验证规则
export const commonRules = {
  email: [validators.required(), validators.email()],
  phone: [validators.required(), validators.phone()],
  required: [validators.required()],
  number: [validators.number()],
  positiveNumber: [validators.required(), validators.positiveNumber()],
  positiveInteger: [validators.required(), validators.positiveInteger()],
  password: [
    validators.required(),
    validators.minLength(6, '密码至少需要6个字符'),
    validators.maxLength(20, '密码最多20个字符')
  ],
  username: [
    validators.required(),
    validators.minLength(3, '用户名至少需要3个字符'),
    validators.maxLength(20, '用户名最多20个字符'),
    validators.pattern(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
  ]
};
