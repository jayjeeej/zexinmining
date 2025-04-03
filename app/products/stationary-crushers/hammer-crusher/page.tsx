'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';

export default function HammerCrusherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/hammer-crusher.json');
        if (response.ok) {
          const data = await response.json();
          
          // 创建增强数据对象
          const enhancedData = {
            ...data
          };

          // 安全地访问表格数据
          const hasValidTableData = data.specifications && 
                                   Array.isArray(data.specifications.tableData) && 
                                   data.specifications.tableData.length > 2 &&
                                   Array.isArray(data.specifications.tableData[2]) &&
                                   data.specifications.tableData[2].length > 5;
          
          if (hasValidTableData) {
            // 增强产品概述，基于技术参数
            enhancedData.overview = {
              zh: `锤式破碎机专为中细碎作业设计，采用高速旋转锤头破碎技术。最大进料${data.specifications.tableData[2][3]}mm，产能${data.specifications.tableData[2][5]}t/h，转子直径${data.specifications.tableData[2][1]}mm。适用于破碎中硬度以下脆性物料，广泛应用于矿山、水泥、建材等行业。`,
              en: `Hammer Crusher designed for medium and fine crushing with high-speed rotating hammer technology. Max feed ${data.specifications.tableData[2][3]}mm, capacity ${data.specifications.tableData[2][5]}t/h, rotor diameter ${data.specifications.tableData[2][1]}mm. Suitable for crushing brittle materials below medium hardness, widely used in mining, cement, and construction industries.`
            };
            
            // 确保产品特点更专业，结合技术参数
            if (enhancedData.features) {
              enhancedData.features.zh = [
                `${data.specifications.tableData[2][1]}mm转子直径，配备高耐磨锤头`,
                `${data.specifications.tableData[2][4]}kW高效电机驱动系统`,
                `可更换耐磨衬板，延长使用寿命`,
                `筛板设计可调，产品粒度易于控制`,
                `密封防尘装置，减少粉尘污染`
              ];
              
              enhancedData.features.en = [
                `${data.specifications.tableData[2][1]}mm rotor diameter with high wear-resistant hammers`,
                `${data.specifications.tableData[2][4]}kW high-efficiency motor driving system`,
                `Replaceable wear-resistant liners extending service life`,
                `Adjustable screen design for easy product size control`,
                `Sealed dust-proof device reducing dust pollution`
              ];
            }
            
            // 增强应用领域描述，结合产品特性
            if (enhancedData.applications && enhancedData.applications.items) {
              enhancedData.applications.items[0].description = {
                zh: `中细碎各类矿石，进料粒度${data.specifications.tableData[2][3]}mm，产能${data.specifications.tableData[2][5]}t/h，提供均匀产品。`,
                en: `Medium and fine crushing of various ores with feed size ${data.specifications.tableData[2][3]}mm and capacity ${data.specifications.tableData[2][5]}t/h, providing uniform products.`
              };
              
              enhancedData.applications.items[1].description = {
                zh: `生产建筑骨料，${data.specifications.tableData[2][1]}mm转子确保高效破碎，满足建材生产需求。`,
                en: `Production of construction aggregates with ${data.specifications.tableData[2][1]}mm rotor ensuring efficient crushing to meet construction material needs.`
              };
              
              if (enhancedData.applications.items[2]) {
                enhancedData.applications.items[2].description = {
                  zh: `破碎水泥生产原料，提高生产效率，优化产品质量。`,
                  en: `Crushing cement production raw materials, improving production efficiency and optimizing product quality.`
                };
              }
              
              if (enhancedData.applications.items[3]) {
                enhancedData.applications.items[3].description = {
                  zh: `处理煤炭等能源材料，提供均匀粒度产品，满足后续加工需求。`,
                  en: `Processing coal and other energy materials, providing uniform size products to meet subsequent processing requirements.`
                };
              }
            }
          }
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'hammer-crusher',
            model: 'PC-1010',
            series: {
              zh: '锤式破碎机',
              en: 'Hammer Crusher'
            },
            capacity: {
              min: 10,
              max: 300,
              unit: 't/h'
            },
            feedSize: {
              min: 100,
              max: 400,
              unit: 'mm'
            },
            motorPower: {
              min: 37,
              max: 250,
              unit: 'kW'
            },
            overview: {
              zh: '锤式破碎机利用高速旋转的锤头对物料进行打击、剪切和研磨破碎，适用于中硬度以下脆性物料的中细碎作业。具有结构简单、破碎比大、能耗低等特点。',
              en: 'Hammer Crusher uses high-speed rotating hammers to strike, shear and grind materials, suitable for medium and fine crushing of brittle materials below medium hardness. Features simple structure, high crushing ratio and low energy consumption.'
            },
            specifications: {
              title: {
                zh: '锤式破碎机技术参数',
                en: 'Hammer Crusher Specifications'
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
                  zh: '转子直径×长度',
                  en: 'Rotor Diameter×Length',
                  unit: 'mm'
                },
                {
                  zh: '给料口尺寸',
                  en: 'Feed Opening Size',
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
                ['PC-400×600', 'Φ400×600', '400×600', '250', '37', '10-35'],
                ['PC-600×800', 'Φ600×800', '600×800', '300', '75', '25-60'],
                ['PC-1010', 'Φ1000×1000', '1000×1050', '350', '132', '50-120'],
                ['PC-1210', 'Φ1200×1000', '1200×1050', '400', '185', '80-220'],
                ['PC-1410', 'Φ1400×1000', '1400×1050', '450', '250', '120-300']
              ]
            },
            features: {
              zh: [
                '优质合金锤头设计，耐磨性好',
                '转子配重平衡技术，运行平稳',
                '筛板设计可调，产品粒度易控',
                '可更换耐磨衬板，使用寿命长',
                '密封防尘装置，减少粉尘污染'
              ],
              en: [
                'Premium alloy hammer design with good wear resistance',
                'Rotor counterweight balancing technology ensuring stable operation',
                'Adjustable screen design for easy product size control',
                'Replaceable wear-resistant liners with long service life',
                'Sealed dust-proof device reducing dust pollution'
              ]
            }
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

  // 获取相关产品
  const getRelatedProducts = () => {
    // 如果产品数据未加载，返回空数组
    if (!productData || !productData.relatedProducts) {
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/stationary-crushers`,
        items: [],
        visibleCards: 0
      };
    }

    try {
      // 创建产品名称映射
      const productNameMap: Record<string, { zh: string, en: string }> = {
        'jaw-crusher': { zh: '颚式破碎机', en: 'Jaw Crusher' },
        'cone-crusher': { zh: '圆锥破碎机', en: 'Cone Crusher' },
        'impact-crusher': { zh: '冲击式破碎机', en: 'Impact Crusher' },
        'double-roller-crusher': { zh: '双辊破碎机', en: 'Double Roller Crusher' },
        'heavy-duty-double-roller-crusher': { zh: '重型双辊破碎机', en: 'Heavy Duty Double Roller Crusher' }
      };
      
      // 映射相关产品列表
      const relatedItems = productData.relatedProducts.map((id: string) => ({
        id,
        series: productNameMap[id] || { 
          zh: id.includes('crusher') ? '破碎机' : '破碎设备',
          en: id.includes('crusher') ? 'Crusher' : 'Crushing Equipment'
        },
        image: `/images/products/crushers/${id}.jpg`
      }));
      
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/stationary-crushers`,
        items: relatedItems,
        visibleCards: 4
      };
    } catch (error) {
      console.error('Error processing related products:', error);
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/stationary-crushers`,
        items: [],
        visibleCards: 0
      };
    }
  };
  
  // 准备面包屑导航
  const breadcrumbs = [
    { label: { zh: '首页', en: 'Home' }, href: '/' },
    { label: { zh: '产品与服务', en: 'Products & Services' }, href: '/products' },
    { label: { zh: '固定式破碎机', en: 'Stationary Crushers' }, href: '/products/stationary-crushers' },
    { label: { zh: '锤式破碎机', en: 'Hammer Crusher' }, href: '/products/stationary-crushers/hammer-crusher' }
  ];

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

  // 从规格参数表中提取范围值的工具函数
  const extractRangeFromTable = (
    table: any[], 
    columnIndex: number, 
    defaultMin: number, 
    defaultMax: number, 
    unit: string
  ): { min: number; max: number; unit: string } => {
    if (!table || !Array.isArray(table) || table.length === 0) {
      return { min: defaultMin, max: defaultMax, unit };
    }
    
    // 从表格列中提取所有数值
    const values = table.map(row => {
      const cellValue = row[columnIndex];
      // 处理范围值 (如 "10-50")
      if (typeof cellValue === 'string' && cellValue.includes('-')) {
        const [min, max] = cellValue.split('-').map(v => parseFloat(v.trim()));
        return [min, max];
      }
      // 处理单一数值 (如 "37")
      return [parseFloat(String(cellValue))];
    }).flat().filter(v => !isNaN(v));
    
    // 如果提取的值为空，返回默认值
    if (values.length === 0) {
      return { min: defaultMin, max: defaultMax, unit };
    }
    
    // 返回最小值和最大值
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      unit
    };
  };
  
  // 从文本格式解析范围值 (如 "10-300 t/h")
  const parseRangeFromText = (
    text: string, 
    defaultMin: number, 
    defaultMax: number, 
    defaultUnit: string
  ): { min: number; max: number; unit: string } => {
    if (!text) return { min: defaultMin, max: defaultMax, unit: defaultUnit };
    
    // 尝试匹配格式如 "10-300 t/h"
    const match = text.match(/(\d+\.?\d*)[^\d]+(\d+\.?\d*)[^\d]+([^\d\s]+)/);
    if (match) {
      return {
        min: parseFloat(match[1]),
        max: parseFloat(match[2]),
        unit: match[3]
      };
    }
    
    return { min: defaultMin, max: defaultMax, unit: defaultUnit };
  };
  
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
      10, 300, 't/h'
    );
    
    extractedFeedSize = extractRangeFromTable(
      productData.specifications.tableData, 
      feedSizeIndex,
      200, 450, 'mm'
    );
    
    extractedMotorPower = extractRangeFromTable(
      productData.specifications.tableData, 
      motorPowerIndex,
      37, 250, 'kW'
    );
  } else if (productData.specifications?.data && Array.isArray(productData.specifications.data)) {
    // 查找列索引
    const findColumnIndex = (keyName: string) => {
      return productData.specifications?.columns?.findIndex(
        (col: any) => col.key.toLowerCase().includes(keyName)
      ) ?? -1;
    };
    
    const capacityIndex = findColumnIndex('capacity');
    const feedSizeIndex = findColumnIndex('feed') || findColumnIndex('max_feed_size');
    const motorPowerIndex = findColumnIndex('power') || findColumnIndex('motor');
    
    // 从对象数组中提取数据
    if (capacityIndex !== -1) {
      extractedCapacity = extractRangeFromTable(
        productData.specifications.data.map((row: any) => Object.values(row)), 
        capacityIndex,
        10, 300, 't/h'
      );
    }
    
    if (feedSizeIndex !== -1) {
      extractedFeedSize = extractRangeFromTable(
        productData.specifications.data.map((row: any) => Object.values(row)), 
        feedSizeIndex,
        200, 450, 'mm'
      );
    }
    
    if (motorPowerIndex !== -1) {
      extractedMotorPower = extractRangeFromTable(
        productData.specifications.data.map((row: any) => Object.values(row)), 
        motorPowerIndex,
        37, 250, 'kW'
      );
    }
  }
  
  // 准备首屏参数范围数据 (优先使用JSON中的值，其次使用表格提取值，最后使用默认值)
  const capacity = productData.capacity?.min !== undefined ? 
    productData.capacity : 
    (productData.capacity?.zh ? 
      parseRangeFromText(productData.capacity.zh, 10, 300, 't/h') :
      (extractedCapacity || { min: 10, max: 300, unit: 't/h' })
    );
  
  const maxFeedSize = productData.feedSize?.min !== undefined ? 
    productData.feedSize : 
    (productData.feedSize?.zh ? 
      parseRangeFromText(productData.feedSize.zh, 200, 450, 'mm') :
      (extractedFeedSize || { min: 200, max: 450, unit: 'mm' })
    );
  
  const motorPower = productData.motorPower?.min !== undefined ? 
    productData.motorPower : 
    (productData.motorPower?.zh ? 
      parseRangeFromText(productData.motorPower.zh, 37, 250, 'kW') :
      (extractedMotorPower || { min: 37, max: 250, unit: 'kW' })
    );

  // 按照圆锥破碎机相同的数据处理方式
  // 检查数据格式，适配不同JSON结构
  let specsColumns = [];
  let specsData = [];
  
  // 处理不同格式的specifications数据
  if (productData.specifications) {
    if (productData.specifications.tableHeaders && productData.specifications.tableData) {
      // 圆锥破碎机格式
      specsColumns = productData.specifications.tableHeaders.map((header: any) => ({
        key: header.en.toLowerCase().replace(/\s+/g, '_'),
        title: {
          zh: header.zh,
          en: header.en
        },
        unit: header.unit
      }));
      
      specsData = productData.specifications.tableData.map((row: any, rowIndex: number) => {
        const rowData: { [key: string]: string | number } = { key: rowIndex.toString() };
        productData.specifications.tableHeaders.forEach((header: any, colIndex: number) => {
          rowData[header.en.toLowerCase().replace(/\s+/g, '_')] = row[colIndex];
        });
        return rowData;
      });
    } else if (productData.specifications.columns && productData.specifications.data) {
      // 其他破碎机格式
      specsColumns = productData.specifications.columns;
      specsData = productData.specifications.data;
    }
  }
  
  // 准备规格数据
  const specifications = {
    title: productData.specifications?.title || { zh: "技术参数", en: "Specifications" },
    columns: specsColumns,
    data: specsData,
    notes: productData.specifications?.notes || []
  };

  // 简化产品特点数据
  const features = productData.features ? 
    (Array.isArray(productData.features) ? 
      productData.features : 
      (productData.features.zh && Array.isArray(productData.features.zh) ? 
        productData.features.zh.map((item: string, index: number) => ({
          zh: item,
          en: (productData.features.en && productData.features.en[index]) || item
        })) : 
        [])
    ) : [];

  // 准备应用领域数据
  const applications = productData.applications ? {
    title: productData.applications.title,
    items: productData.applications.items.map((item: any) => ({
      icon: item.icon,
      title: item.title,
      description: item.description
    }))
  } : undefined;

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: '/images/products/crushers/hammer-crusher.jpg',
    overview: productData.overview,
    capacity: capacity,
    maxFeedSize: maxFeedSize,
    motorPower: motorPower,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: getRelatedProducts(),
    extraParameters: { 
      productType: 'crusher',
      // 提供硬编码的顶部参数，确保单位正确显示
      topParameters: [
        {
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: capacity,
          unit: "t/h"
        },
        {
          label: { zh: "电机功率", en: "Motor Power" },
          value: motorPower,
          unit: "kW"
        },
        {
          label: { zh: "最大进料尺寸", en: "Max Feed Size" },
          value: maxFeedSize,
          unit: "mm"
        }
      ]
    },
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