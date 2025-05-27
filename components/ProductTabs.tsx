'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from './Container';

interface ProductCategory {
  id: string;
  name: string;
  href: string;
}

interface ProductTabsProps {
  categories: ProductCategory[];
  locale: string;
  currentCategory: string; // 当前类别ID，用于从标签中排除
}

export default function ProductTabs({ categories, locale, currentCategory }: ProductTabsProps) {
  const pathname = usePathname() || '';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // 过滤掉当前类别，只显示其他类别
  const filteredCategories = categories.filter(category => category.id !== currentCategory);
  
  // 检查滚动状态，决定是否显示箭头
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px 容差
  };
  
  // 初始化和窗口大小变化时检查
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);
  
  // 监听滚动事件
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);
  
  // 处理箭头点击滚动
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 200; // 每次滚动的距离
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative w-full pb-2 md:pb-1">
      <div 
        ref={scrollContainerRef}
        className="w-auto max-w-full overflow-x-auto scrollbar-hide pb-0 px-12"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <div className="flex items-center justify-center min-w-max gap-5">
          {filteredCategories.map((category, index) => (
              <Link
              key={category.id}
                href={category.href}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              >
              <span className={`absolute inset-0 rounded-lg ${hoveredIndex === index ? 'bg-gradient-to-r from-[#ffeedd] to-[#ffccaa]' : 'bg-white'} -z-10 transform ${hoveredIndex === index ? 'scale-110' : 'scale-100'} shadow-md`}></span>
              <div className="relative flex items-center px-4 py-0 z-0">
                <span 
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-md ${hoveredIndex === index ? 'h-[70%] bg-[#ff6633]' : 'h-0'}`}
                ></span>
                <span className={`font-medium text-sm transition-colors duration-300 ${hoveredIndex === index ? 'text-[#ff6633] font-bold' : 'text-gray-700'}`}>
                {category.name}
                </span>
              </div>
              </Link>
          ))}
        </div>
      </div>
      
      {/* 左滚动箭头 */}
      {showLeftArrow && (
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg rounded-full w-8 h-8 flex items-center justify-center focus:outline-none nav-arrow-button"
          onClick={() => handleScroll('left')}
          aria-label={locale === 'zh' ? "向左滚动" : "Scroll left"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#666" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* 右滚动箭头 */}
      {showRightArrow && (
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg rounded-full w-8 h-8 flex items-center justify-center focus:outline-none nav-arrow-button"
          onClick={() => handleScroll('right')}
          aria-label={locale === 'zh' ? "向右滚动" : "Scroll right"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#666" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
} 