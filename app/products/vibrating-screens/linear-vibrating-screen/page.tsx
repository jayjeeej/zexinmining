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

export default function LinearVibratingScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/linear-vibrating-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['ya-circular-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'linear-vibrating-screen',
            model: 'ZK',
            series: {
              zh: '直线振动筛',
              en: 'Linear Vibrating Screen'
            },
            capacity: {
              min: 20,
              max: 280,
              unit: 'm³/h'
            },
            motorPower: {
              min: 2.2,
              max: 7.5,
              unit: 'kW'
            },
            screenSize: {
              min: 3.0,
              max: 12.0,
              unit: 'm²'
            },
            aperture: {
              min: 0.5,
              max: 50,
              unit: 'mm'
            },
            overview: {
              zh: '直线振动筛采用双轴激振器驱动，实现直线运动轨迹，特别适合精细筛分和脱水作业。筛面面积3.0-12.0m²，处理能力50-300m³/h，适用于0.5-50mm细粒度物料。具有筛分精度高、分层效果好、处理量大等优点，是矿山、煤炭、化工和建材行业的理想选择。',
              en: 'Linear Vibrating Screen employs dual-shaft exciter drive to achieve linear motion trajectory, especially suitable for fine screening and dewatering operations. With screen area of 3.0-12.0m², processing capacity of 50-300m³/h, suitable for 0.5-50mm fine-grained materials. Featuring high screening accuracy, excellent stratification effect, and large processing capacity, it is an ideal choice for mining, coal, chemical, and construction material industries.'
            },
            features: [
              {
                zh: '直线运动轨迹设计：物料在筛面上呈直线运动，分层效果好，提高筛分精度和效率',
                en: 'Linear Motion Trajectory Design: Materials move in a linear pattern on the screen surface, providing better stratification, improving screening accuracy and efficiency'
              },
              {
                zh: '双轴激振器驱动：运行平稳可靠，振动幅度可调，适应不同物料特性',
                en: 'Dual-shaft Vibrator Drive: Stable and reliable operation, adjustable vibration amplitude, adaptable to different material characteristics'
              },
              {
                zh: '模块化筛网系统：便于快速拆装和更换，减少维护时间，提高生产效率',
                en: 'Modular Screen System: Easy quick disassembly and replacement, reducing maintenance time, improving production efficiency'
              },
              {
                zh: '高强度焊接筛框：采用优质合金钢材制造，抗变形能力强，使用寿命长',
                en: 'High-strength Welded Screen Frame: Manufactured with high-quality alloy steel, strong resistance to deformation, long service life'
              },
              {
                zh: '弹簧减震装置：有效降低振动传递，减少噪声，改善设备运行环境',
                en: 'Spring Damping Device: Effectively reduces vibration transmission, decreases noise, improves equipment operating environment'
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
                  description: { zh: '矿物精细筛分和分级，提高产品纯度和后续选矿效率', en: 'Mineral fine screening and classification, improving product purity and subsequent beneficiation efficiency' }
                },
                {
                  title: { zh: '建材行业', en: 'Construction Materials' },
                  description: { zh: '砂石精细分级和脱水，提高成品砂石质量和规格稳定性', en: 'Sand and gravel fine classification and dewatering, improving finished product quality and specification stability' }
                },
                {
                  title: { zh: '煤炭工业', en: 'Coal Industry' },
                  description: { zh: '煤炭精细筛分和脱泥脱水，提高煤炭品质和热值', en: 'Coal fine screening, de-sludging and dewatering, improving coal quality and calorific value' }
                },
                {
                  title: { zh: '化工行业', en: 'Chemical Industry' },
                  description: { zh: '化工原料和产品的精确分级，保证生产工艺和产品质量', en: 'Precise classification of chemical raw materials and products, ensuring production process and product quality' }
                }
              ]
            },
            relatedProducts: ['ya-circular-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen']
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

  //
  const relatedProducts = getRelatedProducts(productData, 'linear-vibrating-screen', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 50, max: 300, unit: 'm³/h' };
  const aperture = productData.aperture || { min: 0.5, max: 50, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 3, max: 15, unit: 'kW' };
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
        description: { zh: '矿物精细筛分和分级，提高产品纯度和后续选矿效率', en: 'Mineral fine screening and classification, improving product purity and subsequent beneficiation efficiency' }
      },
      {
        title: { zh: '建材行业', en: 'Construction Materials' },
        description: { zh: '砂石精细分级和脱水，提高成品砂石质量和规格稳定性', en: 'Sand and gravel fine classification and dewatering, improving finished product quality and specification stability' }
      },
      {
        title: { zh: '煤炭工业', en: 'Coal Industry' },
        description: { zh: '煤炭精细筛分和脱泥脱水，提高煤炭品质和热值', en: 'Coal fine screening, de-sludging and dewatering, improving coal quality and calorific value' }
      },
      {
        title: { zh: '化工行业', en: 'Chemical Industry' },
        description: { zh: '化工原料和产品的精确分级，保证生产工艺和产品质量', en: 'Precise classification of chemical raw materials and products, ensuring production process and product quality' }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/linear-vibrating-screen.png',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    aperture: aperture,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    extraParameters: { productType: 'screen' },
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
          label: { zh: "直线振动筛", en: "Linear Vibrating Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 