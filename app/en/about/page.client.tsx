'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Container from '@/components/Container';
import HeroSection from '@/components/HeroSection';
import Breadcrumb from '@/components/Breadcrumb';
import { getNavigationItems, getLogo, getBreadcrumbConfig } from '@/lib/navigation';
import { LazyImage } from '@/components/LazyLoadWrapper';

export default function AboutPageClient() {
  const t = useTranslations();
  
  // 固定为英文版
  const locale = 'en';
  const isZh = false;
  
  // 使用集中式导航配置
  const navigationItems = getNavigationItems(locale);
  const logo = getLogo(locale);
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 轮播图状态
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselImages = [
    {
      src: '/images/about/about-company.jpg',
      alt: 'Mining Processing Equipment Manufacturer'
    },
    {
      src: '/images/about/about-company-2.jpg',
      alt: 'Mining Processing Equipment Manufacturing Plant'
    }
  ];

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    }, 5000); // 每5秒切换一次

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // 手动切换轮播图
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };
  
  // 页面内容配置
  const content = {
    hero: {
      title: 'About Us',
      description: 'Zexin Mining Equipment is committed to providing high-quality equipment and professional services to mining clients worldwide, becoming a reliable industry partner through innovative technology and operational excellence.'
    },
    companyIntro: {
      title: 'Company Introduction',
      content: 'Zexin Mining Equipment Co., Ltd., established in 2012, is a comprehensive service provider focused on mining equipment, covering design, research and development, manufacturing, installation, maintenance, and after-sales service. With a factory area of 60,000 square meters (approximately 15 acres), after years of development, the company has formed a complete mining equipment product line, providing customers with complete solutions from mining to mineral processing.',
      values: {
        title: 'Our Core Values',
        items: [
          {
            title: 'Innovation',
            description: 'Continuously driving technological innovation to provide more efficient mining solutions'
          },
          {
            title: 'Quality',
            description: 'Adhering to high standards of product and service quality, ensuring reliability and durability'
          },
          {
            title: 'Customer First',
            description: 'Focusing on customer needs, providing customized solutions and comprehensive support'
          },
          {
            title: 'Sustainability',
            description: 'Pursuing environmental friendliness and social responsibility, promoting sustainable development in the mining industry'
          }
        ]
      }
    },
    teamIntro: {
      title: 'Our Management Team',
      content: '',
      leaders: [
        {
          name: 'Wang Yongjun',
          title: 'Founder',
          description: '30 years in mining equipment, invested in large projects, deep understanding of equipment and applications.',
          imageSrc: '/images/about/team-founder.jpg'
        },
        {
          name: 'Eddie Wang',
          title: 'CEO',
          description: '20 years in mining equipment, led core technology development.',
          imageSrc: '/images/about/team-ceo.jpg'
        },
        {
          name: 'Cassian Wu',
          title: 'International Business Director',
          description: 'Experienced in international trade, global market and client management.',
          imageSrc: '/images/about/team-intl.jpg'
        },
        {
          name: 'Wang Zhenguo',
          title: 'Technical Director',
          description: 'Lean production expert, improves quality and efficiency.',
          imageSrc: '/images/about/team-tech.jpg'
        }
      ]
    },
    contactUs: {
      title: 'Contact Us',
      phone: {
        title: 'Phone',
        contacts: [
          { number: '+86 18577086999', name: 'Eddie Wang' },
          { number: '+86 13807719695', name: 'Cassian Wu' }
        ]
      },
      whatsapp: {
        title: 'WhatsApp',
        number: '+63 9654706775'
      },
      email: {
        title: 'Email',
        address: 'zexinminingequipment@hotmail.com'
      },
      headquarters: {
        title: 'Fusui Headquarters',
        company: 'Zexin Mining Equipment Co., Ltd.',
        address: 'Shanglong Avenue, ASEAN Youth Industrial Park, Fusui County, Nanning City, Guangxi Province, China'
      },
      branch: {
        title: 'Nigeria Branch',
        company: 'Zexin Mining Equipment Nigeria Ltd.',
        address: 'Little Rayfield Road, Jos South L.G.A, Plateau State, Nigeria'
      },
      global: {
        title: 'Global Operations',
        regions: [
          {
            name: 'Asia',
            countries: 'China, Indonesia, Malaysia, Thailand, Vietnam'
          },
          {
            name: 'Africa',
            countries: 'Nigeria, Tanzania, Ghana, South Africa, Zambia'
          },
          {
            name: 'Middle East',
            countries: 'UAE, Saudi Arabia'
          }
        ]
      }
    }
  };

  return (
    <>
      <Header logo={logo} items={navigationItems} />

      <main id="main">
        {/* 添加面包屑导航 */}
        <Breadcrumb 
          locale={locale}
          items={[
            breadcrumbConfig.home,
            { name: 'About Us' }
          ]}
        />
        
        {/* Hero Section */}
        <HeroSection
          title={content.hero.title}
          description={content.hero.description}
          textAlign="left"
        />

        {/* 公司简介部分 - 极简设计 */}
        <section id="company-introduction" className="py-10">
          {/* 顶部图片轮播 - 铺满屏幕 */}
          <div className="w-full mb-10 relative">
            {/* 轮播图片 */}
            <div className="relative">
              {carouselImages.map((image, index: number) => (
                <div
                  key={index}
                  className={`absolute w-full transition-opacity duration-500 ${
                    activeSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <LazyImage
                    src={image.src}
                    alt={image.alt}
                    width={1920}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              ))}
              {/* 确保占位正确 */}
              <div className="relative opacity-0 z-0">
                <LazyImage
                  src={carouselImages[0].src}
                  alt="placeholder"
                  width={1920}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* 轮播控制按钮 */}
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
              <button 
                onClick={() => setActiveSlide((activeSlide - 1 + carouselImages.length) % carouselImages.length)}
                className="bg-white/50 hover:bg-white/80 rounded-full p-2 text-gray-800 transition-all"
                aria-label="Previous"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setActiveSlide((activeSlide + 1) % carouselImages.length)}
                className="bg-white/50 hover:bg-white/80 rounded-full p-2 text-gray-800 transition-all"
                aria-label="Next"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* 指示点 */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-20">
              {carouselImages.map((_, index: number) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    activeSlide === index ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <Container>
            {/* 公司简介部分 */}
            <div className="mb-20">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold leading-tight text-gray-700 max-w-4xl xl:max-w-5xl uppercase text-right ml-auto">{content.companyIntro.content}</p>
            </div>
            
            {/* 使命与愿景 - 简约双栏 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-20">
              {/* 使命 */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[200px] mb-8 md:mb-0 bg-[#f8f8f8]">
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">Our Mission</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  To drive sustainable mining development through innovative technology and outstanding service, creating value for our clients.
                </p>
                </div>
              </div>
              
              {/* 愿景 */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[200px] bg-[#f8f8f8]">
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">Our Vision</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  To become a global leader in mining equipment, driving industry development through innovation.
                </p>
                </div>
              </div>
            </div>
            
          </Container>
          
          {/* 核心价值观 - 灰色背景全宽 */}
          <section className="bg-gray py-20 mb-0 w-full">
            <Container>
              <h3 className="text-3xl font-bold text-white mb-10">{content.companyIntro.values.title}</h3>
              
              <div className="flex flex-col space-y-8">
                {content.companyIntro.values.items.map((value, index) => {
                  // 确定每个价值观对应的图片路径
                  let imagePath = '';
                  if (value.title === 'Innovation') {
                    imagePath = '/images/about/value-innovation.jpg';
                  } else if (value.title === 'Quality') {
                    imagePath = '/images/about/value-quality.jpg';
                  } else if (value.title === 'Customer First') {
                    imagePath = '/images/about/value-customer.jpg';
                  } else if (value.title === 'Sustainability') {
                    imagePath = '/images/about/value-sustainability.jpg';
                  }
                  
                  // 扩展标题内容
                  let expandedTitle = '';
                  let expandedDescription = '';
                  
                  if (value.title === 'Innovation') {
                    expandedTitle = 'Innovation & Technology Leadership';
                    expandedDescription = 'Continuously driving technological innovation and research to provide more efficient, sustainable mining solutions that lead the industry forward.';
                  } else if (value.title === 'Quality') {
                    expandedTitle = 'Quality & Excellence';
                    expandedDescription = 'Adhering to the highest standards of product and service quality, ensuring reliability, durability and performance excellence in everything we deliver.';
                  } else if (value.title === 'Customer First') {
                    expandedTitle = 'Customer First Approach';
                    expandedDescription = 'Focusing on customer needs and success as our primary goal, providing customized solutions, responsive support and building lasting partnerships.';
                  } else if (value.title === 'Sustainability') {
                    expandedTitle = 'Sustainability & Responsibility';
                    expandedDescription = 'Pursuing environmental friendliness and social responsibility in all operations, promoting sustainable development practices throughout the mining industry.';
                  }
                  
                  return (
                    <div key={index} className="m-0 pb-8 last:pb-0">
                      <div className="flex flex-col gap-6 sm:flex-row md:gap-8 lg:gap-16">
                        {/* 长方形图片 */}
                        <div className="w-80 h-45 flex-shrink-0 overflow-hidden rounded">
                          <LazyImage
                            src={imagePath}
                            alt={value.title}
                            width={320}
                            height={180}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white mb-4">
                            {expandedTitle}
                          </h4>
                          <div className="mb-6">
                            <p className="text-gray-400 leading-relaxed">{expandedDescription}</p>
                          </div>
                          <div className="w-full border-b border-gray-700 pt-2"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
          
          {/* 专业领域 - 手风琴设计 - 铺满屏幕 */}
          <div className="bg-[#f8f8f8] w-full mt-0">
            <div className="contain mx-auto py-10">
              <h3 className="text-3xl font-bold text-black mb-10">Areas of Expertise</h3>
              
              <style jsx>{`
                @keyframes slideDown {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                details[open] > div {
                  animation: slideDown 0.3s ease-out;
                }
              `}</style>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 矿物加工 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">Mineral Processing</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      Advanced ore crushing, grinding and separation technologies to improve mineral recovery rates.
                    </p>
                  </div>
                </details>
                
                {/* 设备制造 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">Equipment Manufacturing</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      Design and manufacture of high-quality mining equipment, ensuring reliability and durability.
                    </p>
                  </div>
                </details>
                
                {/* 工程与咨询 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">Engineering & Consulting</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      Professional mine engineering design and technical consulting to optimize operational processes.
                    </p>
                  </div>
                </details>
                
                {/* 智能矿山 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">Smart Mining</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      Digital and automated solutions to enhance mine safety and efficiency.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* 团队介绍部分 */}
        <section id="team-introduction" className="py-20 bg-white text-gray-800 relative overflow-hidden">
          <Container>
            <div className="flex flex-col md:flex-row items-center mb-10 w-full">
              {/* 标题左对齐 */}
              <div className="md:w-1/2 w-full text-left">
                <h2 className="text-4xl font-bold mb-8 text-gray-800">{content.teamIntro.title}</h2>
              </div>
              {/* 内容右对齐 */}
              <div className="md:w-1/2 w-full text-right">
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.teamIntro.leaders.map((leader, index) => (
                <div key={index} className="transition-all duration-300 hover:brightness-110 group flex flex-col">
                  <div className="mb-6 overflow-hidden relative h-[260px] flex items-center justify-center">
                    <LazyImage
                      src={leader.imageSrc}
                      alt={leader.name}
                      width={260}
                      height={260}
                      className="h-full w-auto object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mt-4">{leader.name}</h3>
                  <p className="text-[#ff6633] text-center mb-4 h-6">{leader.title}</p>
                  <p className="text-gray-600 text-center h-20">{leader.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 联系我们部分 */}
        <section id="contact-us" className="pt-10 pb-12 bg-white relative">
          <Container>
            {/* 标题部分 - 左对齐设计（去掉装饰条） */}
            <div className="flex flex-col mb-20">
              <h2 className="text-4xl font-bold text-gray-800">{content.contactUs.title}</h2>
            </div>
            
            {/* 统一联系方式 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 mb-20">
              <div className="space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">{content.contactUs.phone.title}</p>
                  <div className="space-y-2">
                    {content.contactUs.phone.contacts.map((contact, index) => (
                      <div key={index} className="flex">
                        <p className="text-gray-800">{contact.number}</p>
                        <span className="text-gray-500 ml-3">{contact.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">{content.contactUs.whatsapp.title}</p>
                  <p className="text-gray-800">{content.contactUs.whatsapp.number}</p>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">{content.contactUs.email.title}</p>
                  <a href={`mailto:${content.contactUs.email.address}`} className="text-gray-800 hover:text-[#ff6633] transition-all inline-block">
                    {content.contactUs.email.address}
                  </a>
                </div>
              </div>
            </div>
            
            {/* 地址区块 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mb-24">
              {/* 总部地址 */}
              <div className="relative">
                {/* 装饰条 */}
                <div className="w-16 border-t border-[#ff6633] mb-6"></div>
                <h3 className="text-2xl font-medium text-gray-800 mb-8">{content.contactUs.headquarters.title}</h3>
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">Company</p>
                  <p className="text-gray-800 mb-2">{content.contactUs.headquarters.company}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-8">Address</p>
                  <p className="text-gray-600 leading-relaxed">
                    {content.contactUs.headquarters.address.split(', ').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < content.contactUs.headquarters.address.split(', ').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              {/* 尼日利亚分公司地址 */}
              <div className="relative">
                {/* 装饰条 */}
                <div className="w-16 border-t border-[#ff6633] mb-6"></div>
                <h3 className="text-2xl font-medium text-gray-800 mb-8">{content.contactUs.branch.title}</h3>
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">Company</p>
                  <p className="text-gray-800 mb-2">{content.contactUs.branch.company}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-8">Address</p>
                  <p className="text-gray-600 leading-relaxed">
                    <span>Little Rayfield Road</span><br/>
                    <span>Jos South L.G.A, Plateau State</span><br/>
                    <span>Nigeria</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* 全球业务部分（与上方共用Container） */}
            <div className="pt-10">
              <h3 className="text-xl font-medium text-gray-800 mb-16 text-center">{content.contactUs.global.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                {content.contactUs.global.regions.map((region, index) => (
                  <div key={index} className="group">
                    <div className="w-full border-t border-gray-200 mb-10"></div>
                    <h4 className="text-lg font-medium text-gray-800 mb-3">{region.name}</h4>
                    <p className="text-gray-600">{region.countries}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer logoAlt="Zexin Group" />
    </>
  );
} 