'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isZh: boolean;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 从localStorage中获取初始语言或默认为中文
  const [language, setLanguage] = useState<Language>('zh');
  
  useEffect(() => {
    // 在客户端初始化时从localStorage获取语言
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // 当语言改变时保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      // 更新 html 标签的 lang 属性
      document.documentElement.lang = language;
    }
  }, [language]);

  // 切换语言
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'zh' ? 'en' : 'zh');
  };

  // 便捷判断当前语言
  const isZh = language === 'zh';
  const isEn = language === 'en';

  const value = {
    language,
    toggleLanguage,
    isZh,
    isEn
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 自定义hook以便于使用语言上下文
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 