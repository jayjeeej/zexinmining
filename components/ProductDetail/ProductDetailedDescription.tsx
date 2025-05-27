'use client';

import { useLocale } from 'next-intl';

interface ProductDetailedDescriptionProps {
  detailedDescription: string;
}

export default function ProductDetailedDescription({ detailedDescription }: ProductDetailedDescriptionProps) {
  const locale = useLocale();
  const isZh = locale === 'zh';

  return (
    <div className="w-full bg-black py-20 md:py-24">
      <div className="contain mx-auto">
        <p className="text-white text-base sm:text-lg md:text-2xl lg:text-[30px] xl:text-[30px] font-light leading-relaxed font-montserrat whitespace-pre-wrap">
          {detailedDescription}
        </p>
      </div>
    </div>
  );
} 