'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: (href: string) => void;
  completeNavigation: () => void;
  cancelNavigation: () => void;
  pendingUrl: string | null;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  completeNavigation: () => {},
  cancelNavigation: () => {},
  pendingUrl: null
});

export const useNavigation = () => useContext(NavigationContext);

// 增加一个全局变量跟踪导航状态，确保即使在组件重新渲染时也能保持状态
let globalNavigationState = {
  isNavigating: false,
  pendingUrl: null as string | null,
  navigationTimer: null as NodeJS.Timeout | null,
  navigationStartTime: 0
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const router = useRouter();
  const currentPathname = usePathname();

  // 同步本地状态和全局状态
  useEffect(() => {
    setIsNavigating(globalNavigationState.isNavigating);
    setPendingUrl(globalNavigationState.pendingUrl);
  }, []);

  // 添加全局点击事件监听，捕获所有链接点击
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // 查找最近的a标签
      let target = e.target as HTMLElement;
      while (target && target.tagName !== 'A') {
        target = target.parentElement as HTMLElement;
        if (!target) break;
      }

      if (!target || target.tagName !== 'A') return;

      // 获取链接
      const href = target.getAttribute('href');
      if (!href) return;

      // 忽略外部链接、锚点链接、已修饰的点击
      if (
        href.startsWith('http') || 
        href.startsWith('#') || 
        target.getAttribute('target') === '_blank' ||
        href === currentPathname ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        target.hasAttribute('data-no-navigation-intercept')
      ) {
        return;
      }

      // 阻止默认行为并手动处理导航
      e.preventDefault();
      startNavigation(href);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [currentPathname]);

  // 监听浏览器前进后退按钮
  useEffect(() => {
    const handlePopState = () => {
      // 如果用户使用浏览器的后退/前进按钮，我们设置一个短暂的加载状态
      updateGlobalNavigationState(true, null);
      setIsNavigating(true);
      
      setTimeout(() => {
        updateGlobalNavigationState(false, null);
        setIsNavigating(false);
      }, 500);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 更新全局导航状态
  const updateGlobalNavigationState = (
    navigating: boolean, 
    url: string | null
  ) => {
    globalNavigationState.isNavigating = navigating;
    globalNavigationState.pendingUrl = url;
    
    if (navigating) {
      globalNavigationState.navigationStartTime = Date.now();
    } else {
      globalNavigationState.navigationStartTime = 0;
    }
  };

  const startNavigation = useCallback((href: string) => {
    // 如果是锚点导航或当前页面，直接跳转
    if (href.startsWith('#') || (href === currentPathname)) {
      router.push(href);
      return;
    }

    // 清除任何现有的导航计时器
    if (globalNavigationState.navigationTimer) {
      clearTimeout(globalNavigationState.navigationTimer);
      globalNavigationState.navigationTimer = null;
    }
    
    // 设置导航状态
    updateGlobalNavigationState(true, href);
    setIsNavigating(true);
    setPendingUrl(href);
    
    // 添加安全超时，确保不会无限期等待
    globalNavigationState.navigationTimer = setTimeout(() => {
      if (globalNavigationState.isNavigating) {
        // 如果导航状态持续超过5秒，强制完成导航
        completeNavigation();
      }
    }, 5000);
  }, [router, currentPathname]);

  const completeNavigation = useCallback(() => {
    const url = globalNavigationState.pendingUrl;
    
    // 清除任何现有的计时器
    if (globalNavigationState.navigationTimer) {
      clearTimeout(globalNavigationState.navigationTimer);
      globalNavigationState.navigationTimer = null;
    }
    
    // 确保最小加载时间为500ms，避免闪烁
    const elapsed = Date.now() - globalNavigationState.navigationStartTime;
    const delay = Math.max(0, 500 - elapsed);
    
    setTimeout(() => {
      if (url) {
        router.push(url);
      }
      
      // 重置状态
      updateGlobalNavigationState(false, null);
      setIsNavigating(false);
      setPendingUrl(null);
    }, delay);
  }, [router]);

  const cancelNavigation = useCallback(() => {
    // 清除任何现有的计时器
    if (globalNavigationState.navigationTimer) {
      clearTimeout(globalNavigationState.navigationTimer);
      globalNavigationState.navigationTimer = null;
    }
    
    // 重置状态
    updateGlobalNavigationState(false, null);
    setIsNavigating(false);
    setPendingUrl(null);
  }, []);

  return (
    <NavigationContext.Provider 
      value={{ 
        isNavigating, 
        startNavigation, 
        completeNavigation, 
        cancelNavigation,
        pendingUrl
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
} 