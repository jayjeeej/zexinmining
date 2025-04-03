'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import ProductCard from '@/app/components/products/ProductCard';
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
    async function loadProductsData() {
      try {
        const response = await fetch('/data/products/flotation-products.json');
        
        if (response.ok) {
          const data = await response.json();
          // 处理产品数据
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.map((product: any) => ({
              id: product.id,
              model: product.model,
              series: product.series,
              capacity: formatCapacity(product.capacity),
              effectiveVolume: formatCapacity(product.effectiveVolume),
              motorPower: formatCapacity(product.motorPower),
              image: product.image,
              isFlotationProduct: true
            })));
          } else {
            // 如果没有数据或数据格式不正确，使用备用数据
            setProducts([]);
          }
        } else {
          // 如果请求失败，使用备用数据
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading flotation equipment data:", error);
        // 出错时使用备用数据
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProductsData();
  }, [language]);

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

      {/* 浮选设备型号展示 */}
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
        </div>
      </PageSection>
    </div>
  );
} 