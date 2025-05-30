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

export default function AboutPageClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const isZh = locale === 'zh';
  
  // 使用集中式导航配置
  const navigationItems = getNavigationItems(locale);
  const logo = getLogo(locale);
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 页面内容配置
  const content = {
    hero: {
      title: isZh ? '关于我们' : 'About Us',
      description: isZh 
        ? '泽鑫矿山设备致力于为全球矿业客户提供高品质的设备和专业服务，通过创新技术和卓越运营，成为行业的可靠合作伙伴。' 
        : 'Zexin Mining Equipment is committed to providing high-quality equipment and professional services to mining clients worldwide, becoming a reliable industry partner through innovative technology and operational excellence.'
    },
    companyIntro: {
      title: isZh ? '公司介绍' : 'Company Introduction',
      content: isZh 
        ? '泽鑫矿山设备有限公司成立于2012年，是一家专注于矿山设备的综合服务提供商，涵盖设计、研发、制造、安装、维护及售后服务。厂区占地90亩，经过多年的发展，公司已形成完整的矿山设备产品线，能够为客户提供从矿山开采到矿物加工的全套解决方案。' 
        : 'Zexin Mining Equipment Co., Ltd., established in 2012, is a comprehensive service provider focused on mining equipment, covering design, research and development, manufacturing, installation, maintenance, and after-sales service. With a factory area of 60,000 square meters (approximately 15 acres), after years of development, the company has formed a complete mining equipment product line, providing customers with complete solutions from mining to mineral processing.',
      values: {
        title: isZh ? '我们的核心价值观' : 'Our Core Values',
        items: [
          {
            title: isZh ? '创新' : 'Innovation',
            description: isZh ? '持续推动技术创新，提供更高效的矿业解决方案' : 'Continuously driving technological innovation to provide more efficient mining solutions'
          },
          {
            title: isZh ? '品质' : 'Quality',
            description: isZh ? '坚持高标准的产品和服务质量，确保可靠性和耐用性' : 'Adhering to high standards of product and service quality, ensuring reliability and durability'
          },
          {
            title: isZh ? '客户至上' : 'Customer First',
            description: isZh ? '以客户需求为中心，提供定制化解决方案和全面支持' : 'Focusing on customer needs, providing customized solutions and comprehensive support'
          },
          {
            title: isZh ? '可持续发展' : 'Sustainability',
            description: isZh ? '追求环境友好和社会责任，促进矿业行业可持续发展' : 'Pursuing environmental friendliness and social responsibility, promoting sustainable development in the mining industry'
          }
        ]
      }
    },
    teamIntro: {
      title: isZh ? '我们的管理团队' : 'Our Management Team',
      content: isZh 
        ? '' 
        : '',
      leaders: [
        {
          name: isZh ? '王勇军' : 'Wang Yongjun',
          title: isZh ? '创始人' : 'Founder',
          description: isZh
            ? '30年矿业设备经验，投资多个大型矿业项目，精通设备研发与应用。'
            : '30 years in mining equipment, invested in large projects, deep understanding of equipment and applications.',
          imageSrc: '/images/about/team-founder.jpg'
        },
        {
          name: isZh ? '王超' : 'Wang Chao',
          title: isZh ? '首席执行官' : 'CEO',
          description: isZh
            ? '20年行业经验，带领团队开发多项核心技术。'
            : '20 years in mining equipment, led core technology development.',
          imageSrc: '/images/about/team-ceo.jpg'
        },
        {
          name: isZh ? '吴宇涛' : 'Wu Yutao',
          title: isZh ? '国际业务总监' : 'International Business Director',
          description: isZh
            ? '丰富的国际贸易经验，负责全球市场拓展与客户管理。'
            : 'Experienced in international trade, global market and client management.',
          imageSrc: '/images/about/team-intl.jpg'
        },
        {
          name: isZh ? '王振国' : 'Wang Zhenguo',
          title: isZh ? '技术总监' : 'Technical Director',
          description: isZh
            ? '精益生产管理专家，提升产品质量与效率。'
            : 'Lean production expert, improves quality and efficiency.',
          imageSrc: '/images/about/team-tech.jpg'
        }
      ]
    },
    contactUs: {
      title: isZh ? '联系我们' : 'Contact Us',
      phone: {
        title: isZh ? '电话' : 'Phone',
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
        title: 'Email',
        address: 'zexinminingequipment@hotmail.com'
      },
      headquarters: {
        title: isZh ? '扶绥总部' : 'Fusui Headquarters',
        company: isZh ? '泽鑫矿业有限公司' : 'Zexin Mining Equipment Co., Ltd.',
        address: isZh 
          ? '广西省南宁市扶绥县上龙镇东盟青年产业园, 扶绥县，南宁市，广西省, 中国'
          : 'Shanglong Avenue, ASEAN Youth Industrial Park, Fusui County, Nanning City, Guangxi Province, China'
      },
      branch: {
        title: isZh ? '尼日利亚分公司' : 'Nigeria Branch',
        company: isZh ? '泽鑫矿业尼日利亚有限公司' : 'Zexin Mining Equipment Nigeria Ltd.',
        address: 'Little Rayfield Road, Jos South L.G.A, Plateau State, Nigeria'
      },
      global: {
        title: isZh ? '全球业务范围' : 'Global Operations',
        regions: [
          {
            name: isZh ? '亚洲' : 'Asia',
            countries: isZh ? '中国, 印度尼西亚, 马来西亚, 泰国, 越南' : 'China, Indonesia, Malaysia, Thailand, Vietnam'
          },
          {
            name: isZh ? '非洲' : 'Africa',
            countries: isZh ? '尼日利亚, 坦桑尼亚, 加纳, 南非, 赞比亚' : 'Nigeria, Tanzania, Ghana, South Africa, Zambia'
          },
          {
            name: isZh ? '中东' : 'Middle East',
            countries: isZh ? '阿联酋, 沙特阿拉伯' : 'UAE, Saudi Arabia'
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
            { name: isZh ? '关于我们' : 'About Us' }
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
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">{isZh ? '我们的使命' : 'Our Mission'}</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  {isZh 
                    ? '通过创新技术和卓越服务，推动矿业可持续发展，为客户创造价值。' 
                    : 'To drive sustainable mining development through innovative technology and outstanding service, creating value for our clients.'}
                </p>
                </div>
              </div>
              
              {/* 愿景 */}
              <div className="p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[200px]">
                <h3 className="text-[16px] font-bold mb-4 text-[#ff6633]">{isZh ? '我们的愿景' : 'Our Vision'}</h3>
                <div className="flex-grow flex items-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-tight text-gray-700">
                  {isZh 
                    ? '成为全球矿业设备领域的引领者，以创新驱动行业发展。' 
                    : 'To become a global leader in mining equipment, driving industry development through innovation.'}
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
              <h3 className="text-3xl font-bold text-black mb-10">{isZh ? '专业领域' : 'Areas of Expertise'}</h3>
              
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
                    <h4 className="text-xl font-bold text-black">{isZh ? '矿物加工' : 'Mineral Processing'}</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      {isZh ? '先进的矿石破碎、研磨和分离技术，提高矿物回收率。' : 'Advanced ore crushing, grinding and separation technologies to improve mineral recovery rates.'}
                    </p>
                  </div>
                </details>
                
                {/* 设备制造 */}
                <details className="group bg-gray-50" open>
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">{isZh ? '设备制造' : 'Equipment Manufacturing'}</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      {isZh ? '高品质矿山设备的设计与制造，确保可靠性和耐用性。' : 'Design and manufacture of high-quality mining equipment, ensuring reliability and durability.'}
                    </p>
                  </div>
                </details>
                
                {/* 工程与咨询 */}
                <details className="group bg-gray-50" open>
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">{isZh ? '工程与咨询' : 'Engineering & Consulting'}</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      {isZh ? '专业的矿山工程设计和技术咨询，优化运营流程。' : 'Professional mine engineering design and technical consulting to optimize operational processes.'}
                    </p>
                  </div>
                </details>
                
                {/* 智能矿山 */}
                <details className="group bg-gray-50" open>
                  <summary className="flex items-center cursor-pointer border-t-2 border-[#ff6633] pt-6 px-6 pb-4 outline-none">
                    <h4 className="text-xl font-bold text-black">{isZh ? '智能矿山' : 'Smart Mining'}</h4>
                    <div className="ml-auto">
                      <span className="block w-4 border-t border-black group-open:rotate-45 group-open:translate-y-0.5 transition-transform duration-300"></span>
                      <span className="block w-4 border-t border-black mt-1 group-open:-rotate-45 transition-transform duration-300"></span>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 overflow-hidden">
                    <p className="leading-relaxed">
                      {isZh ? '数字化和自动化解决方案，提升矿山安全性和效率。' : 'Digital and automated solutions to enhance mine safety and efficiency.'}
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
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">{isZh ? '公司名称' : 'Company'}</p>
                  <p className="text-gray-800 mb-2">{content.contactUs.headquarters.company}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-8">{isZh ? '地址' : 'Address'}</p>
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
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3">{isZh ? '公司名称' : 'Company'}</p>
                  <p className="text-gray-800 mb-2">{content.contactUs.branch.company}</p>
                  <p className="text-sm uppercase tracking-wider text-gray-400 mb-3 mt-8">{isZh ? '地址' : 'Address'}</p>
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

      <Footer logoAlt={isZh ? "泽鑫集团" : "Zexin Group"} />
    </>
  );
} 