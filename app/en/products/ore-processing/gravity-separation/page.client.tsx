'use client';

import React, { useState, useEffect } from "react";
import ProductFilterCard from '@/components/ProductFilterCard';
import LayoutWithTransition from '@/components/layouts/LayoutWithTransition';
import ProductTabs from '@/components/ProductTabs';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { getMineralProcessingCategories } from '@/lib/productCategories';
import CardAnimationProvider from '@/components/CardAnimationProvider';

// 产品元数据类型
interface ProductMeta {
  key: string;
  displayValue: string;
}

// 产品类型
interface Product {
  id: string;
  title: string;
  imageSrc: string;
  productCategory: string;
  href: string;
  meta: ProductMeta[];
}

interface GravitySeparationPageClientProps {
  locale: string;
  initialData?: Product[];
}

export default function GravitySeparationPageClient({ locale, initialData = [] }: GravitySeparationPageClientProps) {
  const isZh = locale === 'zh';
  const [products, setProducts] = useState<Product[]>(initialData);
  
  // 在首次渲染时静默设置产品数据，不显示任何加载状态
  useEffect(() => {
    // 如果服务端传入了数据，直接使用
    if (initialData && initialData.length > 0) {
      setProducts(initialData);
      return;
    }
    
    // 尝试从嵌入的脚本标签中获取数据
    try {
      const dataScript = document.getElementById('gravity-separation-data');
      if (dataScript && dataScript.textContent) {
        const parsedData = JSON.parse(dataScript.textContent);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setProducts(parsedData);
        }
      }
      } catch (error) {
      // 静默处理错误，不输出控制台信息
    }
  }, [initialData]);
  
  // 选矿设备产品类别导航
  const mineralProcessingCategories = getMineralProcessingCategories(locale);
  
  // 使用统一的面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { name: breadcrumbConfig.mineralProcessing.name, href: breadcrumbConfig.mineralProcessing.href },
    { name: breadcrumbConfig.categories['gravity-separation'].name }
  ];
  
  // 页面描述内容
  const pageDescription = isZh
    ? '泽鑫矿山设备专业生产重选设备，包括螺旋溜槽、跳汰机、摇床、离心选矿机等，基于矿物颗粒比重差异原理进行分选。我们的设备适用于金、锡、钨、钽铌、锆、铬、锰等贵重和稀有金属矿的高效选别，具有分选精度高、回收率高、结构可靠、操作简便、能耗低等特点，是矿产资源绿色高效回收的理想选择。'
    : 'Zexin Mining Equipment specializes in manufacturing gravity separation equipment including spiral chutes, jig machines, shaking tables and centrifugal concentrators, based on the principle of specific gravity differences between mineral particles. Our equipment is suitable for efficient separation of gold, tin, tungsten minerals based on specific gravity differences, featuring high recovery rates, low energy consumption and environmental protection.';
  
  // 产品标签导航
  const productTabsElement = (
    <ProductTabs 
      categories={mineralProcessingCategories} 
      locale={locale} 
      currentCategory="gravity-separation" 
    />
  );
  
  // 创建空状态占位产品卡片
  const placeholderProducts = Array(6).fill(0).map((_, index) => ({
    id: `placeholder-${index}`,
    title: ' ',
    imageSrc: '/images/placeholder.jpg',
    productCategory: ' ',
    href: '#',
    meta: []
  }));
  
  // 使用服务器数据或占位数据，确保布局稳定
  const displayProducts = products.length > 0 ? products : placeholderProducts;
  
  return (
    <>
      <CardAnimationProvider />
      <LayoutWithTransition
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        title={isZh ? "重力选矿设备" : "Gravity Separation Equipment"} 
        description={pageDescription}
        productTabs={productTabsElement}
      >
        <section 
          className="mb-16 lg:mb-32 bg-gray-50 py-16 lg:py-32 last-of-type:mb-0" 
          data-filter-content="" 
          data-id="gravity-separation-filter" 
        >
          <div className="contain">
            <div className="grid sm:gap-x-8 xl:grid-cols-3"> 
              <div aria-live="polite" aria-atomic="true" className="col-span-4 xl:col-span-3">
                <p className="sr-only" aria-live="polite">
                  {`${products?.length || 0} ${isZh ? '个结果' : 'results'}`}
                </p>
                
                {/* 产品卡片列表区域 */}
                <div className="product-grid-container">
                  <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {displayProducts.map(product => (
                      <li key={product.id} className={product.id.startsWith('placeholder') ? 'opacity-0' : ''}>
                        <ProductFilterCard 
                          id={product.id}
                          title={product.title}
                          imageSrc={product.imageSrc}
                          productCategory={product.productCategory}
                          meta={product.meta}
                          href={product.href}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 预加载插入脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                try {
                  ${products.map(p => `
                    (new Image()).src = "${p.imageSrc}";
                  `).join('')}
                } catch(e) {}
              });
            `
          }}
        />
      </LayoutWithTransition>
    </>
  );
} 