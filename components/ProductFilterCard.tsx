import React from "react";
import Link from "next/link";
import OptimizedImage from "./layouts/OptimizedImage";

interface ProductMeta {
  key: string;
  displayValue: string;
}

interface ProductFilterCardProps {
  id: string;
  title: string;
  imageSrc: string;
  productCategory: string;
  meta: ProductMeta[];
  href: string;
  className?: string;
}

const ProductFilterCard: React.FC<ProductFilterCardProps> = ({ 
  id,
  title, 
  imageSrc, 
  productCategory,
  meta,
  href,
  className = "" 
}) => {
  // 图片固定宽高比例 - 改为4:3比例，更适合产品展示
  const imageRatio = 4/3;
  const isSvg = imageSrc?.endsWith?.('.svg');
  const altText = title || "产品图片";
  
  // 占位符图片URL
  const placeholderSrc = '/images/placeholder.jpg';

  // 获取实际显示的图片URL
  const getDisplayImageSrc = () => {
    if (!imageSrc) {
      return placeholderSrc;
    }
    return imageSrc;
  };

  // 生成唯一标识符
  const cardId = `product-${id || title.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div 
      className={`group relative h-full rounded-xs bg-white pb-8 product-card ${className}`}
      style={{ minHeight: '480px' }} // 固定最小高度，确保布局稳定
      data-card-id={cardId}
    >
      <div className="mb-8">
        {/* 使用与CategoryCard相同的布局方式 */}
        <div className="mb-2 overflow-hidden">
          <div className="relative w-full aspect-[4/3]">
          {isSvg ? (
            <img 
              src={getDisplayImageSrc()}
              alt={altText}
                className="w-full h-full object-cover"
              width={800}
              height={600}
                loading="eager"
              style={{ opacity: 1 }}
            />
          ) : (
            <OptimizedImage 
              src={getDisplayImageSrc()}
              alt={altText}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover"
                loading="eager"
                quality={70}
                unoptimized={true}
                priority={true}
              onError={() => console.warn(`图片加载失败: ${imageSrc}, 使用占位图像`)}
            />  
         )}
          </div>
     </div>
      </div>
      
      <div className="flex flex-col gap-4 self-stretch px-5">
        <div className="text-gray-500">
          <span>{productCategory || ' '}</span>
        </div>
        
        <p className="leading-none decoration-2 group-hover:underline group-hover:decoration-[#ff6633] sm:underline-offset-4 sm:text-2xl text-xl font-medium font-display">
          {title || ' '}
        </p>
        
        <dl className="mt-2 flex flex-col gap-4 font-text">
          {meta && meta.map((item, index) => (
            <div key={`${id}-meta-${index}`} className="flex flex-wrap justify-between gap-x-2">
              <dt className="font-bold">{item.key}</dt>
              <dd className="has-[ul]:w-full">{item.displayValue}</dd>
            </div>
          ))}
        </dl>
      </div>
      
      <Link href={href} className="after:absolute after:inset-0 after:content-['']" prefetch={false}>
        <span className="sr-only">{title}</span>
      </Link>
    </div>
  );
};

export default ProductFilterCard; 