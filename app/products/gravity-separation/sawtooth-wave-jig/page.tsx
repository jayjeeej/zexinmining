'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { ParameterRange } from '@/app/components/products/ProductDetailTemplate';

export default function SawtoothWaveJigPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/sawtooth-wave-jig.json');
        if (response.ok) {
          const data = await response.json();
          
          // 增强产品概述，基于技术参数
          const enhancedData = {
            ...data,
            overview: {
              zh: `锯齿波跳汰机是一种采用独特锯齿波形运动方式的重力选矿设备，特别适合处理细粒和密度差异较小的矿物。处理能力${data.specifications.tableData[0][7]}，最大进料尺寸${data.specifications.tableData[0][6]}。其锯齿波运动形式提供了更精确的分选效果，对金、钨、锡等贵重金属和重矿物的回收率高，是小型精细选矿的理想设备。`,
              en: `The Sawtooth Wave Jig is a gravity separation equipment that adopts a unique sawtooth waveform motion, particularly suitable for processing fine particles and minerals with small density differences. Processing capacity ${data.specifications.tableData[0][7]}, max feed size ${data.specifications.tableData[0][6]}. Its sawtooth wave motion provides more precise separation effects, with high recovery rates for precious metals and heavy minerals such as gold, tungsten, and tin, making it an ideal equipment for small-scale fine mineral processing.`
            }
          };
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'sawtooth-wave-jig',
            model: 'STWJ-5',
            series: {
              zh: '锯齿波跳汰机',
              en: 'Sawtooth Wave Jig'
            },
            capacity: {
              zh: '10-20 t/h',
              en: '10-20 t/h'
            },
            feedSize: {
              zh: '≤60 mm',
              en: '≤60 mm'
            },
            motorPower: {
              zh: '1.5-3 kW',
              en: '1.5-3 kW'
            },
            overview: {
              zh: '锯齿波跳汰机是一种采用独特锯齿波形运动方式的重力选矿设备，特别适合处理细粒和密度差异较小的矿物。其锯齿波运动形式提供了更精确的分选效果，对金、钨、锡等贵重金属和重矿物的回收率高，是小型精细选矿的理想设备。',
              en: 'The Sawtooth Wave Jig is a gravity separation equipment that adopts a unique sawtooth waveform motion, particularly suitable for processing fine particles and minerals with small density differences. Its sawtooth wave motion provides more precise separation effects, with high recovery rates for precious metals and heavy minerals such as gold, tungsten, and tin, making it an ideal equipment for small-scale fine mineral processing.'
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
  
  // 从文本格式解析范围值 (如 "10-20 t/h")
  const parseRangeFromText = (
    text: string, 
    defaultMin: number, 
    defaultMax: number, 
    defaultUnit: string
  ): { min: number; max: number; unit: string } => {
    if (!text) return { min: defaultMin, max: defaultMax, unit: defaultUnit };
    
    // 提取数值部分和单位部分
    // 处理范围值格式 "10-20 t/h"
    const rangeMatch = text.match(/(\d+\.?\d*)\s*[-–—~]\s*(\d+\.?\d*)\s+(.*)/);
    if (rangeMatch) {
      return {
        min: parseFloat(rangeMatch[1]),
        max: parseFloat(rangeMatch[2]),
        unit: rangeMatch[3].trim()
      };
    }
    
    // 处理单一值格式，如 "1.5 kW"
    const singleMatch = text.match(/(\d+\.?\d*)\s+(.*)/);
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
        // 处理范围格式，如 "20-30"
        const rangeParts = cellValue.split('-');
        if (rangeParts.length === 2) {
          const minVal = parseFloat(rangeParts[0]);
          const maxVal = parseFloat(rangeParts[1]);
          if (!isNaN(minVal) && minVal < min) min = minVal;
          if (!isNaN(maxVal) && maxVal > max) max = maxVal;
        } else {
          // 处理单个数值格式
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
        parseRangeFromText(productData.capacity.zh, 20, 40, 't/h') : 
        { min: 20, max: 40, unit: 't/h' }
      )
    );
  
  const maxFeedSize: ParameterRange = productData.specifications?.tableHeaders ? 
    extractRangeFromTableData(productData.specifications.tableHeaders, productData.specifications.tableData, "进料尺寸") : 
    (productData.feedSize?.min !== undefined ? 
      productData.feedSize : 
      (productData.feedSize?.zh ? 
        parseRangeFromText(productData.feedSize.zh, 0, 60, 'mm') : 
        { min: 0, max: 60, unit: 'mm' }
      )
    );
  
  const motorPower: ParameterRange = productData.specifications?.tableHeaders ? 
    extractRangeFromTableData(productData.specifications.tableHeaders, productData.specifications.tableData, "电机功率") : 
    (productData.motorPower?.min !== undefined ? 
      productData.motorPower : 
      (productData.motorPower?.zh ? 
        parseRangeFromText(productData.motorPower.zh, 5.5, 7.5, 'kW') : 
        { min: 5.5, max: 7.5, unit: 'kW' }
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
      const productNameMap: Record<string, { zh: string; en: string }> = {
        'sawtooth-wave-jig': { zh: '锯齿波跳汰机', en: 'Sawtooth Wave Jig' },
        'synchronous-counter-directional-jig': { zh: '同步逆流跳汰机', en: 'Synchronous Counter Directional Jig' },
        'synchronous-counter-directional-jig-small': { zh: '小型同步逆流跳汰机', en: 'Small Synchronous Counter Directional Jig' },
        'shaking-table': { zh: '摇床', en: 'Shaking Table' },
        'carpet-hooking-machine': { zh: '毛毯布勾机', en: 'Carpet Hooking Machine' },
        'centrifugal-separator': { zh: '离心选矿机', en: 'Centrifugal Separator' },
        'spiral-chute': { zh: '玻璃钢螺旋溜槽', en: 'Glass Fiber Spiral Chute' }
      };
      
      // 映射相关产品列表
      const relatedItems = productData.relatedProducts.map((id: string) => ({
        id,
        series: productNameMap[id] || { 
          zh: id.includes('jig') ? '跳汰机' : '重力选矿设备',
          en: id.includes('jig') ? 'Jig' : 'Gravity Separation Equipment'
        },
        image: `/images/products/gravity-separation/${id}.jpg`
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
        label: { zh: "锯齿波跳汰机", en: "Sawtooth Wave Jig" }
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
      imagePath={productData.image || '/images/products/gravity-separation/sawtooth-wave-jig.jpg'}
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