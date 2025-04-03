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

export default function BarVibratingScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/bar-vibrating-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'drum-screen', 'vibrating-screen'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'bar-vibrating-screen',
            model: 'DGS',
            series: {
              zh: '棒条筛',
              en: 'Bar Vibrating Screen'
            },
            capacity: {
              min: 50,
              max: 350,
              unit: 'm³/h'
            },
            motorPower: {
              min: 7.5,
              max: 22,
              unit: 'kW'
            },
            screenSize: {
              min: 5.0,
              max: 18.0,
              unit: 'm²'
            },
            aperture: {
              min: 10,
              max: 150,
              unit: 'mm'
            },
            overview: {
              zh: '棒条振动筛采用平行钢棒代替传统筛网，特别适合筛分粘湿物料和大粒径物料。筛面面积5.0-18.0m²，处理能力60-380m³/h，适用于10-150mm物料。钢棒设计有效防止堵塞，同时提供自清洁功能，显著提高连续工作能力，是采石场、煤矿和破碎生产线的理想初筛设备。',
              en: 'Bar Vibrating Screen uses parallel steel bars instead of traditional screen mesh, particularly suitable for screening sticky, wet materials and large-sized materials. With screen area of 5.0-18.0m², processing capacity of 60-380m³/h, suitable for 10-150mm materials. The steel bar design effectively prevents clogging while providing self-cleaning function, significantly improving continuous working capability, making it an ideal primary screening equipment for quarries, coal mines, and crushing production lines.'
            },
            features: [
              {
                zh: '棒条筛网结构：采用高耐磨钢棒代替传统筛网，有效防止粘湿物料堵塞，延长使用寿命',
                en: 'Bar Screen Structure: Uses high wear-resistant steel bars instead of traditional screen mesh, effectively preventing sticky and wet material clogging, extending service life'
              },
              {
                zh: '自清洁振动机制：钢棒之间的间隙在振动中可自动调整，实现自清洁功能，减少维护需求',
                en: 'Self-cleaning Vibration Mechanism: Gaps between steel bars automatically adjust during vibration, achieving self-cleaning function, reducing maintenance requirements'
              },
              {
                zh: '大间隙设计：适合筛分大块物料和高湿度条件，处理能力强，不易堵塞',
                en: 'Large Gap Design: Suitable for screening large materials and high humidity conditions, strong processing capacity, not easily clogged'
              },
              {
                zh: '高耐磨钢材制造：筛条采用高锰钢或耐磨合金钢制造，使用寿命长，抗冲击性能好',
                en: 'High Wear-resistant Steel Construction: Screen bars made of high manganese steel or wear-resistant alloy steel, long service life, good impact resistance'
              },
              {
                zh: '模块化更换系统：筛条可单独更换，维护简便，降低运营成本',
                en: 'Modular Replacement System: Screen bars can be replaced individually, easy maintenance, lower operating costs'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  title: { zh: '采石行业', en: 'Quarrying Industry' },
                  description: { zh: '大块石料的初级筛分，去除粉土和细小杂质', en: 'Primary screening of large stones, removing soil and fine impurities' }
                },
                {
                  title: { zh: '煤炭工业', en: 'Coal Industry' },
                  description: { zh: '湿煤和粘性煤的筛分及脱泥处理，提高煤炭质量', en: 'Screening and de-sludging treatment of wet and sticky coal, improving coal quality' }
                },
                {
                  title: { zh: '破碎生产线', en: 'Crushing Production Line' },
                  description: { zh: '破碎前的预筛和破碎后的成品分级，提高生产效率', en: 'Pre-screening before crushing and finished product classification after crushing, improving production efficiency' }
                },
                {
                  title: { zh: '废物回收', en: 'Waste Recycling' },
                  description: { zh: '建筑废料和城市垃圾的分选，实现资源再利用', en: 'Sorting of construction waste and urban garbage, enabling resource reuse' }
                }
              ]
            },
            relatedProducts: ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'drum-screen', 'vibrating-screen']
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
  const relatedProducts = getRelatedProducts(productData, 'bar-vibrating-screen', productNameMap);
  
  // 准备首屏参数范围数据
  const capacity = productData.capacity || { min: 60, max: 380, unit: 'm³/h' };
  const screenSize = productData.screenSize || { min: 5.0, max: 18.0, unit: 'm²' };
  const aperture = productData.aperture || { min: 10, max: 150, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 11, max: 37, unit: 'kW' };
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
        title: { zh: '采石行业', en: 'Quarrying Industry' },
        description: { zh: '大块石料的初级筛分，去除粉土和细小杂质', en: 'Primary screening of large stones, removing soil and fine impurities' }
      },
      {
        title: { zh: '煤炭工业', en: 'Coal Industry' },
        description: { zh: '湿煤和粘性煤的筛分及脱泥处理，提高煤炭质量', en: 'Screening and de-sludging treatment of wet and sticky coal, improving coal quality' }
      },
      {
        title: { zh: '破碎生产线', en: 'Crushing Production Line' },
        description: { zh: '破碎前的预筛和破碎后的成品分级，提高生产效率', en: 'Pre-screening before crushing and finished product classification after crushing, improving production efficiency' }
      },
      {
        title: { zh: '废物回收', en: 'Waste Recycling' },
        description: { zh: '建筑废料和城市垃圾的分选，实现资源再利用', en: 'Sorting of construction waste and urban garbage, enabling resource reuse' }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/bar-vibrating-screen.jpg',
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
          label: { zh: "棒条筛", en: "Bar Vibrating Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 