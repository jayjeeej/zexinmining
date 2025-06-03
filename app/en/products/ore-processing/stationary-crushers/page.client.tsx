'use client';

import React, { useState, useEffect } from "react";
import ProductFilterCard from '@/components/ProductFilterCard';
import LayoutWithTransition from '@/components/layouts/LayoutWithTransition';
import ProductTabs from '@/components/ProductTabs';
import { getBreadcrumbConfig } from '@/lib/navigation';
import { getMineralProcessingCategories } from '@/lib/productCategories';
import CardAnimationProvider from '@/components/CardAnimationProvider';
import ScrollPositionMemoryWithLinks from '@/components/ScrollPositionMemoryWithLinks';

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

interface StationaryCrushersPageClientProps {
  locale: string;
  initialData?: Product[];
}

export default function StationaryCrushersPageClient({ locale, initialData = [] }: StationaryCrushersPageClientProps) {
  const isZh = locale === 'zh';
  const [products, setProducts] = useState<Product[]>(initialData);
  
  // 添加ScrollPositionMemoryWithLinks组件，实现位置记忆和平滑滚动
  const memoryComponent = (
    <ScrollPositionMemoryWithLinks
      storageKey="stationaryCrushersPageState"
      backFromDetailKey="backFromProductDetail"
      locale={locale}
      linkPathPrefix="products/ore-processing/stationary-crushers"
      dependencies={[products.length]}
    />
  );
  
  // 在首次渲染时静默设置产品数据，不显示任何加载状态
  useEffect(() => {
    // 如果服务端传入了数据，直接使用
    if (initialData && initialData.length > 0) {
      setProducts(initialData);
      return;
    }
    
    // 尝试从嵌入的脚本标签中获取数据
    try {
      const dataScript = document.getElementById('stationary-crushers-data');
      if (dataScript && dataScript.textContent) {
        const parsedData = JSON.parse(dataScript.textContent);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setProducts(parsedData);
        }
      }
    } catch (error) {
      // 静默处理错误
    }
  }, [initialData]);
  
  // 选矿设备产品类别导航
  const mineralProcessingCategories = getMineralProcessingCategories(locale);
  
  // 使用统一的面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: '/en' },
    { name: breadcrumbConfig.products.name, href: '/en/products' },
    { name: breadcrumbConfig.mineralProcessing.name, href: '/en/products/ore-processing' },
    { name: breadcrumbConfig.categories['stationary-crushers'].name }
  ];
  
  // 页面描述内容
  const pageDescription = isZh
    ? '泽鑫提供高效固定式破碎机，包括颚式、圆锥、反击式、锤式和辊式破碎机，适用于矿石、岩石和建筑材料。我们的设备结构坚固、性能可靠、产能高、能耗低，满足各种破碎需求。'
    : 'Zexin offers high-efficiency stationary crushers including jaw, cone, impact, hammer and roller crushers for minerals, rocks and construction materials. Our equipment features robust construction, reliable performance, high capacity and low energy consumption.';
  
  // 产品标签导航 - 传递当前类别ID用于排除当前页面
  const productTabsElement = (
    <ProductTabs 
      categories={mineralProcessingCategories} 
      locale={locale} 
      currentCategory="stationary-crushers" 
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
      {memoryComponent}
      <LayoutWithTransition
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        title={isZh ? "固定式破碎机" : "Stationary Crushers"} 
        description={pageDescription}
        productTabs={productTabsElement}
      >
        <section 
          className="mb-16 lg:mb-32 bg-gray-50 py-16 lg:py-32 last-of-type:mb-0" 
          data-filter-content="" 
          data-id="stationary-crushers-filter" 
        >
          <div className="contain">
            <div className="grid sm:gap-x-8 xl:grid-cols-3"> 
              <div aria-live="polite" aria-atomic="true" className="col-span-4 xl:col-span-3">
                <p className="sr-only" aria-live="polite">
                  {`${products?.length || 0} ${isZh ? '个结果' : 'results'}`}
                </p>
                
                {/* 产品卡片列表区域 - 提前渲染所有卡片，避免任何显示加载状态 */}
                <div className="product-grid-container">
                    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {displayProducts.map(product => (
                      <li key={product.id} className={product.id.startsWith('placeholder') ? 'opacity-100 transition-none' : ''}>
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
        
        {/* 预加载插入脚本，确保下次导航时能快速显示图片 */}
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