'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import ProductCard from '@/app/components/products/ProductCard';
import PageSection from '@/app/components/PageSection';
import { useLanguage } from "@/app/contexts/LanguageContext";
import ProductStructuredData from "@/app/components/ProductStructuredData";

// 定义产品数据类型
interface ProductData {
  id: string;
  model: string;
  series: {
    zh: string;
    en: string;
  };
  image?: string;
  capacity?: {
    zh: string;
    en: string;
  };
  efficiency?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  feedSize?: {
    zh: string;
    en: string;
  };
  [key: string]: any;
}

interface GravitySeparationClientProps {
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

// 重选设备产品列表客户端组件
export default function GravitySeparationClient({ 
  titleZh, 
  titleEn,
  descriptionZh,
  descriptionEn
}: GravitySeparationClientProps) {
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 格式化能力、尺寸等数据的辅助函数
  const formatCapacity = (data: any) => {
    if (!data) return undefined;
    
    // 如果已经是正确格式，直接返回
    if (data.zh && data.en) {
      return data;
    }
    
    // 处理数值范围格式
    if (typeof data === 'object' && (data.min !== undefined || data.max !== undefined)) {
      const min = data.min || 0;
      const max = data.max || min;
      const unit = data.unit || '';
      const valueText = min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`;
      
      return {
        zh: valueText,
        en: valueText
      };
    }
    
    // 处理字符串格式
    if (typeof data === 'string') {
      return {
        zh: data,
        en: data
      };
    }
    
    return undefined;
  };

  useEffect(() => {
    async function loadProductsData() {
      try {
        const response = await fetch('/data/products/gravity-separation-products.json');
        
        if (response.ok) {
          const data = await response.json();
          // 处理产品数据
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.map((product: any) => ({
              id: product.id,
              model: product.model,
              series: product.series,
              capacity: formatCapacity(product.capacity),
              efficiency: formatCapacity(product.efficiency),
              motorPower: formatCapacity(product.motorPower),
              feedSize: formatCapacity(product.feedSize),
              isGravitySeparationProduct: true
            })));
          } else {
            // 如果没有数据或数据格式不正确，使用备用数据
            setProducts(getBackupGravitySeparationProducts());
          }
        } else {
          // 如果请求失败，使用备用数据
          setProducts(getBackupGravitySeparationProducts());
        }
      } catch (error) {
        console.error("Error loading gravity separation equipment data:", error);
        // 出错时使用备用数据
        setProducts(getBackupGravitySeparationProducts());
      } finally {
        setLoading(false);
      }
    }
    
    // 重选设备备份数据
    const getBackupGravitySeparationProducts = (): ProductData[] => {
      return [
        {
          id: "synchronous-counter-directional-jig",
          model: "SCDJM-4",
          series: {
            zh: "4室复合双动跳汰机",
            en: "4-Chamber Composite Double-Motion Jig"
          },
          image: "/images/products/gravity-separation/synchronous-counter-directional-jig.png",
          capacity: {
            zh: "40-80 t/h",
            en: "40-80 t/h"
          },
          motorPower: {
            zh: "30 kW",
            en: "30 kW"
          },
          feedSize: {
            zh: "≤50 mm",
            en: "≤50 mm"
          },
          isGravitySeparationProduct: true
        },
        {
          id: "synchronous-counter-directional-jig-small",
          model: "SCDJM-2",
          series: {
            zh: "2室复合双动跳汰机",
            en: "2-Chamber Composite Double-Motion Jig"
          },
          image: "/images/products/gravity-separation/synchronous-counter-directional-jig-small.png",
          capacity: {
            zh: "15-45 t/h",
            en: "15-45 t/h"
          },
          motorPower: {
            zh: "22 kW",
            en: "22 kW"
          },
          feedSize: {
            zh: "≤50 mm",
            en: "≤50 mm"
          },
          isGravitySeparationProduct: true
        },
        {
          id: "sawtooth-wave-jig",
          model: "STWJ-5",
          series: {
            zh: "锯齿波跳汰机",
            en: "Sawtooth Wave Jig"
          },
          image: "/images/products/gravity-separation/sawtooth-wave-jig.png",
          capacity: {
            zh: "10-30 t/h",
            en: "10-30 t/h"
          },
          motorPower: {
            zh: "11 kW",
            en: "11 kW"
          },
          feedSize: {
            zh: "≤60 mm",
            en: "≤60 mm"
          },
          isGravitySeparationProduct: true
        },
        {
          id: "shaking-table",
          model: "6-S",
          series: {
            zh: "摇床",
            en: "Shaking Table"
          },
          image: "/images/products/gravity-separation/shaking-table.png",
          capacity: {
            zh: "0.3-1.2 t/h",
            en: "0.3-1.2 t/h"
          },
          motorPower: {
            zh: "1.1 kW",
            en: "1.1 kW"
          },
          feedSize: {
            zh: "0-2 mm",
            en: "0-2 mm"
          },
          isGravitySeparationProduct: true
        },
        {
          id: "carpet-hooking-machine",
          model: "1200×6000",
          series: {
            zh: "毛毯布勾机",
            en: "Carpet Hooking Machine"
          },
          image: "/images/products/gravity-separation/carpet-hooking-machine.png",
          capacity: {
            zh: "1-10 t/h",
            en: "1-10 t/h"
          },
          motorPower: {
            zh: "0.55-1.5 kW",
            en: "0.55-1.5 kW"
          },
          feedSize: {
            zh: "0-2 mm",
            en: "0-2 mm"
          },
          isGravitySeparationProduct: true
        },
        {
          id: "spiral-chute",
          model: "5LL-1500",
          series: {
            zh: "玻璃钢螺旋溜槽",
            en: "Glass Fiber Spiral Chute"
          },
          image: "/images/products/gravity-separation/spiral-chute.png",
          capacity: {
            zh: "1.5-10 t/h",
            en: "1.5-10 t/h"
          },
          motorPower: {
            zh: "无动力",
            en: "No Power"
          },
          feedSize: {
            zh: "0.02-2.0 mm",
            en: "0.02-2.0 mm"
          },
          isGravitySeparationProduct: true
        },
        {
          id: "centrifugal-separator",
          model: "STLB60",
          series: {
            zh: "离心选矿机",
            en: "Centrifugal Separator"
          },
          image: "/images/products/gravity-separation/centrifugal-separator.png",
          capacity: {
            zh: "0-80 t/h",
            en: "0-80 t/h"
          },
          motorPower: {
            zh: "0.75-18.5 kW",
            en: "0.75-18.5 kW"
          },
          feedSize: {
            zh: "0-6 mm",
            en: "0-6 mm"
          },
          isGravitySeparationProduct: true
        }
      ];
    }
    
    loadProductsData();
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 添加结构化数据 - 对页面布局没有视觉影响 */}
      <ProductStructuredData
        name={isZh ? titleZh : titleEn}
        description={isZh ? descriptionZh : descriptionEn}
        image="/images/products/gravity-separation/category-overview.png"
        category={isZh ? "重选设备" : "Gravity Separation Equipment"}
        url="/products/gravity-separation"
      />
      
      {/* 页面标题区域 */}
      <PageSection 
        noPadding 
        variant="hero"
        isHero={true}
        breadcrumb={{
          items: [
            {
              label: { zh: "产品中心", en: "Products" },
              href: `/products`
            },
            {
              label: { zh: "重选设备", en: "Gravity Separation Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left" itemProp="name">
                  {isZh ? titleZh : titleEn}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p itemProp="description">
                    {isZh ? descriptionZh : descriptionEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 重选设备型号展示 */}
      <PageSection variant="gray" className="flex-grow">
        <div className="max-w-7xl mx-auto h-full">
          {loading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="text-center">
                <p className="text-gray-500">{isZh ? '加载产品数据...' : 'Loading products data...'}</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  basePath={`/products/gravity-separation`} 
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[600px]">
              <div className="text-center max-w-xl">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  {isZh ? '产品正在更新中' : 'Products are being updated'}
                </h3>
                <p className="text-gray-500 mb-8">
                  {isZh 
                    ? '我们正在努力完善产品信息，请稍后再来查看。' 
                    : 'We are working hard to improve product information. Please check back later.'}
                </p>
                <Link 
                  href="/products" 
                  className="inline-block px-6 py-3 bg-[#0078c2] text-white rounded-lg hover:bg-[#00609a] transition-colors"
                >
                  {isZh ? '返回产品中心' : 'Back to Products'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 