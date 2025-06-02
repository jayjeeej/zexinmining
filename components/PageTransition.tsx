'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { clearLocaleCache } from '../lib/usePageData';

// 移除所有过渡相关样式
const progressBarStyle = ``;

interface PageTransitionProps {
  children: React.ReactNode;
}

// 进度条管理 - 完全禁用所有效果
const NProgress = {
  _timer: null as NodeJS.Timeout | null,
  _overlay: null as HTMLElement | null,
  _progressBar: null as HTMLElement | null,
  _animationFrame: null as number | null,
  _status: 0,
  
  // 空函数，禁用所有视觉效果
  ensureElements() {},
  
  // 禁用进度条
  start() {},
  
  // 禁用结束效果
  done() {},
  
  // 禁用进度设置
  set(progress: number) {},
  
  // 禁用递增进度
  inc() {}
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
  
  // 简化的路由变化处理 - 完全移除过渡效果
  useEffect(() => {
    if (prevPathname !== pathname && prevPathname) {
          // 清除当前locale的缓存
          const currentLocale = getLocaleFromPath(prevPathname);
          clearLocaleCache(currentLocale);
        
      // 确保背景色始终为白色
      if (typeof document !== 'undefined') {
        document.documentElement.style.backgroundColor = '#ffffff';
        document.body.style.backgroundColor = '#ffffff';
      }
      
      // 预加载图片
        preloadImages();
    }
    
    // 更新之前的路径
    setPrevPathname(pathname);
  }, [pathname, prevPathname]);
  
  // 首次加载处理
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 首次加载时添加js类
      document.documentElement.classList.add('js');
      
      // 确保背景色始终为白色
      document.documentElement.style.backgroundColor = '#ffffff';
      document.body.style.backgroundColor = '#ffffff';
      
      // 监听页面完全加载事件
      window.addEventListener('load', () => {
        // 预加载当前页面图片
        preloadImages();
      });
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', () => {});
      }
    };
  }, []);
  
  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsComponent onSearchParamsChange={handleSearchParamsChange} />
      </Suspense>
      
      {/* 页面内容 - 不添加任何过渡效果 */}
      {children}
    </>
  );
} 