'use client';

import React from 'react';
import { useLanguage } from "@/app/contexts/LanguageContext";
import ProductStructuredData from "@/app/components/ProductStructuredData";
import ProductDescription from "@/app/components/ProductDescription";

interface MagneticSeparatorClientProps {
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  keyFeaturesZh: string[];
  keyFeaturesEn: string[];
  applicationsZh: string[];
  applicationsEn: string[];
}

export default function MagneticSeparatorClient({
  nameZh,
  nameEn,
  descriptionZh,
  descriptionEn,
  keyFeaturesZh,
  keyFeaturesEn,
  applicationsZh,
  applicationsEn
}: MagneticSeparatorClientProps) {
  const { isZh } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 添加结构化数据 - 对页面布局没有视觉影响 */}
      <ProductStructuredData
        name={isZh ? nameZh : nameEn}
        description={isZh ? descriptionZh : descriptionEn}
        image="/images/products/magnetic-separation/magnetic-separator.png"
        category={isZh ? "磁选设备" : "Magnetic Separation Equipment"}
        url="/products/magnetic-separator"
      />
      
      {/* 使用语义化的产品描述组件 */}
      <ProductDescription
        titleZh={nameZh}
        titleEn={nameEn}
        descriptionZh={descriptionZh}
        descriptionEn={descriptionEn}
        keyFeaturesZh={keyFeaturesZh}
        keyFeaturesEn={keyFeaturesEn}
        applicationsZh={applicationsZh}
        applicationsEn={applicationsEn}
      />
    </div>
  );
} 