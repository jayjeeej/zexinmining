'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function ChangjiangCase() {
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
            label: { zh: "2024年昌江铁矿项目", en: "2024 Changjiang Iron Ore Project" }
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
                  {isZh ? "2024年昌江铁矿项目" : "2024 Changjiang Iron Ore Project"}
                </h2>
                <div className="prose mt-8 lg:mt-10 text-black max-w-2xl">
                  <p className="text-lg md:text-xl">
                    {isZh 
                      ? "泽鑫矿山设备为昌江设计建造的特大型铁矿加工厂，年产能300万吨，采用自动化控制系统和先进工艺，成为中国铁矿加工技术的标杆。" : 
                      "Zexin Mining Equipment designed and built an extra-large iron ore processing plant for Changjiang with an annual capacity of 3 million tons, using automated control systems and advanced processes, becoming a benchmark for iron ore processing technology in China."}
                  </p>
                </div>
              </div>

              <div className="mt-6 md:mt-10">
                
              </div>
            </div>
            <div className="w-full h-full">
              <img 
                className="w-full h-full object-cover translate-x-8" 
                src="/images/case-studies/changjiang.jpg" 
                alt={isZh ? "昌江铁矿项目" : "Changjiang Iron Ore Project"} 
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
                src="/images/case-studies/changjiang/background.jpg"
                alt={isZh ? "昌江铁矿项目" : "Changjiang Iron Ore Project"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目背景" : "Background"}</h3>
            <p className="text-black mb-6">
              {isZh 
                ? "该项目位于海南省昌江县，是国家重点发展的大型铁矿资源综合利用项目。业主是国内知名的国有钢铁企业，拥有丰富的铁矿资源，但矿石品位偏低且杂质含量高，传统选矿工艺难以实现经济高效的资源利用。"
                : "Located in Changjiang County, Hainan Province, this project is a key national large-scale iron ore resource comprehensive utilization project. The owner is a well-known state-owned steel enterprise with abundant iron ore resources, but the ore grade is relatively low with high impurity content, making it difficult for traditional mineral processing technologies to achieve economically efficient resource utilization."}
            </p>
            
            <h3 className="text-2xl font-bold text-[#333333] mb-4">{isZh ? "项目挑战" : "Challenges"}</h3>
            <p className="text-black">
              {isZh 
                ? "原生矿石品位仅为28-32%，且含有较高的硅、铝、硫、磷等有害杂质。项目地处热带沿海地区，面临台风、海水腐蚀等自然风险。当地环保和水资源要求严格，需要满足新的\"绿色矿山\"建设标准。同时，业主还要求实现矿山的数字化、智能化管理。"
                : "The primary ore grade was only 28-32%, with high levels of harmful impurities such as silicon, aluminum, sulfur, and phosphorus. The project is located in a tropical coastal area, facing natural risks such as typhoons and seawater corrosion. Local environmental protection and water resource requirements are strict, necessitating compliance with new 'green mining' construction standards. Additionally, the owner required digital and intelligent mine management implementation."}
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
                ? "采用了创新的粗粒级跳汰重选工艺流程，结合高效筛分系统，实现对粗粒铁矿石的高效分选。跳汰重选技术可直接处理粒度较大的矿石，减少过粉碎带来的能耗和铁损失。同时，引入了高压辊磨技术降低破碎能耗，使用旋流器组进行精确分级，确保最终产品品位达到65%以上。"
                : "An innovative coarse particle jig concentration process was adopted, combined with an efficient screening system to achieve effective separation of coarse iron ore. Jig concentration technology can directly process larger particle size ore, reducing energy consumption and iron loss from over-grinding. Meanwhile, high-pressure grinding roll technology was introduced to reduce crushing energy consumption, and cyclone groups were used for precise classification, ensuring the final product grade reaches above 65%."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "设备配置" : "Equipment Configuration"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "主要设备包括：全智能化颚式破碎机、高压辊磨机、大型跳汰机系列、重介质旋流器、高效螺旋分级机、压滤机和干排设备等。跳汰机采用先进的自动控制系统，可根据入料特性实时调整工作参数。所有设备均采用防腐材料和先进的自动控制系统，并集成了智能诊断和预测性维护功能。中央控制系统实现全流程的远程监控和智能调节。"
                : "Main equipment includes: fully intelligent jaw crushers, high-pressure grinding rolls, large-scale jig concentrator series, heavy medium cyclones, efficient spiral classifiers, filter presses, and dry stacking equipment, etc. The jig concentrators use advanced automatic control systems that can adjust operating parameters in real-time based on feed characteristics. All equipment uses anti-corrosion materials and advanced automatic control systems, integrated with intelligent diagnosis and predictive maintenance functions. A central control system achieves remote monitoring and intelligent adjustment of the entire process."}
            </p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#A08C64] mb-4">{isZh ? "环保措施" : "Environmental Measures"}</h3>
            <p className="text-black mb-4">
              {isZh 
                ? "配备高效除尘系统。采用高效浓密技术处理尾矿，实现尾矿高浓度排放和固液分离。项目能耗比传统工艺降低30%。"
                : "Equipped with efficient dust removal systems. High-efficiency thickening technology was used to process tailings, achieving high concentration discharge and solid-liquid separation. The project's energy consumption was reduced by 30% compared to traditional processes."}
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
            <div className="text-4xl font-bold text-[#A08C64] mb-4">{isZh ? "300万吨/年" : "3 million tons/year"}</div>
            <p className="text-black">{isZh ? "实现设计产能，低品位矿石转化为高品位精矿。" : "Achieved design capacity, converting low-grade ore into high-grade concentrate."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">65.8%</div>
            <p className="text-black">{isZh ? "铁精矿品位，显著高于行业平均水平。" : "Iron concentrate grade, significantly higher than the industry average."}</p>
          </div>
          
          <div className="bg-[#F7F5F1] p-8 shadow-sm">
            <div className="text-4xl font-bold text-[#A08C64] mb-4">30%</div>
            <p className="text-black">{isZh ? "能耗降低，打造绿色低碳示范工厂。" : "Energy consumption reduction, creating a green low-carbon demonstration factory."}</p>
          </div>
        </div>
        
        <div className="mt-12 bg-black text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">{isZh ? "客户反馈" : "Client Feedback"}</h3>
          <p className="text-lg italic">
            {isZh ? 
              "泽鑫矿山设备为我们设计建造的铁矿加工厂不仅满足了设计产能要求，更通过精心设计的工艺流程和设备配置，有效降低了我们的运营成本。他们的团队在项目实施过程中展现了极强的专业技术能力和敬业精神，及时解决了施工和调试阶段遇到的各种挑战。此外，他们提供的自动化控制系统大大减少了人工操作，提高了生产安全性和稳定性，是我们值得信赖的合作伙伴。" : 
              "Zexin Mining Equipment's team, with its in-depth understanding and rich experience in iron ore processing technology, provided a complete solution for the construction of a large-scale processing plant for the Changjiang project. Our technical team demonstrated strong professional technical capabilities and dedication during project implementation, timely resolving various challenges encountered during construction and commissioning phases. Additionally, the automated control system they provided greatly reduced manual operation, improving production safety and stability. They are our trusted partners."}
          </p>
          <p className="mt-4 text-right font-bold">
            {isZh ? "— 张志强，国有钢铁企业矿业总工程师" : "— Zhang Zhiqiang, Chief Mining Engineer, State-owned Steel Enterprise"}
          </p>
        </div>
      </PageSection>
    </div>
  );
} 