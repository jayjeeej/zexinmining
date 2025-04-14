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

export default function DoubleSpiralClassifierPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/double-spiral-classifier.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['high-weir-spiral-classifier', 'spiral-classifier', 'hydrocyclone'];
          }
          
          // 确保有parameters数组，用于首屏显示
          if (!data.parameters || !Array.isArray(data.parameters)) {
            data.parameters = [
              {
                id: 'spiralDiameter',
                name: { zh: '螺旋直径', en: 'Spiral Diameter' },
                value: data.spiralDiameter ? `${data.spiralDiameter.min}-${data.spiralDiameter.max} ${data.spiralDiameter.unit || 'mm'}` : '1200-2400 mm'
              },
              {
                id: 'rotationSpeed',
                name: { zh: '转速', en: 'Rotation Speed' },
                value: data.rotationSpeed ? `${data.rotationSpeed.min}-${data.rotationSpeed.max} ${data.rotationSpeed.unit || 'r/min'}` : '2.5-8 r/min'
              },
              {
                id: 'spiralLength',
                name: { zh: '螺旋长度', en: 'Spiral Length' },
                value: data.spiralLength ? `${data.spiralLength.min}-${data.spiralLength.max} ${data.spiralLength.unit || 'mm'}` : '8400-14130 mm'
              },
              {
                id: 'sandReturnCapacity',
                name: { zh: '返砂能力', en: 'Sand Return Capacity' },
                value: data.sandReturnCapacity ? `${data.sandReturnCapacity.min}-${data.sandReturnCapacity.max} ${data.sandReturnCapacity.unit || 't/d'}` : '1770-13700 t/d'
              },
              {
                id: 'overflowCapacity',
                name: { zh: '溢流能力', en: 'Overflow Capacity' },
                value: data.overflowCapacity ? `${data.overflowCapacity.min}-${data.overflowCapacity.max} ${data.overflowCapacity.unit || 't/d'}` : '240-910 t/d'
              },
              {
                id: 'motorPower',
                name: { zh: '电机功率', en: 'Motor Power' },
                value: data.motorPower ? `${data.motorPower.min}-${data.motorPower.max} ${data.motorPower.unit || 'kW'}` : '7.5-37 kW'
              }
            ];
          }
          
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'double-spiral-classifier',
            model: '2FLC系列',
            series: {
              zh: '双螺旋分级机',
              en: 'Double Spiral Classifier'
            },
            parameters: [
              {
                id: 'spiralDiameter',
                name: { zh: '螺旋直径', en: 'Spiral Diameter' },
                value: '1200-2400 mm'
              },
              {
                id: 'rotationSpeed',
                name: { zh: '转速', en: 'Rotation Speed' },
                value: '2.5-8 r/min'
              },
              {
                id: 'spiralLength',
                name: { zh: '螺旋长度', en: 'Spiral Length' },
                value: '8400-14130 mm'
              },
              {
                id: 'sandReturnCapacity',
                name: { zh: '返砂能力', en: 'Sand Return Capacity' },
                value: '1770-13700 t/d'
              },
              {
                id: 'overflowCapacity',
                name: { zh: '溢流能力', en: 'Overflow Capacity' },
                value: '240-910 t/d'
              },
              {
                id: 'motorPower',
                name: { zh: '电机功率', en: 'Motor Power' },
                value: '7.5-37 kW'
              }
            ],
            sandReturnCapacity: { 
              min: 1770, 
              max: 13700, 
              unit: 't/d' 
            },
            overflowCapacity: { 
              min: 240, 
              max: 910, 
              unit: 't/d' 
            },
            motorPower: { 
              min: 7.5, 
              max: 37, 
              unit: 'kW' 
            },
            rotationSpeed: { 
              min: 2.5, 
              max: 8, 
              unit: 'r/min' 
            },
            spiralDiameter: { 
              min: 1200, 
              max: 2400, 
              unit: 'mm' 
            },
            spiralLength: { 
              min: 8400, 
              max: 14130, 
              unit: 'mm' 
            },
            overview: {
              zh: '双螺旋分级机（2FLC系列）是一种高效的矿物分级设备，配备双螺旋结构，适用于处理大容量矿石。该设备能够有效地将细粒物料与粗粒物料分离，适用于金属和非金属矿山的选矿流程。设备由两组螺旋装置、共用槽体、传动装置、提升机构和溢流装置组成，处理能力远超单螺旋分级机。',
              en: 'The Double Spiral Classifier (2FLC Series) is a high-efficiency mineral classification equipment with a dual spiral structure, suitable for processing large volumes of ore. This equipment effectively separates fine particles from coarse materials, applicable to the mineral processing of metal and non-metal mines. The device consists of two spiral assemblies, a shared tank, transmission device, lifting mechanism, and overflow device, with processing capacity significantly higher than single spiral classifiers.'
            },
            features: [
              {
                zh: '双螺旋结构设计，处理能力比单螺旋分级机提高40-80%',
                en: 'Dual spiral structure design, processing capacity 40-80% higher than single spiral classifiers'
              },
              {
                zh: '螺旋叶片采用耐磨材质制造，使用寿命长',
                en: 'Spiral blades made of wear-resistant materials for long service life'
              },
              {
                zh: '分级效果精确，产品粒度可控',
                en: 'Precise classification effect with controllable product particle size'
              }
            ],
            relatedProducts: ['high-weir-spiral-classifier', 'spiral-classifier', 'hydrocyclone']
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

  // 根据数据格式化规格表格
  const specifications = {
    title: {
      zh: "技术参数",
      en: "Technical Specifications"
    },
    columns: [
      { key: "model", title: { zh: "型号", en: "Model" } },
      { key: "rotationSpeed", title: { zh: "螺旋转速", en: "Rotation Speed" }, unit: "r/min" },
      { key: "sandReturnCapacity", title: { zh: "返砂处理能力", en: "Sand Return Capacity" }, unit: "t/d" },
      { key: "overflowCapacity", title: { zh: "溢流处理能力", en: "Overflow Capacity" }, unit: "t/d" },
      { key: "spiralDiameter", title: { zh: "螺旋直径", en: "Spiral Diameter" }, unit: "mm" },
      { key: "spiralLength", title: { zh: "螺旋长度", en: "Spiral Length" }, unit: "mm" },
      { key: "motorModel", title: { zh: "传动电机型号", en: "Motor Model" } },
      { key: "motorPower", title: { zh: "传动电机功率", en: "Motor Power" }, unit: "kW" }
    ],
    data: productData.specifications || [],
    notes: [
      {
        content: {
          zh: "可根据客户需求定制不同规格型号",
          en: "Different specifications can be customized according to customer requirements"
        }
      }
    ]
  };

  // 标准化产品特点数据
  const features = normalizeFeatures(productData.features);

  // 只使用分级设备作为相关产品
  if (!productData.relatedProducts || !Array.isArray(productData.relatedProducts) || productData.relatedProducts.length === 0) {
    productData.relatedProducts = ['high-weir-spiral-classifier', 'spiral-classifier', 'hydrocyclone'];
  } else {
    // 过滤只保留分级机产品
    productData.relatedProducts = productData.relatedProducts.filter((id: string) => 
      id.includes('classifier') || 
      id.includes('hydrocyclone') || 
      (productNameMap[id] && (
        productNameMap[id].zh.includes('分级') || 
        productNameMap[id].en.includes('Classifier')
      ))
    );
    
    // 如果过滤后为空，添加默认分级机产品
    if (productData.relatedProducts.length === 0) {
      productData.relatedProducts = ['high-weir-spiral-classifier', 'spiral-classifier'];
    }
  }

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'double-spiral-classifier', productNameMap);
  
  // 处理应用领域数据
  let applications;
  
  if (productData.applications) {
    // 检查是否为包含zh和en数组的格式
    if (Array.isArray(productData.applications.zh)) {
      applications = {
        title: { zh: "应用领域", en: "Application Areas" },
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
    // 检查是否为数组格式
    else if (Array.isArray(productData.applications)) {
      applications = {
        title: { zh: "应用领域", en: "Application Areas" },
        items: productData.applications.map((app: any) => ({
          icon: app.icon || '',
          title: app.title || { zh: '', en: '' },
          description: app.description || { zh: '', en: '' }
        }))
      };
    }
    // 已经是标准格式
    else if (productData.applications.items) {
      applications = productData.applications;
    }
  }
  
  // 如果没有应用领域数据，使用默认值
  if (!applications) {
    applications = {
      title: { zh: "应用领域", en: "Application Areas" },
      items: [
        {
          icon: '⛏️',
          title: { zh: '大型矿山选矿', en: 'Large-scale Mining' },
          description: { zh: '用于处理大量矿石的分级作业，处理能力是单螺旋分级机的1.8-2倍', en: 'Used for large-capacity ore classification operations, with 1.8-2 times the processing capacity of single spiral classifiers' }
        },
        {
          icon: '💎',
          title: { zh: '细粒物料分级', en: 'Fine Particle Classification' },
          description: { zh: '双螺旋结构提供更加精确的分级效果，适合对细粒物料的精确分级', en: 'Double spiral structure provides more precise classification effect, suitable for accurate classification of fine particles' }
        },
        {
          icon: '🧱',
          title: { zh: '砂石生产线', en: 'Sand and Gravel Production Line' },
          description: { zh: '在大型砂石骨料生产线中用于物料的洗选和分级', en: 'Used for material washing and classification in large sand and gravel aggregate production lines' }
        }
      ]
    };
  }
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: {
      zh: productData.nameZh || '沉没式螺旋分级机',
      en: productData.nameEn || 'Submerged Spiral Classifier'
    },
    imagePath: '/images/products/classification-equipment/double-spiral-classifier.png',
    overview: productData.overview,
    // 分级机特有参数
    sandReturnCapacity: productData.sandReturnCapacity,
    overflowCapacity: productData.overflowCapacity,
    motorPower: productData.motorPower,
    // 添加额外参数
    extraParameters: {
      rotationSpeed: productData.rotationSpeed,
      spiralDiameter: productData.spiralDiameter,
      spiralLength: productData.spiralLength
    },
    specifications: specifications,
    features: features,
    applications: applications,
    relatedProducts: relatedProducts,
    breadcrumb: {
      items: [
        {
          label: { zh: "产品中心", en: "Products" },
          href: `/products`
        },
        {
          label: { zh: "分级设备", en: "Classification Equipment" },
          href: `/products/classification-equipment`
        },
        {
          label: { zh: "沉没式螺旋分级机", en: "Submerged Spiral Classifier" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} productData={productData} />
  );
} 