'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import Image from 'next/image';
import OptimizedImage from './layouts/OptimizedImage';

interface LazyLoadWrapperProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  onVisible?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 智能懒加载包装器组件
 * 利用IntersectionObserver实现元素进入视口时才加载内容
 */
export default function LazyLoadWrapper({
  children,
  placeholder,
  rootMargin = '200px 0px',
  threshold = 0.1,
  onVisible,
  className,
  style
}: LazyLoadWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 如果浏览器不支持IntersectionObserver，直接显示内容
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      if (onVisible) onVisible();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (onVisible) onVisible();
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, [rootMargin, threshold, onVisible]);

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : placeholder || <div className="loading-placeholder" style={{ minHeight: '50px' }} />}
    </div>
  );
}

/**
 * 增强版懒加载图片组件
 * 支持传统img标签和Next.js的OptimizedImage组件
 * 在图片进入视口前显示低质量占位图或模糊效果
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  placeholderSrc,
  blurDataURL,
  onLoad,
  useNextImage = true, // 默认使用优化的图片组件
  quality = 80,
  sizes,
  objectFit = 'cover'
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  placeholderSrc?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  useNextImage?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 内联base64占位符图片
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNlOWU5ZTkiLz48L3N2Zz4=';
  
  const actualPlaceholderSrc = placeholderSrc || blurDataURL || defaultPlaceholder;

  // 处理图片加载完成事件
  const handleImageLoaded = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // 处理图片加载错误
  const handleImageError = () => {
    console.warn(`LazyImage: Failed to load image: ${src}`);
    setImgError(true);
  };

  useEffect(() => {
    if (!isVisible) return;

    const img = imageRef.current;
    if (img && img.complete) {
      handleImageLoaded();
    }
  }, [isVisible]);

  // 图片可见时的回调
  const handleVisible = () => {
    setIsVisible(true);
  };

  // 确定占位图
  const placeholder = (
    <img
      src={actualPlaceholderSrc}
      alt={`${alt} - 加载中`}
      width={width}
      height={height}
      className={`${className} placeholder-image`}
      style={{
        ...style,
        filter: blurDataURL ? 'blur(10px)' : undefined,
        transition: 'opacity 0.3s ease'
      }}
    />
  );

  return (
    <LazyLoadWrapper
      onVisible={handleVisible}
      placeholder={placeholder}
      className={className}
      style={style}
    >
      {isVisible && (
        useNextImage ? (
          <OptimizedImage
            src={src}
            alt={alt}
            width={typeof width === 'number' ? width : 800}
            height={typeof height === 'number' ? height : 800}
            className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
            style={{
              ...style,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              objectFit
            }}
            loading="lazy"
            priority={false}
            quality={quality}
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            onLoad={handleImageLoaded}
            unoptimized={true}
          />
        ) : (
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
            style={{
              ...style,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            onLoad={handleImageLoaded}
            onError={handleImageError}
          />
        )
      )}
    </LazyLoadWrapper>
  );
} 