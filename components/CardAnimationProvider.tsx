'use client';

import { useEffect } from 'react';

// 为window对象添加pageStabilizer属性的类型声明
declare global {
  interface Window {
    pageStabilizer?: {
      saveState: () => void;
    };
  }
}

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
      // 确保页面已完全加载并且不处于过渡状态
      if (document.readyState === 'complete') {
        document.documentElement.classList.add('animation-ready');
      }
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
        // 延迟添加类，确保页面稳定后再启用动画
        setTimeout(addAnimationReadyClass, 100);
      }
    };
    
    // 处理load事件的函数引用
    const handleLoad = () => {
      // 确保页面完全加载后再启用动画
      setTimeout(addAnimationReadyClass, 150);
    };
    
    // 处理页面过渡完成事件
    const handleTransitionEnd = () => {
      // 页面过渡完成后启用动画
      setTimeout(addAnimationReadyClass, 50);
    };
    
    // DOM加载完成后启用动画，但需要延迟执行确保所有元素已经正确渲染
    if (typeof window !== 'undefined') {
      // 如果页面已经完全加载，立即添加类
      if (document.readyState === 'complete') {
        setTimeout(addAnimationReadyClass, 150);
      } else {
        // 否则等待页面加载完成
        window.addEventListener('load', handleLoad);
      }
      
      // 监听页面过渡完成事件（如果存在）
      if (window.pageStabilizer) {
        document.addEventListener('page-transition-end', handleTransitionEnd);
      }
    }
    
    // 添加页面显示事件监听
    window.addEventListener('pageshow', handlePageShow);
    
    // 组件卸载时移除事件监听和类
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('load', handleLoad);
      
      if (window.pageStabilizer) {
        document.removeEventListener('page-transition-end', handleTransitionEnd);
      }
      
      removeAnimationReadyClass();
    };
  }, []);
  
  // 无需渲染任何元素
  return null;
} 