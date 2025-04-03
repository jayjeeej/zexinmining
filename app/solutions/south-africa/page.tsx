'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function SouthAfricaCase() {
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
            label: { zh: "2021年南非锰矿项目", en: "2021 South Africa Manganese Project" }
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
                  {isZh ? "2021年南非锰矿项目" : "2021 South Africa Manganese Project"}
                </h2>
                <div className="prose mt-8 lg:mt-10 text-black max-w-2xl">
                  <div className="text-base lg:text-lg mb-10">
                    {isZh 
                      ? "泽鑫矿山设备为南非客户提供的年产150万吨锰矿生产线，从设计到安装调试全程参与，实现了高效稳定的锰矿加工，达到国际先进水平。"
                      : "Zexin Mining Equipment provided a manganese ore production line with an annual capacity of 1.5 million tons for South African clients. From design to installation and commissioning, the project achieved efficient and stable manganese ore processing, reaching international advanced standards."}
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-10">
                
              </div>
            </div>
            <div className="w-full h-full">
              <img 
                className="w-full h-full object-cover translate-x-8" 
                src="/images/case-studies/south-africa.jpg" 
                alt={isZh ? "南非锰矿项目" : "South Africa Manganese Project"} 
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
                src="/images/case-studies/south-africa/background.jpg"
                alt={isZh ? "南非锰矿项目" : "South Africa Manganese Project"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目背景" : "Background"}</h3>
            <p className="text-black mb-6">
              {isZh 
                ? "南非拥有世界最大的锰矿储量，该项目位于库鲁曼地区，是一个重要的锰矿开采和加工基地。客户需要一条年产150万吨的高效锰矿处理生产线，以满足日益增长的全球市场需求。"
                : "South Africa has the world's largest manganese ore reserves. This project is located in the Kuruman area, an important manganese mining and processing base. The client needed an efficient manganese ore processing line with an annual capacity of 1.5 million tons to meet the growing global market demand."}
            </p>
            
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目挑战" : "Challenges"}</h3>
            <p className="text-black">
              {isZh 
                ? "项目地区基础设施有限，且距离主要港口较远，物流运输困难。当地水资源有限，需要高效的水资源循环利用方案。客户对设备可靠性和产品质量有严格要求，同时希望实现较低的运营成本。"
                : "The project area had limited infrastructure and was far from major ports, making logistics and transportation difficult. Local water resources were limited, requiring an efficient water recycling solution. The client had strict requirements for equipment reliability and product quality, while hoping to achieve low operating costs."}
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
                ? "根据南非锰矿特性，设计了包括破碎、筛分、洗矿和分级等工序的加工流程。采用一段破碎、多级筛分和跳汰机重选工艺，充分适应粗粒度锰矿处理需求，确保产品粒度分布合理，满足冶炼要求。"
                : "Based on the characteristics of South African manganese ore, we designed a processing flow that includes crushing, screening, washing, and classification. A single-stage crushing, multi-stage screening and jig concentration process was adopted to fully accommodate coarse-grained manganese ore processing requirements, ensuring reasonable product particle size distribution and meeting smelting requirements."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "设备配置" : "Equipment Configuration"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "主要设备包括：颚式破碎机、振动筛、螺旋洗矿机、跳汰机、旋流器组、压滤机等。所有设备均采用高耐磨材料制造，以应对锰矿的高硬度和磨蚀性。跳汰机采用先进的自动控制系统，实现精确的重选分离。同时配备了备用电源系统，确保生产线稳定运行。"
                : "Main equipment includes: jaw crusher, vibrating screen, spiral washer, jig concentrator, cyclone group, filter press, etc. All equipment is manufactured with high wear-resistant materials to cope with the high hardness and abrasiveness of manganese ore. The jig concentrator features an advanced automatic control system to achieve precise gravity separation. A backup power system is also equipped to ensure stable operation of the production line."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "环保措施" : "Environmental Measures"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "采用湿式除尘系统，有效控制粉尘排放。采用高效浓密技术处理尾矿，实现尾矿高浓度排放和固液分离。建设了完善的水处理系统，生产用水循环利用率达到90%以上。"
                : "Wet dust removal systems effectively control dust emissions. High-efficiency thickening technology was used to process tailings, achieving high concentration discharge and solid-liquid separation. A comprehensive water treatment system was built, achieving a water recycling rate of over 90% in production."}
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
            <div className="text-4xl font-bold text-[#A08C64] mb-4">{isZh ? "150万吨/年" : "1.5 million tons/year"}</div>
            <p className="text-black">{isZh ? "年产能达到设计要求，生产线运行稳定。" : "Annual capacity reached design requirements with stable production line operation."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">98%</div>
            <p className="text-black">{isZh ? "设备可用率，超过行业平均水平。" : "Equipment availability, exceeding the industry average."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">85%</div>
            <p className="text-black">{isZh ? "水资源循环利用率，降低环境影响。" : "Water recycling rate, reducing environmental impact."}</p>
          </div>
        </div>
        
        <div className="mt-12 bg-black text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{isZh ? "客户反馈" : "Client Feedback"}</h3>
          <blockquote className="text-lg italic text-gray-700">
            {isZh 
              ? "\"泽鑫矿山设备团队的专业性和响应速度给我们留下了深刻印象。他们不仅提供了高质量的设备，还为我们解决了生产过程中的各种技术问题。这条生产线的顺利运行显著提高了我们的生产效率和产品质量，我们期待与泽鑫的进一步合作。\""
              : "\"We were impressed by the professionalism and response speed of the Zexin Mining Equipment team. They not only provided high-quality equipment but also solved various technical problems in our production process. The smooth operation of this production line has significantly improved our production efficiency and product quality, and we look forward to further cooperation with Zexin.\""}
          </blockquote>
          <p className="mt-4 text-right font-bold">
            {isZh ? "— Michael van der Merwe，南非矿业公司总经理" : "— Michael van der Merwe, General Manager, South African Mining Company"}
          </p>
        </div>
      </PageSection>
    </div>
  );
} 