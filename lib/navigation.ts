/**
 * 全局导航配置
 * 集中管理所有页面的导航内容，确保整站一致性
 */

// 使用与Header组件兼容的类型定义 

// 语言配置
export const languages = [
  { code: 'zh', name: '中文', flag: '/icons/flag-zh.svg' },
  { code: 'en', name: 'English', flag: '/icons/flag-en.svg' },
];

// 基础Header组件接受的子项类型
export interface HeaderSubItem {
  label: string;
  url: string;
  noLink?: boolean;
  text?: string;
  img?: string;
  imgAlt?: string;
  isTeaser?: boolean;
  columns?: HeaderColumn[];
}

// 基础Header组件接受的列类型
export interface HeaderColumn {
  items: HeaderSubItem[];
}

// 基础Header组件接受的导航项类型
export interface HeaderNavItem {
  label: string;
  url: string;
  columns?: HeaderColumn[];
}

// 基础Header组件接受的Logo类型
export interface HeaderLogo {
  url: string;
  alt: string;
  src: string;
  width: number;
  height: number;
}

// 定义全局配置中使用的类型 - 支持多语言
export interface SubItem {
  label: {
    zh: string;
    en: string;
  };
  url: string;
  noLink?: boolean;
  text?: {
    zh: string;
    en: string;
  };
  img?: string;
  imgAlt?: {
    zh: string;
    en: string;
  };
  isTeaser?: boolean;
  columns?: {
    items: SubItem[];
  }[];
}

// 定义列类型
export interface Column {
  items: SubItem[];
}

// 定义导航项类型
export interface NavItem {
  label: {
    zh: string;
    en: string;
  };
  url: string;
  columns?: Column[];
}

// 导航菜单配置
export const navigationItems: NavItem[] = [
  {
    label: {
      zh: '产品与服务',
      en: 'Products & Services'
    },
    url: '/products',
    columns: [
      {
        items: [
          {
            label: {
              zh: '预处理设备',
              en: 'Pre-Processing Equipment'
            },
            url: '/products/ore-processing',
            columns: [
              {
                items: [
                  {
                    label: {
                      zh: '固定式破碎机',
                      en: 'Stationary Crusher'
                    },
                    url: '/products/ore-processing/stationary-crushers'
                  },
                  {
                    label: {
                      zh: '固定式振动筛',
                      en: 'Stationary Vibrating Screen'
                    },
                    url: '/products/ore-processing/vibrating-screens'
                  },
                  {
                    label: {
                      zh: '磨矿设备',
                      en: 'Grinding Equipment'
                    },
                    url: '/products/ore-processing/grinding-equipment'
                  },
                  {
                    label: {
                      zh: '洗矿设备',
                      en: 'Washing Equipment'
                    },
                    url: '/products/ore-processing/washing-equipment'
                  },
                  {
                    label: {
                      zh: '分级设备',
                      en: 'Classification Equipment'
                    },
                    url: '/products/ore-processing/classification-equipment'
                  },
                  {
                    label: {
                      zh: '给料设备',
                      en: 'Feeding Equipment'
                    },
                    url: '/products/ore-processing/feeding-equipment'
                  }
                ]
              }
            ]
          },
        ]
      },
      {
        items: [
          {
            label: {
              zh: '分选设备',
              en: 'Separation Equipment'
            },
            url: '/products/ore-processing',
            columns: [
              {
                items: [
                  {
                    label: {
                      zh: '磁选设备',
                      en: 'Magnetic Separator'
                    },
                    url: '/products/ore-processing/magnetic-separator'
                  },
                  {
                    label: {
                      zh: '浮选设备',
                      en: 'Flotation Equipment'
                    },
                    url: '/products/ore-processing/flotation-equipment'
                  },
                  {
                    label: {
                      zh: '重力选矿设备',
                      en: 'Gravity Separation'
                    },
                    url: '/products/ore-processing/gravity-separation'
                  }
                ]
              }
            ]
          },
          {
            label: {
              zh: '矿山EPC服务',
              en: 'Mining EPC Services'
            },
            url: '/products/mining-epc',
            text: {
              zh: '泽鑫矿山设备提供从设计到运营的一站式矿业产业链服务，满足客户多样化需求。',
              en: 'Zexin Mining Equipment provides one-stop mining industry chain services from design to operation, meeting diverse customer needs.'
            }
          },
        ]
      },
      {
        items: [
          {
            label: {
              zh: '所有产品与服务',
              en: 'All Products & Services'
            },
            url: '/products',
            text: {
              zh: '我们的产品和服务提高了制造业、采矿业和基础设施行业的可持续性和生产力。',
              en: 'Our products and services enhance productivity and sustainability in the manufacturing, mining and infrastructure industries.'
            },
            img: '/images/products-services-overview.jpg',
            imgAlt: {
              zh: '产品与服务概览',
              en: 'Products & Services Overview'
            },
            isTeaser: true
          }
        ]
      }
    ]
  },
  {
    label: {
      zh: '解决方案',
      en: 'Our Solutions'
    },
    url: '/products/mineral-processing-solutions',
    columns: [
      {
        items: [
          {
            label: {
              zh: '贵金属矿物加工',
              en: 'Precious Metals'
            },
            url: '/products/mineral-processing-solutions',
            img: '/images/products/mineral-processing-solutions/precious-metals/precious-metals-menu.jpg',
            imgAlt: {
              zh: '贵金属矿物加工解决方案',
              en: 'Precious Metals Processing Solutions'
            },
            isTeaser: true,
            columns: [
              {
                items: [
                  {
                    label: {
                      zh: '金矿选矿工艺',
                      en: 'Gold Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/precious-metals/gold',
                    text: {
                      zh: '探索我们的黄金选矿解决方案。',
                      en: 'Explore our gold ore processing solutions.'
                    }
                  },
                  {
                    label: {
                      zh: '砂金矿选矿工艺',
                      en: 'Placer Gold Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/precious-metals/placer-gold',
                    text: {
                      zh: '探索我们的砂金矿选矿解决方案。',
                      en: 'Explore our placer gold processing solutions.'
                    }
                  },
                  {
                    label: {
                      zh: '银矿选矿工艺',
                      en: 'Silver Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/precious-metals/silver',
                    text: {
                      zh: '探索我们的银矿选矿解决方案。',
                      en: 'Explore our silver ore processing solutions.'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        items: [
          {
            label: {
              zh: '有色金属矿物加工',
              en: 'Non-ferrous Metals'
            },
            url: '/products/mineral-processing-solutions',
            columns: [
              {
                items: [
                  {
                    label: {
                      zh: '锡矿选矿工艺',
                      en: 'Tin Ore Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-ferrous/tin'
                  },
                  {
                    label: {
                      zh: '黑钨矿选矿工艺',
                      en: 'Black Tungsten Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-ferrous/black-tungsten'
                  },
                  {
                    label: {
                      zh: '钼矿选矿工艺',
                      en: 'Molybdenum Ore Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-ferrous/molybdenum'
                  },
                  {
                    label: {
                      zh: '锑矿选矿工艺',
                      en: 'Antimony Ore Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-ferrous/antimony'
                  },
                  {
                    label: {
                      zh: '铜铅锌矿选矿工艺',
                      en: 'Copper-Lead-Zinc Ore Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-ferrous/copper-lead-zinc'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        items: [
          {
            label: {
              zh: '黑色金属矿物加工',
              en: 'Ferrous Metals'
            },
            url: '/products/mineral-processing-solutions',
            columns: [
              {
                items: [
                  {
                    label: {
                      zh: '铬矿选矿工艺',
                      en: 'Chrome Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/ferrous/chrome'
                  },
                  {
                    label: {
                      zh: '磁铁矿选矿工艺',
                      en: 'Magnetite Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/ferrous/magnetite'
                  },
                  {
                    label: {
                      zh: '赤铁矿选矿工艺',
                      en: 'Hematite Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/ferrous/hematite'
                  },
                  {
                    label: {
                      zh: '锰矿选矿工艺',
                      en: 'Manganese Ore Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/ferrous/manganese'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        items: [
          {
            label: {
              zh: '非金属矿物加工',
              en: 'Non-metallic Minerals'
            },
            url: '/products/mineral-processing-solutions',
            columns: [
              {
                items: [
                  {
                    label: {
                      zh: '长石选矿工艺',
                      en: 'Feldspar Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-metallic/feldspar'
                  },
                  {
                    label: {
                      zh: '萤石选矿工艺',
                      en: 'Fluorite Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-metallic/fluorite'
                  },
                  {
                    label: {
                      zh: '石墨选矿工艺',
                      en: 'Graphite Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-metallic/graphite'
                  },
                  {
                    label: {
                      zh: '重晶石选矿工艺',
                      en: 'Barite Beneficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-metallic/barite'
                  },
                  {
                    label: {
                      zh: '磷矿选矿工艺',
                      en: 'Phosphorite Benenficiation Process'
                    },
                    url: '/products/mineral-processing-solutions/non-metallic/phosphorite'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: {
      zh: '全球案例',
      en: 'Global Cases'
    },
    url: '/cases'
  },
  {
    label: {
      zh: '新闻与媒体',
      en: 'News & Media'
    },
    url: '/news'
  },
  {
    label: {
      zh: '关于我们',
      en: 'About us'
    },
    url: '/about'
  }
];

// 面包屑导航配置 - 统一所有页面的面包屑导航
export interface BreadcrumbConfig {
  home: {
    name: string;
    href: string;
  };
  products: {
    name: string;
    href: string;
  };
  mineralProcessing: {
    name: string;
    href: string;
  };
  categories: {
    [key: string]: {
      name: string;
      href: string;
    };
  };
}

// 获取标准化的面包屑配置
export function getBreadcrumbConfig(locale: string): BreadcrumbConfig {
  const isZh = locale === 'zh';
  
  return {
    home: {
      name: isZh ? '首页' : 'Home',
      href: `/${locale}`
    },
    products: {
      name: isZh ? '产品与服务' : 'Products & Services',
      href: `/${locale}/products`
    },
    mineralProcessing: {
      name: isZh ? '选矿设备' : 'Mineral Processing Equipment',
      href: `/${locale}/products/ore-processing`
    },
    categories: {
      'stationary-crushers': {
        name: isZh ? '固定式破碎机' : 'Stationary Crushers',
        href: `/${locale}/products/ore-processing/stationary-crushers`
      },
      'grinding-equipment': {
        name: isZh ? '磨矿设备' : 'Grinding Equipment',
        href: `/${locale}/products/ore-processing/grinding-equipment`
      },
      'vibrating-screens': {
        name: isZh ? '固定式振动筛' : 'Stationary Vibrating Screens',
        href: `/${locale}/products/ore-processing/vibrating-screens`
      },
      'gravity-separation': {
        name: isZh ? '重力选矿设备' : 'Gravity Separation Equipment',
        href: `/${locale}/products/ore-processing/gravity-separation`
      },
      'magnetic-separator': {
        name: isZh ? '磁选设备' : 'Magnetic Separation Equipment',
        href: `/${locale}/products/ore-processing/magnetic-separator`
      },
      'flotation-equipment': {
        name: isZh ? '浮选设备' : 'Flotation Equipment',
        href: `/${locale}/products/ore-processing/flotation-equipment`
      },
      'feeding-equipment': {
        name: isZh ? '给料设备' : 'Feeding Equipment',
        href: `/${locale}/products/ore-processing/feeding-equipment`
      },
      'classification-equipment': {
        name: isZh ? '分级设备' : 'Classification Equipment',
        href: `/${locale}/products/ore-processing/classification-equipment`
      },
      'washing-equipment': {
        name: isZh ? '洗矿设备' : 'Washing Equipment',
        href: `/${locale}/products/ore-processing/washing-equipment`
      }
    }
  };
}

// 获取产品详情页的面包屑配置
export function getProductDetailBreadcrumbConfig(params: {
  locale: string;
  productId: string;
  productTitle: string;
  category: string;
}): Array<{ name: string; href?: string }> {
  const { locale, productId, productTitle, category } = params;
  const breadcrumbConfig = getBreadcrumbConfig(locale);
  
  // 确保类别存在
  if (!breadcrumbConfig.categories[category]) {
    console.warn(`Category ${category} not found in breadcrumb config`);
  }
  
  // 构建面包屑数据
  return [
    { name: breadcrumbConfig.home.name, href: breadcrumbConfig.home.href },
    { name: breadcrumbConfig.products.name, href: breadcrumbConfig.products.href },
    { name: breadcrumbConfig.mineralProcessing.name, href: breadcrumbConfig.mineralProcessing.href },
    { 
      name: breadcrumbConfig.categories[category]?.name || category, 
      href: breadcrumbConfig.categories[category]?.href || `/${locale}/products/ore-processing/${category}`
    },
    { name: productTitle }
  ];
}

// 获取格式化的导航项（添加locale前缀到URL，并转换为Header组件可接受的格式）
export function getNavigationItems(locale: string): HeaderNavItem[] {
  // 语言标识
  const isZh = locale === 'zh';
  
  // 从全局配置转换为特定语言的实例
  return navigationItems.map(item => {
    // 转换顶级属性
    const navItem: HeaderNavItem = {
      label: item.label[isZh ? 'zh' : 'en'],
      url: `/${locale}${item.url}`
    };
    
    // 如果存在列，转换列内容
    if (item.columns) {
      navItem.columns = item.columns.map(column => {
        return {
          items: column.items.map(subItem => {
            // 转换子项
            const headerSubItem: HeaderSubItem = {
              label: subItem.label[isZh ? 'zh' : 'en'],
              url: subItem.noLink ? '#' : `/${locale}${subItem.url}`
            };
            
            // 设置noLink标记
            if (subItem.noLink) {
              headerSubItem.noLink = true;
            }
            
            // 处理可选属性
            if (subItem.text) {
              headerSubItem.text = subItem.text[isZh ? 'zh' : 'en'];
            }
            
            if (subItem.img) {
              headerSubItem.img = subItem.img;
            }
            
            if (subItem.imgAlt) {
              headerSubItem.imgAlt = subItem.imgAlt[isZh ? 'zh' : 'en'];
            }
            
            if (subItem.isTeaser) {
              headerSubItem.isTeaser = subItem.isTeaser;
            }
            
            // 处理嵌套菜单
            if (subItem.columns) {
              headerSubItem.columns = subItem.columns.map(nestedColumn => {
                return {
                  items: nestedColumn.items.map(nestedItem => {
                    const headerNestedItem: HeaderSubItem = {
                      label: nestedItem.label[isZh ? 'zh' : 'en'],
                      url: nestedItem.noLink ? '#' : `/${locale}${nestedItem.url}`
                    };
                    
                    // 设置noLink标记
                    if (nestedItem.noLink) {
                      headerNestedItem.noLink = true;
                    }
                    
                    if (nestedItem.text) {
                      headerNestedItem.text = nestedItem.text[isZh ? 'zh' : 'en'];
                    }
                    
                    if (nestedItem.img) {
                      headerNestedItem.img = nestedItem.img;
                    }
                    
                    if (nestedItem.imgAlt) {
                      headerNestedItem.imgAlt = nestedItem.imgAlt[isZh ? 'zh' : 'en'];
                    }
                    
                    if (nestedItem.isTeaser) {
                      headerNestedItem.isTeaser = nestedItem.isTeaser;
                    }
                    
                    return headerNestedItem;
                  })
                };
              });
            }
            
            return headerSubItem;
          })
        };
      });
    }
    
    return navItem;
  });
}

// 获取Header组件兼容的Logo配置
export function getLogo(locale: string): HeaderLogo {
  const isZh = locale === 'zh';
  
  return {
    url: `/${locale}`,
    alt: isZh ? '泽鑫矿山设备' : 'Zexin Mining Equipment',
    src: isZh ? '/logo/logo-zh.webp' : '/logo/logo-en.webp',
    width: 160,
    height: 40
  };
} 