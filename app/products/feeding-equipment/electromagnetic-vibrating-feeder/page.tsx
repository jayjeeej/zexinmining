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

export default function ElectromagneticVibratingFeederPage() {
  const { isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/electromagnetic-vibrating-feeder.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['plate-feeder', 'belt-feeder', 'disc-feeder', 'xdg-vibrating-feeder'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'electromagnetic-vibrating-feeder',
            model: 'GZ5',
            series: {
              zh: '电磁振动给料机',
              en: 'Electromagnetic Vibrating Feeder'
            },
            capacity: {
              min: 5,
              max: 230, 
              unit: 't/h'
            },
            motorPower: {
              min: 0.15,
              max: 1.5,
              unit: 'kW'
            },
            overview: {
              zh: '电磁振动给料机是一种利用电磁振动原理工作的给料设备，主要用于将块状、粒状物料从贮料仓中均匀、定量、连续地送到受料装置中。该设备具有结构简单、造价低、使用维护方便等特点，广泛应用于冶金、煤炭、选矿、建材等行业。',
              en: 'The Electromagnetic Vibrating Feeder is a feeding device that works based on the principle of electromagnetic vibration, mainly used to uniformly, quantitatively, and continuously deliver blocky or granular materials from storage bins to receiving devices. This equipment features simple structure, low cost, easy use and maintenance, and is widely used in metallurgy, coal, mineral processing, building materials, and other industries.'
            },
            features: [
              {
                zh: '采用电磁振动器，振动平稳，噪音低',
                en: 'Equipped with electromagnetic vibrator, stable vibration, low noise'
              },
              {
                zh: '振动频率和强度可调，给料量精确可控',
                en: 'Adjustable vibration frequency and intensity, precisely controllable feeding amount'
              },
              {
                zh: '无机械传动部件，维护简单，使用寿命长',
                en: 'No mechanical transmission parts, simple maintenance, long service life'
              },
              {
                zh: '能耗低，运行成本低',
                en: 'Low energy consumption, low operating cost'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '⚒️',
                  title: { zh: '选矿行业', en: 'Mineral Processing' },
                  description: { zh: '用于给选矿工艺提供稳定的物料输送', en: 'Used to provide stable material conveying for mineral processing' }
                },
                {
                  icon: '🏭',
                  title: { zh: '冶金工业', en: 'Metallurgical Industry' },
                  description: { zh: '适用于冶金生产中的物料定量给料', en: 'Suitable for quantitative feeding of materials in metallurgical production' }
                },
                {
                  icon: '🧱',
                  title: { zh: '建材生产', en: 'Building Materials Production' },
                  description: { zh: '在水泥、玻璃等生产线中用于原料的均匀给料', en: 'Used for uniform feeding of raw materials in cement, glass and other production lines' }
                }
              ]
            },
            relatedProducts: ['plate-feeder', 'belt-feeder', 'disc-feeder', 'xdg-vibrating-feeder']
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
  const relatedProducts = getRelatedProducts(productData, 'electromagnetic-vibrating-feeder', productNameMap);
  
  // 获取型号 - 首先尝试从技术参数表中获取第一个型号
  const modelFromTechParams = productData.specifications && 
                              productData.specifications.data && 
                              productData.specifications.data.length > 0 ? 
                              productData.specifications.data[0].model : 'GZ5';
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 5, max: 230, unit: 't/h' };
  const motorPower = productData.motorPower || { min: 0.15, max: 1.5, unit: 'kW' };
  
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
          icon: '⚒️',
          title: { zh: '选矿行业', en: 'Mineral Processing' },
          description: { zh: '用于给选矿工艺提供稳定的物料输送', en: 'Used to provide stable material conveying for mineral processing' }
        },
        {
          icon: '🏭',
          title: { zh: '冶金工业', en: 'Metallurgical Industry' },
          description: { zh: '适用于冶金生产中的物料定量给料', en: 'Suitable for quantitative feeding of materials in metallurgical production' }
        },
        {
          icon: '🧱',
          title: { zh: '建材生产', en: 'Building Materials Production' },
          description: { zh: '在水泥、玻璃等生产线中用于原料的均匀给料', en: 'Used for uniform feeding of raw materials in cement, glass and other production lines' }
        }
      ]
    };
  }

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id || 'electromagnetic-vibrating-feeder',
    model: productData.model || modelFromTechParams,
    series: productData.series || {
      zh: productData.nameZh || '电磁振动给料机',
      en: productData.nameEn || 'Electromagnetic Vibrating Feeder'
    },
    imagePath: '/images/products/feeders/electromagnetic-vibrating-feeder.jpg',
    overview: productData.overview || {
      zh: productData.descriptionZh || '',
      en: productData.descriptionEn || ''
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
          label: { zh: "电磁振动给料机", en: "Electromagnetic Vibrating Feeder" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 