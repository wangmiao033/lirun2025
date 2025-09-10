import { useState, useCallback } from 'react';

export const useApiError = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApiCall = useCallback(async (apiCall, options = {}) => {
    const {
      showLoading = true,
      errorMessage = '操作失败，请稍后重试',
      onSuccess,
      onError
    } = options;

    try {
      setError(null);
      if (showLoading) {
        setLoading(true);
      }

      const result = await apiCall();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      console.error('API Error:', err);
      
      let errorMsg = errorMessage;
      
      if (err.response) {
        // 服务器响应错误
        const { status, data } = err.response;
        
        switch (status) {
          case 400:
            errorMsg = data?.message || '请求参数错误';
            break;
          case 401:
            errorMsg = '登录已过期，请重新登录';
            // 可以在这里触发登出逻辑
            break;
          case 403:
            errorMsg = '权限不足，无法执行此操作';
            break;
          case 404:
            errorMsg = '请求的资源不存在';
            break;
          case 500:
            errorMsg = '服务器内部错误，请稍后重试';
            break;
          default:
            errorMsg = data?.message || `请求失败 (${status})`;
        }
      } else if (err.request) {
        // 网络错误
        errorMsg = '网络连接失败，请检查网络设置';
      } else {
        // 其他错误
        errorMsg = err.message || errorMessage;
      }
      
      setError(errorMsg);
      
      if (onError) {
        onError(err, errorMsg);
      }
      
      throw err;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    loading,
    handleApiCall,
    clearError
  };
};
