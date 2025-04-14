'use client';

import React from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { getFormattedProductData } from '@/app/utils/productUtils';
import { notFound } from 'next/navigation';

// 客户端组件，负责处理产品数据的展示
export default function ProductClient({ product, id }: { product: any; id: string }) {
  const { isZh } = useLanguage();

  // 使用统一的工具函数处理产品数据
  const productProps = getFormattedProductData(product, id, 'grinding');

  // 如果getFormattedProductData返回null，也返回404
  if (!productProps) {
    notFound();
  }

  return <ProductDetailTemplate {...productProps} />;
} 