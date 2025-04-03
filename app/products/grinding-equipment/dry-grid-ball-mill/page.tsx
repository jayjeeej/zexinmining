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

export default function DryGridBallMillPage() {
  const { isZh } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取产品数据
    async function fetchProductData() {
      try {
        const response = await fetch('/data/products/dry-grid-ball-mill.json');
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('无法加载产品数据');
        }
      } catch (error) {
        console.error('获取产品数据出错:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, []);

  // 如果没有找到产品数据，返回备用数据
  const getBackupProduct = () => {
    return {
      id: "dry-grid-ball-mill",
      nameEn: "Dry Grid Ball Mill",
      nameZh: "干式格子型球磨机",
      model: "MQGg1212-MQGg2145",
      capacity: { min: 0.17, max: 45, unit: "t/h" },
      motorPower: { min: 22, max: 280, unit: "kW" },
      feedSize: { min: 20, max: 25, unit: "mm" },
      maxBallLoad: { min: 2.4, max: 25, unit: "t" },
      overview: {
        zh: "干式格子型球磨机是一种高效的研磨设备，广泛应用于选矿、建材、化工等行业。其特点是筒体内设有格子装置，使研磨的物料能够快速排出，提高生产效率和处理能力。干式作业方式特别适合需要干燥研磨的物料，无需添加水，可有效控制产品水分含量，广泛应用于水泥、化工、陶瓷等领域。",
        en: "The dry grid ball mill is an efficient grinding equipment widely used in mineral processing, building materials, chemical industry and other fields. Its feature is the grid device inside the cylinder, which allows the ground material to be discharged quickly, improving production efficiency and processing capacity. The dry operation method is particularly suitable for materials that require dry grinding, without the need for water, effectively controlling the moisture content of the product, widely used in cement, chemical, ceramic and other fields."
      },
      specifications: [
        { model: "MQGg1212", capacity: "0.17-4.1", motorPower: "22", cylinderDiameter: "1200", cylinderLength: "1200", maxBallLoad: "2.4", weight: "9610" },
        { model: "MQGg2145", capacity: "10-45", motorPower: "280", cylinderDiameter: "2100", cylinderLength: "4500", maxBallLoad: "25", weight: "52416" }
      ],
      features: [
        {
          zh: "格子型筒体结构，排矿速度快，研磨效率高",
          en: "Grid-type cylinder structure for fast discharge and high grinding efficiency"
        },
        {
          zh: "干式作业，无需用水，可控制产品水分含量",
          en: "Dry operation, no water required, can control product moisture content"
        },
        {
          zh: "衬板采用耐磨材料，使用寿命长",
          en: "Liners made of wear-resistant materials for long service life"
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
            description: { zh: "金属矿石如铜、铁、铅锌等矿物的干式研磨处理", en: "Dry grinding of metal ores such as copper, iron, lead, and zinc" }
          },
          {
            icon: "🧱",
            title: { zh: "水泥工业", en: "Cement Industry" },
            description: { zh: "水泥生产中的原料粉磨和水泥粉磨", en: "Raw material grinding and cement grinding in cement production" }
          },
          {
            icon: "🏭",
            title: { zh: "陶瓷生产", en: "Ceramic Production" },
            description: { zh: "陶瓷原料的干法粉碎和研磨", en: "Dry crushing and grinding of ceramic raw materials" }
          },
          {
            icon: "⚗️",
            title: { zh: "化工行业", en: "Chemical Industry" },
            description: { zh: "化工行业需要干燥研磨的物料处理", en: "Processing of materials in the chemical industry that require dry grinding" }
          }
        ]
      },
      relatedProducts: [
        "wet-grid-ball-mill",
        "overflow-ball-mill",
        "rod-mill",
        "vibrating-screen"
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
    const grindingMillProducts = ['wet-grid-ball-mill', 'overflow-ball-mill', 'rod-mill'];
    
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
      image: `/images/products/grinding/${id}.jpg`
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
      en: product.nameEn || product.series?.en || "Dry Grid Ball Mill",
      zh: product.nameZh || product.series?.zh || "干式格子型球磨机"
    },
    imagePath: '/images/products/grinding/dry-grid-ball-mill.jpg',
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
          label: { zh: "干式格子型球磨机", en: "Dry Grid Ball Mill" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 