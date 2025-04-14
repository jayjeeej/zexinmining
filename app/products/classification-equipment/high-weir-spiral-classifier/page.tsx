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

export default function HighWeirSpiralClassifierPage() {
  const { language, isZh } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  
  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch('/data/products/high-weir-spiral-classifier.json');
        
        if (response.ok) {
          const data = await response.json();
          // 确保data中有relatedProducts数据
          if (!data.relatedProducts || !Array.isArray(data.relatedProducts) || data.relatedProducts.length === 0) {
            data.relatedProducts = ['spiral-classifier', 'hydrocyclone', 'wet-grid-ball-mill'];
          }
          
          // 确保有parameters数组，用于首屏显示
          if (!data.parameters || !Array.isArray(data.parameters)) {
            data.parameters = [
              {
                id: 'spiralDiameter',
                name: { zh: '螺旋直径', en: 'Spiral Diameter' },
                value: data.spiralDiameter ? `${data.spiralDiameter.min}-${data.spiralDiameter.max} ${data.spiralDiameter.unit || 'mm'}` : '300-3000 mm'
              },
              {
                id: 'rotationSpeed',
                name: { zh: '转速', en: 'Rotation Speed' },
                value: data.rotationSpeed ? `${data.rotationSpeed.min}-${data.rotationSpeed.max} ${data.rotationSpeed.unit || 'r/min'}` : '2.5-8 r/min'
              },
              {
                id: 'spiralLength',
                name: { zh: '螺旋长度', en: 'Spiral Length' },
                value: data.spiralLength ? `${data.spiralLength.min}-${data.spiralLength.max} ${data.spiralLength.unit || 'mm'}` : '3900-12500 mm'
              },
              {
                id: 'sandReturnCapacity',
                name: { zh: '返砂能力', en: 'Sand Return Capacity' },
                value: data.sandReturnCapacity ? `${data.sandReturnCapacity.min}-${data.sandReturnCapacity.max} ${data.sandReturnCapacity.unit || 't/d'}` : '30-11625 t/d'
              },
              {
                id: 'overflowCapacity',
                name: { zh: '溢流能力', en: 'Overflow Capacity' },
                value: data.overflowCapacity ? `${data.overflowCapacity.min}-${data.overflowCapacity.max} ${data.overflowCapacity.unit || 't/d'}` : '10-890 t/d'
              },
              {
                id: 'motorPower',
                name: { zh: '电机功率', en: 'Motor Power' },
                value: data.motorPower ? `${data.motorPower.min}-${data.motorPower.max} ${data.motorPower.unit || 'kW'}` : '2.2-30 kW'
              }
            ];
          }
          
          setProductData(data);
        } else {
          console.error('Failed to load product data');
          // 硬编码备份数据
          setProductData({
            id: 'high-weir-spiral-classifier',
            model: 'FLG系列',
            series: {
              zh: '高堰式单螺旋分级机',
              en: 'High Weir Spiral Classifier'
            },
            parameters: [
              {
                id: 'spiralDiameter',
                name: { zh: '螺旋直径', en: 'Spiral Diameter' },
                value: '300-3000 mm'
              },
              {
                id: 'rotationSpeed',
                name: { zh: '转速', en: 'Rotation Speed' },
                value: '2.5-8 r/min'
              },
              {
                id: 'spiralLength',
                name: { zh: '螺旋长度', en: 'Spiral Length' },
                value: '3900-12500 mm'
              },
              {
                id: 'sandReturnCapacity',
                name: { zh: '返砂能力', en: 'Sand Return Capacity' },
                value: '30-11625 t/d'
              },
              {
                id: 'overflowCapacity',
                name: { zh: '溢流能力', en: 'Overflow Capacity' },
                value: '10-890 t/d'
              },
              {
                id: 'motorPower',
                name: { zh: '电机功率', en: 'Motor Power' },
                value: '2.2-30 kW'
              }
            ],
            sandReturnCapacity: { 
              min: 30, 
              max: 11625, 
              unit: 't/d' 
            },
            overflowCapacity: { 
              min: 10, 
              max: 890, 
              unit: 't/d' 
            },
            motorPower: { 
              min: 2.2, 
              max: 30, 
              unit: 'kW' 
            },
            rotationSpeed: { 
              min: 2.5, 
              max: 8, 
              unit: 'r/min' 
            },
            spiralDiameter: { 
              min: 300, 
              max: 3000, 
              unit: 'mm' 
            },
            spiralLength: { 
              min: 3900, 
              max: 12500, 
              unit: 'mm' 
            },
            overview: {
              zh: '高堰式单螺旋分级机是一种常用的矿物分级设备，适用于金属和非金属矿山的选矿流程。该设备由螺旋装置、槽体、传动装置、提升机构和溢流装置组成。高堰式结构设计保证了更高的池容量，提高了分级效率，特别适合处理细粒物料。',
              en: 'The high weir spiral classifier is a commonly used mineral classification equipment, suitable for the mineral processing of metal and non-metal mines. The device consists of a spiral assembly, tank, transmission device, lifting mechanism, and overflow device. The high weir structure design ensures a higher pool capacity, improves classification efficiency, and is particularly suitable for processing fine-grained materials.'
            },
            features: [
              {
                zh: '高堰式设计，提供更大的池容量，适合处理细粒物料',
                en: 'High weir design provides larger pool capacity, suitable for processing fine-grained materials'
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
            relatedProducts: ['spiral-classifier', 'hydrocyclone', 'wet-grid-ball-mill']
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
      { key: "rotationSpeed", title: { zh: "转速", en: "Rotation Speed" }, unit: "r/min" },
      { key: "sandReturnCapacity", title: { zh: "返砂能力", en: "Sand Return Capacity" }, unit: "t/d" },
      { key: "overflowCapacity", title: { zh: "溢流能力", en: "Overflow Capacity" }, unit: "t/d" },
      { key: "spiralDiameter", title: { zh: "螺旋直径", en: "Spiral Diameter" }, unit: "mm" },
      { key: "spiralLength", title: { zh: "螺旋长度", en: "Spiral Length" }, unit: "mm" },
      { key: "motorModel", title: { zh: "电机型号", en: "Motor Model" } },
      { key: "motorPower", title: { zh: "电机功率", en: "Motor Power" }, unit: "kW" }
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
    productData.relatedProducts = ['spiral-classifier', 'hydrocyclone'];
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
      productData.relatedProducts = ['spiral-classifier'];
    }
  }

  // 获取相关产品数据
  const relatedProducts = getRelatedProducts(productData, 'high-weir-spiral-classifier', productNameMap);
  
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
          title: { zh: '黑色金属矿选矿', en: 'Ferrous Metal Ore Processing' },
          description: { zh: '用于铁矿、锰矿等黑色金属矿石的分级处理', en: 'Used for classification of iron ore, manganese ore and other ferrous metal ores' }
        },
        {
          icon: '💎',
          title: { zh: '有色金属矿选矿', en: 'Non-ferrous Metal Ore Processing' },
          description: { zh: '适用于铜矿、铅锌矿等有色金属矿石的分级', en: 'Suitable for classification of copper ore, lead-zinc ore and other non-ferrous metal ores' }
        },
        {
          icon: '🧱',
          title: { zh: '非金属矿加工', en: 'Non-metallic Mineral Processing' },
          description: { zh: '在非金属矿物如磷矿、石英砂等加工中进行分级', en: 'For classification in non-metallic mineral processing such as phosphate ore and quartz sand' }
        }
      ]
    };
  }
  
  // 准备产品详情组件所需的数据结构
  const productProps = {
    productId: productData.id,
    model: productData.model,
    series: {
      zh: productData.nameZh || '高堰式单螺旋分级机',
      en: productData.nameEn || 'High Weir Spiral Classifier'
    },
    imagePath: '/images/products/classification-equipment/high-weir-spiral-classifier.png',
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
          label: { zh: "高堰式单螺旋分级机", en: "High Weir Spiral Classifier" }
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate {...productProps} productData={productData} />
  );
} 