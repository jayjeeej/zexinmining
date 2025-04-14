'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import PageSection from '@/app/components/PageSection';
import ProductCard from '@/app/components/products/ProductCard';
import Link from 'next/link';
import ProductStructuredData from '@/app/components/ProductStructuredData';

// 产品数据接口
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
  magneticIntensity?: {
    zh: string;
    en: string;
  };
  magneticFieldStrength?: {
    zh: string;
    en: string;
  };
  motorPower?: {
    zh: string;
    en: string;
  };
  voltage?: {
    zh: string;
    en: string;
  };
  image?: string;
  isMagneticSeparatorProduct?: boolean;
}

// 磁选设备产品列表页面
export default function MagneticSeparationPage() {
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
    // 预加载图片，加快渲染速度
    function preloadImages() {
      const productImages = [
        '/images/products/magnetic-separation/permanent-magnetic-drum-separator.png',
        '/images/products/magnetic-separation/double-roller-permanent-magnetic-zircon-separator.png',
        '/images/products/magnetic-separation/four-roller-variable-frequency-electrostatic-separator.png',
        '/images/products/magnetic-separation/plate-type-high-intensity-wet-magnetic-separator.png',
        '/images/products/magnetic-separation/roller-type-high-intensity-wet-magnetic-separator.png',
        '/images/products/magnetic-separation/three-disc-belt-magnetic-separator.png',
      ];

      productImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }

    // 使用 AbortController 来管理请求
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadProductsData() {
      try {
        setLoading(true);
        
        // 缓存键，基于语言设置
        const cacheKey = `magnetic-separation-products-${language}`;
        
        // 检查会话缓存中是否有数据
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          setProducts(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
        
        // 从预编译JSON文件获取产品数据
        const jsonFile = language === 'en' 
          ? '/data/products/compiled/magnetic-separation-en.json'
          : '/data/products/compiled/magnetic-separation-zh.json';
          
        const apiResponse = await fetch(jsonFile, {
          signal,
          cache: 'force-cache',
          next: { revalidate: 3600 } // 1小时后重新验证数据
        });
        
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          // 处理产品数据
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            // 存储到会话缓存中
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          } else {
            // 如果没有数据或数据格式不正确，使用备用数据
            setProducts(getBackupMagneticSeparatorProducts());
          }
        } else {
          // 如果请求失败，使用备用数据
          console.error('API请求失败，使用备用数据');
          setProducts(getBackupMagneticSeparatorProducts());
        }
      } catch (error) {
        console.error("Error loading magnetic separation equipment data:", error);
        // 出错时使用备用数据
        setProducts(getBackupMagneticSeparatorProducts());
      } finally {
        setLoading(false);
      }
    }
    
    // 磁选设备备份数据
    const getBackupMagneticSeparatorProducts = (): ProductData[] => {
      return [
        {
          id: "permanent-magnetic-drum-separator",
          model: "CTB",
          series: {
            zh: "永磁筒式磁选机",
            en: "Permanent Magnetic Drum Separator"
          },
          image: "/images/products/magnetic-separation/permanent-magnetic-drum-separator.png",
          capacity: {
            zh: "10-280 t/h",
            en: "10-280 t/h"
          },
          motorPower: {
            zh: "1.5-11 kW",
            en: "1.5-11 kW"
          },
          isMagneticSeparatorProduct: true
        },
        {
          id: "double-roller-permanent-magnetic-zircon-separator",
          model: "CTS",
          series: {
            zh: "双辊永磁锆英磁选机",
            en: "Double Roller Permanent Magnetic Zircon Separator"
          },
          image: "/images/products/magnetic-separation/double-roller-permanent-magnetic-zircon-separator.png",
          capacity: {
            zh: "2-8 t/h",
            en: "2-8 t/h"
          },
          motorPower: {
            zh: "3 kW",
            en: "3 kW"
          },
          magneticFieldStrength: {
            zh: "10000-14000 Gs",
            en: "10000-14000 Gs"
          },
          isMagneticSeparatorProduct: true
        },
        {
          id: "four-roller-variable-frequency-electrostatic-separator",
          model: "DXJ",
          series: {
            zh: "四辊变频高压静电选机",
            en: "Four-Roller Variable Frequency High-Voltage Electrostatic Separator"
          },
          image: "/images/products/magnetic-separation/four-roller-variable-frequency-electrostatic-separator.png",
          capacity: {
            zh: "5-8 t/h",
            en: "5-8 t/h"
          },
          motorPower: {
            zh: "1.1 kW",
            en: "1.1 kW"
          },
          voltage: {
            zh: "0-80 kV",
            en: "0-80 kV"
          },
          isMagneticSeparatorProduct: true
        },
        {
          id: "plate-type-high-intensity-wet-magnetic-separator",
          model: "HYQC",
          series: {
            zh: "平板式高强磁湿选磁选机",
            en: "Plate-type High-intensity Wet Magnetic Separator"
          },
          image: "/images/products/magnetic-separation/plate-type-high-intensity-wet-magnetic-separator.png",
          capacity: {
            zh: "4-40 t/h",
            en: "4-40 t/h"
          },
          motorPower: {
            zh: "1.1-5.5 kW",
            en: "1.1-5.5 kW"
          },
          isMagneticSeparatorProduct: true
        },
        {
          id: "roller-type-high-intensity-wet-magnetic-separator",
          model: "CXJ",
          series: {
            zh: "辊式高强度湿式磁选机",
            en: "Roller-type High Intensity Wet Magnetic Separator"
          },
          image: "/images/products/magnetic-separation/roller-type-high-intensity-wet-magnetic-separator.png",
          capacity: {
            zh: "0.5-13 t/h",
            en: "0.5-13 t/h"
          },
          motorPower: {
            zh: "1.1-1.5 kW",
            en: "1.1-1.5 kW"
          },
          magneticFieldStrength: {
            zh: "11000-13500 Gs",
            en: "11000-13500 Gs"
          },
          isMagneticSeparatorProduct: true
        },
        {
          id: "three-disc-belt-magnetic-separator",
          model: "CP3",
          series: {
            zh: "三盘带式磁选机",
            en: "Three-Disc Belt Magnetic Separator"
          },
          image: "/images/products/magnetic-separation/three-disc-belt-magnetic-separator.png",
          capacity: {
            zh: "80-800 kg/h",
            en: "80-800 kg/h"
          },
          motorPower: {
            zh: "0.75-1.5 kW",
            en: "0.75-1.5 kW"
          },
          magneticFieldStrength: {
            zh: "1700-2000 mt",
            en: "1700-2000 mt"
          },
          isMagneticSeparatorProduct: true
        }
      ];
    }
    
    // 开始预加载图片
    preloadImages();
    
    // 加载产品数据
    loadProductsData();
    
    // 组件卸载时取消所有正在进行的请求
    return () => {
      controller.abort();
    };
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 添加结构化数据 - 对页面布局没有视觉影响 */}
      <ProductStructuredData
        name={isZh ? "磁选设备" : "Magnetic Separation Equipment"}
        description={isZh 
          ? "各种磁选设备，包括永磁筒式磁选机、高强度湿式磁选机和静电选机等。我们的磁选设备具有高选别精度、高处理能力和低能耗优势。" 
          : "Various magnetic separation equipment, including permanent magnetic drum separators, high-intensity wet magnetic separators, and electrostatic separators. Our magnetic separation equipment offers high separation precision, large processing capacity, and low energy consumption advantages."}
        image="/images/products/magnetic-separation/category-overview.png"
        category={isZh ? "磁选设备" : "Magnetic Separation Equipment"}
        url="/products/magnetic-separation"
      />
      
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
              label: { zh: "磁选设备", en: "Magnetic Separation Equipment" }
            }
          ]
        }}
      >
        <div className="relative h-[300px] py-16 mt-0 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center mt-4 mb-4">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "磁选设备" : "Magnetic Separation Equipment"}
                </h1>
              </div>
              
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left content-right">
                  <p>
                    {isZh
                      ? "磁选是利用矿物磁性差异进行分选的工艺，我们提供全系列磁选设备，包括永磁筒式磁选机、高强度湿式磁选机和静电选机等。我们的磁选设备应用于铁矿、锰矿、钛铁矿、钨锡矿等多种矿物的选别，具有高选别精度、高处理能力和低能耗的优势。"
                      : "Magnetic separation is a process that separates minerals based on magnetic differences. We provide a full range of magnetic separation equipment, including permanent magnetic drum separators, high-intensity wet magnetic separators, and electrostatic separators. Our magnetic separation equipment is applied to the selection of various minerals such as iron, manganese, ilmenite, tungsten and tin ores, featuring high separation precision, large processing capacity, and low energy consumption."}
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
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  basePath={`/products/magnetic-separation`} 
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