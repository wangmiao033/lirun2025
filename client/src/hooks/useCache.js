import { useState, useEffect, useRef } from 'react';
import { DataCache } from '../utils/performance';

// 全局缓存实例
const globalCache = new DataCache(200, 10 * 60 * 1000); // 200项，10分钟过期

export const useCache = (key, fetcher, options = {}) => {
  const {
    cache = globalCache,
    ttl = 5 * 60 * 1000, // 5分钟
    staleWhileRevalidate = true,
    revalidateOnFocus = true,
    revalidateOnMount = true
  } = options;

  const [data, setData] = useState(() => cache.get(key));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const fetcherRef = useRef(fetcher);
  const mountedRef = useRef(true);

  // 更新fetcher引用
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // 清理函数
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 重新验证数据
  const revalidate = async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetcherRef.current();
      
      if (mountedRef.current) {
        setData(newData);
        cache.set(key, newData);
        setIsStale(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  // 初始加载
  useEffect(() => {
    if (!revalidateOnMount) return;

    const cachedData = cache.get(key);
    
    if (cachedData) {
      setData(cachedData);
      
      if (staleWhileRevalidate) {
        setIsStale(true);
        revalidate();
      }
    } else {
      revalidate();
    }
  }, [key, revalidateOnMount]);

  // 窗口焦点时重新验证
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      if (staleWhileRevalidate) {
        revalidate();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, staleWhileRevalidate]);

  // 手动刷新
  const refresh = () => {
    revalidate();
  };

  // 清除缓存
  const clearCache = () => {
    cache.clear();
    setData(null);
  };

  return {
    data,
    loading,
    error,
    isStale,
    refresh,
    clearCache
  };
};

// 分页数据缓存Hook
export const usePaginatedCache = (key, fetcher, options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    ...cacheOptions
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPage = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const pageData = await fetcher(page, pageSize);
      
      if (page === 1) {
        setAllData(pageData.data);
      } else {
        setAllData(prev => [...prev, ...pageData.data]);
      }
      
      setHasMore(pageData.hasMore);
      setCurrentPage(page);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPage(currentPage + 1);
    }
  };

  const refresh = () => {
    setAllData([]);
    setCurrentPage(1);
    setHasMore(true);
    loadPage(1);
  };

  useEffect(() => {
    loadPage(1);
  }, [key]);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    currentPage,
    loadMore,
    refresh
  };
};

// 搜索缓存Hook
export const useSearchCache = (key, searchFn, options = {}) => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    ...cacheOptions
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // 执行搜索
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < minQueryLength) {
      setResults([]);
      return;
    }

    const searchKey = `${key}_${debouncedQuery}`;
    const cachedResults = globalCache.get(searchKey);
    
    if (cachedResults) {
      setResults(cachedResults);
      return;
    }

    setLoading(true);
    setError(null);

    searchFn(debouncedQuery)
      .then(data => {
        setResults(data);
        globalCache.set(searchKey, data);
      })
      .catch(err => {
        setError(err);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery, searchFn, key, minQueryLength]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch
  };
};
