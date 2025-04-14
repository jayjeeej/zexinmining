'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import ProductCard from '@/app/components/ProductCard';
import PageSection from '@/app/components/PageSection';
import { useLanguage } from "@/app/contexts/LanguageContext";
import Head from 'next/head';

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
  feedSize?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  [key: string]: any;
}

// 建立资源缓存系统，避免重复请求
const resourceCache: Record<string, any> = {};

// 固定式破碎机产品列表页面
export default function StationaryCrushersPage() {
  const router = useRouter();
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 预加载关键资源标签
  const preloadTags = useMemo(() => {
    return [
      <link key="jaw-crusher" rel="preload" href="/images/products/crushers/jaw-crusher.png" as="image" type="image/png" />,
      <link key="cone-crusher" rel="preload" href="/images/products/crushers/cone-crusher.png" as="image" type="image/png" />,
      <link key="impact-crusher" rel="preload" href="/images/products/crushers/impact-crusher.png" as="image" type="image/png" />
    ];
  }, []);
  
  // 添加路由预取功能，提高体验
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 预取相关产品类别
      router.prefetch('/products/vibrating-screens');
      router.prefetch('/products/grinding-equipment');
      
      // 使用 requestIdleCallback 在浏览器空闲时预取可能访问的详情页
      if ('requestIdleCallback' in window) {
        const idleCallback = window.requestIdleCallback(() => {
          const commonProductIds = ['jaw-crusher', 'cone-crusher', 'impact-crusher'];
          commonProductIds.forEach(id => {
            router.prefetch(`/products/stationary-crushers/${id}`);
          });
        });
        
        return () => {
          if ('cancelIdleCallback' in window) {
            window.cancelIdleCallback(idleCallback);
          }
        };
      }
    }
  }, [router]);
  
  // 优化数据获取
  useEffect(() => {
    // 使用 AbortController 来管理请求
    const controller = new AbortController();
    const signal = controller.signal;
    
    // 添加资源预加载
    if (typeof window !== 'undefined') {
      // 预加载关键图片资源
      const preloadLinks = [
        '/images/products/crushers/jaw-crusher.png',
        '/images/products/crushers/cone-crusher.png',
        '/images/products/crushers/impact-crusher.png'
      ];
      
      preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = href;
        document.head.appendChild(link);
      });
    }
    
    async function loadProductsData() {
      // 如果产品数据已加载且用户切换语言，无需重新获取数据
      if (products.length > 0) {
        return;
      }
      
      // 检查内存缓存，避免重复请求
      const cacheKey = `crusher-products-${language}`;
      if (resourceCache[cacheKey]) {
        setProducts(resourceCache[cacheKey]);
        setLoading(false);
        return;
      }
      
      try {
        // 在生产环境中一次性获取所有产品数据，减少HTTP请求数量
        try {
          // 首先尝试获取汇总JSON文件
          const allProductsRes = await fetch('/data/products/crusher-products.json', { 
            signal,
            // 优化缓存策略
            cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'default',
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (allProductsRes.ok) {
            const allProducts = await allProductsRes.json();
            const processedProducts = allProducts.map(ensureProductData);
            
            // 保存到内存缓存
            resourceCache[cacheKey] = processedProducts;
            
            setProducts(processedProducts);
            setLoading(false);
            
            // 预加载下一张可能需要的图片
            if (typeof window !== 'undefined') {
              // 使用 requestIdleCallback 在浏览器空闲时预加载图片
              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => {
                  const secondaryImages = [
                    '/images/products/crushers/hammer-crusher.png',
                    '/images/products/crushers/double-roller-crusher.png'
                  ];
                  
                  secondaryImages.forEach(src => {
                    const img = new (window.Image as any)();
                    img.src = src;
                  });
                });
              }
            }
            
            return;
          }
        } catch (err) {
          // 如果汇总文件不存在或加载失败，回退到单独加载
          console.info('No combined data file, loading individual files');
        }
        
        // 回退方案：并行加载单独文件
        const productUrls = [
          '/data/products/jaw-crusher.json',
          '/data/products/cone-crusher.json',
          '/data/products/impact-crusher.json',
          '/data/products/hammer-crusher.json',
          '/data/products/double-roller-crusher.json',
          '/data/products/heavy-duty-double-roller-crusher.json'
        ];
        
        // 使用Promise.all并行请求所有产品数据
        const responses = await Promise.all(
          productUrls.map(url => 
            fetch(url, { 
              signal,
              // 使用适当的缓存策略
              cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'default',
              priority: 'high', // 在支持的浏览器中提高请求优先级
              headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            })
              .then(res => res.ok ? res.json() : null)
              .catch(err => {
                if (err.name !== 'AbortError') {
                  console.error(`Error loading ${url}:`, err);
                }
                return null;
              })
          )
        );
        
        // 过滤掉加载失败的产品和格式化数据
        const productsData = responses
          .filter(Boolean)
          .map(product => ensureProductData(product));
        
        if (productsData.length > 0) {
          // 保存到内存缓存
          resourceCache[cacheKey] = productsData;
          
          setProducts(productsData);
        } else {
          // 如果所有产品加载失败，使用备用数据
          const backupData = getBackupCrusherProducts();
          
          // 保存到内存缓存
          resourceCache[cacheKey] = backupData;
          
          setProducts(backupData);
        }
      } catch (error: unknown) {
        const err = error as Error;
        if (err.name !== 'AbortError') {
          console.error('Error loading products:', err);
          const backupData = getBackupCrusherProducts();
          
          // 保存到内存缓存
          resourceCache[cacheKey] = backupData;
          
          setProducts(backupData);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadProductsData();
    
    // 组件卸载时取消所有正在进行的请求
    return () => {
      controller.abort();
    };
  }, [language, products.length]);

  // 备用产品数据
  const getBackupCrusherProducts = (): ProductData[] => {
    return [
      {
        id: "jaw-crusher",
        model: "PE100150",
        series: {
          zh: "颚式破碎机",
          en: "Jaw Crusher"
        },
        image: "/images/products/crushers/jaw-crusher.png",
        capacity: {
          zh: "1-300 t/h",
          en: "1-300 t/h"
        },
        feedSize: {
          zh: "80-750 mm",
          en: "80-750 mm"
        },
        motorPower: {
          zh: "5.5-110 kW",
          en: "5.5-110 kW"
        },
        isCrusherProduct: true
      },
      {
        id: "cone-crusher",
        model: "CS/CH",
        series: {
          zh: "圆锥破碎机",
          en: "Cone Crusher"
        },
        image: "/images/products/crushers/cone-crusher.png",
        capacity: {
          zh: "45-1200 t/h",
          en: "45-1200 t/h"
        },
        feedSize: {
          zh: "35-300 mm",
          en: "35-300 mm"
        },
        motorPower: {
          zh: "75-400 kW",
          en: "75-400 kW"
        },
        isCrusherProduct: true
      },
      {
        id: "impact-crusher",
        model: "PF/PFW",
        series: {
          zh: "反击式破碎机",
          en: "Impact Crusher"
        },
        image: "/images/products/crushers/impact-crusher.png",
        capacity: {
          zh: "30-800 t/h",
          en: "30-800 t/h"
        },
        feedSize: {
          zh: "100-500 mm",
          en: "100-500 mm"
        },
        motorPower: {
          zh: "37-260 kW",
          en: "37-260 kW"
        },
        isCrusherProduct: true
      },
      {
        id: "hammer-crusher",
        model: "PC",
        series: {
          zh: "锤式破碎机",
          en: "Hammer Crusher"
        },
        image: "/images/products/crushers/hammer-crusher.png",
        capacity: {
          zh: "15-150 t/h",
          en: "15-150 t/h"
        },
        feedSize: {
          zh: "≤ 600 mm",
          en: "≤ 600 mm"
        },
        motorPower: {
          zh: "15-160 kW",
          en: "15-160 kW"
        },
        isCrusherProduct: true
      },
      {
        id: "double-roller-crusher",
        model: "2PG",
        series: {
          zh: "双辊破碎机",
          en: "Double Roller Crusher"
        },
        image: "/images/products/crushers/double-roller-crusher.png",
        capacity: {
          zh: "50-360 t/h",
          en: "50-360 t/h"
        },
        feedSize: {
          zh: "≤ 300 mm",
          en: "≤ 300 mm"
        },
        motorPower: {
          zh: "30-160 kW",
          en: "30-160 kW"
        },
        isCrusherProduct: true
      },
      {
        id: "heavy-duty-double-roller-crusher",
        model: "2PG-HD",
        series: {
          zh: "重型双辊破碎机",
          en: "Heavy Duty Double Roller Crusher"
        },
        image: "/images/products/crushers/heavy-duty-double-roller-crusher.png",
        capacity: {
          zh: "80-450 t/h",
          en: "80-450 t/h"
        },
        feedSize: {
          zh: "≤ 400 mm",
          en: "≤ 400 mm"
        },
        motorPower: {
          zh: "55-200 kW",
          en: "55-200 kW"
        },
        isCrusherProduct: true
      }
    ];
  };

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
  
  // 确保数据完整性的函数，特别针对颚式和双棍破碎机
  const ensureProductData = (product: any) => {
    const id = product.id || '';
    
    // 处理颚式破碎机和双棍破碎机的数据
    if (id === 'jaw-crusher') {
      // 颚式破碎机：确保使用正确的maxFeedSize
      if (!product.feedSize && product.maxFeedSize) {
        product.feedSize = product.maxFeedSize;
      } else if (!product.feedSize) {
        product.feedSize = { min: 80, max: 750, unit: 'mm' };  // 颚式破碎机正确的进料口
      }
    } else if (id.includes('double-roller')) {
      // 双辊破碎机：如果没有进料口数据，添加一个默认的
      if (!product.feedSize) {
        product.feedSize = { min: 50, max: 300, unit: 'mm' };
      }
    }
    
    // 统一图片路径格式
    const imagePath = `/images/products/crushers/${id}.png`;
    
    return {
      id: id,
      model: product.model || '',
      series: {
        zh: product.series?.zh || product.nameZh || '',
        en: product.series?.en || product.nameEn || ''
      },
      image: imagePath,
      capacity: formatCapacity(product.capacity),
      feedSize: formatCapacity(product.feedSize),
      motorPower: formatCapacity(product.motorPower),
      isCrusherProduct: true
    };
  };

  return (
    <>
      {/* 添加预加载标签 */}
      <Head>{preloadTags}</Head>
      
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
                label: { zh: "固定式破碎机", en: "Stationary Crushers" }
              }
            ]
          }}
        >
          <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
                <div className="md:w-1/2 pl-0">
                  <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                    {isZh ? "固定式破碎机" : "Stationary Crushers"}
                  </h1>
                </div>
                
                <div className="md:w-1/2 pr-0">
                  <div className="space-y-4 text-black text-left content-right">
                    <p>
                      {isZh
                        ? "我们提供高效的固定式破碎机，包括颚式破碎机、圆锥破碎机、反击式破碎机、锤式破碎机和辊式破碎机等，适用于各种硬度矿石的破碎作业，具有产能大、破碎比高、运行稳定、维护简便等特点。"
                        : "We provide efficient stationary crushers, including jaw crushers, cone crushers, impact crushers, hammer crushers, and roller crushers, suitable for crushing operations of various hardness ores, featuring high capacity, high crushing ratio, stable operation, and easy maintenance."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageSection>

        {/* 破碎机型号展示 */}
        <PageSection variant="gray" className="flex-grow">
          <div className="max-w-7xl mx-auto h-full">
            {/* 型号列表 - 每行3个产品 */}
            {loading ? (
              <div className="flex justify-center items-center h-[600px]">
                <div className="text-center">
                  <p className="text-gray-500">{isZh ? '加载产品数据...' : 'Loading products data...'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
                {products.map((product) => (
                  <div key={product.id} data-product-id={product.id}>
                    <ProductCard 
                      product={product} 
                      basePath={`/products/stationary-crushers`} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageSection>
      </div>
    </>
  );
} 