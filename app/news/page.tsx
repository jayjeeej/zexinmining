'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function News() {
  const { isZh } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 第一屏：标题部分 */}
      <PageSection 
        noPadding
        variant="hero"
        isHero={true}
        breadcrumb={{
          items: [
            { label: { zh: "新闻动态", en: "News" } }
          ]
        }}
      >
        <div className="relative py-16 px-6 md:px-8 flex items-center min-h-[300px] max-w-[1200px] mx-auto">
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row gap-12 items-center justify-between w-full">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "新闻与媒体报道" : "News and Media"}
                </h1>
              </div>
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-right">
                  <p className="mb-12">
                    {isZh
                      ? "了解泽鑫矿山设备的最新发展动态，公司新闻和行业资讯。"
                      : "Learn about the latest developments of Zexin Mining Equipment, company news and industry information."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 新闻动态介绍 */}
      <section className="scroll-mt-32 bg-black text-white">
        <div className="not-prose max-w-[1200px] mx-auto">
          <div className="items-center py-8 px-6 md:px-8 md:py-20">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isZh ? "泽鑫新闻" : "Zexin News"}
              </h2>
              <p className="text-left text-white mt-16">
                {isZh ? "您可以在我们的网站上查找泽鑫矿山设备的相关信息。" : "You can find information about Zexin Mining Equipment on our website."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 公司新闻部分 */}
      <section className="bg-gray-50 scroll-mt-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 lg:py-16">
          <div className="grid last-of-type:mb-0 gap-8 md:auto-cols-fr md:grid-flow-col lg:gap-16">
            <div className="flex flex-col items-start justify-between gap-y-8 order-1 max-md:pb-16 pb-8 max-md:order-1">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                  {isZh ? "公司新闻" : "Company News"}
                </h2>
                <div className="prose mt-4 xl:prose-xl lg:mt-8">
                  <p className="text-lg">
                    {isZh 
                      ? "新闻正在更新中..."
                      : "News is being updated..."}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="w-full h-full overflow-hidden rounded-xs">
                <Image
                  src="/images/news/corporate-news.jpg"
                  alt={isZh ? "公司新闻" : "Company News"}
                  width={800}
                  height={800}
                  style={{ objectFit: "cover", width: "100%", height: "auto" }}
                  className="w-full rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 