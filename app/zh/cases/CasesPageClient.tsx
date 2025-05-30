'use client';

import React, { useState, useEffect } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import Container from '@/components/Container';
import Link from 'next/link';
import Image from 'next/image';
import CardAnimationProvider from '@/components/CardAnimationProvider';
import ContactFormModal from '@/components/ContactFormModal';
import ContactCard from '@/components/ContactCard';

// 案例项目接口定义
interface CaseProject {
  id: string;
  title: string;
  summary?: string;
  description?: string; // 添加描述字段，可能用作summary
  location?: string;
  year?: string;
  category?: string;
  imageSrc?: string;
  images?: string[]; // 添加图片数组字段
  slug: string;
}

// 过滤器接口定义
interface Filters {
  categories: string[];
  years: string[];
}

// 客户端组件接口
interface CasesPageClientProps {
  locale: string;
  breadcrumbItems: { name: string; href?: string }[];
  pageTitle: string;
  pageDescription: string;
  casesList: CaseProject[]; // 添加案例列表属性
}

export default function CasesPageClient({
  locale,
  breadcrumbItems,
  pageTitle,
  pageDescription,
  casesList
}: CasesPageClientProps) {
  const isZh = locale === 'zh';
  
  // 控制联系表单模态框的状态
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // 处理和规范化案例数据
  const processCaseData = (cases: CaseProject[]): CaseProject[] => {
    return cases.map(caseItem => {
      // 确保imageSrc始终为有效的字符串路径
      let imageSrc = '/images/mineral-processing/case-study-default.jpg'; // 默认图片
      
      if (caseItem.imageSrc) {
        // 如果案例指定了图片，优先使用
        imageSrc = caseItem.imageSrc;
      } else if (caseItem.images && caseItem.images.length > 0) {
        // 如果有图片数组，使用第一张
        imageSrc = caseItem.images[0];
      } else {
        // 尝试使用项目特定文件夹中的plant-layout.jpg
        const projectSpecificImage = `/images/cases/${caseItem.slug}/plant-layout.jpg`;
        imageSrc = projectSpecificImage;
        // 注意：无法在客户端组件检查文件是否存在，我们假设它存在，否则Next.js会使用默认fallback
      }
      
      return {
        id: caseItem.id,
        title: caseItem.title,
        summary: caseItem.summary || caseItem.description || '',
        location: caseItem.location || '',
        year: caseItem.year || '',
        category: caseItem.category || '',
        imageSrc: imageSrc,
        slug: caseItem.slug
      };
    });
  };
  
  // 预处理案例数据
  const processedCases = processCaseData(casesList);
  
  // 从案例数据中提取过滤选项
  const generateFilters = (projects: CaseProject[]): Filters => {
    const categories = Array.from(new Set(projects.filter(p => p.category).map(project => project.category as string)));
    const years = Array.from(new Set(projects.filter(p => p.year).map(project => project.year as string)));
    
    return {
      categories: categories.sort(),
      years: years.sort((a, b) => Number(b) - Number(a)) // 年份降序排列
    };
  };
  
  // 状态管理
  const [filters, setFilters] = useState<Filters>({ categories: [], years: [] });
  const [filteredProjects, setFilteredProjects] = useState<CaseProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  // 初始化过滤器和项目
  useEffect(() => {
    setFilters(generateFilters(processedCases));
    setFilteredProjects(processedCases);
  }, []);
  
  // 过滤项目
  const filterProjects = () => {
    let result = [...processedCases];
    
    if (selectedCategory) {
      result = result.filter(project => project.category === selectedCategory);
    }
    
    if (selectedYear) {
      result = result.filter(project => project.year === selectedYear);
    }
    
    setFilteredProjects(result);
  };
  
  // 监听过滤器变化
  useEffect(() => {
    filterProjects();
  }, [selectedCategory, selectedYear]);
  
  // 重置过滤器
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedYear('');
  };
  
  return (
    <ProductLayout
      locale={locale}
      breadcrumbItems={breadcrumbItems}
    >
      {/* 添加卡片动画提供者 */}
      <CardAnimationProvider />
      
      {/* 联系表单模态框 */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        formType="case"
        formTitle={
          {
            zh: '需要定制化的矿山解决方案？',
            en: 'Need Customized Mining Solutions?'
          }
        }
      />
      
      <div className="bg-white py-16 md:py-24">
        <Container>
          {/* 过滤器区域 */}
          <div className="mb-16 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-black">
                {isZh ? '项目过滤' : 'Project Filters'}
              </h2>
              
              {(selectedCategory || selectedYear) && (
                <button 
                  onClick={resetFilters}
                  className="text-sm flex items-center text-black underline decoration-1 underline-offset-4 hover:text-[#ff6633] transition-colors"
                >
                  {isZh ? '重置过滤器' : 'Reset Filters'}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* 类别过滤器 - 移除标签，修改样式为只有下边框 */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border-0 border-b border-gray-100 focus:outline-none focus:ring-0 focus:border-[#ff6633] bg-transparent"
                >
                  <option value="">{isZh ? '所有类别' : 'All Categories'}</option>
                  {filters.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* 年份过滤器 - 移除标签，修改样式为只有下边框 */}
              <div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-3 border-0 border-b border-gray-100 focus:outline-none focus:ring-0 focus:border-[#ff6633] bg-transparent"
                >
                  <option value="">{isZh ? '所有年份' : 'All Years'}</option>
                  {filters.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* 案例展示区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProjects.map(project => (
              <Link
                key={project.id}
                href={`/${locale}/cases/${project.slug}`}
                className="group flex flex-col bg-white border border-gray-100 transition-colors duration-300 category-card"
              >
                {/* 项目图片 */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.imageSrc || '/images/mineral-processing/case-study-default.jpg'}
                    alt={project.title}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {/* 项目信息 */}
                <div className="flex flex-col p-6 flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-black">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{project.location}</span>
                      {project.location && project.year && (
                      <span className="text-sm text-gray-500">|</span>
                      )}
                      <span className="text-sm text-gray-500">{project.year}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-black mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    {project.summary}
                  </p>
                  
                  <div className="mt-auto group-hover:text-[#ff6633] transition-colors flex items-center gap-1">
                    <span className="text-sm font-medium underline decoration-1 underline-offset-4">
                      {isZh ? '查看详情' : 'View Details'}
                    </span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <polyline 
                        points="9 18 15 12 9 6" 
                        stroke="#ff6633" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 结果计数 */}
          <div className="mt-8 text-sm text-gray-500 text-center">
            {isZh 
              ? `显示 ${filteredProjects.length} 个结果`
              : `Showing ${filteredProjects.length} result${filteredProjects.length !== 1 ? 's' : ''}`
            }
          </div>
        </Container>
      </div>
      
      {/* 使用ContactCard组件替代底部按钮 */}
      <ContactCard
        title={isZh ? "寻找适合您的矿山解决方案？" : "Looking for Mining Solutions Tailored to Your Needs?"}
        description={isZh ? "我们的专业团队可以根据您的具体需求，提供定制化的矿山设备和解决方案。<br>无论您是需要完整工艺流程设计，还是特定设备的配置建议，我们都能为您提供专业支持。" : "Our professional team can provide customized mining equipment and solutions based on your specific requirements.<br>Whether you need a complete process design or configuration advice for specific equipment, we can provide professional support."}
        buttonText={isZh ? "咨询定制解决方案" : "Inquire About Custom Solutions"}
        linkUrl=""
        useModal={true}
        formTitle={{ 
          zh: '需要定制化的矿山解决方案？', 
          en: 'Need Customized Mining Solutions?' 
        }}
        formSubtitle={{ 
          zh: '请填写以下表单，我们的专业团队将根据您的需求提供定制方案', 
          en: 'Please fill in the form below, and our professional team will provide customized solutions based on your needs' 
        }}
        formType="case"
      />
    </ProductLayout>
  );
} 