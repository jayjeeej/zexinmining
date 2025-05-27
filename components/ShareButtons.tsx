'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

/**
 * 社交分享按钮组件
 */
export default function ShareButtons({ title, url, className = "text-sm" }: ShareButtonsProps) {
  const t = useTranslations('share');
  
  // 编码分享URL
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  // 分享链接
  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.25c7.55 0 11.67-6.25 11.67-11.67 0-.18 0-.35-.01-.52A8.35 8.35 0 0 0 22 5.93a8.2 8.2 0 0 1-2.36.65 4.12 4.12 0 0 0 1.8-2.27 8.22 8.22 0 0 1-2.61 1 4.11 4.11 0 0 0-7 3.74A11.67 11.67 0 0 1 3.4 4.65a4.11 4.11 0 0 0 1.27 5.49 4.08 4.08 0 0 1-1.86-.52v.05a4.11 4.11 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.11 4.11 0 0 0 3.83 2.85A8.24 8.24 0 0 1 2 18.43a11.63 11.63 0 0 0 6.29 1.85" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM13 9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4.5c0-1 .6-1.5 1.5-1.5s1.5.5 1.5 1.5V18a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5.5c0-2.5-1.5-3.5-3-3.5a2.8 2.8 0 0 0-2.5 1.5V10a1 1 0 0 0-1-1h-1.5Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className={`${className} text-gray-500`}>{t('label')}</span>
      <div className="flex gap-2">
        {shareLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label={`${t('shareOn')} ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
} 