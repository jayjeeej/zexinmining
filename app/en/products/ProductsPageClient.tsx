'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryCard from '@/components/CategoryCard';
import HeroSection from '@/components/HeroSection';
import Container from '@/components/Container';
import Grid from '@/components/Grid';
import { getNavigationItems, getLogo, getBreadcrumbConfig } from '@/lib/navigation';

// 定义产品卡片类型
interface ProductCardData {
  id: string;
  imageSrc: string;
  category: {
    zh: string;
    en: string;
  };
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
}

// 产品列表页面客户端组件 - 写死英文版本
export default function ProductsPageClient() {
  // 写死语言设置为英文
  const locale = 'en';
  const isZh = false;
  
  // 示例产品列表数据
  const products: ProductCardData[] = [
    {
      id: 'ore-processing',
      imageSrc: '/images/products/mineral-processing-equipment.jpg',
      category: { 
        zh: '选矿设备', 
        en: 'Mineral Processing Equipment' 
      },
      name: { 
        zh: '选矿设备', 
        en: 'Mineral Processing Equipment' 
      },
      description: { 
        zh: '高效先进的选矿设备，融合创新技术与专业工程，实现矿物资源的最优回收率', 
        en: 'High-efficiency, advanced mineral processing equipment that integrates innovative technology and professional engineering' 
      }
    },
    {
      id: 'mining-epc',
      imageSrc: '/images/products/mining-epc-contract.jpg',
      category: { 
        zh: '矿山EPC服务', 
        en: 'Mining EPC Services' 
      },
      name: { 
        zh: '矿山EPC服务', 
        en: 'Mining EPC Services' 
      },
      description: { 
        zh: '提供矿业全产业链服务（EPCMO），集成矿山技术咨询、设计、设备制造与采购、工程施工及运营管理', 
        en: 'Providing full mining industry chain services (EPCMO), integrating mining technical consulting, design, equipment manufacturing and procurement, engineering construction and operation management' 
      }
    },
  ];

  // 使用集中式导航配置
  const navigationItems = getNavigationItems(locale);
  const logo = getLogo(locale);
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  return (
    <>
      <Header 
        logo={logo} 
        items={navigationItems}
      />
      
      <main>
        {/* 使用Breadcrumb组件 */}
        <Breadcrumb 
          locale={locale}
          items={[
            breadcrumbConfig.home,
            { name: breadcrumbConfig.products.name }
          ]}
        />
        
        {/* 使用统一的HeroSection组件 */}
        <HeroSection
          title="Products and Services"
          description="Zexin Mining Equipment offers a full range of efficient and intelligent mining solutions to meet your various needs."
        />
         {/* 统一产品列表卡*/}
        <section className="mb-0 bg-gray-50 py-16 lg:py-32">
          <Container withPadding>
              <div className="flex flex-col gap-y-16">
              <div className="grid md:grid-cols-2 gap-y-16 md:gap-x-6 lg:gap-x-8">
                {products.map((product) => (
                  <div key={product.id} className="w-full">
                    <div className="relative flex h-full flex-col no-underline group" data-block="card" style={{ minHeight: '480px' }}>
                      <Link href={`/en/products/${product.id}`} className="absolute left-0 top-0 h-full w-full z-10">
                        <span className="sr-only">{product.name.en}</span>
                      </Link>
                      <div className="mb-4 not-prose relative">
                        <img 
                          className="w-full md:rounded transition-opacity ease-hover group-hover:opacity-90"
                          src={product.imageSrc}
                          alt={product.name.en}
                          width="688" 
                          height="387" 
                          loading="lazy"
                        />
                        {product.id === 'mineral-processing-solutions' && (
                          <div className="absolute inset-0 bg-black/30 md:rounded"></div>
                        )}
                      </div>
                      
                      <div className="max-md:px-6 flex flex-col flex-grow h-full">
                        <div className="flex flex-col gap-4 not-prose mb-4">
                          <div className="not-prose">
                            <h2 className="leading-none decoration-2 group-hover:underline underline-offset-2 decoration-1 decoration-[#ff6633] sm:text-2xl text-xl font-medium font-display">
                              {product.name.en}
                            </h2>
                          </div>
                        </div>
                        <div className="prose flex-grow flex flex-col h-full">
                          <p>{product.description.en}</p>
                          <div className="mt-auto pt-4">
                            <span className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover text-current hover:text-current focus:text-current active:text-current">
                              <span className="group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity underline decoration-black decoration-1 underline-offset-4">
                                Learn more
                              </span>
                              <span className="text-[#ff6633]">
                                <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.5 2L9 6L4.5 10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                </svg>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer logoAlt="Zexin Group" />
    </>
  );
} 