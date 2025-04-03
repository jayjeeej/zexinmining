'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { ParameterRange } from '@/app/components/products/ProductDetailTemplate';
import { parseRangeFromText } from '@/app/utils/productUtils';

export default function SelfPrimingFlotationMachinePage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/self-priming-flotation-machine.json');
        if (response.ok) {
          const data = await response.json();
          
          // 增强产品概述，基于技术参数
          const enhancedData = {
            ...data,
            overview: {
              zh: `自吸式浮选机(SF型)是一种自吸进气的浮选设备，有效容积${data.effectiveVolume?.zh || '2-40 m³'}，处理能力${data.capacity?.zh || '0.8-16 m³/min'}，电机功率${data.motorPower?.zh || '4-45 kW'}。该设备利用叶轮高速旋转产生负压自动吸入空气，无需外部空气压缩机，结构紧凑，操作简便，能耗低，适用于多种矿石的浮选作业，特别适合中小型选矿厂。`,
              en: `The Self-priming Flotation Machine (SF series) is a self-priming air intake flotation equipment with effective volume ${data.effectiveVolume?.en || '2-40 m³'}, processing capacity ${data.capacity?.en || '0.8-16 m³/min'}, and motor power ${data.motorPower?.en || '4-45 kW'}. This equipment utilizes high-speed impeller rotation to generate negative pressure for automatic air intake, requiring no external air compressor. It features compact structure, simple operation, low energy consumption, and is suitable for flotation operations of various ores, especially ideal for small to medium-sized mineral processing plants.`
            }
          };
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'self-priming-flotation-machine',
            model: 'SF',
            series: {
              zh: '自吸式浮选机',
              en: 'Self-priming Flotation Machine'
            },
            effectiveVolume: {
              zh: '2-40 m³',
              en: '2-40 m³'
            },
            capacity: {
              zh: '0.8-16 m³/min',
              en: '0.8-16 m³/min'
            },
            motorPower: {
              zh: '4-45 kW',
              en: '4-45 kW'
            },
            overview: {
              zh: '自吸式浮选机(SF型)是一种自吸进气的浮选设备，有效容积2-40 m³，处理能力0.8-16 m³/min，电机功率4-45 kW。该设备利用叶轮高速旋转产生负压自动吸入空气，无需外部空气压缩机，结构紧凑，操作简便，能耗低，适用于多种矿石的浮选作业，特别适合中小型选矿厂。',
              en: 'The Self-priming Flotation Machine (SF series) is a self-priming air intake flotation equipment with effective volume 2-40 m³, processing capacity 0.8-16 m³/min, and motor power 4-45 kW. This equipment utilizes high-speed impeller rotation to generate negative pressure for automatic air intake, requiring no external air compressor. It features compact structure, simple operation, low energy consumption, and is suitable for flotation operations of various ores, especially ideal for small to medium-sized mineral processing plants.'
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
  
  // 从文本格式解析范围值 (如 "2-40 m³")
  const effectiveVolume: ParameterRange = productData.effectiveVolume?.min !== undefined ? 
    productData.effectiveVolume : 
    (productData.effectiveVolume?.zh ? 
      parseRangeFromText(productData.effectiveVolume.zh, 1, 30, 'm³') : 
      { min: 1, max: 30, unit: 'm³' }
    );
  
  const capacity: ParameterRange = productData.capacity?.min !== undefined ? 
    productData.capacity : 
    (productData.capacity?.zh ? 
      parseRangeFromText(productData.capacity.zh, 1.0, 35, 'm³/min') : 
      { min: 1.0, max: 35, unit: 'm³/min' }
    );
  
  const motorPower: ParameterRange = productData.motorPower?.min !== undefined ? 
    productData.motorPower : 
    (productData.motorPower?.zh ? 
      parseRangeFromText(productData.motorPower.zh, 4.0, 75, 'kW') : 
      { min: 4.0, max: 75, unit: 'kW' }
    );
  
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
        basePath: `/products/flotation`,
        items: [],
        visibleCards: 0
      };
    }
    
    try {
      // 创建产品名称映射
      const productNameMap: Record<string, { zh: string, en: string }> = {
        'aeration-flotation-machine': { zh: '充气搅拌式浮选机', en: 'Aeration Flotation Machine' },
        'bar-flotation-machine': { zh: '柱式浮选机', en: 'Bar Flotation Machine' },
        'coarse-particle-flotation-machine': { zh: '粗粒浮选机', en: 'Coarse Particle Flotation Machine' },
        'flotation-cell': { zh: '浮选槽', en: 'Flotation Cell' },
        'self-priming-flotation-machine': { zh: '自吸式浮选机', en: 'Self-priming Flotation Machine' },
        'xcf-flotation-machine': { zh: 'XCF浮选机', en: 'XCF Flotation Machine' }
      };
      
      // 映射相关产品列表
      const relatedItems = productData.relatedProducts.map((id: string) => ({
        id,
        series: productNameMap[id] || { 
          zh: '浮选设备',
          en: 'Flotation Equipment'
        },
        image: `/images/products/flotation/${id}.jpg`
      }));
      
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/flotation`,
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
        basePath: `/products/flotation`,
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
        label: { zh: "浮选设备", en: "Flotation Equipment" },
        href: `/products/flotation`
      },
      {
        label: { zh: "自吸式浮选机", en: "Self-priming Flotation Machine" }
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
      imagePath={productData.image || `/images/products/flotation/${productData.id}.jpg`}
      overview={productData.overview}
      effectiveVolume={effectiveVolume}
      capacity={capacity}
      motorPower={motorPower}
      specifications={{
        title: productData.specifications?.title || { zh: "技术参数", en: "Specifications" },
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