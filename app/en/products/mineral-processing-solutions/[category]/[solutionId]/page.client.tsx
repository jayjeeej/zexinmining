'use client';

import React, { useState, useEffect } from 'react';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import Link from 'next/link';
import ProductLayout from '@/components/layouts/ProductLayout';
import Container from '@/components/Container';
import ContactCard from '@/components/ContactCard';
import ProductApplications from '@/components/ProductDetail/ProductApplications';
import RelatedProducts from '@/components/ProductDetail/RelatedProducts';
import HeroSection from '@/components/HeroSection';
import CardAnimationProvider from '@/components/CardAnimationProvider';
import ContactFormModal from '@/components/ContactFormModal';

// 定义解决方案数据类型
interface ProcessStep {
  id: number;
  title: string;
  description: string;
  imageSrc?: string;
}

interface RelatedEquipment {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  href: string;
}

interface RelatedProduct {
  id: string;
  title: string;
  imageSrc: string;
  href: string;
  category?: string;
  specs?: {
    label: string;
    value: string;
    unit?: string;
    subtext?: string;
  }[];
}

interface ApplicationItem {
  icon?: string;
  title: string;
  description: string;
}

// 更新后的解决方案数据类型定义
interface SolutionData {
  id: string;
  // 支持两种格式：嵌套对象（中文JSON）和直接字符串（英文JSON）
  mineralName: string | {
    zh: string;
    en: string;
  };
  title?: string | {
    zh: string;
    en: string;
  };
  description?: string | {
    zh: string;
    en: string;
  };
  heroImage: string;
  processTitle?: string | {
    zh: string;
    en: string;
  };
  processIntroduction: string | {
    zh: string;
    en: string;
  };
  processSteps: ProcessStep[];
  processFlowImage?: string;
  equipmentTitle?: string | {
    zh: string;
    en: string;
  };
  relatedEquipment?: RelatedEquipment[];
  RequiredEquipment?: RelatedEquipment[];
  features?: string[];
  advantages?: {
    title: string;
    description: string;
    iconSrc?: string;
  }[];
  applicationFields?: string | {
    zh: string;
    en: string;
  };
  applicationsImage?: string; // 添加应用领域图片字段
  applications?: ApplicationItem[];
  relatedProducts?: string[] | RelatedProduct[]; // 可以是ID数组或完整对象数组
}

interface SolutionDetailClientProps {
  category: string;
  solutionId: string;
  solutionData: SolutionData;
  breadcrumbItems: any[];
  relatedProducts: RelatedProduct[]; // 添加从服务端获取的相关产品数据
}

export default function SolutionDetailClient({ 
  category,
  solutionId,
  solutionData,
  breadcrumbItems,
  relatedProducts
}: SolutionDetailClientProps) {
  // 硬编码为英文版
  const locale = 'en';
  const isZh = false;
  
  // 添加模态框状态
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // 获取分类名称
  function getCategoryName(category: string): string {
    const categoryNames: Record<string, {zh: string, en: string}> = {
      'new-energy': {zh: '新能源矿种', en: 'New Energy Minerals'},
      'precious-metals': {zh: '贵金属', en: 'Precious Metals'},
      'non-ferrous': {zh: '有色金属', en: 'Non-ferrous Metals'},
      'ferrous': {zh: '黑色金属', en: 'Ferrous Metals'},
      'non-metallic': {zh: '非金属', en: 'Non-metallic Minerals'}
    };
    
    return categoryNames[category]?.en || category;
  }

  // 获取多语言字段值的辅助函数
  const getLocalizedValue = (field: any): string => {
    if (!field) return '';
    
    // 如果是字符串，直接返回
    if (typeof field === 'string') return field;
    
    // 如果是对象，返回英文值
    if (typeof field === 'object') {
      return field['en'] || '';
    }
    
    return '';
  };

  // 获取页面标题
  const pageTitle = solutionData.title 
    ? getLocalizedValue(solutionData.title)
    : `${getLocalizedValue(solutionData.mineralName)} Beneficiation Process`;

  // 获取页面描述
  const pageDescription = solutionData.description 
    ? getLocalizedValue(solutionData.description)
    : `Zexin provides professional ${getLocalizedValue(solutionData.mineralName)} beneficiation process solutions for efficient extraction and processing of ${getLocalizedValue(solutionData.mineralName)} mineral resources.`;

  // 处理当前显示的流程步骤 - 改为手风琴状态管理
  const [openSteps, setOpenSteps] = useState<Set<number>>(() => {
    // 创建包含所有步骤索引的初始集合，使所有步骤默认都处于打开状态
    const initialOpenSteps = new Set<number>();
    for (let i = 0; i < solutionData.processSteps.length; i++) {
      initialOpenSteps.add(i);
    }
    return initialOpenSteps;
  });

  // 切换手风琴开关状态
  const toggleStep = (stepIndex: number) => {
    setOpenSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* 添加ContactFormModal组件 */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        formType="processing-solution"
        formTitle={{ 
          zh: '选矿解决方案咨询', 
          en: 'Mineral Processing Solution Inquiry' 
        }}
        formSubtitle={{ 
          zh: '请填写以下表单，我们的专业团队将根据您的具体需求提供定制方案', 
          en: 'Please fill in the form below, and our professional team will provide customized solutions based on your specific requirements' 
        }}
        subjectDefaultValue={`${isZh ? 'About ' : ''} ${getLocalizedValue(solutionData.mineralName)} ${isZh ? '选矿解决方案的咨询' : ' Processing Solution'}`}
      />
      
      {/* 添加CardAnimationProvider以启用流程图动画效果 */}
      <CardAnimationProvider />
      
    <ProductLayout locale={locale} breadcrumbItems={breadcrumbItems}>
      {/* 自定义Hero区域 - 使用HeroSection组件但添加自定义渐变遮罩 */}
      <div className="relative">
        {/* 自定义灰色渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white z-0"></div>
        
        {/* 使用HeroSection组件 */}
        <div className="relative z-10">
          {/* 自定义响应式对齐方式：小屏幕左对齐，大屏幕居中 */}
          <div className="md:hidden">
            <HeroSection
              title={pageTitle}
              description=""
              textAlign="left"
              showDecorationLine={true}
              decorationLineColor="bg-gray-200"
              backgroundColor="bg-transparent"
              headingLevel="h1"
            />
          </div>
          <div className="hidden md:block">
            <HeroSection
              title={pageTitle}
              description={<>
                <div className="h-[1px] w-24 bg-gray-200 mx-auto my-4"></div>
              </>}
              textAlign="center"
              showDecorationLine={false}
              backgroundColor="bg-transparent"
              headingLevel="h1"
            />
          </div>
        </div>
      </div>

      {/* 2. 工艺介绍部分 - 交互式流程展示 - 改为手风琴格式 */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <Container>
          {/* 修改布局为左右结构，标题左对齐垂直居中，内容右对齐 */}
          <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
            <div className="w-full md:w-1/3 text-left mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-normal">
                {solutionData.processTitle 
                  ? getLocalizedValue(solutionData.processTitle)
                  : 'Process Introduction'
                }
              </h2>
            </div>
            <div className="w-full md:w-2/3 text-right">
              <p className="text-lg sm:text-xl md:text-[26px] font-bold w-full">
                {getLocalizedValue(solutionData.processIntroduction)}
              </p>
            </div>
          </div>

          {/* 手风琴式流程步骤 - 修改为黑色主题 */}
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            {(solutionData.processSteps || []).map((step, index) => {
              const isOpen = openSteps.has(index);
              
              return (
                <div key={index} className="rounded">
                  <button 
                    className={`w-full flex justify-between items-center py-3 sm:py-4 px-4 sm:px-6 text-left focus:outline-none transition-colors duration-300 ${
                      isOpen ? 'bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
                    }`}
                    onClick={() => toggleStep(index)}
                  >
                    <div className="flex items-center">
                      <span className="text-base sm:text-lg md:text-xl font-medium">{step.title}</span>
                    </div>
                    <span className="text-xl md:text-2xl transition-transform duration-300 text-[#ff6633]">{isOpen ? '−' : '+'}</span>
                  </button>
                  
                  {/* 步骤内容 */}
                  <div 
                    className={`transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
                  >
                    <div className="bg-white p-4 sm:p-6">
                      <p className="text-base md:text-lg text-gray-700">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 应用领域部分 - 使用ProductApplications组件 */}
      {(solutionData.applications && solutionData.applications.length > 0) && (
        <section className="py-10 sm:py-12 md:py-16 bg-white">
            <ProductApplications 
              applications={solutionData.applications}
              locale={locale}
              applicationsImage={solutionData.applicationsImage}
            />
        </section>
      )}
      
      {/* 底部导航区域 */}
      <section className="py-8 sm:py-10 md:py-12 bg-white -mt-8 sm:-mt-12 md:-mt-16">
        <Container>
          <div className="pt-8 sm:pt-10 md:pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
              <Link 
                href={`/${locale}/products/mineral-processing-solutions`}
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
                {isZh ? '返回所有选矿解决方案' : 'Back to All Processing Solutions'}
              </Link>
              
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="group inline-flex items-center text-base gap-3 transition-colors ease-hover no-underline rounded-xs bg-black hover:bg-gray-200 px-4 sm:px-6 py-2 sm:py-3 text-white hover:text-black active:bg-gray-200 active:text-black border-2 border-[#ff6633]"
              >
                <span className="font-medium">
                  {isZh ? '咨询定制解决方案' : 'Inquire About Custom Solutions'}
                </span>
              </button>
            </div>
          </div>
        </Container>
      </section>
      
      {/* 相关产品部分 - 使用服务端获取的数据 */}
      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          title={isZh ? "工艺所需设备" : "Required Equipment"}
        />
      )}
    </ProductLayout>
    </>
  );
} 