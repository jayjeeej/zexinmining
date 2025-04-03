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

export default function XDGVibratingFeederPage() {
  const { isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/xdg-vibrating-feeder.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['plate-feeder', 'belt-feeder', 'disc-feeder', 'electromagnetic-vibrating-feeder'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'xdg-vibrating-feeder',
            model: 'ZSW-600×130',
            series: {
              zh: 'XDG振动给料机',
              en: 'XDG Vibrating Feeder'
            },
            capacity: {
              min: 120,
              max: 800, 
              unit: 't/h'
            },
            motorPower: {
              min: 15,
              max: 30,
              unit: 'kW'
            },
            overview: {
              zh: 'XDG振动给料机是一种高效重型给料设备，主要用于给破碎机均匀、连续地喂料。该设备采用偏心轴强制振动，给料量大，振动频率可调。适用于矿山、冶金、建材等行业需要稳定输送大块硬质物料的场合。',
              en: 'The XDG Vibrating Feeder is a high-efficiency heavy-duty feeding equipment, mainly used to feed crushers uniformly and continuously. This equipment adopts eccentric shaft forced vibration, with large feeding capacity and adjustable vibration frequency. It is suitable for occasions where stable transportation of large hard materials is required in industries such as mining, metallurgy, and building materials.'
            },
            features: [
              {
                zh: '采用强制振动方式，启动能力强，给料量大',
                en: 'Adopts forced vibration method, strong starting capability, large feeding capacity'
              },
              {
                zh: '机体采用高强度钢板焊接，坚固耐用',
                en: 'The body is welded with high-strength steel plate, sturdy and durable'
              },
              {
                zh: '振动频率可调，给料量精确可控',
                en: 'Adjustable vibration frequency, precisely controllable feeding amount'
              },
              {
                zh: '适用于给料粒度大、硬度高的物料',
                en: 'Suitable for feeding materials with large particle size and high hardness'
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
                  description: { zh: '用于矿石破碎前的均匀给料', en: 'Used for uniform feeding before ore crushing' }
                },
                {
                  icon: '🧱',
                  title: { zh: '建筑材料', en: 'Building Materials' },
                  description: { zh: '在水泥、石灰石等生产线中用于原料给料', en: 'Used for raw material feeding in cement, limestone and other production lines' }
                },
                {
                  icon: '🏭',
                  title: { zh: '冶金工业', en: 'Metallurgical Industry' },
                  description: { zh: '应用于冶金生产中的大块物料输送', en: 'Applied in the transportation of large materials in metallurgical production' }
                }
              ]
            },
            relatedProducts: ['plate-feeder', 'belt-feeder', 'disc-feeder', 'electromagnetic-vibrating-feeder']
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
  const relatedProducts = getRelatedProducts(productData, 'xdg-vibrating-feeder', productNameMap);
  
  // 获取型号 - 首先尝试从技术参数表中获取第一个型号
  const modelFromTechParams = productData.specifications && 
                             productData.specifications.data && 
                             productData.specifications.data.length > 0 ? 
                             productData.specifications.data[0].model : 
                             (productData.technicalParameters && 
                             productData.technicalParameters.length > 0 ? 
                             productData.technicalParameters[0].model : 'ZSW-600×130');
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 120, max: 800, unit: 't/h' };
  const motorPower = productData.motorPower || { min: 15, max: 30, unit: 'kW' };
  
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
          description: { zh: '用于矿石破碎前的均匀给料', en: 'Used for uniform feeding before ore crushing' }
        },
        {
          icon: '🧱',
          title: { zh: '建筑材料', en: 'Building Materials' },
          description: { zh: '在水泥、石灰石等生产线中用于原料给料', en: 'Used for raw material feeding in cement, limestone and other production lines' }
        },
        {
          icon: '🏭',
          title: { zh: '冶金工业', en: 'Metallurgical Industry' },
          description: { zh: '应用于冶金生产中的大块物料输送', en: 'Applied in the transportation of large materials in metallurgical production' }
        }
      ]
    };
  }

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id || 'xdg-vibrating-feeder',
    model: productData.model || modelFromTechParams,
    series: productData.series || {
      zh: productData.nameZh || 'XDG振动给料机',
      en: productData.nameEn || 'XDG Vibrating Feeder'
    },
    imagePath: '/images/products/feeders/xdg-vibrating-feeder.jpg',
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
          label: { zh: "XDG振动给料机", en: "XDG Vibrating Feeder" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 