'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

interface CookieConsentProps {
  locale?: string;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ locale: propLocale }) => {
  const [showConsent, setShowConsent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const nextLocale = useLocale();
  const locale = propLocale || nextLocale;
  const isZh = locale === 'zh';
  
  // 使用useEffect处理弹窗的位置
  useEffect(() => {
    if (showConsent && modalRef.current) {
      // 获取当前视窗的位置和尺寸
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      
      // 计算弹窗应该显示的位置
      const modalHeight = modalRef.current.offsetHeight;
      const topPosition = scrollY + (viewportHeight - modalHeight) / 2;
      
      // 设置弹窗位置
      modalRef.current.style.position = 'absolute';
      modalRef.current.style.top = `${topPosition}px`;
      modalRef.current.style.left = '50%';
      modalRef.current.style.transform = 'translateX(-50%)';
      modalRef.current.style.zIndex = '10001';
      
      // 监听滚动事件，确保弹窗始终在视窗中间
      const handleScroll = () => {
        if (modalRef.current) {
          const newScrollY = window.scrollY || window.pageYOffset;
          const newTopPosition = newScrollY + (viewportHeight - modalHeight) / 2;
          modalRef.current.style.top = `${newTopPosition}px`;
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [showConsent]);
  
  useEffect(() => {
    // 客户端安全检查
    if (typeof window === 'undefined') return;
    
    // 检查cookie是否已接受
    const cookieAccepted = localStorage.getItem('cookieConsent');
    if (!cookieAccepted) {
      // 延迟显示cookie提示，让页面先加载完成
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };
  
  const handleDecline = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };
  
  const handleManage = () => {
    // 实现管理cookie的逻辑，这里暂时只是关闭弹窗
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookieConsent', 'managed');
    setShowConsent(false);
  };
  
  // 服务器端渲染时不显示
  if (typeof window === 'undefined') return null;
  
  // 根据状态控制显示
  if (!showConsent) return null;
  
  return (
    <>
      {/* 遮罩层 - 允许点击穿透 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 10000,
        pointerEvents: 'none' // 允许点击穿透
      }} />
      
      {/* 弹窗内容 - 使用ref获取DOM元素 */}
      <div 
        ref={modalRef}
        style={{
          width: '90%',
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        {/* 关闭按钮 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px'
        }}>
          <button 
            onClick={handleAccept}
            aria-label={isZh ? '关闭' : 'Close'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 标题 */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: '16px',
          color: '#333',
          paddingRight: '24px'
        }}>
          {isZh ? '我们想获得您的同意' : 'We would like your consent'}
        </h2>
        
        {/* 内容 */}
        <div style={{
          marginBottom: '24px',
          color: '#666'
        }}>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {isZh 
              ? 'Zexin Mining和我们的供应商使用Cookie（和类似技术）收集和处理个人数据（如设备标识符、IP地址和网站交互）用于基本网站功能、分析网站性能、个性化内容和投放有针对性的广告。某些Cookie是必要的，无法关闭，而其他Cookie仅在您同意的情况下使用。基于同意的Cookie帮助我们支持Zexin Mining并个性化您的网站体验。您可以通过点击下方相应按钮接受或拒绝所有此类Cookie。' 
              : 'Zexin Mining and our vendors use cookies (and similar technologies) to collect and process personal data (such as device identifiers, IP addresses, and website interactions) for essential site functions, analyzing site performance, personalizing content, and delivering targeted ads. Some cookies are necessary and can\'t be turned off, while others are used only if you consent. The consent-based cookies help us support Zexin Mining and individualize your website experience.'}
          </p>
        </div>
        
        {/* 分割线 */}
        <hr style={{
          border: 'none',
          borderTop: '1px solid #eee',
          margin: '0 0 24px 0'
        }} />
        
        {/* 按钮组 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '16px'
        }}>
          <button 
            onClick={handleDecline}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {isZh ? '拒绝' : 'Reject all'}
          </button>
          
          <button 
            onClick={handleManage}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {isZh ? '管理Cookie' : 'Manage cookies'}
          </button>
          
          <button 
            onClick={handleAccept}
            style={{
              padding: '10px 20px',
              border: '1px solid #ff6633',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#ff6633',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {isZh ? '接受所有' : 'Accept all'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;