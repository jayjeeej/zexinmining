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

export default function XDVibratingScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/vibrating-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'vibrating-screen',
            model: 'XD',
            series: {
              zh: 'XD系列振动筛',
              en: 'XD Series Vibrating Screen'
            },
            capacity: {
              min: 50,
              max: 600,
              unit: 'm³/h'
            },
            motorPower: {
              min: 7.5,
              max: 30,
              unit: 'kW'
            },
            screenSize: {
              min: 3.6,
              max: 21.0,
              unit: 'm²'
            },
            aperture: {
              min: 2,
              max: 50,
              unit: 'mm'
            },
            overview: {
              zh: 'XD系列振动筛是一款多功能、高效率的振动筛分设备，采用优化的偏心轴振动机构和高强度筛箱结构。筛面面积3.6-21.0m²，处理能力50-600m³/h，筛分范围2-50mm。适合各种中细粒度物料的筛分和分级，具有筛分效率高、结构紧凑、噪音低等特点，是大型矿山、砂石厂和工业生产线的理想筛分设备。',
              en: 'XD Series Vibrating Screen is a multi-functional, high-efficiency vibrating screening equipment, featuring an optimized eccentric shaft vibration mechanism and high-strength screen box structure. With screen area of 3.6-21.0m², processing capacity of 50-600m³/h, and screening range of 2-50mm. Suitable for screening and classification of various medium and fine-grained materials, characterized by high screening efficiency, compact structure, and low noise, making it an ideal screening equipment for large mines, sand and gravel plants, and industrial production lines.'
            },
            features: [
              {
                zh: '优化偏心轴振动系统：产生高效椭圆运动轨迹，提高筛分效率和精度',
                en: 'Optimized Eccentric Shaft Vibration System: Produces efficient elliptical motion trajectory, improving screening efficiency and precision'
              },
              {
                zh: '分段筛面设计：针对不同粒度物料优化筛分角度，提高处理能力和分级精确度',
                en: 'Segmented Screen Surface Design: Optimizes screening angles for different particle sizes, improving processing capacity and classification accuracy'
              },
              {
                zh: '精密平衡技术：减少振动传递，降低噪音和能耗，延长设备使用寿命',
                en: 'Precision Balance Technology: Reduces vibration transmission, lowers noise and energy consumption, extends equipment service life'
              },
              {
                zh: '模块化筛箱结构：便于维护和快速更换筛网，提高设备利用率',
                en: 'Modular Screen Box Structure: Facilitates maintenance and quick screen replacement, improving equipment utilization rate'
              },
              {
                zh: '防粉尘密封系统：降低粉尘污染，改善工作环境，保护环境',
                en: 'Dust-proof Sealing System: Reduces dust pollution, improves working environment, protects the environment'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  title: { zh: '采矿行业', en: 'Mining Industry' },
                  description: { zh: '多种矿物的精细分级，为后续选矿工艺提供合格进料', en: 'Fine classification of various minerals, providing qualified feed for subsequent beneficiation processes' }
                },
                {
                  title: { zh: '骨料生产', en: 'Aggregate Production' },
                  description: { zh: '精确筛分不同规格的砂石骨料，满足混凝土和沥青混合料生产需求', en: 'Precise screening of various specifications of sand and gravel aggregates, meeting production needs of concrete and asphalt mixtures' }
                },
                {
                  title: { zh: '化工制造', en: 'Chemical Manufacturing' },
                  description: { zh: '化工原料和产品的精细分级，保证产品质量和生产安全', en: 'Fine classification of chemical raw materials and products, ensuring product quality and production safety' }
                },
                {
                  title: { zh: '工业加工', en: 'Industrial Processing' },
                  description: { zh: '各类工业物料的筛分和分级，提高产品质量和生产效率', en: 'Screening and classification of various industrial materials, improving product quality and production efficiency' }
                }
              ]
            },
            relatedProducts: ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen']
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
  const relatedProducts = getRelatedProducts(productData, 'vibrating-screen', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 50, max: 600, unit: 'm³/h' };
  const screenSize = productData.screenSize || { min: 3.6, max: 21.0, unit: 'm²' };
  const aperture = productData.aperture || { min: 2, max: 50, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 15, max: 30, unit: 'kW' };
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
        title: { zh: '采矿行业', en: 'Mining Industry' },
        description: { zh: '多种矿物的精细分级，为后续选矿工艺提供合格进料', en: 'Fine classification of various minerals, providing qualified feed for subsequent beneficiation processes' }
      },
      {
        title: { zh: '骨料生产', en: 'Aggregate Production' },
        description: { zh: '精确筛分不同规格的砂石骨料，满足混凝土和沥青混合料生产需求', en: 'Precise screening of various specifications of sand and gravel aggregates, meeting production needs of concrete and asphalt mixtures' }
      },
      {
        title: { zh: '化工制造', en: 'Chemical Manufacturing' },
        description: { zh: '化工原料和产品的精细分级，保证产品质量和生产安全', en: 'Fine classification of chemical raw materials and products, ensuring product quality and production safety' }
      },
      {
        title: { zh: '工业加工', en: 'Industrial Processing' },
        description: { zh: '各类工业物料的筛分和分级，提高产品质量和生产效率', en: 'Screening and classification of various industrial materials, improving product quality and production efficiency' }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/xd-vibrating-screen.png',
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
          label: { zh: "XD系列振动筛", en: "XD Series Vibrating Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 