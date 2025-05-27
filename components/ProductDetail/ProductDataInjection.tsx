'use client';

import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (product) {
      // 手动注入产品数据到DOM
      injectProductData(product);
      
      // 在客户端将产品数据预加载到DOM
      preloadProductData(product.id, locale);
      
      // 如果存在相关产品，预加载相关产品的元数据
      if (product.relatedProducts && product.relatedProducts.length > 0) {
        preloadRelatedProductsMetadata(product.relatedProducts, locale);
      }
    }
  }, [product, locale]);

  // 创建一个将产品数据注入DOM的函数
  function injectProductData(data: ProductData) {
    // 仅在客户端执行
    if (typeof document === 'undefined') return;
    
    // 检查是否已存在数据脚本
    let dataScript = document.getElementById('product_data');
    
    // 如果不存在，创建一个新的
    if (!dataScript) {
      dataScript = document.createElement('script');
      dataScript.id = 'product_data';
      (dataScript as HTMLScriptElement).type = 'application/json';
      document.head.appendChild(dataScript);
    }
    
    // 将数据注入脚本
    try {
      dataScript.textContent = JSON.stringify(data);
    } catch (error) {
      console.error('注入产品数据出错');
    }
  }

  return <>{children}</>;
} 