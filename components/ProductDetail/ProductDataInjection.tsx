'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ProductData } from '@/lib/productDataSchema';
import { preloadProductData, preloadRelatedProductsMetadata } from '@/lib/api';

interface ProductDataInjectionProps {
  product: ProductData;
  locale: string;
  children?: React.ReactNode;
}

/**
 * 组件用于将产品数据注入到客户端，实现数据预加载
 * 这个组件应该在产品详情页的最外层包裹其他组件
 */
export default function ProductDataInjection({ product, locale, children }: ProductDataInjectionProps) {
  const router = useRouter();
  const pathname = usePathname(); // 添加pathname钩子以监听路径变化
  
  // 验证产品数据是否有效
  useEffect(() => {
    // 如果产品数据无效，记录错误
    if (!product || typeof product !== 'object') {
      console.error('[ProductDataInjection] Invalid product data:', product);
      return;
    }
    
    // 如果缺少关键字段，也记录错误
    if (!product.id || !product.title) {
      console.error('[ProductDataInjection] Product data missing critical fields:', product);
    }
    
    try {
      // 清除现有的product_data脚本，确保每次导航都使用新数据
      const existingDataScript = document.getElementById('product_data');
      if (existingDataScript) {
        document.head.removeChild(existingDataScript);
      }
      
      // 创建脚本元素预加载产品数据
      const script = document.createElement('script');
      script.id = `preloaded_${product.id}`;
      script.type = 'application/json';
      script.setAttribute('data-locale', locale);
      script.setAttribute('data-path', pathname || ''); // 添加路径标记
      script.textContent = JSON.stringify(product);
      document.head.appendChild(script);
      
      // 创建product_data脚本用于组件访问
      const dataScript = document.createElement('script');
      dataScript.id = 'product_data';
      dataScript.type = 'application/json';
      dataScript.setAttribute('data-path', pathname || ''); // 添加路径标记
      dataScript.textContent = JSON.stringify(product);
      document.head.appendChild(dataScript);
      
      console.log(`[ProductDataInjection] Product data injected for ${product.id} (${locale}) on path ${pathname}`);
      
      // 清理函数：组件卸载时移除脚本
      return () => {
        try {
          const scriptToRemove = document.getElementById(`preloaded_${product.id}`);
          if (scriptToRemove) {
            document.head.removeChild(scriptToRemove);
          }
          
          // 不再需要保留product_data脚本，它会在下次导航时被清除
        } catch (error) {
          console.error('[ProductDataInjection] Error removing script:', error);
        }
      };
    } catch (error) {
      console.error('[ProductDataInjection] Error injecting product data:', error);
    }
  }, [product, locale, pathname]); // 添加pathname作为依赖项，确保路径变化时重新注入数据
  
  // 如果产品数据无效，显示错误提示
  if (!product || typeof product !== 'object' || !product.id) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          {locale === 'zh' ? '数据加载错误' : 'Error Loading Product Data'}
        </h2>
        <p className="text-gray-700">
          {locale === 'zh' 
            ? '无法加载产品数据，请刷新页面或稍后再试。' 
            : 'Unable to load product data. Please refresh the page or try again later.'}
        </p>
        <button 
          onClick={() => router.refresh()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {locale === 'zh' ? '刷新页面' : 'Refresh Page'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 