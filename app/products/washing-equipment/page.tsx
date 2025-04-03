'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import PageSection from '@/app/components/PageSection';
import ProductCard from '@/app/components/products/ProductCard';

// 产品数据类型定义
interface ProductData {
  id: string;
  model: string;
  series: {
    zh: string;
    en: string;
  };
  capacity?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  spiralDiameter?: {
    zh: string;
    en: string;
  };
  drumDiameter?: {
    zh: string;
    en: string;
  };
  isWasherProduct?: boolean;
}

export default function WashingEquipmentPage() {
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  // 格式化能力/功率范围为可读文本格式
  const formatCapacity = (capacity: any): { zh: string; en: string } => {
    if (!capacity) return { zh: '', en: '' };
    
    const min = capacity.min || 0;
    const max = capacity.max || min;
    const unit = capacity.unit || '';
    
    const formatted = `${min === max ? min : min + '-' + max} ${unit}`;
    return { zh: formatted, en: formatted };
  };
  
  // 确保产品数据完整
  const ensureProductData = (product: any): ProductData => {
    return {
      id: product.id || '',
      model: product.model || '',
      series: {
        zh: product.nameZh || product.series?.zh || '',
        en: product.nameEn || product.series?.en || ''
      },
      capacity: formatCapacity(product.capacity),
      motorPower: formatCapacity(product.motorPower),
      spiralDiameter: product.id?.includes('spiral') ? formatCapacity(product.spiralDiameter || { min: 900, max: 1800, unit: 'mm' }) : undefined,
      drumDiameter: product.id?.includes('drum') ? formatCapacity(product.drumDiameter || { min: 1500, max: 3000, unit: 'mm' }) : undefined,
      isWasherProduct: true
    };
  };

  useEffect(() => {
    async function loadProductsData() {
      try {
        setLoading(true);
        
        // 从JSON文件获取产品数据
        const spiralWasherRes = await fetch('/data/products/spiral-washer.json');
        const doubleSpiralWasherRes = await fetch('/data/products/double-spiral-washer.json');
        const drumWasherRes = await fetch('/data/products/drum-washer.json');
        
        // 检查响应状态并解析JSON
        if (spiralWasherRes.ok && doubleSpiralWasherRes.ok && drumWasherRes.ok) {
          const spiralWasher = await spiralWasherRes.json();
          const doubleSpiralWasher = await doubleSpiralWasherRes.json();
          const drumWasher = await drumWasherRes.json();
          
          // 格式化产品数据，并确保关键数据存在
          const productsList = [
            ensureProductData(spiralWasher),
            ensureProductData(doubleSpiralWasher),
            ensureProductData(drumWasher)
          ];
          
          console.log("洗矿设备产品数据:", productsList);
          setProducts(productsList);
        } else {
          console.error('无法加载产品数据，使用备用数据');
          // 加载失败时使用硬编码数据作为备份
          setProducts(getWashingEquipmentProducts());
        }
      } catch (error) {
        console.error('加载产品数据失败:', error);
        setProducts(getWashingEquipmentProducts());
      } finally {
        setLoading(false);
      }
    }

    loadProductsData();
  }, []);

  // 洗矿设备产品数据（备用）
  const getWashingEquipmentProducts = (): ProductData[] => {
    return [
      {
        id: 'spiral-washer',
        model: 'FG系列',
        series: {
          zh: '单螺旋洗矿机',
          en: 'Spiral Washer'
        },
        capacity: {
          zh: '10-50 t/h',
          en: '10-50 t/h'
        },
        motorPower: {
          zh: '3-11 kW',
          en: '3-11 kW'
        },
        spiralDiameter: {
          zh: '900-1800 mm',
          en: '900-1800 mm'
        },
        isWasherProduct: true
      },
      {
        id: 'double-spiral-washer',
        model: '2FG系列',
        series: {
          zh: '双螺旋洗矿机',
          en: 'Double Spiral Washer'
        },
        capacity: {
          zh: '15-100 t/h',
          en: '15-100 t/h'
        },
        motorPower: {
          zh: '5.5-22 kW',
          en: '5.5-22 kW'
        },
        spiralDiameter: {
          zh: '1000-2000 mm',
          en: '1000-2000 mm'
        },
        isWasherProduct: true
      },
      {
        id: 'drum-washer',
        model: 'GT系列',
        series: {
          zh: '滚筒洗矿机',
          en: 'Drum Washer'
        },
        capacity: {
          zh: '30-200 t/h',
          en: '30-200 t/h'
        },
        motorPower: {
          zh: '7.5-45 kW',
          en: '7.5-45 kW'
        },
        drumDiameter: {
          zh: '1500-3000 mm',
          en: '1500-3000 mm'
        },
        isWasherProduct: true
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
              label: { zh: "洗矿设备", en: "Washing Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "洗矿设备" : "Washing Equipment"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh 
                      ? "泽鑫矿山设备洗矿设备包括单螺旋洗矿机、双螺旋洗矿机和滚筒洗矿机，用于去除矿石表面的泥质和杂质，提高选矿效率。设备具有结构坚固、清洗效果好、处理量大、能耗低等特点。" 
                      : "Zexin Mining's washing equipment includes spiral washers, double spiral washers, and drum washers, used to remove clay and impurities from ore surfaces to improve beneficiation efficiency. The equipment features robust structure, excellent cleaning effect, large processing capacity, and low energy consumption."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 洗矿设备型号展示 */}
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
                  basePath={`/products/washing-equipment`} 
                />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 