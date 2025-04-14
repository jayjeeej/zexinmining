'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import ProductCard from '@/app/components/ProductCard';
import PageSection from '@/app/components/PageSection';
import { useLanguage } from "@/app/contexts/LanguageContext";

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

// 固定式破碎机产品列表页面
export default function StationaryCrushersPage() {
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 移除预加载效果，使用Next.js优化的方式
  useEffect(() => {
    // 使用 AbortController 来管理请求
    const controller = new AbortController();
    const signal = controller.signal;
    
    async function loadProductsData() {
      try {
        // 在生产环境中一次性获取所有产品数据，减少HTTP请求数量
        try {
          // 首先尝试获取汇总JSON文件
          const allProductsRes = await fetch('/data/products/crusher-products.json', { 
            signal,
            next: { revalidate: 3600 } // 1小时缓存，在Next.js中推荐使用
          });
          
          if (allProductsRes.ok) {
            const allProducts = await allProductsRes.json();
            const processedProducts = allProducts.map(ensureProductData);
            setProducts(processedProducts);
            setLoading(false);
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
        
        const responses = await Promise.all(
          productUrls.map(url => 
            fetch(url, { 
              signal,
              next: { revalidate: 3600 } // 使用Next.js的revalidate机制替代cache属性
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
          setProducts(productsData);
        } else {
          // 如果所有产品加载失败，使用备用数据
          setProducts(getBackupCrusherProducts());
        }
      } catch (error: unknown) {
        const err = error as Error;
        if (err.name !== 'AbortError') {
          console.error('Error loading products:', err);
          setProducts(getBackupCrusherProducts());
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
  }, [language]);

  // 备用产品数据
  const getBackupCrusherProducts = (): ProductData[] => {
    return [
      {
        id: 'jaw-crusher',
        model: 'PE/PEX',
        series: {
          zh: '颚式破碎机',
          en: 'Jaw Crusher'
        },
        capacity: {
          zh: '1-650 t/h',
          en: '1-650 t/h'
        },
        feedSize: {
          zh: '≤ 1200 mm',
          en: '≤ 1200 mm'
        },
        motorPower: {
          zh: '5.5-160 kW',
          en: '5.5-160 kW'
        },
        isCrusherProduct: true
      },
      {
        id: 'cone-crusher',
        model: 'PYB-1200',
        series: {
          zh: '圆锥破碎机',
          en: 'Cone Crusher'
        },
        capacity: {
          zh: '40-500 t/h',
          en: '40-500 t/h'
        },
        feedSize: {
          zh: '35-350 mm',
          en: '35-350 mm'
        },
        motorPower: {
          zh: '30-280 kW',
          en: '30-280 kW'
        },
        isCrusherProduct: true
      },
      {
        id: 'impact-crusher',
        model: 'PF',
        series: {
          zh: '反击式破碎机',
          en: 'Impact Crusher'
        },
        capacity: {
          zh: '50-250 t/h',
          en: '50-250 t/h'
        },
        feedSize: {
          zh: '≤ 800 mm',
          en: '≤ 800 mm'
        },
        motorPower: {
          zh: '55-250 kW',
          en: '55-250 kW'
        },
        isCrusherProduct: true
      },
      {
        id: 'hammer-crusher',
        model: 'PC',
        series: {
          zh: '锤式破碎机',
          en: 'Hammer Crusher'
        },
        capacity: {
          zh: '15-150 t/h',
          en: '15-150 t/h'
        },
        feedSize: {
          zh: '≤ 600 mm',
          en: '≤ 600 mm'
        },
        motorPower: {
          zh: '15-160 kW',
          en: '15-160 kW'
        },
        isCrusherProduct: true
      },
      {
        id: 'double-roller-crusher',
        model: '2PG',
        series: {
          zh: '双辊破碎机',
          en: 'Double Roller Crusher'
        },
        capacity: {
          zh: '50-360 t/h',
          en: '50-360 t/h'
        },
        feedSize: {
          zh: '≤ 300 mm',
          en: '≤ 300 mm'
        },
        motorPower: {
          zh: '30-160 kW',
          en: '30-160 kW'
        },
        isCrusherProduct: true
      },
      {
        id: 'heavy-duty-double-roller-crusher',
        model: '2PG-HD',
        series: {
          zh: '重型双辊破碎机',
          en: 'Heavy Duty Double Roller Crusher'
        },
        capacity: {
          zh: '80-450 t/h',
          en: '80-450 t/h'
        },
        feedSize: {
          zh: '≤ 400 mm',
          en: '≤ 400 mm'
        },
        motorPower: {
          zh: '55-200 kW',
          en: '55-200 kW'
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
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  basePath={`/products/stationary-crushers`} 
                />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 