'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import {
  normalizeFeatures,
  normalizeSpecifications,
  getRelatedProducts,
  productNameMap
} from '@/app/utils/productUtils';

export default function DrumWasherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/drum-washer.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['spiral-washer', 'double-spiral-washer'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'drum-washer',
            model: 'GT系列',
            series: {
              zh: '滚筒洗矿机',
              en: 'Drum Washer'
            },
            capacity: {
              min: 30,
              max: 200,
              unit: 't/h'
            },
            motorPower: {
              min: 7.5,
              max: 45,
              unit: 'kW'
            },
            overview: {
              zh: '滚筒洗矿机（GT系列）是一种高效的矿石洗选设备，适用于处理各种含泥量高的矿石。该设备主要由电机、减速机、滚筒、支撑轮、喷水装置和排料装置组成。物料通过进料口进入旋转的滚筒中，在滚筒旋转过程中，物料不断翻滚并与水充分接触，实现泥土与矿石的分离。该设备处理量大、洗矿效率高、结构简单、操作方便。',
              en: 'The Drum Washer (GT Series) is a high-efficiency ore washing equipment suitable for processing various ores with high mud content. The equipment mainly consists of motor, reducer, drum, support wheels, water spraying device and discharge device. Materials enter the rotating drum through the feed inlet. As the drum rotates, the material continuously tumbles and contacts with water fully, achieving separation of mud and ore. This equipment features large processing capacity, high washing efficiency, simple structure, and easy operation.'
            },
            features: [
              {
                zh: '滚筒内设螺旋叶片和提升条，增强物料翻动效果',
                en: 'Spiral blades and lifting bars inside the drum enhance material tumbling effect'
              },
              {
                zh: '滚筒倾角可调，便于适应不同物料的洗选要求',
                en: 'Adjustable drum inclination to adapt to washing requirements of different materials'
              },
              {
                zh: '内衬采用耐磨橡胶或耐磨钢材，延长使用寿命',
                en: 'Lining made of wear-resistant rubber or steel to extend service life'
              },
              {
                zh: '配备高压喷水装置，增强洗矿效果',
                en: 'Equipped with high-pressure water spray device to enhance washing effect'
              },
              {
                zh: '驱动系统采用优质减速机，运行稳定可靠',
                en: 'Drive system uses high-quality reducer for stable and reliable operation'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '⛏️',
                  title: { zh: '金属矿洗选', en: 'Metal Ore Washing' },
                  description: { zh: '适用于铁矿、铜矿、锰矿等金属矿石的洗选，特别是含泥量高的矿石', en: 'Suitable for washing iron ore, copper ore, manganese ore and other metal ores, especially ores with high mud content' }
                },
                {
                  icon: '🏗️',
                  title: { zh: '砂石料加工', en: 'Sand and Gravel Processing' },
                  description: { zh: '在砂石骨料生产线中用于清洗建筑用砂石料，提高产品质量', en: 'Used in sand and gravel aggregate production lines to clean construction sand and gravel materials to improve product quality' }
                },
                {
                  icon: '🧪',
                  title: { zh: '煤炭洗选', en: 'Coal Washing' },
                  description: { zh: '适用于各类煤炭的洗选加工，去除煤炭中的杂质和泥土', en: 'Suitable for washing and processing various types of coal, removing impurities and soil from coal' }
                },
                {
                  icon: '♻️',
                  title: { zh: '建筑垃圾处理', en: 'Construction Waste Treatment' },
                  description: { zh: '可用于建筑垃圾资源化处理过程中的物料洗选', en: 'Can be used for material washing in the resource utilization process of construction waste' }
                }
              ]
            },
            relatedProducts: ['spiral-washer', 'double-spiral-washer']
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

  // 使用工具函数标准化规格数据 - 转换成表格格式
  const specifications = (() => {
    // 判断是否已标准化
    if (productData.specifications && productData.specifications.title && productData.specifications.columns) {
      return normalizeSpecifications(productData.specifications);
    }
    
    // 处理数组格式的规格数据
    if (Array.isArray(productData.specifications)) {
      // 从规格数据中找出所有可能的列
      const allKeys = new Set<string>();
      productData.specifications.forEach((spec: any) => {
        Object.keys(spec).forEach(key => allKeys.add(key));
      });
      
      // 定义列的显示顺序和标题
      const columnOrder: Record<string, {zh: string, en: string, unit?: string}> = {
        'model': {zh: '型号', en: 'Model'},
        'capacity': {zh: '处理能力', en: 'Processing Capacity', unit: 't/h'},
        'motorPower': {zh: '电机功率', en: 'Motor Power', unit: 'kW'},
        'drumDiameter': {zh: '滚筒直径', en: 'Drum Diameter', unit: 'mm'},
        'drumLength': {zh: '滚筒长度', en: 'Drum Length', unit: 'mm'},
        'rotationSpeed': {zh: '转速', en: 'Rotation Speed', unit: 'r/min'},
        'weight': {zh: '重量', en: 'Weight', unit: 'kg'}
      };
      
      // 创建列定义
      const columns = Array.from(allKeys)
        .filter(key => key in columnOrder) // 只保留已定义的列
        .sort((a, b) => {
          // 确保model列总是第一列
          if (a === 'model') return -1;
          if (b === 'model') return 1;
          
          // 其他列按照它们在columnOrder中的顺序排序
          const keysOrder = Object.keys(columnOrder);
          return keysOrder.indexOf(a) - keysOrder.indexOf(b);
        })
        .map(key => ({
          key,
          title: {
            zh: columnOrder[key]?.zh || key,
            en: columnOrder[key]?.en || key
          },
          unit: columnOrder[key]?.unit
        }));
      
      return {
        title: { zh: "技术参数", en: "Technical Specifications" },
        columns,
        data: productData.specifications,
        notes: [
          {
            content: {
              zh: "可按照客户需求进行定制",
              en: "Can be customized according to customer requirements"
            }
          }
        ]
      };
    }
    
    return null;
  })();

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'drum-washer', productNameMap);
  
  // 从表格中提取参数范围数据
  let extractedCapacity: any = null;
  let extractedMotorPower: any = null;
  let extractedDrumDiameter: any = null;
  
  // 处理规格表，从中提取关键参数
  if (Array.isArray(productData.specifications)) {
    // 从规格表中提取处理能力参数
    extractedCapacity = {
      min: Math.min(...productData.specifications.map((item: {capacity: string | number}) => {
        if (typeof item.capacity === 'string' && item.capacity.includes('-')) {
          return parseFloat(item.capacity.split('-')[0]);
        }
        return parseFloat(String(item.capacity));
      })),
      max: Math.max(...productData.specifications.map((item: {capacity: string | number}) => {
        if (typeof item.capacity === 'string' && item.capacity.includes('-')) {
          return parseFloat(item.capacity.split('-')[1]);
        }
        return parseFloat(String(item.capacity));
      })),
      unit: 't/h'
    };
    
    // 从规格表中提取电机功率参数
    extractedMotorPower = {
      min: Math.min(...productData.specifications.map((item: {motorPower: string | number}) => parseFloat(String(item.motorPower)))),
      max: Math.max(...productData.specifications.map((item: {motorPower: string | number}) => parseFloat(String(item.motorPower)))),
      unit: 'kW'
    };
    
    // 从规格表中提取滚筒直径参数
    extractedDrumDiameter = {
      min: Math.min(...productData.specifications.map((item: {drumDiameter: string | number}) => parseFloat(String(item.drumDiameter)))),
      max: Math.max(...productData.specifications.map((item: {drumDiameter: string | number}) => parseFloat(String(item.drumDiameter)))),
      unit: 'mm'
    };
  }
  
  // 准备参数数组以支持首屏显示
  if (!productData.parameters || !Array.isArray(productData.parameters)) {
    productData.parameters = [
      {
        id: 'capacity',
        name: { zh: '处理能力', en: 'Processing Capacity' },
        value: extractedCapacity ? `${extractedCapacity.min}-${extractedCapacity.max} ${extractedCapacity.unit || 't/h'}` : '30-200 t/h'
      },
      {
        id: 'drumDiameter',
        name: { zh: '滚筒直径', en: 'Drum Diameter' },
        value: extractedDrumDiameter ? `${extractedDrumDiameter.min}-${extractedDrumDiameter.max} ${extractedDrumDiameter.unit || 'mm'}` : '1500-3000 mm'
      },
      {
        id: 'motorPower',
        name: { zh: '电机功率', en: 'Motor Power' },
        value: extractedMotorPower ? `${extractedMotorPower.min}-${extractedMotorPower.max} ${extractedMotorPower.unit || 'kW'}` : '7.5-45 kW'
      }
    ];
  }
  
  // 准备首屏参数范围数据，优先使用JSON中的值，其次使用表格提取值，最后使用默认值
  const capacity = productData.capacity || extractedCapacity || { min: 30, max: 200, unit: 't/h' };
  const motorPower = productData.motorPower || extractedMotorPower || { min: 7.5, max: 45, unit: 'kW' };
  let drumDiameter = productData.drumDiameter || extractedDrumDiameter || { min: 1500, max: 3000, unit: 'mm' };
  const width = productData.width;
  const length = productData.length;
  const height = productData.height;
  
  // 添加额外检查，确保drumDiameter一定有值
  if (!drumDiameter) {
    drumDiameter = { min: 1500, max: 3000, unit: 'mm' };
  }
  
  // 确保应用领域数据完整
  let applications;
  
  if (productData.applications) {
    // 检查是否为数组格式
    if (Array.isArray(productData.applications)) {
      applications = {
        title: { zh: "应用领域", en: "Application Areas" },
        items: productData.applications.map((app: any) => ({
          icon: app.icon || '',
          title: app.title || { zh: '', en: '' },
          description: app.description || { zh: '', en: '' }
        }))
      };
    } 
    // 检查是否为包含zh和en数组的新格式
    else if (Array.isArray(productData.applications.zh)) {
      applications = {
        title: productData.applications.title || { zh: "应用领域", en: "Application Areas" },
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
      };
    }
    // 已经是标准格式（包含title和items）
    else if (productData.applications.items) {
      applications = productData.applications;
    }
  }
  
  // 如果没有有效的应用领域数据，使用默认值
  if (!applications) {
    applications = {
      title: { zh: "应用领域", en: "Application Areas" },
      items: [
        {
          icon: '⛏️',
          title: { zh: '金属矿洗选', en: 'Metal Ore Washing' },
          description: { zh: '适用于铁矿、铜矿、锰矿等金属矿石的洗选，特别是含泥量高的矿石', en: 'Suitable for washing iron ore, copper ore, manganese ore and other metal ores, especially ores with high mud content' }
        },
        {
          icon: '🏗️',
          title: { zh: '砂石料加工', en: 'Sand and Gravel Processing' },
          description: { zh: '在砂石骨料生产线中用于清洗建筑用砂石料，提高产品质量', en: 'Used in sand and gravel aggregate production lines to clean construction sand and gravel materials to improve product quality' }
        }
      ]
    };
  }
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series || {
      zh: productData.nameZh || '滚筒洗矿机',
      en: productData.nameEn || 'Drum Washer'
    },
    imagePath: '/images/products/washers/drum-washer.jpg',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    drumDiameter: drumDiameter,
    width: width,
    length: length,
    height: height,
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    extraParameters: { productType: 'washer' },
    breadcrumb: {
      items: [
        {
          label: { zh: "产品中心", en: "Products" },
          href: "/products"
        },
        {
          label: { zh: "洗矿设备", en: "Washing Equipment" },
          href: "/products/washing-equipment"
        },
        {
          label: { zh: "滚筒洗矿机", en: "Drum Washer" }
        }
      ]
    },
    productData: productData
  };

  return <ProductDetailTemplate {...productProps} />;
} 