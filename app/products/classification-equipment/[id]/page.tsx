'use client';

import React from 'react';
import ProductPageTemplate from '@/app/components/products/ProductPageTemplate';

// 分级设备动态路由页面
export default function ClassificationProductPage({ params }: { params: { id: string } }) {
  return (
    <ProductPageTemplate
      params={params}
      productCategory="classification"
    />
  );
} 