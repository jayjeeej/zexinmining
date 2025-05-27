'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '../layouts/OptimizedImage';
import Container from '@/components/Container';

interface CaseStudy {
  title: string;
  description: string;
  results?: string;
  imageSrc?: string;
  href?: string;
}

interface ProductCaseStudiesProps {
  caseStudies: CaseStudy[];
  locale: string;
}

const ProductCaseStudies: React.FC<ProductCaseStudiesProps> = ({ caseStudies, locale }) => {
  if (!caseStudies || caseStudies.length === 0) return null;
  
  const isZh = locale === 'zh';
  
  // 只使用第一个案例研究
  const firstCaseStudy = caseStudies[0];
  
  // 默认图片，如果案例研究没有提供图片
  const defaultImage = "/images/mineral-processing/case-study-default.jpg";
  
  // 确保图片路径正确 - 直接使用原始路径
  const imageSrc = firstCaseStudy.imageSrc || defaultImage;
  
  // 链接地址 - 使用原始路径，不做额外处理
  // 修正：案例研究的路径是 /[locale]/cases/[caseId]，不是 case-studies
  const linkUrl = firstCaseStudy.href || `/${locale}/cases`;
  
  // 增加调试信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 验证图片是否存在，但不打印日志
      const img = new Image();
      img.src = imageSrc;
    }
  }, [firstCaseStudy, imageSrc]);
  
  return (
    <section id="case-studies" className="py-16 lg:py-24 bg-gray-50">
      <Container>
        <div className="py-8 md:py-16">
          <div className="grid gap-8 md:auto-cols-fr md:grid-flow-col lg:gap-16">
            {/* 左侧：文本内容区域 */}
            <div className="flex flex-col items-start justify-between gap-y-8 order-1 max-md:pb-16 pb-8 max-md:order-1">
              <strong>
            {isZh ? '成功案例' : 'Case Studies'}
              </strong>
              <div>
                <h2 className="text-xl md:text-2xl xl:text-[32px] leading-tight text-balance font-headline">
                  {firstCaseStudy.title}
          </h2>
                <div className="prose mt-4 xl:prose-lg lg:mt-8">
                  <p className="text-base">{firstCaseStudy.description}</p>
                </div>
              </div>
              
              <div>
                <Link href={linkUrl} className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover text-current hover:text-current focus:text-current active:text-current">
                  <span className="group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity underline decoration-black decoration-1 underline-offset-4">
                  {isZh ? "查看更多案例研究" : "View more case studies"}
                </span>
                <span className="text-[#ff6633] ml-2 -translate-x-1 group-hover:translate-x-0.5 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 2L9 6L4.5 10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                </span>
              </Link>
                    </div>
                  </div>
          
            {/* 右侧：图片区域 */}
            <div className="relative w-full overflow-hidden rounded" style={{ paddingBottom: '75%', minHeight: '320px', maxHeight: '480px' }}>
              {/* 使用 OptimizedImage */}
              <OptimizedImage 
                className="absolute top-0 left-0 w-full h-full rounded object-cover"
                src={imageSrc}
                alt={firstCaseStudy.title || "Case study image"}
                width={800}
                height={600}
                sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 800px"
                quality={90}
                loading="lazy"
                unoptimized={true}
                forceUnoptimized={true}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center center'
                }}
              />
            </div>
        </div>
      </div>
      </Container>
    </section>
  );
};

export default ProductCaseStudies; 