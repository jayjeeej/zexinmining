'use client';

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function SagBallMillPage() {
  const { isZh } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isZh ? "SAG磨矿机和球磨机" : "SAG Mills and Ball Mills"}
      </h1>
      
      <p className="mb-8 text-lg text-gray-700">
        {isZh 
          ? "泽鑫矿山设备专业生产SAG磨矿机和球磨机，为矿石粉碎和研磨提供高效可靠的解决方案。我们的磨矿设备采用先进技术，确保卓越的性能和长期可靠性。" 
          : "Zexin Mining Equipment specializes in manufacturing SAG mills and ball mills, providing efficient and reliable solutions for ore crushing and grinding. Our grinding equipment uses advanced technology to ensure excellent performance and long-term reliability."}
      </p>
    </div>
  );
} 