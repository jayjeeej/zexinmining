'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import CardAnimationProvider from '@/components/CardAnimationProvider';

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

interface RelatedProductsProps {
  products: RelatedProduct[];
  title: string;
}

export default function RelatedProducts({ products, title }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;
  
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxVisibleItems, setMaxVisibleItems] = useState(3); // 改为默认3个，与参考网站一致
  const [slideWidth, setSlideWidth] = useState(327); // 固定卡片宽度，类似参考代码
  const [containerWidth, setContainerWidth] = useState(0);
  
  // 计算可视区域能显示的最大卡片数量
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      
      // 根据屏幕宽度设置整数个可见项目
      if (newWidth >= 1280) {
        setMaxVisibleItems(3); // 大屏幕显示3个
      } else if (newWidth >= 768) {
        setMaxVisibleItems(2); // 中等屏幕显示2个
      } else {
        setMaxVisibleItems(1); // 小屏幕显示1个
      }
      
      // 更新容器宽度
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 当容器宽度变化时，确保显示整数个卡片
  useEffect(() => {
    if (!containerWidth) return;
    
    // 计算间距 (16px)
    const gap = 16;
    
    // 确保一行能完整显示maxVisibleItems个卡片
    const calculatedWidth = Math.floor((containerWidth - (maxVisibleItems - 1) * gap) / maxVisibleItems);
    
    // 更新卡片宽度
    setSlideWidth(calculatedWidth);
  }, [containerWidth, maxVisibleItems]);
  
  // 预加载所有图片
  useEffect(() => {
    // 预加载所有图片，避免滚动时再加载
    products.forEach(product => {
      const img = new Image();
      img.src = product.imageSrc;
    });
  }, [products]);
  
  // 处理左右箭头导航
  const handleScroll = (direction: 'prev' | 'next') => {
    if (scrollContainerRef.current) {
      const newIndex = direction === 'next' 
        ? Math.min(currentIndex + 1, products.length - maxVisibleItems)
        : Math.max(currentIndex - 1, 0);
        
      // 使用固定宽度计算滚动位置，避免宽度计算不一致导致的闪烁
      scrollContainerRef.current.scrollTo({
        left: newIndex * (slideWidth + 16), // 加上间距
        behavior: 'smooth'
      });
      
      setCurrentIndex(newIndex);
    }
  };
  
  // 计算进度条宽度
  // 使用参考网站的相同计算逻辑
  const progressWidth = (maxVisibleItems / products.length) * 100;
  
  // 计算进度条位置
  const progressMax = 100 - progressWidth;
  const progressPosition = currentIndex === 0 
    ? 0 
    : (currentIndex / (products.length - maxVisibleItems)) * progressMax;
  
  // 使用防抖函数处理滚动事件，减少状态更新频率
  const debouncedHandleScroll = useCallback(
    debounce(() => {
      if (!scrollContainerRef.current || maxVisibleItems >= products.length) return;
      
      const container = scrollContainerRef.current;
      // 使用卡片宽度+间距计算滚动索引
      const newIndex = Math.round(container.scrollLeft / (slideWidth + 16));
      
      // 确保索引在有效范围内
      const validIndex = Math.max(0, Math.min(newIndex, products.length - maxVisibleItems));
      
      if (validIndex !== currentIndex) {
        setCurrentIndex(validIndex);
      }
    }, 150), // 150ms的防抖延迟
    [currentIndex, maxVisibleItems, products.length, slideWidth]
  );
  
  // 监听滚动事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', debouncedHandleScroll);
    
    return () => {
      container.removeEventListener('scroll', debouncedHandleScroll);
      debouncedHandleScroll.cancel(); // 清除防抖定时器
    };
  }, [debouncedHandleScroll]);
  
  return (
    <>
      {/* 添加CardAnimationProvider确保动画效果与产品列表页面一致 */}
      <CardAnimationProvider />
      
    <section className="pb-40 lg:pb-80 mb-40 lg:mb-80 bg-gray-50 py-12 lg:py-24 scroll-mt-32 last-of-type:mb-0">
      <div className="contain grid gap-y-4 lg:grid-cols-6 pb-8 lg:pb-12 not-prose">
        <div className="lg:col-span-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center w-full lg:col-span-2 lg:col-start-5 lg:justify-end lg:mt-1">
          {/* 这里可以添加筛选或其他控件 */}
        </div>
      </div>
      
      <div className="contain">
          <div 
            data-carousel="" 
            data-aria-label="Carousel" 
            data-number-in-view={maxVisibleItems} 
            data-controls-position="outside" 
            data-indicator="bar" 
            data-initiated="" 
            className="not-prose relative" 
            aria-label="产品轮播"
          >
          <ul 
            ref={scrollContainerRef}
            className="hide-scrollbar m-0 grid snap-x list-none auto-cols-max grid-flow-col overflow-x-auto scroll-smooth p-0 bg-opacity-20"
              style={{ 
                columnGap: '16px',
                scrollBehavior: 'smooth'
              }}
            tabIndex={0}
          >
            {products.map((product) => (
                <li key={product.id} className="snap-start" style={{ width: `${slideWidth}px` }}>
                  <div className="h-full group relative rounded-xs bg-white pb-8 product-card">
                  <div className="mb-10">
                      {/* 使用常规img标签代替OptimizedImage，模仿参考网站的方式 */}
                      <img 
                        className="w-full rounded-t-xs" 
                        src={`${product.imageSrc}?width=768&height=440&rmode=crop&rsampler=bicubic&compand=true&quality=90`} 
                        alt={product.title}
                        width="768" 
                        height="440" 
                        loading="eager"
                      />
                  </div>
                  <div className="flex flex-col gap-6 px-5">
                      <p className="leading-none decoration-2 sm:underline-offset-4 sm:text-2xl text-xl font-medium font-display">
                      {product.title}
                    </p>
                  </div>
                  <Link href={product.href} className="absolute left-0 top-0 h-full w-full">
                    <span className="sr-only">{product.title}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          
          {/* 进度指示器 */}
          <div className="w-full pb-3 pt-8 -bottom-6 left-0">
            <span aria-hidden="true" className="bg-gray bg-opacity-15 z-10 block h-0.5 w-full">
              <span 
                className="block h-0.5 bg-primary transition-all ease-hover" 
                style={{ 
                  width: `${progressWidth}%`,
                  marginLeft: `${progressPosition}%`
                }}
              ></span>
            </span>
          </div>
          
          {/* 导航按钮 */}
          {products.length > maxVisibleItems && (
            <div className="absolute -bottom-14 right-0 flex gap-4">
              <button 
                className="flex items-center justify-center rounded-full bg-gray-100 p-3 transition-colors ease-hover hover:bg-gray-200 active:bg-gray-300"
                type="button"
                onClick={() => handleScroll('prev')}
                disabled={currentIndex === 0}
              >
                <span className="sr-only">上一页</span>
                <span className="text-current">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <button 
                className="flex items-center justify-center rounded-full bg-gray-100 p-3 transition-colors ease-hover hover:bg-gray-200 active:bg-gray-300"
                type="button"
                onClick={() => handleScroll('next')}
                disabled={currentIndex >= products.length - maxVisibleItems}
              >
                <span className="sr-only">下一页</span>
                <span className="text-current">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </div>
          )}
            
            {/* 添加与参考网站相同的隐藏iframe */}
            <iframe 
              style={{ 
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                border: 0,
                opacity: 0,
                pointerEvents: 'none',
                zIndex: -1
              }} 
              aria-hidden="true" 
              tabIndex={-1} 
              src="about:blank"
            ></iframe>
        </div>
      </div>
    </section>
    </>
  );
} 