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
  
  // 固定为中文版
  const locale = 'zh';
  const isZh = true;
  
  // 使用集中式导航配置
  const navigationItems = getNavigationItems(locale);
  const logo = getLogo(locale);
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 页面内容配置
  const content = {
    hero: {
      title: '关于我们',
      description: '泽鑫矿山设备致力于为全球矿业客户提供高品质的设备和专业服务，通过创新技术和卓越运营，成为行业的可靠合作伙伴。'
    },
    companyIntro: {
      title: '公司介绍',
      content: '泽鑫矿山设备有限公司成立于2012年，是一家专注于矿山设备的综合服务提供商，涵盖设计、研发、制造、安装、维护及售后服务。厂区占地90亩，经过多年的发展，公司已形成完整的矿山设备产品线，能够为客户提供从矿山开采到矿物加工的全套解决方案。',
      values: {
        title: '我们的核心价值观',
        items: [
          {
            title: '创新',
            description: '持续推动技术创新，提供更高效的矿业解决方案'
          },
          {
            title: '品质',
            description: '坚持高标准的产品和服务质量，确保可靠性和耐用性'
          },
          {
            title: '客户至上',
            description: '以客户需求为中心，提供定制化解决方案和全面支持'
          },
          {
            title: '可持续发展',
            description: '追求环境友好和社会责任，促进矿业行业可持续发展'
          }
        ]
      }
    },
    teamIntro: {
      title: '我们的管理团队',
      content: '',
      leaders: [
        {
          name: '王勇军',
          title: '创始人',
          description: '30年矿业设备经验，投资多个大型矿业项目，精通设备研发与应用。',
          imageSrc: '/images/about/team-founder.jpg'
        },
        {
          name: '王超',
          title: '首席执行官',
          description: '20年行业经验，带领团队开发多项核心技术。',
          imageSrc: '/images/about/team-ceo.jpg'
        },
        {
          name: '吴宇涛',
          title: '国际业务总监',
          description: '丰富的国际贸易经验，负责全球市场拓展与客户管理。',
          imageSrc: '/images/about/team-intl.jpg'
        },
        {
          name: '王振国',
          title: '技术总监',
          description: '精益生产管理专家，提升产品质量与效率。',
          imageSrc: '/images/about/team-tech.jpg'
        }
      ]
    },
    contactUs: {
      title: '联系我们',
      phone: {
        title: '电话',
        contacts: [
          { number: '+86 18577086999', name: '王超' },
          { number: '+86 13807719695', name: '吴宇涛' }
        ]
      },
      whatsapp: {
        title: 'WhatsApp',
        number: '+63 9654706775'
      },
      email: {
        title: '邮箱',
        address: 'zexinminingequipment@hotmail.com'
      },
      headquarters: {
        title: '扶绥总部',
        company: '泽鑫矿业有限公司',
        address: '广西省南宁市扶绥县上龙镇东盟青年产业园, 扶绥县，南宁市，广西省, 中国'
      },
      branch: {
        title: '尼日利亚分公司',
        company: '泽鑫矿业尼日利亚有限公司',
        address: 'Little Rayfield Road, Jos South L.G.A, Plateau State, Nigeria'
      },
      global: {
        title: '全球业务范围',
        regions: [
          {
            name: '亚洲',
            countries: '中国, 印度尼西亚, 马来西亚, 泰国, 越南'
          },
          {
            name: '非洲',
            countries: '尼日利亚, 坦桑尼亚, 加纳, 南非, 赞比亚'
          },
          {
            name: '中东',
            countries: '阿联酋, 沙特阿拉伯'
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
            { name: '关于我们' }
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
          {/* 顶部图片 - 铺满屏幕 */}
          <div className="w-full mb-10 relative">
            <LazyImage
              src="/images/about/about-company.jpg"
              alt="About Company"
              width={1920}
              height={800}
              className="w-full h-auto"
            />
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
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">我们的使命</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  通过创新技术和卓越服务，推动矿业可持续发展，为客户创造价值。
                </p>
                </div>
              </div>
              
              {/* 愿景 */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[200px] bg-[#f8f8f8]">
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">我们的愿景</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  成为全球矿业设备领域的引领者，以创新驱动行业发展。
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
                  if (value.title === '创新') {
                    imagePath = '/images/about/value-innovation.jpg';
                  } else if (value.title === '品质') {
                    imagePath = '/images/about/value-quality.jpg';
                  } else if (value.title === '客户至上') {
                    imagePath = '/images/about/value-customer.jpg';
                  } else if (value.title === '可持续发展') {
                    imagePath = '/images/about/value-sustainability.jpg';
                  }
                  
                  // 扩展标题内容
                  let expandedTitle = '';
                  let expandedDescription = '';
                  
                  if (value.title === '创新') {
                    expandedTitle = '创新与技术领先';
                    expandedDescription = '持续推动技术创新和研发，提供更高效、更可持续的矿业解决方案，引领行业发展方向。';
                  } else if (value.title === '品质') {
                    expandedTitle = '品质与卓越';
                    expandedDescription = '坚持产品和服务的最高质量标准，确保我们所提供的一切都具有可靠性、耐用性和卓越的性能。';
                  } else if (value.title === '客户至上') {
                    expandedTitle = '客户至上理念';
                    expandedDescription = '将客户需求和成功作为我们的首要目标，提供定制化解决方案、响应迅速的支持，并建立长久的合作伙伴关系。';
                  } else if (value.title === '可持续发展') {
                    expandedTitle = '可持续发展与责任';
                    expandedDescription = '在所有运营中追求环境友好和社会责任，在整个矿业行业中推广可持续发展实践。';
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
              <h3 className="text-3xl font-bold text-black mb-10">专业领域</h3>
              
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
                    <h4 className="text-xl font-bold text-black">矿物加工</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      先进的矿石破碎、研磨和分离技术，提高矿物回收率。
                    </p>
                  </div>
                </details>
                
                {/* 设备制造 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">设备制造</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      高品质矿山设备的设计与制造，确保可靠性和耐用性。
                    </p>
                  </div>
                </details>
                
                {/* 工程与咨询 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">工程与咨询</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      专业的矿山工程设计和技术咨询，优化运营流程。
                    </p>
                  </div>
                </details>
                
                {/* 智能矿山 */}
                <details className="group bg-[#f8f8f8]">
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">智能矿山</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      数字化和自动化解决方案，提升矿山安全性和效率。
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
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">公司名称</p>
                  <p className="text-gray-800 mb-2">{content.contactUs.headquarters.company}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-8">地址</p>
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
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">公司名称</p>
                  <p className="text-gray-800 mb-2">{content.contactUs.branch.company}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-8">地址</p>
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

      <Footer logoAlt="泽鑫集团" />
    </>
  );
} 