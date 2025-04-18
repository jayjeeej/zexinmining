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
    let imagePath = product.imagePath || `/images/products/screens/${id}.png`;
    
    // 修复文件名可能包含的double extension (.png.png)
    if (imagePath.endsWith('.jpg.png')) {
      imagePath = imagePath.replace('.jpg.png', '.png');
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
      // 缓存键，基于语言设置
      const cacheKey = `vibrating-screens-data-${language}`;
      
      // 尝试从会话存储中获取缓存的数据
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log("从缓存加载振动筛产品数据");
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
        // 如果无法立即创建组合文件，先使用Promise.all并行请求
        const combinedJsonUrl = `/data/products/compiled/vibrating-screens-${language}.json`;
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
          const screenTypes = [
            'ya-circular-vibrating-screen',
            'linear-vibrating-screen',
            'banana-vibrating-screen',
            'bar-vibrating-screen',
            'drum-screen',
            'vibrating-screen',
            'zkr-linear-vibrating-screen'
          ];
          
          // 创建AbortController用于取消请求
          const controller = new AbortController();
          const { signal } = controller;
          
          // 设置请求超时
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            // 并行请求所有产品数据
            const responses = await Promise.all(
              screenTypes.map(type => 
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
                {...ensureProductData(jsonData[0]), uniqueId: 'ya-circular-1'}, 
                {...ensureProductData(jsonData[1]), uniqueId: 'linear-1'}, 
                {...ensureProductData(jsonData[2]), uniqueId: 'banana-1'}, 
                {...ensureProductData(jsonData[3]), uniqueId: 'bar-1'},
                {...ensureProductData(jsonData[4]), uniqueId: 'drum-1'},
                {...ensureProductData(jsonData[5]), uniqueId: 'xd-1'},
                {...ensureProductData(jsonData[6]), uniqueId: 'zkr-1'}
              ];
              
              setProducts(productsList);
              
              // 存储到会话缓存中
              sessionStorage.setItem(cacheKey, JSON.stringify(productsList));
            } else {
              // 至少有一个请求失败，使用备份数据
              console.error('部分产品数据加载失败');
              setProducts(getBackupScreenProducts());
            }
          } catch (error: any) {
            // 如果是因为超时或取消导致的错误，不需要处理
            if (error.name !== 'AbortError') {
              console.error('Error loading products via parallel requests:', error);
              setProducts(getBackupScreenProducts());
            }
          }
        }
      } catch (error: any) {
        console.error('Error loading products:', error);
        // 加载失败时使用硬编码数据
        setProducts(getBackupScreenProducts());
      } finally {
        setLoading(false);
      }
    }
    
    // 预加载图片，加快渲染速度
    function preloadImages() {
      const imageUrls = [
        '/images/products/screens/ya-circular-vibrating-screen.png',
        '/images/products/screens/linear-vibrating-screen.png',
        '/images/products/screens/banana-vibrating-screen.png',
        '/images/products/screens/bar-vibrating-screen.png',
        '/images/products/screens/drum-screen.png',
        '/images/products/screens/xd-vibrating-screen.png',
        '/images/products/screens/zkr-linear-vibrating-screen.png'
      ];
      
      imageUrls.forEach(url => {
        const img = new (window.Image as any)();
        img.src = url;
      });
    }
    
    // 加载产品数据并预加载图片
    loadProductsData();
    preloadImages();
    
    // 组件卸载时清理
    return () => {
      // 如果有需要清理的资源，在这里处理
    };
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
          zh: '4.4-30 kW',
          en: '4.4-30 kW'
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