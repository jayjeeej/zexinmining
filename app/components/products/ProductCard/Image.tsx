'use client';

import { useState } from 'react';
import ImageWithFallback from '../../ImageWithFallback';

interface ProductCardImageProps {
  imageSrc: string;
  title: string;
  isPriority?: boolean;
}

export default function ProductCardImage({ 
  imageSrc, 
  title,
  isPriority = false 
}: ProductCardImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <ImageWithFallback
      src={imageSrc}
      alt={title}
      width={300}
      height={200}
      className="w-full h-full object-cover transition-all"
      style={{
        objectFit: "cover", 
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease-in"
      }}
      onLoad={handleImageLoad}
      priority={isPriority}
      loading="eager"
      crossOrigin="anonymous"
    />
  );
} 