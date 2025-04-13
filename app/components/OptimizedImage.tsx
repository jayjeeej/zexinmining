'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // 在组件挂载后更新状态，避免SSR水合不匹配
  useEffect(() => {
    setMounted(true);
    
    // 如果设置了优先加载，则在挂载时立即设置loaded状态
    if (priority) {
      setLoaded(true);
    }
    
    // 清理函数
    return () => {
      setMounted(false);
    };
  }, [priority]);
  
  // 计算宽高比，以防止布局偏移
  const aspectRatio = width / height;
  
  return (
    <div 
      className={`img-container ${className}`}
      style={{
        aspectRatio: `${aspectRatio}`,
        ...style,
      }}
    >
      {mounted && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={80}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: 'auto',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
    </div>
  );
} 