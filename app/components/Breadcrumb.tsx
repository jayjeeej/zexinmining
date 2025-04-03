'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

interface BreadcrumbItem {
  label: {
    zh: string;
    en: string;
  };
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { isZh } = useLanguage();
  
  return (
    <nav aria-label="Breadcrumb" data-breadcrumbs="">
      <ol className="flex flex-wrap w-full items-center text-sm gap-x-4" itemScope itemType="http://schema.org/BreadcrumbList">
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
          <Link 
            href="/"
            itemScope
            itemType="http://schema.org/Thing"
            itemProp="item"
            className="flex items-center gap-x-4 py-2 decoration-gray-200 underline-offset-4 hover:decoration-primary"
          >
            <span itemProp="name">{isZh ? "主页" : "Home"}</span>
            {items.length > 0 && (
              <span className="text-current">
                <svg focusable="false" fill="currentColor" width="20" height="20" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                </svg>
              </span>
            )}
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        
        {items.map((item, index) => (
          <li 
            key={index}
            itemProp="itemListElement" 
            itemScope 
            itemType="http://schema.org/ListItem"
          >
            {item.href ? (
              <Link 
                href={item.href}
                itemScope
                itemType="http://schema.org/Thing"
                itemProp="item"
                className="flex items-center gap-x-4 py-2 decoration-gray-200 underline-offset-4 hover:decoration-primary"
              >
                <span itemProp="name">{isZh ? item.label.zh : item.label.en}</span>
                {index < items.length - 1 && (
                  <span className="text-current">
                    <svg focusable="false" fill="currentColor" width="20" height="20" aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                    </svg>
                  </span>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-x-4 py-2 no-underline">
                <span itemProp="name">{isZh ? item.label.zh : item.label.en}</span>
              </div>
            )}
            <meta itemProp="position" content={`${index + 2}`} />
          </li>
        ))}
      </ol>
    </nav>
  );
} 