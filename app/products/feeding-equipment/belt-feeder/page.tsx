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

export default function BeltFeederPage() {
  const { isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/belt-feeder.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['plate-feeder', 'disc-feeder', 'electromagnetic-vibrating-feeder', 'xdg-vibrating-feeder'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'belt-feeder',
            model: '500×1000',
            series: {
              zh: '皮带给料机',
              en: 'Belt Feeder'
            },
            capacity: {
              min: 10,
              max: 350, 
              unit: 't/h'
            },
            motorPower: {
              min: 0.75,
              max: 3,
              unit: 'kW'
            },
            overview: {
              zh: '皮带给料机是一种连续输送设备，用于将散状物料均匀、连续地给入生产流程。该设备采用无级变速调节，给料量精确可控。皮带宽度为500-1800mm，适用于矿山、冶金、化工等行业的物料输送。',
              en: 'The Belt Feeder is a continuous conveying equipment used to feed bulk materials uniformly and continuously into the production process. This equipment adopts infinitely variable speed regulation, and the feeding amount is precisely controllable. The belt width is 500-1800mm, suitable for material conveying in mining, metallurgy, chemical and other industries.'
            },
            features: [
              {
                zh: '无级变速，给料量可精确控制',
                en: 'Infinitely variable speed regulation, feeding amount can be precisely controlled'
              },
              {
                zh: '结构简单，维护方便',
                en: 'Simple structure, easy maintenance'
              },
              {
                zh: '运行平稳，噪音低',
                en: 'Stable operation, low noise'
              },
              {
                zh: '适应性强，可处理多种物料',
                en: 'Strong adaptability, can handle various materials'
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
                  title: { zh: '矿山行业', en: 'Mining Industry' },
                  description: { zh: '用于矿石、煤炭等物料的均匀给料', en: 'Used for uniform feeding of ore, coal and other materials' }
                },
                {
                  icon: '🏭',
                  title: { zh: '冶金工业', en: 'Metallurgical Industry' },
                  description: { zh: '适用于冶金生产中的物料定量给料', en: 'Suitable for quantitative feeding of materials in metallurgical production' }
                },
                {
                  icon: '🧪',
                  title: { zh: '化工行业', en: 'Chemical Industry' },
                  description: { zh: '在化工生产线中用于原料的均匀给料', en: 'Used for uniform feeding of raw materials in chemical production lines' }
                }
              ]
            },
            technicalParameters: [
              {
                "model": "500×1000",
                "beltWidth": "500",
                "capacity": "20-40",
                "motorPower": "0.75"
              },
              {
                "model": "650×1200",
                "beltWidth": "650",
                "capacity": "60-100",
                "motorPower": "1.5"
              },
              {
                "model": "800×1500",
                "beltWidth": "800",
                "capacity": "130-190",
                "motorPower": "2.2"
              },
              {
                "model": "1000×1800",
                "beltWidth": "1000",
                "capacity": "220-300",
                "motorPower": "3"
              }
            ],
            relatedProducts: ['plate-feeder', 'disc-feeder', 'electromagnetic-vibrating-feeder', 'xdg-vibrating-feeder']
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
  const relatedProducts = getRelatedProducts(productData, 'belt-feeder', productNameMap);
  
  // 获取型号 - 首先尝试从技术参数表中获取第一个型号
  const modelFromTechParams = productData.technicalParameters && 
                             productData.technicalParameters.length > 0 ? 
                             productData.technicalParameters[0].model : 
                             (productData.specifications && productData.specifications.data && productData.specifications.data.length > 0 ? 
                              productData.specifications.data[0].model : '500×1000');
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 10, max: 350, unit: 't/h' };
  const motorPower = productData.motorPower || { min: 0.75, max: 3, unit: 'kW' };
  
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
          title: { zh: '矿山行业', en: 'Mining Industry' },
          description: { zh: '用于矿石、煤炭等物料的均匀给料', en: 'Used for uniform feeding of ore, coal and other materials' }
        },
        {
          icon: '🏭',
          title: { zh: '冶金工业', en: 'Metallurgical Industry' },
          description: { zh: '适用于冶金生产中的物料定量给料', en: 'Suitable for quantitative feeding of materials in metallurgical production' }
        },
        {
          icon: '🧪',
          title: { zh: '化工行业', en: 'Chemical Industry' },
          description: { zh: '在化工生产线中用于原料的均匀给料', en: 'Used for uniform feeding of raw materials in chemical production lines' }
        }
      ]
    };
  }

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id || 'belt-feeder',
    model: productData.model || modelFromTechParams,
    series: productData.series || {
      zh: productData.nameZh || '皮带给料机',
      en: productData.nameEn || 'Belt Feeder'
    },
    imagePath: '/images/products/feeders/belt-feeder.png',
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
          label: { zh: "皮带给料机", en: "Belt Feeder" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 