'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { getFormattedProductData } from '@/app/utils/productUtils';
import { notFound } from 'next/navigation';

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
export default function GrindingProductPage({ params }: { params: { id: string } }) {
  const { isZh } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  useEffect(() => {
    // 获取产品数据
    async function fetchProductData() {
      try {
        const response = await fetch(`/data/products/${id}.json`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error(`无法加载产品数据: ${id}`);
        }
      } catch (error) {
        console.error('获取产品数据出错:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);

  // 如果数据正在加载，显示加载状态
  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // 如果没有数据，返回404
  if (!product) {
    notFound();
  }

  // 使用统一的工具函数处理产品数据
  const productProps = getFormattedProductData(product, id, 'grinding');

  // 如果getFormattedProductData返回null，也返回404
  if (!productProps) {
    notFound();
  }

  return <ProductDetailTemplate {...productProps} />;
} 