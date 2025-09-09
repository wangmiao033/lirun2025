import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 利润相关API
export const profitApi = {
  // 获取利润列表
  getProfits: (params: any) => api.get('/profits', { params }),
  
  // 获取单个利润记录
  getProfit: (id: string) => api.get(`/profits/${id}`),
  
  // 创建利润记录
  createProfit: (data: any) => api.post('/profits', data),
  
  // 更新利润记录
  updateProfit: (id: string, data: any) => api.put(`/profits/${id}`, data),
  
  // 删除利润记录
  deleteProfit: (id: string) => api.delete(`/profits/${id}`),
  
  // 获取利润汇总统计
  getSummary: (params?: any) => api.get('/profits/stats/summary', { params }),
  
  // 获取部门利润统计
  getDepartmentStats: (params?: any) => api.get('/profits/stats/by-department', { params }),
  
  // 获取利润趋势
  getTrend: (params?: any) => api.get('/profits/stats/trend', { params }),
};

// 部门相关API
export const departmentApi = {
  // 获取部门列表
  getDepartments: () => api.get('/departments'),
  
  // 获取单个部门
  getDepartment: (id: string) => api.get(`/departments/${id}`),
  
  // 创建部门
  createDepartment: (data: any) => api.post('/departments', data),
  
  // 更新部门
  updateDepartment: (id: string, data: any) => api.put(`/departments/${id}`, data),
  
  // 删除部门
  deleteDepartment: (id: string) => api.delete(`/departments/${id}`),
};

// 文件上传相关API
export const uploadApi = {
  // 上传Excel文件
  uploadExcel: (file: File, createdBy: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('createdBy', createdBy);
    return api.post('/upload/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 下载Excel模板
  downloadTemplate: () => api.get('/upload/template', { responseType: 'blob' }),
  
  // 导出Excel数据
  exportData: (filters: any) => api.post('/upload/export', filters, { responseType: 'blob' }),
};

export default api;
