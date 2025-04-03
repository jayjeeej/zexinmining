'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function Solutions() {
  const { isZh } = useLanguage();
  
  // 解决方案数据
  const solutions = [
    {
      id: "mineral-processing",
      name: isZh ? "矿物加工解决方案" : "Mineral Processing Solutions",
      image: "/images/solutions/mineral-processing.jpg",
      description: isZh
        ? "针对不同矿种特性，提供从破碎、研磨到分选的全流程矿物加工解决方案，实现高回收率和低能耗。"
        : "Providing comprehensive mineral processing solutions from crushing and grinding to separation for various ore types, achieving high recovery rates and low energy consumption."
    },
    {
      id: "tailings-management",
      name: isZh ? "尾矿处理解决方案" : "Tailings Management Solutions",
      image: "/images/solutions/tailings-management.jpg",
      description: isZh
        ? "环保高效的尾矿处理技术，包括尾矿脱水、干排和资源化利用，降低环境影响并提高经济效益。"
        : "Environmentally friendly and efficient tailings treatment technologies, including tailings dewatering, dry stacking, and resource utilization, reducing environmental impact and increasing economic benefits."
    },
    {
      id: "mine-optimization",
      name: isZh ? "矿山优化解决方案" : "Mine Optimization Solutions",
      image: "/images/solutions/mine-optimization.jpg",
      description: isZh
        ? "通过工艺优化、设备升级和智能化管理，提高现有矿山的生产效率和经济效益。"
        : "Improving production efficiency and economic benefits of existing mines through process optimization, equipment upgrades, and intelligent management."
    },
    {
      id: "green-mining",
      name: isZh ? "绿色矿山解决方案" : "Green Mining Solutions",
      image: "/images/solutions/green-mining.jpg",
      description: isZh
        ? "符合可持续发展理念的绿色矿山建设方案，实现资源高效利用和环境友好型开采。"
        : "Sustainable green mining construction solutions for efficient resource utilization and environmentally friendly mining operations."
    }
  ];

  // 成功案例数据
  const caseStudies = [
    {
      name: isZh ? "南非" : "South Africa",
      image: "/images/case-studies/south-africa.jpg",
      description: isZh
        ? "年产150万吨的锰矿生产线，实现了高效稳定的锰矿加工，达到国际先进水平。"
        : "Manganese ore production line with an annual capacity of 1.5 million tons, achieving efficient and stable manganese ore processing at an internationally advanced level."
    },
    {
      name: isZh ? "加蓬" : "Gabon",
      image: "/images/case-studies/gabon.jpg",
      description: isZh
        ? "塔塔集团的大型锰矿加工厂，年产能为200万吨。项目采用最新工艺，实现了资源高效利用。"
        : "Tata Group's large-scale manganese ore processing plant with an annual capacity of 2 million tons. The project uses the latest technology to achieve efficient resource utilization."
    },
    {
      name: isZh ? "昌江" : "Changjiang",
      image: "/images/case-studies/changjiang.jpg",
      description: isZh
        ? "国有企业的特大型铁矿加工厂，年生产能力为300万吨。采用先进工艺，实现了高效绿色生产。"
        : "State-owned enterprise's extra-large iron ore processing plant with an annual production capacity of 3 million tons. Using advanced technology to achieve efficient and green production."
    },
    {
      name: isZh ? "阿布扎比" : "Abu Dhabi",
      image: "/images/case-studies/abu-dhabi.jpg",
      description: isZh
        ? "年产200万吨的铁矿加工厂，采用智能化设备和流程，是中东地区标杆性矿山项目。"
        : "Iron ore processing plant with an annual output of 2 million tons, using intelligent equipment and processes, a benchmark mining project in the Middle East region."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 面包屑导航 */}
      <div className="container mx-auto px-4 max-w-[1200px] my-6">
        <Breadcrumb items={[
          {
            label: { zh: "矿山总承包服务", en: "Mining EPC Services" }
          }
        ]} />
      </div>

      {/* 第一屏：主要内容 - 参考布局 */}
      <section className="mb-16 lg:mb-32 last-of-type:mb-0 bg-black scroll-mt-32"
        data-block="splitimage">
        <div className="md:contain md:py-12 lg:py-20 text-white">
          <div className="grid last-of-type:mb-0 gap-12 md:grid-cols-2 lg:gap-20">
            <div className="w-full flex flex-col items-start justify-between gap-y-10 order-1 max-md:pb-16 pb-8 max-md:contain max-md:order-1">
              <strong className="mb-4 md:mb-6 text-xl">
                {isZh ? "矿山总承包服务" : "Mining EPC Services"}
              </strong>
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-balance text-white leading-tight font-bold">
                  {isZh ? "矿业全产业链服务（EPCM+O）" : "Full Mining Industry Chain Service (EPCM+O)"}
                </h2>
                <div className="prose mt-8 lg:mt-10 text-white max-w-2xl">
                  <p className="text-lg md:text-xl">
                    {isZh 
                      ? "泽鑫矿山设备致力于提供\"矿业全产业链服务（EPCM+O）\"，集矿山技术咨询及试验研究与矿山设计、成套设备制造与采购、采选尾工程施工及安装调试与交付、矿山建设管理、矿山生产运营管理和服务及行业资源整合为一体的国际矿业工程总承包服务商。"
                      : "Zexin Mining Equipment is committed to providing \"Full Mining Industry Chain Service (EPCM+O)\", integrating mining technology consulting and experimental research, mine design, complete equipment manufacturing and procurement, mining, processing and tailings engineering construction, installation, commissioning and delivery, mine construction management, mine production operation management and service, and industry resource integration, as an international mining engineering general contractor."}
                  </p>
                </div>
              </div>

              <div className="mt-6 md:mt-10">
                <a href="#solutions" className="group inline-flex items-center text-base md:text-lg gap-3 transition-colors ease-hover text-current underline-offset-4 hover:text-current focus:text-current active:text-current underline">
                  <span className="group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity">
                    {isZh ? "了解更多服务内容" : "Learn more about our services"}
                  </span>
                  <span className="text-[#A08C64] -translate-x-1 transition-transform ease-hover group-hover:translate-x-0.5 group-focus:translate-x-0.5 group-active:translate-x-0.5">
                    <svg focusable="false" fill="currentColor" width="36" height="36" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
            <div className="w-full h-full">
              <img 
                className="w-full h-full object-cover translate-x-8" 
                src="/images/solutions/solutions-hero.jpg" 
                alt={isZh ? "矿业解决方案" : "Mining Solutions"} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* EPCM+O服务体系 */}
      <PageSection variant="white" id="solutions">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "泽鑫EPCM+O矿山服务" : "Zexin EPCM+O Mining Services"}
          </h2>
          <p className="text-2xl lg:text-3xl text-left mb-8">
            {isZh 
              ? "泽鑫矿山设备提供从设计到运营的一站式矿业全产业链服务，满足客户多元化需求。" 
              : "Zexin Mining Equipment provides one-stop mining industry chain services from design to operation, meeting diverse customer needs."}
          </p>
        </div>
        
        <ul className="flex flex-col gap-12">
          {/* E - 工程设计 */}
          <li className="flex flex-col md:flex-row gap-8 items-center">
            <div className="absolute left-0 md:relative md:left-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#A08C64] text-white rounded-none">
              <span className="text-5xl font-bold">E</span>
            </div>
            <div className="md:w-2/5">
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/solutions/epcmopic1.jpg"
                  alt={isZh ? "设计与研究" : "Engineering and Research"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="md:w-3/5 relative flex flex-col items-start p-8 rounded-sm gap-y-4 min-h-[220px] lg:min-h-[320px] bg-gray-100">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                {isZh ? "矿山技术咨询及试验研究与矿山设计" : "Mining Technical Consultation, Research and Design"}
              </h3>
              <div className="text-[#A08C64] text-lg mb-2">ENGINEERING</div>
              <p className="text-black">
                {isZh 
                  ? "以前沿的创新性思维、深厚的专业知识及丰富的行业经验，为矿山采-选-尾项目的各环节提供全面的工程咨询、针对性的试验研究以及定制化的矿山设计等一站式专业化服务。" 
                  : "With innovative thinking, profound professional knowledge and industry experience, we provide one-stop professional services including engineering consultation, targeted experimental research and customized mine design for all aspects of mining projects."}
              </p>
            </div>
          </li>
          
          {/* P - 采购 */}
          <li className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="absolute right-0 md:relative md:right-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#A08C64] text-white rounded-none">
              <span className="text-5xl font-bold">P</span>
            </div>
            <div className="md:w-2/5">
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/solutions/epcmopic2.jpg"
                  alt={isZh ? "制造与采购" : "Manufacturing and Procurement"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="md:w-3/5 relative flex flex-col items-start p-8 rounded-sm gap-y-4 min-h-[220px] lg:min-h-[320px] bg-gray-100">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                {isZh ? "成套设备制造与采购" : "Complete Equipment Manufacturing and Procurement"}
              </h3>
              <div className="text-[#A08C64] text-lg mb-2">PROCUREMENT</div>
              <p className="text-black">
                {isZh 
                  ? "制造和采购项目所需的采-选-尾设备、智能化自动化矿山装备、矿山配套物资、安装和维修工具、试验室和化验室装备、组合式房屋、钢结构厂房、组合式钢结构选矿厂生产线等。" 
                  : "Manufacturing and procuring mining-processing-tailings equipment, intelligent mining equipment, supporting materials, installation and maintenance tools, laboratory equipment, modular buildings, steel structures, and modular steel structure processing plant production lines."}
              </p>
            </div>
          </li>
          
          {/* C - 施工 */}
          <li className="flex flex-col md:flex-row gap-8 items-center">
            <div className="absolute left-0 md:relative md:left-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#A08C64] text-white rounded-none">
              <span className="text-5xl font-bold">C</span>
            </div>
            <div className="md:w-2/5">
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/solutions/epcmopic3.jpg"
                  alt={isZh ? "土建与安装" : "Construction and Installation"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="md:w-3/5 relative flex flex-col items-start p-8 rounded-sm gap-y-4 min-h-[220px] lg:min-h-[320px] bg-gray-100">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                {isZh ? "采选尾工程施工及安装调试与交付" : "Mining, Processing and Tailings Construction, Installation and Commissioning"}
              </h3>
              <div className="text-[#A08C64] text-lg mb-2">CONSTRUCTION</div>
              <p className="text-black">
                {isZh 
                  ? "提供采矿工程、选矿厂及尾矿库土建施工、厂房建设、设备安装和调试、技术培训等服务。工程部分包括露天、平硐、斜井、斜坡道、竖井等采矿工程设施施工；原矿仓、破碎车间、磨浮车间、精矿过滤车间、冶炼车间等选矿厂工程施工；尾矿库工程设施施工；办公和生活区、仓库和维修车间，以及水、电、路等基础设施施工。" 
                  : "Providing mining engineering, mineral processing plant and tailings dam construction, factory building, equipment installation and commissioning, technical training and other services. Engineering includes open-pit, adit, inclined shaft, slope, and vertical shaft mining facilities construction; ore bin, crushing workshop, grinding and flotation workshop, concentrate filtering workshop, smelting workshop and other processing plant engineering construction; tailings dam engineering facilities construction; office and living areas, warehouses and maintenance workshops, as well as water, electricity, road and other infrastructure construction."}
              </p>
            </div>
          </li>
          
          {/* M - 管理 */}
          <li className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="absolute right-0 md:relative md:right-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#A08C64] text-white rounded-none">
              <span className="text-5xl font-bold">M</span>
            </div>
            <div className="md:w-2/5">
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/solutions/epcmopic4.jpg"
                  alt={isZh ? "矿山管理" : "Mine Management"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="md:w-3/5 relative flex flex-col items-start p-8 rounded-sm gap-y-4 min-h-[220px] lg:min-h-[320px] bg-gray-100">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                {isZh ? "矿山建设管理" : "Mining Construction Management"}
              </h3>
              <div className="text-[#A08C64] text-lg mb-2">MANAGEMENT</div>
              <p className="text-black">
                {isZh 
                  ? "根据客户需求，提供整个EPC项目实施全过程的管理服务。包括矿山采-选-尾设计管理、设备制造与采购管理、工程施工及安装调试工程管理、项目试运行管理等一体化服务。" 
                  : "According to customer requirements, providing management services for the entire EPC project implementation process. Including mining-processing-tailings design management, equipment manufacturing and procurement management, construction and installation commissioning project management, project trial operation management and other integrated services."}
              </p>
            </div>
          </li>
          
          {/* O - 运营 */}
          <li className="flex flex-col md:flex-row gap-8 items-center">
            <div className="absolute left-0 md:relative md:left-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#A08C64] text-white rounded-none">
              <span className="text-5xl font-bold">O</span>
            </div>
            <div className="md:w-2/5">
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/solutions/epcmopic5.jpg"
                  alt={isZh ? "矿山运营" : "Mine Operation"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="md:w-3/5 relative flex flex-col items-start p-8 rounded-sm gap-y-4 min-h-[220px] lg:min-h-[320px] bg-gray-100">
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                {isZh ? "矿山生产运营管理和服务" : "Mine Production Operation Management and Services"}
              </h3>
              <div className="text-[#A08C64] text-lg mb-2">OPERATION</div>
              <p className="text-black">
                {isZh 
                  ? "根据客户需求，采用多种合作方式提供矿山全方位运营管理服务。涵盖生产、设备、安全、环境、人力资源及财务等核心管理环节，全面提升矿山运营效率。同时，建立全球化矿山服务中心网络，为客户提供技术咨询、物资供应、备品备件及售后服务等一站式支持。" 
                  : "According to customer requirements, we provide comprehensive mining operation management services through various cooperation models. Covering core management areas including production, equipment, safety, environment, human resources, and finance to enhance operational efficiency. We've also established a global mining service center network offering technical consulting, material supply, spare parts, and after-sales support."}
              </p>
            </div>
          </li>
        </ul>
      </PageSection>

      {/* 国内外矿业开发现状与痛点 */}
      <section className="mb-16 lg:mb-32 last-of-type:mb-0 bg-black scroll-mt-32">
        <div className="container mx-auto px-4 max-w-[1200px] py-16">
          <div className="grid grid-cols-12 gap-8">
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="flex flex-col gap-y-6">
                <h2 className="text-[#A08C64] text-[200px] font-bold leading-none">90%</h2>
                <p className="text-2xl text-white">
                  {isZh ? "的矿山项目存在效益损失" : "of mining projects face efficiency losses"}
                </p>
              </div>

              <div className="mt-8 max-w-xl">
                <p className="text-xl text-gray-300">
                  {isZh ? "全球矿业项目普遍面临投资预算失控、建设周期延误、运营效率低下等系统性挑战。" 
                    : "Global mining projects commonly face systemic challenges including investment budget overruns, construction delays, and operational inefficiencies."}
                </p>
              </div>
            </div>

            <div className="prose max-w-none lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
              <p className="text-2xl font-semibold text-white mb-8">{isZh ? "国内外矿业开发现状与痛点" : "Current Status and Pain Points of Mining Development"}</p>
              <div className="space-y-8">
                <p className="text-2xl text-white border-b border-neutral-700 pb-4">
                  {isZh ? "几乎都超投资预算" : "Almost all exceed investment budget"}
                </p>
                <p className="text-2xl text-white border-b border-neutral-700 pb-4">
                  {isZh ? "几乎都没有按期投产或达标达产" : "Almost none are put into production on schedule or reach standards"}
                </p>
                <p className="text-2xl text-white border-b border-neutral-700 pb-4">
                  {isZh ? "几乎投产之日就是技术改造之时" : "The day of production is almost always the time for technical transformation"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 一般选矿厂建设流程 */}
      <section className="mb-16 lg:mb-32 last-of-type:mb-0 bg-white scroll-mt-32">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[500px]">
              <Image
                src="/images/solutions/processing-plant-flow.jpg"
                alt={isZh ? "一般选矿厂建设流程" : "General Mineral Processing Plant Construction Process"}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xs"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-8">{isZh ? "一般选矿厂建设流程" : "General Mineral Processing Plant Construction Process"}</h3>
              <div className="liuchengtxt bg-white rounded-lg">
                <div className="mb-6">
                  <h4 className="text-3xl font-bold text-[#A08C64] mb-4">E</h4>
                  <p className="text-black mb-2">{isZh ? "拷贝设计方案或只按经验设计；" : "Copying design plans or designing only based on experience;"}</p>
                  <p className="text-black mb-2">{isZh ? "非标件及管路等由选矿人员进行设计；" : "Non-standard parts and piping designed by mineral processing personnel;"}</p>
                  <p className="text-black mb-2">{isZh ? "缺乏全局观念，设计时不考虑后期安装调试环节等问题。" : "Lack of overall concept, not considering later installation and commissioning issues during design."}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-3xl font-bold text-[#A08C64] mb-4">P1P2P3...</h4>
                  <p className="text-black mb-2">{isZh ? "从N个设备厂家进行单体设备采购；" : "Purchasing individual equipment from multiple manufacturers;"}</p>
                  <p className="text-black mb-2">{isZh ? "只关注设备，忽略生产线衔接问题；" : "Focusing only on equipment, ignoring production line connection issues;"}</p>
                  <p className="text-black mb-2">{isZh ? "不同厂家标准及能力参差不齐，配件及配套易出问题。" : "Varying standards and capabilities from different manufacturers, causing problems with parts and accessories."}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-3xl font-bold text-[#A08C64] mb-4">C</h4>
                  <p className="text-black mb-2">{isZh ? "模拟现场安装材料计划 避免材料缺失或库存积压 造成工期延长及投资成本增加 周密的施工计划 严格的考核方案 避免反复更改 造成成本增加 施工 安装和调试团队经验丰富" : "Simulating on-site installation material planning to avoid material shortages or inventory backlog, preventing construction delays and increased investment costs, detailed construction plans, strict assessment schemes to avoid repeated changes and cost increases, with experienced construction, installation and commissioning teams"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="liuchengrow bg-white border-2 border-black p-6 text-center">
            <h4 className="text-xl font-bold text-black">
              <span className="mx-2"><b className="text-[#A08C64]">E</b>{isZh ? "弱" : "Weak"} <b className="text-[#A08C64]">P</b>{isZh ? "杂" : "Mixed"} <b className="text-[#A08C64]">C</b>{isZh ? "弱" : "Weak"}</span> 
              {isZh ? "导致90%的矿山" : "Resulting in 90% of mining projects"} 
              <span className="mx-2">{isZh ? "投资超，工期拖，" : "exceeding investment, delaying construction periods,"}</span>
              {isZh ? "投产之日就是技改之时。" : "where the production start date becomes the time for technical reform."}
            </h4>
          </div>
        </div>
      </section>

      {/* 解决方案列表 */}
      <PageSection variant="gray">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "泽鑫EPCM+O矿山服务" : "Zexin EPCM+O Mining Services"}
          </h2>
        </div>

        {/* 解决方案列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black p-6 shadow-md overflow-hidden h-[280px]">
            <div className="p-6">
              <h3 className="text-3xl font-bold text-[#A08C64] mb-4">E</h3>
              <p className="text-gray-300">{isZh ? "用创新的思维为每一座选矿厂量身定制设计方案 非标件及管路等由专业人员设计 充分考虑安装调试问题 必要时使用钢结构 确保每个环节的设计都经过专业团队审核 实现高效精准的工程设计" : "Using innovative thinking to tailor design solutions for each processing plant, with professional design of non-standard parts and piping, full consideration of installation and commissioning issues, using steel structures when necessary, ensuring each design aspect is reviewed by professional teams for efficient and precise engineering design"}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 shadow-md overflow-hidden h-[280px]">
            <div className="p-6">
              <h3 className="text-3xl font-bold text-[#A08C64] mb-4">P</h3>
              <p className="text-black">{isZh 
                ? "注重整个生产线主干设备的衔接 能力匹配 以及高标准的设备制造及电机 减速机 轴承 元器件等的配套 提供统一的标准和适应国外现场状况的设备 所有的文件按照统一的格式整理 包括3D等件图等 和翻译 按照整体生产线 安装材料 备品备件等组织包装 发运及通关等" 
                : "Focus on production line equipment integration, capacity matching, and high-standard manufacturing of equipment with motors, reducers, bearings, and components. Provide standardized equipment suitable for international sites with unified documentation and 3D drawings."}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 shadow-md overflow-hidden h-[280px]">
            <div className="p-6">
              <h3 className="text-3xl font-bold text-[#A08C64] mb-4">C</h3>
              <p className="text-black">{isZh 
                ? "模拟现场安装材料计划 避免材料缺失或库存积压 造成工期延长及投资成本增加 周密的施工计划 严格的考核方案 避免反复更改 造成成本增加 施工 安装和调试团队经验丰富" 
                : "Comprehensive installation planning to prevent material shortages and delays. Strict construction management with experienced teams for installation and commissioning."}</p>
            </div>
          </div>

          <div className="bg-black p-6 shadow-md overflow-hidden h-[280px]">
            <div className="p-6">
              <h3 className="text-3xl font-bold text-[#A08C64] mb-4">M</h3>
              <p className="text-gray-300">{isZh 
                ? "全过程管理服务 提供一体化解决方案 庞大的技术专家团队 提供运营管理支持" 
                : "Full-process management with integrated solutions and expert team support for operations."}</p>
            </div>
          </div>

          {/* 添加大字母O */}
          <div className="col-span-2 flex flex-col justify-center items-center -mt-16">
            <h3 className="text-[133px] font-bold text-[#A08C64]">O</h3>
            <p className="text-center max-w-4xl -mt-10 text-black">
              {isZh 
                ? "根据客户需求，采用多种合作方式提供采矿工程、选矿厂及尾矿库建成后的全方位运营管理服务。包括生产运营管理、设备运营管理、安全运营管理、环境运营管理、人力资源管理和财务管理等各个环节。同时，泽鑫根据区域需求，建立完备的全球矿山服务中心，提供试验和技术咨询、生产物资、备品备件及矿山耗材、售后及项目拓展服务等。" 
                : "According to customer needs, we provide comprehensive operational management services for mining projects through various cooperation models. Our services cover production, equipment, safety, environmental, human resources and financial management. We've established global mining service centers to provide technical consulting, supplies, spare parts, and after-sales support tailored to regional requirements."}</p>
            </div>
        </div>
      </PageSection>

      {/* 成功案例 */}
      <PageSection variant="white" id="case-studies">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "成功案例" : "Case Studies"}
          </h2>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 max-w-5xl">
            {caseStudies.map((caseStudy, index) => (
              <div key={caseStudy.name} className="group">
                <div className="relative h-52 w-full overflow-hidden">
                  {index === 0 ? (
                    <Link href="/solutions/south-africa">
                      <Image
                        src={caseStudy.image}
                        alt={caseStudy.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-all duration-500 ease-in-out group-hover:brightness-110"
                      />
                    </Link>
                  ) : index === 1 ? (
                    <Link href="/solutions/gabon">
                      <Image
                        src={caseStudy.image}
                        alt={caseStudy.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-all duration-500 ease-in-out group-hover:brightness-110"
                      />
                    </Link>
                  ) : index === 2 ? (
                    <Link href="/solutions/changjiang">
                      <Image
                        src={caseStudy.image}
                        alt={caseStudy.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-all duration-500 ease-in-out group-hover:brightness-110"
                      />
                    </Link>
                  ) : (
                    <Link href="/solutions/abu-dhabi">
                      <Image
                        src={caseStudy.image}
                        alt={caseStudy.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-all duration-500 ease-in-out group-hover:brightness-110"
                      />
                    </Link>
                  )}
                </div>
                <div className="pt-4">
                  {index === 0 ? (
                    <Link href="/solutions/south-africa">
                      <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:underline decoration-black underline-offset-4">
                        {caseStudy.name}
                      </h3>
                    </Link>
                  ) : index === 1 ? (
                    <Link href="/solutions/gabon">
                      <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:underline decoration-black underline-offset-4">
                        {caseStudy.name}
                      </h3>
                    </Link>
                  ) : index === 2 ? (
                    <Link href="/solutions/changjiang">
                      <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:underline decoration-black underline-offset-4">
                        {caseStudy.name}
                      </h3>
                    </Link>
                  ) : index === 3 ? (
                    <Link href="/solutions/abu-dhabi">
                      <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:underline decoration-black underline-offset-4">
                        {caseStudy.name}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:underline decoration-black underline-offset-4">
                      {caseStudy.name}
                    </h3>
                  )}
                  <p className="text-black text-sm">{caseStudy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
} 