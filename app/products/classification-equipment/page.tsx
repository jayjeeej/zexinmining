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
  sandReturnCapacity?: {
    zh: string;
    en: string;
  };
  overflowCapacity?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  isClassifierProduct?: boolean;
  [key: string]: any;
}

// 分级设备产品列表页面
export default function ClassificationEquipmentPage() {
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
        const response = await fetch('/data/products/classification-products.json');
        
        if (response.ok) {
          const data = await response.json();
          // 处理产品数据
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.map((product: any) => ({
              id: product.id,
              model: product.model,
              series: {
                zh: product.nameZh || product.series?.zh || '',
                en: product.nameEn || product.series?.en || ''
              },
              sandReturnCapacity: formatCapacity(product.sandReturnCapacity),
              overflowCapacity: formatCapacity(product.overflowCapacity),
              motorPower: formatCapacity(product.motorPower),
              isClassifierProduct: true
            })));
          } else {
            // 如果没有数据或数据格式不正确，使用备用数据
            setProducts(getBackupClassifierProducts());
          }
        } else {
          // 如果请求失败，使用备用数据
          setProducts(getBackupClassifierProducts());
        }
      } catch (error) {
        console.error("Error loading classification equipment data:", error);
        // 出错时使用备用数据
        setProducts(getBackupClassifierProducts());
      } finally {
        setLoading(false);
      }
    }
    
    loadProductsData();
  }, [language]);

  // 分级设备备用数据
  const getBackupClassifierProducts = (): ProductData[] => {
    return [
      {
        id: 'high-weir-spiral-classifier',
        model: 'FG-1500',
        series: {
          zh: '高堰式单螺旋分级机',
          en: 'High Weir Spiral Classifier'
        },
        sandReturnCapacity: {
          zh: '10-50 t/h',
          en: '10-50 t/h'
        },
        overflowCapacity: {
          zh: '26-195 t/h',
          en: '26-195 t/h'
        },
        motorPower: {
          zh: '5.5-18.5 kW',
          en: '5.5-18.5 kW'
        },
        isClassifierProduct: true
      },
      {
        id: 'double-spiral-classifier',
        model: 'FLC-2000',
        series: {
          zh: '沉没式螺旋分级机',
          en: 'Submerged Spiral Classifier'
        },
        sandReturnCapacity: {
          zh: '160-11650 t/d',
          en: '160-11650 t/d'
        },
        overflowCapacity: {
          zh: '50-705 t/d',
          en: '50-705 t/d'
        },
        motorPower: {
          zh: '2.2-30 kW',
          en: '2.2-30 kW'
        },
        isClassifierProduct: true
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
              label: { zh: "分级设备", en: "Classification Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "分级设备" : "Classification Equipment"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh
                      ? "高精度的矿物颗粒分级设备，用于选矿过程中的颗粒分选，提高后续选别效率。我们的分级设备采用优化流体力学设计，低能耗高效率，适用于多种矿种的分级处理。"
                      : "High-precision mineral particle classification equipment for particle separation in beneficiation processes, improving subsequent separation efficiency. Our classification equipment uses optimized fluid dynamics design with low energy consumption and high efficiency, suitable for classification processing of various minerals."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 分级设备型号展示 */}
      <PageSection variant="gray" className="flex-grow">
        <div className="max-w-7xl mx-auto h-full">
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
                  basePath={`/products/classification-equipment`} 
                />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 