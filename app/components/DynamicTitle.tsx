'use client';

import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePathname } from 'next/navigation';

interface TitleData {
  [key: string]: {
    zh: string;
    en: string;
  };
}

export default function DynamicTitle() {
  const { isZh } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // 页面路径与标题的映射
    const titles: TitleData = {
      '/': {
        zh: '泽鑫矿山设备 - 专业矿山设备制造商',
        en: 'Zexin Mining Equipment - Professional Mining Equipment Manufacturer'
      },
      '/about': {
        zh: '关于我们 | 泽鑫矿山设备',
        en: 'About Us | Zexin Mining Equipment'
      },
      '/products': {
        zh: '产品中心 | 泽鑫矿山设备',
        en: 'Products | Zexin Mining Equipment'
      },
      '/solutions': {
        zh: '矿山总承包服务 | 泽鑫矿山设备',
        en: 'Mining EPC Services | Zexin Mining Equipment'
      },
      '/news': {
        zh: '新闻动态 | 泽鑫矿山设备',
        en: 'News | Zexin Mining Equipment'
      },
      '/contact': {
        zh: '联系我们 | 泽鑫矿山设备',
        en: 'Contact Us | Zexin Mining Equipment'
      }
    };

    // 获取当前路径的标题或使用默认值
    let currentTitle = titles[pathname];
    
    // 如果没有精确匹配，尝试匹配前缀
    if (!currentTitle) {
      // 提取路径的第一级目录
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const topLevelPath = `/${pathSegments[0]}`;
        currentTitle = titles[topLevelPath];
      }
    }

    // 如果仍然没有找到标题，使用默认值
    if (!currentTitle) {
      currentTitle = {
        zh: document.title.split('|')[0].trim() + ' | 泽鑫矿山设备',
        en: document.title.split('|')[0].trim() + ' | Zexin Mining Equipment'
      };
    }

    // 根据当前语言更新标题
    document.title = isZh ? currentTitle.zh : currentTitle.en;
    
  }, [pathname, isZh]);

  // 这个组件不渲染任何内容
  return null;
} 