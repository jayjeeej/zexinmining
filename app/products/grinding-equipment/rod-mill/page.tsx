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

export default function RodMillPage() {
  const { isZh } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取产品数据
    async function fetchProductData() {
      try {
        const response = await fetch('/data/products/rod-mill.json');
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
      id: "rod-mill",
      nameEn: "Rod Mill",
      nameZh: "棒磨机",
      model: "MBS0918-MBS3245",
      capacity: { min: 0.62, max: 180, unit: "t/h" },
      motorPower: { min: 18.5, max: 800, unit: "kW" },
      feedSize: { min: 25, max: 50, unit: "mm" },
      dischargeSize: { min: 0.833, max: 0.147, unit: "mm" },
      overview: {
        zh: "棒磨机是一种高效的棒状介质研磨设备，广泛应用于选矿流程的粗磨和中磨阶段。棒磨机采用钢棒作为研磨介质，能够提供优良的研磨效果和粒度分布，尤其适合处理粒度要求较均匀的物料。",
        en: "Rod mill is a high-efficiency grinding equipment using rod-shaped media, widely used in the coarse and medium grinding stages of mineral processing. With steel rods as grinding media, rod mills provide excellent grinding effects and particle size distribution, particularly suitable for materials requiring uniform particle size."
      },
      specifications: [
        { model: "MBS0918", cylinderDiameter: "900", cylinderLength: "1800", rotationSpeed: "36-38", feedSize: "≤25", dischargeSize: "0.833-0.147", capacity: "0.62-3.2", motorPower: "18.5", weight: "4600" },
        { model: "MBS3245", cylinderDiameter: "3200", cylinderLength: "4500", rotationSpeed: "18", feedSize: "≤50", dischargeSize: "0.833-0.147", capacity: "64-180", motorPower: "800", weight: "137000" }
      ],
      features: [
        {
          zh: "产品粒度分布均匀，过粉碎现象少",
          en: "Uniform particle size distribution with minimal over-grinding"
        },
        {
          zh: "适用于粗磨和中磨作业，可有效处理粒度较大的给料",
          en: "Suitable for coarse and medium grinding operations, effectively processing larger feed sizes"
        },
        {
          zh: "钢棒因自重作用产生较大压力，研磨效率高",
          en: "Steel rods generate greater pressure due to their weight, resulting in high grinding efficiency"
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
            title: { zh: "黑色金属矿选矿", en: "Ferrous Metal Ore Processing" },
            description: { zh: "铁矿石、锰矿石等黑色金属矿石的粗磨和中磨作业", en: "Coarse and medium grinding of ferrous metal ores such as iron ore and manganese ore" }
          },
          {
            icon: "🪙",
            title: { zh: "有色金属矿选矿", en: "Non-ferrous Metal Ore Processing" },
            description: { zh: "铜矿、铅锌矿、铝矾土等有色金属矿石的均匀研磨", en: "Uniform grinding of non-ferrous metal ores such as copper, lead-zinc, and bauxite" }
          },
          {
            icon: "🧱",
            title: { zh: "建材工业", en: "Building Materials Industry" },
            description: { zh: "水泥生产中的原料粉磨和熟料粉磨", en: "Raw material grinding and clinker grinding in cement production" }
          },
          {
            icon: "⚗️",
            title: { zh: "化工行业", en: "Chemical Industry" },
            description: { zh: "化工原料的均匀粉磨，比表面积控制精确", en: "Uniform grinding of chemical raw materials with precise control of specific surface area" }
          }
        ]
      },
      relatedProducts: [
        "wet-grid-ball-mill",
        "dry-grid-ball-mill",
        "overflow-ball-mill",
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
  
  // 创建表头列定义
  if (normalizedSpecs && normalizedSpecs.columns) {
    normalizedSpecs.columns = normalizedSpecs.columns.map((column: any) => {
      const titleMap: Record<string, {zh: string, en: string}> = {
        'model': {zh: '型号', en: 'Model'},
        'cylinderDiameter': {zh: '筒体直径', en: 'Cylinder Diameter'},
        'cylinderLength': {zh: '筒体长度', en: 'Cylinder Length'},
        'rotationSpeed': {zh: '转速', en: 'Rotation Speed'},
        'feedSize': {zh: '进料粒度', en: 'Feed Size'},
        'dischargeSize': {zh: '排料粒度', en: 'Discharge Size'},
        'capacity': {zh: '处理能力', en: 'Capacity'},
        'motorPower': {zh: '电机功率', en: 'Motor Power'},
        'weight': {zh: '重量', en: 'Weight'}
      };
      
      const unitMap: Record<string, string> = {
        'cylinderDiameter': 'mm',
        'cylinderLength': 'mm',
        'rotationSpeed': 'r/min',
        'feedSize': 'mm',
        'dischargeSize': 'mm',
        'capacity': 't/h',
        'motorPower': 'kW',
        'weight': 'kg'
      };
      
      return {
        ...column,
        title: titleMap[column.key] || {zh: column.key, en: column.key},
        unit: unitMap[column.key] || ''
      };
    });
  }
  
  // 处理特性数据格式化
  const normalizedFeatures = normalizeFeatures(product.features);

  // 处理相关产品数据
  const relatedProductsData = (() => {
    // 只显示同类型的磨机产品，不显示振动筛等其他设备
    const grindingMillProducts = ['wet-grid-ball-mill', 'dry-grid-ball-mill', 'overflow-ball-mill'];
    
    // 过滤掉当前正在查看的产品
    const filteredProducts = grindingMillProducts.filter(id => id !== product.id);
    
    // 创建相关产品数据结构
    const relatedItems = filteredProducts.map(id => ({
      id,
      series: productNameMap[id] || { 
        zh: id.includes('ball') ? '球磨机' : '磨机',
        en: id.includes('ball') ? 'Ball Mill' : 'Mill'
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
      en: product.nameEn || product.series?.en || "Rod Mill",
      zh: product.nameZh || product.series?.zh || "棒磨机"
    },
    imagePath: '/images/products/grinding/rod-mill.jpg',
    capacity: product.capacity,
    motorPower: product.motorPower,
    feedSize: product.feedSize,
    dischargeSize: product.dischargeSize,
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
          label: { zh: "棒磨机", en: "Rod Mill" }
        }
      ]
    }
  };

  return <ProductDetailTemplate {...productProps} />;
} 