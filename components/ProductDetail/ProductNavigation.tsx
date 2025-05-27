'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import ContactFormModal from '../ContactFormModal';

interface NavigationSection {
  id: string;
  label: string;
}

interface ProductNavigationProps {
  productName: string;
  locale: string;
  sections?: NavigationSection[];
  ctaUrl?: string;
  // 以下旧参数保留以向后兼容
  hasTechnicalAdvantages?: boolean;
  hasCaseStudies?: boolean;
  hasFaqs?: boolean;
}

/**
 * 支持从注入的JSON数据或组件参数中获取配置
 */
export default function ProductNavigation({ 
  productName, 
  locale,
  sections = [],
  ctaUrl,
  // 向后兼容的参数
  hasTechnicalAdvantages = false,
  hasCaseStudies = false,
  hasFaqs = false 
}: ProductNavigationProps) {
  const nextLocale = useLocale();
  const isZh = locale === 'zh' || nextLocale === 'zh';
  const [isSticky, setIsSticky] = useState(false);
  const [navSections, setNavSections] = useState<NavigationSection[]>(sections);
  const [ctaLink, setCtaLink] = useState<string>(
    ctaUrl || `/${locale}/contact?product=${encodeURIComponent(productName)}`
  );
  
  // 新增：控制报价模态框的状态
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // 新增：打开模态框函数
  const openContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactModalOpen(true);
  };
  
  // 新增：关闭模态框函数
  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  // 新增：处理平滑滚动的函数
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // 平滑滚动到目标元素
      window.scrollTo({
        top: targetElement.offsetTop - 100, // 减去一些偏移量，考虑粘性导航的高度
        behavior: 'smooth'
      });

      // 更新URL，但不跳转（可选）
      history.pushState(null, '', `#${targetId}`);
    }
  };
  
  // 添加滚动监听以实现粘性导航效果
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 从JSON数据脚本中获取配置
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    try {
      // 尝试读取注入的导航数据
      const navDataScript = document.getElementById('product_navigation_data');
      if (navDataScript && navDataScript.textContent) {
        const navData = JSON.parse(navDataScript.textContent);
        
        // 如果有sections，使用它
        if (navData.sections && Array.isArray(navData.sections)) {
          setNavSections(navData.sections);
        }
        
        // 如果有CTA URL，使用它
        if (navData.cta && navData.cta.url) {
          setCtaLink(navData.cta.url);
        }
      }
    } catch (error) {
      console.error('Error parsing product navigation data:', error);
    }
  }, []);
  
  // 如果没有从JSON获取到sections，则使用向后兼容的方式
  useEffect(() => {
    if (navSections.length === 0) {
      const compatSections: NavigationSection[] = [
        { id: 'features', label: isZh ? '特点与技术优势' : 'Features & Technical Advantages' },
        { id: 'specifications', label: isZh ? '技术规格' : 'Specifications' },
        { id: 'applications', label: isZh ? '应用领域' : 'Applications' }
      ];
      
      // 不再添加单独的技术优势选项，因为已经合并到特点中
      
      if (hasCaseStudies) {
        compatSections.push({ 
          id: 'case-studies', 
          label: isZh ? '成功案例' : 'Case Studies' 
        });
      }
      
      if (hasFaqs) {
        compatSections.push({ 
          id: 'faqs', 
          label: isZh ? '常见问题' : 'FAQs' 
        });
      }
      
      setNavSections(compatSections);
    }
  }, [hasTechnicalAdvantages, hasCaseStudies, hasFaqs, isZh, navSections.length]);

  // 处理产品名称，如果包含竖线，只保留前半部分
  const displayProductName = productName.includes('|') 
    ? productName.split('|')[0].trim() 
    : productName;

  return (
    <>
    <nav 
      data-block-section="" 
      aria-label={productName} 
      className={`sticky top-0 bg-white z-[35] border-b border-gray-100 mb-16 lg:mb-32 transition-all duration-300 ${isSticky ? 'shadow-sm' : ''}`}
      id="product-navigation"
    >
      <div className="contain">
        <div className="flex items-center gap-x-8">
          <p className="hidden font-bold lg:block py-6 font-headline">{displayProductName}</p>
          
          <ul className="hidden gap-x-8 lg:flex overflow-x-auto">
            {navSections.map((section, index) => (
              <li key={index}>
                <a 
                  className="block whitespace-nowrap border-b-2 border-transparent p-0 py-6 no-underline hover:border-primary transition-colors duration-200 font-text" 
                  href={`#${section.id}`}
                  onClick={(e) => handleSmoothScroll(e, section.id)}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex md:gap-x-8 py-6 gap-x-6 max-lg:w-full lg:ml-auto max-lg:justify-end">
              <a
              href={ctaLink}
                onClick={openContactModal}
              className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover no-underline rounded-xs bg-secondary px-6 py-3 text-white hover:bg-secondary-200 hover:text-white active:bg-secondary-400 active:text-white focus:text-white visited:text-white font-text"
            >
              <span>
                {isZh ? '获取报价' : 'Request a quote'}
              </span>
              </a>
          </div>
        </div>
      </div>
    </nav>
      
      {/* 联系表单模态框 */}
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
        formTitle={{
          zh: '产品报价请求',
          en: 'Request a Quote'
        }}
        formSubtitle={{
          zh: '请填写以下表单，我们将为您提供产品报价及更多信息',
          en: 'Please fill out the form below, and we will provide you with a product quote and more information'
        }}
        subjectDefaultValue={productName}
        formType="quote"
        placeholders={{
          subject: {
            zh: "产品名称",
            en: "Product Name"
          },
          message: {
            zh: "请描述您的具体需求，包括应用场景、处理量要求等",
            en: "Please describe your specific needs, including application scenarios, processing capacity requirements, etc."
          }
        }}
      />
    </>
  );
} 