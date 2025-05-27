'use client';

import React, { useState, useRef } from 'react';
import { LazyImage } from './LazyLoadWrapper';
import { Product } from '../lib/productDataSchema';
import OptimizedImage from './layouts/OptimizedImage';

interface ProductImageProps {
  product: Product;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// 扩展Product类型，添加可能不在原始类型定义中的属性
interface ExtendedProduct extends Product {
  thumbnailSrc?: string;
  relatedProducts?: Array<string | { id: string }>;
}

/**
 * SEO优化的产品图片组件
 * 包含适当的alt文本、描述和结构化标记
 */
export default function ProductImage({
  product,
  width,
  height,
  priority = false,
  className,
  style,
  onClick
}: ProductImageProps) {
  if (!product || !product.imageSrc) return null;
  
  // 类型扩展
  const extendedProduct = product as ExtendedProduct;
  
  // 构建描述性alt文本
  const altText = `${product.title} - ${product.model || ''} ${product.series ? `| ${product.series}` : ''} ${product.productCategory ? `| ${product.productCategory}` : ''}`.trim();
  
  // 图片描述
  const imageDescription = product.overview || `${product.title} by Zexin Mining Equipment`;
  
  // 计算缩略图URL（如果有）
  const thumbnailSrc = extendedProduct.thumbnailSrc || product.imageSrc;
  
  // 如果是高优先级图片，不使用懒加载
  if (priority) {
    return (
      <div 
        className={`product-image-container ${className || ''}`}
        style={style}
        onClick={onClick}
        itemScope
        itemType="https://schema.org/ImageObject"
      >
        <OptimizedImage
          src={product.imageSrc}
          alt={altText}
          width={typeof width === 'number' ? width : 800}
          height={typeof height === 'number' ? height : 800}
          className="product-image"
          priority
          quality={90}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={true}
        />
        {/* 隐藏的结构化数据 */}
        <meta itemProp="contentUrl" content={product.imageSrc} />
        <meta itemProp="name" content={product.title} />
        <meta itemProp="description" content={imageDescription} />
        <meta itemProp="representativeOfPage" content="true" />
        {product.model && <meta itemProp="productID" content={product.model} />}
      </div>
    );
  }
  
  // 自定义Next.js Image与LazyImage集成
  // 创建一个包装组件来整合两者优势
  const NextImageWithLazyLoading = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    
  return (
      <LazyImage
        src={product.imageSrc}
        alt={altText}
        width={typeof width === 'number' ? width : 800}
        height={typeof height === 'number' ? height : 800}
        className="product-image"
        placeholderSrc={thumbnailSrc}
        useNextImage={true}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => {
          // 图片加载完成后，可以触发预加载相关产品等操作
          if (extendedProduct.relatedProducts && extendedProduct.relatedProducts.length > 0 && typeof window !== 'undefined') {
            // 导入动态加载，防止服务器端渲染错误
            import('../lib/api').then(({ preloadRelatedProductsMetadata }) => {
              const locale = document.documentElement.lang || 'zh';
              if (preloadRelatedProductsMetadata) {
                const relatedIds = extendedProduct.relatedProducts?.map(p => 
                  typeof p === 'string' ? p : p.id
                ) || [];
                preloadRelatedProductsMetadata(relatedIds, locale);
              }
            });
          }
        }}
      />
    );
  };
  
  // 使用懒加载方式
  return (
    <div 
      className={`product-image-container ${className || ''}`}
      style={style}
      onClick={onClick}
      itemScope
      itemType="https://schema.org/ImageObject"
    >
      <NextImageWithLazyLoading />
      {/* 隐藏的结构化数据 */}
      <meta itemProp="name" content={product.title} />
      <meta itemProp="description" content={imageDescription} />
      <meta itemProp="representativeOfPage" content="true" />
      {product.model && <meta itemProp="productID" content={product.model} />}
    </div>
  );
} 