'use client';

import { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

/**
 * 用于管理页面加载和过渡的Hook
 * 
 * @param {boolean} initialLoadingState - 初始加载状态
 * @param {number} minDurationMs - 最小加载持续时间(ms)
 * @returns {Object} 包含isReady状态和setIsReady函数的对象
 */
export function usePageTransition(
  initialLoadingState: boolean = true, 
  minDurationMs: number = 500
) {
  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [loadStartTime] = useState(Date.now());
  const { isNavigating, completeNavigation } = useNavigation();
  
  useEffect(() => {
    // 如果不再加载并且正在导航中，尝试完成导航
    if (!isLoading && isNavigating) {
      // 确保最小加载时间
      const elapsed = Date.now() - loadStartTime;
      const remainingTime = Math.max(0, minDurationMs - elapsed);
      
      // 延迟完成导航，确保最小加载时间
      const timer = setTimeout(() => {
        completeNavigation();
      }, remainingTime);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isNavigating, loadStartTime, minDurationMs, completeNavigation]);
  
  return {
    isLoading,
    setIsLoading,
  };
} 