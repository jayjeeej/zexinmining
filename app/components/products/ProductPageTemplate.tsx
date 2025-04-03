'use client';

import React from 'react';
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

  // 构造产品数据
  const product = {
    id: params.id,
    model: params.id,
    series: {
      zh: '',
      en: ''
    },
    isClassifierProduct: productCategory === 'classification',
    isFlotationProduct: productCategory === 'flotation',
    isWasherProduct: productCategory === 'washers',
    isScreenProduct: productCategory === 'screens',
    isCrusherProduct: productCategory === 'crushers',
    isFeederProduct: productCategory === 'feeders',
    isMillProduct: productCategory === 'grinding',
    isGravitySeparationProduct: productCategory === 'gravity-separation'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductCard 
        product={product}
        showDetails={true}
      />
    </div>
  );
} 