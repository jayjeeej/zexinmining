'use client';

import React from 'react';

interface TechnicalAdvantage {
  title: string;
  description: string;
  iconSrc?: string;
}

interface ProductTechnicalAdvantagesProps {
  advantages: TechnicalAdvantage[];
  locale: string;
}

const ProductTechnicalAdvantages: React.FC<ProductTechnicalAdvantagesProps> = ({ advantages, locale }) => {
  if (!advantages || advantages.length === 0) return null;
  
  const isZh = locale === 'zh';
  
  return (
    <section id="technical-advantages" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-headline">
            {isZh ? '技术优势' : 'Technical Advantages'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-text">
            {isZh ? '了解我们产品的核心技术优势' : 'Discover the core technical advantages of our products'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 font-headline">{advantage.title}</h3>
              <p className="text-gray-600 font-text">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTechnicalAdvantages; 