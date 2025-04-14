'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

interface LoadingWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
  minLoadTime?: number; // 最小加载时间，避免闪烁
  listenToNavigation?: boolean; // 是否监听全局导航状态
}

export default function LoadingWrapper({
  children,
  isLoading: propsIsLoading,
  fallback,
  minLoadTime = 300, // 默认最小加载时间，避免闪烁
  listenToNavigation = false, // 默认不监听全局导航
}: LoadingWrapperProps) {
  const { isNavigating, completeNavigation } = useNavigation();
  
  // 结合组件本身的loading状态和全局导航状态
  const isLoading = propsIsLoading || (listenToNavigation && isNavigating);
  
  const [showContent, setShowContent] = useState(!isLoading);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 清除之前的计时器
    if (timer) {
      clearTimeout(timer);
    }

    if (!isLoading) {
      // 如果加载完成，设置最小延迟后显示内容
      const newTimer = setTimeout(() => {
        setShowContent(true);
        
        // 如果在监听导航状态且之前有导航请求，通知导航完成
        if (listenToNavigation && isNavigating) {
          completeNavigation();
        }
      }, minLoadTime);
      
      setTimer(newTimer);
      
      // 组件卸载时清除计时器
      return () => {
        if (newTimer) clearTimeout(newTimer);
      };
    } else {
      // 如果正在加载，不立即隐藏内容，而是保持当前状态
      // 这样可以避免在短暂加载时闪烁
      if (!showContent) return;
      
      // 如果加载时间过长，再隐藏内容
      const newTimer = setTimeout(() => {
        setShowContent(false);
      }, 500); // 如果加载超过500ms，才考虑显示loading状态
      
      setTimer(newTimer);
      
      return () => {
        if (newTimer) clearTimeout(newTimer);
      };
    }
  }, [isLoading, minLoadTime, listenToNavigation, isNavigating, completeNavigation]);

  return (
    <>
      {!showContent && fallback ? (
        // 无加载动画，保持当前页面状态，不做任何显示
        <div className="loading-hidden">
          {fallback}
        </div>
      ) : (
        // 加载完成后，使用fade-in动画平滑过渡显示内容
        <div className={`${showContent ? 'content-loaded' : 'content-loading'}`}>
          {children}
        </div>
      )}
    </>
  );
} 