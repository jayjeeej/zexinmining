'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { ParameterRange } from '@/app/components/products/ProductDetailTemplate';

export default function CentrifugalSeparatorPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/centrifugal-separator.json');
        if (response.ok) {
          const data = await response.json();
          
          // 增强产品概述，基于技术参数
          const enhancedData = {
            ...data,
            overview: {
              zh: `离心选矿机是一种利用离心力强化重力分选效果的现代化选矿设备，处理能力${data.capacity.zh}，适用给矿粒度${data.feedSize.zh}。通过高速旋转产生强大的离心力场，使重矿物与轻矿物有效分离，大幅提高选别效率和精度。我们的离心选矿机采用先进技术设计，具有分选效率高、处理能力大、操作简便等特点。`,
              en: `The Centrifugal Separator is a modern mineral processing equipment that utilizes centrifugal force to enhance gravity separation effects, with processing capacity ${data.capacity.en} and feed size ${data.feedSize.en}. Through high-speed rotation, it generates a powerful centrifugal field that effectively separates heavy minerals from light minerals, greatly improving separation efficiency and precision. Our centrifugal separators are designed with advanced technology, featuring high separation efficiency, large processing capacity, and simple operation.`
            }
          };
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'centrifugal-separator',
            model: 'STLB60',
            series: {
              zh: '离心选矿机',
              en: 'Centrifugal Separator'
            },
            capacity: {
              zh: '8-12 t/h',
              en: '8-12 t/h'
            },
            feedSize: {
              zh: '0-5 mm',
              en: '0-5 mm'
            },
            motorPower: {
              zh: '4 kW',
              en: '4 kW'
            },
            overview: {
              zh: '离心选矿机是一种利用离心力强化重力分选效果的现代化选矿设备，特别适合细粒矿物的选别。通过高速旋转产生强大的离心力场，使重矿物与轻矿物有效分离，大幅提高选别效率和精度。我们的离心选矿机采用先进技术设计，具有分选效率高、处理能力大、操作简便等特点。',
              en: 'The Centrifugal Separator is a modern mineral processing equipment that utilizes centrifugal force to enhance gravity separation effects, particularly suitable for the separation of fine-grained minerals. Through high-speed rotation, it generates a powerful centrifugal field that effectively separates heavy minerals from light minerals, greatly improving separation efficiency and precision. Our centrifugal separators are designed with advanced technology, featuring high separation efficiency, large processing capacity, and simple operation.'
            }
          });
        }
      } catch (error) {
        console.error('Error loading product data:', error);
        // 加载出错时使用备份数据
      } finally {
        setLoading(false);
      }
    }
    
    loadProductData();
  }, []);
  
  if (loading || !productData) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="text-center">
          <p className="text-gray-500">{isZh ? '加载产品数据...' : 'Loading product data...'}</p>
        </div>
      </div>
    );
  }
  
  // 从文本格式解析范围值 (如 "8-12 t/h")
  const parseRangeFromText = (
    text: string, 
    defaultMin: number, 
    defaultMax: number, 
    defaultUnit: string
  ): { min: number; max: number; unit: string } => {
    if (!text) return { min: defaultMin, max: defaultMax, unit: defaultUnit };
    
    // 尝试匹配格式如 "8-12 t/h"
    const rangeMatch = text.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*(.+)/);
    if (rangeMatch) {
      return {
        min: parseFloat(rangeMatch[1]),
        max: parseFloat(rangeMatch[2]),
        unit: rangeMatch[3].trim()
      };
    }
    
    // 尝试匹配格式如 "0-5 mm"
    const rangeZeroMatch = text.match(/0\s*-\s*(\d+\.?\d*)\s*(.+)/);
    if (rangeZeroMatch) {
      return {
        min: 0,
        max: parseFloat(rangeZeroMatch[1]),
        unit: rangeZeroMatch[2].trim()
      };
    }
    
    // 尝试匹配单一值格式
    const singleMatch = text.match(/(\d+\.?\d*)\s*(.+)/);
    if (singleMatch) {
      const value = parseFloat(singleMatch[1]);
      return {
        min: value,
        max: value,
        unit: singleMatch[2].trim()
      };
    }
    
    return { min: defaultMin, max: defaultMax, unit: defaultUnit };
  };
  
  // 准备规格列
  const specsColumns = productData.specifications?.tableHeaders.map((header: any) => ({
    key: header.en?.toLowerCase().replace(/\s+/g, '_') || header.zh?.toLowerCase().replace(/\s+/g, '_'),
    title: {
      zh: header.zh,
      en: header.en
    },
    unit: header.unit
  })) || [];
  
  // 准备规格数据
  const specsData = productData.specifications?.tableData.map((row: any, rowIndex: number) => {
    const rowData: { [key: string]: string | number } = { key: rowIndex.toString() };
    productData.specifications.tableHeaders.forEach((header: any, colIndex: number) => {
      const key = header.en?.toLowerCase().replace(/\s+/g, '_') || header.zh?.toLowerCase().replace(/\s+/g, '_');
      rowData[key] = row[colIndex];
    });
    return rowData;
  }) || [];
  
  // 从表格数据中提取参数范围
  const extractRangeFromTableData = (tableHeaders: any[], tableData: any[][], paramZh: string): ParameterRange => {
    // 找到参数所在的列索引
    const columnIndex = tableHeaders.findIndex(header => header.zh === paramZh);
    if (columnIndex === -1) return { min: 0, max: 0, unit: '' };
    
    let min = Infinity;
    let max = -Infinity;
    let unit = tableHeaders[columnIndex].unit || '';
    
    // 遍历所有行，找出最小值和最大值
    tableData.forEach(row => {
      const cellValue = row[columnIndex];
      if (typeof cellValue === 'string') {
        // 处理范围格式，如 "8-12"
        const rangeParts = cellValue.split('-');
        if (rangeParts.length === 2) {
          const minVal = parseFloat(rangeParts[0]);
          const maxVal = parseFloat(rangeParts[1]);
          if (!isNaN(minVal) && minVal < min) min = minVal;
          if (!isNaN(maxVal) && maxVal > max) max = maxVal;
        } else {
          // 处理单个数值格式，如 "4"
          const val = parseFloat(cellValue);
          if (!isNaN(val)) {
            if (val < min) min = val;
            if (val > max) max = val;
          }
        }
      } else if (typeof cellValue === 'number') {
        if (cellValue < min) min = cellValue;
        if (cellValue > max) max = cellValue;
      }
    });
    
    // 确保有合理的默认值
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 0;
    
    return { min, max, unit };
  };
  
  // 准备参数范围数据 - 从表格数据中提取
  const capacity: ParameterRange = productData.specifications?.tableHeaders ? 
    extractRangeFromTableData(productData.specifications.tableHeaders, productData.specifications.tableData, "处理能力") : 
    (productData.capacity?.min !== undefined ? 
      productData.capacity : 
      (productData.capacity?.zh ? 
        parseRangeFromText(productData.capacity.zh, 8, 12, 't/h') : 
        { min: 8, max: 12, unit: 't/h' }
      )
    );
  
  const maxFeedSize: ParameterRange = productData.specifications?.tableHeaders ? 
    extractRangeFromTableData(productData.specifications.tableHeaders, productData.specifications.tableData, "进料尺寸") : 
    (productData.feedSize?.min !== undefined ? 
      productData.feedSize : 
      (productData.feedSize?.zh ? 
        parseRangeFromText(productData.feedSize.zh, 0, 5, 'mm') : 
        { min: 0, max: 5, unit: 'mm' }
      )
    );
  
  const motorPower: ParameterRange = productData.specifications?.tableHeaders ? 
    extractRangeFromTableData(productData.specifications.tableHeaders, productData.specifications.tableData, "电机功率") : 
    (productData.motorPower?.min !== undefined ? 
      productData.motorPower : 
      (productData.motorPower?.zh ? 
        parseRangeFromText(productData.motorPower.zh, 4, 4, 'kW') : 
        { min: 4, max: 4, unit: 'kW' }
      )
    );
  
  // 准备特性数据
  const features = productData.features?.zh?.map((feature: string, index: number) => ({
    zh: feature,
    en: productData.features.en[index]
  })) || [];
  
  // 准备应用领域数据
  const applications = productData.applications ? {
    title: productData.applications.title,
    items: productData.applications.items.map((item: any) => ({
      icon: item.icon,
      title: item.title,
      description: item.description
    }))
  } : undefined;
  
  // 相关产品数据处理
  const getRelatedProducts = () => {
    if (!productData.relatedProducts || !Array.isArray(productData.relatedProducts)) {
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/gravity-separation`,
        items: [],
        visibleCards: 0
      };
    }
    
    try {
      // 创建产品名称映射
      const productNameMap: Record<string, { zh: string, en: string }> = {
        'synchronous-counter-directional-jig': { zh: '4室复合双动跳汰机', en: '4-Chamber Composite Double-Motion Jig' },
        'synchronous-counter-directional-jig-small': { zh: '2室复合双动跳汰机', en: '2-Chamber Composite Double-Motion Jig' },
        'sawtooth-wave-jig': { zh: '锯齿波跳汰机', en: 'Sawtooth Wave Jig' },
        'shaking-table': { zh: '摇床', en: 'Shaking Table' },
        'carpet-hooking-machine': { zh: '毛毯布勾机', en: 'Carpet Hooking Machine' },
        'spiral-chute': { zh: '玻璃钢螺旋溜槽', en: 'Glass Fiber Spiral Chute' }
      };
      
      // 映射相关产品列表
      const relatedItems = productData.relatedProducts.map((id: string) => ({
        id,
        series: productNameMap[id] || { 
          zh: '重力选矿设备',
          en: 'Gravity Separation Equipment'
        },
        image: `/images/products/gravity-separation/${id}.png`
      }));
      
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/gravity-separation`,
        items: relatedItems,
        visibleCards: 3
      };
    } catch (error) {
      console.error('Error processing related products:', error);
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/gravity-separation`,
        items: [],
        visibleCards: 0
      };
    }
  };

  // 面包屑导航
  const breadcrumb = {
    items: [
      {
        label: { zh: "产品中心", en: "Products" },
        href: `/products`
      },
      {
        label: { zh: "重选设备", en: "Gravity Separation Equipment" },
        href: `/products/gravity-separation`
      },
      {
        label: { zh: "离心选矿机", en: "Centrifugal Separator" }
      }
    ]
  };
  
  // 获取相关产品数据
  const relatedProducts = getRelatedProducts();

  return (
    <ProductDetailTemplate
      productId={productData.id}
      model={productData.model}
      series={productData.series}
      imagePath={productData.image}
      overview={productData.overview}
      capacity={capacity}
      maxFeedSize={maxFeedSize}
      motorPower={motorPower}
      specifications={{
        title: { zh: "技术参数", en: "Specifications" },
        columns: specsColumns,
        data: specsData,
        notes: productData.specifications?.note ? [{ content: productData.specifications.note }] : []
      }}
      features={features}
      applications={applications}
      relatedProducts={relatedProducts}
      breadcrumb={breadcrumb}
    />
  );
} 