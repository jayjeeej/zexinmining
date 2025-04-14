'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { ParameterRange } from '@/app/components/products/ProductDetailTemplate';

export default function ConeCrusherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/cone-crusher.json');
        if (response.ok) {
          const data = await response.json();
          
          // 增强产品概述，基于技术参数
          const enhancedData = {
            ...data,
            // 不修改从JSON加载的overview，使用原始简介
            overview: data.overview
          };
          
          // 确保产品特点更专业，结合技术参数
          if (enhancedData.features) {
            // 检查是否已经是新的格式（包含zh和en数组）
            if (Array.isArray(enhancedData.features.zh)) {
              // 保留现有JSON中的特点数据，不做修改
            } else {
              // 旧格式，需要创建新的特点数据
              enhancedData.features.zh = [
                `${enhancedData.specifications.tableData[2][1]}mm合金钢破碎锥，耐磨寿命长`,
                `层压破碎技术处理${enhancedData.specifications.tableData[2][3]}mm以下物料`,
                `${enhancedData.specifications.tableData[2][4]}kW电机，精确液压调整系统`,
                `自动润滑系统，维护便捷`,
                `智能过载保护，产能稳定`
              ];
              
              enhancedData.features.en = [
                `${enhancedData.specifications.tableData[2][1]}mm alloy steel cone, extended wear life`,
                `Lamination technology for materials up to ${enhancedData.specifications.tableData[2][3]}mm`,
                `${enhancedData.specifications.tableData[2][4]}kW motor with precise hydraulic adjustment`,
                `Automatic lubrication, easy maintenance`,
                `Intelligent overload protection, stable output`
              ];
            }
          }
          
          // 增强应用领域描述，结合产品特性
          if (enhancedData.applications) {
            // 检查是否已经是新的格式（包含zh和en数组）
            if (Array.isArray(enhancedData.applications.zh)) {
              // 保留现有JSON中的应用领域数据，不做修改
            } else if (enhancedData.applications.items) {
              // 旧格式，需要创建新的应用领域数据
              enhancedData.applications.items[0].description = {
                zh: `处理各类矿石，进料粒度${enhancedData.specifications.tableData[2][3]}mm，产能${enhancedData.specifications.tableData[2][5]}t/h，提供稳定中细碎产出。`,
                en: `Processes various ores with feed size ${enhancedData.specifications.tableData[2][3]}mm and capacity ${enhancedData.specifications.tableData[2][5]}t/h, providing stable output.`
              };
              
              enhancedData.applications.items[1].description = {
                zh: `生产高品质建筑骨料，${enhancedData.specifications.tableData[2][1]}mm破碎锥确保优良粒形，满足混凝土和沥青混合料需求。`,
                en: `Produces quality aggregates with ${enhancedData.specifications.tableData[2][1]}mm crushing cone ensuring excellent particle shape for concrete and asphalt mixtures.`
              };
              
              if (enhancedData.applications.items[2]) {
                enhancedData.applications.items[2].description = {
                  zh: `优化矿石破碎工艺，提高冶炼效率，保障金属生产质量。`,
                  en: `Optimizes crushing process, improves smelting efficiency and quality in metal production.`
                };
              }
              
              if (enhancedData.applications.items[3]) {
                enhancedData.applications.items[3].description = {
                  zh: `精准破碎化工原料，满足特定粒度需求，提升产品质量。`,
                  en: `Precise crushing of chemical materials to meet specific size requirements.`
                };
              }
            }
          }
          
          setProductData(enhancedData);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'cone-crusher',
            model: 'PYB-1200',
            series: {
              zh: '圆锥破碎机',
              en: 'Cone Crusher'
            },
            capacity: {
              min: 40,
              max: 500,
              unit: 't/h'
            },
            feedSize: {
              min: 35,
              max: 350,
              unit: 'mm'
            },
            motorPower: {
              min: 30,
              max: 280,
              unit: 'kW'
            },
            overview: {
              zh: '圆锥破碎机专为中细碎作业设计，采用层压破碎技术。破碎比大、产品粒度均匀、运行稳定，适用于矿山、冶金、建材等行业。',
              en: 'Cone Crusher designed for medium and fine crushing with lamination technology. High crushing ratio, uniform particle size and stable operation for mining, metallurgy and construction.'
            },
            features: [
              {
                zh: '合金钢材料构造，耐磨寿命长',
                en: 'Alloy steel construction, extended wear life'
              },
              {
                zh: '层压破碎技术，产品粒度均匀',
                en: 'Lamination technology, uniform particle size'
              },
              {
                zh: '智能液压调整系统，操作简便',
                en: 'Intelligent hydraulic adjustment, easy operation'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error loading product data:', error);
        // 加载出错时使用相同的备份数据
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
  
  // 从文本格式解析范围值 (如 "40-500 t/h")
  const parseRangeFromText = (
    text: string, 
    defaultMin: number, 
    defaultMax: number, 
    defaultUnit: string
  ): { min: number; max: number; unit: string } => {
    if (!text) return { min: defaultMin, max: defaultMax, unit: defaultUnit };
    
    // 尝试匹配格式如 "40-500 t/h"
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
  
  // 准备规格列
  const specsColumns = productData.specifications?.tableHeaders.map((header: any) => ({
    key: header.en.toLowerCase().replace(/\s+/g, '_'),
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
      rowData[header.en.toLowerCase().replace(/\s+/g, '_')] = row[colIndex];
    });
    return rowData;
  }) || [];
  
  // 准备参数范围数据 - 支持不同格式的JSON数据
  const capacity: ParameterRange = productData.capacity?.min !== undefined ? 
    productData.capacity : 
    (productData.capacity?.zh ? 
      parseRangeFromText(productData.capacity.zh, 40, 500, 't/h') : 
      { min: 40, max: 500, unit: 't/h' }
    );
  
  const maxFeedSize: ParameterRange = productData.feedSize?.min !== undefined ? 
    productData.feedSize : 
    (productData.feedSize?.zh ? 
      parseRangeFromText(productData.feedSize.zh, 35, 350, 'mm') : 
      { min: 35, max: 350, unit: 'mm' }
    );
  
  const motorPower: ParameterRange = productData.motorPower?.min !== undefined ? 
    productData.motorPower : 
    (productData.motorPower?.zh ? 
      parseRangeFromText(productData.motorPower.zh, 30, 280, 'kW') : 
      { min: 30, max: 280, unit: 'kW' }
    );
  
  // 准备特性数据
  const features = productData.features?.zh?.map((feature: string, index: number) => ({
    zh: feature,
    en: productData.features.en[index]
  })) || [];
  
  // 准备应用领域数据
  const applications = productData.applications ? 
    Array.isArray(productData.applications.zh) ? 
    {
      items: productData.applications.zh.map((app: string, index: number) => ({
        icon: '',
        title: { 
          zh: app.split('：')[0] || app, 
          en: productData.applications.en[index].split(':')[0] || productData.applications.en[index] 
        },
        description: { 
          zh: app.split('：')[1] || '', 
          en: productData.applications.en[index].split(':')[1] || '' 
        }
      }))
    } : 
    {
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
        basePath: `/products/stationary-crushers`,
        items: [],
        visibleCards: 0
      };
    }
    
    try {
      // 创建产品名称映射
      const productNameMap: Record<string, { zh: string, en: string }> = {
        'jaw-crusher': { zh: '颚式破碎机', en: 'Jaw Crusher' },
        'impact-crusher': { zh: '反击式破碎机', en: 'Impact Crusher' },
        'hammer-crusher': { zh: '锤式破碎机', en: 'Hammer Crusher' },
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
        image: `/images/products/crushers/${id}.png`
      }));
      
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/stationary-crushers`,
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
        basePath: `/products/stationary-crushers`,
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
        label: { zh: "固定式破碎机", en: "Stationary crushers" },
        href: `/products/stationary-crushers`
      },
      {
        label: { zh: "圆锥破碎机", en: "Cone Crusher" }
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
      imagePath={'/images/products/crushers/cone-crusher.png'}
      overview={productData.overview}
      capacity={capacity}
      maxFeedSize={maxFeedSize}
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
      extraParameters={{ 
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
      }}
      breadcrumb={breadcrumb}
    />
  );
} 