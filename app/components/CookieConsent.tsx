'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLanguage } from '../contexts/LanguageContext';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { isZh } = useLanguage();
  
  useEffect(() => {
    // 检查是否已经同意cookie
    const hasConsent = Cookies.get(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // 设置cookie同意标记，有效期1年
    Cookies.set(COOKIE_CONSENT_KEY, 'true', { expires: 365 });
    setIsVisible(false);
  };

  const handleReject = () => {
    Cookies.set(COOKIE_CONSENT_KEY, 'false', { expires: 365 });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black max-w-2xl rounded-[2px]">
        <div className="p-8">
          <h2 className="text-3xl font-normal mb-6">
            {isZh ? '我们需要您的同意' : 'We would like your consent'}
          </h2>
          <div className="mb-8 text-base leading-relaxed">
            {isZh ? (
              <p>
                泽鑫矿山及我们的供应商使用cookie（和类似技术）来收集和处理个人数据（如设备标识符、IP地址和网站交互）用于基本网站功能、分析网站性能、个性化内容和投放定向广告。某些cookie是必要的，无法关闭，而其他cookie仅在您同意的情况下使用。基于同意的cookie帮助我们支持泽鑫矿山并个性化您的网站体验。您可以通过点击下面的相应按钮来接受或拒绝所有此类cookie。您还可以通过下面的管理cookie链接根据其用途同意使用cookie。访问我们的
                <a href="/privacy" className="underline text-blue-600">cookie隐私政策</a>
                了解更多关于我们如何使用cookie的详细信息。
              </p>
            ) : (
              <p>
                Zexin Mining and our vendors use cookies (and similar technologies) to collect and process personal data (such as device identifiers, IP addresses, and website interactions) for essential site functionality, analysis of site performance, personalized content, and targeted advertising. Some cookies are necessary and can't be turned off, while others cookies are only used with your consent. These consent-based cookies help us support Zexin Mining and individualize your website experience. You may accept or reject all such cookies by clicking the appropriate button below. You can also consent to cookies based on their purposes via our 
                <a href="/privacy" className="underline text-blue-600">cookie privacy policy</a>
                , which provides more detailed information on how we use cookies.
              </p>
            )}
          </div>
          <div className="flex justify-between items-start">
            <button
              onClick={() => {}}
              className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover no-underline text-gray bg-gray-100 px-6 py-3 rounded-[2px] hover:bg-gray-200"
            >
              {isZh ? '管理Cookie' : 'Manage cookies'}
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover no-underline rounded-[2px] bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                {isZh ? '拒绝全部' : 'Reject all'}
              </button>
              <button
                onClick={handleAccept}
                className="group inline-flex items-center text-sm gap-3 transition-colors ease-hover no-underline rounded-[2px] bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                {isZh ? '接受全部' : 'Accept all'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 