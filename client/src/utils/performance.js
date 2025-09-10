// 性能优化工具函数

// 防抖函数
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 懒加载组件
export const lazyLoad = (importFunc) => {
  return React.lazy(importFunc);
};

// 虚拟滚动工具
export const getVisibleItems = (items, containerHeight, itemHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight
  };
};

// 图片懒加载
export const lazyLoadImage = (imgRef, src, placeholder) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (imgRef.current) {
    imgRef.current.src = placeholder;
    imgRef.current.classList.add('lazy');
    observer.observe(imgRef.current);
  }

  return () => observer.disconnect();
};

// 内存使用监控
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
    };
  }
  return null;
};

// 性能监控
export const performanceMonitor = {
  // 记录页面加载时间
  recordPageLoad: () => {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      console.log(`页面加载时间: ${loadTime}ms`);
    });
  },

  // 记录API请求时间
  recordApiCall: (url, startTime, endTime) => {
    const duration = endTime - startTime;
    console.log(`API请求 ${url}: ${duration}ms`);
    
    if (duration > 3000) {
      console.warn(`慢请求警告: ${url} 耗时 ${duration}ms`);
    }
  },

  // 记录组件渲染时间
  recordRenderTime: (componentName, startTime, endTime) => {
    const duration = endTime - startTime;
    console.log(`组件 ${componentName} 渲染时间: ${duration}ms`);
    
    if (duration > 100) {
      console.warn(`慢渲染警告: ${componentName} 耗时 ${duration}ms`);
    }
  }
};

// 数据缓存
export class DataCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 默认5分钟过期
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, value) {
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// 请求去重
export class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
  }

  async request(key, requestFn) {
    // 如果相同的请求正在进行中，返回现有的Promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // 创建新的请求
    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// 批量处理
export const batchProcess = (items, batchSize, processor) => {
  return new Promise((resolve) => {
    const results = [];
    let index = 0;

    const processBatch = () => {
      const batch = items.slice(index, index + batchSize);
      if (batch.length === 0) {
        resolve(results);
        return;
      }

      const batchResults = processor(batch);
      results.push(...batchResults);
      index += batchSize;

      // 使用setTimeout让出控制权，避免阻塞UI
      setTimeout(processBatch, 0);
    };

    processBatch();
  });
};

// 预加载资源
export const preloadResource = (url, type = 'image') => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    link.onload = () => resolve(url);
    link.onerror = () => reject(new Error(`Failed to preload ${url}`));
    
    document.head.appendChild(link);
  });
};

// 预加载多个资源
export const preloadResources = async (resources) => {
  const promises = resources.map(({ url, type }) => preloadResource(url, type));
  return Promise.allSettled(promises);
};

// 组件性能优化HOC
export const withPerformance = (WrappedComponent, componentName) => {
  return React.memo((props) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      performanceMonitor.recordRenderTime(componentName, startTime, endTime);
    });

    return React.createElement(WrappedComponent, props);
  });
};
