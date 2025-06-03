'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';

// 定义特性和技术优势的类型
interface Feature {
  title: string;
  description: string;
}

interface ProductFeaturesAccordionProps {
  features: string[] | Feature[];
  technicalAdvantages?: {
    title: string;
    description: string;
  }[];
  locale?: string;
}

export default function ProductFeaturesAccordion({ 
  features, 
  technicalAdvantages = [], 
  locale 
}: ProductFeaturesAccordionProps) {
  // 优先使用传入的locale，如果没有则使用next-intl的locale
  const nextLocale = useLocale();
  const isZh = locale ? locale === 'zh' : nextLocale === 'zh';
  
  // 存储当前打开的特性索引数组
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  
  // 处理特性点击
  const toggleFeature = (index: number) => {
    setOpenIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };
  
  // 将字符串数组转换为特性对象数组
  const formattedFeatures: Feature[] = features.map((feature, index) => {
    // 如果已经是Feature对象格式，直接返回
    if (typeof feature === 'object' && feature.title && feature.description) {
      return feature as Feature;
    }
    
    // 查找对应的技术优势项（如果有）
    const advantage = technicalAdvantages[index];
    
    // 创建Feature对象
    return {
      title: typeof feature === 'string' ? feature : (feature as any).title || '',
      description: advantage?.description || ''
    };
  });
  
  return (
    <section id="features" className="mb-16 lg:mb-32 scroll-mt-32">
      <div className="contain">
        <h2 className="text-3xl lg:text-4xl mb-10 text-left pb-4 font-headline">
          {isZh ? '特点与技术优势' : 'Features & Technical Advantages'}
        </h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
          {formattedFeatures.map((feature, index) => (
            <div key={index} className="border-b border-gray-200 w-full pb-2 max-w-lg mx-auto">
              {/* 特性标题作为手风琴标题 */}
              <button
                onClick={() => toggleFeature(index)}
                className="flex justify-between items-center w-full text-left py-4 focus:outline-none"
              >
                <span className="text-lg md:text-xl text-gray-900 font-headline line-clamp-2 pr-6">{feature.title}</span>
                <div className="ml-auto flex-shrink-0">
                  <span className={`block w-4 border-t border-[#ff6633] ${openIndices.includes(index) ? 'rotate-45 translate-y-0.5' : ''} transition-transform duration-300`}></span>
                  <span className={`block w-4 border-t border-[#ff6633] mt-1 ${openIndices.includes(index) ? '-rotate-45' : ''} transition-transform duration-300`}></span>
                </div>
              </button>
              
              {/* 特性详细描述作为手风琴内容 */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndices.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-4 pr-4 pb-4">
                  <p className="text-base text-gray-700 leading-relaxed font-text">
                    {feature.description || (isZh 
                      ? '此特性提供了产品的关键功能和技术优势。' 
                      : 'This feature provides key functionality and technical advantages for the product.')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 