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

export default function OverflowBallMillPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/overflow-ball-mill.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['rod-mill', 'cone-crusher', 'vibrating-screen', 'spiral-classifier'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: "overflow-ball-mill",
            model: "Φ900×1800-Φ1830×4500",
            series: {
              zh: "溢流式球磨机",
              en: "Overflow Ball Mill"
            },
            capacity: {
              min: 0.65,
              max: 12,
              unit: "t/h"
            },
            motorPower: {
              min: 18.5,
              max: 155,
              unit: "kW"
            },
            feedSize: {
              min: 20,
              max: 25,
              unit: "mm"
            },
            dischargeSize: {
              min: 0.074,
              max: 0.89,
              unit: "mm"
            },
            isGrindingProduct: true,
            overview: {
              zh: "溢流式球磨机是一种高效磨矿设备，适用于各种矿石和其他可磨性物料的细磨。它采用溢流排矿方式，能够获得更细的粒度产品，广泛应用于选矿、建材和化工等行业的湿式研磨作业中。该设备具有研磨效率高、处理量大、能耗低等特点。",
              en: "The overflow ball mill is a high-efficiency grinding equipment suitable for fine grinding of various ores and other grindable materials. It adopts overflow discharge method to obtain finer particle size products, widely used in wet grinding operations in mineral processing, building materials, chemical industry and other fields. The equipment features high grinding efficiency, large processing capacity and low energy consumption."
            },
            features: [
              {
                zh: "采用溢流排矿方式，能有效获得较细的产品粒度",
                en: "Uses overflow discharge method to effectively obtain finer product particle size"
              },
              {
                zh: "内衬板可根据不同物料特性定制，提高研磨效率",
                en: "Liner plates can be customized according to different material characteristics to improve grinding efficiency"
              },
              {
                zh: "大型轴承设计，运行平稳可靠，使用寿命长",
                en: "Large bearing design ensures stable and reliable operation with long service life"
              },
              {
                zh: "调整研磨体装载量，可灵活控制产品粒度",
                en: "Adjustable grinding media loading for flexible control of product particle size"
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
                  title: { zh: "选矿工业", en: "Mineral Processing" },
                  description: { zh: "用于金属矿石和非金属矿石的细磨，提高后续选别回收率。", en: "Used for fine grinding of metallic and non-metallic ores to improve recovery in subsequent separation processes." }
                },
                {
                  icon: "🏗️",
                  title: { zh: "建材工业", en: "Building Materials" },
                  description: { zh: "水泥、陶瓷等建材原料的粉磨，获得符合粒度要求的产品。", en: "Grinding of cement, ceramic and other building material raw materials to obtain products meeting particle size requirements." }
                },
                {
                  icon: "🧪",
                  title: { zh: "化工行业", en: "Chemical Industry" },
                  description: { zh: "化工原料的细磨处理，提高后续化学反应效率。", en: "Fine grinding of chemical raw materials to improve efficiency of subsequent chemical reactions." }
                },
                {
                  icon: "🔋",
                  title: { zh: "新能源材料", en: "New Energy Materials" },
                  description: { zh: "锂电池材料等新能源材料的研磨加工。", en: "Grinding and processing of new energy materials such as lithium battery materials." }
                }
              ]
            },
            relatedProducts: ["rod-mill", "cone-crusher", "vibrating-screen", "spiral-classifier"]
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
  const relatedProducts = (() => {
    // 只显示同类型的磨机产品
    const grindingMillProducts = ['wet-grid-ball-mill', 'dry-grid-ball-mill', 'rod-mill'];
    
    // 过滤掉当前正在查看的产品
    const filteredProducts = grindingMillProducts.filter(id => id !== 'overflow-ball-mill');
    
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
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 0.65, max: 12, unit: 't/h' };
  const feedSize = productData.feedSize || { min: 20, max: 25, unit: 'mm' };
  const motorPower = productData.motorPower || { min: 18.5, max: 155, unit: 'kW' };
  const dischargeSize = productData.dischargeSize || { min: 0.074, max: 0.89, unit: 'mm' };
  
  // 确保应用领域数据完整
  const applications = {
    title: productData.applications?.title || { zh: "应用领域", en: "Application Areas" },
    items: productData.applications?.items || [
      {
        icon: '⛏️',
        title: { zh: "选矿工业", en: "Mineral Processing" },
        description: { zh: "用于金属矿石和非金属矿石的细磨，提高后续选别回收率。", en: "Used for fine grinding of metallic and non-metallic ores to improve recovery in subsequent separation processes." }
      },
      {
        icon: '🏗️',
        title: { zh: "建材工业", en: "Building Materials" },
        description: { zh: "水泥、陶瓷等建材原料的粉磨，获得符合粒度要求的产品。", en: "Grinding of cement, ceramic and other building material raw materials to obtain products meeting particle size requirements." }
      },
      {
        icon: '🧪',
        title: { zh: "化工行业", en: "Chemical Industry" },
        description: { zh: "化工原料的细磨处理，提高后续化学反应效率。", en: "Fine grinding of chemical raw materials to improve efficiency of subsequent chemical reactions." }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: '/images/products/grinding/overflow-ball-mill.jpg',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    feedSize: feedSize,
    dischargeSize: dischargeSize,
    extraParameters: {
      // 不再包含dischargeSize
    },
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    breadcrumb: {
      items: [
        {
          label: { zh: "产品中心", en: "Products" },
          href: `/products`
        },
        {
          label: { zh: "磨矿设备", en: "Grinding Equipment" },
          href: `/products/grinding-equipment`
        },
        {
          label: { zh: "溢流式球磨机", en: "Overflow Ball Mill" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 