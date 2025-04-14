'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../ProductCard';
import LoadingWrapper from '@/app/components/LoadingWrapper';

interface ProductPageTemplateProps {
  params: {
    id: string;
  };
  productCategory: string;
}

export default function ProductPageTemplate({ params, productCategory }: ProductPageTemplateProps) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProductData() {
      try {
        // 加载产品数据
        const moduleData = await import(`@/public/data/products/${params.id}.json`);
        const productData = moduleData.default || moduleData;
        
        // 设置产品类型标识
        const enhancedProduct = {
          ...productData,
    isClassifierProduct: productCategory === 'classification',
    isFlotationProduct: productCategory === 'flotation',
    isWasherProduct: productCategory === 'washers',
    isScreenProduct: productCategory === 'screens',
    isCrusherProduct: productCategory === 'crushers',
    isFeederProduct: productCategory === 'feeders',
    isMillProduct: productCategory === 'grinding',
    isGravitySeparationProduct: productCategory === 'gravity-separation'
  };
        
        setProduct(enhancedProduct);
      } catch (error) {
        console.error('加载产品数据失败:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProductData();
  }, [params.id, productCategory]);

  if (!product && !loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>未找到产品数据</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingWrapper 
        isLoading={loading}
        fallback={<div className="min-h-[60vh]"></div>}
      >
        {product && (
      <ProductCard 
        product={product}
        showDetails={true}
      />
        )}
      </LoadingWrapper>
    </div>
  );
} 