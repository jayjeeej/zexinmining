'use client';
import ProductLayout from '@/components/layouts/ProductLayout';
import CategoryCard from '@/components/CategoryCard';
import Container from '@/components/Container';
import Grid from '@/components/Grid';
import ContactCard from '@/components/ContactCard';
import { getBreadcrumbConfig } from '@/lib/navigation';
import Accordion, { AccordionItem } from '@/components/Accordion';
import CardAnimationProvider from '@/components/CardAnimationProvider';
import HeroSection from '@/components/HeroSection';

export default function OreProcessingPageClient() {
  // 写死语言设置，这是英文页面
  const locale = 'en';
  const isZh = false;
  
  // SEO数据
  const seoTitle = 'Mineral Processing Equipment - Efficient Mineral Separation & Pre-Treatment Solutions - Zexin Mining Equipment';
  const seoDescription = 'Zexin provides comprehensive mineral processing equipment and solutions, including crushing, grinding, flotation, magnetic separation, gravity separation, classification, dewatering and other process equipment, achieving efficient mineral separation and optimal recovery rates';
  
  // 使用统一的面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: `/${locale}` },
    { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
    { name: breadcrumbConfig.mineralProcessing.name }
  ];
  
  // 页面描述内容
  const pageDescription = 'We provide high-efficiency, advanced mineral processing equipment that integrates innovative technology and professional engineering to achieve optimal recovery rates and processing efficiency of mineral resources.';
  
  // 预处理设备数据
  const preProcessingEquipment = [
    {
      title: "Stationary Crusher",
      description: "High-efficiency ore crushing equipment, including jaw crushers, cone crushers, etc., suitable for various hardness ores.",
      imageSrc: "/images/mineral-processing/stationary-crusher.jpg",
      linkUrl: `/${locale}/products/ore-processing/stationary-crushers`,
      altText: "Stationary Crusher"
    },
    {
      title: "Stationary Vibrating Screen",
      description: "High-precision screening equipment, used for ore classification and separation, ensuring the particle size requirements for subsequent processing.",
      imageSrc: "/images/mineral-processing/vibrating-screen.jpg",
      linkUrl: `/${locale}/products/ore-processing/vibrating-screens`,
      altText: "Stationary Vibrating Screen"
    },
    {
      title: "Grinding Equipment",
      description: "Used for fine and ultra-fine grinding of ore, improving mineral liberation and creating conditions for subsequent separation.",
      imageSrc: "/images/mineral-processing/grinding-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/grinding-equipment`,
      altText: "Grinding Equipment"
    },
    {
      title: "Washing Equipment",
      description: "Used to remove clay and impurities adhering to the ore surface, improving the efficiency of subsequent mineral processing processes.",
      imageSrc: "/images/mineral-processing/washing-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/washing-equipment`,
      altText: "Washing Equipment"
    },
    {
      title: "Classification Equipment",
      description: "Equipment for the classification of ore particles, improving the efficiency and accuracy of mineral processing, including hydrocyclones and classifiers.",
      imageSrc: "/images/mineral-processing/classifier.jpg",
      linkUrl: `/${locale}/products/ore-processing/classification-equipment`,
      altText: "Classification Equipment"
    },
    {
      title: "Feeding Equipment",
      description: "Controls the uniform entry of ore into crushing and grinding systems, ensuring continuous material transfer and process stability.",
      imageSrc: "/images/mineral-processing/feeding-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/feeding-equipment`,
      altText: "Feeding Equipment"
    },
  ];
  
  // 分选设备数据
  const separationEquipment = [
    {
      title: "Gravity Separation Equipment",
      description: "Adopting advanced jigging technology, suitable for efficient separation of gold, tin, tungsten and other gravity-selected minerals.",
      imageSrc: "/images/mineral-processing/gravity-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/gravity-separation`,
      altText: "Gravity Separation Equipment"
    },
    {
      title: "Magnetic Separator",
      description: "Professional magnetic separation series including dry and wet magnetic separators, suitable for efficient separation of iron ore, manganese ore, hematite and various magnetic minerals, with adjustable magnetic field intensity and high recovery rate.",
      imageSrc: "/images/mineral-processing/magnetic-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/magnetic-separator`,
      altText: "Magnetic Separator"
    },
    {
      title: "Flotation Equipment",
      description: "Utilizing the difference in physicochemical properties of mineral surfaces for separation, suitable for the beneficiation of non-ferrous metals, precious metals and other minerals.",
      imageSrc: "/images/mineral-processing/flotation-machine.jpg",
      linkUrl: `/${locale}/products/ore-processing/flotation-equipment`,
      altText: "Flotation Equipment"
    },
  ];

  return (
    <>
      <CardAnimationProvider />
      
    <ProductLayout
      locale={locale}
      breadcrumbItems={breadcrumbItems}
      title="Mineral Processing Equipment"
      description={pageDescription}
    >
      <HeroSection 
        title="Mineral Processing Equipment"
        description={pageDescription}
        backgroundColor="white"
        textColor="text-gray-700"
        showDecorationLine={true}
        headingLevel="h1"
      />
      
      <section className="mb-0 bg-white">
        <Container withPadding>
          {/* 预处理设备区域 */}
          <div className="mb-12 py-12 bg-white rounded-xs">
            <h2 className="text-4xl mb-16 leading-[1.25]">Pre-processing Equipment</h2>
            <Grid withContainer={false} withMargins={false}>
              {preProcessingEquipment.map((equipment, index) => (
                <CategoryCard
                  key={index}
                  title={equipment.title}
                  description={equipment.description}
                  imageSrc={equipment.imageSrc}
                  linkUrl={equipment.linkUrl}
                  altText={equipment.altText}
                />
              ))}
            </Grid>
          </div>

          {/* 分选设备区域 */}
          <div className="py-12 bg-white rounded-xs">
            <h2 className="text-4xl mb-16 leading-[1.25]">Separation Equipment</h2>
            <Grid withContainer={false} withMargins={false}>
              {separationEquipment.map((equipment, index) => (
                <CategoryCard
                  key={index}
                  title={equipment.title}
                  description={equipment.description}
                  imageSrc={equipment.imageSrc}
                  linkUrl={equipment.linkUrl}
                  altText={equipment.altText}
                />
              ))}
            </Grid>
          </div>
        </Container>
      </section>

      {/* 服务支持区域 */}
      <section className="py-12 bg-white">
        <Container withPadding>
          <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
            <h2 className="text-4xl mb-4 lg:mb-0 leading-[1.25] lg:w-1/3">Service Support</h2>
            <p className="lg:w-2/3 text-gray-700">
              We provide comprehensive pre-sales, in-sales, and after-sales services to ensure the smooth operation of customers' mineral processing projects.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            {/* 使用Accordion组件实现手风琴式设计 */}
            <div className="flex-1">
              <Accordion
                items={[
                  {
                    id: 'technical-consultation',
                    title: 'Technical Consultation & Design',
                    content: 'Providing ore processing solution design, process optimization, and plant layout planning to ensure optimal process flow and equipment selection.'
                  }
                ]}
                className="border border-gray-200 rounded-xs p-4 shadow-sm transition-all duration-300 ease-in-out"
              />
            </div>
            
            <div className="flex-1">
              <Accordion
                items={[
                  {
                    id: 'equipment-installation',
                    title: 'Equipment Installation & Commissioning',
                    content: 'Professional team provides equipment installation, commissioning, and trial operation services to ensure equipment performance meets design requirements.'
                  }
                ]}
                className="border border-gray-200 rounded-xs p-4 shadow-sm transition-all duration-300 ease-in-out"
              />
            </div>
            
            <div className="flex-1">
              <Accordion
                items={[
                  {
                    id: 'spare-parts',
                    title: 'Spare Parts & Maintenance',
                    content: 'Providing original spare parts and professional maintenance services to ensure long-term stable operation of equipment and reduce downtime.'
                  }
                ]}
                className="border border-gray-200 rounded-xs p-4 shadow-sm transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 联系咨询区 */}
      <ContactCard
        title="Need Mineral Processing Solutions?"
        description="Our team of specialized engineers is ready to provide technical consultation and customized solutions.<br/>Contact us for more details and application advice on mineral processing equipment!"
        buttonText="Contact Us"
        linkUrl={`/${locale}/contact`}
        imageSrc="/images/mineral-processing/contact-support.jpg"
        imageAlt="Mineral Processing Support"
        rounded={false}
        useModal={true}
        formTitle={{ 
          zh: '选矿设备咨询', 
          en: 'Mineral Processing Inquiry' 
        }}
        formSubtitle={{ 
          zh: '请填写以下表单，我们的专业工程师团队将尽快与您联系', 
          en: 'Please fill in the form below, and our professional team will contact you shortly' 
        }}
        formType="mineral-processing"
      />
    </ProductLayout>
    </>
  );
} 