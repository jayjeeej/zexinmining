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
    // 浮选设备特有参数
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
    // 磁选设备特有参数
    magneticIntensity?: {
      zh: string;
      en: string;
    };
    magneticFieldStrength?: {
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
    isMagneticSeparationProduct?: boolean;
    voltage?: {
      zh: string;
      en: string;
    };
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
  const getPlaceholderImage = (): string => {
    // 判断是否提供了图片路径
    if (product.image) return product.image;
    
    // 根据产品ID判断类型
    if (product.isCrusherProduct || product.id.includes('crusher') || 
        (product.series?.zh?.includes('破碎机') || product.series?.en?.includes('Crusher'))) {
      return `/images/products/crushers/${product.id}.png`;
    } else if (product.isScreenProduct || product.id.includes('screen') || 
        (product.series?.zh?.includes('振动筛') || product.series?.en?.includes('Screen'))) {
      return `/images/products/screens/${product.id}.png`;
    } else if (product.isClassifierProduct || product.id.includes('classifier') || 
        (product.series?.zh?.includes('分级机') || product.series?.en?.includes('Classifier'))) {
      return `/images/products/classification-equipment/${product.id}.png`;
    } else if (product.isWasherProduct || product.id.includes('washer') || 
        (product.series?.zh?.includes('洗矿机') || product.series?.en?.includes('Washer'))) {
      // 为特定的洗矿机类型提供明确的路径
      if (product.id === 'spiral-washer') {
        return '/images/products/washers/spiral-washer.png';
      } else if (product.id === 'double-spiral-washer') {
        return '/images/products/washers/double-spiral-washer.png';
      } else if (product.id === 'drum-washer') {
        return '/images/products/washers/drum-washer.png';
      } else {
        return `/images/products/washers/${product.id}.png`;
      }
    } else if (product.id.includes('mill') || 
        (product.series?.zh?.includes('球磨机') || product.series?.zh?.includes('棒磨机') || 
         product.series?.en?.includes('Ball Mill') || product.series?.en?.includes('Rod Mill'))) {
      return `/images/products/grinding/${product.id}.png`;
    } else if (product.isFeederProduct || product.id.includes('feeder') || 
        (product.series?.zh?.includes('给料') || product.series?.en?.includes('Feeder'))) {
      return `/images/products/feeders/${product.id}.png`;
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
      return `/images/products/gravity-separation/${product.id}.png`;
    } else {
      // 默认占位图
      return '/images/products/placeholder.png';
    }
  };
  
  // 使用占位符图片
  const placeholderImage = getPlaceholderImage();
  
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
    
    const isMagneticSeparation = product.isMagneticSeparationProduct || 
                   product.id?.includes('magnetic') || 
                   (product.series?.zh?.includes('磁选') || product.series?.en?.includes('Magnetic'));
    
    // 磁选设备特有参数显示
    if (isMagneticSeparation) {
      // 1. 处理能力 - 最高优先级
      if (product.capacity?.zh || product.capacity?.en) {
        params.push({
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: product.capacity
        });
      }
      
      // 2. 电机功率 - 第二优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower
        });
      }
      
      // 3. 磁场强度/电压 - 第三优先级 (检查所有可能的属性名)
      if (product.magneticFieldStrength?.zh || product.magneticFieldStrength?.en) {
        params.push({
          label: { zh: "磁场强度", en: "Magnetic Field Strength" },
          value: product.magneticFieldStrength
        });
      } else if (product.magneticIntensity?.zh || product.magneticIntensity?.en) {
        params.push({
          label: { zh: "磁场强度", en: "Magnetic Intensity" },
          value: product.magneticIntensity
        });
      } else if (product.voltage?.zh || product.voltage?.en) {
        // 对于电选设备，显示电压
        params.push({
          label: { zh: "电压", en: "Voltage" },
          value: product.voltage
        });
      }
    }
    // 浮选设备特有参数显示
    else if (isFlotation) {
      // 1. 有效容积 - 最高优先级
      if (product.effectiveVolume?.zh || product.effectiveVolume?.en) {
        params.push({
          label: { zh: "有效容积", en: "Effective Volume" },
          value: product.effectiveVolume
        });
      }
      
      // 2. 处理能力 - 第二优先级
      if (product.capacity?.zh || product.capacity?.en) {
        params.push({
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: product.capacity
        });
      }
      
      // 3. 电机功率 - 第三优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower
        });
      }
    }
    // 分级机特有参数优先显示
    else if (isClassifier) {
      // 1. 返砂处理能力 - 最高优先级
      if (product.sandReturnCapacity?.zh || product.sandReturnCapacity?.en) {
        params.push({
          label: { zh: "返砂处理能力", en: "Sand Return Capacity" },
          value: product.sandReturnCapacity
        });
      }
      
      // 2. 溢流处理能力 - 第二优先级
      if (product.overflowCapacity?.zh || product.overflowCapacity?.en) {
        params.push({
          label: { zh: "溢流处理能力", en: "Overflow Capacity" },
          value: product.overflowCapacity
        });
      }
      
      // 3. 电机功率 - 第三优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower
        });
      }
    } 
    // 重选设备特有参数显示
    else if (isGravitySeparation) {
      // 1. 处理能力 - 最高优先级
      if (product.capacity?.zh || product.capacity?.en) {
        params.push({
          label: { zh: "处理能力", en: "Processing Capacity" },
          value: product.capacity
        });
      }
      
      // 2. 电机功率 - 第二优先级
      if (product.motorPower?.zh || product.motorPower?.en) {
        params.push({
          label: { zh: "电机功率", en: "Motor Power" },
          value: product.motorPower
        });
      }
      
      // 3. 进料尺寸 - 第三优先级
      if (product.feedSize?.zh || product.feedSize?.en) {
        params.push({
          label: { zh: "进料尺寸", en: "Feed Size" },
          value: product.feedSize
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
          value: product.motorPower
        });
      }
      
      // 3. 根据产品类型显示不同的第三参数
      if (isCrusher && (product.feedSize?.zh || product.feedSize?.en)) {
        // 对于破碎机，显示最大进料口
        params.push({
          label: { zh: "最大进料尺寸", en: "Max. Feed Size" },
          value: product.feedSize
        });
      } else if (isScreen && (product.screenSize?.zh || product.screenSize?.en)) {
        // 对于振动筛，显示筛网面积
        params.push({
          label: { zh: "筛网面积", en: "Screen Area" },
          value: product.screenSize
        });
      } else if (isScreen && (product.aperture?.zh || product.aperture?.en)) {
        // 如果振动筛没有筛网面积但有筛孔尺寸，显示筛孔尺寸
        params.push({
          label: { zh: "筛孔尺寸", en: "Aperture Size" },
          value: product.aperture
        });
      } else if (isWasher && (product.spiralDiameter?.zh || product.spiralDiameter?.en)) {
        // 对于螺旋洗矿机，显示螺旋直径
        params.push({
          label: { zh: "螺旋直径", en: "Spiral Diameter" },
          value: product.spiralDiameter
        });
      } else if (isWasher && (product.drumDiameter?.zh || product.drumDiameter?.en)) {
        // 对于滚筒洗矿机，显示滚筒直径
        params.push({
          label: { zh: "滚筒直径", en: "Drum Diameter" },
          value: product.drumDiameter
        });
      }
    }
    
    // 最多显示3个参数
    return params.slice(0, 3);
  };
  
  // 获取要显示的参数
  const displayParameters = showDetails ? getDisplayParameters() : [];
  
  return (
    <Link href={productPath}>
      <div className="bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full">
        <div className="flex flex-col h-full">
          <div className="relative h-[280px] w-full mb-6">
            <Image
              src={placeholderImage}
              alt={getLocalizedText(product.series)}
              fill
              style={{ objectFit: "contain" }}
              className="object-center"
            />
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
                <p className="text-lg">{getLocalizedText(param.value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
} 