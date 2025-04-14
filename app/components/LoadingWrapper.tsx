'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface LoadingWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
  minLoadTime?: number; // 最小加载时间，避免闪烁
}

export default function LoadingWrapper({
  children,
  isLoading,
  fallback,
  minLoadTime = 300, // 默认最小加载时间，避免闪烁
}: LoadingWrapperProps) {
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
  }, [isLoading, minLoadTime]);

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