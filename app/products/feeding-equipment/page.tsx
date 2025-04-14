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
  motorPower?: {
    zh: string;
    en: string;
  };
  [key: string]: any;
}

// 给料设备产品列表页面
export default function FeedingEquipmentPage() {
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 预加载图片，加快渲染速度
    function preloadImages() {
      const imageUrls = [
        '/images/products/feeding/belt-feeder.png',
        '/images/products/feeding/plate-feeder.png',
        '/images/products/feeding/disc-feeder.png',
        '/images/products/feeding/electromagnetic-vibrating-feeder.png',
        '/images/products/feeding/xdg-vibrating-feeder.png'
      ];
      
      imageUrls.forEach(url => {
        // 使用window.Image构造函数明确类型
        const img = new (window.Image as any)();
        img.src = url;
      });
    }
    
    async function loadProductsData() {
      // 缓存键，基于语言设置
      const cacheKey = `feeding-equipment-data-${language}`;
      
      // 尝试从会话存储中获取缓存的数据
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log("从缓存加载给料设备产品数据");
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
        const combinedJsonUrl = `/data/products/compiled/feeding-equipment-${language}.json`;
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
          // 如果合并文件不存在，回退到并行请求多个文件
          console.log("合并数据文件不存在，回退到并行请求");
          const feedingTypes = [
            'belt-feeder',
            'plate-feeder',
            'disc-feeder',
            'electromagnetic-vibrating-feeder',
            'xdg-vibrating-feeder'
          ];
          
          // 创建AbortController用于取消请求
          const controller = new AbortController();
          const { signal } = controller;
          
          // 设置请求超时
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            // 并行请求所有产品数据
            const responses = await Promise.all(
              feedingTypes.map(type => 
                fetch(`/data/products/${type}.json`, { 
                  signal,
                  cache: 'force-cache'
                })
              )
            );
            
            // 清除超时
            clearTimeout(timeoutId);
            
            // 检查所有响应是否成功
            const allSuccessful = responses.every(res => res.ok);
            
            if (allSuccessful) {
              // 并行解析所有JSON响应
              const jsonData = await Promise.all(
                responses.map(res => res.json())
              );
              
              // 格式化产品数据
              const productsList = [
                {...formatProductData(jsonData[0]), uniqueId: 'belt-feeder-1'}, 
                {...formatProductData(jsonData[1]), uniqueId: 'plate-feeder-1'}, 
                {...formatProductData(jsonData[2]), uniqueId: 'disc-feeder-1'}, 
                {...formatProductData(jsonData[3]), uniqueId: 'electromagnetic-feeder-1'},
                {...formatProductData(jsonData[4]), uniqueId: 'xdg-feeder-1'}
              ];
              
              setProducts(productsList);
              
              // 存储到会话缓存中
              sessionStorage.setItem(cacheKey, JSON.stringify(productsList));
            } else {
              // 至少有一个请求失败，使用备份数据
              console.error('部分产品数据加载失败');
              setProducts(getBackupFeedingProducts());
            }
          } catch (error: any) {
            // 如果是因为超时或取消导致的错误，不需要处理
            if (error.name !== 'AbortError') {
              console.error('Error loading products via parallel requests:', error);
              setProducts(getBackupFeedingProducts());
            }
          }
        }
      } catch (error: any) {
        console.error('Error loading products:', error);
        // 加载失败时使用硬编码数据
        setProducts(getBackupFeedingProducts());
      } finally {
        setLoading(false);
      }
    }
    
    // 格式化产品数据
    function formatProductData(product: any) {
      return {
        id: product.id || '',
        model: product.model || '',
        series: {
          zh: product.nameZh || product.series?.zh || '',
          en: product.nameEn || product.series?.en || ''
        },
        image: product.imagePath || `/images/products/feeding/${product.id || 'default'}.png`,
        capacity: formatCapacity(product.capacity),
        motorPower: formatCapacity(product.motorPower),
        feedSize: formatCapacity(product.feedSize),
        power: formatCapacity(product.power),
        beltWidth: formatCapacity(product.beltWidth),
        plateWidth: formatCapacity(product.plateWidth),
        discDiameter: formatCapacity(product.discDiameter),
        trough: formatCapacity(product.trough),
        isFeedingProduct: true
      };
    }
    
    // 加载产品数据并预加载图片
    loadProductsData();
    preloadImages();
    
    // 组件卸载时清理
    return () => {
      // 如果有需要清理的资源，在这里处理
    };
  }, [language]);

  // 格式化能力数据的辅助函数
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
  
  // 备用产品数据
  const getBackupFeedingProducts = (): ProductData[] => {
    return [
      {
        id: "belt-feeder",
        model: "B650-B1600",
        series: {
          zh: "带式给料机",
          en: "Belt Feeder"
        },
        image: "/images/products/feeders/belt-feeder.png",
        capacity: {
          zh: "30-1800 t/h",
          en: "30-1800 t/h"
        },
        feedSize: {
          zh: "≤500 mm",
          en: "≤500 mm"
        },
        beltWidth: {
          zh: "650-1600 mm",
          en: "650-1600 mm"
        },
        motorPower: {
          zh: "5.5-45 kW",
          en: "5.5-45 kW"
        },
        isFeedingProduct: true,
        uniqueId: "belt-feeder-1"
      },
      {
        id: "plate-feeder",
        model: "ZSW380-ZSW960",
        series: {
          zh: "板式给料机",
          en: "Plate Feeder"
        },
        image: "/images/products/feeders/plate-feeder.png",
        capacity: {
          zh: "80-800 t/h",
          en: "80-800 t/h"
        },
        feedSize: {
          zh: "≤800 mm",
          en: "≤800 mm"
        },
        plateWidth: {
          zh: "800-1500 mm",
          en: "800-1500 mm"
        },
        motorPower: {
          zh: "7.5-55 kW",
          en: "7.5-55 kW"
        },
        isFeedingProduct: true,
        uniqueId: "plate-feeder-1"
      },
      {
        id: "disc-feeder",
        model: "SCZ",
        series: {
          zh: "圆盘给料机",
          en: "Disc Feeder"
        },
        image: "/images/products/feeders/disc-feeder.png",
        capacity: {
          zh: "8-800 t/h",
          en: "8-800 t/h"
        },
        feedSize: {
          zh: "≤300 mm",
          en: "≤300 mm"
        },
        discDiameter: {
          zh: "1000-3600 mm",
          en: "1000-3600 mm"
        },
        motorPower: {
          zh: "3-22 kW",
          en: "3-22 kW"
        },
        isFeedingProduct: true,
        uniqueId: "disc-feeder-1"
      },
      {
        id: "electromagnetic-vibrating-feeder",
        model: "GZ1-GZ6",
        series: {
          zh: "电磁振动给料机",
          en: "Electromagnetic Vibrating Feeder"
        },
        image: "/images/products/feeders/electromagnetic-vibrating-feeder.png",
        capacity: {
          zh: "5-300 t/h",
          en: "5-300 t/h"
        },
        feedSize: {
          zh: "≤400 mm",
          en: "≤400 mm"
        },
        trough: {
          zh: "360-1500 mm",
          en: "360-1500 mm"
        },
        power: {
          zh: "0.15-4.0 kW",
          en: "0.15-4.0 kW"
        },
        isFeedingProduct: true,
        uniqueId: "electromagnetic-feeder-1"
      },
      {
        id: "xdg-vibrating-feeder",
        model: "XDG",
        series: {
          zh: "XDG振动给料机",
          en: "XDG Vibrating Feeder"
        },
        image: "/images/products/feeders/xdg-vibrating-feeder.png",
        capacity: {
          zh: "60-600 t/h",
          en: "60-600 t/h"
        },
        feedSize: {
          zh: "≤600 mm",
          en: "≤600 mm"
        },
        trough: {
          zh: "850-1800 mm",
          en: "850-1800 mm"
        },
        motorPower: {
          zh: "5.5-37 kW",
          en: "5.5-37 kW"
        },
        isFeedingProduct: true,
        uniqueId: "xdg-feeder-1"
      }
    ];
  };

  return (
    <div className="min-h-screen flex flex-col">
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
              label: { zh: "给料设备", en: "Feeding Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "给料设备" : "Feeding Equipment"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh
                      ? "我们提供多种专业给料设备，包括带式给料机、板式给料机、振动给料机等，用于各种物料的均匀给料。这些设备具有给料均匀、结构稳定、运行可靠等特点，可满足不同物料特性和给料工艺的需求。"
                      : "We provide various professional feeding equipment, including belt feeders, plate feeders, vibrating feeders, etc., for uniform feeding of various materials. These equipment feature uniform feeding, stable structure, reliable operation, and can meet the needs of different material characteristics and feeding processes."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 给料设备产品展示 */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
              {products.map((product) => (
                <ProductCard 
                  key={product.uniqueId || product.id} 
                  product={product} 
                  basePath={`/products/feeding-equipment`} 
                />
              ))}
            </div>
          </LoadingWrapper>
        </div>
      </PageSection>
    </div>
  );
} 