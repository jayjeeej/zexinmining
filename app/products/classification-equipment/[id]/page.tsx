import React from 'react';
import classificationProducts from '@/public/data/products/classification-products.json';
import ClientClassificationProductPage from './client-component';

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
    <ClientClassificationProductPage params={params} />
  );
} 