'use client';
// Mining EPC Service Client Component - English Version
import React, { useState, useEffect, useRef } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import { getBreadcrumbConfig } from '@/lib/navigation';
import Container from '@/components/Container';
import ContactCard from '@/components/ContactCard';
import Accordion, { AccordionItem } from '@/components/Accordion';
import CountUpAnimation from '@/components/CountUpAnimation';
import Link from 'next/link';

export default function MiningEpcServiceClient() {
  // Hardcode as English version
  const locale = 'en';
  const isZh = false;
  
  // Breadcrumb navigation
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { name: 'Mining EPC Services' }
  ];

  // Page description content
  const pageDescription = 'Zexin provides comprehensive Mining Industry Chain Services (EPCMO) as a global engineering contractor, covering consulting, design, equipment procurement, construction, commissioning, and operational management for complete mining projects.';
    
  // Service items list
  const serviceItemsList = [
    'Engineering',
    'Procurement',
    'Construction',
    'Management',
    'Operation'
  ];

  // Service modules data - 5 accordion items
  const serviceModules = [
    {
      id: 'consulting',
      title: <><span className="text-[#ff6633]">E</span>ngineering</>,
      content: 'With cutting-edge innovative thinking, profound professional knowledge and rich industry experience, we provide comprehensive engineering consulting, targeted experimental research and customized mine design for all aspects of mining-processing-tailings projects.'
    },
    {
      id: 'equipment',
      title: <><span className="text-[#ff6633]">P</span>rocurement</>,
      content: 'Manufacturing and procurement of mining-processing-tailings equipment, intelligent automated mining equipment, supporting materials, installation and maintenance tools, laboratory equipment, modular buildings, steel structure workshops, and modular steel structure mineral processing plant production lines.'
    },
    {
      id: 'construction',
      title: <><span className="text-[#ff6633]">C</span>onstruction</>,
      content: 'Providing mining engineering, mineral processing plant and tailings dam civil construction, plant building, equipment installation and commissioning, technical training and other services. Engineering includes open-pit, adit, inclined shaft, ramp, vertical shaft mining facilities construction; ore bin, crushing workshop, grinding-flotation workshop, concentrate filtering workshop, smelting workshop and other mineral processing plant construction; tailings dam facilities construction; office and living areas, warehouses and maintenance workshops, as well as water, electricity, road and other infrastructure construction.'
    },
    {
      id: 'management',
      title: <><span className="text-[#ff6633]">M</span>anagement</>,
      content: 'According to customer requirements, we provide management services for the entire EPC project implementation process. Including mine design management, equipment manufacturing and procurement management, construction and installation commissioning project management, project trial operation management and other integrated services.'
    },
    {
      id: 'operation',
      title: <><span className="text-[#ff6633]">O</span>peration</>,
      content: 'According to customer requirements, we provide comprehensive mine operation management services through various cooperation methods. Covering production, equipment, safety, environment, human resources and financial core management links to comprehensively improve mine operation efficiency. At the same time, we establish a global mine service center network to provide customers with technical consulting, material supply, spare parts and after-sales service and other one-stop support.'
    }
  ];

  // Convert service modules data to format required by Accordion component
  const accordionItems: AccordionItem[] = serviceModules.map(module => ({
    id: module.id,
    title: module.title,
    content: <div className="p-6">{module.content}</div>,
    expanded: true // Default to expand all items
  }));

  // Get all module IDs as default expanded IDs
  const allModuleIds = serviceModules.map(module => module.id);

  // Custom wrapper component that only overrides the hero part of the specific page
  const CustomProductLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <ProductLayout
        locale={locale}
        breadcrumbItems={breadcrumbItems}
        // Don't pass title and description to prevent default HeroSection rendering
      >
        {/* Custom Hero section */}
        <div className="relative w-full">
          {/* Image area */}
          <section className="w-full">
            <picture>
              {/* Mobile version */}
              <source 
                srcSet="/images/products/mining-epc-contract-hero-mobile.jpg" 
                media="(max-width: 768px)" 
                type="image/jpeg" 
              />
              {/* Desktop version */}
              <source 
                srcSet="/images/products/mining-epc-contract-hero.jpg" 
                media="(min-width: 769px)" 
                type="image/jpeg" 
              />
              <img 
                src="/images/products/mining-epc-contract-hero.jpg" 
                alt="Mining EPC Services"
                className="w-full h-auto"
                loading="eager"
              />
            </picture>
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </section>
          
          {/* Content area */}
          <section className="absolute inset-0 flex items-center justify-center">
            <Container>
              <div className="text-center w-full mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display text-[#ff6633] mb-2 sm:mb-2 md:mb-3 text-balance leading-tight">
                  Full Mining Industry Chain Services (EPCMO)
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-text text-white/90 mx-auto max-w-4xl">
                  {pageDescription}
                </p>
              </div>
            </Container>
          </section>
        </div>
        
        {/* Use Accordion component instead of custom accordion */}
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
        
        {/* Mining project pain points statistics */}
        <div className="py-10 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left side - 90% statistic */}
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
                    OF MINING PROJECTS FACE EFFICIENCY LOSSES
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-[16px] text-gray-400 text-center lg:text-left">
                    Global mining projects commonly face systemic challenges including investment budget overruns, construction delays, and operational inefficiencies.
                  </p>
                </div>
              </div>
              
              {/* Right side - Pain points list */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="lg:pl-8">
                  <h3 className="text-[28px] md:text-[32px] font-bold text-black mb-4 leading-tight tracking-[-0.02em] text-center lg:text-left">
                    Current Status and Pain Points of Mining Development
                  </h3>
                  <div className="space-y-0">
                    {/* First item */}
                    <div className="py-2 sm:py-3 border-b border-[#ff6633]">
                      <p className="text-[16px] text-gray-400 mb-3">
                        Almost all exceed investment budget
                      </p>
                    </div>
                    
                    {/* Second item */}
                    <div className="py-2 sm:py-3 border-b border-[#ff6633]">
                      <p className="text-[16px] text-gray-400 mb-3">
                        Almost none are put into production on schedule or reach standards
                      </p>
                    </div>
                    
                    {/* Third item */}
                    <div className="py-2 sm:py-3 border-b border-[#ff6633]">
                      <p className="text-[16px] text-gray-400 mb-3">
                        The day of production is almost always the time for technical transformation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Mining Process Analysis */}
        <div className="relative py-14 bg-white">
          <Container>
            {/* Main title area */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
              <div className="max-w-xl">
                <h2 className="text-[28px] md:text-[32px] font-bold text-black leading-tight tracking-[-0.02em]">
                  Mineral Processing Construction Process
                </h2>
              </div>
              <div className="max-w-xl md:text-right">
                <p className="text-[18px] text-gray-700 leading-relaxed">
                  <><span className="font-bold text-black">E</span>ngineering Weaknesses, <span className="font-bold text-black">P</span>rocurement Chaos, <span className="font-bold text-black">C</span>onstruction Deficiencies lead to budget overruns, construction delays, and immediate need for technical modifications</>
                </p>
              </div>
            </div>

            {/* EPC process cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
              {/* Engineering phase */}
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
                    Engineering
                  </h3>
                </div>
                <ul className="space-y-4 pl-4">
                  {[
                    'Copying design plans or designing solely based on experience',
                    'Non-standard parts and piping designed by mineral processing personnel',
                    'Lack of holistic concept, design fails to consider future installation and commissioning issues'
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

              {/* Procurement phase */}
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
                    Procurement
                  </h3>
                </div>
                <ul className="space-y-4 pl-6">
                  {[
                    'Dispersed procurement of individual equipment from multiple manufacturers',
                    'Focus only on equipment while neglecting production line integration issues',
                    'Varying standards and capabilities from different manufacturers causing parts compatibility problems'
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

              {/* Construction phase */}
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
                    Construction
                  </h3>
                </div>
                <ul className="space-y-4 pl-6">
                  {[
                    'Lack of understanding of overseas mines and construction leads to numerous on-site installation problems',
                    'Inadequate planning resulting in extreme cases of stagnant inventory or insufficient on-site materials',
                    'Installation and commissioning teams lacking experience (especially for overseas projects)'
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

            {/* Achievement statistics - Consistent with EPC style */}
            <div className="mt-20 mb-10">
              {/* Subtitle */}
              <div className="text-center mb-10">
                <h3 className="text-[20px] text-black inline-block relative">
                  Zexin ECPMO Solution
                  <span className="block border-t border-[#ff6633] w-[60px] mx-auto mt-4"></span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {/* 20+ Years of Experience */}
                <div className="group text-center lg:text-left">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">20+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      Years of Experience
                    </h3>
                  </div>
                </div>
                
                {/* 20+ Countries Served */}
                <div className="group text-center">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">20+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      Countries Served
                    </h3>
                  </div>
                </div>
                
                {/* 10+ Patented Technologies */}
                <div className="group text-center">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">10+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      Patented Technologies
                    </h3>
                  </div>
                </div>
                
                {/* 40+ Successful Projects */}
                <div className="group text-center lg:text-right">
                  <div className="mb-3">
                    <span className="text-[#ff6633] text-6xl md:text-7xl font-bold leading-none">40+</span>
                    <h3 className="mt-3 text-[20px] font-bold text-black">
                      Successful Projects
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* Brief description with horizontal line */}
              <div className="mt-8 text-center mx-auto max-w-3xl relative">
                <div className="border-t border-gray-200 mb-4"></div>
                <p className="text-[16px] text-gray-700 leading-relaxed mb-4">
                  With over 20 years of industry experience, we have provided professional solutions to mining clients in more than 20 countries worldwide. Possessing more than 10 patented technologies, we have successfully completed over 40 large-scale mining projects, establishing numerous industry benchmarks.
                </p>
                <div className="text-center mt-6">
                  <Link 
                    href="/en/cases" 
                    className="inline-flex items-center text-black group"
                  >
                    <span className="underline decoration-black decoration-1 underline-offset-4 text-[14px]">
                      Explore Our Case Studies
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-[1px] group-hover:translate-x-1 transition-transform">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
        
        {/* Other page content */}
        {children}
      </ProductLayout>
    );
  };

  return (
    <CustomProductLayout>
      {/* Contact consultation area */}
      <ContactCard
        title="Need Mining Engineering Contracting Services?"
        description="Our team of specialized engineers is ready to provide technical consultation and customized solutions.<br/>Contact us for more details and application advice on mining EPC services!"
        buttonText="Contact Us"
        linkUrl={`/${locale}/contact`}
        imageSrc="/images/mineral-processing/contact-support.jpg"
        imageAlt="Mining EPC Services Consultation"
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