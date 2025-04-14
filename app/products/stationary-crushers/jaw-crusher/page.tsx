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

export default function JawCrusherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/jaw-crusher.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['cone-crusher', 'impact-crusher', 'hammer-crusher', 'double-roller-crusher', 'heavy-duty-double-roller-crusher'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'jaw-crusher',
            model: 'PE600×900',
            series: {
              zh: '颚式破碎机',
              en: 'Jaw Crusher'
            },
            capacity: {
              min: 1,
              max: 300,
              unit: 't/h'
            },
            maxFeedSize: {
              min: 80,
              max: 750,
              unit: 'mm'
            },
            motorPower: {
              min: 5.5,
              max: 110,
              unit: 'kW'
            },
            overview: {
              zh: '颚式破碎机是一种高效率的初级破碎设备，主要用于矿山、冶金、建材、公路、铁路、水利和化工等行业的物料破碎。该设备破碎比大，产品粒度均匀，结构简单，工作可靠，维修方便，运营费用低。',
              en: 'The Jaw Crusher is a high-efficiency primary crushing device mainly used for material crushing in mining, metallurgy, building materials, road, railway, water conservancy, and chemical industries. This equipment has a large crushing ratio, uniform product size, simple structure, reliable operation, easy maintenance, and low operating costs.'
            },
            features: [
              {
                zh: '采用高强度铸钢材料，抗冲击性能强',
                en: 'Made of high-strength cast steel material with strong impact resistance'
              },
              {
                zh: '深腔破碎，处理能力大',
                en: 'Deep cavity crushing design, large processing capacity'
              },
              {
                zh: '易损件材质优良，使用寿命长',
                en: 'Excellent material for wear parts, long service life'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '🏗️',
                  title: { zh: '建筑材料', en: 'Construction Materials' },
                  description: { zh: '广泛应用于建筑石料的初级破碎。', en: 'Widely used for primary crushing of construction aggregates.' }
                },
                {
                  icon: '⛏️',
                  title: { zh: '采矿业', en: 'Mining Industry' },
                  description: { zh: '适用于各类矿石的粗碎和中碎作业。', en: 'Suitable for coarse and medium crushing of various ores.' }
                },
                {
                  icon: '🚧',
                  title: { zh: '公路建设', en: 'Highway Construction' },
                  description: { zh: '用于道路基础材料的制备和加工。', en: 'Used for preparation and processing of road base materials.' }
                },
                {
                  icon: '♻️',
                  title: { zh: '废料回收', en: 'Waste Recycling' },
                  description: { zh: '可用于建筑废料和混凝土废料的破碎和回收。', en: 'Can be used for crushing and recycling of construction waste and concrete waste.' }
                }
              ]
            },
            relatedProducts: ['cone-crusher', 'impact-crusher', 'hammer-crusher', 'double-roller-crusher', 'heavy-duty-double-roller-crusher']
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
  const specifications = normalizeSpecifications(productData.specifications);

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'jaw-crusher', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 1, max: 300, unit: 't/h' };
  const maxFeedSize = productData.maxFeedSize || { min: 80, max: 750, unit: 'mm' };
  const motorPower = productData.motorPower || { min: 5.5, max: 110, unit: 'kW' };
  
  // 确保应用领域数据完整
  const applications = {
    title: productData.applications?.title || { zh: "应用领域", en: "Application Areas" },
    items: productData.applications?.items || [
      {
        icon: '🏗️',
        title: { zh: "建筑材料", en: "Construction Materials" },
        description: { zh: "广泛应用于建筑石料的初级破碎。", en: "Widely used for primary crushing of construction aggregates." }
      },
      {
        icon: '⛏️',
        title: { zh: "采矿业", en: "Mining Industry" },
        description: { zh: "适用于各类矿石的粗碎和中碎作业。", en: "Suitable for coarse and medium crushing of various ores." }
      },
      {
        icon: '🚧',
        title: { zh: "公路建设", en: "Highway Construction" },
        description: { zh: "用于道路基础材料的制备和加工。", en: "Used for preparation and processing of road base materials." }
      },
      {
        icon: '♻️',
        title: { zh: "废料回收", en: "Waste Recycling" },
        description: { zh: "可用于建筑废料和混凝土废料的破碎和回收。", en: "Can be used for crushing and recycling of construction waste and concrete waste." }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: '/images/products/crushers/jaw-crusher.png',
    overview: productData.overview,
    capacity: capacity,
    maxFeedSize: maxFeedSize,
    motorPower: motorPower,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    extraParameters: { productType: 'crusher' },
    breadcrumb: {
      items: [
        {
          label: { zh: "产品中心", en: "Products" },
          href: `/products`
        },
        {
          label: { zh: "固定式破碎机", en: "Stationary crushers" },
          href: `/products/stationary-crushers`
        },
        {
          label: { zh: "颚式破碎机", en: "Jaw Crusher" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 