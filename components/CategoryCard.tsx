import OptimizedImage from "./layouts/OptimizedImage";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  linkUrl: string;
  altText: string;
  className?: string;
}

export default function CategoryCard({ 
  title, 
  description, 
  imageSrc, 
  linkUrl, 
  altText,
  className = "" 
}: CategoryCardProps) {
  // 生成唯一标识符，用于帮助浏览器识别组件
  const cardId = `category-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div 
      className={`group relative flex flex-col h-full rounded-xs bg-white hover:shadow-lg category-card ${className}`}
      data-card-id={cardId}
    >
      <div className="mb-2 overflow-hidden rounded-t-xs">
        <div className="relative w-full aspect-[4/3]">
          <OptimizedImage 
            className="w-full rounded-t-xs object-cover" 
            src={imageSrc} 
            alt={altText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={70}
            unoptimized={true}
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow px-4 pt-8 pb-8 sm:px-8">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <p className="leading-none decoration-2 group-hover:underline group-hover:decoration-[#ff6633] sm:underline-offset-4 sm:text-2xl text-xl font-medium font-display mb-5">
              {title}
            </p>
            <p className="text-gray-600 font-text line-clamp-4">
              {description}
            </p>
          </div>
        </div>
      </div>
      <Link href={linkUrl} className="absolute left-0 top-0 h-full w-full" prefetch={false}>
        <span className="sr-only">{altText}</span>
      </Link>
    </div>
  );
} 