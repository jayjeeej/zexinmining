'use client';

import React from 'react';
import Link from 'next/link';
import Container from './Container';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
  textColor?: string;
}

/**
 * 面包屑导航组件
 * 符合Schema.org规范的面包屑导航
 */
export default function Breadcrumb({ items, locale, textColor = 'text-gray-600' }: BreadcrumbProps) {
  return (
    <Container className="py-2 lg:py-4">
      <nav className="flex items-center h-full" aria-label="Breadcrumb">
        <ol 
          itemScope 
          itemType="http://schema.org/BreadcrumbList" 
          className="flex flex-wrap w-full items-center text-sm gap-x-4"
        >
          {items.map((item, index) => (
            <li 
              key={index} 
              itemProp="itemListElement" 
              itemScope 
              itemType="http://schema.org/ListItem"
              className="flex items-center"
            >
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="flex items-center gap-x-4 decoration-gray-200 underline-offset-4 hover:decoration-primary"
                  itemScope 
                  itemType="http://schema.org/Thing"
                  itemProp="item"
                  itemID={item.href}
                >
                  <span itemProp="name" className="flex items-center">{item.name}</span>
                  <span className="flex items-center ml-1">
                    <svg focusable="false" fill="currentColor" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path 
                        d="M7.293 4.707L14.586 12 7.293 19.293a1 1 0 0 0 1.414 1.414l8-8a1 1 0 0 0 0-1.414l-8-8a1 1 0 0 0-1.414 1.414z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-x-4 no-underline">
                  <span itemProp="name" className="flex items-center text-[#ff6633]">{item.name}</span>
                </div>
              )}
              <meta itemProp="position" content={`${index + 1}`} />
            </li>
          ))}
        </ol>
      </nav>
    </Container>
  );
} 