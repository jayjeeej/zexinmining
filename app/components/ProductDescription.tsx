'use client';

import React from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface ProductDescriptionProps {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  keyFeaturesZh?: string[];
  keyFeaturesEn?: string[];
  applicationsZh?: string[];
  applicationsEn?: string[];
}

/**
 * 产品描述组件 - 使用更好的语义HTML结构展示产品信息
 * 这样的结构更易于搜索引擎理解，同时提供更好的用户体验
 */
export default function ProductDescription({
  titleZh,
  titleEn,
  descriptionZh,
  descriptionEn,
  keyFeaturesZh,
  keyFeaturesEn,
  applicationsZh,
  applicationsEn,
}: ProductDescriptionProps) {
  const { isZh } = useLanguage();
  
  const title = isZh ? titleZh : titleEn;
  const description = isZh ? descriptionZh : descriptionEn;
  const keyFeatures = isZh ? keyFeaturesZh : keyFeaturesEn;
  const applications = isZh ? applicationsZh : applicationsEn;
  
  return (
    <article className="product-description">
      <h1 className="text-3xl font-bold mb-6" itemProp="name">
        {title}
      </h1>
      
      <div className="mb-8" itemProp="description">
        <p className="text-lg text-gray-700">
          {description}
        </p>
      </div>
      
      {keyFeatures && keyFeatures.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {isZh ? '主要特点' : 'Key Features'}
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </section>
      )}
      
      {applications && applications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {isZh ? '应用领域' : 'Applications'}
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            {applications.map((application, index) => (
              <li key={index} className="text-gray-700">{application}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
} 