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

// 给料设备产品列表页面
export default function FeedingEquipmentPage() {
  const { language, isZh } = useLanguage();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadProductsData() {
      try {
        // 从JSON文件获取产品数据
        const plateFeederRes = await fetch('/data/products/plate-feeder.json');
        const beltFeederRes = await fetch('/data/products/belt-feeder.json');
        const vibFeederRes = await fetch('/data/products/electromagnetic-vibrating-feeder.json');
        const discFeederRes = await fetch('/data/products/disc-feeder.json');
        const xdgFeederRes = await fetch('/data/products/xdg-vibrating-feeder.json');
        
        // 检查响应状态并解析JSON
        if (plateFeederRes.ok && beltFeederRes.ok && vibFeederRes.ok && discFeederRes.ok && xdgFeederRes.ok) {
          const plateFeeder = await plateFeederRes.json();
          const beltFeeder = await beltFeederRes.json();
          const vibFeeder = await vibFeederRes.json();
          const discFeeder = await discFeederRes.json();
          const xdgFeeder = await xdgFeederRes.json();
          
          // 格式化产品数据
          const formatProductData = (product: any) => {
            return {
              id: product.id || getProductIdByName(product.nameEn || product.series?.en || product.nameZh || product.series?.zh || ''),
              model: product.model || '',
              series: {
                zh: product.nameZh || product.series?.zh || '',
                en: product.nameEn || product.series?.en || ''
              },
              capacity: formatCapacity(product.capacity),
              motorPower: formatCapacity(product.motorPower),
              isFeederProduct: true
            };
          };
          
          // 根据产品名称生成统一的ID
          const getProductIdByName = (name: string): string => {
            const lowerName = name.toLowerCase();
            
            if (lowerName.includes('plate') || lowerName.includes('板式')) {
              return 'plate-feeder';
            } else if (lowerName.includes('belt') || lowerName.includes('带式')) {
              return 'belt-feeder';
            } else if ((lowerName.includes('vibrat') || lowerName.includes('振动')) && lowerName.includes('electro')) {
              return 'electromagnetic-vibrating-feeder';
            } else if (lowerName.includes('disc') || lowerName.includes('盘式')) {
              return 'disc-feeder';
            } else if (lowerName.includes('xdg')) {
              return 'xdg-vibrating-feeder';
            } else if (lowerName.includes('vibrat') || lowerName.includes('振动')) {
              return 'vibrating-feeder';
            }
            
            // 默认id
            return 'feeder-' + name.toLowerCase().replace(/\s+/g, '-');
          };
          
          const productsList = [
            formatProductData(plateFeeder),
            formatProductData(beltFeeder),
            formatProductData(vibFeeder),
            formatProductData(discFeeder),
            formatProductData(xdgFeeder)
          ];
          
          setProducts(productsList);
        } else {
          console.error('Failed to load product data');
          // 加载失败时使用硬编码数据作为备份
          setProducts(getBackupFeederProducts());
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // 加载失败时使用硬编码数据
        setProducts(getBackupFeederProducts());
      } finally {
        setLoading(false);
      }
    }
    
    loadProductsData();
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
      // 修正单位：给料机的处理能力单位统一为m³/h
      let unit = data.unit || '';
      if (unit === 't/h') {
        unit = 'm³/h';
      }
      const valueText = min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`;
      
      return {
        zh: valueText,
        en: valueText
      };
    }
    
    // 处理字符串格式
    if (typeof data === 'string') {
      // 修正单位：将字符串中的t/h替换为m³/h
      let processedString = data;
      if (data.includes('t/h')) {
        processedString = data.replace('t/h', 'm³/h');
      }
      
      return {
        zh: processedString,
        en: processedString
      };
    }
    
    return undefined;
  };
  
  // 备用产品数据
  const getBackupFeederProducts = (): ProductData[] => {
    return [
      {
        id: 'plate-feeder',
        model: 'GBH80-2.2',
        series: {
          zh: '板式给料机',
          en: 'Plate Feeder'
        },
        capacity: {
          zh: '15-217 m³/h',
          en: '15-217 m³/h'
        },
        motorPower: {
          zh: '7.5 kW',
          en: '7.5 kW'
        },
        isFeederProduct: true
      },
      {
        id: 'belt-feeder',
        model: 'DSJ-800',
        series: {
          zh: '带式给料机',
          en: 'Belt Feeder'
        },
        capacity: {
          zh: '30-400 m³/h',
          en: '30-400 m³/h'
        },
        motorPower: {
          zh: '5.5-22 kW',
          en: '5.5-22 kW'
        },
        isFeederProduct: true
      },
      {
        id: 'electromagnetic-vibrating-feeder',
        model: 'GZ3F',
        series: {
          zh: '电磁振动给料机',
          en: 'Electromagnetic Vibrating Feeder'
        },
        capacity: {
          zh: '30-380 m³/h',
          en: '30-380 m³/h'
        },
        motorPower: {
          zh: '0.45-2.2 kW',
          en: '0.45-2.2 kW'
        },
        isFeederProduct: true
      },
      {
        id: 'disc-feeder',
        model: 'BPF-550',
        series: {
          zh: '盘式给料机',
          en: 'Disc Feeder'
        },
        capacity: {
          zh: '20-120 m³/h',
          en: '20-120 m³/h'
        },
        motorPower: {
          zh: '4-11 kW',
          en: '4-11 kW'
        },
        isFeederProduct: true
      },
      {
        id: 'xdg-vibrating-feeder',
        model: 'XDG-1220',
        series: {
          zh: 'XDG系列振动给料机',
          en: 'XDG Series Vibrating Feeder'
        },
        capacity: {
          zh: '80-450 m³/h',
          en: '80-450 m³/h'
        },
        motorPower: {
          zh: '7.5-22 kW',
          en: '7.5-22 kW'
        },
        isFeederProduct: true
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
                      ? "泽鑫矿山设备给料设备包括板式给料机、带式给料机、振动给料机等，提供从料仓到生产线的稳定均匀给料，适用于矿山、砂石、水泥等行业。设备具有给料均匀、结构牢固、能耗低、维护简便等特点。"
                      : "Zexin Mining's feeding equipment includes plate feeders, belt feeders, vibrating feeders, etc., providing stable and uniform feeding from hoppers to production lines, suitable for mining, aggregate, cement and other industries. The equipment features uniform feeding, sturdy structure, low energy consumption, and easy maintenance."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 给料设备型号展示 */}
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
                  basePath={`/products/feeding-equipment`} 
                />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 