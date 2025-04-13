'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * 简单的图片组件属性
 */
interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

/**
 * 简单的图片组件，具有加载失败后显示备用图片的功能
 */
export default function ImageWithFallback({
  src,
  fallbackSrc = '/images/placeholder.png',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  // 处理图片错误
  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
} 