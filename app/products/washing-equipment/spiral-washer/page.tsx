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

export default function SpiralWasherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/spiral-washer.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['drum-washer', 'double-spiral-washer'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'spiral-washer',
            model: 'FG系列',
            series: {
              zh: '单螺旋洗矿机',
              en: 'Spiral Washer'
            },
            capacity: {
              min: 80,
              max: 1870,
              unit: 't/d'
            },
            motorPower: {
              min: 1.1,
              max: 7.5,
              unit: 'kW'
            },
            overview: {
              zh: '单螺旋洗矿机（FG系列）是一种广泛应用于矿物洗选的设备，采用螺旋结构设计，主要用于对中细粒矿物进行洗选和脱泥。该设备通过螺旋叶片的旋转运动，使浆体中的矿物按密度大小进行分层，密度大的矿物沉于槽底，密度小的矿物随水流流向溢流口。具有结构简单、操作便捷、水耗低等优点。',
              en: 'The Spiral Washer (FG Series) is a widely used mineral washing equipment with a spiral structure design, mainly used for washing and de-mudding medium and fine-grained minerals. Through the rotational movement of the spiral blade, the equipment separates minerals in the slurry according to their density, with higher density minerals settling at the bottom of the tank and lower density minerals flowing with water towards the overflow port. It features simple structure, easy operation, and low water consumption.'
            },
            features: [
              {
                zh: '螺旋叶片采用高耐磨合金钢制造，使用寿命长',
                en: 'Spiral blades made of high wear-resistant alloy steel for long service life'
              },
              {
                zh: '槽体内壁采用可更换的橡胶衬板，减少磨损并延长设备寿命',
                en: 'Replaceable rubber liners on the inner wall of the tank reduce wear and extend equipment life'
              },
              {
                zh: '分级效果好，分级粒度细，处理量大',
                en: 'Good classification effect, fine classification particle size, large processing capacity'
              },
              {
                zh: '水耗低，操作维护简单',
                en: 'Low water consumption, simple operation and maintenance'
              },
              {
                zh: '传动部分采用封闭减速器，运行稳定可靠',
                en: 'Drive part uses enclosed reducer for stable and reliable operation'
              }
            ],
            applications: {
              title: {
                zh: '应用领域',
                en: 'Application Areas'
              },
              items: [
                {
                  icon: '🔍',
                  title: { zh: '黑色金属矿洗选', en: 'Ferrous Metal Ore Washing' },
                  description: { zh: '用于铁矿、锰矿等黑色金属矿石的洗选和脱泥处理', en: 'Used for washing and de-mudding iron ore, manganese ore and other ferrous metal ores' }
                },
                {
                  icon: '💎',
                  title: { zh: '有色金属矿洗选', en: 'Non-ferrous Metal Ore Washing' },
                  description: { zh: '适用于铜矿、铅锌矿等有色金属矿石的洗选', en: 'Suitable for washing copper ore, lead-zinc ore and other non-ferrous metal ores' }
                },
                {
                  icon: '⚒️',
                  title: { zh: '煤炭洗选', en: 'Coal Washing' },
                  description: { zh: '用于煤炭的洗选和脱泥，提高煤炭质量', en: 'Used for washing and de-mudding coal to improve coal quality' }
                },
                {
                  icon: '🏗️',
                  title: { zh: '砂石料加工', en: 'Sand and Gravel Processing' },
                  description: { zh: '在砂石料生产线中用于物料的洗选和分级', en: 'Used for washing and classification of materials in sand and gravel production lines' }
                }
              ]
            },
            relatedProducts: ['drum-washer', 'double-spiral-washer']
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
        'spiralDiameter': {zh: '螺旋直径', en: 'Spiral Diameter', unit: 'mm'},
        'tankLength': {zh: '槽体长度', en: 'Tank Length', unit: 'mm'},
        'tankWidth': {zh: '槽体宽度', en: 'Tank Width', unit: 'mm'},
        'rotationSpeed': {zh: '转速', en: 'Rotation Speed', unit: 'r/min'},
        'totalWeight': {zh: '重量', en: 'Weight', unit: 'kg'}
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
  const relatedProducts = getRelatedProducts(productData, 'spiral-washer', productNameMap);
  
  // 从表格中提取参数范围数据
  let extractedCapacity: any = null;
  let extractedMotorPower: any = null;
  let extractedSpiralDiameter: any = null;
  
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
    
    // 从规格表中提取螺旋直径参数
    if (productData.specifications[0].spiralDiameter) {
      extractedSpiralDiameter = {
        min: Math.min(...productData.specifications.map((item: {spiralDiameter: string | number}) => parseFloat(String(item.spiralDiameter)))),
        max: Math.max(...productData.specifications.map((item: {spiralDiameter: string | number}) => parseFloat(String(item.spiralDiameter)))),
        unit: 'mm'
      };
    }
  }
  
  // 准备参数数组以支持首屏显示
  if (!productData.parameters || !Array.isArray(productData.parameters)) {
    productData.parameters = [
      {
        id: 'capacity',
        name: { zh: '处理能力', en: 'Processing Capacity' },
        value: extractedCapacity ? `${extractedCapacity.min}-${extractedCapacity.max} ${extractedCapacity.unit || 't/h'}` : '10-50 t/h'
      },
      {
        id: 'spiralDiameter',
        name: { zh: '螺旋直径', en: 'Spiral Diameter' },
        value: extractedSpiralDiameter ? `${extractedSpiralDiameter.min}-${extractedSpiralDiameter.max} ${extractedSpiralDiameter.unit || 'mm'}` : '900-1800 mm'
      },
      {
        id: 'motorPower',
        name: { zh: '电机功率', en: 'Motor Power' },
        value: extractedMotorPower ? `${extractedMotorPower.min}-${extractedMotorPower.max} ${extractedMotorPower.unit || 'kW'}` : '3-11 kW'
      }
    ];
  }
  
  // 准备首屏参数范围数据，优先使用JSON中的值，其次使用表格提取值，最后使用默认值
  const capacity = productData.capacity || extractedCapacity || { min: 10, max: 50, unit: 't/h' };
  const motorPower = productData.motorPower || extractedMotorPower || { min: 3, max: 11, unit: 'kW' };
  const spiralDiameter = productData.spiralDiameter || extractedSpiralDiameter || { min: 900, max: 1800, unit: 'mm' };
  const width = productData.width;
  const length = productData.length;
  const height = productData.height;
  
  // 确保应用领域数据完整
  let applications;
  
  if (productData.applications) {
    // 检查是否为新格式（包含zh和en数组）
    if (Array.isArray(productData.applications.zh)) {
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
    // 旧格式处理
    else if (productData.applications.items) {
      applications = {
        title: productData.applications.title,
        items: productData.applications.items.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description
        }))
      };
    }
  }
  
  // 如果没有应用领域数据，使用默认值
  if (!applications) {
    applications = {
      title: { zh: "应用领域", en: "Application Areas" },
      items: [
        {
          icon: '🔍',
          title: { zh: '黑色金属矿洗选', en: 'Ferrous Metal Ore Washing' },
          description: { zh: '用于铁矿、锰矿等黑色金属矿石的洗选和脱泥处理', en: 'Used for washing and de-mudding iron ore, manganese ore and other ferrous metal ores' }
        },
        {
          icon: '💎',
          title: { zh: '有色金属矿洗选', en: 'Non-ferrous Metal Ore Washing' },
          description: { zh: '适用于铜矿、铅锌矿等有色金属矿石的洗选', en: 'Suitable for washing copper ore, lead-zinc ore and other non-ferrous metal ores' }
        }
      ]
    };
  }

  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series || {
      zh: productData.nameZh || '单螺旋洗矿机',
      en: productData.nameEn || 'Spiral Washer'
    },
    imagePath: '/images/products/washers/spiral-washer.jpg',
    overview: productData.overview,
    capacity: capacity,
    motorPower: motorPower,
    spiralDiameter: spiralDiameter,
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
          label: { zh: "单螺旋洗矿机", en: "Spiral Washer" }
        }
      ]
    },
    productData: productData
  };

  return <ProductDetailTemplate {...productProps} />;
} 