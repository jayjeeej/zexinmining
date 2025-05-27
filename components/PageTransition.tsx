'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { clearLocaleCache } from '../lib/usePageData';

// 移除所有过渡相关样式
const progressBarStyle = `
  /* 禁用所有可能导致闪白的样式 */
`;

interface PageTransitionProps {
  children: React.ReactNode;
}

// 进度条管理 - 禁用所有效果
const NProgress = {
  _timer: null as NodeJS.Timeout | null,
  _overlay: null as HTMLElement | null,
  _progressBar: null as HTMLElement | null,
  _animationFrame: null as number | null,
  _status: 0,
  
  // 空函数，禁用所有视觉效果
  ensureElements() {
    // 禁用
  },
  
  // 禁用进度条
  start() {
    // 禁用
  },
  
  // 禁用结束效果
  done() {
    // 禁用
  },
  
  // 禁用进度设置
  set(progress: number) {
    // 禁用
  },
  
  // 禁用递增进度
  inc() {
    // 禁用
  }
};

// 创建一个使用SearchParams的组件，包裹在Suspense中
function SearchParamsComponent({ 
  onSearchParamsChange 
}: { 
  onSearchParamsChange: (params: URLSearchParams) => void 
}) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams) {
      onSearchParamsChange(searchParams);
    }
  }, [searchParams, onSearchParamsChange]);
  
  return null;
}

// 添加页面预加载功能
function preloadImages() {
  if (typeof window === 'undefined') return;
  
  // 延迟执行，避免影响页面初始加载性能
  setTimeout(() => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img instanceof HTMLImageElement && img.dataset.src) {
        const preloadImage = new Image();
        preloadImage.onload = () => {
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          img.classList.remove('opacity-0');
        };
        preloadImage.src = img.dataset.src;
      }
    });
  }, 200);
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [searchParamsValue, setSearchParamsValue] = useState<URLSearchParams | null>(null);
  const [prevPathname, setPrevPathname] = useState<string | null>(pathname);
  const [isChangingRoute, setIsChangingRoute] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // 处理搜索参数更新
  const handleSearchParamsChange = (params: URLSearchParams) => {
    setSearchParamsValue(params);
  };
  
  // 提取locale
  const getLocaleFromPath = (path: string | null): string => {
    if (!path) return 'zh';
    const match = path.match(/^\/(zh|en)(?:\/|$)/);
    return match ? match[1] : 'zh';
  };
  
  const currentLocale = getLocaleFromPath(pathname);
  
  // 改进的路由变化处理
  useEffect(() => {
    if (prevPathname !== pathname) {
      if (!isChangingRoute) {
        setIsChangingRoute(true);
        
        // 在路由开始变化时添加过渡类
        if (typeof document !== 'undefined') {
          document.body.classList.add('page-transitioning');
          document.body.style.opacity = '0.8'; // 轻微降低不透明度，提供视觉过渡
        }
        
        if (typeof window !== 'undefined' && prevPathname) {
          // 清除当前locale的缓存
          const currentLocale = getLocaleFromPath(prevPathname);
          clearLocaleCache(currentLocale);
        }
      }
    } else if (isChangingRoute) {
        setIsChangingRoute(false);
        
      // 路由变化完成后移除过渡类
      if (typeof document !== 'undefined') {
        document.body.classList.remove('page-transitioning');
        document.body.style.opacity = '1';
      }
      
      // 预加载图片
      if (typeof window !== 'undefined') {
        preloadImages();
      }
    }
    
    // 更新之前的路径
    setPrevPathname(pathname);
  }, [pathname, prevPathname, isChangingRoute]);
  
  // 首次加载处理
  useEffect(() => {
    if (isFirstLoad && typeof window !== 'undefined') {
      // 首次加载时标记浏览器已经完成渲染
      window.addEventListener('load', () => {
        document.documentElement.classList.remove('preloading');
        document.body.classList.remove('preloading');
        setIsFirstLoad(false);
        
        // 预加载当前页面图片
        preloadImages();
      });
      
      // 在DOMContentLoaded时就开始准备
      document.documentElement.classList.add('preloading');
      document.body.classList.add('preloading');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', () => {
          document.documentElement.classList.remove('preloading');
          document.body.classList.remove('preloading');
        });
      }
    };
  }, [pathname, isFirstLoad]);
  
  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsComponent onSearchParamsChange={handleSearchParamsChange} />
      </Suspense>
      
      {/* 移除进度条和叠加层 */}
      
      {/* 页面内容 */}
      {children}
    </>
  );
} 