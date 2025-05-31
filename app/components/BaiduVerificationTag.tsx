'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 百度验证标签组件
 * 用于在页面头部添加百度验证标签
 * 可以通过环境变量或动态配置设置验证码
 */
export default function BaiduVerificationTag() {
  const pathname = usePathname();
  const [userAgent, setUserAgent] = useState<string>('');
  
  // 检测用户代理
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgent(window.navigator.userAgent);
    }
  }, []);
  
  // 检测是否是百度爬虫
  const isBaiduBot = userAgent.includes('Baiduspider') || userAgent.includes('baidu');
  
  // 只在首页或语言首页添加验证标签，且只对百度爬虫显示
  const isHomePage = pathname === '/' || pathname === '/zh' || pathname === '/en';
  
  if (!isHomePage || !isBaiduBot) {
    return null;
  }
  
  // 这里替换为您的百度验证码
  const baiduVerificationCode = process.env.NEXT_PUBLIC_BAIDU_VERIFICATION_CODE || 'your_verification_code_here';
  
  return (
    <>
      <meta name="baidu-site-verification" content={baiduVerificationCode} />
    </>
  );
} 