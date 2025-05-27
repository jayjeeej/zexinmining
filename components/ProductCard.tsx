'use client';

import OptimizedImage from "@/components/layouts/OptimizedImage";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { twMerge } from 'tailwind-merge';

// 定义产品卡片类型
export interface ProductCardData {
  id: string;
  imageSrc: string;
  category: {
    zh: string;
    en: string;
  };
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  href?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  locale: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function ProductCard({ 
  product, 
  locale, 
  className = "", 
  priority = false,
  onClick 
}: ProductCardProps) {
  const isZh = locale === 'zh';
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 使用交叉观察器检测组件是否在视口中
  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    
    observer.observe(cardRef.current);
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  // 处理点击
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  // 构建产品链接
  const productUrl = product.href || `/${locale}/products/${product.id}`;
  
  return (
    <div 
      ref={cardRef}
      className={twMerge(
        `group relative flex flex-col rounded-xs pb-6 bg-white transition-all duration-300 ease-in-out
         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`,
        isHovered ? 'shadow-md transform scale-[1.01]' : 'shadow-sm',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      data-product-card
    >
      <div className="mb-2 overflow-hidden rounded-t-xs">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <OptimizedImage
            className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
            alt={`${isZh ? product.name.zh : product.name.en} - ${isZh ? product.category.zh : product.category.en} | 泽鑫矿山设备`}
            src={product.imageSrc}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={priority ? "eager" : "lazy"}
            quality={70}
            unoptimized={true}
          />
          {/* 分类标签 */}
          <div className="absolute top-2 left-2 rounded-xs px-2 py-1 text-xs font-medium bg-primary bg-opacity-90 text-white transition-opacity duration-300">
            {isZh ? product.category.zh : product.category.en}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 px-4 pt-3 sm:px-6 flex-grow">
        <div className="sm:flex sm:items-start sm:justify-between gap-3 h-full">
          <div className="h-full flex flex-col">
            <h3 className={`leading-[1.25] text-2xl font-medium transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-800'}`}>
              {isZh ? product.name.zh : product.name.en}
            </h3>
            <p className="mt-3 pb-4 text-gray-600 text-base leading-[1.25] flex-grow">
              {isZh ? product.description.zh : product.description.en}
            </p>
          </div>
          
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full 
            transition-all duration-300 ease-in-out 
            ${isHovered ? 'bg-primary text-white transform translate-x-1' : 'bg-gray-50 text-gray-400'}
            max-sm:ml-auto max-sm:mt-2`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <Link href={productUrl} className="absolute left-0 top-0 h-full w-full" onClick={handleClick} aria-label={`查看${isZh ? product.name.zh : product.name.en}产品详情`}>
        <span className="sr-only">{isZh ? product.name.zh : product.name.en}</span>
      </Link>
    </div>
  );
} 