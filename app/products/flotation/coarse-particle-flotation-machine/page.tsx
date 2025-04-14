'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { ParameterRange } from '@/app/components/products/ProductDetailTemplate';
import { parseRangeFromText } from '@/app/utils/productUtils';

export default function CoarseParticleFlotationMachinePage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/coarse-particle-flotation-machine.json');
        if (response.ok) {
          const data = await response.json();
          
          // 增强产品概述，基于技术参数
          const enhancedData = {
            ...data,
            overview: {
              zh: `粗粒浮选机(CLF型)是专为处理粗颗粒矿物设计的浮选设备，有效容积${data.effectiveVolume?.zh || '2-40 m³'}，处理能力${data.capacity?.zh || '0.5-38 m³/min'}，电机功率${data.motorPower?.zh || '5.5-75 kW'}。该设备采用特殊结构设计和工作原理，能够有效处理粒度较大的矿物颗粒，扩大了浮选工艺的应用范围，提高了选矿回收率，降低了后续研磨过程的能耗。`,
              en: `The Coarse Particle Flotation Machine (CLF series) is a flotation equipment specially designed for processing coarse mineral particles, with effective volume ${data.effectiveVolume?.en || '2-40 m³'}, processing capacity ${data.capacity?.en || '0.5-38 m³/min'}, and motor power ${data.motorPower?.en || '5.5-75 kW'}. This equipment adopts a special structural design and working principle, which can effectively process larger mineral particles, expanding the application range of flotation processes, improving mineral recovery rate, and reducing energy consumption in subsequent grinding processes.`
            }
          };
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'coarse-particle-flotation-machine',
            model: 'CLF系列',
            series: {
              zh: '粗粒浮选机',
              en: 'Coarse Particle Flotation Machine'
            },
            effectiveVolume: {
              zh: '5-40 m³',
              en: '5-40 m³'
            },
            capacity: {
              zh: '3-18 m³/min',
              en: '3-18 m³/min'
            },
            motorPower: {
              zh: '18.5-55 kW',
              en: '18.5-55 kW'
            },
            overview: {
              zh: '粗粒浮选机(CLF型)是专为处理粗颗粒矿物设计的浮选设备，有效容积2-40 m³，处理能力0.5-38 m³/min，电机功率5.5-75 kW。该设备采用特殊结构设计和工作原理，能够有效处理粒度较大的矿物颗粒，扩大了浮选工艺的应用范围，提高了选矿回收率，降低了后续研磨过程的能耗。',
              en: 'The Coarse Particle Flotation Machine (CLF series) is a flotation equipment specially designed for processing coarse mineral particles, with effective volume 2-40 m³, processing capacity 0.5-38 m³/min, and motor power 5.5-75 kW. This equipment adopts a special structural design and working principle, which can effectively process larger mineral particles, expanding the application range of flotation processes, improving mineral recovery rate, and reducing energy consumption in subsequent grinding processes.'
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
  
  // 从文本格式解析范围值 (如 "5-40 m³")
  const effectiveVolume: ParameterRange = productData.effectiveVolume?.min !== undefined ? 
    productData.effectiveVolume : 
    (productData.effectiveVolume?.zh ? 
      parseRangeFromText(productData.effectiveVolume.zh, 2, 40, 'm³') : 
      { min: 2, max: 40, unit: 'm³' }
    );
  
  const capacity: ParameterRange = productData.capacity?.min !== undefined ? 
    productData.capacity : 
    (productData.capacity?.zh ? 
      parseRangeFromText(productData.capacity.zh, 0.5, 38, 'm³/min') : 
      { min: 0.5, max: 38, unit: 'm³/min' }
    );
  
  const motorPower: ParameterRange = productData.motorPower?.min !== undefined ? 
    productData.motorPower : 
    (productData.motorPower?.zh ? 
      parseRangeFromText(productData.motorPower.zh, 5.5, 75, 'kW') : 
      { min: 5.5, max: 75, unit: 'kW' }
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
      
      // 映射相关产品列表，并过滤掉不在productNameMap中的产品ID
      const relatedItems = productData.relatedProducts
        .filter((id: string) => productNameMap[id]) // 只保留存在于productNameMap中的ID
        .map((id: string) => ({
          id,
          series: productNameMap[id],
          image: `/images/products/flotation/${id}.png`
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
        label: { zh: "粗粒浮选机", en: "Coarse Particle Flotation Machine" }
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
      imagePath={productData.image || `/images/products/flotation/${productData.id}.png`}
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