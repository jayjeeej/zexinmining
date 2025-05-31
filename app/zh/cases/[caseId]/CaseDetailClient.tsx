'use client';

import React, { useState } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import Container from '@/components/Container';
import Image from 'next/image';
import Link from 'next/link';
import LazyLoadWrapper from '@/components/LazyLoadWrapper';
import ContactFormModal from '@/components/ContactFormModal';
import ContactCard from '@/components/ContactCard';

// 案例详情接口更新为匹配产品详情
interface CaseDetail {
  id: string;
  title: string;
  location: string;
  year: string;
  category: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  images: string[];
  imageSrc?: string; // 主图
  galleryImages?: string[]; // 图库图片
}

// 客户端组件接口
interface CaseDetailClientProps {
  breadcrumbItems: { name: string; href?: string }[];
  caseDetail: CaseDetail;
}

export default function CaseDetailClient({
  breadcrumbItems,
  caseDetail
}: CaseDetailClientProps) {
  // 写死语言设置为中文
  const locale = 'zh';
  const isZh = true;
  
  // 使用主图或者第一张图片
  const mainImage = caseDetail.imageSrc || caseDetail.images[0];
  // 使用图库图片或者除第一张外的其他图片
  const galleryImages = caseDetail.galleryImages || caseDetail.images.slice(1);
  
  // 控制联系表单模态框的状态
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  return (
    <ProductLayout
      locale={locale}
      breadcrumbItems={breadcrumbItems}
    >
      {/* 联系表单模态框 */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        formType="similar-project"
        formTitle={
          {
            zh: '咨询类似项目',
            en: 'Inquire About Similar Projects'
          }
        }
        subjectDefaultValue={`关于${caseDetail.title}的咨询`}
      />
      
      <div className="bg-white py-16 md:py-24">
        <Container>
          {/* 案例标题和基本信息 */}
          <div className="mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-black mb-8 leading-tight">
              {caseDetail.title}
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 uppercase">
                  项目类别
                </span>
                <span className="text-base font-medium text-black mt-1">
                  {caseDetail.category}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 uppercase">
                  项目地点
                </span>
                <span className="text-base font-medium text-black mt-1">
                  {caseDetail.location}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 uppercase">
                  完成年份
                </span>
                <span className="text-base font-medium text-black mt-1">
                  {caseDetail.year}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 uppercase">
                  客户
                </span>
                <span className="text-base font-medium text-black mt-1">
                  {caseDetail.client}
                </span>
              </div>
            </div>
          </div>
          
          {/* 主图区域 - 使用LazyLoadWrapper优化加载 */}
          <div className="mb-16">
            <LazyLoadWrapper className="relative aspect-[16/9] w-full">
              <Image
                src={mainImage}
                alt={caseDetail.title}
                fill
                unoptimized={true}
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
                className="object-cover"
              />
            </LazyLoadWrapper>
          </div>
          
          {/* 项目描述 */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <h2 className="text-2xl text-black">
                项目概述
              </h2>
              <p className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-800 md:text-right max-w-4xl">
                {caseDetail.description}
              </p>
            </div>
          </div>
          
          {/* 项目详情 - 挑战、解决方案、结果 */}
          <div className="grid grid-cols-1 gap-16 mb-16 max-w-3xl mx-auto">
            {/* 挑战 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <span className="block border-t border-[#ff6633] w-[60px] mt-4"></span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                项目挑战
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {caseDetail.challenge}
              </p>
            </div>
            
            {/* 解决方案 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <span className="block border-t border-[#ff6633] w-[60px] mt-4"></span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                解决方案
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {caseDetail.solution}
              </p>
            </div>
            
            {/* 结果 */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <span className="block border-t border-[#ff6633] w-[60px] mt-4"></span>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                项目成果
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {caseDetail.results}
              </p>
            </div>
          </div>
          
          {/* 项目图片 - 使用LazyLoadWrapper优化加载 */}
          {galleryImages.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl text-black mb-8">
                项目图片
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryImages.map((image, index) => (
                  <LazyLoadWrapper key={index} className="relative aspect-[4/3]">
                    <Image
                      src={image}
                      alt={`${caseDetail.title} - 图片 ${index + 1}`}
                      fill
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                    />
                  </LazyLoadWrapper>
                ))}
              </div>
            </div>
          )}
          
          {/* 导航区域 */}
          <div className="border-t border-gray-100 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <Link 
                href={`/${locale}/cases`}
                className="flex items-center text-black hover:text-[#ff6633] transition-colors underline decoration-1 underline-offset-4 text-base"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-180 mr-2"
                >
                  <polyline 
                    points="9 18 15 12 9 6" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                返回所有案例
              </Link>
            </div>
          </div>
        </Container>
      </div>
      
      {/* 添加ContactCard代替按钮 */}
      <ContactCard
        title="需要类似项目解决方案？"
        description="我们的专业工程师团队可以针对您的需求提供定制化解决方案。<br>基于这个案例项目，我们可以为您设计最适合的矿山设备配置方案。"
        buttonText="咨询类似项目"
        linkUrl=""
        useModal={true}
        formTitle={{ 
          zh: '咨询类似项目', 
          en: 'Inquire About Similar Projects' 
        }}
        formSubtitle={{ 
          zh: '请填写以下表单，我们的专业团队将基于此项目为您提供定制方案', 
          en: 'Please fill in the form below, and our professional team will provide customized solutions based on this project' 
        }}
        formType="similar-project"
      />
    </ProductLayout>
  );
} 