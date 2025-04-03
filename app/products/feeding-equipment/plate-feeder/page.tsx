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

export default function PlateFeederPage() {
  const { isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/plate-feeder.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['belt-feeder', 'electromagnetic-vibrating-feeder', 'disc-feeder', 'xdg-vibrating-feeder'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'plate-feeder',
            model: 'GBH80-2.2',
            series: {
              zh: '板式给料机',
              en: 'Plate Feeder'
            },
            capacity: {
              min: 15,
              max: 217, 
              unit: 'm³/h'
            },
            motorPower: {
              min: 7.5,
              max: 7.5,
              unit: 'kW'
            },
            overview: {
              zh: '板式给料机是一种重型物料输送设备，主要由驱动装置、传动链轮、运行链板、机架等部分组成。该设备结构简单、运行可靠，适用于大块、高硬度、磨蚀性强的物料输送，特别适合在恶劣环境下长时间连续工作。',
              en: 'The Plate Feeder is a heavy-duty material conveying equipment, mainly composed of driving device, transmission sprocket, running chain plate, and frame. With simple structure and reliable operation, it is suitable for conveying large, high-hardness, and abrasive materials, particularly appropriate for continuous operation in harsh environments.'
            },
            features: [
              {
                zh: '采用高强度钢板制作，耐磨性强，使用寿命长',
                en: 'Made of high-strength steel plate with strong wear resistance and long service life'
              },
              {
                zh: '链板结构设计合理，运行稳定，噪音低',
                en: 'Reasonably designed chain plate structure, stable operation, low noise'
              },
              {
                zh: '给料量大，能有效防止大块物料堵塞',
                en: 'Large feeding capacity, effectively preventing blockage of large materials'
              },
              {
                zh: '驱动装置采用减速电机，传动效率高',
                en: 'Drive unit uses geared motor with high transmission efficiency'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '⛏️',
                  title: { zh: '矿山开采', en: 'Mining' },
                  description: { zh: '用于矿山原矿、大块矿石的均匀给料', en: 'Used for uniform feeding of raw ore and large ore in mines' }
                },
                {
                  icon: '🏗️',
                  title: { zh: '建材行业', en: 'Building Materials' },
                  description: { zh: '适用于水泥、石灰等建材生产线的物料输送', en: 'Suitable for material conveying in cement, lime and other building material production lines' }
                },
                {
                  icon: '🔥',
                  title: { zh: '冶金工业', en: 'Metallurgical Industry' },
                  description: { zh: '应用于钢铁、有色金属冶炼过程中的物料输送', en: 'Applied in material conveying during steel and non-ferrous metal smelting processes' }
                }
              ]
            },
            relatedProducts: ['belt-feeder', 'electromagnetic-vibrating-feeder', 'disc-feeder', 'xdg-vibrating-feeder']
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
  const relatedProducts = getRelatedProducts(productData, 'plate-feeder', productNameMap);
  
  // 获取型号 - 首先尝试从技术参数表中获取第一个型号
  const modelFromTechParams = productData.specifications && 
                              productData.specifications.data && 
                              productData.specifications.data.length > 0 ? 
                              productData.specifications.data[0].model : 'GBH80-2.2';
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 15, max: 217, unit: 'm³/h' };
  const motorPower = productData.motorPower || { min: 7.5, max: 7.5, unit: 'kW' };
  
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
          icon: '⛏️',
          title: { zh: '矿山开采', en: 'Mining' },
          description: { zh: '用于矿山原矿、大块矿石的均匀给料', en: 'Used for uniform feeding of raw ore and large ore in mines' }
        },
        {
          icon: '🏗️',
          title: { zh: '建材行业', en: 'Building Materials' },
          description: { zh: '适用于水泥、石灰等建材生产线的物料输送', en: 'Suitable for material conveying in cement, lime and other building material production lines' }
        },
        {
          icon: '🔥',
          title: { zh: '冶金工业', en: 'Metallurgical Industry' },
          description: { zh: '应用于钢铁、有色金属冶炼过程中的物料输送', en: 'Applied in material conveying during steel and non-ferrous metal smelting processes' }
        }
      ]
    };
  }

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id || 'plate-feeder',
    model: productData.model || modelFromTechParams,
    series: productData.series || {
      zh: productData.nameZh || '板式给料机',
      en: productData.nameEn || 'Plate Feeder'
    },
    imagePath: '/images/products/feeders/plate-feeder.jpg',
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
          label: { zh: "板式给料机", en: "Plate Feeder" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 