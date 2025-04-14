'use client';

import React from 'react';
import ProductPageTemplate from '@/app/components/products/ProductPageTemplate';

// 客户端分级设备组件 
export default function ClientClassificationProductPage({ params }: { params: { id: string } }) {
  return (
    <ProductPageTemplate
      params={params}
      productCategory="classification"
    />
  );
} 