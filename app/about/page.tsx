'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import ContactDialog from "@/app/components/ContactDialog";

export default function About() {
  const { isZh } = useLanguage();
  
  // 核心团队数据
  const team = [
    {
      name: isZh ? "王勇军" : "Wang Yongjun",
      position: isZh ? "创始人" : "Founder",
      image: "/images/team/team-1.jpg",
      description: isZh
        ? "拥有30年矿山设备行业经验，成功投资过多个大型矿山项目，对矿山开发和设备应用有深刻理解"
        : "30 years of experience in mining equipment industry, successfully invested in multiple large-scale mining projects with deep understanding of mine development and equipment applications"
    },
    {
      name: isZh ? "王超" : "Eddie Wang",
      position: isZh ? "CEO" : "CEO",
      image: "/images/team/team-2.jpg",
      description: isZh
        ? "拥有20年矿山设备行业经验，主导了公司多项核心技术的研发"
        : "20 years of experience in the mining equipment industry, led the development of many core technologies"
    },
    {
      name: isZh ? "吴宇涛" : "Cassian Wu",
      position: isZh ? "国际业务总监" : "International Business Director",
      image: "/images/team/team-3.jpg",
      description: isZh
        ? "拥有丰富的国际贸易经验，负责公司全球市场拓展和客户关系管理"
        : "Rich experience in international trade, responsible for global market expansion and customer relationship management"
    },
    {
      name: isZh ? "王振国" : "Wang Zhenguo",
      position: isZh ? "技术总监" : "Technical Director",
      image: "/images/team/team-4.jpg",
      description: isZh
        ? "精通精益生产管理，带领团队不断提升产品质量和生产效率"
        : "Expert in lean production management, leading the team to continuously improve product quality and production efficiency"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 第一屏：主要内容 */}
      <PageSection 
        noPadding
        variant="hero"
        isHero={true}
        breadcrumb={{
          items: [
            { label: { zh: "关于我们", en: "About Us" } }
          ]
        }}
      >
        <div className="relative py-16 px-6 md:px-8 flex items-center min-h-[300px] max-w-[1200px] mx-auto">
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row gap-12 items-center justify-between w-full">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "关于我们" : "About Us"}
                </h1>
              </div>
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left">
                  <p>
                    {isZh 
                      ? "泽鑫矿山设备有限公司成立于2012年，是一家专注于矿山设备的综合服务提供商，涵盖设计、研发、制造、安装、维护及售后服务。经过多年的发展，公司已形成完整的矿山设备产品线，能够为客户提供从矿山开采到矿物加工的全套解决方案。"
                      : "Zexin Mining Equipment Co., Ltd. was established in 2012 as a comprehensive service provider focusing on mining equipment, covering design, R&D, manufacturing, installation, maintenance, and after-sales service. After years of development, the company has formed a complete product line of mining equipment, capable of providing customers with complete solutions from mining to mineral processing."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 全屏图片区域 - 替代发展历程 */}
      <div className="w-full">
        <div className="relative w-full h-[110vh] overflow-hidden">
          <Image
            src="/images/about/company-overview.jpg" 
            alt={isZh ? "公司概览" : "Company Overview"}
            fill
            priority
            sizes="100vw"
            style={{ 
              objectFit: "cover", 
              objectPosition: "center"
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* 公司概况 */}
      <PageSection variant="dark" className="bg-black">
        <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-8 lg:gap-16">
          <div className="flex flex-col items-start justify-between gap-y-8 order-1 max-md:pb-16 pb-8">
            <strong className="text-white">
              {isZh ? "全球客户案例" : "Global Client Cases"}
            </strong>
            <div>
              <h2 className="text-lg max-md:text-4xl lg:max-w-lg lg:text-2xl xl:text-4xl text-balance text-white">
                {isZh ? "矿山设备解决方案专家" : "Global Mining Equipment Solutions Expert"}
              </h2>
              <div className="prose mt-4 xl:prose-xl lg:mt-8 text-gray-300">
                <p>
                  {isZh 
                    ? "凭借20年+的行业经验，我们已为全球20多个国家的矿业客户提供专业解决方案。拥有10项以上专利技术，成功完成超过40个大型矿业项目，树立了众多行业标杆案例。" 
                    : "With over 20 years of industry experience, we have provided professional solutions to mining clients in more than 20 countries worldwide. Possessing more than 10 patented technologies, we have successfully completed over 40 large-scale mining projects, establishing numerous industry benchmark cases."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-16 w-full mt-4">
              <div>
                <div className="text-4xl font-bold text-white mb-2">20+</div>
                <p className="text-gray-300">{isZh ? "行业经验" : "Years Experience"}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">20+</div>
                <p className="text-gray-300">{isZh ? "服务国家" : "Countries Served"}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10+</div>
                <p className="text-gray-300">{isZh ? "专利技术" : "Patented Technologies"}</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">40+</div>
                <p className="text-gray-300">{isZh ? "成功项目" : "Successful Projects"}</p>
              </div>
            </div>
            <div>
              <Link href="/solutions" className="group inline-flex items-center text-sm md:text-base gap-3 transition-colors ease-hover text-white underline-offset-4 hover:text-gray-300 focus:text-gray-300 active:text-gray-300">
                <span className="underline group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity">
                  {isZh ? "了解更多" : "Learn More"}
                </span>
                <span className="text-[#BFA46C] -translate-x-1 transition-transform ease-hover group-hover:translate-x-0.5 group-focus:translate-x-0.5 group-active:translate-x-0.5">
                  <svg focusable="false" fill="currentColor" width="32" height="32" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          <div>
            <div className="w-full h-full overflow-hidden rounded-xs">
              <Image
                src="/images/about/about-overview.jpg"
                alt={isZh ? "公司概况" : "Company Overview"}
                width={800}
                height={800}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </PageSection>

      {/* 团队介绍 */}
      <PageSection variant="gray">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "核心团队" : "Core Team"}
          </h2>
          <p className="text-lg text-black max-w-3xl">
            {isZh
              ? "我们的团队由矿山设备行业的资深专家组成，拥有丰富的行业经验和专业知识。"
              : "Our team consists of senior experts in the mining equipment industry with rich industry experience and professional knowledge."}
          </p>
        </div>

        {/* 团队成员列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-64 h-72 mx-auto overflow-hidden group">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                  className="transition-all duration-300 group-hover:brightness-110"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#333333] mb-2">{member.name}</h3>
                <p className="text-[#0078c2] mb-4">{member.position}</p>
                <p className="text-black">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
} 