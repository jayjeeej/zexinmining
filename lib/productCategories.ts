/**
 * 产品分类共享配置
 * 集中管理所有产品类别导航，避免在各个页面重复定义
 */

/**
 * 获取选矿设备产品类别导航
 * @param locale 语言代码 ('zh' 或 'en')
 * @returns 产品类别数组
 */
export function getMineralProcessingCategories(locale: string) {
  const isZh = locale === 'zh';
  
  return [
    { 
      id: 'stationary-crushers', 
      name: isZh ? '固定式破碎机' : 'Stationary Crushers',
      href: `/${locale}/products/ore-processing/stationary-crushers`
    },
    { 
      id: 'vibrating-screens', 
      name: isZh ? '固定式振动筛' : 'Stationary Vibrating Screens',
      href: `/${locale}/products/ore-processing/vibrating-screens`
    },
    { 
      id: 'grinding-equipment', 
      name: isZh ? '磨矿设备' : 'Grinding Equipment',
      href: `/${locale}/products/ore-processing/grinding-equipment`
    },
    { 
      id: 'gravity-separation', 
      name: isZh ? '重力选矿设备' : 'Gravity Separation Equipment',
      href: `/${locale}/products/ore-processing/gravity-separation`
    },
    { 
      id: 'classification-equipment', 
      name: isZh ? '分级设备' : 'Classification Equipment',
      href: `/${locale}/products/ore-processing/classification-equipment`
    },
    { 
      id: 'magnetic-separator', 
      name: isZh ? '磁选设备' : 'Magnetic Separation Equipment',
      href: `/${locale}/products/ore-processing/magnetic-separator`
    },
    { 
      id: 'flotation-equipment', 
      name: isZh ? '浮选设备' : 'Flotation Equipment',
      href: `/${locale}/products/ore-processing/flotation-equipment`
    },
    { 
      id: 'feeding-equipment', 
      name: isZh ? '给料设备' : 'Feeding Equipment',
      href: `/${locale}/products/ore-processing/feeding-equipment`
    },
    { 
      id: 'washing-equipment', 
      name: isZh ? '洗矿设备' : 'Washing Equipment',
      href: `/${locale}/products/ore-processing/washing-equipment`
    }
  ];
}

/**
 * 将来如果有其他产品类别导航，可以在这里添加更多的函数
 * 例如：getUndergroundEquipmentCategories, getSurfaceDrillingCategories 等
 */ 