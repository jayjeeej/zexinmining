'use client';
import ProductLayout from '@/components/layouts/ProductLayout';
import CategoryCard from '@/components/CategoryCard';
import Container from '@/components/Container';
import Grid from '@/components/Grid';
import ContactCard from '@/components/ContactCard';
import { getBreadcrumbConfig } from '@/lib/navigation';
import Accordion, { AccordionItem } from '@/components/Accordion';
import { getBreadcrumbStructuredData, getOrganizationStructuredData } from '@/lib/structuredData';
import { MultiStructuredData } from '@/components/StructuredData';
import CardAnimationProvider from '@/components/CardAnimationProvider';

interface OreProcessingPageClientProps {
  locale: string;
}

export default function OreProcessingPageClient({ locale }: OreProcessingPageClientProps) {
  const isZh = locale === 'zh';
  
  // SEO数据
  const seoTitle = isZh 
    ? '选矿设备 - 高效矿物分选与预处理解决方案 - 泽鑫矿山设备' 
    : 'Mineral Processing Equipment - Efficient Mineral Separation & Pre-Treatment Solutions - Zexin Mining Equipment';
  
  const seoDescription = isZh
    ? '泽鑫提供全方位选矿设备与解决方案，包括破碎、磨矿、浮选、磁选、重选、分级、脱水等工艺设备，实现矿物资源的高效分选和最优回收率'
    : 'Zexin provides comprehensive mineral processing equipment and solutions, including crushing, grinding, flotation, magnetic separation, gravity separation, classification, dewatering and other process equipment, achieving efficient mineral separation and optimal recovery rates';
  
  // 使用统一的面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: '/zh' },
    { name: breadcrumbConfig.products.name, href: '/zh/products' },
    { name: breadcrumbConfig.mineralProcessing.name }
  ];
  
  // 页面描述内容
  const pageDescription = isZh
    ? '我们提供高效先进的选矿设备，融合创新技术与专业工程，实现矿物资源的最优回收率和加工效率。无论项目规模如何，我们都能提供全面的选矿解决方案。'
    : 'We provide high-efficiency, advanced mineral processing equipment that integrates innovative technology and professional engineering to achieve optimal recovery rates and processing efficiency of mineral resources.';
  
  // 预处理设备数据
  const preProcessingEquipment = [
    {
      title: isZh ? "固定式破碎机" : "Stationary Crusher",
      description: isZh ? "高效率的矿石破碎设备，包括颚式破碎机、圆锥破碎机等，适用于各种硬度矿石。" : "High-efficiency ore crushing equipment, including jaw crushers, cone crushers, etc., suitable for various hardness ores.",
      imageSrc: "/images/mineral-processing/stationary-crusher.jpg",
      linkUrl: `/${locale}/products/ore-processing/stationary-crushers`,
      altText: isZh ? "固定式破碎机" : "Stationary Crusher"
    },
    {
      title: isZh ? "固定式振动筛" : "Stationary Vibrating Screen",
      description: isZh ? "高精度筛分设备，用于矿石的分级和分选，确保后续加工的粒度要求。" : "High-precision screening equipment, used for ore classification and separation, ensuring the particle size requirements for subsequent processing.",
      imageSrc: "/images/mineral-processing/vibrating-screen.jpg",
      linkUrl: `/${locale}/products/ore-processing/vibrating-screens`,
      altText: isZh ? "固定式振动筛" : "Stationary Vibrating Screen"
    },
    {
      title: isZh ? "磨矿设备" : "Grinding Equipment",
      description: isZh ? "用于矿石的细磨和超细磨，提高矿物解离度，为后续分选创造条件。" : "Used for fine and ultra-fine grinding of ore, improving mineral liberation and creating conditions for subsequent separation.",
      imageSrc: "/images/mineral-processing/grinding-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/grinding-equipment`,
      altText: isZh ? "磨矿设备" : "Grinding Equipment"
    },
    {
      title: isZh ? "洗矿设备" : "Washing Equipment",
      description: isZh ? "用于去除矿石表面粘附的泥质和杂质，提高后续选矿工艺的效率。" : "Used to remove clay and impurities adhering to the ore surface, improving the efficiency of subsequent mineral processing processes.",
      imageSrc: "/images/mineral-processing/washing-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/washing-equipment`,
      altText: isZh ? "洗矿设备" : "Washing Equipment"
    },
    {
      title: isZh ? "分级设备" : "Classification Equipment",
      description: isZh ? "用于矿石颗粒分级处理的设备，提高选矿效率和精度，包括旋流器和分级机。" : "Equipment for the classification of ore particles, improving the efficiency and accuracy of mineral processing, including hydrocyclones and classifiers.",
      imageSrc: "/images/mineral-processing/classifier.jpg",
      linkUrl: `/${locale}/products/ore-processing/classification-equipment`,
      altText: isZh ? "分级设备" : "Classification Equipment"
    },
    {
      title: isZh ? "给料设备" : "Feeding Equipment",
      description: isZh ? "控制矿石均匀进入破碎和磨矿系统，保障物料的连续输送和工艺稳定性。" : "Controls the uniform entry of ore into crushing and grinding systems, ensuring continuous material transfer and process stability.",
      imageSrc: "/images/mineral-processing/feeding-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/feeding-equipment`,
      altText: isZh ? "给料设备" : "Feeding Equipment"
    },
  ];
  
  // 分选设备数据
  const separationEquipment = [
    {
      title: isZh ? "重力选矿设备" : "Gravity Separation Equipment",
      description: isZh ? "采用先进的跳汰技术，适用于金、锡、钨等重选矿物的高效分选。" : "Adopting advanced jigging technology, suitable for efficient separation of gold, tin, tungsten and other gravity-selected minerals.",
      imageSrc: "/images/mineral-processing/gravity-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/gravity-separation`,
      altText: isZh ? "重力选矿设备" : "Gravity Separation Equipment"
    },
    {
      title: isZh ? "磁选设备" : "Magnetic Separator",
      description: isZh ? "专业磁选设备系列，包括干式和湿式磁选机，适用于铁矿、锰矿、赤铁矿等各类磁性矿物的高效分选，磁场强度可调，回收率高。" : "Professional magnetic separation series including dry and wet magnetic separators, suitable for efficient separation of iron ore, manganese ore, hematite and various magnetic minerals, with adjustable magnetic field intensity and high recovery rate.",
      imageSrc: "/images/mineral-processing/magnetic-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/magnetic-separator`,
      altText: isZh ? "磁选设备" : "Magnetic Separator"
    },
    {
      title: isZh ? "浮选设备" : "Flotation Equipment",
      description: isZh ? "利用矿物表面物理化学性质差异进行分选，适用于有色金属、贵金属等多种矿物的选矿。" : "Utilizing the difference in physicochemical properties of mineral surfaces for separation, suitable for the beneficiation of non-ferrous metals, precious metals and other minerals.",
      imageSrc: "/images/mineral-processing/flotation-machine.jpg",
      linkUrl: `/${locale}/products/ore-processing/flotation-equipment`,
      altText: isZh ? "浮选设备" : "Flotation Equipment"
    },
  ];
  
  // 产品结构化数据
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": isZh ? "选矿设备" : "Mineral Processing Equipment",
    "description": isZh 
      ? "泽鑫提供高效先进的选矿设备，包括破碎、磨矿、浮选、磁选、重选等设备，实现矿物资源的最优回收率和加工效率，适用于各类矿山的选矿工艺。" 
      : "Zexin provides high-efficiency, advanced mineral processing equipment including crushing, grinding, flotation, magnetic separation, gravity separation equipment to achieve optimal recovery rates and processing efficiency of mineral resources for various mining operations.",
    "brand": {
      "@type": "Brand",
      "name": isZh ? "泽鑫矿山设备" : "Zexin Mining Equipment",
      "logo": "https://zexin-mining.com/logo/logo-zh.webp" 
    },
    "manufacturer": {
      "@type": "Organization",
      "name": isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd.",
      "url": `https://zexin-mining.com/${locale}`
    },
    "category": isZh ? "工业设备/选矿设备" : "Industrial Equipment/Mineral Processing Equipment",
    "keywords": isZh
      ? "选矿设备,破碎设备,磨矿设备,浮选设备,磁选设备,重选设备,分级设备,脱水设备,给料设备,节能设备,环保设备,颚式破碎机,圆锥破碎机,球磨机,螺旋分级机,旋流器,浮选机,磁选机,跳汰机,振动筛,洗矿机,矿山机械,选矿工艺,矿物加工,金属分选,非金属分选"
      : "mineral processing equipment,crushing equipment,grinding equipment,flotation equipment,magnetic separation equipment,gravity separation equipment,classification equipment,dewatering equipment,feeding equipment,energy-saving equipment,environmental protection equipment,jaw crusher,cone crusher,ball mill,spiral classifier,hydrocyclone,flotation machine,magnetic separator,jig machine,vibrating screen,washing machine,mining machinery,mineral processing technology,mineral beneficiation,metal separation,non-metal separation",
    "image": [
      "/images/mineral-processing/crushing-equipment.jpg",
      "/images/mineral-processing/magnetic-separator.jpg",
      "/images/mineral-processing/gravity-separator.jpg"
    ]
  };

  // 生成面包屑结构化数据
  const breadcrumbStructuredData = getBreadcrumbStructuredData(
    breadcrumbItems.map(item => ({ 
      name: item.name, 
      url: item.href 
    }))
  );

  // 获取组织结构化数据
  const organizationStructuredData = getOrganizationStructuredData(isZh);

  // 合并所有结构化数据
  const structuredDataArray = [
    productSchema,
    breadcrumbStructuredData,
    organizationStructuredData
  ];

  return (
    <>
      <CardAnimationProvider />
      {/* SEO结构化数据 */}
      <MultiStructuredData dataArray={structuredDataArray} />
      
    <ProductLayout
      locale={locale}
      breadcrumbItems={breadcrumbItems}
      title={isZh ? '选矿设备' : 'Mineral Processing Equipment'}
      description={pageDescription}
    >
      <section className="mb-0 bg-white">
        <Container withPadding>
          {/* 预处理设备区域 */}
          <div className="mb-12 py-12 bg-white rounded-xs">
            <h2 className="text-4xl mb-16 leading-[1.25]">{isZh ? '预处理设备' : 'Pre-processing Equipment'}</h2>
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
            <h2 className="text-4xl mb-16 leading-[1.25]">{isZh ? '分选设备' : 'Separation Equipment'}</h2>
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
            <h2 className="text-4xl mb-4 lg:mb-0 leading-[1.25] lg:w-1/3">{isZh ? '服务支持' : 'Service Support'}</h2>
            <p className="lg:w-2/3 text-gray-700">
              {isZh 
                ? '我们提供全面的售前、售中和售后服务，确保客户的选矿项目顺利进行。' 
                : 'We provide comprehensive pre-sales, in-sales, and after-sales services to ensure the smooth operation of customers\' mineral processing projects.'}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            {/* 使用Accordion组件实现手风琴式设计 */}
            <div className="flex-1">
              <Accordion
                items={[
                  {
                    id: 'technical-consultation',
                    title: isZh ? '技术咨询与设计' : 'Technical Consultation & Design',
                    content: isZh 
                      ? '提供矿石加工方案设计、流程优化和工厂布局规划，确保最佳工艺流程和设备选型。' 
                      : 'Providing ore processing solution design, process optimization, and plant layout planning to ensure optimal process flow and equipment selection.'
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
                    title: isZh ? '设备安装与调试' : 'Equipment Installation & Commissioning',
                    content: isZh 
                      ? '专业团队提供设备安装、调试和试运行服务，确保设备性能达到设计要求。' 
                      : 'Professional team provides equipment installation, commissioning, and trial operation services to ensure equipment performance meets design requirements.'
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
                    title: isZh ? '备品备件与维修' : 'Spare Parts & Maintenance',
                    content: isZh 
                      ? '提供原厂备品备件和专业维修服务，确保设备长期稳定运行，减少停机时间。' 
                      : 'Providing original spare parts and professional maintenance services to ensure long-term stable operation of equipment and reduce downtime.'
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
        title={isZh ? '需要选矿设备解决方案？' : 'Need Mineral Processing Solutions?'}
        description={isZh 
          ? '我们的专业工程师团队随时为您提供技术咨询和定制方案。<br/>联系我们获取更多选矿设备的详细信息和应用建议！' 
          : 'Our team of specialized engineers is ready to provide technical consultation and customized solutions.<br/>Contact us for more details and application advice on mineral processing equipment!'
        }
        buttonText={isZh ? '联系我们' : 'Contact Us'}
        linkUrl={`/${locale}/contact`}
        imageSrc="/images/mineral-processing/contact-support.jpg"
        imageAlt={isZh ? "选矿技术支持" : "Mineral Processing Support"}
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