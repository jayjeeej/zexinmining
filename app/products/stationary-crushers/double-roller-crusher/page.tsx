'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import {
  normalizeFeatures,
  normalizeSpecifications,
  getRelatedProducts,
  productNameMap,
  extractRangeFromTable
} from '@/app/utils/productUtils';

export default function DoubleRollerCrusherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/double-roller-crusher.json');
        if (response.ok) {
          const data = await response.json();
          
          // 创建增强数据对象
          const enhancedData = {
            ...data
          };

          // 确保data中有relatedProducts数据
          if (!enhancedData.relatedProducts || !Array.isArray(enhancedData.relatedProducts) || enhancedData.relatedProducts.length === 0) {
            enhancedData.relatedProducts = ['jaw-crusher', 'cone-crusher', 'impact-crusher', 'hammer-crusher', 'heavy-duty-double-roller-crusher'];
          }

          // 安全地访问表格数据
          const hasValidTableData = data.specifications && 
                                   Array.isArray(data.specifications.tableData) && 
                                   data.specifications.tableData.length > 2 &&
                                   Array.isArray(data.specifications.tableData[2]) &&
                                   data.specifications.tableData[2].length > 5;
          
          if (hasValidTableData) {
            // 增强产品概述，基于技术参数
            enhancedData.overview = {
              zh: `双辊破碎机采用两个旋转辊面对物料进行辗压破碎，辊径${data.specifications.tableData[2][1]}mm，最大进料${data.specifications.tableData[2][3]}mm，产能${data.specifications.tableData[2][5]}t/h。产品结构紧凑、运行稳定、噪音低，适用于中硬度以下物料的中细碎作业，广泛应用于冶金、矿山、化工等行业。`,
              en: `Double Roller Crusher uses two rotating rollers to crush materials, with roller diameter ${data.specifications.tableData[2][1]}mm, max feed ${data.specifications.tableData[2][3]}mm, and capacity ${data.specifications.tableData[2][5]}t/h. Features compact structure, stable operation and low noise, suitable for medium and fine crushing of materials below medium hardness, widely used in metallurgy, mining and chemical industries.`
            };
            
            // 确保产品特点更专业，结合技术参数
            if (enhancedData.features) {
              enhancedData.features.zh = [
                `${data.specifications.tableData[2][1]}mm大型辊面，表面耐磨合金处理`,
                `${data.specifications.tableData[2][4]}kW高效电机驱动，节能环保`,
                `液压弹簧保护系统，防止过载损坏`,
                `排料口可调，产品粒度可控`,
                `密封防尘设计，维护简便`
              ];
              
              enhancedData.features.en = [
                `${data.specifications.tableData[2][1]}mm large roller surface with wear-resistant alloy treatment`,
                `${data.specifications.tableData[2][4]}kW high-efficiency motor drive, energy-saving and environmentally friendly`,
                `Hydraulic spring protection system preventing overload damage`,
                `Adjustable discharge opening for controllable product size`,
                `Sealed dust-proof design for easy maintenance`
              ];
            }
            
            // 增强应用领域描述，结合产品特性
            if (enhancedData.applications && enhancedData.applications.items) {
              enhancedData.applications.items[0].description = {
                zh: `处理中硬度以下矿石，进料粒度${data.specifications.tableData[2][3]}mm，产能${data.specifications.tableData[2][5]}t/h，提供均匀粒度产品。`,
                en: `Processing ores below medium hardness with feed size ${data.specifications.tableData[2][3]}mm and capacity ${data.specifications.tableData[2][5]}t/h, providing uniform size products.`
              };
              
              enhancedData.applications.items[1].description = {
                zh: `破碎冶金原料，${data.specifications.tableData[2][1]}mm辊径确保高效破碎，满足后续冶炼需求。`,
                en: `Crushing metallurgical materials with ${data.specifications.tableData[2][1]}mm roller diameter ensuring efficient crushing to meet subsequent smelting requirements.`
              };
              
              if (enhancedData.applications.items[2]) {
                enhancedData.applications.items[2].description = {
                  zh: `处理化工原料，低噪音环保设计，产品粒度均匀，满足精细加工需求。`,
                  en: `Processing chemical materials with low-noise eco-friendly design, providing uniform product size to meet fine processing requirements.`
                };
              }
              
              if (enhancedData.applications.items[3]) {
                enhancedData.applications.items[3].description = {
                  zh: `破碎建筑材料，提供符合标准的骨料产品，满足建筑工程需要。`,
                  en: `Crushing construction materials to provide standard aggregate products meeting construction engineering needs.`
                };
              }
            }
          }
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'double-roller-crusher',
            model: '2PG-1000×800',
            series: {
              zh: '双辊破碎机',
              en: 'Double Roller Crusher'
            },
            capacity: {
              min: 15,
              max: 280,
              unit: 't/h'
            },
            feedSize: {
              min: 80,
              max: 300,
              unit: 'mm'
            },
            motorPower: {
              min: 11,
              max: 160,
              unit: 'kW'
            },
            overview: {
              zh: '双辊破碎机采用两个旋转辊面对物料进行辗压破碎，结构紧凑、运行稳定、噪音低，适用于中硬度以下物料的中细碎作业，广泛应用于冶金、矿山、化工等行业。',
              en: 'Double Roller Crusher uses two rotating rollers to crush materials through compression, featuring compact structure, stable operation and low noise. Suitable for medium and fine crushing of materials below medium hardness, widely used in metallurgy, mining and chemical industries.'
            },
            specifications: {
              title: {
                zh: '双辊破碎机技术参数',
                en: 'Double Roller Crusher Specifications'
              },
              note: {
                zh: '可按照客户需求进行定制',
                en: 'Can be customized according to customer requirements'
              },
              tableHeaders: [
                {
                  zh: '型号',
                  en: 'Model'
                },
                {
                  zh: '辊径×辊长',
                  en: 'Roller Diameter×Length',
                  unit: 'mm'
                },
                {
                  zh: '排料口调整范围',
                  en: 'Discharge Opening Range',
                  unit: 'mm'
                },
                {
                  zh: '最大进料粒度',
                  en: 'Maximum Feed Size',
                  unit: 'mm'
                },
                {
                  zh: '电机功率',
                  en: 'Motor Power',
                  unit: 'kW'
                },
                {
                  zh: '生产能力',
                  en: 'Production Capacity',
                  unit: 't/h'
                }
              ],
              tableData: [
                ['2PG-610×400', 'Φ610×400', '10-30', '80', '11', '15-40'],
                ['2PG-750×500', 'Φ750×500', '15-40', '130', '22', '25-60'],
                ['2PG-1000×800', 'Φ1000×800', '20-50', '200', '55', '40-120'],
                ['2PG-1200×900', 'Φ1200×900', '25-60', '240', '90', '60-180'],
                ['2PG-1500×1000', 'Φ1500×1000', '30-80', '300', '160', '90-280']
              ]
            },
            features: {
              zh: [
                '双辊面设计，物料辗压破碎效果好',
                '辊面采用耐磨合金材料，使用寿命长',
                '液压弹簧保护系统，防止过载损坏',
                '排料口可调，产品粒度可控',
                '密封防尘设计，维护简便'
              ],
              en: [
                'Double roller design providing excellent material compression crushing effect',
                'Rollers made of wear-resistant alloy material with long service life',
                'Hydraulic spring protection system preventing overload damage',
                'Adjustable discharge opening for controllable product size',
                'Sealed dust-proof design for easy maintenance'
              ]
            },
            relatedProducts: ['jaw-crusher', 'cone-crusher', 'impact-crusher', 'hammer-crusher', 'heavy-duty-double-roller-crusher']
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading product data:', error);
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

  // 从规格参数表中提取范围值
  let extractedCapacity, extractedFeedSize, extractedMotorPower;
  
  if (productData.specifications?.tableData && Array.isArray(productData.specifications.tableData)) {
    // 查找生产能力/产能列索引
    const capacityIndex = productData.specifications.tableHeaders?.findIndex(
      (h: { zh: string; en: string }) => h.zh.includes('生产能力') || h.zh.includes('产能') || h.en.includes('Capacity') || h.en.includes('Production')
    ) ?? 5; // 默认为第6列 (索引5)
    
    // 查找进料尺寸列索引
    const feedSizeIndex = productData.specifications.tableHeaders?.findIndex(
      (h: { zh: string; en: string }) => h.zh.includes('进料') || h.en.includes('Feed')
    ) ?? 3; // 默认为第4列 (索引3)
    
    // 查找电机功率列索引
    const motorPowerIndex = productData.specifications.tableHeaders?.findIndex(
      (h: { zh: string; en: string }) => h.zh.includes('电机') || h.zh.includes('功率') || h.en.includes('Motor') || h.en.includes('Power')
    ) ?? 4; // 默认为第5列 (索引4)
    
    // 提取范围值
    extractedCapacity = extractRangeFromTable(
      productData.specifications.tableData, 
      capacityIndex,
      5, 600, 't/h'
    );
    
    extractedFeedSize = extractRangeFromTable(
      productData.specifications.tableData, 
      feedSizeIndex,
      25, 120, 'mm'
    );
    
    extractedMotorPower = extractRangeFromTable(
      productData.specifications.tableData, 
      motorPowerIndex,
      11, 630, 'kW'
    );
  }

  // 使用工具函数标准化规格数据
  const specifications = normalizeSpecifications(productData.specifications);

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'double-roller-crusher', productNameMap);
  
  // 准备首屏参数范围数据 (优先使用JSON中的值，其次使用表格提取值，最后使用默认值)
  const capacity = productData.capacity || extractedCapacity || { min: 15, max: 280, unit: 't/h' };
  const maxFeedSize = productData.feedSize || extractedFeedSize || { min: 80, max: 300, unit: 'mm' };
  const motorPower = productData.motorPower || extractedMotorPower || { min: 11, max: 160, unit: 'kW' };
  
  // 确保应用领域数据完整
  const applications = productData.applications ? {
    title: productData.applications.title || { zh: "应用领域", en: "Application Areas" },
    items: productData.applications.items?.map((item: any) => ({
      icon: item.icon || '🏭',
      title: item.title || { zh: "工业应用", en: "Industrial Application" },
      description: item.description || { zh: "适用于各类工业场景", en: "Suitable for various industrial scenarios" }
    })) || []
  } : {
    title: { zh: "应用领域", en: "Application Areas" },
    items: [
      {
        icon: '🏗️',
        title: { zh: "建筑材料", en: "Construction Materials" },
        description: { zh: "适用于各类建筑骨料的中细碎作业。", en: "Suitable for medium and fine crushing of various construction aggregates." }
      },
      {
        icon: '⛏️',
        title: { zh: "矿石处理", en: "Ore Processing" },
        description: { zh: "用于矿山行业的中硬矿石的细碎加工。", en: "Used for fine crushing of medium-hard ores in the mining industry." }
      },
      {
        icon: '🧱',
        title: { zh: "砖瓦制造", en: "Brick Making" },
        description: { zh: "在陶瓷和砖瓦生产中用于原料的破碎处理。", en: "For crushing raw materials in ceramic and brick production." }
      },
      {
        icon: '♻️',
        title: { zh: "资源回收", en: "Resource Recovery" },
        description: { zh: "用于固体废弃物的回收处理和再利用。", en: "For recycling and reusing solid waste materials." }
      }
    ]
  };
  
  // 准备面包屑导航
  const breadcrumbs = [
    { label: { zh: '首页', en: 'Home' }, href: '/' },
    { label: { zh: '产品与服务', en: 'Products & Services' }, href: '/products' },
    { label: { zh: '固定式破碎机', en: 'Stationary Crushers' }, href: '/products/stationary-crushers' },
    { label: { zh: '双辊破碎机', en: 'Double Roller Crusher' }, href: '/products/stationary-crushers/double-roller-crusher' }
  ];

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: '/images/products/crushers/double-roller-crusher.png',
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
      items: breadcrumbs
    }
  };

  return (
    <ProductDetailTemplate
      {...productProps}
    />
  );
} 