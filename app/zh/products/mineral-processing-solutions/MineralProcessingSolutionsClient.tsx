'use client';
// 选矿解决方案客户端组件 - 全新现代化设计
import React, { useState, useEffect } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import { getBreadcrumbConfig } from '@/lib/navigation';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import Container from '@/components/Container';
import Accordion, { AccordionItem } from '@/components/Accordion';
import Link from 'next/link';

export default function MineralProcessingSolutionsClient() {
  // 写死语言设置为中文
  const locale = 'zh';
  const isZh = true;
  
  // 面包屑导航
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { name: '选矿解决方案' }
  ];

  // 页面描述内容
  const pageDescription = '我们提供先进的选矿解决方案，集成高效破碎、精细研磨和精准分选技术，帮助客户优化产能、降低能耗，实现从原矿到成品的全流程价值最大化。';

  // 矿物类别数据
  const mineralCategories = [
    {
      id: 'precious-metals',
      title: '贵金属',
      imageSrc: '/images/products/mineral-processing-solutions/precious-metals.jpg',
      items: [
        { name: '金矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/precious-metals/gold` },
        { name: '砂金矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/precious-metals/placer-gold` },
        { name: '银矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/precious-metals/silver` }
      ]
    },
    {
      id: 'non-ferrous',
      title: '有色金属',
      imageSrc: '/images/products/mineral-processing-solutions/non-ferrous-metals.jpg',
      items: [
        { name: '锡矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-ferrous/tin` },
        { name: '锑矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-ferrous/antimony` },
        { name: '黑钨选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-ferrous/black-tungsten` },
        { name: '铜铅锌矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-ferrous/copper-lead-zinc` },
        { name: '钼矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-ferrous/molybdenum` }
      ]
    },
    {
      id: 'ferrous',
      title: '黑色金属',
      imageSrc: '/images/products/mineral-processing-solutions/ferrous-metals.jpg',
      items: [
        { name: '铬矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/ferrous/chrome` },
        { name: '磁铁矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/ferrous/magnetite` },
        { name: '赤铁矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/ferrous/hematite` },
        { name: '锰矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/ferrous/manganese` }
      ]
    },
    {
      id: 'non-metallic',
      title: '非金属',
      imageSrc: '/images/products/mineral-processing-solutions/non-metallic-minerals.jpg',
      items: [
        { name: '长石矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-metallic/feldspar` },
        { name: '萤石选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-metallic/fluorite` },
        { name: '石墨选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-metallic/graphite` },
        { name: '重晶石选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-metallic/barite` },
        { name: '磷矿选矿工艺流程', link: `/${locale}/products/mineral-processing-solutions/non-metallic/phosphorite` }
      ]
    }
  ];

  // 将矿物类别数据转换为手风琴项
  const accordionItems: AccordionItem[] = mineralCategories.map(category => ({
    id: category.id,
    title: category.title,
    content: (
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <OptimizedImage 
            src={category.imageSrc}
            alt={category.title}
            width={400}
            height={300}
            className="w-full h-auto"
            unoptimized={true}
          />
        </div>
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.items.map((item, index) => (
              <Link 
                key={index} 
                href={item.link}
                className="text-cc3600 flex items-baseline group"
              >
                <span className="mr-2 inline-block">•</span>
                <span className="group-hover:underline">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }));

  // 自定义的包装组件，只覆盖特定页面的hero部分
  const CustomProductLayout = ({ children }: { children: React.ReactNode }) => {
    // 状态管理
    const [openAccordions, setOpenAccordions] = useState<Set<string>>(() => {
      // 创建空集合，使所有手风琴默认关闭
      return new Set<string>();
    });

    // 切换手风琴开关状态
    const toggleAccordion = (id: string) => {
      setOpenAccordions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    };

    return (
      <ProductLayout
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        // 不传递title和description，以阻止默认HeroSection的渲染
      >
        {/* 自定义的Hero部分 */}
        <div className="relative w-full bg-white py-10 md:py-14">
          {/* 内容区域 */}
          <section className="flex items-center justify-center">
            <Container>
              <div className="text-center w-full mx-auto px-4">
                <h1 className="text-[40px] md:text-[80px] font-display text-black mb-2 sm:mb-3 md:mb-4 text-balance leading-none">
                  选矿解决方案
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-text text-gray-700 mx-auto max-w-3xl">
                  {pageDescription}
                </p>
              </div>
            </Container>
          </section>
        </div>
        
        {/* 黑色手风琴部分 */}
        <div className="py-12">
          <Container>
            <div className="mb-12 space-y-12">
              {accordionItems.map((item, index) => {
                const isOpen = openAccordions.has(item.id);
                
                return (
                  <div key={index} className="rounded">
                    <button 
                      className={`w-full flex justify-between items-center py-4 text-left focus:outline-none transition-colors duration-300 border-b border-gray-300 ${
                        isOpen ? 'text-black' : 'text-black hover:text-[#ff6633]'
                      }`}
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <span className="text-xl font-bold uppercase">{item.title}</span>
                      <span className="text-3xl transition-transform duration-300 text-[#ff6633]">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div 
                      className={`transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
                    >
                      <div className="py-6">
                        {item.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </div>
        
        {/* 页面其他内容 */}
        {children}
      </ProductLayout>
    );
  };

  return (
    <CustomProductLayout>
      <div></div>
    </CustomProductLayout>
  );
}