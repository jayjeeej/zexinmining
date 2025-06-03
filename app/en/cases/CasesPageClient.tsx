'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import Container from '@/components/Container';
import Link from 'next/link';
import Image from 'next/image';
import CardAnimationProvider from '@/components/CardAnimationProvider';
import ContactFormModal from '@/components/ContactFormModal';
import ContactCard from '@/components/ContactCard';
import HeroSection from '@/components/HeroSection';

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
  breadcrumbItems: { name: string; href?: string }[];
  pageTitle: string;
  pageDescription: string;
  casesList: CaseProject[]; // 添加案例列表属性
}

export default function CasesPageClient({
  breadcrumbItems,
  pageTitle,
  pageDescription,
  casesList
}: CasesPageClientProps) {
  // 写死语言设置为英文
  const locale = 'en';
  const isZh = false;
  
  // 控制联系表单模态框的状态
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // 添加位置记忆相关状态
  const initialLoadRef = useRef(true); // 用于追踪是否是首次加载
  const didRestoreScrollRef = useRef(false); // 追踪是否已恢复滚动位置
  
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
  
  // 保存当前状态到history.state和sessionStorage
  const saveStateToHistory = () => {
    const currentState = {
      selectedCategory,
      selectedYear,
      scrollPosition: window.scrollY
    };
    
    try {
      history.replaceState(currentState, '');
      sessionStorage.setItem('casesPageState', JSON.stringify(currentState));
    } catch (error) {
      console.error('Failed to save cases page state:', error);
    }
  };
  
  // 恢复状态
  const restoreState = (state: any, isRecentBack = false) => {
    if (!state) return;
    
    try {
      // 恢复过滤器状态
      if (state.selectedCategory) {
        setSelectedCategory(state.selectedCategory);
      }
      
      if (state.selectedYear) {
        setSelectedYear(state.selectedYear);
      }
      
      // 延迟恢复滚动位置以确保内容已渲染
      if (typeof state.scrollPosition === 'number' && !didRestoreScrollRef.current) {
        didRestoreScrollRef.current = true;
        
        // 使用多层RAF嵌套来确保DOM完全更新后再滚动
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // 始终使用平滑滚动效果
            window.scrollTo({
              top: state.scrollPosition,
              behavior: 'smooth'
            });
          });
        });
      }
    } catch (error) {
      console.error('Failed to restore cases page state:', error);
    }
  };
  
  // 初始化过滤器和项目
  useEffect(() => {
    setFilters(generateFilters(processedCases));
    setFilteredProjects(processedCases);
    
    // 控制浏览器的滚动恢复行为
    if ('scrollRestoration' in history) {
      // 禁用浏览器默认的滚动位置恢复，让我们自己控制
      history.scrollRestoration = 'manual';
    }
    
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      
      // 首先尝试从history.state恢复
      if (history.state) {
        restoreState(history.state, false);
      } 
      // 否则从sessionStorage恢复
      else {
        const savedState = sessionStorage.getItem('casesPageState');
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            restoreState(state, false);
            
            // 同时更新history.state
            history.replaceState(state, '');
          } catch (error) {
            console.error('Failed to parse saved cases page state:', error);
          }
        }
      }
    }
    
    return () => {
      // 恢复默认行为
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);
  
  // 监听页面滚动，持续更新状态
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // 使用防抖，避免频繁更新
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        saveStateToHistory();
      }, 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [selectedCategory, selectedYear]);
  
  // 监听popstate事件 (浏览器后退/前进按钮)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 检查是否是从案例详情页返回
      const isBackFromDetail = sessionStorage.getItem('backFromCaseDetail') === 'true';
      const backTimestamp = sessionStorage.getItem('backTimestamp');
      
      if (isBackFromDetail) {
        // 清除标记
        sessionStorage.removeItem('backFromCaseDetail');
        sessionStorage.removeItem('backTimestamp');
        
        // 检查返回时间，如果刚刚返回就使用平滑滚动
        const isRecentBack = backTimestamp ? (Date.now() - parseInt(backTimestamp)) < 1000 : false;
        
        // 稍微延迟恢复滚动位置，让页面有足够时间准备
        setTimeout(() => {
          if (event.state) {
            // 确保滚动恢复更平滑
            restoreState(event.state, isRecentBack);
          } else {
            // 尝试从sessionStorage获取
            const savedState = sessionStorage.getItem('casesPageState');
            if (savedState) {
              try {
                const state = JSON.parse(savedState);
                restoreState(state, isRecentBack);
              } catch (error) {
                console.error('Failed to parse saved cases page state:', error);
              }
            }
          }
        }, 50); // 略微增加延迟以确保DOM更新
      } else if (event.state) {
        // 正常的浏览器后退/前进操作
        restoreState(event.state, false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // 当用户离开页面或点击某个案例项时保存状态
  useEffect(() => {
    // 保存当前状态的函数
    const saveState = () => {
      saveStateToHistory();
    };
    
    // 为所有案例链接添加点击事件监听器
    const caseLinks = document.querySelectorAll(`a[href^="/${locale}/cases/"]`);
    caseLinks.forEach(link => {
      link.addEventListener('click', () => {
        // 设置标记表示从案例列表页离开
        sessionStorage.setItem('backFromCaseDetail', 'true');
        sessionStorage.setItem('backTimestamp', Date.now().toString());
        saveState();
      });
    });
    
    // 当用户离开页面时保存状态
    window.addEventListener('beforeunload', saveState);
    
    // 清理函数
    return () => {
      caseLinks.forEach(link => {
        link.removeEventListener('click', saveState);
      });
      window.removeEventListener('beforeunload', saveState);
    };
  }, [selectedCategory, selectedYear, locale]);
  
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
    // 更新状态
    setTimeout(saveStateToHistory, 100);
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
      {/* 添加HeroSection组件，设置headingLevel为h1 */}
      <HeroSection
        title={pageTitle}
        description={pageDescription}
        headingLevel="h1"
      />
      
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
                Project Filters
              </h2>
              
              {(selectedCategory || selectedYear) && (
                <button 
                  onClick={resetFilters}
                  className="text-sm flex items-center text-black underline decoration-1 underline-offset-4 hover:text-[#ff6633] transition-colors"
                >
                  Reset Filters
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
                  <option value="">All Categories</option>
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
                  <option value="">All Years</option>
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
                      View Details
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
            Showing {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </Container>
      </div>
      
      {/* 使用ContactCard组件替代底部按钮 */}
      <ContactCard
        title="Looking for Mining Solutions Tailored to Your Needs?"
        description="Our professional team can provide customized mining equipment and solutions based on your specific requirements.<br>Whether you need a complete process design or configuration advice for specific equipment, we can provide professional support."
        buttonText="Inquire About Custom Solutions"
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