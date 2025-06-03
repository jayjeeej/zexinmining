'use client';

import { useLocale } from 'next-intl';
import OptimizedImage from '../layouts/OptimizedImage';

interface Meta {
  key: string;
  displayValue: string;
}

interface ProductHeroProps {
  title: string;
  series: string;
  imageSrc: string;
  imageSrcAlt?: string;
  meta: Meta[];
  showOverview?: boolean;
}

export default function ProductHero({ title, series, imageSrc, imageSrcAlt, meta, showOverview = true }: ProductHeroProps) {
  const locale = useLocale();
  const isZh = locale === 'zh';

  return (
    <section className="overflow-x-hidden bg-gray-50">
      <div className="md:contain">
        <div className="md:-mr-8 lg:-mr-16 container-w:mr-[calc((var(--max-width)_-_100vw)_/_2_-_4rem)]">
          <div className="w-full md:flex md:items-stretch md:gap-16">
            {/* 左侧产品信息 */}
            <div className="w-1/3 py-8 max-md:contain">
              <p className="mb-3 text-gray-500 font-text">{series}</p>
              <h1 className="mb-3 text-5xl lg:text-4xl xl:text-5xl hyphens-auto word-break-auto font-display text-balance">
                {title}
              </h1>
              <dl className="flex flex-col font-text">
                {meta.map((item, index) => (
                  <div key={index} className="flex flex-col gap-y-2 border-b border-gray-100 py-2 lg:py-5">
                    <dt className="text-gray-500 font-text">{item.key}</dt>
                    <dd className="text-lg font-text">{item.displayValue}</dd>
                  </div>
                ))}
              </dl>
            </div>
            
            {/* 右侧产品图片 - 使用优化的图像组件 */}
            <div className="sm-max:mt-8 overflow-hidden md:w-2/3 flex items-center justify-center h-[500px] max-h-[500px]">
              <div className="relative w-full max-w-[800px] h-auto max-h-[500px] overflow-hidden">
                <OptimizedImage
                src={imageSrc}
                alt={imageSrcAlt || `${title} | ${series} - ${isZh ? '产品规格：' : 'Specifications: '}${meta.map(m => `${m.key}: ${m.displayValue}`).join(', ')}`}
                  width={800}
                  height={500}
                  priority
                quality={90}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="w-auto h-auto max-w-full max-h-[500px] mx-auto"
                  style={{
                    maxWidth: '100%', 
                    maxHeight: '500px'
                  }}
                  unoptimized={true}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 