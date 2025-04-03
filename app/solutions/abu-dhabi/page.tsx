'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function AbuDhabiCase() {
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
            label: { zh: "2025年阿布扎比铁矿项目", en: "2025 Abu Dhabi Iron Ore Project" }
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
                  {isZh ? "2025年阿布扎比铁矿项目" : "2025 Abu Dhabi Iron Project"}
                </h2>
                <div className="prose mt-8 lg:mt-10 text-black max-w-2xl">
                  <p className="text-lg md:text-xl">
                    {isZh 
                      ? "泽鑫矿山设备为阿联酋设计建造的现代化铁矿加工厂，年产能200万吨，采用智能化设备和工艺，成为中东地区矿业技术的标杆项目。"
                      : "Zexin Mining Equipment designed and built a modern iron ore processing plant for the UAE with an annual capacity of 2 million tons, utilizing intelligent equipment and processes, becoming a benchmark mining technology project in the Middle East region."}
                  </p>
                </div>
              </div>

              <div className="mt-6 md:mt-10">
                
              </div>
            </div>
            <div className="w-full h-full">
              <img 
                className="w-full h-full object-cover translate-x-8" 
                src="/images/case-studies/abu-dhabi.jpg" 
                alt={isZh ? "阿布扎比铁矿项目" : "Abu Dhabi Iron Ore Project"} 
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
                src="/images/case-studies/abu-dhabi/background.jpg"
                alt={isZh ? "阿布扎比铁矿项目" : "Abu Dhabi Iron Ore Project"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目背景" : "Background"}</h3>
            <p className="text-black mb-6">
              {isZh 
                ? "该项目位于阿联酋阿布扎比酋长国西部地区，是阿联酋政府为减少对石油依赖而开发的战略性铁矿资源项目。业主是阿联酋主权投资基金下属的矿业公司，项目需要建设中东地区最先进的铁矿石加工厂，实现铁矿资源高效开发利用。"
                : "Located in the western region of Abu Dhabi Emirate, UAE, this project is a strategic iron ore resource development initiated by the UAE government to reduce oil dependency. The owner is a mining company under the UAE sovereign investment fund, requiring the construction of the most advanced iron ore processing plant in the Middle East region to achieve efficient development and utilization of iron ore resources."}
            </p>
            
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目挑战" : "Challenges"}</h3>
            <p className="text-black">
              {isZh 
                ? "阿联酋缺乏矿业开发经验和技术人才，项目地处沙漠地区，环境恶劣，面临极端高温、沙尘暴和水资源极度匮乏等挑战。矿石中磷含量高，需要特殊工艺去除。业主要求项目配备最先进的自动化系统，实现\"无人化\"生产，并符合严格的国际环保标准。"
                : "The UAE lacks mining development experience and technical talent. The project is located in a desert area with harsh environmental conditions, facing challenges such as extreme high temperatures, sandstorms, and severe water scarcity. The ore contains high phosphorus content requiring special processes for removal. The owner required the project to be equipped with the most advanced automation systems to achieve 'unmanned' production while meeting strict international environmental standards."}
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
                ? "设计了适合中东地区高硅铁矿石特性的\"干式预处理-跳汰重选\"组合工艺流程。采用新型干式预处理技术降低水耗，跳汰机重选技术高效处理粗粒矿石，配合专利的脱磷工艺去除有害杂质。整个流程设计充分考虑了沙漠环境下水资源短缺的挑战，大幅提高了回收率和产品品位。"
                : "A combined 'dry pretreatment-jig concentration' process flow was designed to suit the high-silica iron ore characteristics of the Middle East region. New dry pretreatment technology was used to reduce water consumption, while jig concentration technology efficiently processes coarse ore particles, complemented by patented dephosphorization technology to remove harmful impurities. The entire process design fully considered the challenge of water scarcity in the desert environment, significantly improving recovery rate and product grade."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "设备配置" : "Equipment Configuration"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "主要设备包括：全智能颚式破碎机、弹簧圆锥破碎机、高效干式振动筛、大型跳汰机组、重介质旋流器、膜过滤系统等。跳汰机采用特殊设计的脉动系统，实现在低水耗条件下的高效分选。所有设备均针对极端沙漠环境设计，采用特殊密封和冷却系统。配备了领先的DCS自动控制系统和AI决策系统，实现远程操控和智能优化。"
                : "Main equipment includes: fully intelligent jaw crushers, spring cone crushers, high-efficiency dry vibrating screens, large-scale jig concentrator units, heavy medium cyclones, membrane filtration systems, etc. The jig concentrators use specially designed pulsation systems to achieve efficient separation under low water consumption conditions. All equipment is designed for extreme desert environments, employing special sealing and cooling systems. Advanced DCS automatic control and AI decision systems were installed to achieve remote operation and intelligent optimization."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "环保措施" : "Environmental Measures"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "采用湿式除尘系统，有效控制粉尘排放。采用高效浓密技术处理尾矿，实现尾矿高浓度排放和固液分离。项目能耗比传统工艺降低30%。"
                : "Wet dust removal systems effectively control dust emissions. High-efficiency thickening technology was used to process tailings, achieving high concentration discharge and solid-liquid separation. The project's energy consumption was reduced by 30% compared to traditional processes."}
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
            <p className="text-black">{isZh ? "产能全部达标，产品品质超越设计要求。" : "All capacity targets met, with product quality exceeding design requirements."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">98%</div>
            <p className="text-black">{isZh ? "水资源循环利用率，创造沙漠地区选矿新标杆。" : "Water recycling rate, creating a new benchmark for mineral processing in desert areas."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">90%</div>
            <p className="text-black">{isZh ? "自动化率，实现全流程智能控制和无人值守。" : "Automation rate, achieving whole-process intelligent control and unmanned operation."}</p>
          </div>
        </div>
        
        <div className="mt-12 bg-black text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{isZh ? "客户反馈" : "Client Feedback"}</h3>
          <p className="text-base lg:text-lg mb-10">
            {isZh 
              ? "泽鑫矿山设备为我们带来的不仅是一座现代化选矿厂，更是一整套先进的矿业技术和管理体系。他们的智能化解决方案完美适应了沙漠地区的艰苦环境，帮助我们解决了水资源短缺和高温等关键问题。该项目成为我们实现经济多元化的重要组成部分，也为中东地区矿业发展树立了新标准。" 
              : "Zexin Mining Equipment has brought us not just a modern mineral processing plant, but a complete set of advanced mining technology and management systems. Their intelligent solutions perfectly adapted to the harsh desert environment, helping us solve key issues such as water scarcity and high temperatures. The project has become an important part of our economic diversification and has set a new standard for mining development in the Middle East."}
          </p>
          <p className="mt-4 text-right font-bold">
            {isZh ? "— Mohammed Al Hashimi，阿联酋矿业投资公司CEO" : "— Mohammed Al Hashimi, CEO, UAE Mining Investment Company"}
          </p>
        </div>
      </PageSection>
    </div>
  );
} 