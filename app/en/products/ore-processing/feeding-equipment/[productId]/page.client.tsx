'use client';

import React from 'react';
import ProductHero from '@/components/ProductDetail/ProductHero';
import ProductApplications from '@/components/ProductDetail/ProductApplications';
import ProductSpecifications from '@/components/ProductDetail/ProductSpecifications';
import ProductNavigation from '@/components/ProductDetail/ProductNavigation';
import ProductDetailedDescription from '@/components/ProductDetail/ProductDetailedDescription';
import ProductCaseStudies from '@/components/ProductDetail/ProductCaseStudies';
import ProductFAQs from '@/components/ProductDetail/ProductFAQs';
import RelatedProducts from '@/components/ProductDetail/RelatedProducts';
import ContactCard from '@/components/ContactCard';
import ProductFeaturesAccordion from '@/components/ProductDetail/ProductFeaturesAccordion';
import { ProductData, ProductSpecification } from '@/lib/productDataSchema';

// 定义组件所需的接口
interface ApplicationItem {
  icon: string;
  title: string;
  description: string;
}

interface TechnicalAdvantage {
  title: string;
  description: string;
}

interface CaseStudy {
  id?: string;
  title: string;
  description?: string;
  summary?: string;
  results?: string;
  imageSrc?: string;
  href?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ClientFeedingEquipmentDetailProps {
  locale: string;
  productData: ProductData;
  specifications: ProductSpecification[];
  applications: ApplicationItem[];
  technicalAdvantages: TechnicalAdvantage[];
  caseStudies: CaseStudy[];
  faqs: FAQ[];
  relatedProducts: any[];
}

export default function ClientFeedingEquipmentDetail({
  locale,
  productData,
  specifications,
  applications,
  technicalAdvantages,
  caseStudies,
  faqs,
  relatedProducts
}: ClientFeedingEquipmentDetailProps) {
  const isZh = locale === 'zh';

  return (
    <>
      {/* 产品Hero部分 - 修改为不显示详细描述 */}
      <ProductHero
        title={productData.title}
        series={productData.series}
        imageSrc={productData.imageSrc}
        meta={productData.meta}
        showOverview={false}
      />
      
      {/* 添加黑色背景的详细描述部分 */}
      <ProductDetailedDescription detailedDescription={productData.detailedDescription || ''} />
      
      {/* 产品导航 */}
      <ProductNavigation
        productName={productData.title}
        locale={locale}
        hasTechnicalAdvantages={technicalAdvantages.length > 0}
        hasCaseStudies={caseStudies.length > 0}
        hasFaqs={faqs.length > 0}
      />

      {/* 产品特点与技术优势（合并为手风琴格式） */}
      <ProductFeaturesAccordion
        features={productData.features}
        technicalAdvantages={technicalAdvantages}
        locale={locale}
      />

      {/* 技术规格 */}
      <ProductSpecifications
        specifications={[]}
        locale={locale}
        unitConversion={productData.unitConversion}
        useInjectedData={true}
      />

      {/* 应用领域 */}
      <ProductApplications
        applications={applications}
        locale={locale}
      />
      
      {/* 案例研究 */}
      {caseStudies.length > 0 && (
        <ProductCaseStudies
          caseStudies={caseStudies.map(cs => ({
            title: typeof cs.title === 'string' ? cs.title : '',
            description: typeof cs.description === 'string' ? cs.description : 
                        typeof cs.summary === 'string' ? cs.summary : '',
            results: typeof cs.results === 'string' ? cs.results : ''
          }))}
          locale={locale}
        />
      )}
      
      {/* 常见问题 */}
      {faqs.length > 0 && (
        <ProductFAQs
          faqs={faqs}
          locale={locale}
        />
      )}
      
      {/* 相关产品 */}
      {relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts.map(product => ({
            id: product.id || String(Math.random()),
            title: product.title || '',
            imageSrc: product.imageSrc || '/images/products/feeding-equipment/placeholder.jpg',
            href: product.href || '#',
            category: product.category || '',
            specs: Array.isArray(product.specs) ? product.specs : []
          }))}
          title={isZh ? "相关产品" : "Related Products"}
        />
      )}
      
      {/* 添加联系咨询卡片 */}
      <div className="-mt-16 lg:-mt-32">
        <ContactCard
          title={isZh ? "需要给料设备解决方案？" : "Need Feeding Equipment Solutions?"}
          description={isZh ? "我们的专业工程师团队随时为您提供技术咨询和定制给料设备方案。<br>联系我们获取更多给料设备的详细信息和应用建议！" : "Our professional engineering team is always ready to provide technical consultation and customized feeding solutions.<br>Contact us for more details and application advice on our feeding equipment!"}
          buttonText={isZh ? "联系我们" : "Contact Us"}
          linkUrl=""
          imageSrc="/images/mineral-processing/contact-support.jpg"
          imageAlt={isZh ? "给料设备技术支持" : "Feeding Equipment Support"}
          rounded={false}
          formTitle={{ 
            zh: '给料设备咨询', 
            en: 'Feeding Equipment Inquiry' 
          }}
          formSubtitle={{ 
            zh: '请填写以下表单，我们的专业工程师团队将尽快与您联系', 
            en: 'Please fill in the form below, and our professional team will contact you shortly' 
          }}
          formType="feeding-equipment"
        />
      </div>
    </>
  );
} 