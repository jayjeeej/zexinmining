'use client';

import { useLocale } from 'next-intl';

interface ProductFeaturesProps {
  features: string[];
  locale?: string;
}

export default function ProductFeatures({ features, locale }: ProductFeaturesProps) {
  // 优先使用传入的locale，如果没有则使用next-intl的locale
  const nextLocale = useLocale();
  const isZh = locale ? locale === 'zh' : nextLocale === 'zh';

  return (
    <section id="features" className="mb-16 lg:mb-32 scroll-mt-32">
      <div className="contain">
        <h2 className="text-4xl mb-8 font-headline">{isZh ? '特点与优势' : 'Features & Benefits'}</h2>
        <ul className="flex list-none flex-col gap-6">
          {features.map((feature, index) => (
            <li key={index} className="m-0 border-b border-gray-100 px-0 pb-6 last:border-b-0 last:pb-0">
              <div className="flex flex-col gap-6 sm:flex-row md:gap-8 lg:gap-16">
                <div>
                  <div className="prose mt-4 max-w-6xl max-md:pb-4">
                    <p>{feature}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
} 