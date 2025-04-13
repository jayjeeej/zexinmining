'use client';

import { useEffect } from 'react';

/**
 * 客户端组件，用于处理Google Analytics相关错误和初始化
 */
export default function GoogleAnalyticsManager() {
  useEffect(() => {
    // 监听Google Analytics脚本加载错误
    const handleGAError = (event: ErrorEvent) => {
      if (
        event.target instanceof HTMLScriptElement &&
        event.target.src.includes('googletagmanager.com')
      ) {
        console.log('Google Analytics加载失败，这在开发环境中是正常现象');
        event.preventDefault();
        return false;
      }
    };

    // 添加错误处理
    window.addEventListener('error', handleGAError, true);

    // 确保GA配置正确
    const ensureGAConfig = () => {
      if (typeof window.gtag === 'undefined') {
        // GA未正确加载，创建一个空函数避免错误
        window.gtag = function() {
          console.log('Google Analytics未加载，调用被忽略');
        };
      }
    };

    // 尝试检测GA是否加载，如果5秒后未加载，则初始化空函数
    const gaTimeout = setTimeout(() => {
      ensureGAConfig();
    }, 5000);

    return () => {
      window.removeEventListener('error', handleGAError, true);
      clearTimeout(gaTimeout);
    };
  }, []);

  return null;
}

// 为TypeScript添加全局声明
declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
} 