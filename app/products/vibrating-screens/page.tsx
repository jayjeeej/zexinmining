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
  screenSize?: {
    zh: string;
    en: string;
  };
  aperture?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  [key: string]: any;
}

// 固定式振动筛产品列表页面
export default function VibrationScreensPage() {
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
  
  // 确保数据完整性的函数
  const ensureProductData = (product: any) => {
    const id = product.id || '';
    
    // 针对固定式振动筛产品的处理逻辑
    if (id === 'circular-vibrating-screen' && !product.screenSize) {
      product.screenSize = { min: 4.2, max: 14.4, unit: 'm²' };
    } else if (id === 'linear-vibrating-screen' && !product.screenSize) {
      product.screenSize = { min: 3.0, max: 12.0, unit: 'm²' };
    }
    
    // 添加电机功率数据 - 从规格表中提取
    let motorPower;
    if (product.specifications && product.specifications.data && product.specifications.data.length > 0) {
      // 从规格表中查找电机功率数据
      const powerData = product.specifications.data.map((item: any) => {
        const power = item.power || item.motorPower;
        if (!power) return null;
        
        // 处理类似"2×5.5"或"2x5.5"格式的功率值
        if (typeof power === 'string' && (power.includes('×') || power.includes('x'))) {
          const parts = power.split(/[×x]/);
          if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const singlePower = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(singlePower)) {
              return num * singlePower; // 总功率 = 电机数量 × 单个电机功率
            }
          }
        }
        return parseFloat(power);
      }).filter(Boolean);
      
      if (powerData.length > 0) {
        // 获取功率最小值和最大值
        const minPower = Math.min(...powerData);
        const maxPower = Math.max(...powerData);
        
        motorPower = {
          min: minPower,
          max: maxPower,
          unit: 'kW'
        };
      }
    }
    
    // 优先使用JSON中定义的imagePath，否则根据ID生成
    let imagePath = product.imagePath || `/images/products/screens/${id}.jpg`;
    
    // 修复文件名可能包含的double extension (.jpg.jpg)
    if (imagePath.endsWith('.jpg.jpg')) {
      imagePath = imagePath.replace('.jpg.jpg', '.jpg');
    }
    
    return {
      id: id,
      model: product.model || '',
      series: {
        zh: product.series?.zh || product.nameZh || '',
        en: product.series?.en || product.nameEn || ''
      },
      image: imagePath,
      capacity: formatCapacity(product.capacity),
      screenSize: formatCapacity(product.screenSize),
      aperture: formatCapacity(product.aperture),
      motorPower: formatCapacity(motorPower || product.motorPower),
      isScreenProduct: true
    };
  };

  useEffect(() => {
    async function loadProductsData() {
      try {
        // 从JSON文件获取产品数据
        const yaCircularScreenRes = await fetch('/data/products/ya-circular-vibrating-screen.json');
        const linearScreenRes = await fetch('/data/products/linear-vibrating-screen.json');
        const bananaScreenRes = await fetch('/data/products/banana-vibrating-screen.json');
        const barScreenRes = await fetch('/data/products/bar-vibrating-screen.json');
        const drumScreenRes = await fetch('/data/products/drum-screen.json');
        const xdScreenRes = await fetch('/data/products/vibrating-screen.json');
        const zkrScreenRes = await fetch('/data/products/zkr-linear-vibrating-screen.json');
        
        // 检查响应状态并解析JSON
        if (yaCircularScreenRes.ok && linearScreenRes.ok && 
            bananaScreenRes.ok && barScreenRes.ok && drumScreenRes.ok && xdScreenRes.ok && zkrScreenRes.ok) {
          const yaCircularScreen = await yaCircularScreenRes.json();
          const linearScreen = await linearScreenRes.json();
          const bananaScreen = await bananaScreenRes.json();
          const barScreen = await barScreenRes.json();
          const drumScreen = await drumScreenRes.json();
          const xdScreen = await xdScreenRes.json();
          const zkrScreen = await zkrScreenRes.json();
          
          // 格式化产品数据，并确保关键数据存在
          const productsList = [
            {...ensureProductData(yaCircularScreen), uniqueId: 'ya-circular-1'}, 
            {...ensureProductData(linearScreen), uniqueId: 'linear-1'}, 
            {...ensureProductData(bananaScreen), uniqueId: 'banana-1'}, 
            {...ensureProductData(barScreen), uniqueId: 'bar-1'},
            {...ensureProductData(drumScreen), uniqueId: 'drum-1'},
            {...ensureProductData(xdScreen), uniqueId: 'xd-1'},
            {...ensureProductData(zkrScreen), uniqueId: 'zkr-1'}
          ];
          
          console.log("固定式振动筛产品数据:", productsList);
          setProducts(productsList);
        } else {
          console.error('Failed to load product data');
          // 加载失败时使用硬编码数据作为备份
          setProducts(getBackupScreenProducts());
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // 加载失败时使用硬编码数据
        setProducts(getBackupScreenProducts());
      } finally {
        setLoading(false);
      }
    }
    
    loadProductsData();
  }, [language]);

  // 备用产品数据
  const getBackupScreenProducts = (): ProductData[] => {
    return [
      {
        id: 'ya-circular-vibrating-screen',
        model: 'YA',
        series: {
          zh: 'YA圆振动筛',
          en: 'YA Circular Vibrating Screen'
        },
        capacity: {
          zh: '60-350 m³/h',
          en: '60-350 m³/h'
        },
        screenSize: {
          zh: '4.2-14.4 m²',
          en: '4.2-14.4 m²'
        },
        aperture: {
          zh: '5-100 mm',
          en: '5-100 mm'
        },
        motorPower: {
          zh: '11-37 kW',
          en: '11-37 kW'
        },
        isScreenProduct: true
      },
      {
        id: 'linear-vibrating-screen',
        model: 'ZK',
        series: {
          zh: '直线振动筛',
          en: 'Linear Vibrating Screen'
        },
        capacity: {
          zh: '50-300 m³/h',
          en: '50-300 m³/h'
        },
        screenSize: {
          zh: '3.0-12.0 m²',
          en: '3.0-12.0 m²'
        },
        aperture: {
          zh: '0.5-50 mm',
          en: '0.5-50 mm'
        },
        motorPower: {
          zh: '7.5-30 kW',
          en: '7.5-30 kW'
        },
        isScreenProduct: true
      },
      {
        id: 'zkr-linear-vibrating-screen',
        model: 'ZKR',
        series: {
          zh: 'ZKR直线振动筛',
          en: 'ZKR Linear Vibrating Screen'
        },
        capacity: {
          zh: '30-540 m³/h',
          en: '30-540 m³/h'
        },
        screenSize: {
          zh: '3.6-14.4 m²',
          en: '3.6-14.4 m²'
        },
        aperture: {
          zh: '0.25-50 mm',
          en: '0.25-50 mm'
        },
        motorPower: {
          zh: '11-44 kW',
          en: '11-44 kW'
        },
        isScreenProduct: true
      },
      {
        id: 'banana-vibrating-screen',
        model: 'BF',
        series: {
          zh: '香蕉筛',
          en: 'Banana Vibrating Screen'
        },
        capacity: {
          zh: '80-450 m³/h',
          en: '80-450 m³/h'
        },
        screenSize: {
          zh: '6.5-25.0 m²',
          en: '6.5-25.0 m²'
        },
        aperture: {
          zh: '5-100 mm',
          en: '5-100 mm'
        },
        motorPower: {
          zh: '15-45 kW',
          en: '15-45 kW'
        },
        isScreenProduct: true
      },
      {
        id: 'bar-vibrating-screen',
        model: 'DGS',
        series: {
          zh: '棒条筛',
          en: 'Bar Vibrating Screen'
        },
        capacity: {
          zh: '60-380 m³/h',
          en: '60-380 m³/h'
        },
        screenSize: {
          zh: '5.0-18.0 m²',
          en: '5.0-18.0 m²'
        },
        aperture: {
          zh: '10-150 mm',
          en: '10-150 mm'
        },
        motorPower: {
          zh: '11-37 kW',
          en: '11-37 kW'
        },
        isScreenProduct: true
      },
      {
        id: 'drum-screen',
        model: 'GT',
        series: {
          zh: '滚筒筛',
          en: 'Drum Screen'
        },
        capacity: {
          zh: '30-200 m³/h',
          en: '30-200 m³/h'
        },
        screenSize: {
          zh: '3.5-14.0 m²',
          en: '3.5-14.0 m²'
        },
        aperture: {
          zh: '10-120 mm',
          en: '10-120 mm'
        },
        motorPower: {
          zh: '5.5-22 kW',
          en: '5.5-22 kW'
        },
        isScreenProduct: true
      },
      {
        id: 'vibrating-screen',
        model: 'XD1845',
        series: {
          zh: 'XD系列振动筛',
          en: 'XD Series Vibrating Screen'
        },
        capacity: {
          zh: '50-600 m³/h',
          en: '50-600 m³/h'
        },
        screenSize: {
          zh: '3.6-21.0 m²',
          en: '3.6-21.0 m²'
        },
        aperture: {
          zh: '2-50 mm',
          en: '2-50 mm'
        },
        motorPower: {
          zh: '7.5-45 kW',
          en: '7.5-45 kW'
        },
        isScreenProduct: true,
        uniqueId: 'xd-1'
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
              label: { zh: "固定式振动筛", en: "Stationary Vibrating Screens" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "固定式振动筛" : "Stationary Vibrating Screens"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh
                      ? "我们提供多种高精度筛分设备，包括圆振动筛、直线振动筛、香蕉筛、棒条筛和滚筒筛等，用于矿石的分级和分选，确保后续加工的粒度要求。这些设备具有筛分效率高、处理量大、结构稳定、维护方便等特点。"
                      : "We provide various high-precision screening equipment, including circular vibrating screens, linear vibrating screens, banana screens, bar screens and drum screens, for ore classification and sorting, ensuring particle size requirements for subsequent processing. These equipment feature high screening efficiency, large processing capacity, stable structure, and easy maintenance."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 固定式振动筛型号展示 */}
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
                  key={product.uniqueId || product.id} 
                  product={product} 
                  basePath={`/products/vibrating-screens`} 
                />
              ))}
            </div>
          )}
        </div>
      </PageSection>
    </div>
  );
} 