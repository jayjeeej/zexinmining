'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import {
  normalizeFeatures,
  normalizeSpecifications,
  getRelatedProducts,
  productNameMap
} from '@/app/utils/productUtils';

export default function DiscFeederPage() {
  const { isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/disc-feeder.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['plate-feeder', 'belt-feeder', 'electromagnetic-vibrating-feeder', 'xdg-vibrating-feeder'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'disc-feeder',
            model: 'DK2500',
            series: {
              zh: '圆盘给料机',
              en: 'Disc Feeder'
            },
            capacity: {
              min: 13.6,
              max: 198.9, 
              unit: 't/h'
            },
            motorPower: {
              min: 5.5,
              max: 11,
              unit: 'kW'
            },
            overview: {
              zh: '粉粒物料连续定量供给设备，处理能力13.6-198.9 t/h。采用变频调速圆盘结构，确保物料精确计量输送。圆盘直径2000-3000mm，适用于化工、建材、食品等行业干燥粉状物料。',
              en: 'Continuous quantitative powder material feeding equipment with 13.6-198.9 t/h capacity. Features frequency-controlled adjustable disc structure for precise material metering. Disc diameter 2000-3000mm, suitable for dry powders in chemical, building materials, and food industries.'
            },
            features: [
              {
                zh: '变频调速，给料量精确可控',
                en: 'Variable frequency speed regulation, precisely controllable feeding amount'
              },
              {
                zh: '结构简单，维护成本低',
                en: 'Simple structure, low maintenance cost'
              },
              {
                zh: '圆盘直径2000-3000mm，适合各种工况',
                en: 'Disc diameter 2000-3000mm, suitable for various working conditions'
              },
              {
                zh: '连续定量给料，生产稳定',
                en: 'Continuous quantitative feeding, stable production'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '🏭',
                  title: { zh: '化工行业', en: 'Chemical Industry' },
                  description: { zh: '适用于化工生产中的粉粒物料定量给料', en: 'Suitable for quantitative feeding of powder materials in chemical production' }
                },
                {
                  icon: '🧱',
                  title: { zh: '建材行业', en: 'Building Materials Industry' },
                  description: { zh: '在水泥、玻璃等生产线中用于原料的均匀给料', en: 'Used for uniform feeding of raw materials in cement, glass and other production lines' }
                },
                {
                  icon: '🍞',
                  title: { zh: '食品加工', en: 'Food Processing' },
                  description: { zh: '用于食品加工中的粉状原料输送', en: 'Used for powder raw material conveying in food processing' }
                }
              ]
            },
            relatedProducts: ['plate-feeder', 'belt-feeder', 'electromagnetic-vibrating-feeder', 'xdg-vibrating-feeder']
          });
        }
      } catch (error) {
        console.error('Error loading product data:', error);
        setProductData(null);
      } finally {
        setLoading(false);
      }
    }
    
    loadProductData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!productData) {
    console.error('Product data is null after loading completed');
    return <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600">数据加载错误</h2>
      <p className="mt-2">无法加载产品数据，请稍后再试。</p>
    </div>;
  }

  // 使用工具函数标准化规格数据
  const specifications = normalizeSpecifications(productData.technicalParameters || productData.specifications);

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'disc-feeder', productNameMap);
  
  // 获取型号 - 首先尝试从技术参数表中获取第一个型号
  const modelFromTechParams = productData.specifications && 
                            productData.specifications.data && 
                            productData.specifications.data.length > 0 ? 
                            productData.specifications.data[0].model : 
                            (productData.technicalParameters && 
                             productData.technicalParameters.length > 0 ? 
                             productData.technicalParameters[0].model : 'DK2500');
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 13.6, max: 198.9, unit: 't/h' };
  const motorPower = productData.motorPower || { min: 5.5, max: 11, unit: 'kW' };
  
  // 确保应用领域数据完整
  let applications;
  
  if (productData.applications) {
    // 检查是否为数组格式
    if (Array.isArray(productData.applications)) {
      applications = {
        title: { zh: "应用领域", en: "Application Areas" },
        items: productData.applications.map((app: any) => ({
          icon: app.icon || '',
          title: app.title || { zh: '', en: '' },
          description: app.description || { zh: '', en: '' }
        }))
      };
    } 
    // 检查是否为包含zh和en数组的新格式
    else if (Array.isArray(productData.applications.zh)) {
      applications = {
        title: productData.applications.title || { zh: "应用领域", en: "Application Areas" },
        items: productData.applications.zh.map((app: string, index: number) => ({
          icon: '',
          title: { 
            zh: app.split('：')[0] || app, 
            en: productData.applications.en[index].split(':')[0] || productData.applications.en[index] 
          },
          description: { 
            zh: app.split('：')[1] || '', 
            en: productData.applications.en[index].split(':')[1] || '' 
          }
        }))
      };
    }
    // 已经是标准格式（包含title和items）
    else if (productData.applications.items) {
      applications = productData.applications;
    }
  }
  
  // 如果没有有效的应用领域数据，使用默认值
  if (!applications) {
    applications = {
      title: { zh: "应用领域", en: "Application Areas" },
      items: [
        {
          icon: '🏭',
          title: { zh: '化工行业', en: 'Chemical Industry' },
          description: { zh: '适用于化工生产中的粉粒物料定量给料', en: 'Suitable for quantitative feeding of powder materials in chemical production' }
        },
        {
          icon: '🧱',
          title: { zh: '建材行业', en: 'Building Materials Industry' },
          description: { zh: '在水泥、玻璃等生产线中用于原料的均匀给料', en: 'Used for uniform feeding of raw materials in cement, glass and other production lines' }
        },
        {
          icon: '🍞',
          title: { zh: '食品加工', en: 'Food Processing' },
          description: { zh: '用于食品加工中的粉状原料输送', en: 'Used for powder raw material conveying in food processing' }
        }
      ]
    };
  }

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id || 'disc-feeder',
    model: productData.model || modelFromTechParams,
    series: productData.series || {
      zh: productData.nameZh || '圆盘给料机',
      en: productData.nameEn || 'Disc Feeder'
    },
    imagePath: '/images/products/feeders/disc-feeder.png',
    overview: productData.overview || {
      zh: productData.descriptionZh || '粉粒物料连续定量供给设备，处理能力13.6-198.9 t/h。采用变频调速圆盘结构，确保物料精确计量输送。圆盘直径2000-3000mm，适用于化工、建材、食品等行业干燥粉状物料。',
      en: productData.descriptionEn || 'Continuous quantitative powder material feeding equipment with 13.6-198.9 t/h capacity. Features frequency-controlled adjustable disc structure for precise material metering. Disc diameter 2000-3000mm, suitable for dry powders in chemical, building materials, and food industries.'
    },
    capacity: capacity,
    motorPower: motorPower,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    breadcrumb: {
      items: [
        {
          label: { zh: "产品中心", en: "Products" },
          href: "/products"
        },
        {
          label: { zh: "给料设备", en: "Feeding Equipment" },
          href: "/products/feeding-equipment"
        },
        {
          label: { zh: "圆盘给料机", en: "Disc Feeder" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 