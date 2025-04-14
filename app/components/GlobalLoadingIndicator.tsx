'use client';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

export default function GlobalLoadingIndicator() {
  const { isNavigating } = useNavigation();
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isNavigating) {
      // 初始进度
      setProgress(10);
      
      // 模拟进度增加
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(interval);
            return prevProgress;
          }
          
          // 进度增加速度随时间减慢
          const increment = Math.max(1, 10 * (1 - prevProgress / 100));
          return Math.min(90, prevProgress + increment);
        });
      }, 300);
    } else {
      // 导航结束，快速完成进度条
      setProgress(100);
      
      // 重置进度条
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating]);
  
  if (progress === 0) {
    return null;
  }
  
  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300 ease-out"
      style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
    />
  );
} 