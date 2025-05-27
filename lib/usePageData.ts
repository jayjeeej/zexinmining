import { useState, useEffect, useRef, useCallback } from 'react';

// 全局缓存存储
const dataCache = new Map<string, { data: any; timestamp: number }>();

type FetcherOptions = {
  locale: string;
  cacheDuration?: number; // 缓存时间(毫秒)
  revalidateOnFocus?: boolean; // 页面聚焦时重新验证
  revalidateOnMount?: boolean; // 组件挂载时重新验证
  skipCache?: boolean; // 跳过缓存直接请求
};

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 默认5分钟

export function usePageData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: FetcherOptions
) {
  const { 
    locale, 
    cacheDuration = DEFAULT_CACHE_DURATION,
    revalidateOnFocus = false,
    revalidateOnMount = true,
    skipCache = false
  } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = `${key}:${locale}`;
  const fetcherRef = useRef(fetcher);
  const mounted = useRef(false);

  // 加载数据的核心逻辑
  const loadData = useCallback(async (ignoreCache = false) => {
    // 检查缓存是否有效
    if (!ignoreCache && !skipCache) {
      const cached = dataCache.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp < cacheDuration)) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用提供的数据获取函数
      const result = await fetcherRef.current();
      setData(result);
      
      // 更新缓存
      if (!skipCache) {
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error(`Failed to load data for key ${key}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, cacheDuration, skipCache, key]);

  // 初始加载
  useEffect(() => {
    // 标记组件已挂载
    mounted.current = true;
    
    // 更新fetcher引用
    fetcherRef.current = fetcher;
    
    // 加载数据 (根据revalidateOnMount决定是否跳过缓存)
    loadData(!revalidateOnMount);
    
    // 页面聚焦时刷新数据
    const handleFocus = () => {
      if (revalidateOnFocus && mounted.current) {
        loadData(true);
      }
    };
    
    if (revalidateOnFocus && typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
    }
    
    return () => {
      mounted.current = false;
      if (revalidateOnFocus && typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
      }
    };
  }, [fetcher, loadData, revalidateOnFocus, revalidateOnMount]);
  
  // 当locale变化时重新加载
  useEffect(() => {
    if (mounted.current) {
      loadData(false);
    }
  }, [locale, loadData]);

  // 强制刷新数据的方法
  const refresh = useCallback(() => loadData(true), [loadData]);

  return {
    data,
    isLoading,
    error,
    refresh
  };
}

// 清除特定键的缓存
export function clearCache(key: string): void {
  dataCache.delete(key);
}

// 清除特定语言的所有缓存
export function clearLocaleCache(locale: string): void {
  Array.from(dataCache.keys()).forEach(key => {
    if (key.includes(`:${locale}`)) {
      dataCache.delete(key);
    }
  });
}

// 清除所有缓存
export function clearAllCache(): void {
  dataCache.clear();
} 