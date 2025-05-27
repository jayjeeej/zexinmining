'use client';

import { useEffect } from 'react';

/**
 * 卡片动画提供者组件
 * 
 * 在使用CategoryCard或ProductFilterCard的页面中引入此组件，
 * 以启用返回页面后仍能生效的动画效果
 * 
 * @example
 * // 在页面组件中使用:
 * import CardAnimationProvider from '@/components/CardAnimationProvider';
 * 
 * export default function ProductsPage() {
 *   return (
 *     <>
 *       <CardAnimationProvider />
 *       <CategoryCard ... />
 *       <ProductFilterCard ... />
 *     </>
 *   );
 * }
 */
export default function CardAnimationProvider() {
  useEffect(() => {
    // 添加动画准备就绪类
    const addAnimationReadyClass = () => {
      document.documentElement.classList.add('animation-ready');
    };
    
    // 移除动画准备就绪类
    const removeAnimationReadyClass = () => {
      document.documentElement.classList.remove('animation-ready');
    };
    
    // 处理页面显示事件（包括从bfcache恢复）
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // 页面是从缓存恢复的，需要重置并重新触发动画效果
        removeAnimationReadyClass();
        setTimeout(addAnimationReadyClass, 10);
      }
    };
    
    // 处理load事件的函数引用
    const handleLoad = () => setTimeout(addAnimationReadyClass, 100);
    
    // DOM加载完成后启用动画，但需要延迟执行确保所有元素已经正确渲染
    if (typeof window !== 'undefined') {
      // 如果页面已经完全加载，立即添加类
      if (document.readyState === 'complete') {
        setTimeout(addAnimationReadyClass, 100);
      } else {
        // 否则等待页面加载完成
        window.addEventListener('load', handleLoad);
      }
    }
    
    // 添加页面显示事件监听
    window.addEventListener('pageshow', handlePageShow);
    
    // 如果页面尚未完全加载，添加load事件监听
    if (typeof window !== 'undefined' && document.readyState !== 'complete') {
      window.addEventListener('load', handleLoad);
    }
    
    // 组件卸载时移除事件监听和类
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('load', handleLoad);
      removeAnimationReadyClass();
    };
  }, []);
  
  // 无需渲染任何元素
  return null;
} 