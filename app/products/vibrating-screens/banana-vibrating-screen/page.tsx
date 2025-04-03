'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import {
  normalizeFeatures,
  normalizeSpecifications,
  getRelatedProducts,
  productNameMap,
  getStandardizedTableColumns
} from '@/app/utils/productUtils';

export default function BananaVibratingScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/banana-vibrating-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'banana-vibrating-screen',
            model: 'BF',
            series: {
              zh: '香蕉筛',
              en: 'Banana Vibrating Screen'
            },
            capacity: {
              min: 60,
              max: 600,
              unit: 'm³/h'
            },
            motorPower: {
              min: 11,
              max: 45,
              unit: 'kW'
            },
            screenSize: {
              min: 6.5,
              max: 25.0,
              unit: 'm²'
            },
            aperture: {
              min: 5,
              max: 100,
              unit: 'mm'
            },
            overview: {
              zh: '香蕉振动筛采用多段变角度筛面设计，筛面自上而下角度逐渐减小，形似香蕉曲线，显著提高大处理量条件下的筛分效率。筛面面积6.5-25.0m²，处理能力80-450m³/h，适用于5-100mm物料。特别适用于高含水量物料的脱水和大产能要求的选矿生产线，是矿山、砂石厂和煤炭行业的理想筛分设备。',
              en: 'Banana Vibrating Screen features a multi-stage variable angle screen design with gradually decreasing angles from top to bottom, resembling a banana curve, significantly improving screening efficiency under high throughput conditions. With screen area of 6.5-25.0m², processing capacity of 80-450m³/h, suitable for 5-100mm materials. Particularly suitable for dewatering of high moisture content materials and mineral processing production lines with large capacity requirements, making it an ideal screening equipment for mining, sand and gravel plants, and the coal industry.'
            },
            features: [
              {
                zh: '香蕉曲线筛面设计：筛面角度自上而下由25°逐渐减小至0°，使物料在不同区域获得最佳筛分效果',
                en: 'Banana Curve Screen Design: Screen angle gradually decreases from 25° to 0° from top to bottom, allowing materials to achieve optimal screening effect in different regions'
              },
              {
                zh: '大倾角进料区设计：提高物料分层速度，快速排除细粒物料，避免筛面堵塞',
                en: 'Large-angle Feed Zone Design: Improves material stratification speed, quickly discharges fine particles, prevents screen surface clogging'
              },
              {
                zh: '高强度多层筛网结构：可同时完成多级分级作业，提高生产效率，节省设备投资',
                en: 'High-strength Multi-layer Screen Structure: Capable of completing multi-stage classification operations simultaneously, improving production efficiency, saving equipment investment'
              },
              {
                zh: '优化激振系统：确保各级筛面获得均匀振动，提高筛分效率和设备使用寿命',
                en: 'Optimized Vibration System: Ensures uniform vibration for each screen level, improves screening efficiency and equipment service life'
              },
              {
                zh: '防堵塞筛网设计：特殊处理的筛网表面防止粘性物料堵塞，提高连续工作能力',
                en: 'Anti-clogging Screen Design: Specially treated screen surface prevents adhesive material clogging, improves continuous working capability'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  title: { zh: '矿山选矿', en: 'Mineral Processing' },
                  description: { zh: '大型矿山的物料分级和脱水，提高选矿效率和品位', en: 'Material classification and dewatering in large mines, improving mineral processing efficiency and grade' }
                },
                {
                  title: { zh: '砂石骨料', en: 'Sand and Gravel Aggregates' },
                  description: { zh: '高产能砂石生产线的多级分级，满足不同粒度需求', en: 'Multi-stage classification in high-capacity sand and gravel production lines, meeting different particle size requirements' }
                },
                {
                  title: { zh: '煤炭洗选', en: 'Coal Washing' },
                  description: { zh: '煤炭的高效分级和脱水，提高煤炭品质和经济价值', en: 'Efficient classification and dewatering of coal, improving coal quality and economic value' }
                },
                {
                  title: { zh: '冶金工业', en: 'Metallurgical Industry' },
                  description: { zh: '冶金原料的预处理分级，提高冶炼品质和能源效率', en: 'Pre-treatment classification of metallurgical raw materials, improving smelting quality and energy efficiency' }
                }
              ]
            },
            relatedProducts: ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen']
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

  // 使用工具函数标准化规格数据
  const specifications = normalizeSpecifications(productData.specifications);
  
  // 如果需要使用标准表头格式
  if (specifications && (!specifications.columns || specifications.columns.length === 0)) {
    specifications.columns = getStandardizedTableColumns('screen');
  }

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'banana-vibrating-screen', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 60, max: 600, unit: 'm³/h' };
  const screenSize = productData.screenSize || { min: 6.5, max: 25.0, unit: 'm²' };
  const aperture = productData.aperture || { min: 5, max: 100, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 11, max: 45, unit: 'kW' };
  if (productData.specifications && productData.specifications.data && productData.specifications.data.length > 0) {
    const powerValues = productData.specifications.data
      .map((item: { power: string | number }) => {
        const powerStr = String(item.power);
        // 处理类似"2x5.5"或"2×5.5"格式的功率值
        if (powerStr.includes('x') || powerStr.includes('×')) {
          const parts = powerStr.split(/x|×/);
          if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const singlePower = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(singlePower)) {
              return num * singlePower; // 总功率 = 电机数量 × 单个电机功率
            }
          }
        }
        return parseFloat(powerStr);
      })
      .filter((val: number) => !isNaN(val));
    
    if (powerValues.length > 0) {
      const minPower = Math.min(...powerValues);
      const maxPower = Math.max(...powerValues);
      motorPower = { min: minPower, max: maxPower, unit: 'kW' };
    }
  }
  
  // 确保应用领域数据完整
  const applications = {
    title: productData.applications?.title || { zh: "应用领域", en: "Application Areas" },
    items: productData.applications?.items || [
      {
        title: { zh: '矿山选矿', en: 'Mineral Processing' },
        description: { zh: '大型矿山的物料分级和脱水，提高选矿效率和品位', en: 'Material classification and dewatering in large mines, improving mineral processing efficiency and grade' }
      },
      {
        title: { zh: '砂石骨料', en: 'Sand and Gravel Aggregates' },
        description: { zh: '高产能砂石生产线的多级分级，满足不同粒度需求', en: 'Multi-stage classification in high-capacity sand and gravel production lines, meeting different particle size requirements' }
      },
      {
        title: { zh: '煤炭洗选', en: 'Coal Washing' },
        description: { zh: '煤炭的高效分级和脱水，提高煤炭品质和经济价值', en: 'Efficient classification and dewatering of coal, improving coal quality and economic value' }
      },
      {
        title: { zh: '冶金工业', en: 'Metallurgical Industry' },
        description: { zh: '冶金原料的预处理分级，提高冶炼品质和能源效率', en: 'Pre-treatment classification of metallurgical raw materials, improving smelting quality and energy efficiency' }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/banana-vibrating-screen.jpg',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    screenSize: screenSize,
    aperture: aperture,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    extraParameters: { 
      productType: 'screen',
      // 提供硬编码的顶部参数，确保它们与产品卡片保持一致
      topParameters: [
        {
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: capacity,
          unit: "m³/h"
        },
        {
          label: { zh: "电机功率", en: "Motor Power" },
          value: motorPower,
          unit: "kW"
        },
        {
          label: { zh: "筛孔尺寸", en: "Aperture Size" },
          value: aperture,
          unit: "mm"
        }
      ]
    },
    breadcrumb: {
      items: [
        {
          label: { zh: "产品中心", en: "Products" },
          href: `/products`
        },
        {
          label: { zh: "固定式振动筛", en: "Stationary Vibrating Screens" },
          href: `/products/vibrating-screens`
        },
        {
          label: { zh: "香蕉筛", en: "Banana Vibrating Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 