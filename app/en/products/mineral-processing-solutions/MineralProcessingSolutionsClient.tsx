'use client';
// 选矿解决方案客户端组件 - 全新现代化设计
import React, { useState, useEffect } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import { getBreadcrumbConfig } from '@/lib/navigation';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import Container from '@/components/Container';
import Accordion, { AccordionItem } from '@/components/Accordion';
import Link from 'next/link';
import { getBreadcrumbStructuredData, getOrganizationStructuredData, getProductCategoryStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';

interface MineralProcessingSolutionsClientProps {
  locale: string;
}

export default function MineralProcessingSolutionsClient({ locale = 'en' }: MineralProcessingSolutionsClientProps) {
  // 确保 locale 始终有一个默认值
  const safeLocale = locale || 'en';
  const isZh = safeLocale === 'zh';
  
  // 面包屑导航
  const breadcrumbConfig = getBreadcrumbConfig(safeLocale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { name: isZh ? '选矿解决方案' : 'Mineral Processing Solutions' }
  ];

  // 页面描述内容
  const pageDescription = isZh
    ? '我们提供先进的选矿解决方案，集成高效破碎、精细研磨和精准分选技术，帮助客户优化产能、降低能耗，实现从原矿到成品的全流程价值最大化。'
    : 'We provide advanced mineral processing solutions that integrate efficient crushing, fine grinding and precise separation technologies, helping customers optimize throughput, reduce energy consumption and maximize value throughout the entire process from raw ore to final product.';

  // 矿物类别数据
  const mineralCategories = [
    {
      id: 'precious-metals',
      title: isZh ? '贵金属' : 'Precious Metals',
      imageSrc: '/images/products/mineral-processing-solutions/precious-metals.jpg',
      items: [
        { name: isZh ? '金矿选矿工艺流程' : 'Gold Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/precious-metals/gold` },
        { name: isZh ? '砂金矿选矿工艺流程' :'Placer Gold Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/precious-metals/placer-gold` },
        { name: isZh ? '银矿选矿工艺流程' : 'Silver Ore Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/precious-metals/silver` }
      ]
    },
    {
      id: 'non-ferrous',
      title: isZh ? '有色金属' : 'Non-ferrous Metals',
      imageSrc: '/images/products/mineral-processing-solutions/non-ferrous-metals.jpg',
      items: [
        { name: isZh ? '锡矿选矿工艺流程' : 'Tin Ore Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-ferrous/tin` },
        { name: isZh ? '锑矿选矿工艺流程' : 'Antimony Ore Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-ferrous/antimony` },
        { name: isZh ? '黑钨选矿工艺流程' : 'Black Tungsten Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-ferrous/black-tungsten` },
        { name: isZh ? '铜铅锌矿选矿工艺流程' : 'Copper-Lead-Zinc Ore Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-ferrous/copper-lead-zinc` },
        { name: isZh ? '钼矿选矿工艺流程' : 'Molybdenum Ore Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-ferrous/molybdenum` }
      ]
    },
    {
      id: 'ferrous',
      title: isZh ? '黑色金属' : 'Ferrous Metals',
      imageSrc: '/images/products/mineral-processing-solutions/ferrous-metals.jpg',
      items: [
        { name: isZh ? '铬矿选矿工艺流程' : 'Chrome Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/ferrous/chrome` },
        { name: isZh ? '磁铁矿选矿工艺流程' : 'Magnetite Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/ferrous/magnetite` },
        { name: isZh ? '赤铁矿选矿工艺流程' : 'Hematite Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/ferrous/hematite` },
        { name: isZh ? '锰矿选矿工艺流程' : 'Manganese Ore Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/ferrous/manganese` }
      ]
    },
    {
      id: 'non-metallic',
      title: isZh ? '非金属' : 'Non-metallic Minerals',
      imageSrc: '/images/products/mineral-processing-solutions/non-metallic-minerals.jpg',
      items: [
        { name: isZh ? '长石矿选矿工艺流程' : 'Feldspar Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-metallic/feldspar` },
        { name: isZh ? '萤石选矿工艺流程' : 'Fluorite Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-metallic/fluorite` },
        { name: isZh ? '石墨选矿工艺流程' : 'Graphite Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-metallic/graphite` },
        { name: isZh ? '重晶石选矿工艺流程' : 'Barite Beneficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-metallic/barite` },
        { name: isZh ? '磷矿选矿工艺流程' : 'Phosphorite Benenficiation Process Flow', link: `/${safeLocale}/products/mineral-processing-solutions/non-metallic/phosphorite` }
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

  // 生成面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ 
      name: item.name, 
      url: item.href 
    }))
  );

  // 获取组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);

  // 获取类别结构化数据
  const productCategoryStructuredData = getProductCategoryStructuredData({
    categoryId: 'mineral-processing-solutions',
    categoryName: isZh ? '选矿解决方案' : 'Mineral Processing Solutions',
    description: pageDescription,
    productCount: mineralCategories.length,
    locale: safeLocale
  });

  // 合并所有结构化数据
  const structuredDataArray = [
    breadcrumbStructuredData,
    organizationStructuredData,
    productCategoryStructuredData
  ];

  // 自定义的包装组件，只覆盖特定页面的hero部分
  const CustomProductLayout = ({ children }: { children: React.ReactNode }) => {
    // 状态管理
    const [openAccordions, setOpenAccordions] = useState<Set<string>>(() => {
      // 创建包含所有矿物类别ID的初始集合，使所有手风琴默认打开
      const initialOpenAccordions = new Set<string>();
      mineralCategories.forEach(category => {
        initialOpenAccordions.add(category.id);
      });
      return initialOpenAccordions;
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
      <>
        {/* SEO结构化数据 */}
        <MultiStructuredData dataArray={structuredDataArray} />
      
      <ProductLayout
        locale={safeLocale}
        breadcrumbItems={breadcrumbItems}
        // 不传递title和description，以阻止默认HeroSection的渲染
      >
        {/* 自定义的Hero部分 */}
        <div className="relative w-full">
          {/* 图片区域 */}
          <section className="w-full">
            <picture>
              {/* 移动设备版本 */}
              <source 
                srcSet="/images/products/mineral-processing-solutions/mineral-plant-mobile.jpg" 
                media="(max-width: 768px)" 
                type="image/jpeg" 
              />
              {/* 桌面版本 */}
              <source 
                srcSet="/images/products/mineral-processing-solutions/mineral-plant.jpg" 
                media="(min-width: 769px)" 
                type="image/jpeg" 
              />
              <img 
                src="/images/products/mineral-processing-solutions/mineral-plant.jpg" 
                alt={isZh ? "选矿解决方案" : "Mineral Processing Solutions"}
                className="w-full h-auto"
                loading="eager"
              />
            </picture>
            {/* 半透明遮罩 */}
            <div className="absolute inset-0 bg-black/50"></div>
          </section>
          
          {/* 内容区域 */}
          <section className="absolute inset-0 flex items-center justify-center">
            <Container>
              <div className="text-center w-full mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-[#ff6633] mb-2 sm:mb-3 md:mb-4 text-balance leading-tight">
                  {isZh ? '选矿解决方案' : 'Mineral Processing Solutions'}
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-text text-white/90 mx-auto max-w-3xl">
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
                      className={`w-full flex justify-between items-center py-4 px-6 text-left focus:outline-none transition-colors duration-300 ${
                        isOpen ? 'bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
                      }`}
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <span className="text-xl font-medium">{item.title}</span>
                      <span className="text-3xl transition-transform duration-300 text-[#ff6633]">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div 
                      className={`transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
                    >
                      <div className="bg-white p-6">
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
      </>
    );
  };

  return (
    <CustomProductLayout>
      <div></div>
    </CustomProductLayout>
  );
}