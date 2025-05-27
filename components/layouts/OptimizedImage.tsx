'use client';

import Image from 'next/image';
import { CSSProperties, useState, useEffect } from 'react';
import { SyntheticEvent } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  unoptimized?: boolean;
  isDropdownImage?: boolean;
  forceUnoptimized?: boolean;
}

/**
 * 优化的图像组件，统一应用最佳实践
 * 
 * 特性:
 * - 自动支持WebP格式（添加.webp后缀）
 * - 智能错误处理和占位符
 * - 自动质量控制
 */
export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = "",
  style = {},
  fill = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px",
  quality = 85,
  objectFit = "contain",
  loading,
  onLoad,
  onError,
  unoptimized = false,
  isDropdownImage = false,
  forceUnoptimized = false,
  ...props
}: OptimizedImageProps) {
  // 内联base64占位符图片
  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNlOWU5ZTkiLz48L3N2Zz4=';
  
  // 处理WebP格式
  const getOptimizedSrc = (imageSrc: string): string => {
    try {
      // 如果是外部URL，直接使用
      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
        return imageSrc;
      }
      
      // 确保内部路径以/开头
      if (!imageSrc.startsWith('/')) {
        imageSrc = `/${imageSrc}`;
      }
      
      return imageSrc;
    } catch (error) {
      return '/images/placeholder.jpg';
    }
  };
  
  // 初始化图片源
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src) return fallbackImage;
    return getOptimizedSrc(src);
  });
  
  // 从图片路径生成更好的alt文本（如果没有提供）
  const generateAltFromSrc = (src: string): string => {
    if (!src || src === fallbackImage) return "Image placeholder";
    
    try {
      // 提取文件名并移除扩展名
      let fileName = src.split('/').pop() || '';
      fileName = fileName.split('.')[0];
      
      // 将连字符和下划线替换为空格
      const processedName = fileName.replace(/[-_]/g, ' ');
      
      // 首字母大写处理
      return processedName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch (error) {
      return "Product image";
    }
  };
  
  // 决定使用的alt文本
  const effectiveAlt = alt || generateAltFromSrc(imgSrc);
  
  const [isError, setIsError] = useState(false);
  
  // 使用 useEffect 检查图片是否存在
  useEffect(() => {
    if (typeof window !== 'undefined' && imgSrc && !imgSrc.startsWith('data:')) {
      // 创建一个测试用的Image对象来预检图片是否可以加载
      const testImage = new window.Image();
      testImage.src = imgSrc;
      
      testImage.onload = () => {
        // 成功加载，无需操作
      };
      
      testImage.onerror = () => {
        // 静默失败，设置为占位图
        setImgSrc('/images/placeholder.jpg');
        setIsError(true);
      };
    }
  }, [imgSrc]);

  // 处理图片加载错误
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    // 设置为错误状态
    setIsError(true);
    
    // 使用占位符
    setImgSrc('/images/placeholder.jpg');
      
    if (onError) {
      onError();
    }
  };

  // 处理图片加载完成
  const handleLoad = () => {
    if (onLoad) {
      onLoad();
    }
  };

  // 默认样式集成对象适配
  const defaultStyle: CSSProperties = {
    maxWidth: '100%',
    objectFit: objectFit as any,
    ...style
  };

  // 默认className
  const defaultClassName = `optimized-image ${className}`;
  
  // 解决priority和loading冲突
  // 如果设置了priority，则不应该设置loading
  const imgLoading = priority ? undefined : (loading || 'lazy');

  return (
    <>
      <Image
        src={imgSrc}
        alt={effectiveAlt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={isDropdownImage ? true : priority}
        className={defaultClassName}
        style={defaultStyle}
        loading={isDropdownImage ? 'eager' : imgLoading}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={forceUnoptimized ? true : (isDropdownImage ? true : unoptimized)}
        {...props}
      />
    </>
  );
} 