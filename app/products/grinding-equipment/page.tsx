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
  motorPower?: {
    zh: string;
    en: string;
  };
  [key: string]: any;
}

// 研磨设备产品列表页面
export default function GrindingEquipmentPage() {
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadProducts() {
      try {
        // 从JSON文件获取数据
        const overflowBallMillRes = await fetch('/data/products/overflow-ball-mill.json');
        const wetGridBallMillRes = await fetch('/data/products/wet-grid-ball-mill.json');
        const dryGridBallMillRes = await fetch('/data/products/dry-grid-ball-mill.json');
        const rodMillRes = await fetch('/data/products/rod-mill.json');

        // 检查响应状态
        if (overflowBallMillRes.ok && wetGridBallMillRes.ok && dryGridBallMillRes.ok && rodMillRes.ok) {
          const overflowBallMill = await overflowBallMillRes.json();
          const wetGridBallMill = await wetGridBallMillRes.json();
          const dryGridBallMill = await dryGridBallMillRes.json();
          const rodMill = await rodMillRes.json();

          // 格式化产品数据
          const productsList = [
            formatProductData(overflowBallMill),
            formatProductData(wetGridBallMill),
            formatProductData(dryGridBallMill),
            formatProductData(rodMill)
          ];

          if (productsList.length > 0) {
            setProducts(productsList);
          } else {
            console.error('Failed to load product data');
            // 加载失败时使用硬编码数据作为备份
            setProducts(getBackupGrindingProducts());
          }
        } else {
          console.error('Failed to load product data');
          // 加载失败时使用硬编码数据作为备份
          setProducts(getBackupGrindingProducts());
        }
        
        // 格式化产品数据
        function formatProductData(product: any) {
          return {
            id: product.id || getProductIdByName(product.nameEn || product.series?.en || product.nameZh || product.series?.zh || ''),
            model: product.model || '',
            series: {
              zh: product.nameZh || product.series?.zh || '',
              en: product.nameEn || product.series?.en || ''
            },
            capacity: formatCapacity(product.capacity),
            motorPower: formatCapacity(product.motorPower),
            feedSize: formatCapacity(product.feedSize),
            dischargeSize: formatCapacity(product.dischargeSize),
            isGrindingProduct: true
          };
        }
        
        // 根据产品名称生成统一的ID
        function getProductIdByName(name: string): string {
          const lowerName = name.toLowerCase();
          
          if (lowerName.includes('overflow') || lowerName.includes('溢流')) {
            return 'overflow-ball-mill';
          } else if (lowerName.includes('ball') || lowerName.includes('球磨')) {
            return 'wet-grid-ball-mill';
          } else if (lowerName.includes('rod') || lowerName.includes('棒磨')) {
            return 'rod-mill';
          } else if (lowerName.includes('sag') || lowerName.includes('半自磨')) {
            return 'sag-mill';
          }
          
          // 默认id
          return 'grinding-' + name.toLowerCase().replace(/\s+/g, '-');
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // 加载失败时使用硬编码数据
        setProducts(getBackupGrindingProducts());
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
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
  const getBackupGrindingProducts = (): ProductData[] => {
    return [
      {
        id: 'overflow-ball-mill',
        model: 'MQY2745',
        series: {
          zh: '溢流式球磨机',
          en: 'Overflow Ball Mill'
        },
        capacity: {
          zh: '1.5-45 t/h',
          en: '1.5-45 t/h'
        },
        motorPower: {
          zh: '15-245 kW',
          en: '15-245 kW'
        },
        isGrindingProduct: true
      },
      {
        id: 'wet-grid-ball-mill',
        model: 'MQYg1212-MQYg2145',
        series: {
          zh: '湿式格子型球磨机',
          en: 'Wet Grid Ball Mill'
        },
        capacity: {
          zh: '0.17-45 t/h',
          en: '0.17-45 t/h'
        },
        motorPower: {
          zh: '22-280 kW',
          en: '22-280 kW'
        },
        isGrindingProduct: true
      },
      {
        id: 'dry-grid-ball-mill',
        model: 'MQGg1212-MQGg2145',
        series: {
          zh: '干式格子型球磨机',
          en: 'Dry Grid Ball Mill'
        },
        capacity: {
          zh: '0.17-45 t/h',
          en: '0.17-45 t/h'
        },
        motorPower: {
          zh: '22-280 kW',
          en: '22-280 kW'
        },
        isGrindingProduct: true
      },
      {
        id: 'rod-mill',
        model: 'MQ2745',
        series: {
          zh: '棒磨机',
          en: 'Rod Mill'
        },
        capacity: {
          zh: '5-35 t/h',
          en: '5-35 t/h'
        },
        motorPower: {
          zh: '55-240 kW',
          en: '55-240 kW'
        },
        isGrindingProduct: true
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
              label: { zh: "产品与服务", en: "Products & Services" },
              href: "/products"
            },
            {
              label: { zh: "研磨设备", en: "Grinding Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "研磨设备" : "Grinding Equipment"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh
                      ? "高效率的物料细磨设备，用于精细化物料处理，提高后续选矿工艺的效率和回收率。我们的研磨设备采用先进技术，确保物料研磨均匀，具有高效、节能、可靠等特点。"
                      : "High-efficiency material grinding equipment for fine material processing, improving the efficiency and recovery rate of subsequent beneficiation processes. Our grinding equipment uses advanced technology to ensure uniform grinding with high efficiency, energy saving and reliability."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 产品列表区域 */}
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
                  basePath={`/products/grinding-equipment`} 
                />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 