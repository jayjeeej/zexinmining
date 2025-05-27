'use client';

import dynamic from 'next/dynamic';

// 动态导入Cookie组件，不进行服务器端渲染
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false
});

type ClientCookieConsentProps = {
  locale: string;
};

export default function ClientCookieConsent({ locale }: ClientCookieConsentProps) {
  return <CookieConsent locale={locale} />;
} 