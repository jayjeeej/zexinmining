'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

interface CookieConsentProps {
  locale?: string;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ locale: propLocale }) => {
  const [showConsent, setShowConsent] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextLocale = useLocale();
  const locale = propLocale || nextLocale;
  const isZh = locale === 'zh';
  
  useEffect(() => {
    // 客户端安全检查
    if (typeof window === 'undefined') return;
    
    // 检查cookie是否已接受
    const cookieAccepted = localStorage.getItem('cookieConsent');
    if (!cookieAccepted) {
      // 延迟显示cookie提示，让页面先加载完成
      const timer = setTimeout(() => {
        setShowConsent(true);
        if (dialogRef.current && !dialogRef.current.open) {
          dialogRef.current.showModal();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };
  
  const handleDecline = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };
  
  const handleManage = () => {
    // 实现管理cookie的逻辑，这里暂时只是关闭弹窗
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookieConsent', 'managed');
    setShowConsent(false);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };
  
  // 服务器端渲染时不显示
  if (typeof window === 'undefined') return null;
  
  // 根据状态控制显示
  if (!showConsent) return null;
  
  return (
    <dialog 
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto rounded-md p-0 backdrop:bg-black backdrop:bg-opacity-50"
      open={showConsent}
    >
      <div className="relative p-6 bg-white">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button 
            onClick={handleAccept} 
            className="text-gray-400 hover:text-[#ff6633] transition-colors"
            aria-label={isZh ? '关闭' : 'Close'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      
        <h2 className="text-2xl font-semibold font-headline text-gray-800 mb-4">
          {isZh ? '我们想获得您的同意' : 'We would like your consent'}
        </h2>
        
        <div className="mb-6 text-gray-600">
          <p className="text-sm">
            {isZh 
              ? 'Zexin Mining和我们的供应商使用Cookie（和类似技术）收集和处理个人数据（如设备标识符、IP地址和网站交互）用于基本网站功能、分析网站性能、个性化内容和投放有针对性的广告。某些Cookie是必要的，无法关闭，而其他Cookie仅在您同意的情况下使用。基于同意的Cookie帮助我们支持Zexin Mining并个性化您的网站体验。您可以通过点击下方相应按钮接受或拒绝所有此类Cookie。' 
              : 'Zexin Mining and our vendors use cookies (and similar technologies) to collect and process personal data (such as device identifiers, IP addresses, and website interactions) for essential site functions, analyzing site performance, personalizing content, and delivering targeted ads. Some cookies are necessary and can\'t be turned off, while others are used only if you consent. The consent-based cookies help us support Zexin Mining and individualize your website experience.'}
          </p>
        </div>
        
        <hr className="border-gray-200 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleDecline}
            className="text-sm px-5 py-2.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
          >
            {isZh ? '拒绝' : 'Reject all'}
          </button>
          
          <button 
            onClick={handleManage}
            className="text-sm px-5 py-2.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
          >
            {isZh ? '管理Cookie' : 'Manage cookies'}
          </button>
          
          <button 
            onClick={handleAccept}
            className="text-sm px-5 py-2.5 rounded-md bg-white border border-[#ff6633] hover:bg-gray-50 transition-colors text-[#ff6633] font-medium"
          >
            {isZh ? '接受所有' : 'Accept all'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CookieConsent;