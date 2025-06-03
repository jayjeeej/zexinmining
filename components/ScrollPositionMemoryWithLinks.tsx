'use client';

import { useEffect, useRef } from 'react';

interface ScrollPositionMemoryWithLinksProps {
  /**
   * 用于标识不同页面的存储键名，确保每个页面有独立的状态存储
   * 例如: 'newsPageState', 'casesPageState', 'productsPageState'
   */
  storageKey: string;
  
  /**
   * 返回页面时的标记键名，用于识别从详情页返回到列表页的情况
   * 例如: 'backFromNewsDetail', 'backFromCaseDetail'
   */
  backFromDetailKey: string;
  
  /**
   * 当前页面的语言/地区设置，用于构建链接选择器
   * 例如: 'en', 'zh'
   */
  locale: string;
  
  /**
   * 链接路径前缀，用于构建链接选择器
   * 例如: 'news', 'cases', 'products/ore-processing'
   */
  linkPathPrefix: string;
  
  /**
   * 可选的过滤器或状态对象，当这些值变化时会触发状态保存
   * 例如: [selectedCategory, selectedYear]
   */
  dependencies?: any[];
}

/**
 * 页面位置记忆组件（带链接监听）
 * 
 * 用于记住用户在页面上的滚动位置，当用户从详情页返回或使用浏览器后退按钮时，
 * 自动将页面平滑滚动到之前的位置。同时自动监听页面上的详情链接点击。
 * 
 * @example
 * ```tsx
 * // 在新闻列表页使用
 * <ScrollPositionMemoryWithLinks 
 *   storageKey="newsPageState" 
 *   backFromDetailKey="backFromNewsDetail"
 *   locale="en"
 *   linkPathPrefix="news"
 *   dependencies={[activeFilter, searchTerm]} 
 * />
 * ```
 */
export default function ScrollPositionMemoryWithLinks({
  storageKey,
  backFromDetailKey,
  locale,
  linkPathPrefix,
  dependencies = []
}: ScrollPositionMemoryWithLinksProps) {
  // 状态追踪
  const initialLoadRef = useRef(true);
  const didRestoreScrollRef = useRef(false);
  
  // 保存当前状态到history.state和sessionStorage
  const saveStateToHistory = () => {
    const currentState = {
      scrollPosition: window.scrollY,
      timestamp: Date.now()
    };
    
    try {
      history.replaceState(currentState, '');
      sessionStorage.setItem(storageKey, JSON.stringify(currentState));
    } catch (error) {
      console.error(`Failed to save state for ${storageKey}:`, error);
    }
  };
  
  // 恢复状态
  const restoreState = (state: any, isRecentBack = false) => {
    if (!state) return;
    
    try {
      // 延迟恢复滚动位置以确保内容已渲染
      if (typeof state.scrollPosition === 'number' && !didRestoreScrollRef.current) {
        didRestoreScrollRef.current = true;
        
        // 使用多层RAF嵌套来确保DOM完全更新后再滚动
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 始终使用平滑滚动效果
            window.scrollTo({
              top: state.scrollPosition,
              behavior: 'smooth'
            });
          });
        });
      }
    } catch (error) {
      console.error(`Failed to restore state for ${storageKey}:`, error);
    }
  };
  
  // 初始化和状态恢复
  useEffect(() => {
    // 控制浏览器的滚动恢复行为
    if ('scrollRestoration' in history) {
      // 禁用浏览器默认的滚动位置恢复，让我们自己控制
      history.scrollRestoration = 'manual';
    }
    
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      
      // 首先尝试从history.state恢复
      if (history.state) {
        restoreState(history.state, false);
      } 
      // 否则从sessionStorage恢复
      else {
        const savedState = sessionStorage.getItem(storageKey);
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            restoreState(state, false);
            
            // 同时更新history.state
            history.replaceState(state, '');
          } catch (error) {
            console.error(`Failed to parse saved state for ${storageKey}:`, error);
          }
        }
      }
    }
    
    return () => {
      // 恢复默认行为
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [storageKey]);
  
  // 监听页面滚动，持续更新状态
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // 使用防抖，避免频繁更新
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        saveStateToHistory();
      }, 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [storageKey, ...(dependencies || [])]);
  
  // 监听popstate事件 (浏览器后退/前进按钮)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 检查是否是从详情页返回
      const isBackFromDetail = sessionStorage.getItem(backFromDetailKey) === 'true';
      const backTimestamp = sessionStorage.getItem('backTimestamp');
      
      if (isBackFromDetail) {
        // 清除标记
        sessionStorage.removeItem(backFromDetailKey);
        sessionStorage.removeItem('backTimestamp');
        
        // 检查返回时间，如果刚刚返回就使用平滑滚动
        const isRecentBack = backTimestamp ? (Date.now() - parseInt(backTimestamp)) < 1000 : false;
        
        // 稍微延迟恢复滚动位置，让页面有足够时间准备
        setTimeout(() => {
          if (event.state) {
            // 确保滚动恢复更平滑
            restoreState(event.state, isRecentBack);
          } else {
            // 尝试从sessionStorage获取
            const savedState = sessionStorage.getItem(storageKey);
            if (savedState) {
              try {
                const state = JSON.parse(savedState);
                restoreState(state, isRecentBack);
              } catch (error) {
                console.error(`Failed to parse saved state for ${storageKey}:`, error);
              }
            }
          }
        }, 50); // 略微增加延迟以确保DOM更新
      } else if (event.state) {
        // 正常的浏览器后退/前进操作
        restoreState(event.state, false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [storageKey, backFromDetailKey]);
  
  // 为链接添加详情页返回标记
  useEffect(() => {
    // 保存当前状态的函数
    const saveState = () => {
      saveStateToHistory();
    };
    
    // 构建链接选择器
    const linkSelector = `a[href^="/${locale}/${linkPathPrefix}/"]`;
    
    // 为所有匹配的链接添加点击事件监听器
    const links = document.querySelectorAll(linkSelector);
    links.forEach(link => {
      link.addEventListener('click', () => {
        // 设置标记表示从列表页离开到详情页
        sessionStorage.setItem(backFromDetailKey, 'true');
        sessionStorage.setItem('backTimestamp', Date.now().toString());
        saveState();
      });
    });
    
    // 当用户离开页面时保存状态
    window.addEventListener('beforeunload', saveState);
    
    // 清理函数
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', () => {});
      });
      window.removeEventListener('beforeunload', saveState);
    };
  }, [locale, linkPathPrefix, backFromDetailKey, storageKey, ...(dependencies || [])]);
  
  // 这是一个无UI组件，不渲染任何内容
  return null;
} 