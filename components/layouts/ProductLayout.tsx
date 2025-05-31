import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import Breadcrumb from '@/components/Breadcrumb';
import { getNavigationItems, getLogo } from '@/lib/navigation';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface ProductLayoutProps {
  children: React.ReactNode;
  locale: string;
  breadcrumbItems: BreadcrumbItem[];
  title?: string;
  description?: string | ReactNode;
  structuredData?: any;
  productTabs?: React.ReactNode;
}

const ProductLayout = ({ 
  children, 
  locale, 
  breadcrumbItems, 
  title,
  description,
  structuredData,
  productTabs 
}: ProductLayoutProps) => {
  // 使用集中式配置获取导航菜单和标志
  const items = getNavigationItems(locale);
  const logo = getLogo(locale);

  return (
    <>
      {structuredData && <StructuredData data={structuredData} />}
      <Header logo={logo} items={items} />
      
      <Breadcrumb items={breadcrumbItems} locale={locale} />
      
      {/* 移除自动添加HeroSection的代码，由客户端组件自行添加 */}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer logoAlt={logo.alt} />
    </>
  );
};

export default ProductLayout; 