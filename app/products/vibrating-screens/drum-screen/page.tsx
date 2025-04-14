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

export default function DrumScreenPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/drum-screen.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'vibrating-screen'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'drum-screen',
            model: 'GT',
            series: {
              zh: '无轴滚筒筛',
              en: 'Shaftless Drum Screen'
            },
            capacity: {
              min: 30,
              max: 240,
              unit: 'm³/h'
            },
            motorPower: {
              min: 3,
              max: 11,
              unit: 'kW'
            },
            screenSize: {
              min: 11.3,
              max: 37.7,
              unit: 'm²'
            },
            aperture: {
              min: 10,
              max: 100,
              unit: 'mm'
            },
            overview: {
              zh: '滚筒筛是一种简单高效的回转式筛分设备，通过滚筒的缓慢旋转实现物料筛分和输送。筛面面积3.5-14.0m²，处理能力30-200m³/h，适用于10-120mm物料。结构简单、运行可靠、能耗低，特别适合含水率高和易堵塞物料的筛分，广泛应用于矿山、建材、电力和环保行业的初筛和分级。',
              en: 'Drum Screen is a simple and efficient rotary screening equipment that achieves material screening and conveying through the slow rotation of the drum. With screen area of 3.5-14.0m², processing capacity of 30-200m³/h, suitable for 10-120mm materials. Its simple structure, reliable operation, and low energy consumption make it particularly suitable for screening materials with high moisture content and those prone to clogging, widely used in primary screening and classification in mining, construction materials, power, and environmental protection industries.'
            },
            features: [
              {
                zh: '简单可靠的旋转筛分机构：结构简单，运行稳定，维护方便，长时间连续工作能力强',
                en: 'Simple and Reliable Rotating Screening Mechanism: Simple structure, stable operation, easy maintenance, strong capability for long-term continuous operation'
              },
              {
                zh: '倾斜式安装设计：物料在筛筒内自然前进，提高筛分效率，增加处理能力',
                en: 'Inclined Installation Design: Materials naturally advance inside the screening drum, improving screening efficiency and increasing processing capacity'
              },
              {
                zh: '防堵塞筛网结构：采用特殊设计的旋转运动，有效防止物料堵塞筛孔',
                en: 'Anti-clogging Screen Structure: Uses specially designed rotary motion to effectively prevent material clogging of screen holes'
              },
              {
                zh: '多种衬板可选：根据不同物料特性可选配橡胶、聚氨酯或钢质衬板，延长使用寿命',
                en: 'Multiple Liner Options: Rubber, polyurethane, or steel liners can be selected according to different material characteristics, extending service life'
              },
              {
                zh: '低能耗设计：缓慢旋转机构能耗低，运行成本低，经济效益高',
                en: 'Low Energy Consumption Design: Slow rotation mechanism consumes less energy, low operating costs, high economic benefits'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  title: { zh: '矿山开采', en: 'Mining' },
                  description: { zh: '原矿预筛分和分级，去除废石和泥土，提高选矿效率', en: 'Pre-screening and classification of raw ore, removing waste rock and soil, improving mineral processing efficiency' }
                },
                {
                  title: { zh: '砂石行业', en: 'Sand and Gravel Industry' },
                  description: { zh: '砂石分选和去除杂质，提高成品砂石品质', en: 'Sand and gravel sorting and impurity removal, improving finished product quality' }
                },
                {
                  title: { zh: '电力行业', en: 'Power Industry' },
                  description: { zh: '煤炭筛分和脱粉，提高燃烧效率，减少污染排放', en: 'Coal screening and dust removal, improving combustion efficiency, reducing pollution emissions' }
                },
                {
                  title: { zh: '环保行业', en: 'Environmental Protection Industry' },
                  description: { zh: '城市生活垃圾和工业固废筛分，促进资源回收利用', en: 'Screening of municipal solid waste and industrial solid waste, promoting resource recycling and utilization' }
                }
              ]
            },
            relatedProducts: ['ya-circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'bar-vibrating-screen', 'vibrating-screen']
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
  const relatedProducts = getRelatedProducts(productData, 'drum-screen', productNameMap);
  
  // 准备首屏参数范围数据
  // 从规格表中获取处理能力的实际范围
  let capacity = productData.capacity || { min: 30, max: 200, unit: 'm³/h' };
  if (productData.specifications && productData.specifications.data && productData.specifications.data.length > 0) {
    const capacityValues = productData.specifications.data
      .map((item: { capacity: string | number }) => {
        const capacityStr = String(item.capacity);
        if (capacityStr.includes('-')) {
          const parts = capacityStr.split('-');
          if (parts.length === 2) {
            // 只取范围的最大值用于计算整体范围
            return parseFloat(parts[1]);
          }
        }
        return parseFloat(capacityStr);
      })
      .filter((val: number) => !isNaN(val));
    
    if (capacityValues.length > 0) {
      const minCapacity = Math.min(...capacityValues.map((v: number) => v * 0.5)); // 使用最小范围值的一半作为下限
      const maxCapacity = Math.max(...capacityValues);
      capacity = { min: minCapacity, max: maxCapacity, unit: 'm³/h' };
    }
  }

  // 计算筛网尺寸 (筒体直径 × 筒体长度的面积)
  let screenSize = productData.screenSize || { min: 3.5, max: 14.0, unit: 'm²' };
  if (productData.specifications && productData.specifications.data && productData.specifications.data.length > 0) {
    const sizeValues = productData.specifications.data
      .map((item: { diameter: string | number, length: string | number }) => {
        const diameter = parseFloat(String(item.diameter));
        const length = parseFloat(String(item.length));
        if (!isNaN(diameter) && !isNaN(length)) {
          // 计算筒体表面积（近似）：π × 直径 × 长度
          return Math.PI * diameter * length;
        }
        return NaN;
      })
      .filter((val: number) => !isNaN(val));
    
    if (sizeValues.length > 0) {
      const minSize = Math.min(...sizeValues);
      const maxSize = Math.max(...sizeValues);
      screenSize = { 
        min: parseFloat(minSize.toFixed(1)), 
        max: parseFloat(maxSize.toFixed(1)), 
        unit: 'm²' 
      };
    }
  }

  const aperture = productData.aperture || { min: 10, max: 120, unit: 'mm' };
  
  // 从规格表中获取电机功率的实际范围
  let motorPower = productData.motorPower || { min: 4, max: 18.5, unit: 'kW' };
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
        title: { zh: '矿山开采', en: 'Mining' },
        description: { zh: '原矿预筛分和分级，去除废石和泥土，提高选矿效率', en: 'Pre-screening and classification of raw ore, removing waste rock and soil, improving mineral processing efficiency' }
      },
      {
        title: { zh: '砂石行业', en: 'Sand and Gravel Industry' },
        description: { zh: '砂石分选和去除杂质，提高成品砂石品质', en: 'Sand and gravel sorting and impurity removal, improving finished product quality' }
      },
      {
        title: { zh: '电力行业', en: 'Power Industry' },
        description: { zh: '煤炭筛分和脱粉，提高燃烧效率，减少污染排放', en: 'Coal screening and dust removal, improving combustion efficiency, reducing pollution emissions' }
      },
      {
        title: { zh: '环保行业', en: 'Environmental Protection Industry' },
        description: { zh: '城市生活垃圾和工业固废筛分，促进资源回收利用', en: 'Screening of municipal solid waste and industrial solid waste, promoting resource recycling and utilization' }
      }
    ]
  };
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series,
    imagePath: productData.imagePath || '/images/products/screens/drum-screen.png',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    aperture: screenSize,
    screenSize: aperture,
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
          label: { zh: "滚筒筛", en: "Drum Screen" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} />
  );
} 