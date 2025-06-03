'use client';

import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQsProps {
  faqs: FAQ[];
  locale: string;
}

const ProductFAQs: React.FC<ProductFAQsProps> = ({ faqs, locale }) => {
  if (!faqs || faqs.length === 0) return null;
  
  const isZh = locale === 'zh';
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faqs" className="py-16 lg:py-24 bg-black">
      <div className="contain">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* 左侧标题区域 */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl lg:text-4xl text-white mb-4 font-headline">
              {isZh ? '常见问题' : 'Frequently Asked Questions'}
            </h2>
          </div>
        
          {/* 右侧FAQ列表 */}
          <div className="lg:w-2/3">
            <div className="bg-black shadow-sm overflow-hidden">
              {faqs.map((faq, index) => (
                <div key={index} className={`border-b border-gray-500 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full text-left py-4 px-0 focus:outline-none transition-colors group"
                  >
                    <span className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors duration-200 font-headline pr-8">{faq.question}</span>
                    <span className="text-3xl transition-transform duration-300 text-[#ff6633]">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="py-6">
                      <p className="text-base text-gray-400 leading-relaxed font-text">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQs;