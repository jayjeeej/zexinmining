'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { normalizeSpecifications, normalizeFeatures, getRelatedProducts, productNameMap } from '@/app/utils/productUtils';

export default function WetGridBallMillPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const response = await fetch('/data/products/wet-grid-ball-mill.json');
        if (!response.ok) {
          throw new Error('Failed to load product data');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error loading product data:', error);
        // 加载失败时使用备用数据
        setProduct(getBackupProductData());
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [language]);

  // 备用产品数据
  const getBackupProductData = () => {
    return {
      id: "wet-grid-ball-mill",
      nameEn: "Wet Grid Ball Mill",
      nameZh: "湿式格子型球磨机",
      model: "MQYg1212-MQYg2145",
      capacity: { min: 0.17, max: 45, unit: "t/h" },
      motorPower: { min: 22, max: 280, unit: "kW" },
      feedSize: { min: 20, max: 25, unit: "mm" },
      dischargeSize: { min: 0.074, max: 0.4, unit: "mm" },
      maxBallLoad: { min: 2.4, max: 23.6, unit: "t" },
      overview: {
        zh: "湿式格子型球磨机是一种高效的研磨设备，广泛应用于选矿、建材、化工等行业。其特点是筒体内设有格子装置，使研磨的物料能够快速排出，提高生产效率和处理能力。",
        en: "The wet grid ball mill is an efficient grinding equipment widely used in mineral processing, building materials, chemical industry and other fields. Its feature is the grid device inside the cylinder, which allows the ground material to be discharged quickly, improving production efficiency and processing capacity."
      },
      specifications: [
        { model: "MQYg1212", capacity: "0.17-0.62", motorPower: "22", cylinderDiameter: "1200", cylinderLength: "1200", maxBallLoad: "2.4", weight: "12.8" },
        { model: "MQYg1530", capacity: "1.1-4.0", motorPower: "55", cylinderDiameter: "1500", cylinderLength: "3000", maxBallLoad: "8.6", weight: "21.5" },
        { model: "MQYg1830", capacity: "1.6-5.8", motorPower: "75", cylinderDiameter: "1800", cylinderLength: "3000", maxBallLoad: "12.2", weight: "31.8" },
        { model: "MQYg2145", capacity: "12-45", motorPower: "280", cylinderDiameter: "2100", cylinderLength: "4500", maxBallLoad: "23.6", weight: "56.1" }
      ],
      features: [
        {
          zh: "格子型筒体结构，排矿速度快，研磨效率高",
          en: "Grid-type cylinder structure for fast discharge and high grinding efficiency"
        },
        {
          zh: "传动装置平稳可靠，运行噪音低",
          en: "Stable and reliable transmission system with low operating noise"
        },
        {
          zh: "衬板采用耐磨材料，使用寿命长",
          en: "Liners made of wear-resistant materials for long service life"
        },
        {
          zh: "进出料系统设计合理，操作方便",
          en: "Reasonably designed feeding and discharging system for easy operation"
        },
        {
          zh: "可根据物料特性定制工艺参数",
          en: "Process parameters can be customized according to material characteristics"
        }
      ],
      applications: {
        title: {
          zh: "应用领域",
          en: "Application Areas"
        },
        items: [
          {
            icon: "⛏️",
            title: { zh: "金属矿处理", en: "Metal Ore Processing" },
            description: { zh: "金属矿石如铜、铁、铅锌等矿物的研磨处理", en: "Grinding of metal ores such as copper, iron, lead, and zinc" }
          },
          {
            icon: "🪨",
            title: { zh: "非金属矿处理", en: "Non-metallic Mineral Processing" },
            description: { zh: "非金属矿物如萤石、石英、长石等的研磨", en: "Grinding of non-metallic minerals such as fluorite, quartz, and feldspar" }
          },
          {
            icon: "🧱",
            title: { zh: "建材行业", en: "Building Materials Industry" },
            description: { zh: "建材行业的原料研磨", en: "Raw material grinding in the building materials industry" }
          },
          {
            icon: "⚗️",
            title: { zh: "化工行业", en: "Chemical Industry" },
            description: { zh: "化工行业的物料研磨", en: "Material grinding in the chemical industry" }
          }
        ]
      },
      relatedProducts: [
        "overflow-ball-mill",
        "rod-mill",
        "vibrating-screen",
        "spiral-classifier"
      ]
    };
  };

  // 如果数据正在加载，显示加载状态
  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // 如果没有数据，显示错误信息
  if (!product) {
    return <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600">{isZh ? '数据加载错误' : 'Data Loading Error'}</h2>
      <p className="mt-2">{isZh ? '无法加载产品数据，请稍后再试。' : 'Failed to load product data. Please try again later.'}</p>
    </div>;
  }

  // 处理规格数据格式化
  const normalizedSpecs = normalizeSpecifications(product.specifications);
  // 处理特性数据格式化
  const normalizedFeatures = normalizeFeatures(product.features);
  
  // 处理相关产品数据
  const relatedProductsData = (() => {
    // 只显示同类型的磨机产品
    const grindingMillProducts = ['overflow-ball-mill', 'dry-grid-ball-mill', 'rod-mill'];
    
    // 过滤掉当前正在查看的产品
    const filteredProducts = grindingMillProducts.filter(id => id !== product.id);
    
    // 创建相关产品数据结构
    const relatedItems = filteredProducts.map(id => ({
      id,
      series: productNameMap[id] || { 
        zh: id.includes('ball') ? '球磨机' : 
            id === 'rod-mill' ? '棒磨机' : '磨机',
        en: id.includes('ball') ? 'Ball Mill' : 
            id === 'rod-mill' ? 'Rod Mill' : 'Mill'
      },
      image: `/images/products/grinding/${id}.png`
    }));
    
    return {
      title: {
        zh: "相关产品",
        en: "Related Products"
      },
      basePath: `/products/grinding-equipment`,
      items: relatedItems,
      visibleCards: relatedItems.length >= 3 ? 3 : relatedItems.length
    };
  })();

  // 准备产品属性
  const productProps = {
    productId: product.id,
    model: product.model,
    series: {
      en: product.nameEn || product.series?.en || "Wet Grid Ball Mill",
      zh: product.nameZh || product.series?.zh || "湿式格子型球磨机"
    },
    imagePath: '/images/products/grinding/wet-grid-ball-mill.png',
    capacity: product.capacity,
    motorPower: product.motorPower,
    feedSize: product.feedSize,
    maxBallLoad: product.maxBallLoad,
    overview: product.overview,
    specifications: normalizedSpecs,
    features: normalizedFeatures,
    applications: product.applications,
    relatedProducts: relatedProductsData,
    // 额外参数
    extraParameters: {},
    // 导航路径
    breadcrumb: {
      items: [
        {
          label: { zh: "产品与服务", en: "Products & Services" },
          href: "/products"
        },
        {
          label: { zh: "研磨设备", en: "Grinding Equipment" },
          href: "/products/grinding-equipment"
        },
        {
          label: { zh: "湿式格子型球磨机", en: "Wet Grid Ball Mill" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 