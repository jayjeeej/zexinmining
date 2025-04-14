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

export default function ZKRLinearVibratingScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/zkr-linear-vibrating-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['linear-vibrating-screen', 'ya-circular-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen'];
          }
          
          // 转换applications字段格式
          if (data.applications && (data.applications.zh || data.applications.en)) {
            const zhApps = data.applications.zh || [];
            const enApps = data.applications.en || [];
            const formattedApplications = {
              title: {
                zh: "应用领域",
                en: "Application Areas"
              },
              items: [] as Array<{
                title: {
                  zh: string;
                  en: string;
                };
                description: {
                  zh: string;
                  en: string;
                };
              }>
            };
            
            // 将应用领域字符串数组转换为对象数组
            for (let i = 0; i < Math.max(zhApps.length, enApps.length); i++) {
              if (zhApps[i] || enApps[i]) {
                // 分割字符串：冒号前面是标题，冒号后面是描述
                const zhParts = zhApps[i] ? zhApps[i].split('：') : ['', ''];
                const enParts = enApps[i] ? enApps[i].split(': ') : ['', ''];
                
                formattedApplications.items.push({
                  title: {
                    zh: zhParts[0] || '',
                    en: enParts[0] || ''
                  },
                  description: {
                    zh: zhParts[1] || '',
                    en: enParts[1] || ''
                  }
                });
              }
            }
            
            // 更新applications字段
            data.applications = formattedApplications;
          }
          
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'zkr-linear-vibrating-screen',
            model: 'ZKR1645',
            series: {
              zh: 'ZKR直线振动筛',
              en: 'ZKR Linear Vibrating Screen'
            },
            capacity: {
              min: 30,
              max: 540,
              unit: 'm³/h'
            },
            motorPower: {
              min: 11,
              max: 44,
              unit: 'kW'
            },
            aperture: {
              min: 0.25,
              max: 50,
              unit: 'mm'
            },
            overview: {
              zh: 'ZKR直线振动筛是高效筛分设备，采用双振动电机驱动，筛面积3.6-14.4m²，处理能力5-540m³/h。适用于0.25-50mm物料筛分，振动频率16r/min，广泛应用于矿山、建材和冶金行业。',
              en: 'ZKR Linear Vibrating Screen is a high-efficiency screening equipment featuring dual vibration motors, 3.6-14.4m² screening area, and 5-540m³/h processing capacity. Suitable for 0.25-50mm material screening with 16r/min vibration frequency, widely used in mining, construction materials, and metallurgical industries.'
            },
            features: [
              {
                zh: '直线运动轨迹：物料在筛面上呈直线运动，分层效果好',
                en: 'Linear Motion Trajectory: Material moves in straight line on screen surface, better stratification'
              },
              {
                zh: '双电机驱动系统：振动稳定，物料处理更均匀',
                en: 'Dual Motor Drive System: Stable vibration, more uniform material processing'
              },
              {
                zh: '筛网可选规格多：适应各种物料筛分需求',
                en: 'Multiple Screen Specifications: Adaptable to various material screening requirements'
              },
              {
                zh: '耐磨性好：使用高耐磨材料，延长设备使用寿命',
                en: 'High Wear Resistance: Using high wear-resistant materials, extending equipment service life'
              },
              {
                zh: '维护方便：模块化设计，便于更换筛网和维修',
                en: 'Easy Maintenance: Modular design for convenient screen replacement and repair'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  title: { zh: '矿山', en: 'Mining' },
                  description: { zh: '各类矿石筛分与分级', en: 'Various ore screening and classification' }
                },
                {
                  title: { zh: '建材', en: 'Construction Materials' },
                  description: { zh: '砂石生产线物料筛选', en: 'Sand and stone production line material screening' }
                },
                {
                  title: { zh: '冶金', en: 'Metallurgy' },
                  description: { zh: '原料预处理与成品分级', en: 'Raw material preprocessing and finished product classification' }
                },
                {
                  title: { zh: '化工', en: 'Chemical Industry' },
                  description: { zh: '颗粒物料精细分级', en: 'Fine classification of granular materials' }
                },
                {
                  title: { zh: '煤炭', en: 'Coal' },
                  description: { zh: '煤炭洗选与分级处理', en: 'Coal washing and grading' }
                }
              ]
            },
            relatedProducts: ['linear-vibrating-screen', 'ya-circular-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'drum-screen', 'vibrating-screen']
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

  // 获取相关产品
  const relatedProducts = getRelatedProducts(productData, 'zkr-linear-vibrating-screen', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 30, max: 540, unit: 'm³/h' };
  const aperture = productData.aperture || { min: 0.25, max: 50, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 11, max: 44, unit: 'kW' };
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
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/zkr-linear-vibrating-screen.png',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    aperture: aperture,
    specifications: specifications,
    features: features,
    applications: productData.applications,
    relatedProducts: relatedProducts,
    extraParameters: { 
      productType: 'screen',
      topParameters: [
        {
          key: 'capacity',
          label: { zh: '处理能力', en: 'Processing Capacity' },
          value: capacity,
          unit: 'm³/h'
        },
        {
          key: 'motorPower',
          label: { zh: '电机功率', en: 'Motor Power' },
          value: motorPower,
          unit: 'kW'
        },
        {
          key: 'aperture',
          label: { zh: '筛孔尺寸', en: 'Aperture Size' },
          value: aperture,
          unit: 'mm'
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
          label: { zh: "ZKR直线振动筛", en: "ZKR Linear Vibrating Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 