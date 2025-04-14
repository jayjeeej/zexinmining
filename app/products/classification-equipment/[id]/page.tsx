'use client';

import React from 'react';
import ProductPageTemplate from '@/app/components/products/ProductPageTemplate';
import classificationProducts from '@/public/data/products/classification-products.json';

// 为静态导出生成所有可能的参数路径
export async function generateStaticParams() {
  // 从JSON文件动态获取所有分级设备的ID
  return classificationProducts.map(product => ({
    id: product.id,
  }));
}

// 分级设备动态路由页面
export default function ClassificationProductPage({ params }: { params: { id: string } }) {
  return (
    <ProductPageTemplate
      params={params}
      productCategory="classification"
    />
  );
} 