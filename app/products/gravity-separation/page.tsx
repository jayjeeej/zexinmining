import React from 'react';
import { generateCategoryMetadata } from "@/app/utils/seo";
import GravitySeparationClient from '@/app/components/products/GravitySeparationClient';

// 添加页面专用SEO元数据
export const metadata = generateCategoryMetadata({
  titleZh: "重选设备 | 高效选矿分离设备",
  titleEn: "Gravity Separation Equipment | Efficient Mineral Separation",
  descriptionZh: "泽鑫矿山设备提供全系列重选设备，包括摇床、跳汰机、离心机和螺旋溜槽，适用于金、锡、钨、钽铌等矿石分选，具有高效率、低能耗、环保等优点。",
  descriptionEn: "Zexin Mining Equipment offers a complete range of gravity separation equipment including shaking tables, jigs, centrifuges and spiral chutes for gold, tin, tungsten and tantalum-niobium ore separation, featuring high efficiency, low energy consumption and environmental benefits.",
  keywords: ["重选设备", "摇床", "跳汰机", "螺旋溜槽", "离心选矿机", "gravity separation", "shaking table", "jig", "spiral chute", "centrifugal separator"],
  slug: "gravity-separation"
});

// 重选设备产品列表页面
export default function GravitySeparationPage() {
  // 重选设备分类描述
  const titleZh = "重选设备";
  const titleEn = "Gravity Separation Equipment";
  const descriptionZh = "利用矿物比重差进行分选的设备，包括摇床、跳汰机、离心机和螺旋溜槽等。我们的重选设备适用于金、锡、钨等矿石的选别，具有高效率、低能耗、环保等优点。";
  const descriptionEn = "Equipment that separates minerals based on specific gravity differences, including shaking tables, jigs, centrifuges, and spiral chutes. Our gravity separation equipment is suitable for gold, tin, tungsten and other ore separation, with high efficiency, low energy consumption, and environmental protection advantages.";

  return (
    <GravitySeparationClient
      titleZh={titleZh}
      titleEn={titleEn}
      descriptionZh={descriptionZh}
      descriptionEn={descriptionEn}
    />
  );
} 