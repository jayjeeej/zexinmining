import { useLanguage } from "@/app/contexts/LanguageContext";

export default function MagneticSeparatorPage() {
  const { isZh } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isZh ? "磁选设备" : "Magnetic Separation Equipment"}
      </h1>
      
      <p className="mb-8 text-lg text-gray-700">
        {isZh 
          ? "泽鑫矿山设备提供全系列磁选设备，包括干式磁选机、湿式磁选机、强磁选机和永磁筒式磁选机，满足不同矿石磁选工艺需求。" 
          : "Zexin Mining Equipment provides a complete range of magnetic separation equipment, including dry magnetic separators, wet magnetic separators, high-intensity magnetic separators, and permanent magnetic drum separators to meet different ore magnetic separation process requirements."}
      </p>
    </div>
  );
} 