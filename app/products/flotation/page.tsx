'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import ProductCard from '@/app/components/products/ProductCard';
import PageSection from '@/app/components/PageSection';
import { useLanguage } from "@/app/contexts/LanguageContext";
import ProductStructuredData from "@/app/components/ProductStructuredData";
import LoadingWrapper from '@/app/components/LoadingWrapper';

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
  effectiveVolume?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  [key: string]: any;
}

// 浮选设备产品列表页面
export default function FlotationPage() {
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
      const imageUrls = [
        '/images/products/flotation/flotation-cell.png',
        '/images/products/flotation/xcf-flotation-machine.png',
        '/images/products/flotation/self-priming-flotation-machine.png',
        '/images/products/flotation/coarse-particle-flotation-machine.png',
        '/images/products/flotation/bar-flotation-machine.png',
        '/images/products/flotation/aeration-flotation-machine.png'
      ];
      
      imageUrls.forEach(url => {
        // 使用window.Image构造函数明确类型
        const img = new (window.Image as any)();
        img.src = url;
      });
    }
    
    async function loadProductsData() {
      // 缓存键，基于语言设置
      const cacheKey = `flotation-equipment-data-${language}`;
      
      // 尝试从会话存储中获取缓存的数据
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log("从缓存加载浮选设备产品数据");
          setProducts(parsedData);
          setLoading(false);
          return;
        } catch (e) {
          console.error("缓存数据解析失败:", e);
          // 继续尝试从API获取数据
        }
      }
      
      try {
        // 使用预编译的组合JSON，单一请求替代多个请求
        const combinedJsonUrl = `/data/products/compiled/flotation-equipment-${language}.json`;
        const response = await fetch(combinedJsonUrl, {
          cache: 'force-cache', // 强制使用缓存
          next: { revalidate: 3600 } // 1小时后重新验证
        });
        
        if (response.ok) {
          // 成功获取到合并后的数据
          const productsData = await response.json();
          setProducts(productsData);
          // 存储到会话缓存中
          sessionStorage.setItem(cacheKey, JSON.stringify(productsData));
        } else {
          // 如果合并文件不存在，回退到原始API请求
          console.log("合并数据文件不存在，回退到API请求");
          
          const apiResponse = await fetch('/data/products/flotation-products.json', {
            cache: 'force-cache'
          });
          
          if (apiResponse.ok) {
            const data = await apiResponse.json();
            // 处理产品数据
            if (Array.isArray(data) && data.length > 0) {
              const formattedProducts = data.map((product: any) => ({
                id: product.id,
                model: product.model,
                series: product.series,
                capacity: formatCapacity(product.capacity),
                effectiveVolume: formatCapacity(product.effectiveVolume),
                motorPower: formatCapacity(product.motorPower),
                image: product.image,
                isFlotationProduct: true,
                uniqueId: `${product.id}-1`
              }));
              
              setProducts(formattedProducts);
              // 存储到会话缓存中
              sessionStorage.setItem(cacheKey, JSON.stringify(formattedProducts));
            } else {
              // 如果没有数据或数据格式不正确，使用备用数据
              setProducts(getBackupFlotationProducts());
            }
          } else {
            // 如果请求失败，使用备用数据
            console.error('API请求失败，使用备用数据');
            setProducts(getBackupFlotationProducts());
          }
        }
      } catch (error) {
        console.error("Error loading flotation equipment data:", error);
        // 出错时使用备用数据
        setProducts(getBackupFlotationProducts());
      } finally {
        setLoading(false);
      }
    }
    
    // 浮选设备备份数据
    function getBackupFlotationProducts(): ProductData[] {
      return [
        {
          id: "flotation-cell",
          model: "JJF",
          series: {
            zh: "浮选机",
            en: "Flotation Cell"
          },
          image: "/images/products/flotation/flotation-cell.png",
          capacity: {
            zh: "0.37-90 m³",
            en: "0.37-90 m³"
          },
          effectiveVolume: {
            zh: "0.37-90 m³",
            en: "0.37-90 m³"
          },
          motorPower: {
            zh: "1.1-160 kW",
            en: "1.1-160 kW"
          },
          isFlotationProduct: true,
          uniqueId: "flotation-cell-1"
        },
        {
          id: "xcf-flotation-machine",
          model: "XCF/KYF",
          series: {
            zh: "XCF/KYF气浮式浮选机",
            en: "XCF/KYF Air-inflation Flotation Machine"
          },
          image: "/images/products/flotation/xcf-flotation-machine.png",
          capacity: {
            zh: "0.24-48 m³",
            en: "0.24-48 m³"
          },
          effectiveVolume: {
            zh: "0.24-48 m³",
            en: "0.24-48 m³"
          },
          motorPower: {
            zh: "1.5-110 kW",
            en: "1.5-110 kW"
          },
          isFlotationProduct: true,
          uniqueId: "xcf-flotation-1"
        },
        {
          id: "self-priming-flotation-machine",
          model: "SF",
          series: {
            zh: "SF充气式浮选机",
            en: "SF Inflation Flotation Machine"
          },
          image: "/images/products/flotation/self-priming-flotation-machine.png",
          capacity: {
            zh: "0.37-51 m³",
            en: "0.37-51 m³"
          },
          effectiveVolume: {
            zh: "0.37-51 m³",
            en: "0.37-51 m³"
          },
          motorPower: {
            zh: "1.5-150 kW",
            en: "1.5-150 kW"
          },
          isFlotationProduct: true,
          uniqueId: "sf-flotation-1"
        },
        {
          id: "coarse-particle-flotation-machine",
          model: "BF",
          series: {
            zh: "粗颗粒浮选机",
            en: "Coarse Particle Flotation Machine"
          },
          image: "/images/products/flotation/coarse-particle-flotation-machine.png",
          capacity: {
            zh: "10-80 m³",
            en: "10-80 m³"
          },
          effectiveVolume: {
            zh: "10-80 m³",
            en: "10-80 m³"
          },
          motorPower: {
            zh: "30-110 kW",
            en: "30-110 kW"
          },
          isFlotationProduct: true,
          uniqueId: "bf-flotation-1"
        },
        {
          id: "bar-flotation-machine",
          model: "KYF",
          series: {
            zh: "棒型浮选机",
            en: "Bar Flotation Machine"
          },
          image: "/images/products/flotation/bar-flotation-machine.png",
          capacity: {
            zh: "0.5-36 m³",
            en: "0.5-36 m³"
          },
          effectiveVolume: {
            zh: "0.5-36 m³",
            en: "0.5-36 m³"
          },
          motorPower: {
            zh: "1.5-75 kW",
            en: "1.5-75 kW"
          },
          isFlotationProduct: true,
          uniqueId: "bar-flotation-1"
        },
        {
          id: "aeration-flotation-machine",
          model: "XJQ",
          series: {
            zh: "机械曝气式浮选机",
            en: "Aeration Flotation Machine"
          },
          image: "/images/products/flotation/aeration-flotation-machine.png",
          capacity: {
            zh: "0.5-24 m³",
            en: "0.5-24 m³"
          },
          effectiveVolume: {
            zh: "0.5-24 m³",
            en: "0.5-24 m³"
          },
          motorPower: {
            zh: "1.5-55 kW",
            en: "1.5-55 kW"
          },
          isFlotationProduct: true,
          uniqueId: "aeration-flotation-1"
        }
      ];
    }
    
    // 加载产品数据并预加载图片
    loadProductsData();
    preloadImages();
    
    // 组件卸载时清理
    return () => {
      // 如果有需要清理的资源，在这里处理
    };
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 添加结构化数据 - 对页面布局没有视觉影响 */}
      <ProductStructuredData
        name={isZh ? "浮选设备" : "Flotation Equipment"}
        description={isZh 
          ? "基于矿物表面性质差异分选的设备，用于各类金属和非金属矿石的选别。" 
          : "Equipment that separates minerals based on surface property differences for various metal and non-metal ores."}
        image="/images/products/flotation-equipment.png"
        category={isZh ? "浮选设备" : "Flotation Equipment"}
        url="/products/flotation"
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
              label: { zh: "浮选设备", en: "Flotation Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "浮选设备" : "Flotation Equipment"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh
                      ? "基于矿物表面性质差异分选的设备，包括浮选机、搅拌槽和药剂添加系统等。我们的浮选设备广泛应用于铜、铅、锌、金等有色金属矿和非金属矿的分选。"
                      : "Equipment that separates minerals based on surface property differences, including flotation machines, agitation tanks, and reagent addition systems. Our flotation equipment is widely used in the separation of non-ferrous metal ores such as copper, lead, zinc, gold and non-metallic minerals."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 浮选设备产品展示 */}
      <PageSection variant="gray" className="flex-grow">
        <div className="max-w-7xl mx-auto h-full">
          <LoadingWrapper 
            isLoading={loading}
            fallback={
              <div className="flex justify-center items-center h-[600px]">
                <div className="text-center">
                  <p className="text-gray-500">{isZh ? '数据加载中...' : 'Loading data...'}</p>
                </div>
              </div>
            }
          >
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
                {products.map((product) => (
                  <ProductCard 
                    key={product.uniqueId || product.id} 
                    product={product} 
                    basePath={`/products/flotation`} 
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
          </LoadingWrapper>
        </div>
      </PageSection>
    </div>
  );
} 