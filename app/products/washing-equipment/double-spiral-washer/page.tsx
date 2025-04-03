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

export default function DoubleSpiralWasherPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/double-spiral-washer.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['drum-washer', 'spiral-washer'];
          }
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 使用硬编码数据作为备份
          setProductData({
            id: 'double-spiral-washer',
            model: '2FG系列',
            series: {
              zh: '双螺旋洗矿机',
              en: 'Double Spiral Washer'
            },
            capacity: {
              min: 2340,
              max: 3740,
              unit: 't/d'
            },
            motorPower: {
              min: 15,
              max: 18,
              unit: 'kW'
            },
            overview: {
              zh: '双螺旋洗矿机（2FG系列）是一种高效的矿物洗选设备，采用双螺旋结构设计，具有更大的处理能力和更高的洗选效率。该设备通过两组并列的螺旋叶片同时工作，对物料进行充分的搅拌和洗选，特别适用于大型矿山的洗矿作业。与单螺旋洗矿机相比，双螺旋洗矿机具有处理量大、能耗低、分级效果好等优点。',
              en: 'The Double Spiral Washer (2FG Series) is a high-efficiency mineral washing equipment with a double spiral structure design, offering larger processing capacity and higher washing efficiency. The equipment works through two sets of parallel spiral blades that simultaneously mix and wash materials, particularly suitable for large-scale mining operations. Compared to single spiral washers, double spiral washers feature higher processing capacity, lower energy consumption, and better classification effects.'
            },
            features: [
              {
                zh: '双螺旋设计，处理能力大幅提升',
                en: 'Double spiral design significantly increases processing capacity'
              },
              {
                zh: '两组螺旋叶片同步运行，洗选效果更均匀',
                en: 'Synchronized operation of two spiral blades for more uniform washing effect'
              },
              {
                zh: '坚固的传动系统，确保高负荷运行的稳定性',
                en: 'Robust drive system ensures stability during high-load operation'
              },
              {
                zh: '高耐磨材料制造，延长设备使用寿命',
                en: 'Made of highly wear-resistant materials to extend equipment service life'
              },
              {
                zh: '操作简便，维护成本低',
                en: 'Easy operation and low maintenance cost'
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
                  title: { zh: '大型矿山洗选', en: 'Large-scale Mining Washing' },
                  description: { zh: '特别适用于大型矿山的铁矿、铜矿等矿石的高产量洗选作业', en: 'Particularly suitable for high-capacity washing operations of iron ore, copper ore, etc. in large-scale mines' }
                },
                {
                  icon: '💎',
                  title: { zh: '重矿物洗选', en: 'Heavy Mineral Washing' },
                  description: { zh: '适用于比重较大的矿物的洗选和分级', en: 'Suitable for washing and classification of minerals with higher specific gravity' }
                },
                {
                  icon: '⚒️',
                  title: { zh: '大型煤矿洗选', en: 'Large Coal Mine Washing' },
                  description: { zh: '用于大型煤矿的煤炭洗选和脱泥，处理量大', en: 'Used for large-capacity coal washing and de-mudding in large coal mines' }
                },
                {
                  icon: '🏗️',
                  title: { zh: '砂石骨料生产', en: 'Sand and Gravel Aggregate Production' },
                  description: { zh: '在大型砂石骨料生产线中用于高产量的物料洗选', en: 'Used for high-capacity material washing in large sand and gravel aggregate production lines' }
                }
              ]
            },
            relatedProducts: ['drum-washer', 'spiral-washer']
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
  const relatedProducts = getRelatedProducts(productData, 'double-spiral-washer', productNameMap);
  
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
    
    // 从规格表中提取螺旋直径参数 (如果存在)
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
        value: extractedCapacity ? `${extractedCapacity.min}-${extractedCapacity.max} ${extractedCapacity.unit || 't/h'}` : '15-100 t/h'
      },
      {
        id: 'spiralDiameter',
        name: { zh: '螺旋直径', en: 'Spiral Diameter' },
        value: extractedSpiralDiameter ? `${extractedSpiralDiameter.min}-${extractedSpiralDiameter.max} ${extractedSpiralDiameter.unit || 'mm'}` : '1000-2000 mm'
      },
      {
        id: 'motorPower',
        name: { zh: '电机功率', en: 'Motor Power' },
        value: extractedMotorPower ? `${extractedMotorPower.min}-${extractedMotorPower.max} ${extractedMotorPower.unit || 'kW'}` : '5.5-22 kW'
      }
    ];
  }
  
  // 准备首屏参数范围数据，优先使用JSON中的值，其次使用表格提取值，最后使用默认值
  const capacity = productData.capacity || extractedCapacity || { min: 15, max: 100, unit: 't/h' };
  const motorPower = productData.motorPower || extractedMotorPower || { min: 5.5, max: 22, unit: 'kW' };
  const spiralDiameter = productData.spiralDiameter || extractedSpiralDiameter || { min: 1000, max: 2000, unit: 'mm' };
  const width = productData.width;
  const length = productData.length;
  const height = productData.height;
  
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
          icon: '🔍',
          title: { zh: '大型矿山洗选', en: 'Large-scale Mining Washing' },
          description: { zh: '特别适用于大型矿山的铁矿、铜矿等矿石的高产量洗选作业', en: 'Particularly suitable for high-capacity washing operations of iron ore, copper ore, etc. in large-scale mines' }
        },
        {
          icon: '💎',
          title: { zh: '重矿物洗选', en: 'Heavy Mineral Washing' },
          description: { zh: '适用于比重较大的矿物的洗选和分级', en: 'Suitable for washing and classification of minerals with higher specific gravity' }
        }
      ]
    };
  }
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: productData.series || {
      zh: productData.nameZh || '双螺旋洗矿机',
      en: productData.nameEn || 'Double Spiral Washer'
    },
    imagePath: '/images/products/washers/double-spiral-washer.jpg',
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
          label: { zh: "双螺旋洗矿机", en: "Double Spiral Washer" }
        }
      ]
    },
    productData: productData
  };

  return <ProductDetailTemplate {...productProps} />;
} 