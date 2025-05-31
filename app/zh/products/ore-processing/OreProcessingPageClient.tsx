'use client';
import ProductLayout from '@/components/layouts/ProductLayout';
import CategoryCard from '@/components/CategoryCard';
import Container from '@/components/Container';
import Grid from '@/components/Grid';
import ContactCard from '@/components/ContactCard';
import { getBreadcrumbConfig } from '@/lib/navigation';
import Accordion, { AccordionItem } from '@/components/Accordion';
import CardAnimationProvider from '@/components/CardAnimationProvider';

export default function OreProcessingPageClient() {
  // 写死语言设置，这是中文页面
  const locale = 'zh';
  const isZh = true;
  
  // SEO数据
  const seoTitle = '选矿设备 - 高效矿物分选与预处理解决方案 - 泽鑫矿山设备';
  const seoDescription = '泽鑫提供全方位选矿设备与解决方案，包括破碎、磨矿、浮选、磁选、重选、分级、脱水等工艺设备，实现矿物资源的高效分选和最优回收率';
  
  // 使用统一的面包屑配置
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  const breadcrumbItems = [
    { name: breadcrumbConfig.home.name, href: `/${locale}` },
    { name: breadcrumbConfig.products.name, href: `/${locale}/products` },
    { name: breadcrumbConfig.mineralProcessing.name }
  ];
  
  // 页面描述内容
  const pageDescription = '我们提供高效先进的选矿设备，融合创新技术与专业工程，实现矿物资源的最优回收率和加工效率。无论项目规模如何，我们都能提供全面的选矿解决方案。';
  
  // 预处理设备数据
  const preProcessingEquipment = [
    {
      title: "固定式破碎机",
      description: "高效率的矿石破碎设备，包括颚式破碎机、圆锥破碎机等，适用于各种硬度矿石。",
      imageSrc: "/images/mineral-processing/stationary-crusher.jpg",
      linkUrl: `/${locale}/products/ore-processing/stationary-crushers`,
      altText: "固定式破碎机"
    },
    {
      title: "固定式振动筛",
      description: "高精度筛分设备，用于矿石的分级和分选，确保后续加工的粒度要求。",
      imageSrc: "/images/mineral-processing/vibrating-screen.jpg",
      linkUrl: `/${locale}/products/ore-processing/vibrating-screens`,
      altText: "固定式振动筛"
    },
    {
      title: "磨矿设备",
      description: "用于矿石的细磨和超细磨，提高矿物解离度，为后续分选创造条件。",
      imageSrc: "/images/mineral-processing/grinding-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/grinding-equipment`,
      altText: "磨矿设备"
    },
    {
      title: "洗矿设备",
      description: "用于去除矿石表面粘附的泥质和杂质，提高后续选矿工艺的效率。",
      imageSrc: "/images/mineral-processing/washing-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/washing-equipment`,
      altText: "洗矿设备"
    },
    {
      title: "分级设备",
      description: "用于矿石颗粒分级处理的设备，提高选矿效率和精度，包括旋流器和分级机。",
      imageSrc: "/images/mineral-processing/classifier.jpg",
      linkUrl: `/${locale}/products/ore-processing/classification-equipment`,
      altText: "分级设备"
    },
    {
      title: "给料设备",
      description: "控制矿石均匀进入破碎和磨矿系统，保障物料的连续输送和工艺稳定性。",
      imageSrc: "/images/mineral-processing/feeding-equipment.jpg",
      linkUrl: `/${locale}/products/ore-processing/feeding-equipment`,
      altText: "给料设备"
    },
  ];
  
  // 分选设备数据
  const separationEquipment = [
    {
      title: "重力选矿设备",
      description: "采用先进的跳汰技术，适用于金、锡、钨等重选矿物的高效分选。",
      imageSrc: "/images/mineral-processing/gravity-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/gravity-separation`,
      altText: "重力选矿设备"
    },
    {
      title: "磁选设备",
      description: "专业磁选设备系列，包括干式和湿式磁选机，适用于铁矿、锰矿、赤铁矿等各类磁性矿物的高效分选，磁场强度可调，回收率高。",
      imageSrc: "/images/mineral-processing/magnetic-separator.jpg",
      linkUrl: `/${locale}/products/ore-processing/magnetic-separator`,
      altText: "磁选设备"
    },
    {
      title: "浮选设备",
      description: "利用矿物表面物理化学性质差异进行分选，适用于有色金属、贵金属等多种矿物的选矿。",
      imageSrc: "/images/mineral-processing/flotation-machine.jpg",
      linkUrl: `/${locale}/products/ore-processing/flotation-equipment`,
      altText: "浮选设备"
    },
  ];

  return (
    <>
      <CardAnimationProvider />
      
    <ProductLayout
      locale={locale}
      breadcrumbItems={breadcrumbItems}
      title="选矿设备"
      description={pageDescription}
    >
      <section className="mb-0 bg-white">
        <Container withPadding>
          {/* 预处理设备区域 */}
          <div className="mb-12 py-12 bg-white rounded-xs">
            <h2 className="text-4xl mb-16 leading-[1.25]">预处理设备</h2>
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
            <h2 className="text-4xl mb-16 leading-[1.25]">分选设备</h2>
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
            <h2 className="text-4xl mb-4 lg:mb-0 leading-[1.25] lg:w-1/3">服务支持</h2>
            <p className="lg:w-2/3 text-gray-700">
              我们提供全面的售前、售中和售后服务，确保客户的选矿项目顺利进行。
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            {/* 使用Accordion组件实现手风琴式设计 */}
            <div className="flex-1">
              <Accordion
                items={[
                  {
                    id: 'technical-consultation',
                    title: '技术咨询与设计',
                    content: '提供矿石加工方案设计、流程优化和工厂布局规划，确保最佳工艺流程和设备选型。'
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
                    title: '设备安装与调试',
                    content: '专业团队提供设备安装、调试和试运行服务，确保设备性能达到设计要求。'
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
                    title: '备品备件与维修',
                    content: '提供原厂备品备件和专业维修服务，确保设备长期稳定运行，减少停机时间。'
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
        title="需要选矿设备解决方案？"
        description="我们的专业工程师团队随时为您提供技术咨询和定制方案。<br/>联系我们获取更多选矿设备的详细信息和应用建议！"
        buttonText="联系我们"
        linkUrl=""
        imageSrc="/images/mineral-processing/contact-support.jpg"
        imageAlt="选矿技术支持"
        rounded={false}
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