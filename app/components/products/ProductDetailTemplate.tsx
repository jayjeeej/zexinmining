'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageSection from '../PageSection';
import { useLanguage } from '@/app/contexts/LanguageContext';
import ContactDialog from "@/app/components/ContactDialog";

// 面包屑导航项目
export interface BreadcrumbItem {
  label: {
    zh: string;
    en: string;
  };
  href?: string;
}

// 参数范围接口
export interface ParameterRange {
  min: number;
  max: number;
  unit?: string;
}

// 产品类型检查常量
const PRODUCT_TYPE = {
  CRUSHER: 'crusher',
  SCREEN: 'screen',
  CLASSIFIER: 'classifier',
  FEEDER: 'feeder',
  WASHER: 'washer',
  MILL: 'mill',
  MAGNETIC: 'magnetic-separation',
  FLOTATION: 'flotation',
  GRAVITY: 'gravity-separation'
};

// 获取当前产品的类型
const getProductType = (productId: string) => {
  if (productId.includes(PRODUCT_TYPE.CRUSHER)) return PRODUCT_TYPE.CRUSHER;
  if (productId.includes(PRODUCT_TYPE.SCREEN) || productId.includes('vibrating-screens')) return PRODUCT_TYPE.SCREEN;
  if (productId.includes(PRODUCT_TYPE.CLASSIFIER)) return PRODUCT_TYPE.CLASSIFIER;
  if (productId.includes(PRODUCT_TYPE.FEEDER)) return PRODUCT_TYPE.FEEDER;
  if (productId.includes(PRODUCT_TYPE.WASHER) || productId.includes('washing-equipment')) {
    return PRODUCT_TYPE.WASHER;
  }
  if (productId.includes(PRODUCT_TYPE.MILL)) return PRODUCT_TYPE.MILL;
  if (productId.includes('magnetic')) return PRODUCT_TYPE.MAGNETIC;
  if (productId.includes(PRODUCT_TYPE.FLOTATION)) return PRODUCT_TYPE.FLOTATION;
  if (productId.includes('gravity-separation') || 
     productId.includes('shaking-table') || 
     productId.includes('spiral-chute') || 
     productId.includes('centrifugal-separator') || 
     productId.includes('carpet-hooking-machine') || 
     productId.includes('sawtooth-wave-jig') || 
     productId.includes('synchronous-counter-directional-jig')) {
    return PRODUCT_TYPE.GRAVITY;
  }
  return '';
};

// 获取产品的优先参数
const getTopParameters = (productData: any, productType: string, count: number = 3) => {
  let parameters: Array<{
    label: { zh: string; en: string; };
    value: any;
    unit: string;
  }> = [];
  
  // 获取产品类型特有的重要参数
  if (productType === 'flotation') {
    // 浮选设备默认显示：有效容积、处理能力、电机功率
    if (productData.effectiveVolume) {
      parameters.push({
        label: { zh: "有效容积", en: "Effective Volume" },
        value: productData.effectiveVolume,
        unit: productData.effectiveVolume.unit || "m³"
      });
    }
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    }
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
  } else if (productType === 'crusher') {
    // 破碎机默认显示：处理能力、电机功率、最大进料尺寸
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    }
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
    if (productData.maxFeedSize) {
      parameters.push({
        label: { zh: "最大进料尺寸", en: "Max Feed Size" },
        value: productData.maxFeedSize,
        unit: productData.maxFeedSize.unit || "mm"
      });
    }
  } else if (productType === 'washer') {
    // 洗矿机默认显示：处理能力、电机功率、螺旋直径/滚筒直径
    // 确保始终添加处理能力参数
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    } else {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: { min: 20, max: 100, unit: "t/h" },
        unit: "t/h"
      });
    }
    
    // 确保始终添加电机功率参数
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    } else {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: { min: 5, max: 20, unit: "kW" },
        unit: "kW"
      });
    }
    
    // 尝试添加第三个参数（螺旋直径或滚筒直径）
    let thirdParamAdded = false;
    
    // 检查spiralDiameter
    if (productData.spiralDiameter) {
      parameters.push({
        label: { zh: "螺旋直径", en: "Spiral Diameter" },
        value: productData.spiralDiameter,
        unit: productData.spiralDiameter.unit || "mm"
      });
      thirdParamAdded = true;
    }
    // 检查drumDiameter
    else if (productData.drumDiameter) {
      parameters.push({
        label: { zh: "滚筒直径", en: "Drum Diameter" },
        value: productData.drumDiameter,
        unit: productData.drumDiameter.unit || "mm"
      });
      thirdParamAdded = true;
    }
    
    // 如果第三个参数未添加，添加一个默认参数
    if (!thirdParamAdded) {
      // 根据产品ID判断是螺旋洗矿机还是滚筒洗矿机
      if (productData.productId && productData.productId.includes('spiral')) {
        parameters.push({
          label: { zh: "螺旋直径", en: "Spiral Diameter" },
          value: { min: 900, max: 1800, unit: "mm" },
          unit: "mm"
        });
      } else {
        parameters.push({
          label: { zh: "滚筒直径", en: "Drum Diameter" },
          value: { min: 1500, max: 3000, unit: "mm" },
          unit: "mm"
        });
      }
    }
    
    // 确保至少返回三个参数
    return parameters;
  } else if (productType === 'gravity-separation') {
    // 重选设备默认显示：处理能力、电机功率、进料尺寸
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    }
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
    // 检查feedSize和maxFeedSize，优先使用feedSize
    if (productData.feedSize) {
      parameters.push({
        label: { zh: "进料尺寸", en: "Feed Size" },
        value: productData.feedSize,
        unit: productData.feedSize.unit || "mm"
      });
    } else if (productData.maxFeedSize) {
      parameters.push({
        label: { zh: "进料尺寸", en: "Feed Size" },
        value: productData.maxFeedSize,
        unit: productData.maxFeedSize.unit || "mm"
      });
    }
  } else if (productType === 'magnetic-separation') {
    // 磁选设备默认显示：处理能力、电机功率、磁场强度/电压
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    }
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
    
    // 检查各种可能的磁场强度或电压参数 - 这些参数是互斥的，按优先级排列
    let thirdParamAdded = false;
    
    // 1. 检查直接属性中的磁场强度
    if (productData.magneticFieldStrength) {
      parameters.push({
        label: { zh: "磁场强度", en: "Magnetic Field Strength" },
        value: productData.magneticFieldStrength,
        unit: productData.magneticFieldStrength.unit || "Gs"
      });
      thirdParamAdded = true;
    } 
    else if (productData.magneticIntensity) {
      parameters.push({
        label: { zh: "磁场强度", en: "Magnetic Intensity" },
        value: productData.magneticIntensity,
        unit: productData.magneticIntensity.unit || "Gs"
      });
      thirdParamAdded = true;
    } 
    // 2. 检查extraParameters中的磁场强度
    else if (productData.extraParameters?.magneticFieldStrength) {
      parameters.push({
        label: { zh: "磁场强度", en: "Magnetic Field Strength" },
        value: productData.extraParameters.magneticFieldStrength,
        unit: productData.extraParameters.magneticFieldStrength.unit || "Gs"
      });
      thirdParamAdded = true;
    }
    else if (productData.extraParameters?.magneticIntensity) {
      parameters.push({
        label: { zh: "磁场强度", en: "Magnetic Intensity" },
        value: productData.extraParameters.magneticIntensity,
        unit: productData.extraParameters.magneticIntensity.unit || "Gs"
      });
      thirdParamAdded = true;
    } 
    // 3. 检查电压参数 (对于电解电容器分离器等)
    else if (productData.voltage) {
      parameters.push({
        label: { zh: "电压", en: "Voltage" },
        value: productData.voltage,
        unit: productData.voltage.unit || "kV"
      });
      thirdParamAdded = true;
    } else if (productData.extraParameters?.voltage) {
      parameters.push({
        label: { zh: "电压", en: "Voltage" },
        value: productData.extraParameters.voltage,
        unit: productData.extraParameters.voltage.unit || "kV"
      });
      thirdParamAdded = true;
    }
    
    // 4. 如果没有找到第三个参数，可以添加其他特定参数
    if (!thirdParamAdded) {
      // 电解电容器分离器可能有旋转速度
      if (productData.rotationSpeed) {
        parameters.push({
          label: { zh: "转速", en: "Rotation Speed" },
          value: productData.rotationSpeed,
          unit: productData.rotationSpeed.unit || "r/min"
        });
      } 
      // 或者滚筒直径
      else if (productData.rollerDiameter) {
        parameters.push({
          label: { zh: "滚筒直径", en: "Roller Diameter" },
          value: productData.rollerDiameter,
          unit: productData.rollerDiameter.unit || "mm"
        });
      }
      // 如果都没有，使用通用参数如最大进料尺寸
      else if (productData.maxFeedSize) {
        parameters.push({
          label: { zh: "最大进料尺寸", en: "Max Feed Size" },
          value: productData.maxFeedSize,
          unit: productData.maxFeedSize.unit || "mm"
        });
      }
    }
  } else if (productType === 'classifier') {
    // 分级机特有参数顺序：返砂处理能力、溢流处理能力、电机功率
    if (productData.sandReturnCapacity) {
      parameters.push({
        label: { zh: "返砂处理能力", en: "Sand Return Capacity" },
        value: productData.sandReturnCapacity,
        unit: productData.sandReturnCapacity.unit || "t/d"
      });
    }
    if (productData.overflowCapacity) {
      parameters.push({
        label: { zh: "溢流处理能力", en: "Overflow Capacity" },
        value: productData.overflowCapacity,
        unit: productData.overflowCapacity.unit || "t/d"
      });
    }
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
  } else if (productType === 'screen') {
    // 振动筛特有参数顺序：处理能力、电机功率、筛网尺寸/筛孔大小
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    }
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
    if (productData.screenSize) {
      parameters.push({
        label: { zh: "筛网尺寸", en: "Screen Size" },
        value: productData.screenSize,
        unit: productData.screenSize.unit || "mm"
      });
    } else if (productData.aperture) {
      parameters.push({
        label: { zh: "筛孔大小", en: "Aperture" },
        value: productData.aperture,
        unit: productData.aperture.unit || "mm"
      });
    }
  }
  // ... existing code ...
  
  // 如果还没有达到指定数量的参数，添加通用参数
  if (parameters.length < count) {
    if (productData.capacity && !parameters.some(p => p.label.zh === "处理能力")) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: productData.capacity.unit || "t/h"
      });
    }
    if (parameters.length < count && productData.motorPower && !parameters.some(p => p.label.zh === "电机功率")) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: productData.motorPower.unit || "kW"
      });
    }
    if (parameters.length < count && productData.effectiveVolume && !parameters.some(p => p.label.zh === "有效容积")) {
      parameters.push({
        label: { zh: "有效容积", en: "Effective Volume" },
        value: productData.effectiveVolume,
        unit: productData.effectiveVolume.unit || "m³"
      });
    }
    // ... existing code ...
  }
  
  return parameters.slice(0, count);
};

// 产品详情页模板属性
export interface ProductDetailTemplateProps {
  productId: string;
  model: string;
  series: {
    zh: string;
    en: string;
  };
  imagePath: string;
  overview?: {
    zh: string;
    en: string;
  };
  // 通用参数
  capacity?: ParameterRange;
  motorPower?: ParameterRange;
  
  // 破碎机特有参数
  maxFeedSize?: ParameterRange;
  
  // 振动筛特有参数
  screenSize?: ParameterRange;
  aperture?: ParameterRange;
  
  // 磨矿设备特有参数
  dischargeSize?: ParameterRange;
  maxBallLoad?: ParameterRange;
  
  // 分级机特有参数
  sandReturnCapacity?: ParameterRange;
  overflowCapacity?: ParameterRange;
  
  // 洗矿机特有参数
  spiralDiameter?: ParameterRange;
  drumDiameter?: ParameterRange;
  
  // 浮选设备特有参数
  effectiveVolume?: ParameterRange;
  
  // 磁选设备特有参数
  magneticIntensity?: ParameterRange;
  magneticFieldStrength?: ParameterRange;
  voltage?: ParameterRange;
  
  // 给料机和洗矿机特有参数
  width?: ParameterRange;
  length?: ParameterRange;
  height?: ParameterRange;
  
  // 额外参数字段，可以包含ParameterRange或字符串类型的值
  extraParameters?: {
    [key: string]: ParameterRange | string | Array<{
      label: { zh: string; en: string };
      value: any;
      unit: string;
    }>;
  };
  
  specifications?: {
    title: {
      zh: string;
      en: string;
    };
    columns: Array<{
      key: string;
      title: {
        zh: string;
        en: string;
      };
      unit?: string;
    }>;
    data: Array<{[key: string]: string | number}>;
    notes?: Array<{
      content: {
        zh: string;
        en: string;
      }
    }>;
  };
  features?: Array<{
    zh: string;
    en: string;
  }>;
  applications?: {
    title?: {
      zh: string;
      en: string;
    };
    items: Array<{
      title: {
        zh: string;
        en: string;
      };
      description: {
        zh: string;
        en: string;
      };
      icon?: string;
    }>;
  };
  relatedProducts?: {
    title?: {
      zh: string;
      en: string;
    };
    basePath: string;
    items: Array<{
      id: string;
      series: {
        zh: string;
        en: string;
      };
      model?: string;
      image?: string;
      capacity?: {
        zh: string;
        en: string;
      };
      feedSize?: {
        zh: string;
        en: string;
      };
      motorPower?: {
        zh: string;
        en: string;
      };
    }>;
    visibleCards?: number;
  };
  breadcrumb?: {
    items: BreadcrumbItem[];
  };
}

// 安全获取表格单元格值的辅助函数
function getCellContent(value: any, isZhLanguage: boolean): string | number {
  if (!value) return '';
  
  // 如果是对象并且有zh/en字段
  if (typeof value === 'object' && value !== null) {
    if (isZhLanguage && 'zh' in value) {
      return value.zh;
    } else if (!isZhLanguage && 'en' in value) {
      return value.en;
    }
  }
  
  // 返回原始值
  return value;
}

export default function ProductDetailTemplate({
  productId,
  model,
  series,
  imagePath,
  overview,
  capacity,
  maxFeedSize,
  motorPower,
  screenSize,
  aperture,
  dischargeSize,
  maxBallLoad,
  sandReturnCapacity,
  overflowCapacity,
  spiralDiameter,
  drumDiameter,
  width,
  length,
  height,
  effectiveVolume,
  extraParameters,
  specifications,
  features,
  applications,
  relatedProducts,
  breadcrumb,
  productData
}: ProductDetailTemplateProps & { productData?: any }) {
  const { language, isZh } = useLanguage();
  
  // 获取产品类型
  const productType = getProductType(productId);
  
  // 创建引用用于滚动
  const overviewRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);
  
  // 相关产品轮播状态
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [filteredProductItems, setFilteredProductItems] = useState<any[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 计算轮播幻灯片数量并过滤当前产品
  useEffect(() => {
    if (relatedProducts && relatedProducts.items) {
      // 过滤掉当前正在查看的产品
      const filtered = relatedProducts.items.filter(item => item.id !== productId);
      setFilteredProductItems(filtered);
      
      // 根据屏幕宽度调整每页显示数量
      let displayCount = getProductsPerSlide();
      
      // 计算需要多少页来显示所有产品
      setSlideCount(Math.ceil(filtered.length / displayCount));
    }
  }, [relatedProducts, productId]);
  
  // 自适应布局
  useEffect(() => {
    const handleResize = () => {
      if (filteredProductItems.length > 0) {
        const displayCount = getProductsPerSlide();
        setSlideCount(Math.ceil(filteredProductItems.length / displayCount));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredProductItems]);
  
  // 轮播导航
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  };
  
  // 格式化参数值函数
  const getMinMaxValue = (param?: ParameterRange, unit: string = '') => {
    if (!param) return '';
    // 确保单位完整显示，使用传入的单位或参数自带的单位
    const displayUnit = unit || param.unit || '';
    return param.min === param.max ? 
      `${param.min} ${displayUnit}` : 
      `${param.min}-${param.max} ${displayUnit}`;
  };

  // 获取当前每页显示的产品数量
  const getProductsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        return 1; // 移动端每页显示1个
      } else if (window.innerWidth < 1024) {
        return 2; // 平板每页显示2个
      }
    }
    return 3; // 默认每页显示3个
  };
  
  // 判断是否需要显示轮播按钮
  const shouldShowCarouselControls = () => {
    // 只有当轮播数量超过一页且产品总数大于每页显示数量时才显示控制按钮
    return slideCount > 1 && filteredProductItems.length > getProductsPerSlide();
  };

  // 检测产品类型
  const isCrusher = productId.includes('crusher') || 
                    (series?.zh?.includes('破碎机') || series?.en?.includes('Crusher'));
  
  const isScreen = productId.includes('screen') || 
                   (series?.zh?.includes('振动筛') || series?.en?.includes('Screen'));
                   
  const isClassifier = productId.includes('classifier') || 
                   (series?.zh?.includes('分级机') || series?.en?.includes('Classifier'));
                   
  const isFeeder = productId.includes('feeder') || 
                   (series?.zh?.includes('给料机') || series?.en?.includes('Feeder'));
                   
  const isWasher = productId.includes('washer') || 
                   (series?.zh?.includes('洗矿机') || series?.en?.includes('Washer'));
                   
  const isMill = productId.includes('mill') || 
                   (series?.zh?.includes('磨机') || series?.en?.includes('Mill'));
                   
  // 确定显示的前3个参数
  const getTopThreeParameters = () => {
    // 检查是否有自定义的顶部参数
    if (extraParameters?.topParameters && Array.isArray(extraParameters.topParameters)) {
      return extraParameters.topParameters;
    }
    
    // 获取产品类型，用于确定优先显示的参数
    const productType = (() => {
      if (extraParameters && extraParameters.productType) {
        return extraParameters.productType as string;
      }
      
      return getProductType(productId);
    })();
    
    // 整合所有可能的参数到一个对象中
    const combinedData = {
      productId,
      capacity,
      motorPower,
      maxFeedSize,
      screenSize,
      aperture,
      dischargeSize,
      maxBallLoad,
      sandReturnCapacity,
      overflowCapacity,
      spiralDiameter,
      drumDiameter,
      width,
      length,
      height,
      effectiveVolume,
      // 额外参数
      ...extraParameters
    };
    
    // 通过getTopParameters函数获取按照优先级排序的参数列表
    const params = getTopParameters(combinedData, productType);
    return params;
  };
  
  // 获取前3个最优先参数
  const topParameters = productData ? 
    getTopParameters(productData, getProductType(productId)) : 
    getTopThreeParameters();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 预留顶部空间，避免固定导航栏遮挡 */}
      <div className="h-0 pt-6 md:pt-0 lg:pt-0 xl:pt-0"></div>
      
      {/* 产品标题区域 */}
      <PageSection 
        noPadding 
        variant="gray"
        isHero={true}
        breadcrumb={breadcrumb}
      >
        <div className="relative pt-24 pb-10 px-6 md:px-8 w-full max-w-[1200px] mx-auto">
          <div className="relative z-10 w-full">
            <div ref={overviewRef} className="flex flex-col md:flex-row gap-12 items-start mb-6 w-full">
              <div className="md:w-1/2 pl-0 w-full">
                <div className="w-full overflow-hidden">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 break-words hyphens-auto leading-tight">
                    {isZh ? series.zh : series.en}
                  </h1>
                </div>
                
                <div className="mt-8 mb-10 w-full">
                  <div className="space-y-8">
                    {/* 只显示前3个最高优先级参数 */}
                    {topParameters.map((param, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-36 font-medium text-gray-600 text-xl">
                          {isZh ? (param.label?.zh || '') : (param.label?.en || '')}:
                        </div>
                        <div className="font-medium text-xl">
                          {typeof param.value === 'object' && param.value.min !== undefined ? 
                            getMinMaxValue(param.value, param.unit) : 
                            (typeof param.value === 'object' && (param.value.zh || param.value.en) ? 
                              (isZh ? param.value.zh : param.value.en) : 
                              param.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 产品概述 */}
                {overview && (
                  <div className="mb-10">
                    <p className="text-lg text-gray-700">
                      {isZh ? overview.zh : overview.en}
                    </p>
                  </div>
                )}
              </div>
              
              {/* 产品图片 */}
              <div className="md:w-1/2">
                <div className="w-full h-[400px] relative">
                  <Image
                    src={imagePath}
                    alt={model}
                    fill
                    style={{ objectFit: "contain" }}
                    className="object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
      
      {/* 产品特点 - 完整展示 */}
      {features && features.length > 0 && (
        <PageSection variant="dark" className="-mt-4 py-1">
          <div className="max-w-7xl mx-auto py-8 px-6 md:px-8">
            <p className="text-[2.8rem] text-white leading-tight font-light text-left max-w-[90%] md:max-w-[80%]">
              {isZh 
                ? features.slice(0, 3).map(f => f.zh).join('，') + '。'
                : features.slice(0, 3).map(f => f.en).join(', ') + '.'}
            </p>
          </div>
        </PageSection>
      )}
      
      {/* 产品导航栏 */}
      <div className="bg-white">
        <div className="relative px-6 md:px-8">
          <div className="relative z-10 max-w-7xl mx-auto border-t border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-10">
                <button 
                  className="py-6 font-medium text-gray-800 border-b-2 border-transparent hover:border-orange-500 hover:border-b-2 transition-colors duration-200 focus:outline-none relative"
                  onClick={() => overviewRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ marginBottom: '-1px' }}
                >
                  {isZh ? series.zh : series.en}
                </button>
              
                <button 
                  className="py-6 px-4 font-medium text-gray-800 border-b-2 border-transparent hover:border-orange-500 hover:border-b-2 transition-colors duration-200 focus:outline-none relative"
                  onClick={() => specsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ marginBottom: '-1px' }}
                >
                  {isZh ? '技术参数' : 'Specifications'}
                </button>
                
                <button 
                  className="py-6 px-4 font-medium text-gray-800 border-b-2 border-transparent hover:border-orange-500 hover:border-b-2 transition-colors duration-200 focus:outline-none relative"
                  onClick={() => applicationsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ marginBottom: '-1px' }}
                >
                  {isZh ? '应用领域' : 'Applications'}
                </button>
              </div>
              
              <div>
                <ContactDialog 
                  customButton={
                    <button
                      className="inline-block bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 py-3 px-8 transition duration-300"
                    >
                      {isZh ? '获取报价' : 'Request a quote'}
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 产品技术参数 */}
      {specifications && (
        <div ref={specsRef}>
          <PageSection>
            <div className="max-w-7xl mx-auto mb-12">
              <h2 className="text-4xl font-bold text-[#333333] mb-20">
                {specifications.title && (specifications.title.zh || specifications.title.en) ? 
                  (isZh ? specifications.title.zh : specifications.title.en) : 
                  (isZh ? '技术参数' : 'Specifications')}
              </h2>
              
              <div className="overflow-x-auto mt-16">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f2f2f2]">
                      {specifications.columns.map((column) => (
                        <th key={column.key} className="py-3 px-4 text-center font-medium text-[#333333]">
                          {column.unit ? (
                            <>
                              <div>{isZh ? column.title.zh : column.title.en}</div>
                              <div className="text-sm">({column.unit})</div>
                            </>
                          ) : (
                            <div>{isZh ? column.title.zh : column.title.en}</div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.data.map((row, index) => (
                      <tr 
                        key={index} 
                        className={index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}
                      >
                        {specifications.columns.map((column) => (
                          <td key={column.key} className="py-3 px-4 text-center">
                            {getCellContent(row[column.key], isZh)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* 处理不同格式的产品规格备注 */}
                <div className="mt-8">
                  <div className="text-left text-gray-600 max-w-[70%]">
                    {/* 优先显示已有的备注 */}
                    {specifications.notes && Array.isArray(specifications.notes) && specifications.notes.length > 0 ? (
                      <>
                        {specifications.notes.map((note: any, index) => (
                          <p key={index} className={index === 0 ? "mb-2" : "text-sm mb-1"}>
                            {index === 0 ? (isZh ? "备注：" : "Note: ") : ""}
                            {note?.content ? 
                              (isZh ? note.content.zh : note.content.en) : 
                              (isZh ? note?.zh || note : note?.en || note)}
                          </p>
                        ))}
                      </>
                    ) : productData?.specifications?.note && typeof productData.specifications.note === 'object' ? (
                      <p className="mb-2">
                        {isZh ? "备注：" : "Note: "}{isZh ? productData.specifications.note.zh : productData.specifications.note.en}
                      </p>
                    ) : productData?.specifications?.notes && productData.specifications.notes.zh && Array.isArray(productData.specifications.notes.zh) ? (
                      <>
                        {(isZh ? productData.specifications.notes.zh : productData.specifications.notes.en).map((noteText: string, index: number) => (
                          <p key={index} className={index === 0 ? "mb-2" : "text-sm mb-1"}>
                            {index === 0 ? (isZh ? "备注：" : "Note: ") : ""}{noteText}
                          </p>
                        ))}
                      </>
                    ) : (
                      // 如果没有任何备注，显示默认备注
                      <p className="mb-2">
                        {isZh ? "备注：" : "Note: "}{isZh ? "任何规格都可以按照客户需求定制" : "Any specification can be customized according to customer requirements"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </PageSection>
        </div>
      )}
      
      {/* 应用领域 */}
      {applications && (
        <div ref={applicationsRef}>
          <PageSection variant="white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-[#333333] mb-8">
                {isZh 
                  ? (applications.title?.zh || '应用领域') 
                  : (applications.title?.en || 'Application Areas')}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {applications?.items?.map((app, index) => (
                  <div key={index} className="border border-gray-100 bg-gray-50 p-4 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">
                      {isZh ? app.title.zh : app.title.en}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {isZh ? app.description.zh : app.description.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </PageSection>
        </div>
      )}
      
      {/* 相关产品 */}
      {relatedProducts && relatedProducts.items && relatedProducts.items.length > 0 && (
        <div className="py-16 bg-gray-100">
          <style jsx global>{`
            @keyframes fadeOut {
              0% { opacity: 1; }
              100% { opacity: 0; }
            }
            
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            
            .carousel-fade-in {
              animation: fadeIn 0.3s ease-in forwards;
            }
            
            .carousel-fade-out {
              animation: fadeOut 0.3s ease-out forwards;
            }
          `}</style>
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-[#333333]">
                {isZh 
                  ? (relatedProducts.title?.zh || '相关产品') 
                  : (relatedProducts.title?.en || 'Related Products')}
              </h2>
              
              {shouldShowCarouselControls() && (
                <div className="flex space-x-2 items-center">
                  <button 
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    disabled={isAnimating}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button 
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    disabled={isAnimating}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isAnimating ? 'carousel-fade-out' : 'carousel-fade-in'}`}>
              {filteredProductItems
                .slice(currentSlide * getProductsPerSlide(), (currentSlide + 1) * getProductsPerSlide())
                .map((product, index) => {
                  // 确定产品图片路径
                  let imagePath = product.image;
                  
                  if (!imagePath) {
                    // 提取产品ID的最后一段作为产品名称
                    const productSlug = product.id.split('/').pop() || product.id;
                    
                    // 特定产品类型的图片路径映射
                    const pathMappings: Record<string, string> = {
                      'jaw-crusher': '/images/products/crushers/jaw-crusher.png',
                      'cone-crusher': '/images/products/crushers/cone-crusher.png',
                      'impact-crusher': '/images/products/crushers/impact-crusher.png',
                      'hammer-crusher': '/images/products/crushers/hammer-crusher.png',
                      'double-roller-crusher': '/images/products/crushers/double-roller-crusher.png',
                      'heavy-duty-double-roller-crusher': '/images/products/crushers/heavy-duty-double-roller-crusher.png',
                      'plate-feeder': '/images/products/feeders/plate-feeder.png',
                      'belt-feeder': '/images/products/feeders/belt-feeder.png',
                      'electromagnetic-vibrating-feeder': '/images/products/feeders/electromagnetic-vibrating-feeder.png',
                      'disc-feeder': '/images/products/feeders/disc-feeder.png',
                      'xdg-vibrating-feeder': '/images/products/feeders/xdg-vibrating-feeder.png',
                      'spiral-washer': '/images/products/washers/spiral-washer.png',
                      'double-spiral-washer': '/images/products/washers/double-spiral-washer.png',
                      'drum-washer': '/images/products/washers/drum-washer.png'
                    };
                    
                    // 优先使用映射表中的路径
                    if (pathMappings[productSlug]) {
                      imagePath = pathMappings[productSlug];
                    } else {
                      // 根据产品ID确定图片文件夹路径
                      let folderPath = '';
                      if (productSlug.includes('crusher')) {
                        folderPath = 'crushers';
                      } else if (productSlug.includes('screen')) {
                        folderPath = 'screens';
                      } else if (productSlug.includes('classifier')) {
                        folderPath = 'classification-equipment';
                      } else if (productSlug.includes('feeder')) {
                        folderPath = 'feeders';
                      } else if (productSlug.includes('washer')) {
                        folderPath = 'washers';
                      } else if (productSlug.includes('mill') || productSlug.includes('grinding')) {
                        folderPath = 'grinding';
                      } else if (productSlug.includes('separator') || productSlug.includes('separation')) {
                        folderPath = 'gravity-separation';
                      } else {
                        // 从产品ID尝试提取更多信息
                        const categories = {
                          'stationary-crushers': 'crushers',
                          'vibrating-screens': 'screens',
                          'feeding-equipment': 'feeders',
                          'washing-equipment': 'washers',
                          'grinding-equipment': 'grinding',
                          'classification-equipment': 'classification-equipment'
                        };
                        
                        // 尝试从ID中提取分类
                        let foundCategory = '';
                        Object.entries(categories).forEach(([key, value]) => {
                          if (product.id.includes(key)) {
                            foundCategory = value;
                          }
                        });
                        
                        folderPath = foundCategory || '';
                      }
                      
                      // 如果folderPath为空，使用产品类型为图片名
                      if (folderPath) {
                        imagePath = `/images/products/${folderPath}/${productSlug}.png`;
                      } else {
                        // 使用通用占位图
                        imagePath = `/images/products/placeholder.png`;
                      }
                    }
                  }
                  
                  return (
                    <Link 
                      key={product.id || index} 
                      href={`${relatedProducts.basePath}/${product.id}`}
                      className="bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full"
                    >
                      <div className="flex flex-col h-full">
                        <div className="relative h-[200px] w-full mb-6">
                          <Image
                            src={imagePath}
                            alt={isZh ? product.series.zh : product.series.en}
                            fill
                            style={{ objectFit: "contain" }}
                            className="object-center"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-[#333333] mb-2 border-b border-transparent group-hover:border-[#333333] inline-block transition-all">
                            {isZh ? product.series.zh : product.series.en}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 