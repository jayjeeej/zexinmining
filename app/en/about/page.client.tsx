'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
        <section id="company-introduction" className="py-20">
          <Container>
            {/* 公司简介部分 */}
            <div className="mb-20">
              {/* 顶部图片 */}
              <div className="mb-10">
                <LazyImage
                  src="/images/about/about-company.jpg"
                  alt="About Company"
                  width={1200}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
              
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold leading-tight text-gray-700 max-w-4xl xl:max-w-5xl uppercase">{content.companyIntro.content}</p>
            </div>
            
            {/* 使命与愿景 - 简约双栏 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-20">
              {/* 使命 */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[200px] mb-8 md:mb-0">
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">Our Mission</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  To drive sustainable mining development through innovative technology and outstanding service, creating value for our clients.
                </p>
                </div>
              </div>
              
              {/* 愿景 */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[200px]">
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
          <section className="bg-white py-20 mb-20 w-full">
            <Container>
              <h3 className="text-3xl font-bold text-black mb-10">{content.companyIntro.values.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {content.companyIntro.values.items.map((value, index) => (
                  <div key={index} className="pt-8" style={{
                    borderTop: '1px solid transparent', 
                    backgroundImage: 'linear-gradient(to right, #6b7280, #6b7280, transparent)', 
                    backgroundSize: '100% 1px',
                    backgroundPosition: 'top',
                    backgroundRepeat: 'no-repeat'
                  }}>
                      <h4 className="text-xl font-bold mb-4 text-black">
                        {value.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </Container>
          </section>
          
          <Container>
            {/* 专业领域 - 手风琴设计 */}
            <div className="mb-10">
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
                <details className="group bg-gray-50" open>
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
                <details className="group bg-gray-50" open>
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
                <details className="group bg-gray-50" open>
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
                <details className="group bg-gray-50" open>
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
            
                          {/* 底部间距 */}
              <div className="mt-16"></div>
          </Container>
        </section>

        {/* 团队介绍部分 */}
        <section id="team-introduction" className="py-24 bg-white text-gray-800 relative overflow-hidden">
          <Container>
            <div className="flex flex-col md:flex-row items-center mb-20 w-full">
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
        <section id="contact-us" className="pt-24 pb-12 bg-white relative">
          <Container>
            {/* 标题部分 - 左对齐设计（去掉装饰条） */}
            <div className="flex flex-col mb-24">
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
            <div className="pt-20">
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