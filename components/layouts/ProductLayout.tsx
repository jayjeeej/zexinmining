import React, { ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import StructuredData from '../StructuredData';
import Breadcrumb from '../Breadcrumb';
import HeroSection from '../HeroSection';
import { getNavigationItems, getLogo } from '../../lib/navigation';

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
      
      {/* 如果提供了标题，则显示统一的HeroSection */}
      {title && <HeroSection title={title} description={description} tabs={productTabs} />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer logoAlt={logo.alt} />
    </>
  );
};

export default ProductLayout; 