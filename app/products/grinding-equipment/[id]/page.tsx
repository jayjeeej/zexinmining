import React from 'react';
import { notFound } from 'next/navigation';
import ProductClient from '@/app/products/grinding-equipment/[id]/ProductClient';

// 为静态导出生成所有可能的参数路径
export function generateStaticParams() {
  return [
    { id: 'dry-grid-ball-mill' },
    { id: 'wet-grid-ball-mill' },
    { id: 'overflow-ball-mill' },
    { id: 'rod-mill' }
  ];
}

// 动态路由页面，根据ID显示不同磨机产品
export default async function GrindingProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    // 在服务器端获取产品数据 - 使用绝对路径或process.cwd()
    const productData = await import(`@/public/data/products/${id}.json`);
    const product = productData.default || productData;
    
    return <ProductClient product={product} id={id} />;
  } catch (error) {
    console.error('获取产品数据出错:', error);
    notFound();
  }
} 