'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';

export default function HeavyDutyDoubleRollerCrusherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/heavy-duty-double-roller-crusher.json');
        if (response.ok) {
          const data = await response.json();
          
          // 创建增强数据对象
          const enhancedData = {
            ...data
          };

          // 确保data中有relatedProducts数据
          if (!enhancedData.relatedProducts || !Array.isArray(enhancedData.relatedProducts) || enhancedData.relatedProducts.length === 0) {
            enhancedData.relatedProducts = ['jaw-crusher', 'cone-crusher', 'impact-crusher', 'hammer-crusher', 'double-roller-crusher'];
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
              zh: `重型双辊破碎机专为大型矿石、岩石破碎设计，采用增强型辊面和液压系统，辊径${data.specifications.tableData[2][1]}mm，最大进料${data.specifications.tableData[2][3]}mm，产能${data.specifications.tableData[2][5]}t/h。适用于高硬度物料的粗中碎作业，破碎能力强，广泛应用于大型矿山和采石场。`,
              en: `Heavy Duty Double Roller Crusher designed for large-scale ore and rock crushing, using reinforced roller surface and hydraulic system, with roller diameter ${data.specifications.tableData[2][1]}mm, max feed ${data.specifications.tableData[2][3]}mm, and capacity ${data.specifications.tableData[2][5]}t/h. Suitable for coarse and medium crushing of high-hardness materials, with strong crushing capability, widely used in large mines and quarries.`
            };
            
            // 确保产品特点更专业，结合技术参数
            if (enhancedData.features) {
              enhancedData.features.zh = [
                `${data.specifications.tableData[2][1]}mm大型加厚辊面，耐磨合金铸造`,
                `${data.specifications.tableData[2][4]}kW双电机驱动系统，动力充足`,
                `高压液压保护和调节系统，安全可靠`,
                `齿型辊面设计，处理高硬度物料能力强`,
                `机架加固设计，稳定性好，寿命长`
              ];
              
              enhancedData.features.en = [
                `${data.specifications.tableData[2][1]}mm large thickened roller surface, wear-resistant alloy casting`,
                `${data.specifications.tableData[2][4]}kW dual motor drive system with sufficient power`,
                `High-pressure hydraulic protection and adjustment system, safe and reliable`,
                `Toothed roller surface design, strong ability to process high-hardness materials`,
                `Reinforced frame design, good stability and long service life`
              ];
            }
            
            // 增强应用领域描述，结合产品特性
            if (enhancedData.applications && enhancedData.applications.items) {
              enhancedData.applications.items[0].description = {
                zh: `破碎大型矿石，进料粒度${data.specifications.tableData[2][3]}mm，产能${data.specifications.tableData[2][5]}t/h，满足大型矿山需求。`,
                en: `Crushing large ores with feed size ${data.specifications.tableData[2][3]}mm and capacity ${data.specifications.tableData[2][5]}t/h, meeting the needs of large mines.`
              };
              
              enhancedData.applications.items[1].description = {
                zh: `处理采石场硬岩，${data.specifications.tableData[2][1]}mm辊径确保高效破碎，提高开采效率。`,
                en: `Processing quarry hard rocks with ${data.specifications.tableData[2][1]}mm roller diameter ensuring efficient crushing and improving mining efficiency.`
              };
              
              if (enhancedData.applications.items[2]) {
                enhancedData.applications.items[2].description = {
                  zh: `处理大型建筑废料，环保高效，满足再生利用需求。`,
                  en: `Processing large construction waste, environmentally friendly and efficient, meeting recycling needs.`
                };
              }
              
              if (enhancedData.applications.items[3]) {
                enhancedData.applications.items[3].description = {
                  zh: `破碎高硬度冶金原料，为后续生产提供优质物料。`,
                  en: `Crushing high-hardness metallurgical materials, providing quality materials for subsequent production.`
                };
              }
            }
          }
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'heavy-duty-double-roller-crusher',
            model: '2PGC-1500×1800',
            series: {
              zh: '重型双辊破碎机',
              en: 'Heavy Duty Double Roller Crusher'
            },
            capacity: {
              min: 80,
              max: 500,
              unit: 't/h'
            },
            feedSize: {
              min: 300,
              max: 700,
              unit: 'mm'
            },
            motorPower: {
              min: 132,
              max: 400,
              unit: 'kW'
            },
            overview: {
              zh: '重型双辊破碎机专为大型矿石、岩石破碎设计，采用增强型辊面和液压系统，适用于高硬度物料的粗中碎作业，破碎能力强，广泛应用于大型矿山和采石场。',
              en: 'Heavy Duty Double Roller Crusher designed for large-scale ore and rock crushing, using reinforced roller surface and hydraulic system. Suitable for coarse and medium crushing of high-hardness materials, with strong crushing capability, widely used in large mines and quarries.'
            },
            specifications: {
              title: {
                zh: '重型双辊破碎机技术参数',
                en: 'Heavy Duty Double Roller Crusher Specifications'
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
                ['2PGC-1000×1200', 'Φ1000×1200', '30-80', '300', '132×2', '80-150'],
                ['2PGC-1200×1500', 'Φ1200×1500', '50-100', '400', '160×2', '120-250'],
                ['2PGC-1500×1800', 'Φ1500×1800', '80-150', '550', '220×2', '200-350'],
                ['2PGC-1800×2000', 'Φ1800×2000', '100-200', '700', '315×2', '300-500']
              ]
            },
            features: {
              zh: [
                '大型加厚辊面，耐磨合金铸造',
                '双电机驱动系统，动力充足',
                '高压液压保护和调节系统，安全可靠',
                '齿型辊面设计，处理高硬度物料能力强',
                '机架加固设计，稳定性好，寿命长'
              ],
              en: [
                'Large thickened roller surface, wear-resistant alloy casting',
                'Dual motor drive system with sufficient power',
                'High-pressure hydraulic protection and adjustment system, safe and reliable',
                'Toothed roller surface design, strong ability to process high-hardness materials',
                'Reinforced frame design, good stability and long service life'
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
        'hammer-crusher': { zh: '锤式破碎机', en: 'Hammer Crusher' },
        'double-roller-crusher': { zh: '双辊破碎机', en: 'Double Roller Crusher' }
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
    { label: { zh: '重型双辊破碎机', en: 'Heavy Duty Double Roller Crusher' }, href: '/products/stationary-crushers/heavy-duty-double-roller-crusher' }
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
      // 处理范围值 (如 "80-200")
      if (typeof cellValue === 'string' && cellValue.includes('-')) {
        const [min, max] = cellValue.split('-').map(v => parseFloat(v.trim()));
        return [min, max];
      }
      // 处理单一数值 (如 "132")
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
  
  // 从文本格式解析范围值 (如 "80-500 t/h")
  const parseRangeFromText = (
    text: string, 
    defaultMin: number, 
    defaultMax: number, 
    defaultUnit: string
  ): { min: number; max: number; unit: string } => {
    if (!text) return { min: defaultMin, max: defaultMax, unit: defaultUnit };
    
    // 尝试匹配格式如 "80-500 t/h"
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
      80, 500, 't/h'
    );
    
    extractedFeedSize = extractRangeFromTable(
      productData.specifications.tableData, 
      feedSizeIndex,
      300, 700, 'mm'
    );
    
    extractedMotorPower = extractRangeFromTable(
      productData.specifications.tableData, 
      motorPowerIndex,
      132, 400, 'kW'
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
        80, 500, 't/h'
      );
    }
    
    if (feedSizeIndex !== -1) {
      extractedFeedSize = extractRangeFromTable(
        productData.specifications.data.map((row: any) => Object.values(row)), 
        feedSizeIndex,
        300, 700, 'mm'
      );
    }
    
    if (motorPowerIndex !== -1) {
      extractedMotorPower = extractRangeFromTable(
        productData.specifications.data.map((row: any) => Object.values(row)), 
        motorPowerIndex,
        132, 400, 'kW'
      );
    }
  }
  
  // 准备首屏参数范围数据 (优先使用JSON中的值，其次使用表格提取值，最后使用默认值)
  const capacity = productData.capacity?.min !== undefined ? 
    productData.capacity : 
    (productData.capacity?.zh ? 
      parseRangeFromText(productData.capacity.zh, 80, 500, 't/h') :
      (extractedCapacity || { min: 80, max: 500, unit: 't/h' })
    );
  
  const maxFeedSize = productData.feedSize?.min !== undefined ? 
    productData.feedSize : 
    (productData.feedSize?.zh ? 
      parseRangeFromText(productData.feedSize.zh, 300, 700, 'mm') :
      (extractedFeedSize || { min: 300, max: 700, unit: 'mm' })
    );
  
  const motorPower = productData.motorPower?.min !== undefined ? 
    productData.motorPower : 
    (productData.motorPower?.zh ? 
      parseRangeFromText(productData.motorPower.zh, 132, 400, 'kW') :
      (extractedMotorPower || { min: 132, max: 400, unit: 'kW' })
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
    imagePath: '/images/products/crushers/heavy-duty-double-roller-crusher.jpg',
    overview: productData.overview,
    capacity: capacity,
    maxFeedSize: maxFeedSize,
    motorPower: motorPower,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: getRelatedProducts(),
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