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
  isGravitySeparationProduct?: boolean;
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
    // 预加载图片，加快渲染速度
    function preloadImages() {
      const productImages = [
        '/images/products/gravity-separation/synchronous-counter-directional-jig.png',
        '/images/products/gravity-separation/synchronous-counter-directional-jig-small.png',
        '/images/products/gravity-separation/sawtooth-wave-jig.png',
        '/images/products/gravity-separation/shaking-table.png',
        '/images/products/gravity-separation/carpet-hooking-machine.png',
        '/images/products/gravity-separation/spiral-chute.png',
        '/images/products/gravity-separation/centrifugal-separator.png'
      ];

      productImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }

    // 使用 AbortController 来管理请求
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadProductsData() {
      try {
        setLoading(true);
        
        // 缓存键，基于语言设置
        const cacheKey = `gravity-separation-products-${language}`;
        
        // 检查会话缓存中是否有数据
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          setProducts(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
        
        // 从预编译JSON文件获取产品数据
        const jsonFile = language === 'en' 
          ? '/data/products/compiled/gravity-separation-en.json'
          : '/data/products/compiled/gravity-separation-zh.json';
          
        const apiResponse = await fetch(jsonFile, {
          signal,
          cache: 'force-cache',
          next: { revalidate: 3600 } // 1小时后重新验证数据
        });
        
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          // 处理产品数据
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            // 存储到会话缓存中
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          } else {
            // 如果没有数据或数据格式不正确，使用备用数据
            setProducts(getBackupGravitySeparationProducts());
          }
        } else {
          // 如果请求失败，使用备用数据
          console.error('API请求失败，使用备用数据');
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
    
    // 开始预加载图片
    preloadImages();
    
    // 加载产品数据
    loadProductsData();
    
    // 组件卸载时取消所有正在进行的请求
    return () => {
      controller.abort();
    };
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