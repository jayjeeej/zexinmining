'use client';
// 矿山EPC服务客户端组件
import React, { useState, useEffect, useRef } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import { getBreadcrumbConfig } from '@/lib/navigation';
import Container from '@/components/Container';
import ContactCard from '@/components/ContactCard';
import Accordion, { AccordionItem } from '@/components/Accordion';
import CountUpAnimation from '@/components/CountUpAnimation';
import { 
  getBreadcrumbStructuredData, 
  getOrganizationStructuredData,
  getServiceStructuredData
} from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';

// 修复接口定义，确保locale可选并有默认值
interface MiningEpcServiceClientProps {
  locale?: string;
}

export default function MiningEpcServiceClient({ locale = 'en' }: MiningEpcServiceClientProps) {
  const isZh = locale === 'zh';
  
  // 面包屑导航
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { name: isZh ? '矿山EPC服务' : 'Mining EPC Services' }
  ];

  // 页面描述内容
  const pageDescription = isZh
    ? '泽鑫矿山设备致力于提供"矿业全产业链服务（EPCMO）"，集矿山技术咨询及试验研究与矿山设计、成套设备制造与采购、采选尾工程施工及安装调试与交付、矿山建设管理、矿山生产运营管理和服务及行业资源整合为一体的国际矿业工程总承包服务商。'
    : 'Zexin provides comprehensive Mining Industry Chain Services (EPCMO) as a global engineering contractor, covering consulting, design, equipment procurement, construction, commissioning, and operational management for complete mining projects.';
    
  // 服务项目列表
  const serviceItemsList = [
    isZh ? '工程设计' : 'Engineering',
    isZh ? '设备采购' : 'Procurement',
    isZh ? '工程施工' : 'Construction',
    isZh ? '项目管理' : 'Management',
    isZh ? '运营服务' : 'Operation'
  ];

  // 结构化数据
  const baseUrl = 'https://www.zexinmining.com';
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href
    })),
    baseUrl
  );
  
  const organizationStructuredData = getOrganizationStructuredData(isZh);
  
  const serviceStructuredData = getServiceStructuredData({
    serviceId: 'mining-epc',
    serviceName: isZh ? '矿山EPC服务' : 'Mining EPC Services',
    serviceDescription: pageDescription,
    serviceType: 'EPCMO',
    serviceProvider: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
    serviceItems: serviceItemsList,
    locale,
    baseUrl
  });
  
  const structuredDataArray = [
    breadcrumbStructuredData,
    organizationStructuredData,
    serviceStructuredData
  ];

  // 服务模块数据 - 预留5个手风琴装置
  const serviceModules = [
    {
      id: 'consulting',
      title: isZh ? '矿山技术咨询及试验研究与矿山设计' : <><span className="text-[#ff6633]">E</span>ngineering</>,
      content: isZh 
        ? '以前沿的创新性思维、深厚的专业知识及丰富的行业经验，为矿山采-选-尾项目的各环节提供全面的工程咨询、针对性的试验研究以及定制化的矿山设计等一站式专业化服务。' 
        : 'With cutting-edge innovative thinking, profound professional knowledge and rich industry experience, we provide comprehensive engineering consulting, targeted experimental research and customized mine design for all aspects of mining-processing-tailings projects.'
    },
    {
      id: 'equipment',
      title: isZh ? '成套设备制造与采购' : <><span className="text-[#ff6633]">P</span>rocurement</>,
      content: isZh 
        ? '制造和采购项目所需的采-选-尾设备、智能化自动化矿山装备、矿山配套物资、安装和维修工具、试验室和化验室装备、组合式房屋、钢结构厂房、组合式钢结构选矿厂生产线等。' 
        : 'Manufacturing and procurement of mining-processing-tailings equipment, intelligent automated mining equipment, supporting materials, installation and maintenance tools, laboratory equipment, modular buildings, steel structure workshops, and modular steel structure mineral processing plant production lines.'
    },
    {
      id: 'construction',
      title: isZh ? '采选尾工程施工及安装调试与交付' : <><span className="text-[#ff6633]">C</span>onstruction</>,
      content: isZh 
        ? '提供采矿工程、选矿厂及尾矿库土建施工、厂房建设、设备安装和调试、技术培训等服务。工程部分包括露天、平硐、斜井、斜坡道、竖井等采矿工程设施施工；原矿仓、破碎车间、磨浮车间、精矿过滤车间、冶炼车间等选矿厂工程施工；尾矿库工程设施施工；办公和生活区、仓库和维修车间，以及水、电、路等基础设施施工。' 
        : 'Providing mining engineering, mineral processing plant and tailings dam civil construction, plant building, equipment installation and commissioning, technical training and other services. Engineering includes open-pit, adit, inclined shaft, ramp, vertical shaft mining facilities construction; ore bin, crushing workshop, grinding-flotation workshop, concentrate filtering workshop, smelting workshop and other mineral processing plant construction; tailings dam facilities construction; office and living areas, warehouses and maintenance workshops, as well as water, electricity, road and other infrastructure construction.'
    },
    {
      id: 'management',
      title: isZh ? '矿山建设管理' : <><span className="text-[#ff6633]">M</span>anagement</>,
      content: isZh 
        ? '根据客户需求，提供整个EPC项目实施全过程的管理服务。包括矿山采-选-尾设计管理、设备制造与采购管理、工程施工及安装调试工程管理、项目试运行管理等一体化服务。' 
        : 'According to customer requirements, we provide management services for the entire EPC project implementation process. Including mine design management, equipment manufacturing and procurement management, construction and installation commissioning project management, project trial operation management and other integrated services.'
    },
    {
      id: 'operation',
      title: isZh ? '矿山生产运营管理和服务' : <><span className="text-[#ff6633]">O</span>peration</>,
      content: isZh 
        ? '根据客户需求，采用多种合作方式提供矿山全方位运营管理服务。涵盖生产、设备、安全、环境、人力资源及财务等核心管理环节，全面提升矿山运营效率。同时，建立全球化矿山服务中心网络，为客户提供技术咨询、物资供应、备品备件及售后服务等一站式支持。' 
        : 'According to customer requirements, we provide comprehensive mine operation management services through various cooperation methods. Covering production, equipment, safety, environment, human resources and financial core management links to comprehensively improve mine operation efficiency. At the same time, we establish a global mine service center network to provide customers with technical consulting, material supply, spare parts and after-sales service and other one-stop support.'
    }
  ];

  // 将服务模块数据转换为Accordion组件需要的格式
  const accordionItems: AccordionItem[] = serviceModules.map(module => ({
    id: module.id,
    title: module.title,
    content: <div className="p-6">{module.content}</div>,
    expanded: true // 默认展开所有项
  }));

  // 获取所有模块ID作为默认展开ID
  const allModuleIds = serviceModules.map(module => module.id);

  // 自定义的包装组件，只覆盖特定页面的hero部分
  const CustomProductLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProductLayout
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        // 不传递title和description，以阻止默认HeroSection的渲染
      >
        {/* 结构化数据 */}
        <MultiStructuredData dataArray={structuredDataArray} />
        
        {/* 自定义的Hero部分 */}
        <div className="relative w-full">
          {/* 图片区域 */}
          <section className="w-full">
            <picture>
              {/* 移动设备版本 */}
              <source 
                srcSet="/images/products/mining-epc-contract-hero-mobile.jpg" 
                media="(max-width: 768px)" 
                type="image/jpeg" 
              />
              {/* 桌面版本 */}
              <source 
                srcSet="/images/products/mining-epc-contract-hero.jpg" 
                media="(min-width: 769px)" 
                type="image/jpeg" 
              />
              <img 
                src="/images/products/mining-epc-contract-hero.jpg" 
                alt={isZh ? "矿山EPC服务" : "Mining EPC Services"}
                className="w-full h-auto"
                loading="eager"
              />
            </picture>
            {/* 半透明遮罩 */}
            <div className="absolute inset-0 bg-black/50"></div>
          </section>
          
          {/* 内容区域 */}
          <section className="absolute inset-0 flex items-center justify-center">
            <Container>
              <div className="text-center w-full mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-[#ff6633] mb-2 sm:mb-2 md:mb-3 text-balance leading-tight">
                  {isZh ? '矿业全产业链服务（EPCMO）' : 'Full Mining Industry Chain Services (EPCMO)'}
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-text text-white/90 mx-auto max-w-4xl">
                  {pageDescription}
                </p>
              </div>
            </Container>
          </section>
        </div>
        
        {/* 使用Accordion组件替代自定义手风琴 */}
        <div className="py-10">
          <Container>
            <div className="mb-8">
              <Accordion 
                items={accordionItems}
                allowMultiple={true}
                expandAll={true}
                defaultExpandedIds={allModuleIds}
                className="space-y-8 divide-y-0"
                titleClassName="w-full flex justify-between items-center py-4 px-6 text-left focus:outline-none transition-colors bg-gray-700 text-white hover:bg-gray-700 text-base sm:text-lg md:text-xl lg:text-[20px]"
                contentClassName="bg-white"
              />
            </div>
          </Container>
        </div>
        
        {/* 矿业项目痛点统计 */}
        <div className="py-10 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* 左侧 - 90%统计 */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
                <div className="flex flex-col gap-y-1 text-center lg:text-left">
                  <div
                    style={{
                      color: 'black',
                      textShadow: '0 0 2px #ff6633, 0 0 2px #ff6633, 0 0 2px #ff6633, 1px 0 0 #ff6633, 0 1px 0 #ff6633, -1px 0 0 #ff6633, 0 -1px 0 #ff6633'
                    }}
                  >
                    <CountUpAnimation
                      end={90}
                      duration={1500}
                      className="text-6xl sm:text-8xl md:text-9xl lg:text-[160px] xl:text-[180px] font-bold leading-none"
                    />
                  </div>
                  <p className="text-[20px] text-black uppercase font-bold">
                    {isZh ? '的矿山项目存在效益损失' : 'OF MINING PROJECTS FACE EFFICIENCY LOSSES'}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-[16px] text-gray-400 text-center lg:text-left">
                    {isZh 
                      ? '全球矿业项目普遍面临投资预算失控、建设周期延误、运营效率低下等系统性挑战。'
                      : 'Global mining projects commonly face systemic challenges including investment budget overruns, construction delays, and operational inefficiencies.'
                    }
                  </p>
                </div>
              </div>
              
              {/* 右侧 - 痛点列表 */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="lg:pl-8">
                  <h3 className="text-[28px] md:text-[32px] font-bold text-black mb-4 leading-tight tracking-[-0.02em] text-center lg:text-left">
                    {isZh ? '国内外矿业开发现状与痛点' : 'Current Status and Pain Points of Mining Development'}
                  </h3>
                  <div className="space-y-0">
                    {/* 第一项 */}
                    <div className="py-2 sm:py-3 border-b border-[#ff6633]">
                      <p className="text-[16px] text-gray-400 mb-3">
                        {isZh ? '几乎都超投资预算' : 'Almost all exceed investment budget'}
                      </p>
                    </div>
                    
                    {/* 第二项 */}
                    <div className="py-2 sm:py-3 border-b border-[#ff6633]">
                      <p className="text-[16px] text-gray-400 mb-3">
                        {isZh ? '几乎都没有按期投产或达标达产' : 'Almost none are put into production on schedule or reach standards'}
                      </p>
                    </div>
                    
                    {/* 第三项 */}
                    <div className="py-2 sm:py-3 border-b border-[#ff6633]">
                      <p className="text-[16px] text-gray-400 mb-3">
                        {isZh ? '几乎投产之日就是技术改造之时' : 'The day of production is almost always the time for technical transformation'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        {/* 矿山工程建设流程分析 */}
        <div className="relative py-14 bg-white">
          <Container>
            {/* 主标题区域 */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
              <div className="max-w-xl">
                <h2 className="text-[28px] md:text-[32px] font-bold text-black leading-tight tracking-[-0.02em]">
                  {isZh ? '选矿工程建设流程' : 'General Mineral Processing Plant Construction Process'}
                </h2>
              </div>
              <div className="max-w-xl md:text-right">
                <p className="text-[18px] text-gray-700 leading-relaxed">
                  {isZh 
                    ? (<><span className="font-bold text-black">E</span>弱 <span className="font-bold text-black">P</span>混乱 <span className="font-bold text-black">C</span>弱导致矿山项目超投资、延期建设，投产之日即技改之时</>)
                    : (<><span className="font-bold text-black">E</span>Weak <span className="font-bold text-black">P</span>Mixed <span className="font-bold text-black">C</span>Weak Resulting in mining projects exceeding investment, delaying construction periods, where the production start date becomes the time for technical reform.</>)}
                </p>
              </div>
            </div>

            {/* EPC流程卡片 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
              {/* 工程设计环节 */}
              <div className="group">
                <div className="mb-4">
                  <span
                    className="inline-block text-[72px] font-bold leading-none mb-3"
                    style={{
                      color: 'black',
                      textShadow: '0 0 2px #ff6633, 0 0 2px #ff6633, 0 0 2px #ff6633, 1px 0 0 #ff6633, 0 1px 0 #ff6633, -1px 0 0 #ff6633, 0 -1px 0 #ff6633'
                    }}
                  >
                    E
                  </span>
                  <h3 className="text-[24px] font-bold text-black mb-4">
                    {isZh ? '工程设计' : 'Engineering Design'}
                  </h3>
                </div>
                <ul className="space-y-4 pl-4">
                  {[
                    isZh ? '照搬设计方案或仅凭经验设计' : 'Copying design plans or designing based on experience only',
                    isZh ? '非标准件和管道由选矿人员设计' : 'Non-standard parts and piping designed by mineral processing personnel',
                    isZh ? '缺乏整体概念，设计时未考虑后期安装调试问题' : 'Lack of overall concept, ignoring installation and commissioning issues during design'
                  ].map((item, index) => (
                    <li key={index} className="text-[16px] text-gray-400 leading-relaxed">
                      {index === 0 && (
                        <div className="w-full mb-3 border-t border-gray-400"></div>
                      )}
                      <span className="text-[#ff6633] mr-2">▍</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 设备采购环节 */}
              <div className="group">
                <div className="mb-4">
                  <span
                    className="inline-block text-[72px] font-bold leading-none mb-3"
                    style={{
                      color: 'black',
                      textShadow: '0 0 2px #ff6633, 0 0 2px #ff6633, 0 0 2px #ff6633, 1px 0 0 #ff6633, 0 1px 0 #ff6633, -1px 0 0 #ff6633, 0 -1px 0 #ff6633'
                    }}
                  >
                    P
                  </span>
                  <h3 className="text-[24px] font-bold text-black mb-4">
                    {isZh ? '设备采购' : 'Procurement'}
                  </h3>
                </div>
                <ul className="space-y-4 pl-6">
                  {[
                    isZh ? '向多个制造商分散采购单体设备' : 'Purchasing individual equipment from multiple manufacturers',
                    isZh ? '仅关注设备，忽视生产线衔接问题' : 'Focusing only on equipment, ignoring production line connection issues',
                    isZh ? '不同厂家标准和能力不一，导致配件问题' : 'Varying standards and capabilities from different manufacturers causing parts issues'
                  ].map((item, index) => (
                      <li key={index} className="text-[16px] text-gray-400 leading-relaxed">
                      {index === 0 && (
                        <div className="w-full mb-3 border-t border-gray-400"></div>
                      )}
                      <span className="text-[#ff6633] mr-2">▍</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 施工建设环节 */}
              <div className="group">
                <div className="mb-4">
                  <span
                    className="inline-block text-[72px] font-bold leading-none mb-3"
                    style={{
                      color: 'black',
                      textShadow: '0 0 2px #ff6633, 0 0 2px #ff6633, 0 0 2px #ff6633, 1px 0 0 #ff6633, 0 1px 0 #ff6633, -1px 0 0 #ff6633, 0 -1px 0 #ff6633'
                    }}
                  >
                    C
                  </span>
                  <h3 className="text-[24px] font-bold text-black mb-4">
                    {isZh ? '施工建设' : 'Construction'}
                  </h3>
                </div>
                <ul className="space-y-4 pl-6">
                  {[
                    isZh
                      ? '设计时缺乏海外矿山和施工了解，导致安装现场初选众多问题' : 'Lack of understanding of overseas mines and construction during design, resulting in numerous issues during initial on-site installation',
                    isZh
                      ? '计划不周密，导致库存物资呆滞或现场物资不足的极端情况': 'Poor planning leads to either stagnant inventory or extreme shortages of materials on site',
                    isZh
                      ? '安装调试团队经验不足（尤其是海外安装调试经验缺乏）': 'Installation and commissioning teams lack experience (especially with overseas installation and commissioning)'
                  ].map((item, index) => (
                      <li key={index} className="text-[16px] text-gray-400 leading-relaxed">
                      {index === 0 && (
                        <div className="w-full mb-3 border-t border-gray-400"></div>
                      )}
                      <span className="text-[#ff6633] mr-2">▍</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 成就统计展示 - 与EPC风格一致 */}
            <div className="mt-20 mb-10">
              {/* 副标题 */}
              <div className="text-center mb-10">
                <h3 className="text-[20px] text-black inline-block relative">
                  {isZh ? '泽鑫ECPMO解决方案' : 'Zexin EPCMO Solutions'}
                  <span className="block border-t border-[#ff6633] w-[60px] mx-auto mt-4"></span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {/* 20+ 行业经验 - 大屏左对齐，小中屏居中 */}
                <div className="group text-center lg:text-left">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">20+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      {isZh ? '行业经验' : 'Years Experience'}
                    </h3>
                  </div>
                </div>
                
                {/* 20+ 服务国家 */}
                <div className="group text-center">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">20+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      {isZh ? '服务国家' : 'Countries Served'}
                    </h3>
                  </div>
                </div>
                
                {/* 10+ 专利技术 */}
                <div className="group text-center">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">10+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      {isZh ? '专利技术' : 'Patented Tech'}
                    </h3>
                  </div>
                </div>
                
                {/* 40+ 成功项目 - 大屏右对齐，小中屏居中 */}
                <div className="group text-center lg:text-right">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">40+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      {isZh ? '成功项目' : 'Successful Projects'}
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* 简短描述 - 带完整的水平上划线，参考Global Operations */}
                              <div className="mt-8 text-center mx-auto max-w-3xl relative">
                <div className="border-t border-gray-200 mb-4"></div>
                <p className="text-[16px] text-gray-700 leading-relaxed mb-4">
                  {isZh 
                    ? '凭借20年+的行业经验，我们已为全球20多个国家的矿业客户提供专业解决方案。拥有10项以上专利技术，成功完成超过40个大型矿业项目，树立了众多行业标杆案例。' 
                    : 'Leveraging 20+ years of expertise, we deliver professional solutions to mining clients across 20+ countries. With 10+ patented technologies and 40+ successful major projects completed, we have established industry benchmarks worldwide.'}
                </p>
                <div className="text-center mt-6">
                  <a 
                    href={`/${locale}/cases`} 
                    className="inline-flex items-center text-black group"
                  >
                    <span className="underline decoration-black decoration-1 underline-offset-4 text-[14px]">
                      {isZh ? '了解我们的案例' : 'Learn about our projects'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[1px] group-hover:translate-x-1 transition-transform">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        {/* 页面其他内容 */}
        {children}
      </ProductLayout>
    );
  };

  return (
    <CustomProductLayout>
      {/* 联系咨询区 */}
      <ContactCard
        title={isZh ? '需要矿山工程总承包服务？' : 'Need Mining Engineering Contracting Services?'}
        description={isZh 
          ? '我们的专业工程师团队随时为您提供技术咨询和定制方案。<br/>联系我们获取更多矿山EPC服务的详细信息和应用建议！' 
          : 'Our team of specialized engineers is ready to provide technical consultation and customized solutions.<br/>Contact us for more details and application advice on mining EPC services!'
        }
        buttonText={isZh ? '联系我们' : 'Contact Us'}
        linkUrl={`/${locale}/contact`}
        imageSrc="/images/mineral-processing/contact-support.jpg"
        imageAlt={isZh ? "矿山EPC服务咨询" : "Mining EPC Services Consultation"}
        rounded={false}
        useModal={true}
        formTitle={{ 
          zh: '矿山EPC服务咨询', 
          en: 'Mining EPC Services Inquiry' 
        }}
        formSubtitle={{ 
          zh: '请填写以下表单，我们的专业EPC团队将尽快与您联系', 
          en: 'Please fill in the form below, and our professional EPC team will contact you shortly' 
        }}
        formType="mining-epc"
      />
    </CustomProductLayout>
  );
} 