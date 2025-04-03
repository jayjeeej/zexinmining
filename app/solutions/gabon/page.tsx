'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function GabonCase() {
  const { isZh } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 面包屑导航 */}
      <div className="container mx-auto px-4 max-w-[1200px] my-6">
        <Breadcrumb items={[
          {
            label: { zh: "矿山总承包服务", en: "Mining EPC Services" },
            href: "/solutions"
          },
          {
            label: { zh: "成功案例", en: "Case Studies" },
            href: "/solutions#case-studies"
          },
          {
            label: { zh: "2022年加蓬锰矿项目", en: "2022 Gabon Manganese Project" }
          }
        ]} />
      </div>

      {/* 第一屏：主要内容 - 参考布局 */}
      <section className="mb-4 lg:mb-8 last-of-type:mb-0 bg-[#F7F5F1] scroll-mt-32"
        data-block="splitimage">
        <div className="md:contain md:py-12 lg:py-20 text-[#333333]">
          <div className="grid last-of-type:mb-0 gap-12 md:grid-cols-2 lg:gap-20">
            <div className="w-full flex flex-col items-start justify-between gap-y-10 order-1 max-md:pb-16 pb-8 max-md:contain max-md:order-1">
              <strong className="mb-4 md:mb-6 text-xl">
                
              </strong>
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-balance text-[#A08C64] leading-tight font-bold">
                  {isZh ? "2022年加蓬铁矿项目" : "2022 Gabon Iron Ore Project"}
                </h2>
                <div className="prose mt-8 lg:mt-10 text-black max-w-2xl">
                  <p className="text-lg md:text-xl">
                    {isZh 
                      ? "泽鑫矿山设备为塔塔集团在加蓬设计并建设的大型锰矿加工厂，年产能200万吨，采用创新工艺和装备，实现了锰矿资源的高效开发利用。"
                      : "Zexin Mining Equipment designed and built a large-scale manganese processing plant for the Tata Group in Gabon, with an annual capacity of 2 million tons, utilizing innovative technology and equipment to achieve efficient development and utilization of manganese resources."}
                  </p>
                </div>
              </div>

              <div className="mt-6 md:mt-10">
                
              </div>
            </div>
            <div className="w-full h-full">
              <img 
                className="w-full h-full object-cover translate-x-8" 
                src="/images/case-studies/gabon.jpg" 
                alt={isZh ? "加蓬锰矿项目" : "Gabon Manganese Project"} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 项目概述 */}
      <PageSection variant="white" className="pt-0">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div className="relative h-80 w-full overflow-hidden rounded-lg">
              <Image
                src="/images/case-studies/gabon/background.jpg"
                alt={isZh ? "加蓬锰矿项目" : "Gabon Manganese Project"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目背景" : "Background"}</h3>
            <p className="text-black mb-6">
              {isZh 
                ? "加蓬拥有世界级锰矿资源，该项目位于加蓬莫安达省，由印度塔塔集团投资开发。项目需要建设一座现代化锰矿选矿厂，处理当地高品位但含杂质较多的锰矿资源，提供符合冶金工业标准的优质锰精矿。"
                : "Gabon possesses world-class manganese resources. This project, located in Moanda Province, Gabon, was invested and developed by India's Tata Group. The project required the construction of a modern manganese processing plant to process local high-grade but impurity-rich manganese ore resources, providing high-quality manganese concentrate that meets metallurgical industry standards."}
            </p>
            
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目挑战" : "Challenges"}</h3>
            <p className="text-black">
              {isZh 
                ? "当地基础设施落后，气候湿热多雨，为项目建设和设备运行带来挑战。锰矿中的铁、硅、铝等杂质含量较高，需要特殊的选矿工艺。同时，项目业主要求严格的环保标准，尾矿处理和水资源利用需要创新解决方案。"
                : "The local infrastructure was underdeveloped, and the climate was humid with frequent rainfall, posing challenges for project construction and equipment operation. The manganese ore contained high levels of impurities such as iron, silicon, and aluminum, requiring specialized processing techniques. Additionally, the project owner demanded strict environmental standards, necessitating innovative solutions for tailings management and water resource utilization."}
            </p>
          </div>
        </div>
      </PageSection>

      {/* 解决方案 */}
      <PageSection variant="white">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "解决方案" : "Solutions"}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "工艺设计" : "Process Design"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "根据加蓬锰矿特性，设计了包括破碎、洗矿、重选等工序的加工流程。采用两段洗矿工艺去除黏土和细泥，跳汰机重选工艺高效处理粗粒度锰矿，实现品位提升和杂质去除，确保最终产品满足冶金工业的严格要求。"
                : "Based on the characteristics of Gabonese manganese ore, a processing flow including crushing, washing, and gravity separation was designed. A two-stage washing process was adopted to remove clay and fine mud, while jig concentration efficiently processes coarse-grained manganese ore, achieving grade improvement and impurity removal, ensuring the final product meets the strict requirements of the metallurgical industry."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "设备配置" : "Equipment Configuration"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "主要设备包括：大型颚式破碎机、液压圆锥破碎机、湿式滚筒洗矿机、螺旋分级机、大型跳汰机组、高效浓密机等。所有设备均考虑热带雨林气候特点，采用防腐蚀、防潮设计，并配备完善的备用系统确保稳定运行。跳汰机采用最新的变频驱动和智能控制技术，实现对不同密度矿物的精确分选。"
                : "Main equipment includes: large jaw crushers, hydraulic cone crushers, wet drum washers, spiral classifiers, large-scale jig concentrator units, high-efficiency thickeners, etc. All equipment considers the characteristics of the tropical rainforest climate, adopting corrosion-resistant and moisture-proof designs, and equipped with comprehensive backup systems to ensure stable operation. The jig concentrators use the latest variable frequency drive and intelligent control technology to achieve precise separation of minerals with different densities."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "环保措施" : "Environmental Measures"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "采用湿式除尘系统，有效控制粉尘排放。采用高效浓密和压滤技术处理尾矿，实现尾矿干堆。设计了雨水收集系统和水处理系统，使生产用水实现95%的循环利用率，大幅减少对当地淡水资源的消耗。"
                : "Wet dust removal systems effectively control dust emissions. High-efficiency thickening and pressure filtration technologies were used to process tailings, achieving dry stacking. A rainwater collection system and water treatment system were designed to achieve a 95% recycling rate of production water, significantly reducing consumption of local freshwater resources."}
            </p>
          </div>
        </div>
      </PageSection>
      
      {/* 项目成果 */}
      <PageSection variant="white">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "项目成果" : "Project Results"}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">{isZh ? "200万吨/年" : "2 million tons/year"}</div>
            <p className="text-black">{isZh ? "设计产能全部达标，提前3个月完成项目建设。" : "All design capacity targets were met, completing the project 3 months ahead of schedule."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">95%</div>
            <p className="text-black">{isZh ? "水资源循环利用率，远高于行业平均水平。" : "Water recycling rate, far exceeding the industry average."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">48.5%</div>
            <p className="text-black">{isZh ? "锰精矿平均品位，满足高端冶金工业需求。" : "Average manganese concentrate grade, meeting high-end metallurgical industry demands."}</p>
          </div>
        </div>
        
        <div className="mt-12 bg-black text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{isZh ? "客户反馈" : "Client Feedback"}</h3>
          <p className="text-lg italic">
            {isZh 
              ? "\"泽鑫矿山设备团队展现了卓越的技术能力和项目管理水平。他们针对我们的特殊需求提供了定制化解决方案，不仅实现了产能目标，还通过创新的环保措施大幅减少了项目的环境足迹。该项目已成为我们在非洲地区的标杆工程。\""
              : "\"The Zexin Mining Equipment team demonstrated exceptional technical capabilities and project management skills. They provided customized solutions for our specific needs, not only achieving capacity targets but also significantly reducing the project's environmental footprint through innovative eco-friendly measures. This project has become a benchmark for our operations in Africa.\""}
          </p>
          <p className="mt-4 text-right font-bold">
            {isZh ? "— Rajesh Kumar Patel，塔塔集团项目总监" : "— Rajesh Kumar Patel, Project Director, Tata Group"}
          </p>
        </div>
      </PageSection>
    </div>
  );
} 