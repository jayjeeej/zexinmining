'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import PageSection from '../components/PageSection';

// 产品类别
const PRODUCT_CATEGORIES = [
  'stationary-crushers',
  'vibrating-screens',
  'washing-equipment',
  'feeding-equipment',
  'grinding-equipment',
  'classification-equipment',
  'gravity-separation',
  'flotation',
  'magnetic-separation',
  'tailings',
];

// 所有产品
const ALL_PRODUCTS = [
  'jaw-crusher',
  'impact-crusher',
  'cone-crusher',
  'hammer-crusher',
  'double-roller-crusher',
  'heavy-duty-double-roller-crusher',
  'vibrating-screen',
  'linear-vibrating-screen',
  'spiral-washer',
  'overflow-ball-mill',
  'wet-grid-ball-mill',
  'sag-ball-mill',
  'xcf-flotation-machine',
  'permanent-magnetic-drum-separator',
  'sawtooth-wave-jig',
  'synchronous-counter-directional-jig',
  'carpet-hooking-machine',
];

// 根据产品ID获取其所属分类
function getProductCategory(productId: string): string {
  if (productId.includes('crusher')) {
    return 'stationary-crushers';
  } else if (productId.includes('screen') || productId === 'vibrating-screen') {
    return 'vibrating-screens';
  } else if (productId.includes('washer')) {
    return 'washing-equipment';
  } else if (productId.includes('mill')) {
    return 'grinding-equipment';
  } else if (productId.includes('feeder')) {
    return 'feeding-equipment';
  } else if (productId.includes('classifier')) {
    return 'classification-equipment';
  } else if (productId.includes('jig') || productId.includes('shaking-table') || productId.includes('spiral-chute')) {
    return 'gravity-separation';
  } else if (productId.includes('flotation')) {
    return 'flotation';
  } else if (productId.includes('magnetic') || productId.includes('electrostatic')) {
    return 'magnetic-separation';
  }
  
  // 默认返回产品ID作为分类
  return productId;
}

export default function SitemapPage() {
  const { isZh } = useLanguage();
  const [urlStatus, setUrlStatus] = useState<{[key: string]: string}>({});
  
  // 检查URL是否可访问
  const checkUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.status >= 200 && response.status < 400;
    } catch (error) {
      return false;
    }
  };
  
  useEffect(() => {
    // 检查所有产品URL
    const checkAllUrls = async () => {
      const statusMap: {[key: string]: string} = {};
      
      for (const productId of ALL_PRODUCTS) {
        const category = getProductCategory(productId);
        const url = `/products/${category}/${productId}`;
        
        const isAvailable = await checkUrl(url);
        statusMap[url] = isAvailable ? '可用' : '不适用';
      }
      
      setUrlStatus(statusMap);
    };
    
    checkAllUrls();
  }, []);
  
  // 面包屑导航
  const breadcrumb = {
    items: [
      {
        label: { zh: "首页", en: "Home" },
        href: "/"
      },
      {
        label: { zh: "网站地图", en: "Sitemap" }
      }
    ]
  };
  
  // 获取分类的中文名称
  const getCategoryName = (category: string) => {
    const categoryMap: {[key: string]: {zh: string, en: string}} = {
      'stationary-crushers': { zh: '固定式破碎机', en: 'Stationary Crushers' },
      'vibrating-screens': { zh: '振动筛', en: 'Vibrating Screens' },
      'washing-equipment': { zh: '洗矿设备', en: 'Washing Equipment' },
      'feeding-equipment': { zh: '给料设备', en: 'Feeding Equipment' },
      'grinding-equipment': { zh: '磨矿设备', en: 'Grinding Equipment' },
      'classification-equipment': { zh: '分级设备', en: 'Classification Equipment' },
      'gravity-separation': { zh: '重选设备', en: 'Gravity Separation' },
      'flotation': { zh: '浮选设备', en: 'Flotation Equipment' },
      'magnetic-separation': { zh: '磁选设备', en: 'Magnetic Separation' },
      'tailings': { zh: '尾矿处理', en: 'Tailings Treatment' },
    };
    
    return categoryMap[category] || { zh: category, en: category };
  };
  
  // 获取产品的中文名称
  const getProductName = (productId: string) => {
    const productMap: {[key: string]: {zh: string, en: string}} = {
      'jaw-crusher': { zh: '颚式破碎机', en: 'Jaw Crusher' },
      'impact-crusher': { zh: '反击式破碎机', en: 'Impact Crusher' },
      'cone-crusher': { zh: '圆锥破碎机', en: 'Cone Crusher' },
      'hammer-crusher': { zh: '锤式破碎机', en: 'Hammer Crusher' },
      'double-roller-crusher': { zh: '双辊破碎机', en: 'Double Roller Crusher' },
      'heavy-duty-double-roller-crusher': { zh: '重型双辊破碎机', en: 'Heavy Duty Double Roller Crusher' },
      'vibrating-screen': { zh: '振动筛', en: 'Vibrating Screen' },
      'linear-vibrating-screen': { zh: '直线振动筛', en: 'Linear Vibrating Screen' },
      'spiral-washer': { zh: '螺旋洗矿机', en: 'Spiral Washer' },
      'overflow-ball-mill': { zh: '溢流型球磨机', en: 'Overflow Ball Mill' },
      'wet-grid-ball-mill': { zh: '湿式格子型球磨机', en: 'Wet Grid Ball Mill' },
      'sag-ball-mill': { zh: 'SAG球磨机', en: 'SAG Ball Mill' },
      'xcf-flotation-machine': { zh: 'XCF浮选机', en: 'XCF Flotation Machine' },
      'permanent-magnetic-drum-separator': { zh: '永磁滚筒磁选机', en: 'Permanent Magnetic Drum Separator' },
      'sawtooth-wave-jig': { zh: '锯齿波跳汰机', en: 'Sawtooth Wave Jig' },
      'synchronous-counter-directional-jig': { zh: '4室复合双动跳汰机', en: '4-Chamber Composite Double-Motion Jig' },
      'carpet-hooking-machine': { zh: '毛毯布勾机', en: 'Carpet Hooking Machine' },
    };
    
    return productMap[productId] || { zh: productId, en: productId };
  };
  
  return (
    <PageSection breadcrumb={breadcrumb}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{isZh ? '网站地图' : 'Sitemap'}</h1>
        
        {/* 主要页面 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">{isZh ? '主要页面' : 'Main Pages'}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li>
              <Link href="/" className="text-primary hover:underline">
                {isZh ? '首页' : 'Home'}
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-primary hover:underline">
                {isZh ? '产品与服务' : 'Products & Services'}
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="text-primary hover:underline">
                {isZh ? '解决方案' : 'Solutions'}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-primary hover:underline">
                {isZh ? '关于我们' : 'About Us'}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline">
                {isZh ? '联系我们' : 'Contact Us'}
              </Link>
            </li>
            <li>
              <Link href="/news" className="text-primary hover:underline">
                {isZh ? '新闻中心' : 'News'}
              </Link>
            </li>
          </ul>
        </div>
        
        {/* 产品类别 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">{isZh ? '产品类别' : 'Product Categories'}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCT_CATEGORIES.map(category => (
              <li key={category}>
                <Link href={`/products/${category}`} className="text-primary hover:underline">
                  {isZh ? getCategoryName(category).zh : getCategoryName(category).en}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 产品页面 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{isZh ? '产品页面' : 'Product Pages'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isZh ? '产品' : 'Product'}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isZh ? '类别' : 'Category'}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isZh ? '链接' : 'Link'}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isZh ? '状态' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ALL_PRODUCTS.map(productId => {
                  const category = getProductCategory(productId);
                  const url = `/products/${category}/${productId}`;
                  const status = urlStatus[url] || (isZh ? '检查中...' : 'Checking...');
                  
                  return (
                    <tr key={productId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isZh ? getProductName(productId).zh : getProductName(productId).en}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isZh ? getCategoryName(category).zh : getCategoryName(category).en}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={url} className="text-primary hover:underline">
                          {url}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          status === '可用' ? 'bg-green-100 text-green-800' : 
                          status === '不适用' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageSection>
  );
} 