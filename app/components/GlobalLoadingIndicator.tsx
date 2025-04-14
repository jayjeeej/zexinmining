'use client';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';

export default function GlobalLoadingIndicator() {
  const { isNavigating } = useNavigation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  
  // 使用防抖动技术，避免短暂加载闪烁
  useEffect(() => {
    let progressTimer: NodeJS.Timeout | null = null;
    let visibilityTimer: NodeJS.Timeout | null = null;
    
    if (isNavigating) {
      // 短暂延迟显示进度条，避免闪烁
      visibilityTimer = setTimeout(() => {
        setVisible(true);
        
        // 初始进度
        setProgress(10);
        
        // 渐进增加进度
        progressTimer = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 90) {
              if (progressTimer) clearInterval(progressTimer);
              return 90; // 保持在90%，等待实际完成
            }
            
            // 随时间减缓速度
            const step = Math.max(1, 5 * Math.pow(0.98, prevProgress));
            return Math.min(90, prevProgress + step);
          });
        }, 200);
      }, 100); // 延迟100ms后显示，避免短暂导航闪烁
    } else {
      // 已完成导航，快速完成进度条
      if (visible) {
        setProgress(100);
        
        // 延迟隐藏进度条，创造平滑过渡
        visibilityTimer = setTimeout(() => {
          setVisible(false);
          
          // 重置进度条状态（仅在完全隐藏后）
          setTimeout(() => {
            setProgress(0);
          }, 100);
        }, 400);
      }
    }
    
    return () => {
      if (progressTimer) clearInterval(progressTimer);
      if (visibilityTimer) clearTimeout(visibilityTimer);
    };
  }, [isNavigating, visible]);
  
  if (!visible && progress === 0) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div 
        className="h-1 bg-blue-600 transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`, 
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'width 300ms ease-out, opacity 300ms ease-in 100ms' : 'width 300ms ease-out'
        }}
      />
    </div>
  );
} 