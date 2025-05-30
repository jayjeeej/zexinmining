'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PageTransition from '../PageTransition';
import ProductLayout from '@/components/layouts/ProductLayout';
import { clearAllCache } from '../../lib/usePageData';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import Breadcrumb from '@/components/Breadcrumb';
import HeroSection from '@/components/HeroSection';
import { getNavigationItems, getLogo } from '@/lib/navigation';

// 扩展Window接口，添加预加载数据
declare global {
  interface Window {
    __PRELOADED_DATA__?: Record<string, any>;
  }
}

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export interface LayoutWithTransitionProps {
  children: ReactNode;
  locale: string;
  breadcrumbItems: BreadcrumbItem[];
  title?: string;
  description?: string | ReactNode;
  structuredData?: any;
  preloadedData?: any;
  productTabs?: ReactNode;
}

export default function LayoutWithTransition({
  children,
  locale,
  breadcrumbItems,
  title,
  description,
  structuredData,
  preloadedData,
  productTabs
}: LayoutWithTransitionProps) {
  const pathname = usePathname();
  
  // 全局初始化和数据预处理
  useEffect(() => {
    // 将预加载数据注入到全局对象，供客户端组件使用
    if (typeof window !== 'undefined' && preloadedData && pathname) {
      window.__PRELOADED_DATA__ = window.__PRELOADED_DATA__ || {};
      const key = pathname as string;
      Object.assign(window.__PRELOADED_DATA__, { [key]: preloadedData });
    }
    
    // 检测应用激活状态
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 获取上次激活时间
        const lastActiveTime = parseInt(
          localStorage.getItem('app_last_active_time') || '0',
          10
        );
        
        const now = Date.now();
        // 如果超过30分钟未激活，刷新所有缓存
        if (now - lastActiveTime > 30 * 60 * 1000) {
          clearAllCache();
        }
        
        // 更新激活时间
        localStorage.setItem('app_last_active_time', String(now));
      }
    };
    
    // 首次加载设置激活时间
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_last_active_time', String(Date.now()));
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [pathname, preloadedData]);
  
  return (
    <PageTransition>
      <ProductLayout
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        title={title}
        description={description}
        structuredData={structuredData}
        productTabs={productTabs}
      >
        {children}
      </ProductLayout>
    </PageTransition>
  );
} 