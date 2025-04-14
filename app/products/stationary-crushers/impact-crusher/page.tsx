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

export default function ImpactCrusherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/impact-crusher.json');
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['jaw-crusher', 'cone-crusher', 'hammer-crusher', 'double-roller-crusher'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'impact-crusher',
            model: 'PF-1210',
            series: {
              zh: '冲击式破碎机',
              en: 'Impact Crusher'
            },
            capacity: {
              min: 30,
              max: 330,
              unit: 't/h'
            },
            feedSize: {
              min: 100,
              max: 500,
              unit: 'mm'
            },
            motorPower: {
              min: 37,
              max: 250,
              unit: 'kW'
            },
            overview: {
              zh: '冲击式破碎机是一种利用冲击能破碎物料的设备，适用于各种软、中硬和特硬的物料破碎，如花岗岩、石灰石等，广泛应用于矿山、冶金、建材、公路、铁路等行业的破碎工艺。',
              en: 'The Impact Crusher is a machine that uses impact energy to crush materials, suitable for crushing various soft, medium-hard and extra-hard materials such as granite, limestone, etc. It is widely used in crushing processes in mining, metallurgy, building materials, highways, railways and other industries.'
            },
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '🏗️',
                  title: { zh: '建筑材料', en: 'Construction Materials' },
                  description: { zh: '生产高质量的建筑骨料，特别是高速公路、铁路等基建领域。', en: 'Production of high-quality construction aggregates, especially for infrastructure such as highways and railways.' }
                },
                {
                  icon: '⛏️',
                  title: { zh: '矿石破碎', en: 'Ore Crushing' },
                  description: { zh: '矿山开采中的中碎和细碎作业，提高矿石品位。', en: 'Medium and fine crushing operations in mining, improving ore grade.' }
                },
                {
                  icon: '🏭',
                  title: { zh: '工业加工', en: 'Industrial Processing' },
                  description: { zh: '各种工业原料的破碎处理，如水泥、玻璃等原料制备。', en: 'Crushing processing of various industrial raw materials, such as cement, glass, etc.' }
                },
                {
                  icon: '♻️',
                  title: { zh: '资源回收', en: 'Resource Recovery' },
                  description: { zh: '建筑废料、矿渣等废弃物的回收再利用处理。', en: 'Recycling and reuse of construction waste, slag and other waste materials.' }
                }
              ]
            },
            relatedProducts: ['jaw-crusher', 'cone-crusher', 'hammer-crusher', 'double-roller-crusher']
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

  // 使用工具函数标准化规格数据，但更好地处理tableHeaders和tableData格式
  let specifications = normalizeSpecifications(productData.specifications) || { 
    title: { zh: "技术参数", en: "Specifications" },
    columns: [],
    data: []
  };
  
  // 专门处理tableHeaders和tableData格式，转换为columns和data格式
  if (productData.specifications?.tableHeaders && productData.specifications?.tableData) {
    // 检查specifications是否已经包含所需数据
    const hasValidColumns = specifications.columns && Array.isArray(specifications.columns) && specifications.columns.length > 0;
    const hasValidData = specifications.data && Array.isArray(specifications.data) && specifications.data.length > 0;
    
    // 只有在没有有效数据时才进行转换
    if (!hasValidColumns || !hasValidData) {
      // 创建列定义
      const columns = productData.specifications.tableHeaders.map((header: any, index: number) => ({
        key: `column${index}`,
        title: {
          zh: header.zh,
          en: header.en
        },
        unit: header.unit || null,
        width: index === 0 ? "15%" : "auto" // 第一列通常是型号，给予固定宽度
      }));
      
      // 创建数据行
      const data = productData.specifications.tableData.map((row: any, rowIndex: number) => {
        const rowData: { [key: string]: any } = { key: `row${rowIndex}` };
        row.forEach((cell: any, cellIndex: number) => {
          rowData[`column${cellIndex}`] = cell;
        });
        return rowData;
      });
      
      // 创建完整的specifications对象
      specifications = {
        title: productData.specifications.title || { zh: "技术参数", en: "Specifications" },
        columns: columns,
        data: data,
        notes: productData.specifications.note ? 
          (typeof productData.specifications.note === 'object' ? 
            [{ content: productData.specifications.note }] : 
            [{ content: { zh: productData.specifications.note, en: productData.specifications.note } }]) : 
          []
      };
    }
  }

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'impact-crusher', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 30, max: 330, unit: 't/h' };
  const maxFeedSize = productData.feedSize || { min: 100, max: 500, unit: 'mm' };
  const motorPower = productData.motorPower || { min: 37, max: 250, unit: 'kW' };
  
  // 确保应用领域数据完整
  const applications = {
    title: productData.applications?.title || { zh: "应用领域", en: "Application Areas" },
    items: productData.applications?.items || [
      {
        icon: '🏗️',
        title: { zh: "建筑材料", en: "Construction Materials" },
        description: { zh: "生产高质量的建筑骨料，特别是高速公路、铁路等基建领域。", en: "Production of high-quality construction aggregates, especially for infrastructure such as highways and railways." }
      },
      {
        icon: '⛏️',
        title: { zh: "矿石破碎", en: "Ore Crushing" },
        description: { zh: "矿山开采中的中碎和细碎作业，提高矿石品位。", en: "Medium and fine crushing operations in mining, improving ore grade." }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: '/images/products/crushers/impact-crusher.png',
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
          label: { zh: "冲击式破碎机", en: "Impact Crusher" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 