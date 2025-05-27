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
            <p className="text-base text-gray-300 mb-6 font-text">
            {isZh ? '关于该产品的常见问题解答' : 'Common questions about this product'}
          </p>
        </div>
        
          {/* 右侧FAQ列表 */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-sm overflow-hidden">
          {faqs.map((faq, index) => (
                <div key={index} className={`border-b border-gray-100 ${index === faqs.length - 1 ? 'border-b-0' : ''}`}>
              <button
                onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full text-left p-6 focus:outline-none hover:bg-gray-50 transition-colors"
              >
                    <span className="text-lg font-medium text-gray-900 font-headline pr-8">{faq.question}</span>
                    <span className={`ml-4 flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-500 transition-transform duration-300 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                      </svg>
                </span>
              </button>
              <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                    <div className="px-6 pb-6">
                  <p className="text-base text-gray-700 leading-relaxed font-text">
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