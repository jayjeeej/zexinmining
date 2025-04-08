import { useLanguage } from "@/app/contexts/LanguageContext";
import { generateProductMetadata } from "@/app/utils/seo";
import ProductStructuredData from "@/app/components/ProductStructuredData";
import ProductDescription from "@/app/components/ProductDescription";

// 添加页面专用SEO元数据
export const metadata = generateProductMetadata({
  titleZh: "磁选设备 | 高效矿石分选设备",
  titleEn: "Magnetic Separation Equipment | Efficient Ore Separation",
  descriptionZh: "泽鑫矿山设备提供全系列磁选设备，包括干式磁选机、湿式磁选机、强磁选机和永磁筒式磁选机，满足不同矿石磁选工艺需求。",
  descriptionEn: "Zexin Mining Equipment provides a complete range of magnetic separation equipment, including dry magnetic separators, wet magnetic separators, high-intensity magnetic separators, and permanent magnetic drum separators.",
  keywords: ["磁选设备", "磁选机", "永磁筒式磁选机", "强磁选机", "magnetic separator", "magnetic drum", "ore separation"],
  slug: "magnetic-separator",
  category: "magnetic-separation"
});

export default function MagneticSeparatorPage() {
  const { isZh } = useLanguage();
  
  // 产品描述文本
  const nameZh = "磁选设备";
  const nameEn = "Magnetic Separation Equipment";
  const descriptionZh = "泽鑫矿山设备提供全系列磁选设备，包括干式磁选机、湿式磁选机、强磁选机和永磁筒式磁选机，满足不同矿石磁选工艺需求。我们的磁选设备采用先进技术，确保高效分选和长期可靠性。";
  const descriptionEn = "Zexin Mining Equipment provides a complete range of magnetic separation equipment, including dry magnetic separators, wet magnetic separators, high-intensity magnetic separators, and permanent magnetic drum separators to meet different ore magnetic separation process requirements. Our magnetic separation equipment uses advanced technology to ensure efficient separation and long-term reliability.";
  
  // 产品特点
  const keyFeaturesZh = [
    "高效分选能力，磁性矿物回收率高",
    "能耗低，运行成本经济",
    "适用于各种矿石的干湿选别",
    "结构紧凑，占地面积小",
    "操作简便，维护容易"
  ];
  
  const keyFeaturesEn = [
    "High-efficiency separation with high recovery rate of magnetic minerals",
    "Low energy consumption and economical operating costs",
    "Suitable for dry and wet separation of various ores",
    "Compact structure with small footprint",
    "Easy operation and maintenance"
  ];
  
  // 应用领域
  const applicationsZh = [
    "铁矿石选矿",
    "锰矿石选矿",
    "稀土矿选矿",
    "煤矿洗选",
    "陶瓷原料提纯"
  ];
  
  const applicationsEn = [
    "Iron ore beneficiation",
    "Manganese ore beneficiation",
    "Rare earth mineral separation",
    "Coal washing and cleaning",
    "Ceramic material purification"
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 添加结构化数据 - 对页面布局没有视觉影响 */}
      <ProductStructuredData
        name={isZh ? nameZh : nameEn}
        description={isZh ? descriptionZh : descriptionEn}
        image="/images/products/magnetic-separation/magnetic-separator.jpg"
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