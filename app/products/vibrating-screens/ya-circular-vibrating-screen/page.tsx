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

export default function YaCircularVibratingScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/ya-circular-vibrating-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['linear-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'ya-circular-vibrating-screen',
            model: 'YA',
            series: {
              zh: 'YA圆振动筛',
              en: 'YA Circular Vibrating Screen'
            },
            capacity: {
              min: 60,
              max: 350,
              unit: 'm³/h'
            },
            motorPower: {
              min: 11,
              max: 37,
              unit: 'kW'
            },
            screenSize: {
              min: 4.2,
              max: 14.4,
              unit: 'm²'
            },
            aperture: {
              min: 5,
              max: 100,
              unit: 'mm'
            },
            overview: {
              zh: 'YA圆振动筛是矿山行业标准筛分设备，采用双电机偏心驱动，产生圆形振动轨迹。筛面面积4.2-14.4m²，处理能力60-350m³/h，筛分粒度范围5-100mm。设计合理的激振系统与高强度筛箱结构确保了设备的高效率和长寿命，广泛应用于采矿、冶金、建材等行业的物料分级生产线。',
              en: 'YA Circular Vibrating Screen is a standard screening equipment in the mining industry, utilizing dual-motor eccentric drive to produce circular vibration trajectory. With screen area of 4.2-14.4m², processing capacity of 60-350m³/h, and screening range of 5-100mm, its well-designed excitation system and high-strength screen box ensure high efficiency and long service life. Widely used in material classification production lines in mining, metallurgy, and construction industries.'
            },
            features: [
              {
                zh: '双电机激振系统：产生稳定的圆形运动轨迹，提高筛分效率和处理能力',
                en: 'Dual-motor Excitation System: Generates stable circular motion trajectory, improving screening efficiency and processing capacity'
              },
              {
                zh: '大倾角筛面设计：优化物料流动路径，防止堵塞，提高筛分效率',
                en: 'Large-angle Screen Surface Design: Optimizes material flow path, prevents clogging, and improves screening efficiency'
              },
              {
                zh: '模块化筛网结构：便于维护和更换，减少停机时间，降低运维成本',
                en: 'Modular Screen Mesh Structure: Facilitates maintenance and replacement, reduces downtime, and lowers operating costs'
              },
              {
                zh: '高强度筛箱结构：采用优质钢材制造，抗疲劳性能好，使用寿命长',
                en: 'High-strength Screen Box: Made of high-quality steel, excellent fatigue resistance, long service life'
              },
              {
                zh: '优化弹簧减震系统：有效降低噪声和振动，改善工作环境，延长设备寿命',
                en: 'Optimized Spring Damping System: Effectively reduces noise and vibration, improves working environment, extends equipment life'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  title: { zh: '矿山行业', en: 'Mining Industry' },
                  description: { zh: '各类矿石的精细分级和分选，提高后续工艺处理效率', en: 'Fine grading and sorting of various ores, improving efficiency of subsequent processes' }
                },
                {
                  title: { zh: '建材行业', en: 'Construction Materials' },
                  description: { zh: '砂石骨料的规格分级，满足不同强度混凝土生产需求', en: 'Specification grading of sand and gravel aggregates to meet production requirements of different strength concrete' }
                },
                {
                  title: { zh: '冶金行业', en: 'Metallurgical Industry' },
                  description: { zh: '冶金原料的预处理筛分，去除杂质，提高冶炼质量', en: 'Pre-treatment screening of metallurgical materials, removing impurities, improving smelting quality' }
                },
                {
                  title: { zh: '煤炭行业', en: 'Coal Industry' },
                  description: { zh: '煤炭的分级与脱泥，提高燃烧效率，减少环境污染', en: 'Coal grading and de-sludging, improving combustion efficiency, reducing environmental pollution' }
                }
              ]
            },
            relatedProducts: ['linear-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen']
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
  const relatedProducts = getRelatedProducts(productData, 'ya-circular-vibrating-screen', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 60, max: 350, unit: 'm³/h' };
  const screenSize = productData.screenSize || { min: 4.2, max: 14.4, unit: 'm²' };
  const aperture = productData.aperture || { min: 5, max: 100, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 7.5, max: 22, unit: 'kW' };
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
        title: { zh: '矿山行业', en: 'Mining Industry' },
        description: { zh: '各类矿石的精细分级和分选，提高后续工艺处理效率', en: 'Fine grading and sorting of various ores, improving efficiency of subsequent processes' }
      },
      {
        title: { zh: '建材行业', en: 'Construction Materials' },
        description: { zh: '砂石骨料的规格分级，满足不同强度混凝土生产需求', en: 'Specification grading of sand and gravel aggregates to meet production requirements of different strength concrete' }
      },
      {
        title: { zh: '冶金行业', en: 'Metallurgical Industry' },
        description: { zh: '冶金原料的预处理筛分，去除杂质，提高冶炼质量', en: 'Pre-treatment screening of metallurgical materials, removing impurities, improving smelting quality' }
      },
      {
        title: { zh: '煤炭行业', en: 'Coal Industry' },
        description: { zh: '煤炭的分级与脱泥，提高燃烧效率，减少环境污染', en: 'Coal grading and de-sludging, improving combustion efficiency, reducing environmental pollution' }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/ya-circular-vibrating-screen.png',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    aperture: aperture,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    // 确保第一屏显示处理能力、电机功率和筛孔尺寸
    extraParameters: { 
      productType: 'screen',
      // 强制指定显示哪些参数以及顺序
      topParameters: [
        {
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: capacity,
          unit: capacity?.unit || "m³/h"
        },
        {
          label: { zh: "电机功率", en: "Motor Power" },
          value: motorPower,
          unit: motorPower?.unit || "kW"
        },
        {
          label: { zh: "筛孔尺寸", en: "Aperture Size" },
          value: aperture,
          unit: aperture?.unit || "mm"
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
          label: { zh: "YA圆振动筛", en: "YA Circular Vibrating Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 