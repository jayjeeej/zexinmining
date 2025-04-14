'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../ProductCard';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>未找到产品数据</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductCard 
        product={product}
        showDetails={true}
      />
    </div>
  );
} 