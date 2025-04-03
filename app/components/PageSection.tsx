'use client';

import React, { ReactNode } from 'react';
import Breadcrumb from './Breadcrumb';

interface PageSectionProps {
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
  isHero?: boolean;
  id?: string;
  variant?: 'white' | 'gray' | 'hero' | 'dark';
  breadcrumb?: {
    items: Array<{
      label: { zh: string; en: string };
      href?: string;
    }>;
  };
}

export default function PageSection({
  children,
  noPadding = false,
  className = '',
  isHero = false,
  variant = 'white',
  id,
  breadcrumb
}: PageSectionProps) {
  const getBgColor = () => {
    switch (variant) {
      case 'gray':
        return 'bg-gray-100';
      case 'dark':
        return 'bg-black';
      case 'hero':
        return 'bg-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <section
      id={id}
      className={`${className} ${isHero ? 'relative' : ''} ${getBgColor()} w-full`}
    >
      {breadcrumb && (
        <div className="container mx-auto px-4 max-w-[1200px] mt-6 mb-4 relative z-10">
          <Breadcrumb items={breadcrumb.items} />
        </div>
      )}
      <div className={`${noPadding ? '' : 'py-16'} w-full max-w-[1200px] mx-auto`}>
        {children}
      </div>
    </section>
  );
} 