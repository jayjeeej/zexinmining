'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface ProductCardProps {
  product: {
    id: string;
    model: string;
    series: {
      zh: string;
      en: string;
    };
    image?: string;
    priority?: 'high' | 'low' | 'auto'; // 添加priority属性用于图像加载优先级
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
    screenSize?: {
      zh: string;
      en: string;
    };
    aperture?: {
      zh: string;
      en: string;
    };
    // 新增浮选设备特有参数
    effectiveVolume?: {
      zh: string;
      en: string;
    };
    // 分级机特有参数
    sandReturnCapacity?: {
      zh: string;
      en: string;
    };
    overflowCapacity?: {
      zh: string;
      en: string;
    };
    // 洗矿机特有参数
    spiralDiameter?: {
      zh: string;
      en: string;
    };
    drumDiameter?: {
      zh: string;
      en: string;
    };
    weight?: {
      zh: string;
      en: string;
    };
    // 球磨机特有参数
    ballLoad?: {
      zh: string;
      en: string;
    };
    // 产品类型标识
    isScreenProduct?: boolean;
    isCrusherProduct?: boolean;
    isFeederProduct?: boolean;
    isWasherProduct?: boolean;
    isClassifierProduct?: boolean;
    isMillProduct?: boolean;
    isGravitySeparationProduct?: boolean;
    isFlotationProduct?: boolean;
  };
  basePath?: string;
  showDetails?: boolean; // 控制是否显示详细信息
}

export default function ProductCard({ product, basePath, showDetails = true }: ProductCardProps) {
  const { language, isZh } = useLanguage();
  
  // 使用提供的basePath或构建默认路径
  const productPath = basePath 
    ? `${basePath}/${product.id}` 
    : `/products/stationary-crushers/${product.id}`;
  
  // 获取本地化文本的辅助函数
  const getLocalizedText = (obj?: { zh: string; en: string }) => {
    if (!obj) return '';
    return isZh ? (obj.zh || '') : (obj.en || '');
  };

  // 获取占位图片
  const getPlaceholderImage = (): { png: string; webp: string; } => {
    // 判断是否提供了图片路径
    if (product.image) {
      // 检查图片路径是否已经包含文件扩展名
      const basePath = product.image.endsWith('.png') 
        ? product.image.slice(0, -4) 
        : product.image;
      
      return {
        png: `${basePath}.png`,
        webp: `${basePath}.webp`
      };
    }
    
    // 构建基本路径（不含扩展名）
    let basePath = '';
    
    // 根据产品ID判断类型
    if (product.isCrusherProduct || product.id.includes('crusher') || 
        (product.series?.zh?.includes('破碎机') || product.series?.en?.includes('Crusher'))) {
      basePath = `/images/products/crushers/${product.id}`;
    } else if (product.isScreenProduct || product.id.includes('screen') || 
        (product.series?.zh?.includes('振动筛') || product.series?.en?.includes('Screen'))) {
      basePath = `/images/products/screens/${product.id}`;
    } else if (product.isClassifierProduct || product.id.includes('classifier') || 
        (product.series?.zh?.includes('分级机') || product.series?.en?.includes('Classifier'))) {
      basePath = `/images/products/classification-equipment/${product.id}`;
    } else if (product.isWasherProduct || product.id.includes('washer') || 
        (product.series?.zh?.includes('洗矿机') || product.series?.en?.includes('Washer'))) {
      // 为特定的洗矿机类型提供明确的路径
      if (product.id === 'spiral-washer') {
        basePath = '/images/products/washers/spiral-washer';
      } else if (product.id === 'double-spiral-washer') {
        basePath = '/images/products/washers/double-spiral-washer';
      } else if (product.id === 'drum-washer') {
        basePath = '/images/products/washers/drum-washer';
      } else {
        basePath = `/images/products/washers/${product.id}`;
      }
    } else if (product.id.includes('mill') || 
        (product.series?.zh?.includes('球磨机') || product.series?.zh?.includes('棒磨机') || 
         product.series?.en?.includes('Ball Mill') || product.series?.en?.includes('Rod Mill'))) {
      basePath = `/images/products/grinding/${product.id}`;
    } else if (product.isFeederProduct || product.id.includes('feeder') || 
        (product.series?.zh?.includes('给料') || product.series?.en?.includes('Feeder'))) {
      basePath = `/images/products/feeders/${product.id}`;
    } else if (product.isGravitySeparationProduct || 
               product.id.includes('jig') || 
               product.id.includes('shaking-table') || 
               product.id.includes('spiral-chute') || 
               product.id.includes('carpet-hooking-machine') || 
               product.id.includes('centrifugal-separator') || 
               (product.series?.zh?.includes('跳汰机') || 
                product.series?.zh?.includes('摇床') || 
                product.series?.zh?.includes('螺旋溜槽') || 
                product.series?.zh?.includes('毛毯布勾机') || 
                product.series?.zh?.includes('离心选矿机') || 
                product.series?.en?.includes('Jig') || 
                product.series?.en?.includes('Shaking Table') || 
                product.series?.en?.includes('Spiral Chute') || 
                product.series?.en?.includes('Carpet Hooking Machine') || 
                product.series?.en?.includes('Centrifugal Separator'))) {
      basePath = `/images/products/gravity-separation/${product.id}`;
    } else if (product.isFlotationProduct || 
               product.id.includes('flotation') || 
               (product.series?.zh?.includes('浮选') || 
                product.series?.en?.includes('Flotation'))) {
      basePath = `/images/products/flotation/${product.id}`;
    } else {
      // 默认占位图
      basePath = '/images/products/placeholder';
    }
    
    return {
      png: `${basePath}.png`,
      webp: `${basePath}.webp`
    };
  };
  
  // 使用占位符图片
  const placeholderImages = getPlaceholderImage();
  
  // 确定显示哪些参数 - 根据产品类型决定显示顺序
  const getDisplayParameters = () => {
    const params = [];
    
    // 检测产品类型
    const isCrusher = product.isCrusherProduct || product.id?.includes('crusher') || 
                      (product.series?.zh?.includes('破碎机') || product.series?.en?.includes('Crusher'));
    
    const isScreen = product.isScreenProduct || product.id?.includes('screen') || 
                     (product.series?.zh?.includes('振动筛') || product.series?.en?.includes('Screen'));
    
    const isClassifier = product.isClassifierProduct || product.id?.includes('classifier') || 
                     (product.series?.zh?.includes('分级机') || product.series?.en?.includes('Classifier'));
    
    const isWasher = product.isWasherProduct || product.id?.includes('washer') || 
                     (product.series?.zh?.includes('洗矿机') || product.series?.en?.includes('Washer'));
    
    const isMill = product.isMillProduct || product.id?.includes('mill') || 
                   (product.series?.zh?.includes('磨机') || product.series?.en?.includes('Mill'));
    
    const isGravitySeparation = product.isGravitySeparationProduct || product.id?.includes('jig') || 
                   (product.series?.zh?.includes('跳汰机') || product.series?.en?.includes('Jig'));
    
    const isFlotation = product.isFlotationProduct || product.id?.includes('flotation') || 
                  (product.series?.zh?.includes('浮选') || product.series?.en?.includes('Flotation'));
    
    // 浮选设备特有参数显示
    if (isFlotation) {
      // 1. 有效容积 - 最高优先级
      if (product.effectiveVolume?.zh || product.effectiveVolume?.en) {
        params.push({
          label: { zh: "有效容积", en: "Effective Volume" },
          value: product.effectiveVolume,
          unit: "m³"
        });
      }
      
      // 2. 处理能力 - 第二优先级
      if (product.capacity?.zh || product.capacity?.en) {
        params.push({
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: product.capacity,
          unit: "m³/min"
        });
      }
      
      // 3. 电机功率 - 第三优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower,
          unit: "kW"
        });
      }
    }
    // 分级机特有参数显示
    else if (isClassifier) {
      // 1. 返砂处理能力 - 最高优先级
      if (product.sandReturnCapacity?.zh || product.sandReturnCapacity?.en) {
        params.push({
          label: { zh: "返砂处理能力", en: "Sand Return Capacity" },
          value: product.sandReturnCapacity,
          unit: "t/h"
        });
      }
      
      // 2. 溢流处理能力 - 第二优先级
      if (product.overflowCapacity?.zh || product.overflowCapacity?.en) {
        params.push({
          label: { zh: "溢流处理能力", en: "Overflow Capacity" },
          value: product.overflowCapacity,
          unit: "t/h"
        });
      }
      
      // 3. 电机功率 - 第三优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower,
          unit: "kW"
        });
      }
    } 
    // 重选设备特有参数显示
    else if (isGravitySeparation) {
      // 1. 处理能力 - 最高优先级
      if (product.capacity?.zh || product.capacity?.en) {
        params.push({
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: product.capacity,
          unit: "t/h"
        });
      }
      
      // 2. 电机功率 - 第二优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower,
          unit: "kW"
        });
      }
      
      // 3. 进料尺寸 - 第三优先级
      if (product.feedSize?.zh || product.feedSize?.en) {
        params.push({
          label: { zh: "进料尺寸", en: "Feed Size" },
          value: product.feedSize,
          unit: "mm"
        });
      }
    }
    else {
      // 其他产品类型的参数显示逻辑(保持原有逻辑)
      
      // 1. 处理能力 - 所有非分级机产品最优先显示
      if (product.capacity?.zh || product.capacity?.en) {
        params.push({
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: product.capacity,
          unit: product.isFeederProduct || product.id.includes('feeder') || 
                (product.series?.zh?.includes('给料') || product.series?.en?.includes('Feeder')) 
                ? "m³/h" : "t/h"
        });
      }
      
      // 2. 电机功率 - 第二优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower,
          unit: "kW"
        });
      }
      
      // 3. 根据产品类型显示不同的第三参数
      if (isCrusher && (product.feedSize?.zh || product.feedSize?.en)) {
        // 对于破碎机，显示最大进料口
        params.push({
          label: { zh: "最大进料尺寸", en: "Max. Feed Size" },
          value: product.feedSize,
          unit: "mm"
        });
      } else if (isScreen) {
        // 对于振动筛，按顺序处理参数
        // 先显示处理能力和电机功率（已在前面添加）
        // 然后直接显示筛孔尺寸
        if (product.aperture?.zh || product.aperture?.en) {
          params.push({
            label: { zh: "筛孔尺寸", en: "Aperture Size" },
            value: product.aperture,
            unit: "mm"
          });
        }
      } else if (isWasher && (product.spiralDiameter?.zh || product.spiralDiameter?.en)) {
        // 对于螺旋洗矿机，显示螺旋直径
        params.push({
          label: { zh: "螺旋直径", en: "Spiral Diameter" },
          value: product.spiralDiameter,
          unit: "mm"
        });
      } else if (isWasher && (product.drumDiameter?.zh || product.drumDiameter?.en)) {
        // 对于滚筒洗矿机，显示滚筒直径
        params.push({
          label: { zh: "滚筒直径", en: "Drum Diameter" },
          value: product.drumDiameter,
          unit: "mm"
        });
      }
    }
    
    // 最多显示3个参数
    return params.slice(0, 3);
  };
  
  // 获取要显示的参数
  const displayParameters = showDetails ? getDisplayParameters() : [];
  
  // 定义一个提取产品参数单位的辅助函数
  const extractUnit = (value: string): { valueWithoutUnit: string, unit: string } => {
    // 匹配常见单位模式
    const unitPatterns = [
      // 范围值后跟单位，支持各种分隔符和Unicode单位符号
      /(\d+\.?\d*)\s*[-–—~～]\s*(\d+\.?\d*)\s+(m³\/h|m³\/min|m³|m²|m|t\/h|kW|mm|t|kg|Gs|r\/min)/,
      // 单值后跟单位
      /(\d+\.?\d*)\s+(m³\/h|m³\/min|m³|m²|m|t\/h|kW|mm|t|kg|Gs|r\/min)/,
      // 范围值无单位
      /(\d+\.?\d*)\s*[-–—~～]\s*(\d+\.?\d*)/,
      // 单值无单位
      /(\d+\.?\d*)/
    ];
    
    // 处理特殊Unicode字符的单位
    const specialUnitMap: {[key: string]: string} = {
      'm3': 'm³',
      'm2': 'm²',
      'm³': 'm³',
      'm²': 'm²',
      't/h': 't/h',
      'kw': 'kW',
      'kW': 'kW',
      'mm': 'mm',
      't': 't',
      'kg': 'kg',
      'm3/h': 'm³/h',
      'm³/h': 'm³/h',
      'm3/min': 'm³/min',
      'm³/min': 'm³/min'
    };
    
    for (const pattern of unitPatterns) {
      const match = value.match(pattern);
      if (match) {
        if (match[3]) {  // 范围值 + 单位
          // 检查并处理特殊单位
          const unit = specialUnitMap[match[3]] || match[3];
          return { 
            valueWithoutUnit: `${match[1]}-${match[2]}`, 
            unit 
          };
        } else if (match[2] && isNaN(Number(match[2]))) {  // 单值 + 单位
          // 检查并处理特殊单位
          const unit = specialUnitMap[match[2]] || match[2];
          return { 
            valueWithoutUnit: match[1], 
            unit 
          };
        } else if (match[2] && !isNaN(Number(match[2]))) {  // 只有范围值
          return { 
            valueWithoutUnit: `${match[1]}-${match[2]}`, 
            unit: "" 
          };
        } else {  // 只有数值
          return { 
            valueWithoutUnit: match[1], 
            unit: "" 
          };
        }
      }
    }
    
    return { valueWithoutUnit: value, unit: "" };
  };
  
  // 获取本地化文本并处理单位的函数
  const getLocalizedTextWithUnit = (obj?: { zh: string; en: string }, defaultUnit?: string) => {
    if (!obj) return '';
    
    const localizedText = isZh ? (obj.zh || '') : (obj.en || '');
    
    // 如果文本本身已经包含单位，使用extractUnit函数提取单位和值
    const { valueWithoutUnit, unit } = extractUnit(localizedText);
    
    // 使用提取的单位或者默认单位
    const displayUnit = unit || defaultUnit || '';
    
    // 返回格式化后的文本，确保单位与数值之间有一个空格
    if (displayUnit) {
      return `${valueWithoutUnit} ${displayUnit}`;
    }
    
    // 如果没有单位，直接返回值
    return valueWithoutUnit;
  };
  
  return (
    <Link href={productPath}>
      <div className="bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full">
        <div className="flex flex-col h-full">
          <div className="relative h-[280px] w-full mb-6 img-container">
            {/* 使用picture元素提供WebP图片和PNG回退方案 */}
            <picture>
              <source srcSet={placeholderImages.webp} type="image/webp" />
              <Image
                src={placeholderImages.png}
                alt={getLocalizedText(product.series)}
                fill
                loading={product.priority === 'high' ? 'eager' : 'lazy'}
                fetchPriority={product.priority || 'auto'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "contain" }}
                className="object-center"
              />
            </picture>
          </div>
          <div className={showDetails ? "" : "text-center"}>
            <h3 className="text-3xl font-bold text-[#333333] mb-2 border-b border-transparent group-hover:border-[#333333] inline-block transition-all">
              {getLocalizedText(product.series)}
            </h3>
            
            {/* 产品参数 */}
            {displayParameters.map((param, index) => (
              <div key={index} className="mt-3">
                <p className="text-base font-medium text-gray-600 mb-1">
                  {isZh ? param.label.zh : param.label.en}
                </p>
                <p className="text-lg">{getLocalizedTextWithUnit(param.value, param.unit)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
} 