import React from 'react';
import ProductDetailTemplate from '@/app/components/products/ProductDetailTemplate';
import { Metadata } from 'next';
import { parseRangeFromText } from '@/app/utils/productUtils';

export const metadata: Metadata = {
  title: '浮选柱 | 泽鑫矿山设备',
  description: '浮选柱(BF型)是一种高效、节能的浮选设备，采用立式柱状结构设计，不含机械搅拌部件，通过气泡与矿浆的逆向流动实现矿物分选，具有占地面积小、选别效率高、回收率高等优点。',
  alternates: {
    canonical: 'https://www.zexinmine.com/products/flotation/flotation-column',
    languages: {
      'en-US': 'https://www.zexinmine.com/en/products/flotation/flotation-column',
      'zh-CN': 'https://www.zexinmine.com/products/flotation/flotation-column',
    },
  },
};

export default function FloationColumn() {
  // This data is used as a backup if the fetch fails
  const backupData = {
    name: {
      zh: '浮选柱',
      en: 'Flotation Column'
    },
    modelPrefix: 'BF',
    coverImage: '/images/products/flotation/flotation-column/cover.jpg',
    heroImage: '/images/products/flotation/flotation-column/hero.jpg',
    category: 'flotation',
    overrideData: (data: any) => {
      return {
        ...data,
        overview: {
          zh: `浮选柱(BF型)是一种高效、节能的浮选设备，有效容积${data.effectiveVolume?.zh || '3-100 m³'}，处理能力${data.capacity?.zh || '1.6-40 m³/min'}，电机功率${data.motorPower?.zh || '5.5-110 kW'}。该设备采用立式柱状结构设计，不含机械搅拌部件，通过气泡与矿浆的逆向流动实现矿物分选，具有占地面积小、选别效率高、回收率高等优点，特别适用于细粒级矿物的浮选提纯和精选作业。`,
          en: `The Flotation Column (BF series) is a high-efficiency and energy-saving flotation equipment with effective volume ${data.effectiveVolume?.en || '3-100 m³'}, processing capacity ${data.capacity?.en || '1.6-40 m³/min'}, and motor power ${data.motorPower?.en || '5.5-110 kW'}. This equipment adopts a vertical column structure design without mechanical stirring components, achieving mineral separation through counter-current flow of bubbles and slurry. It features a small footprint, high separation efficiency, and high recovery rate, making it particularly suitable for purification and cleaning operations of fine-grained minerals.`
        }
      };
    },
    highlightFeatures: [
      {
        title: { zh: '高效节能', en: 'High Efficiency & Energy Saving' },
        description: { 
          zh: '无机械搅拌件，能耗低，处理能力大，精矿品位高，回收率高', 
          en: 'No mechanical stirring components, low energy consumption, high processing capacity, high concentrate grade and recovery rate' 
        },
        icon: 'efficiency'
      },
      {
        title: { zh: '结构优化', en: 'Optimized Structure' },
        description: { 
          zh: '立式柱状设计，占地面积小，选别区高度可达10米以上', 
          en: 'Vertical column design, small footprint, separation zone height can exceed 10 meters' 
        },
        icon: 'structural'
      },
      {
        title: { zh: '操作简便', en: 'Easy Operation' },
        description: { 
          zh: '各项参数易于调整，自动化程度高，可实现远程监控', 
          en: 'Easy parameter adjustment, high degree of automation, remote monitoring capability' 
        },
        icon: 'operation'
      }
    ],
    productParameters: [
      {
        title: { zh: '型号', en: 'Model' },
        dataKey: 'model'
      },
      {
        title: { zh: '有效容积', en: 'Effective Volume' },
        dataKey: 'effectiveVolume',
        unit: 'm³'
      },
      {
        title: { zh: '处理能力', en: 'Processing Capacity' },
        dataKey: 'capacity',
        unit: 'm³/min'
      },
      {
        title: { zh: '电机功率', en: 'Motor Power' },
        dataKey: 'motorPower',
        unit: 'kW'
      },
      {
        title: { zh: '充气方式', en: 'Aeration Method' },
        dataKey: 'aerationMethod'
      }
    ],
    models: [
      { 
        model: 'BF-1.5',
        effectiveVolume: { zh: '3', en: '3' },
        capacity: { zh: '1.6', en: '1.6' },
        motorPower: { zh: '5.5', en: '5.5' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      },
      { 
        model: 'BF-2',
        effectiveVolume: { zh: '8', en: '8' },
        capacity: { zh: '4.3', en: '4.3' },
        motorPower: { zh: '11', en: '11' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      },
      { 
        model: 'BF-3',
        effectiveVolume: { zh: '18', en: '18' },
        capacity: { zh: '9.7', en: '9.7' },
        motorPower: { zh: '22', en: '22' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      },
      { 
        model: 'BF-4',
        effectiveVolume: { zh: '32', en: '32' },
        capacity: { zh: '17.2', en: '17.2' },
        motorPower: { zh: '37', en: '37' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      },
      { 
        model: 'BF-5',
        effectiveVolume: { zh: '50', en: '50' },
        capacity: { zh: '26.9', en: '26.9' },
        motorPower: { zh: '55', en: '55' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      },
      { 
        model: 'BF-6',
        effectiveVolume: { zh: '72', en: '72' },
        capacity: { zh: '38.7', en: '38.7' },
        motorPower: { zh: '75', en: '75' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      },
      { 
        model: 'BF-6.5',
        effectiveVolume: { zh: '100', en: '100' },
        capacity: { zh: '40', en: '40' },
        motorPower: { zh: '110', en: '110' },
        aerationMethod: { zh: '外部供气', en: 'External Air Supply' }
      }
    ],
    effectiveVolume: {
      zh: '3-100 m³',
      en: '3-100 m³'
    },
    capacity: {
      zh: '1.6-40 m³/min',
      en: '1.6-40 m³/min'
    },
    motorPower: {
      zh: '5.5-110 kW',
      en: '5.5-110 kW'
    },
    overview: {
      zh: '浮选柱(BF型)是一种高效、节能的浮选设备，有效容积3-100 m³，处理能力1.6-40 m³/min，电机功率5.5-110 kW。该设备采用立式柱状结构设计，不含机械搅拌部件，通过气泡与矿浆的逆向流动实现矿物分选，具有占地面积小、选别效率高、回收率高等优点，特别适用于细粒级矿物的浮选提纯和精选作业。',
      en: 'The Flotation Column (BF series) is a high-efficiency and energy-saving flotation equipment with effective volume 3-100 m³, processing capacity 1.6-40 m³/min, and motor power 5.5-110 kW. This equipment adopts a vertical column structure design without mechanical stirring components, achieving mineral separation through counter-current flow of bubbles and slurry. It features a small footprint, high separation efficiency, and high recovery rate, making it particularly suitable for purification and cleaning operations of fine-grained minerals.'
    }
  };

  // 设置公司名称
  const companyName = {
    zh: "泽鑫矿山设备",
    en: "Zexin Mining Equipment"
  };

  return (
    <ProductDetailTemplate 
      productId={backupData.name?.en?.toLowerCase().replace(/\s+/g, '-') || 'flotation-column'}
      model={backupData.modelPrefix}
      series={backupData.name}
      imagePath={`/images/products/flotation/flotation-column.jpg`}
      overview={backupData.overview}
      effectiveVolume={{
        min: 3,
        max: 100,
        unit: 'm³'
      }}
      capacity={{
        min: 1.6,
        max: 40,
        unit: 'm³/min'
      }}
      motorPower={{
        min: 5.5,
        max: 110,
        unit: 'kW'
      }}
      specifications={{
        title: { zh: "技术参数", en: "Specifications" },
        columns: [],
        data: [],
        notes: []
      }}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return metadata;
}

// Format for extraction
export function getCapacityRange(productData: any) {
  try {
    // Try to extract from text first
    const extractedCapacity = productData.capacity ? 
      (typeof productData.capacity === 'string' ? 
        parseRangeFromText(productData.capacity, 1.6, 40, 'm³/min') : 
        (productData.capacity.zh ? 
          parseRangeFromText(productData.capacity.zh, 1.6, 40, 'm³/min') : 
          { min: 1.6, max: 40, unit: 'm³/min' }
        )
      ) : 
      { min: 1.6, max: 40, unit: 'm³/min' };
    
    return extractedCapacity;
  } catch (error) {
    console.error('Error in getCapacityRange:', error);
    return { min: 1.6, max: 40, unit: 'm³/min' };
  }
} 