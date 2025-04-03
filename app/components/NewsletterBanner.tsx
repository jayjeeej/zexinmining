'use client';

import { useLanguage } from "../contexts/LanguageContext";

export default function NewsletterBanner() {
  const { isZh } = useLanguage();

  return (
    <div className="bg-[#BEAF93] py-8">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 md:max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {isZh ? "泽鑫矿山设备 - 品质与创新的典范" : "Zexin Mining - Excellence in Quality and Innovation"}
            </h2>
            <p className="text-black text-lg font-normal">
              {isZh 
                ? "我们致力于为全球矿业提供高效、可靠的解决方案，以专业技术和卓越服务赢得客户信赖" 
                : "We are committed to providing efficient and reliable solutions for the global mining industry, earning customer trust through professional expertise and excellent service"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 