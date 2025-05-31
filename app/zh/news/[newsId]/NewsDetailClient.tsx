'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ProductLayout from '@/components/layouts/ProductLayout';
import Container from '@/components/Container';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils/date';
import ShareButtons from '@/components/ShareButtons';
import { NewsItem } from '@/lib/api/news';

// 组件属性类型
interface NewsDetailClientProps {
  locale: string;
  newsItem: NewsItem;
  relatedNews: NewsItem[];
  breadcrumbItems: any[];
}

export default function NewsDetailClient({ 
  locale, 
  newsItem, 
  relatedNews,
  breadcrumbItems 
}: NewsDetailClientProps) {
  const router = useRouter();
  const isZh = locale === 'zh';
  const [hasError, setHasError] = useState(false);

  // 分类映射
  const categoryMap: Record<string, { zh: string, en: string }> = {
    'company': { zh: '公司新闻', en: 'Company News' },
    'product': { zh: '产品动态', en: 'Product Updates' },
    'industry': { zh: '行业资讯', en: 'Industry Insights' },
    'technical': { zh: '选矿知识', en: 'Beneficiation Techniques' }
  };

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    return categoryMap[categoryId] 
      ? (isZh ? categoryMap[categoryId].zh : categoryMap[categoryId].en)
      : categoryId;
  };
  
  // 控制浏览器的滚动恢复行为
  useEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        // 禁用浏览器默认的滚动位置恢复，让我们自己控制
        // 但是保留平滑滚动效果
        history.scrollRestoration = 'manual';
      }
      
      return () => {
        if ('scrollRestoration' in history) {
          // 恢复默认行为
          history.scrollRestoration = 'auto';
        }
      };
    } catch (error) {
      console.error('Error setting scroll restoration:', error);
      // 错误不需要向用户显示，因为这只是增强功能
    }
  }, []);

  // 处理返回列表的点击事件
  const handleBackClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      // 先标记这是一个来自我们按钮的返回操作
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('backFromNewsDetail', 'true');
        
        // 保存一个时间戳，用于确保平滑滚动效果
        sessionStorage.setItem('backTimestamp', Date.now().toString());
      }
      
      // 使用Next.js的路由器来处理返回，避免直接操作DOM和history API
      if (window && window.history && window.history.length > 1) {
        router.back();
      } else {
        // 如果没有历史记录，则安全地导航到列表页
        router.push(`/${locale}/news`);
      }
    } catch (error) {
      console.error('Error handling back button:', error);
      // 发生错误时的备用方案
      router.push(`/${locale}/news`);
    }
  }, [router, locale]);

  // 全局错误处理
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      // 记录错误，但不要打断用户体验
      console.error('Global error caught:', event.error);
      setHasError(true);
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // 处理未捕获的Promise错误
      console.error('Unhandled promise rejection:', event.reason);
      // 防止错误被浏览器显示
      event.preventDefault();
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ProductLayout locale={locale} breadcrumbItems={breadcrumbItems}>
      {hasError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {isZh ? '页面加载时发生错误，部分功能可能受影响。' : 'An error occurred while loading the page. Some functions may be affected.'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <article className="pb-8 sm:pb-12 md:pb-16">
        {/* 文章头部 */}
        <header className="py-6 sm:py-8 md:py-12 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="mb-10 sm:mb-14 md:mb-20 flex items-center gap-4 sm:gap-6 text-base">
                <span className="text-gray-500">{formatDate(newsItem.date, locale)}</span>
                <span className="text-[#ff6633]">
                  {getCategoryName(newsItem.category)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8 text-black leading-tight">
                {newsItem.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 sm:py-4 gap-4 sm:gap-2">
                {newsItem.author && (
                  <div className="flex items-center">
                    <span className="text-base text-gray-700">{newsItem.author}</span>
                  </div>
                )}
                
                {/* 分享按钮组件 - 仅在非移动端显示 */}
                <div className="hidden sm:block self-end sm:self-auto">
                  <ShareButtons 
                    title={newsItem.title} 
                    url={`https://www.zexinmining.com/${locale}/news/${newsItem.slug}`}
                    className="text-xs sm:text-sm" 
                  />
                </div>
              </div>
            </div>
          </Container>
        </header>
        
        {/* 特色图片 */}
        <section className="py-4 sm:py-6 md:py-8 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[16/9]">
                <OptimizedImage
                  src={newsItem.image || '/images/news/placeholder.jpg'}
                  alt={newsItem.title}
                  fill
                  className="object-cover w-full h-full"
                  priority
                  unoptimized={true}
                />
              </div>
            </div>
          </Container>
        </section>
        
        {/* 文章内容 */}
        <section className="py-6 sm:py-8 md:py-12 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div 
                className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-img:rounded-none prose-img:mx-auto prose-a:text-[#ff6633] prose-headings:font-normal prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:mt-8 sm:prose-h3:mt-12 prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-[24px] prose-p:my-4 sm:prose-p:my-6 prose-p:text-sm sm:prose-p:text-base md:prose-p:text-[16px] prose-strong:text-sm sm:prose-strong:text-base md:prose-strong:text-[16px]"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />
            </div>
          </Container>
        </section>

        {/* 内容底部分享按钮 - 所有设备 */}
        <section className="py-4 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-end">
                <ShareButtons 
                  title={newsItem.title} 
                  url={`https://www.zexinmining.com/${locale}/news/${newsItem.slug}`}
                  className="text-sm"
                />
              </div>
              <div className="border-t border-gray-100 mt-4"></div>
            </div>
          </Container>
        </section>

        {/* 返回列表链接 - 修改为使用Next.js路由 */}
        <div className="py-3 sm:py-4">
          <Container>
            <div className="flex justify-start sm:justify-end">
              <button 
                onClick={handleBackClick}
                className="inline-flex items-center text-black transition-colors hover:text-[#ff6633] py-1 cursor-pointer bg-transparent border-none"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 rotate-180 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="border-b border-black hover:border-[#ff6633] leading-none pb-[1px] text-sm sm:text-base whitespace-nowrap">{isZh ? '返回新闻列表' : 'Back to News List'}</span>
              </button>
            </div>
          </Container>
        </div>

        {/* 相关新闻 */}
        {relatedNews && relatedNews.length > 0 && (
          <section className="py-8 sm:py-12 md:py-16 mt-8 sm:mt-12 md:mt-16">
            <Container>
              <h2 className="text-xl sm:text-2xl font-normal mb-6 sm:mb-8 md:mb-12 text-black">
                {isZh ? '相关新闻' : 'Related News'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12">
                {relatedNews.map((news) => (
                  <Link 
                    href={`/${locale}/news/${news.slug}`}
                    key={news.id}
                    className="group block no-underline"
                  >
                    <div className="h-full flex flex-col">
                      <div className="relative aspect-[4/3] mb-3 sm:mb-4 overflow-hidden">
                        <OptimizedImage
                          src={news.image || '/images/news/placeholder.jpg'}
                          alt={news.title}
                          fill
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2 text-base">
                        <span className="text-gray-500">{formatDate(news.date, locale)}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-normal mb-1 sm:mb-2 text-black group-hover:text-[#ff6633] transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}
      </article>
    </ProductLayout>
  );
}
