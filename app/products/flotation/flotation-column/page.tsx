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
  const productData = {
    name: {
      zh: '浮选柱',
      en: 'Flotation Column'
    },
    modelPrefix: 'BF',
    coverImage: '/images/products/flotation/flotation-column/cover.png',
    heroImage: '/images/products/flotation/flotation-column/hero.png',
    category: 'flotation',
    effectiveVolume: {
      min: 3,
      max: 100,
      unit: 'm³'
    },
    capacity: {
      min: 1.6,
      max: 40,
      unit: 'm³/min'
    },
    motorPower: {
      min: 5.5,
      max: 110,
      unit: 'kW'
    },
    overview: {
      zh: '浮选柱(BF型)是一种高效、节能的浮选设备，有效容积3-100 m³，处理能力1.6-40 m³/min，电机功率5.5-110 kW。该设备采用立式柱状结构设计，不含机械搅拌部件，通过气泡与矿浆的逆向流动实现矿物分选，具有占地面积小、选别效率高、回收率高等优点，特别适用于细粒级矿物的浮选提纯和精选作业。',
      en: 'The Flotation Column (BF series) is a high-efficiency and energy-saving flotation equipment with effective volume 3-100 m³, processing capacity 1.6-40 m³/min, and motor power 5.5-110 kW. This equipment adopts a vertical column structure design without mechanical stirring components, achieving mineral separation through counter-current flow of bubbles and slurry. It features a small footprint, high separation efficiency, and high recovery rate, making it particularly suitable for purification and cleaning operations of fine-grained minerals.'
    },
    specifications: {
      title: { zh: "技术参数", en: "Specifications" },
      columns: [
        {
          key: 'model',
          title: { zh: "型号", en: "Model" }
        },
        {
          key: 'effectiveVolume',
          title: { zh: "有效容积", en: "Effective Volume" },
          unit: 'm³'
        },
        {
          key: 'capacity',
          title: { zh: "处理能力", en: "Processing Capacity" },
          unit: 'm³/min'
        },
        {
          key: 'motorPower',
          title: { zh: "电机功率", en: "Motor Power" },
          unit: 'kW'
        }
      ],
      data: [
        { 
          model: 'BF-1.5',
          effectiveVolume: 3,
          capacity: 1.6,
          motorPower: 5.5
        },
        { 
          model: 'BF-2',
          effectiveVolume: 8,
          capacity: 4.3,
          motorPower: 11
        },
        { 
          model: 'BF-3',
          effectiveVolume: 18,
          capacity: 9.7,
          motorPower: 22
        },
        { 
          model: 'BF-4',
          effectiveVolume: 32,
          capacity: 17.2,
          motorPower: 37
        },
        { 
          model: 'BF-5',
          effectiveVolume: 50,
          capacity: 26.9,
          motorPower: 55
        },
        { 
          model: 'BF-6',
          effectiveVolume: 72,
          capacity: 38.7,
          motorPower: 75
        },
        { 
          model: 'BF-6.5',
          effectiveVolume: 100,
          capacity: 40,
          motorPower: 110
        }
      ]
    }
  };

  return (
    <ProductDetailTemplate 
      productId="flotation-column"
      model={productData.modelPrefix}
      series={productData.name}
      imagePath={productData.coverImage}
      overview={productData.overview}
      effectiveVolume={productData.effectiveVolume}
      capacity={productData.capacity}
      motorPower={productData.motorPower}
      specifications={productData.specifications}
    />
  );
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