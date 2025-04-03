'use client';

import { useEffect, useState } from 'react';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { getFormattedProductData, getMagneticSeparatorParams } from '@/app/utils/productUtils';

export default function ThreeDiscBeltMagneticSeparatorPage() {
  const { language, isZh } = useLanguage();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const productId = "three-disc-belt-magnetic-separator";

  useEffect(() => {
    async function loadProductData() {
      try {
        const response = await fetch(`/data/products/${productId}.json`);
        if (response.ok) {
          const data = await response.json();
          setProductData(data);
        } else {
          console.error(`Failed to load product data: ${response.status}`);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p>Product data not available.</p>
        </div>
      </div>
    );
  }

  // 转换数据结构以符合ProductDetailTemplate的要求
  const formattedData = getFormattedProductData(productData, productId, 'magnetic-separation');
  
  if (!formattedData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p>Failed to format product data.</p>
        </div>
      </div>
    );
  }

  // 从规格表中获取最新参数数据
  const getLatestParamFromTable = () => {
    if (!productData.specifications || !productData.specifications.tableData) {
      return {
        capacity: processRangeValue(productData.capacity),
        motorPower: processRangeValue(productData.motorPower),
        ...(productData.magneticFieldStrength ? { magneticFieldStrength: processRangeValue(productData.magneticFieldStrength) } : {})
      };
    }

    // 找到处理量列、功率列和磁场强度列的索引
    const headers = productData.specifications.tableHeaders;
    let capacityIndex = -1;
    let powerIndex = -1;
    let magneticFieldStrengthIndex = -1;
    
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].zh === '处理量' || headers[i].zh === '处理能力' || headers[i].zh.includes('处理')) capacityIndex = i;
      if (headers[i].zh === '功率' || headers[i].zh === '电机功率' || headers[i].zh.includes('功率') || headers[i].zh.includes('电机')) powerIndex = i;
      if (headers[i].zh === '磁场强度' || headers[i].zh.includes('磁场') || headers[i].zh.includes('磁感应强度')) magneticFieldStrengthIndex = i;
    }

    // 从表格中提取最小和最大值
    const capacityValues = productData.specifications.tableData.map((row: any[]) => row[capacityIndex]);
    const powerValues = productData.specifications.tableData.map((row: any[]) => row[powerIndex]);
    
    // 处理能力范围
    const capacityRanges = capacityValues.map((val: string) => {
      if (typeof val === 'string' && val.includes('-')) {
        const [min, max] = val.split('-').map(v => parseFloat(v.trim()));
        return [min, max];
      }
      return [parseFloat(val), parseFloat(val)];
    }).flat().filter((v: number) => !isNaN(v));
    
    // 功率范围
    const powerRanges = powerValues.map((val: string) => {
      if (typeof val === 'string' && val.includes('-')) {
        const [min, max] = val.split('-').map(v => parseFloat(v.trim()));
        return [min, max];
      }
      return [parseFloat(val), parseFloat(val)];
    }).flat().filter((v: number) => !isNaN(v));
    
    const result: any = {
      capacity: capacityRanges.length > 0 ? {
        min: Math.min(...capacityRanges),
        max: Math.max(...capacityRanges),
        unit: 'kg/h'
      } : processRangeValue(productData.capacity),
      
      motorPower: powerRanges.length > 0 ? {
        min: Math.min(...powerRanges),
        max: Math.max(...powerRanges),
        unit: 'kW'
      } : processRangeValue(productData.motorPower)
    };
    
    // 如果技术参数表中有磁场强度列，则处理磁场强度数据
    if (magneticFieldStrengthIndex !== -1) {
      const magneticFieldStrengthValues = productData.specifications.tableData.map((row: any[]) => row[magneticFieldStrengthIndex]);
      const magneticFieldStrengthRanges = magneticFieldStrengthValues.map((val: string) => {
        if (typeof val === 'string' && val.includes('-')) {
          const [min, max] = val.split('-').map(v => parseFloat(v.trim()));
          return [min, max];
        } else if (typeof val === 'string' && val.includes('≥')) {
          const minValue = parseFloat(val.replace('≥', ''));
          return [minValue, minValue * 2];
        }
        return [parseFloat(val), parseFloat(val)];
      }).flat().filter((v: number) => !isNaN(v));
      
      if (magneticFieldStrengthRanges.length > 0) {
        result.magneticFieldStrength = {
          min: Math.min(...magneticFieldStrengthRanges),
          max: Math.max(...magneticFieldStrengthRanges),
          unit: 'mt'
        };
      } else if (productData.magneticFieldStrength) {
        result.magneticFieldStrength = processRangeValue(productData.magneticFieldStrength);
      }
    } else if (productData.magneticFieldStrength) {
      // 如果技术参数表中没有磁场强度列，但顶层参数中有，则使用顶层参数
      result.magneticFieldStrength = processRangeValue(productData.magneticFieldStrength);
    }
    
    return result;
  };
  
  // 获取最新参数
  const latestParams = getLatestParamFromTable();
  
  // 处理规格表数据
  const specifications = formatSpecifications(productData.specifications);
  
  // 轮播相关产品处理
  const relatedProducts = getRelatedProducts();

  // 准备ProductDetailTemplate的props
  const templateProps: any = {
    productId: productId,
    model: formattedData.model,
    series: formattedData.series,
    imagePath: formattedData.imagePath,
    overview: formattedData.overview,
    specifications: specifications,
    features: formattedData.features,
    applications: formattedData.applications,
    relatedProducts: relatedProducts,
    breadcrumb: formattedData.breadcrumb,
    productData: {
      productId: productId,
      ...getMagneticSeparatorParams(productId)
    }
  };

  return <ProductDetailTemplate {...templateProps} />;
  
  // 相关产品数据处理
  function getRelatedProducts() {
    if (!productData.relatedProducts || !Array.isArray(productData.relatedProducts)) {
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/magnetic-separation`,
        items: [],
        visibleCards: 0
      };
    }
    
    try {
      // 创建产品名称映射
      const productNameMap: Record<string, { zh: string, en: string }> = {
        'permanent-magnetic-drum-separator': { zh: '永磁筒式磁选机', en: 'Permanent Magnetic Drum Separator' },
        'double-roller-permanent-magnetic-zircon-separator': { zh: '双辊永磁锆英磁选机', en: 'Double Roller Permanent Magnetic Zircon Separator' },
        'four-roller-variable-frequency-electrostatic-separator': { zh: '四辊变频高压静电选机', en: 'Four-Roller Variable Frequency High-Voltage Electrostatic Separator' },
        'plate-type-high-intensity-wet-magnetic-separator': { zh: '平板式高强度湿式磁选机', en: 'Plate-type High Intensity Wet Magnetic Separator' },
        'roller-type-high-intensity-wet-magnetic-separator': { zh: '辊式高强度湿式磁选机', en: 'Roller-type High Intensity Wet Magnetic Separator' }
      };
      
      // 映射相关产品列表
      const relatedItems = productData.relatedProducts.map((id: string) => ({
        id,
        series: productNameMap[id] || { 
          zh: id.includes('magnetic') ? '磁选机' : '磁选设备',
          en: id.includes('magnetic') ? 'Magnetic Separator' : 'Magnetic Separation Equipment'
        },
        image: `/images/products/magnetic-separation/${id}.jpg`
      }));
      
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/magnetic-separation`,
        items: relatedItems,
        visibleCards: 3
      };
    } catch (error) {
      console.error('Error processing related products:', error);
      return {
        title: {
          zh: "相关产品",
          en: "Related Products"
        },
        basePath: `/products/magnetic-separation`,
        items: [],
        visibleCards: 0
      };
    }
  }
}

// 格式化规格数据
function formatSpecifications(specs: any) {
  if (!specs) return undefined;
  
  // 准备规格列
  const columns = specs.tableHeaders.map((header: any) => ({
    key: header.en?.toLowerCase().replace(/\s+/g, '_') || header.zh?.toLowerCase().replace(/\s+/g, '_'),
    title: {
      zh: header.zh,
      en: header.en
    },
    unit: header.unit
  })) || [];
  
  // 准备规格数据
  const data = specs.tableData.map((row: any, rowIndex: number) => {
    const rowData: { [key: string]: string | number } = { key: rowIndex.toString() };
    specs.tableHeaders.forEach((header: any, colIndex: number) => {
      const key = header.en?.toLowerCase().replace(/\s+/g, '_') || header.zh?.toLowerCase().replace(/\s+/g, '_');
      rowData[key] = row[colIndex];
    });
    return rowData;
  }) || [];
  
  return {
    title: specs.title || { zh: "技术参数", en: "Technical Specifications" },
    columns: columns,
    data: data,
    notes: specs.note ? [{ content: { zh: specs.note.zh, en: specs.note.en } }] : undefined
  };
}

// 处理范围值的辅助函数
function processRangeValue(value: any): { min: number; max: number; unit: string } | undefined {
  if (!value) return undefined;
  
  // 如果是对象格式包含zh/en
  if (typeof value === 'object' && (value.zh || value.en)) {
    const strValue = (value.zh || value.en || '');
    // 从字符串解析范围值
    if (strValue.includes('-')) {
      // 处理范围格式："15-50 t/h"
      const parts = strValue.split(' ');
      const range = parts[0].split('-');
      const min = parseFloat(range[0]);
      const max = parseFloat(range[1]);
      const unit = parts[1] || '';
      
      return { min, max, unit };
    } else if (strValue.includes('≥')) {
      // 处理最小值格式："≥800 Gs"
      const parts = strValue.split(' ');
      const minValue = parseFloat(parts[0].replace('≥', ''));
      const unit = parts[1] || '';
      
      return { min: minValue, max: minValue * 2, unit };
    }
  }
  
  return undefined;
} 