'use client';

import { useNavigation } from '../contexts/NavigationContext';

/**
 * 通过上下文导航替代直接的router.push
 * 这样可以确保在数据加载完成后再进行页面跳转
 * 
 * 示例使用：
 * const { navigateTo } = useNavigationHelpers();
 * 
 * // 然后在事件处理函数中使用
 * const handleButtonClick = () => {
 *   navigateTo('/some-path');
 * };
 */
export function useNavigationHelpers() {
  const { startNavigation } = useNavigation();
  
  const navigateTo = (href: string) => {
    startNavigation(href);
  };
  
  return { navigateTo };
} 