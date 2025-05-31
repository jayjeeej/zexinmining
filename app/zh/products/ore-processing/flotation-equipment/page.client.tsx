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

interface FlotationEquipmentPageClientProps {
  locale: string;
  initialData?: Product[];
}

export default function FlotationEquipmentPageClient({ locale, initialData = [] }: FlotationEquipmentPageClientProps) {
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
      const dataScript = document.getElementById('flotation-equipment-data');
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
    { name: breadcrumbConfig.home.name, href: `/${locale}` },
    { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
    { name: isZh ? '选矿设备' : 'Ore Processing Equipment', href: `/${locale}/products/ore-processing` },
    { name: isZh ? '浮选设备' : 'Flotation Equipment' }
  ];
  
  // 页面描述内容
  const pageDescription = isZh
    ? '泽鑫提供高效浮选设备，包括气动浮选机、自吸式浮选机和XFC充气式浮选机，高矿化率设计，适用于有色金属、黑色金属和非金属矿物的分离，能耗低，操作简便，回收率高。'
    : 'Zexin Mining Equipment specializes in manufacturing various flotation equipment including pneumatic flotation cells, self-aspirated flotation cells, coarse flotation cells, and XFC air inflation flotation cells. Our flotation equipment features high mineralization rates, low energy consumption, robust structure, and ease of operation, providing efficient and reliable flotation solutions for non-ferrous metals, ferrous metals, and non-metallic mineral beneficiation processes.';
  
  // 产品标签导航
  const productTabsElement = (
    <ProductTabs 
      categories={mineralProcessingCategories} 
      locale={locale} 
      currentCategory="flotation-equipment" 
    />
  );
  
  // 创建空状态占位产品卡片
  const placeholderProducts = Array(4).fill(0).map((_, index) => ({
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
      title={isZh ? "浮选设备" : "Flotation Equipment"} 
      description={pageDescription}
      productTabs={productTabsElement}
    >
      <section 
        className="mb-16 lg:mb-32 bg-gray-50 py-16 lg:py-32 last-of-type:mb-0" 
        data-filter-content="" 
        data-id="flotation-equipment-filter" 
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