'use client';

import { useEffect, useState } from 'react';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { getFormattedProductData, normalizeSpecifications } from '@/app/utils/productUtils';

export default function FourRollerVariableFrequencyElectrostaticSeparatorPage() {
  const { language, isZh } = useLanguage();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const productId = "four-roller-variable-frequency-electrostatic-separator";

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
        ...(productData.voltage ? { voltage: processRangeValue(productData.voltage) } : {})
      };
    }

    // 找到处理量列、功率列和电压列的索引
    const headers = productData.specifications.tableHeaders;
    let capacityIndex = -1;
    let powerIndex = -1;
    let voltageIndex = -1;
    
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].zh === '处理量' || headers[i].zh === '处理能力' || headers[i].zh.includes('处理')) capacityIndex = i;
      if (headers[i].zh === '功率' || headers[i].zh === '电机功率' || headers[i].zh.includes('功率') || headers[i].zh.includes('电机')) powerIndex = i;
      if (headers[i].zh === '电压' || headers[i].zh.includes('电压')) voltageIndex = i;
    }

    // 处理多行数据，从所有型号数据中提取最小和最大值
    let minCapacity = Number.MAX_SAFE_INTEGER;
    let maxCapacity = Number.MIN_SAFE_INTEGER;
    let minPower = Number.MAX_SAFE_INTEGER;
    let maxPower = Number.MIN_SAFE_INTEGER;
    let minVoltage = Number.MAX_SAFE_INTEGER;
    let maxVoltage = Number.MIN_SAFE_INTEGER;
    
    // 遍历所有表格行（不同型号）
    for (let rowIndex = 0; rowIndex < productData.specifications.tableData.length; rowIndex++) {
      const row = productData.specifications.tableData[rowIndex];
      
      // 处理处理量
      if (capacityIndex !== -1) {
        const capacityData = row[capacityIndex - 1]; // 减1是因为表格数据不包含第一列
        if (typeof capacityData === 'string' && capacityData.includes('-')) {
          const [min, max] = capacityData.split('-').map(v => parseFloat(v.trim()));
          if (!isNaN(min) && min < minCapacity) minCapacity = min;
          if (!isNaN(max) && max > maxCapacity) maxCapacity = max;
        } else {
          const value = parseFloat(capacityData);
          if (!isNaN(value)) {
            if (value < minCapacity) minCapacity = value;
            if (value > maxCapacity) maxCapacity = value;
          }
        }
      }
      
      // 处理电机功率
      if (powerIndex !== -1) {
        const powerData = row[powerIndex - 1]; // 减1是因为表格数据不包含第一列
        if (typeof powerData === 'string' && powerData.includes('-')) {
          const [min, max] = powerData.split('-').map(v => parseFloat(v.trim()));
          if (!isNaN(min) && min < minPower) minPower = min;
          if (!isNaN(max) && max > maxPower) maxPower = max;
        } else {
          const value = parseFloat(powerData);
          if (!isNaN(value)) {
            if (value < minPower) minPower = value;
            if (value > maxPower) maxPower = value;
          }
        }
      }
      
      // 处理电压数据（如果有）
      if (voltageIndex !== -1) {
        const voltageData = row[voltageIndex - 1]; // 减1是因为表格数据不包含第一列
        if (typeof voltageData === 'string' && voltageData.includes('-')) {
          const [min, max] = voltageData.split('-').map(v => parseFloat(v.trim()));
          if (!isNaN(min) && min < minVoltage) minVoltage = min;
          if (!isNaN(max) && max > maxVoltage) maxVoltage = max;
        } else if (typeof voltageData === 'string' && voltageData.includes('≥')) {
          const minValue = parseFloat(voltageData.replace('≥', ''));
          if (!isNaN(minValue)) {
            if (minValue < minVoltage) minVoltage = minValue;
            const maxValue = minValue * 2;
            if (maxValue > maxVoltage) maxVoltage = maxValue;
          }
        } else {
          const value = parseFloat(voltageData);
          if (!isNaN(value)) {
            if (value < minVoltage) minVoltage = value;
            if (value > maxVoltage) maxVoltage = value;
          }
        }
      }
    }
    
    // 构建结果对象
    const result: any = {};
    
    // 只有在找到有效值时才添加到结果中
    if (minCapacity !== Number.MAX_SAFE_INTEGER && maxCapacity !== Number.MIN_SAFE_INTEGER) {
      result.capacity = {
        min: minCapacity,
        max: maxCapacity === minCapacity ? minCapacity : maxCapacity,
        unit: 't/h'
      };
    } else {
      result.capacity = processRangeValue(productData.capacity);
    }
    
    if (minPower !== Number.MAX_SAFE_INTEGER && maxPower !== Number.MIN_SAFE_INTEGER) {
      result.motorPower = {
        min: minPower,
        max: maxPower === minPower ? minPower : maxPower,
        unit: 'kW'
      };
    } else {
      result.motorPower = processRangeValue(productData.motorPower);
    }
    
    if (voltageIndex !== -1 && minVoltage !== Number.MAX_SAFE_INTEGER && maxVoltage !== Number.MIN_SAFE_INTEGER) {
      result.voltage = {
        min: minVoltage,
        max: maxVoltage === minVoltage ? minVoltage : maxVoltage,
        unit: 'kV'
      };
    } else if (productData.voltage) {
      result.voltage = processRangeValue(productData.voltage);
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
    productId: formattedData.productId,
    model: formattedData.model,
    series: formattedData.series,
    imagePath: formattedData.imagePath,
    overview: formattedData.overview,
    // 按照磁选设备的参数优先级顺序添加参数
    capacity: latestParams.capacity,
    motorPower: latestParams.motorPower,
    voltage: latestParams.voltage, // 直接添加电压
    specifications: specifications,
    features: formattedData.features,
    applications: formattedData.applications,
    relatedProducts: relatedProducts,
    breadcrumb: formattedData.breadcrumb
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
        'plate-type-high-intensity-wet-magnetic-separator': { zh: '平板式高强度湿式磁选机', en: 'Plate-type High Intensity Wet Magnetic Separator' },
        'roller-type-high-intensity-wet-magnetic-separator': { zh: '辊式高强度湿式磁选机', en: 'Roller-type High Intensity Wet Magnetic Separator' },
        'three-disc-belt-magnetic-separator': { zh: '三盘带式磁选机', en: 'Three-disc Belt Magnetic Separator' }
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
      // 跳过第一列，它是产品型号，只在多行表格中使用
      if (colIndex > 0) {
        rowData[key] = row[colIndex - 1];
      }
    });
    return rowData;
  }) || [];
  
  return {
    title: specs.title || { zh: "技术参数", en: "Technical Specifications" },
    columns: columns.slice(1), // 去掉第一列参数列
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