'use client';

import Image from "next/image";
import Link from "next/link";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getNavigationItems, getLogo } from '@/lib/navigation';
import Container from '@/components/Container';
import { LazyImage } from '@/components/LazyLoadWrapper';
import OptimizedImage from '@/components/layouts/OptimizedImage';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils/date'; // 引入日期格式化函数
import CardAnimationProvider from '@/components/CardAnimationProvider';

// 定义新闻项类型
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author?: string;
  slug: string;
}

export default function ClientHomePage({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  
  // 固定为英文版本
  const safeLang = locale || 'en';
  
  // 添加新闻状态
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  
  // 获取最新新闻
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setIsLoadingNews(true);
        const response = await fetch(`/api/news?locale=${safeLang}&limit=3&page=1`);
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        setLatestNews(data.news || []);
      } catch (error) {
        console.error('Error fetching latest news:', error);
      } finally {
        setIsLoadingNews(false);
      }
    };
    
    fetchLatestNews();
  }, [safeLang]);
  
  // 构建本地化内容
  const content = {
    epcmo: {
      title: t('epcmo.title'),
      heading: t('epcmo.heading'),
      description: t('epcmo.description'),
      link: t('epcmo.link'),
      url: '/en/products/mining-epc',
      imageSrc: "/images/Homepage/epcmo-service.jpg",
      imageAlt: t('epcmo.title')
    },
    latestNews: {
      title: t('latestNews.title'),
      allNewsLink: t('latestNews.allNewsLink')
    },
    careersSustainability: {
      careers: {
        tag: "Global Cases",
        title: "Global Success Cases",
        text: "Explore our successful mining projects worldwide and learn how Zexin provides tailored mineral processing solutions for clients.",
        imageSrc: "/images/Homepage/global-cases.jpg",
        url: '/en/cases'
      },
      sustainability: {
        tag: "Processing Solutions",
        title: "Our Mineral Processing Solutions",
        text: "From single equipment to complete processing plants, we provide comprehensive mineral processing solutions for various ore types and production scales.",
        imageSrc: "/images/Homepage/mineral-processing.jpg",
        url: '/en/products/mineral-processing-solutions'
      }
    }
  };

  // 使用集中式导航配置
  const navigationItems = getNavigationItems(safeLang);
  const logo = getLogo(safeLang);

  return (
    <>
      <CardAnimationProvider />
      <Header logo={logo} items={navigationItems} />

      <main id="main">
        <section 
          data-block-section="" 
          data-remove-margin="" 
          className="mb-12 lg:mb-24 bg-[#ffffff]" 
          data-block="intro"
          suppressHydrationWarning
        >
          <Container>
            <div className="grid gap-y-2 lg:grid-cols-6 py-[3rem] lg:py-[4rem]">
              <div className="lg:col-span-3 w-full">
                <h1 className="text-balance font-display text-6xl lg:text-7xl w-full">
                  <span className="text-2xl sm:text-3xl lg:text-4xl block text-black">Welcome to</span>
                  <span className="text-[42px] sm:text-[56px] lg:text-[72px] block" style={{
                    color: 'black',
                  }}>Zexin Mining Equipment</span>
                </h1>
              </div>
              <div className="w-full prose lg:mt-1 lg:col-span-2 lg:col-start-5">
                <p className="font-text text-black">
                  Professional mining equipment manufacturer, providing efficient and reliable intelligent solutions and comprehensive technical support for global customers
                </p>
                <Link 
                  href="/en/products/ore-processing"
                  className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover no-underline rounded-xs bg-black hover:bg-gray-200 px-6 py-3 text-white hover:text-black active:bg-gray-200 active:text-white mt-4 lg:mt-8"
                >
                  <span className="font-medium">
                    Browse Products
                  </span>
                </Link>
              </div>
            </div>
          </Container>
          <div className="3xl:aspect-video 3xl:max-h-[95vh] 3xl:mx-auto 3xl:min-w-screen-container overflow-y-hidden"
            itemScope
            itemType="https://schema.org/ImageObject"
          >
            <OptimizedImage 
              className="w-full max-w-full h-auto" 
              src="/images/Homepage/hero.jpg"
              alt="Zexin Mining Equipment Manufacturing - Industrial Welding"
              width={1600}
              height={900}
              priority
              loading={undefined}
              quality={90}
              unoptimized={true}
            />
            <meta itemProp="name" content="Zexin Mining Equipment Manufacturing" />
            <meta itemProp="description" content="Worker at Zexin Mining Equipment factory performing precision welding on large mining equipment components, with blue welding sparks illuminating the industrial environment" />
            <meta itemProp="representativeOfPage" content="true" />
          </div>
        </section>

        {/* 最新新闻部分 */}
        <section data-block-section="" className="mb-16 lg:mb-32" data-block="latestlisting">
          <Container>
            <div className="grid gap-y-4 lg:grid-cols-6 pb-12 lg:pb-16 not-prose">
              <div className="lg:col-span-3">
                <h2 className="font-display text-gray text-xl md:text-2xl xl:text-[32px] leading-tight" style={{ fontFamily: '"Sandvik Sans Display", sans-serif' }}>{content.latestNews.title}</h2>
              </div>
              <div className="flex items-center w-full lg:col-span-2 lg:col-start-5 lg:justify-end lg:mt-1">
                <Link
                  href="/en/news"
                  className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover text-current hover:text-current focus:text-current active:text-current"
                >
                  <span className="group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity font-text underline decoration-black decoration-1 underline-offset-4">
                    {content.latestNews.allNewsLink}
                  </span>
                  <span className="text-[#ff6633]">
                    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 2L9 6L4.5 10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </Container>
          <Container>
            <div className="mb-24 grid gap-8 gap-y-12 md:auto-cols-fr md:grid-flow-col">
              {isLoadingNews ? (
                // 加载状态
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="w-full animate-pulse">
                    <div className="h-6 w-24 bg-gray-200 mb-2"></div>
                    <div className="h-4 w-36 bg-gray-200 mb-4"></div>
                    <div className="h-6 w-full bg-gray-200"></div>
                  </div>
                ))
              ) : latestNews.length > 0 ? (
                // 显示获取到的真实新闻
                latestNews.map((news, index) => (
                <div key={index} className="w-full">
                  <div className="group relative flex h-full flex-col gap-4 no-underline" data-block="latest-listing-item">
                    <div className="max-md:px-6">
                      <div className="flex flex-col gap-4 not-prose">
                        <div className="flex flex-wrap gap-1">
                            <span className="text-gray-400 font-text">
                              {news.category === 'company' ? 'Company News' :
                               news.category === 'product' ? 'Product Updates' :
                               news.category === 'technical' ? 'Beneficiation Techniques' :
                               news.category}
                            </span>
                        </div>
                          <p className="-mt-3 font-text text-sm text-gray-500">{formatDate(news.date, safeLang)}</p>
                        <div className="not-prose">
                            <h3 className="text-lg font-display text-balance max-w-lg group-hover:underline underline-offset-2 decoration-1 line-clamp-2 h-[3rem]">
                              {news.title}
                          </h3>
                          </div>
                        </div>
                      </div>
                      <Link href={`/en/news/${news.slug}`} className="absolute left-0 top-0 h-full w-full">
                        <span className="sr-only">{news.title}</span>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                // 无新闻时的备用显示
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No news available</p>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* EPCMO服务介绍部分 */}
        <section data-block-section="" className="mb-16 lg:mb-32 bg-gray text-white" data-block="epcmo-service">
          <Container>
            <div className="py-8 md:py-16">
              <div className="grid last-of-type:mb-0 gap-8 md:auto-cols-fr md:grid-flow-col lg:gap-16">
                <div className="flex flex-col items-start justify-between gap-y-8 order-1 max-md:pb-16 pb-8 max-md:order-1">
                  <strong className="">
                    {content.epcmo.title}
                  </strong>
                  <div>
                    <h2 className="text-white text-xl md:text-2xl xl:text-[32px] leading-tight text-balance" style={{ fontFamily: '"Sandvik Sans Display", sans-serif' }}>
                      {content.epcmo.heading}
                    </h2>
                    <div className="prose mt-4 xl:prose-xl lg:mt-8 text-white">
                      <p>{content.epcmo.description}</p>
                    </div>
                  </div>
                  <div>
                    <Link href={content.epcmo.url} className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover text-current hover:text-current focus:text-current active:text-current text-white">
                      <span className="group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity underline decoration-white decoration-1 underline-offset-4">
                        {content.epcmo.link}
                        <span className="sr-only">
                          Learn more about our EPCMO comprehensive services
                        </span>
                      </span>
                      <span className="text-[#ff6633]">
                        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5 2L9 6L4.5 10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
                <div>
                  <LazyImage 
                    src={content.epcmo.imageSrc}
                    alt={content.epcmo.imageAlt}
                    width={400}
                    height={400}
                    className="w-full rounded-xs"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 双卡片部分 */}
        <section data-block-section="" className="mb-16 lg:mb-32" data-block="splitmedia">
          <Container>
            <div className="grid gap-y-8 lg:grid-cols-2 lg:items-stretch lg:gap-x-8 lg:gap-y-0">
              {/* 全球案例卡片 */}
              <div className="flex h-full flex-col bg-[#f8f8f8]">
                <div className="flex-1">
                  <div className="flex flex-col gap-6 p-6 lg:p-10">
                    <div className="font-bold text-sm text-gray-600">
                      {content.careersSustainability.careers.tag}
                    </div>
                    <h2 className="text-gray text-xl md:text-2xl xl:text-[32px] leading-tight" style={{ fontFamily: '"Sandvik Sans Display", sans-serif' }}>
                      {content.careersSustainability.careers.title}
                    </h2>
                    <div className="prose mb-2 text-gray-600">
                      <p>{content.careersSustainability.careers.text}</p>
                    </div>
                    <div className="mt-auto">
                      <Link href={content.careersSustainability.careers.url} className="text-sm font-bold underline decoration-[#ff6633]">
                        View success cases
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* 加工解决方案卡片 */}
              <div className="flex h-full flex-col bg-[#f8f8f8]">
                <div className="flex-1">
                  <div className="flex flex-col gap-6 p-6 lg:p-10">
                    <div className="font-bold text-sm text-gray-600">
                      {content.careersSustainability.sustainability.tag}
                    </div>
                    <h2 className="text-gray text-xl md:text-2xl xl:text-[32px] leading-tight" style={{ fontFamily: '"Sandvik Sans Display", sans-serif' }}>
                      {content.careersSustainability.sustainability.title}
                    </h2>
                    <div className="prose mb-2 text-gray-600">
                      <p>{content.careersSustainability.sustainability.text}</p>
                    </div>
                    <div className="mt-auto">
                      <Link href={content.careersSustainability.sustainability.url} className="text-sm font-bold underline decoration-[#ff6633]">
                        Browse processing solutions
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer logoAlt="Zexin Group" />
    </>
  );
} 