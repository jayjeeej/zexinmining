/**
 * 产品数据处理工具函数
 * 用于统一处理产品数据转换，减少冗余代码
 */

import { getTableColumnsByProductType } from './tableGuidelineConstants';

// 从表格数据中提取参数范围
export function extractRangeFromTable(
  table: any[], 
  columnIndex: number, 
  defaultMin: number, 
  defaultMax: number, 
  unit: string
): { min: number; max: number; unit: string } {
  if (!table || !Array.isArray(table) || table.length === 0) {
    return { min: defaultMin, max: defaultMax, unit };
  }
  
  // 从表格列中提取所有数值
  const values = table.map(row => {
    const cellValue = row[columnIndex];
    // 处理范围值 (如 "5-50")
    if (typeof cellValue === 'string' && cellValue.includes('-')) {
      const [min, max] = cellValue.split('-').map(v => parseFloat(v.trim()));
      return [min, max];
    }
    // 处理单一数值 (如 "11")
    return [parseFloat(String(cellValue))];
  }).flat().filter(v => !isNaN(v));
  
  // 如果提取的值为空，返回默认值
  if (values.length === 0) {
    return { min: defaultMin, max: defaultMax, unit };
  }
  
  // 返回最小值和最大值
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    unit
  };
}

// 从文本格式解析范围值 (如 "5-600 t/h")
export function parseRangeFromText(
  text: string, 
  defaultMin: number, 
  defaultMax: number, 
  defaultUnit: string
): { min: number; max: number; unit: string } {
  if (!text) return { min: defaultMin, max: defaultMax, unit: defaultUnit };
  
  // 首先尝试匹配带单位的范围值，如 "0.5-60 m³" 或 "5-600 t/h"
  // 更宽松的正则表达式，支持各种分隔符和单位格式
  const rangeMatch = text.match(/(\d+\.?\d*)\s*[-–—~～]\s*(\d+\.?\d*)\s+(.+)/);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
      unit: rangeMatch[3].trim()
    };
  }
  
  // 尝试匹配单个值加单位，如 "15 kW"
  const singleMatch = text.match(/(\d+\.?\d*)\s+(.+)/);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    return {
      min: value,
      max: value,
      unit: singleMatch[2].trim()
    };
  }
  
  // 回退到原来的匹配方式
  const oldMatch = text.match(/(\d+\.?\d*)[^\d]+(\d+\.?\d*)[^\d]+([^\d\s]+)/);
  if (oldMatch) {
    return {
      min: parseFloat(oldMatch[1]),
      max: parseFloat(oldMatch[2]),
      unit: oldMatch[3]
    };
  }
  
  return { min: defaultMin, max: defaultMax, unit: defaultUnit };
}

/**
 * 获取相关产品
 * @param productData 当前产品数据
 * @param currentProductId 当前产品ID
 * @param productNameMap 产品名称映射
 * @returns 相关产品数据
 */
export function getRelatedProducts(productData: any, currentProductId: string, productNameMap: Record<string, any>) {
  // 如果relatedProducts是数组，转换成标准格式
  if (Array.isArray(productData.relatedProducts)) {
    // 获取产品类别（从当前产品ID判断）
    let productCategory = '';
    
    if (currentProductId.includes('crusher')) {
      productCategory = 'stationary-crushers';
    } else if (currentProductId.includes('screen')) {
      productCategory = 'vibrating-screens';
    } else if (currentProductId.includes('feeder')) {
      productCategory = 'feeding-equipment';
    } else if (currentProductId.includes('washer')) {
      productCategory = 'washing-equipment';
    } else if (currentProductId.includes('mill') || currentProductId.includes('grinding')) {
      productCategory = 'grinding-equipment';
    } else if (currentProductId.includes('classifier')) {
      productCategory = 'classification-equipment';
    } else if (currentProductId.includes('flotation')) {
      productCategory = 'flotation';
    } else {
      // 从产品数据中尝试获取类别
      productCategory = productData.category || '';
    }
    
    // 构建basePath
    let basePath = '';
    if (productCategory) {
      basePath = `/products/${productCategory}`;
    } else {
      basePath = '/products';
    }
    
    // 转换为详细的产品数据
    const items = productData.relatedProducts.map((id: string) => {
      const name = productNameMap[id] || { 
        zh: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        en: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      };
      
      // 特定产品类型的图片路径映射
      const pathMappings: Record<string, string> = {
        'jaw-crusher': '/images/products/crushers/jaw-crusher.png',
        'cone-crusher': '/images/products/crushers/cone-crusher.png',
        'impact-crusher': '/images/products/crushers/impact-crusher.png',
        'hammer-crusher': '/images/products/crushers/hammer-crusher.png',
        'double-roller-crusher': '/images/products/crushers/double-roller-crusher.png',
        'heavy-duty-double-roller-crusher': '/images/products/crushers/heavy-duty-double-roller-crusher.png',
        'plate-feeder': '/images/products/feeders/plate-feeder.png',
        'belt-feeder': '/images/products/feeders/belt-feeder.png',
        'electromagnetic-vibrating-feeder': '/images/products/feeders/electromagnetic-vibrating-feeder.png',
        'disc-feeder': '/images/products/feeders/disc-feeder.png',
        'xdg-vibrating-feeder': '/images/products/feeders/xdg-vibrating-feeder.png',
        'spiral-washer': '/images/products/washers/spiral-washer.png',
        'double-spiral-washer': '/images/products/washers/double-spiral-washer.png',
        'drum-washer': '/images/products/washers/drum-washer.png',
        'aeration-flotation-machine': '/images/products/flotation/aeration-flotation-machine.png',
        'bar-flotation-machine': '/images/products/flotation/bar-flotation-machine.png',
        'coarse-particle-flotation-machine': '/images/products/flotation/coarse-particle-flotation-machine.png',
        'flotation-cell': '/images/products/flotation/flotation-cell.png',
        'self-priming-flotation-machine': '/images/products/flotation/self-priming-flotation-machine.png',
        'xcf-flotation-machine': '/images/products/flotation/xcf-flotation-machine.png',
        // 振动筛产品映射
        'vibrating-screen': '/images/products/screens/xd-vibrating-screen.png',
        'xd-vibrating-screen': '/images/products/screens/xd-vibrating-screen.png',
        'ya-circular-vibrating-screen': '/images/products/screens/ya-circular-vibrating-screen.png',
        'linear-vibrating-screen': '/images/products/screens/linear-vibrating-screen.png',
        'banana-vibrating-screen': '/images/products/screens/banana-vibrating-screen.png',
        'bar-vibrating-screen': '/images/products/screens/bar-vibrating-screen.png',
        'drum-screen': '/images/products/screens/drum-screen.png',
        'zkr-linear-vibrating-screen': '/images/products/screens/zkr-linear-vibrating-screen.png'
      };
      
      // 优先使用映射表中的路径
      if (pathMappings[id]) {
        return {
          id,
          series: name,
          image: pathMappings[id]
        };
      }
      
      // 根据产品ID确定图片文件夹路径
      let imageFolderPath = '';
      if (id.includes('crusher')) {
        imageFolderPath = 'stationary-crushers';
      } else if (id.includes('screen')) {
        imageFolderPath = 'screens';
      } else if (id.includes('classifier') || 
          (name.zh.includes('分级机') || name.en.includes('Classifier'))) {
        imageFolderPath = 'classification-equipment';
      } else if (id.includes('feeder')) {
        imageFolderPath = 'feeding-equipment';
      } else if (id.includes('washer')) {
        // 为特定的洗矿机类型提供明确的路径
        if (id === 'spiral-washer') {
          return {
            id,
            series: name,
            image: '/images/products/washers/spiral-washer.png'
          };
        } else if (id === 'double-spiral-washer') {
          return {
            id,
            series: name,
            image: '/images/products/washers/double-spiral-washer.png'
          };
        } else if (id === 'drum-washer') {
          return {
            id,
            series: name,
            image: '/images/products/washers/drum-washer.png'
          };
        }
        imageFolderPath = 'washing-equipment';
      } else if (id.includes('mill') || id.includes('grinding') ||
          (name.zh.includes('球磨机') || name.zh.includes('棒磨机') || 
           name.en.includes('Ball Mill') || name.en.includes('Rod Mill'))) {
        imageFolderPath = 'grinding-equipment';
      } else if (id.includes('flotation') || 
          (name.zh.includes('浮选') || name.en.includes('Flotation'))) {
        imageFolderPath = 'flotation';
      } else {
        imageFolderPath = productCategory;
      }
      
      return {
        id,
        series: name,
        image: `/images/products/${imageFolderPath}/${id}.png`
      };
    });
    
    return {
      title: {
        zh: '同类产品',
        en: 'Similar Products'
      },
      basePath,
      items
    };
  }
  
  // 如果已经是标准格式，直接返回
  if (productData.relatedProducts && typeof productData.relatedProducts === 'object' && productData.relatedProducts.items) {
    return productData.relatedProducts;
  }
  
  // 默认返回空对象
  return {
    title: {
      zh: '相关产品',
      en: 'Related Products'
    },
    basePath: '/products',
    items: []
  };
}

// 根据产品ID确定其所属类别和路径
function getProductBasePath(productId: string, baseProductPath: string) {
  // 根据产品ID或baseProductPath确定路径
  const isScreenProduct = baseProductPath === 'screens' || 
                         productId.includes('screen') || 
                         (productId === 'vibrating-screen');
  
  const isFeederProduct = baseProductPath === 'feeders' || 
                         productId.includes('feeder');
  
  const isWasherProduct = baseProductPath === 'washers' || 
                         productId.includes('washer');
  
  const isGrindingProduct = baseProductPath === 'grinding' ||
                           productId.includes('mill');
  
  const isGravitySeparationProduct = baseProductPath === 'gravity-separation' ||
                                    productId.includes('jig');
  
  const isFlotationProduct = baseProductPath === 'flotation' ||
                            productId.includes('flotation');
  
  const isMagneticSeparationProduct = baseProductPath === 'magnetic-separation' ||
                                     productId.includes('magnetic');
  
  // 返回路径映射
  if (isScreenProduct) {
    return {
      basePath: '/products/vibrating-screens',
      imagePath: '/screens'
    };
  } else if (isFeederProduct) {
    return {
      basePath: '/products/feeding-equipment',
      imagePath: '/feeders'
    };
  } else if (isWasherProduct) {
    return {
      basePath: '/products/washing-equipment',
      imagePath: '/washers'
    };
  } else if (isGrindingProduct) {
    return {
      basePath: '/products/grinding-equipment',
      imagePath: '/grinding'
    };
  } else if (isGravitySeparationProduct) {
    return {
      basePath: '/products/gravity-separation',
      imagePath: '/gravity-separation'
    };
  } else if (isFlotationProduct) {
    return {
      basePath: '/products/flotation',
      imagePath: '/flotation'
    };
  } else if (isMagneticSeparationProduct) {
    return {
      basePath: '/products/magnetic-separation',
      imagePath: '/magnetic-separation'
    };
  } else {
    // 默认为破碎机
    return {
      basePath: '/products/stationary-crushers',
      imagePath: '/crushers'
    };
  }
}

// 获取基础路径
function getBasePath(baseProductPath: string) {
  if (baseProductPath === 'screens') {
    return '/products/vibrating-screens';
  } else if (baseProductPath === 'feeders') {
    return '/products/feeding-equipment';
  } else if (baseProductPath === 'washers') {
    return '/products/washing-equipment';
  } else if (baseProductPath === 'grinding') {
    return '/products/grinding-equipment';
  } else {
    return '/products/stationary-crushers';
  }
}

// 标准化产品特点数据
export function normalizeFeatures(features: any) {
  if (!features) return [];
  
  // 检查是否已经是标准格式数组
  if (Array.isArray(features) && features.length > 0 && 
      typeof features[0] === 'object' && features[0].zh && features[0].en) {
    // 已是标准格式，不做简化处理
    return features;
  } 
  
  // 处理中英文分开的数组格式
  if (features.zh && Array.isArray(features.zh)) {
    return features.zh.map((item: string, index: number) => ({
      zh: item,
      en: (features.en && features.en[index]) ? features.en[index] : item
    }));
  }
  
  // 处理简单字符串数组格式
  if (Array.isArray(features) && typeof features[0] === 'string') {
    return features.map((item: string) => ({
      zh: item,
      en: item
    }));
  }
  
  // 处理titleZh/titleEn/descriptionZh/descriptionEn格式
  if (Array.isArray(features) && features.length > 0 && 
      typeof features[0] === 'object' && 
      (features[0].titleZh || features[0].titleEn || features[0].descriptionZh || features[0].descriptionEn)) {
    return features.map((feature: any) => {
      const zh = feature.descriptionZh || feature.titleZh || '';
      const en = feature.descriptionEn || feature.titleEn || '';
      return { zh, en };
    });
  }
  
  return [];
}

// 此函数不再使用，保留空函数保持代码结构兼容性
function simplifyFeature(text: string, language: 'zh' | 'en'): string {
  return text || '';
}

// 标准化规格数据，确保统一格式
export function normalizeSpecifications(specifications: any) {
  if (!specifications) return null;
  
  // 检查nameZh/nameEn/valueZh/valueEn格式 - 常见于板式给料机等
  if (Array.isArray(specifications) && specifications.length > 0 && 
      typeof specifications[0] === 'object' && 
      (specifications[0].nameZh || specifications[0].nameEn) && 
      (specifications[0].valueZh || specifications[0].valueEn)) {
    // 转换为标准格式 - 改为两列格式，参数和值
    const columns = [
      {
        key: 'parameter',
        title: { zh: '参数', en: 'Parameter' },
        width: "40%"
      },
      {
        key: 'value',
        title: { zh: '值', en: 'Value' },
        width: "60%"
      }
    ];
    
    // 把数据转换为两列表格格式，language判断在组件中处理
    const data = specifications.map((item: any, index: number) => ({
      key: `row-${index}`,
      // 同时保存中英文，在组件中根据language决定显示哪个
      parameter: {
        zh: item.nameZh || '',
        en: item.nameEn || ''
      },
      value: {
        zh: item.valueZh || '',
        en: item.valueEn || ''
      }
    }));
    
    // 返回标准格式
    return {
      title: { zh: "技术参数", en: "Technical Specifications" },
      columns: columns,
      data: data,
      notes: [{ zh: "任何规格都可以按照客户需求定制", en: "Any specification can be customized according to customer requirements" }]
    };
  }
  
  // 检查technicalParameters数组格式 - 给料机常用
  if (Array.isArray(specifications) && specifications.length > 0 && typeof specifications[0] === 'object') {
    // 收集所有唯一键
    const allKeys = new Set<string>();
    specifications.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    // 定义列的显示顺序优先级
    const columnOrderPriority = [
      'model', 'width', 'trough', 'sprocketCenterDistance', 'speed', 
      'capacity', 'motorModel', 'power', 'motorPower', 'dimensions', 'weight'
    ];
    
    // 根据优先级排序列
    const sortedKeys = Array.from(allKeys).sort((a, b) => {
      // model总是第一列
      if (a === 'model') return -1;
      if (b === 'model') return 1;
      
      const aIndex = columnOrderPriority.indexOf(a);
      const bIndex = columnOrderPriority.indexOf(b);
      
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
    
    // 常见列名映射
    const keyMappings: Record<string, {zh: string, en: string, unit?: string}> = {
      'model': {zh: '型号', en: 'Model'},
      'width': {zh: '宽度', en: 'Width', unit: 'mm'},
      'trough': {zh: '槽宽', en: 'Trough Width', unit: 'mm'},
      'sprocketCenterDistance': {zh: '链轮中心距', en: 'Sprocket Center Distance', unit: 'mm'},
      'length': {zh: '长度', en: 'Length', unit: 'mm'},
      'speed': {zh: '速度', en: 'Speed', unit: 'm/min'},
      'capacity': {zh: '处理能力', en: 'Capacity', unit: 'm³/h'},
      'motorModel': {zh: '电机型号', en: 'Motor Model'},
      'power': {zh: '功率', en: 'Power', unit: 'kW'},
      'motorPower': {zh: '电机功率', en: 'Motor Power', unit: 'kW'},
      'dimensions': {zh: '外形尺寸', en: 'Dimensions', unit: 'mm'},
      'weight': {zh: '重量', en: 'Weight', unit: 'kg'},
      'beltWidth': {zh: '皮带宽度', en: 'Belt Width', unit: 'mm'},
      'excitation': {zh: '激振力', en: 'Excitation', unit: 'kN'},
      'frequency': {zh: '振动频率', en: 'Frequency', unit: 'Hz'},
      'discDiameter': {zh: '圆盘直径', en: 'Disc Diameter', unit: 'mm'},
      'discSpeed': {zh: '圆盘转速', en: 'Disc Speed', unit: 'r/min'},
      'maxFeedSize': {zh: '最大进料尺寸', en: 'Max Feed Size', unit: 'mm'},
      'spiralDiameter': {zh: '螺旋直径', en: 'Spiral Diameter', unit: 'mm'},
      'drumDiameter': {zh: '滚筒直径', en: 'Drum Diameter', unit: 'mm'},
      'screenSize': {zh: '筛面尺寸', en: 'Screen Size', unit: 'm²'},
      'layers': {zh: '层数', en: 'Layers'},
      // 球磨机特有参数
      'cylinderDiameter': {zh: '筒体直径', en: 'Cylinder Diameter', unit: 'mm'},
      'cylinderLength': {zh: '筒体长度', en: 'Cylinder Length', unit: 'mm'},
      'maxBallLoad': {zh: '最大球磨量', en: 'Max Ball Load', unit: 't'},
      'height': {zh: '高度', en: 'Height', unit: 'mm'}
    };
    
    // 创建规范化的列定义
    const columns = sortedKeys.map(key => {
      const mapping = keyMappings[key] || {zh: key, en: key};
      return {
        key: key,
        title: {
          zh: mapping.zh,
          en: mapping.en
        },
        unit: mapping.unit || null,
        width: key === 'model' ? '15%' : (key === 'dimensions' ? '20%' : 'auto')
      };
    });
    
    // 返回标准规格格式
    return {
      title: { zh: "技术参数", en: "Technical Specifications" },
      columns: columns,
      data: specifications,
      notes: [{ zh: "任何规格都可以按照客户需求定制", en: "Any specification can be customized according to customer requirements" }]
    };
  }
  
  // 已经是标准格式的情况
  if (specifications.title && specifications.columns && 
      Array.isArray(specifications.columns) && 
      specifications.columns.length > 0 && 
      specifications.columns[0].title) {
    return specifications;
  }
  
  // 需要转换的情况
  const result = {
    title: specifications.title || { zh: "技术参数", en: "Technical Specifications" },
    columns: [],
    data: specifications.data || []
  };
  
  // 转换列格式
  if (specifications.columns && Array.isArray(specifications.columns)) {
    result.columns = specifications.columns.map((column: any) => {
      // 如果已经是新格式
      if (column.title) return column;
      
      // 从旧格式转换
      return {
        key: column.key,
        title: {
          zh: column.zh.replace(/\s*\([^)]*\)$/, ''), // 移除括号中的单位
          en: column.en.replace(/\s*\([^)]*\)$/, '')  // 移除括号中的单位
        },
        unit: extractUnitFromString(column.zh) || extractUnitFromString(column.en),
        width: "15%" // 默认宽度
      };
    });
  }
  
  return result;
}

// 从字符串中提取单位 (比如 "处理能力 (t/h)" => "t/h")
function extractUnitFromString(str: string): string | null {
  if (!str) return null;
  const match = str.match(/\(([^)]+)\)$/);
  return match ? match[1] : null;
}

// 根据产品类型获取标准化的表头
export function getStandardizedTableColumns(productType: string) {
  return getTableColumnsByProductType(productType);
}

// 创建标准化产品名称映射
export const productNameMap: Record<string, { zh: string, en: string }> = {
  // 破碎机产品
  'jaw-crusher': { zh: '颚式破碎机', en: 'Jaw Crusher' },
  'cone-crusher': { zh: '圆锥破碎机', en: 'Cone Crusher' },
  'impact-crusher': { zh: '冲击式破碎机', en: 'Impact Crusher' },
  'hammer-crusher': { zh: '锤式破碎机', en: 'Hammer Crusher' },
  'double-roller-crusher': { zh: '双辊破碎机', en: 'Double Roller Crusher' },
  'heavy-duty-double-roller-crusher': { zh: '重型双辊破碎机', en: 'Heavy Duty Double Roller Crusher' },
  
  // 振动筛产品
  'ya-circular-vibrating-screen': { zh: 'YA圆振动筛', en: 'YA Circular Vibrating Screen' },
  'circular-vibrating-screen': { zh: 'YA圆振动筛', en: 'YA Circular Vibrating Screen' },
  'linear-vibrating-screen': { zh: '直线振动筛', en: 'Linear Vibrating Screen' },
  'zkr-linear-vibrating-screen': { zh: 'ZKR直线振动筛', en: 'ZKR Linear Vibrating Screen' },
  'banana-vibrating-screen': { zh: '香蕉筛', en: 'Banana Vibrating Screen' },
  'vibrating-screen': { zh: 'XD系列振动筛', en: 'XD Series Vibrating Screen' },
  'drum-screen': { zh: '滚筒筛', en: 'Drum Screen' },
  'bar-vibrating-screen': { zh: '棒条筛', en: 'Bar Vibrating Screen' },
  
  // 给料设备产品
  'plate-feeder': { zh: '板式给料机', en: 'Plate Feeder' },
  'belt-feeder': { zh: '带式给料机', en: 'Belt Feeder' },
  'electromagnetic-vibrating-feeder': { zh: '电磁振动给料机', en: 'Electromagnetic Vibrating Feeder' },
  'disc-feeder': { zh: '圆盘给料机', en: 'Disc Feeder' },
  'xdg-vibrating-feeder': { zh: 'XDG振动给料机', en: 'XDG Vibrating Feeder' },
  
  // 洗矿设备产品
  'spiral-washer': { zh: '单螺旋洗矿机', en: 'Spiral Washer' },
  'double-spiral-washer': { zh: '双螺旋洗矿机', en: 'Double Spiral Washer' },
  'drum-washer': { zh: '滚筒洗矿机', en: 'Drum Washer' },
  
  // 分级设备产品
  'high-weir-spiral-classifier': { zh: '高堰式单螺旋分级机', en: 'High Weir Spiral Classifier' },
  'double-spiral-classifier': { zh: '沉没式螺旋分级机', en: 'Submerged Spiral Classifier' },
  
  // 磨矿设备产品
  'overflow-ball-mill': { zh: '溢流式球磨机', en: 'Overflow Ball Mill' },
  'wet-grid-ball-mill': { zh: '湿式格子型球磨机', en: 'Wet Grid Ball Mill' },
  'dry-grid-ball-mill': { zh: '干式格子型球磨机', en: 'Dry Grid Ball Mill' },
  'rod-mill': { zh: '棒磨机', en: 'Rod Mill' },
  
  // 重选设备产品
  'synchronous-counter-directional-jig': { zh: '同步反向复合动跳汰机', en: 'Synchronous Counter-Directional Composite Motion Jig' },
  'synchronous-counter-directional-jig-small': { zh: '小型同步反向复合动跳汰机', en: 'Small Synchronous Counter-Directional Composite Motion Jig' },
  'sawtooth-wave-jig': { zh: '锯齿波跳汰机', en: 'Sawtooth Wave Jig' },
  
  // 浮选设备产品
  'aeration-flotation-machine': { zh: '充气搅拌式浮选机', en: 'Aeration Flotation Machine' },
  'bar-flotation-machine': { zh: '柱式浮选机', en: 'Bar Flotation Machine' },
  'coarse-particle-flotation-machine': { zh: '粗粒浮选机', en: 'Coarse Particle Flotation Machine' },
  'flotation-cell': { zh: '浮选槽', en: 'Flotation Cell' },
  'self-priming-flotation-machine': { zh: '自吸式浮选机', en: 'Self-priming Flotation Machine' },
  'xcf-flotation-machine': { zh: 'XCF浮选机', en: 'XCF Flotation Machine' },
  
  // 磁选设备产品
  'permanent-magnetic-drum-separator': { zh: '永磁筒式磁选机', en: 'Permanent Magnetic Drum Separator' },
  'double-roller-permanent-magnetic-zircon-separator': { zh: '双辊永磁锆英磁选机', en: 'Double Roller Permanent Magnetic Zircon Separator' },
  'four-roller-variable-frequency-electrostatic-separator': { zh: '四辊变频高压静电选机', en: 'Four-Roller Variable Frequency High-Voltage Electrostatic Separator' },
  'plate-type-high-intensity-wet-magnetic-separator': { zh: '平板式高强磁湿选磁选机', en: 'Plate-type High-intensity Wet Magnetic Separator' },
  'roller-type-high-intensity-wet-magnetic-separator': { zh: '辊式高强度湿式磁选机', en: 'Roller-type High Intensity Wet Magnetic Separator' },
  'three-disc-belt-magnetic-separator': { zh: '三盘带式磁选机', en: 'Three-Disc Belt Magnetic Separator' }
};

// 获取标准化的产品数据结构
export function getFormattedProductData(product: any, productId: string, productCategory: string) {
  // 如果没有传入产品数据或ID，返回null
  if (!product || !productId) return null;
  
  // 获取产品名称
  const productName = productNameMap[productId] || { 
    zh: productId.includes('mill') ? '磨机' : '研磨设备',
    en: productId.includes('mill') ? 'Mill' : 'Grinding Equipment'
  };
  
  // 处理规格数据格式化
  const normalizedSpecs = normalizeSpecifications(product.specifications);
  // 处理特性数据格式化
  const normalizedFeatures = normalizeFeatures(product.features);
  
  // 处理相关产品数据
  const relatedProductsData = (() => {
    // 根据产品类别获取相关产品列表
    let relatedProductsList: string[] = [];
    
    // 磨矿设备
    if (productCategory === 'grinding') {
      relatedProductsList = ['wet-grid-ball-mill', 'dry-grid-ball-mill', 'overflow-ball-mill', 'rod-mill'];
    }
    // 破碎设备
    else if (productCategory === 'crushers') {
      relatedProductsList = ['jaw-crusher', 'cone-crusher', 'impact-crusher', 'hammer-crusher', 'double-roller-crusher'];
    }
    // 筛分设备
    else if (productCategory === 'screens') {
      relatedProductsList = ['circular-vibrating-screen', 'linear-vibrating-screen', 'banana-vibrating-screen', 'drum-screen'];
    }
    // 给料设备
    else if (productCategory === 'feeders') {
      relatedProductsList = ['plate-feeder', 'belt-feeder', 'electromagnetic-vibrating-feeder', 'disc-feeder', 'xdg-vibrating-feeder'];
    }
    // 洗矿设备
    else if (productCategory === 'washers') {
      relatedProductsList = ['spiral-washer', 'double-spiral-washer', 'drum-washer'];
    }
    // 重力选矿设备
    else if (productCategory === 'gravity-separation' || productCategory === 'beneficiation') {
      relatedProductsList = ['synchronous-counter-directional-jig', 'synchronous-counter-directional-jig-small', 'sawtooth-wave-jig', 'spiral-washer', 'high-weir-spiral-classifier'];
    }
    // 浮选设备
    else if (productCategory === 'flotation') {
      relatedProductsList = ['aeration-flotation-machine', 'bar-flotation-machine', 'coarse-particle-flotation-machine', 'flotation-cell', 'self-priming-flotation-machine', 'xcf-flotation-machine'];
    }
    // 默认情况
    else {
      // 使用产品自带的相关产品列表，或者空数组
      relatedProductsList = product.relatedProducts || [];
    }
    
    // 过滤掉当前正在查看的产品
    const filteredProducts = relatedProductsList.filter(id => id !== productId);
    
    // 创建相关产品数据结构
    const relatedItems = filteredProducts.map(id => ({
      id,
      series: productNameMap[id] || { 
        zh: id.includes('ball') ? '球磨机' : 
            id === 'rod-mill' ? '棒磨机' : 
            id.includes('crusher') ? '破碎机' :
            id.includes('screen') ? '振动筛' :
            id.includes('feeder') ? '给料机' :
            id.includes('washer') ? '洗矿机' : '设备',
        en: id.includes('ball') ? 'Ball Mill' : 
            id === 'rod-mill' ? 'Rod Mill' : 
            id.includes('crusher') ? 'Crusher' :
            id.includes('screen') ? 'Vibrating Screen' :
            id.includes('feeder') ? 'Feeder' :
            id.includes('washer') ? 'Washer' : 'Equipment'
      },
      image: `/images/products/${getProductImagePath(id)}`
    }));
    
    return {
      title: {
        zh: "相关产品",
        en: "Related Products"
      },
      basePath: getProductBasePath(productId, productCategory).basePath,
      items: relatedItems,
      visibleCards: Math.min(relatedItems.length, 3)
    };
  })();
  
  // 获取面包屑路径
  const breadcrumbData = {
    items: [
      {
        label: { zh: "产品与服务", en: "Products & Services" },
        href: "/products"
      },
      {
        label: getCategoryName(productCategory),
        href: getCategoryPath(productCategory)
      },
      {
        label: productName
      }
    ]
  };
  
  // 准备产品属性
  return {
    productId: product.id || productId,
    model: product.model,
    series: {
      en: product.nameEn || product.series?.en || productName.en,
      zh: product.nameZh || product.series?.zh || productName.zh
    },
    imagePath: `/images/products/${getProductImagePath(productId)}`,
    capacity: product.capacity,
    motorPower: product.motorPower,
    feedSize: product.feedSize,
    dischargeSize: product.dischargeSize,
    maxBallLoad: product.maxBallLoad,
    maxFeedSize: product.maxFeedSize,
    screenSize: product.screenSize,
    aperture: product.aperture,
    overview: product.overview,
    specifications: normalizedSpecs,
    features: normalizedFeatures,
    applications: product.applications,
    relatedProducts: relatedProductsData,
    extraParameters: product.extraParameters || {},
    breadcrumb: breadcrumbData
  };
}

// 获取产品图片路径
function getProductImagePath(productId: string): string {
  // 特定产品的路径映射
  const pathMappings: Record<string, string> = {
    'jaw-crusher': 'crushers/jaw-crusher.png',
    'cone-crusher': 'crushers/cone-crusher.png',
    'impact-crusher': 'crushers/impact-crusher.png',
    'hammer-crusher': 'crushers/hammer-crusher.png',
    'double-roller-crusher': 'crushers/double-roller-crusher.png',
    'heavy-duty-double-roller-crusher': 'crushers/heavy-duty-double-roller-crusher.png',
    'plate-feeder': 'feeders/plate-feeder.png',
    'belt-feeder': 'feeders/belt-feeder.png',
    'electromagnetic-vibrating-feeder': 'feeders/electromagnetic-vibrating-feeder.png',
    'disc-feeder': 'feeders/disc-feeder.png',
    'xdg-vibrating-feeder': 'feeders/xdg-vibrating-feeder.png',
    'spiral-washer': 'washers/spiral-washer.png',
    'double-spiral-washer': 'washers/double-spiral-washer.png',
    'drum-washer': 'washers/drum-washer.png',
    'synchronous-counter-directional-jig': 'gravity-separation/synchronous-counter-directional-jig.png',
    'synchronous-counter-directional-jig-small': 'gravity-separation/synchronous-counter-directional-jig-small.png',
    'sawtooth-wave-jig': 'gravity-separation/sawtooth-wave-jig.png',
    'aeration-flotation-machine': 'flotation/aeration-flotation-machine.png',
    'bar-flotation-machine': 'flotation/bar-flotation-machine.png',
    'coarse-particle-flotation-machine': 'flotation/coarse-particle-flotation-machine.png',
    'flotation-cell': 'flotation/flotation-cell.png',
    'self-priming-flotation-machine': 'flotation/self-priming-flotation-machine.png',
    'xcf-flotation-machine': 'flotation/xcf-flotation-machine.png',
    // 磁选设备产品映射
    'permanent-magnetic-drum-separator': 'magnetic-separation/permanent-magnetic-drum-separator.png',
    'double-roller-permanent-magnetic-zircon-separator': 'magnetic-separation/double-roller-permanent-magnetic-zircon-separator.png',
    'four-roller-variable-frequency-electrostatic-separator': 'magnetic-separation/four-roller-variable-frequency-electrostatic-separator.png',
    'plate-type-high-intensity-wet-magnetic-separator': 'magnetic-separation/plate-type-high-intensity-wet-magnetic-separator.png',
    'roller-type-high-intensity-wet-magnetic-separator': 'magnetic-separation/roller-type-high-intensity-wet-magnetic-separator.png',
    'three-disc-belt-magnetic-separator': 'magnetic-separation/three-disc-belt-magnetic-separator.png',
    // 振动筛产品映射
    'vibrating-screen': 'screens/xd-vibrating-screen.png',
    'xd-vibrating-screen': 'screens/xd-vibrating-screen.png',
    'ya-circular-vibrating-screen': 'screens/ya-circular-vibrating-screen.png',
    'linear-vibrating-screen': 'screens/linear-vibrating-screen.png',
    'banana-vibrating-screen': 'screens/banana-vibrating-screen.png',
    'bar-vibrating-screen': 'screens/bar-vibrating-screen.png',
    'drum-screen': 'screens/drum-screen.png',
    'zkr-linear-vibrating-screen': 'screens/zkr-linear-vibrating-screen.png'
  };
  
  // 检查特定映射
  if (pathMappings[productId]) {
    return pathMappings[productId];
  }
  
  // 通用路径生成逻辑
  if (productId.includes('crusher') || 
      (productNameMap[productId]?.zh.includes('破碎机') || productNameMap[productId]?.en.includes('Crusher'))) {
    return `crushers/${productId}.png`;
  }
  
  if (productId.includes('screen') || 
      (productNameMap[productId]?.zh.includes('筛') || productNameMap[productId]?.en.includes('Screen'))) {
    return `screens/${productId}.png`;
  }
  
  if (productId.includes('feeder') || 
      (productNameMap[productId]?.zh.includes('给料') || productNameMap[productId]?.en.includes('Feeder'))) {
    return `feeders/${productId}.png`;
  }
  
  if (productId.includes('washer') || 
      (productNameMap[productId]?.zh.includes('洗矿') || productNameMap[productId]?.en.includes('Washer'))) {
    return `washers/${productId}.png`;
  }
  
  if (productId.includes('mill') || 
      (productNameMap[productId]?.zh.includes('磨') || productNameMap[productId]?.en.includes('Mill'))) {
    return `grinding/${productId}.png`;
  }
  
  if (productId.includes('classifier') || 
      (productNameMap[productId]?.zh.includes('分级') || productNameMap[productId]?.en.includes('Classifier'))) {
    return `classification-equipment/${productId}.png`;
  }
  
  if (productId.includes('jig') || 
      (productNameMap[productId]?.zh.includes('跳汰') || productNameMap[productId]?.en.includes('Jig'))) {
    return `gravity-separation/${productId}.png`;
  }
  
  if (productId.includes('flotation') || 
      (productNameMap[productId]?.zh.includes('浮选') || productNameMap[productId]?.en.includes('Flotation'))) {
    return `flotation/${productId}.png`;
  }
  
  if (productId.includes('magnetic') || 
      (productNameMap[productId]?.zh.includes('磁选') || productNameMap[productId]?.en.includes('Magnetic'))) {
    return `magnetic-separation/${productId}.png`;
  }
  
  // 默认返回
  return `${productId}.png`;
}

// 获取产品类别名称
function getCategoryName(category: string): {zh: string, en: string} {
  const categoryMap: Record<string, {zh: string, en: string}> = {
    'grinding': { zh: '研磨设备', en: 'Grinding Equipment' },
    'crushers': { zh: '破碎设备', en: 'Crushing Equipment' },
    'screens': { zh: '筛分设备', en: 'Screening Equipment' },
    'feeders': { zh: '给料设备', en: 'Feeding Equipment' },
    'washers': { zh: '洗矿设备', en: 'Washing Equipment' },
    'gravity-separation': { zh: '重力选矿设备', en: 'Gravity Separation Equipment' },
    'beneficiation': { zh: '选矿设备', en: 'Beneficiation Equipment' },
    'flotation': { zh: '浮选设备', en: 'Flotation Equipment' },
    'magnetic-separation': { zh: '磁选设备', en: 'Magnetic Separation Equipment' }
  };
  
  return categoryMap[category] || { zh: '产品系列', en: 'Product Series' };
}

// 获取产品类别路径
function getCategoryPath(category: string): string {
  const pathMap: Record<string, string> = {
    'grinding': '/products/grinding-equipment',
    'crushers': '/products/stationary-crushers',
    'screens': '/products/vibrating-screens',
    'feeders': '/products/feeding-equipment',
    'washers': '/products/washing-equipment',
    'gravity-separation': '/products/gravity-separation',
    'beneficiation': '/products/beneficiation',
    'flotation': '/products/flotation',
    'magnetic-separation': '/products/magnetic-separation'
  };
  
  return pathMap[category] || '/products';
}

/**
 * 格式化参数值显示
 * @param param 参数对象
 * @param isZh 是否中文
 * @returns 格式化后的值
 */
export function getFormattedValue(param: any, isZh: boolean) {
  if (!param || !param.value) {
    if (param.min !== undefined && param.max !== undefined) {
      // 如果有min和max属性
      const unit = param.unit || '';
      if (param.min === param.max) {
        return `${param.min} ${unit}`;
      } else {
        return `${param.min}-${param.max} ${unit}`;
      }
    }
    return '';
  }

  // 如果已经有格式化的值
  if (typeof param.value === 'string') {
    return param.value;
  }

  // 如果值是一个对象，根据语言选择
  if (typeof param.value === 'object') {
    return isZh ? param.value.zh : param.value.en;
  }

  // 值是数字，加上单位
  const unit = param.unit || '';
  return `${param.value} ${unit}`;
}

// 辅助函数：从参数中获取单位
function getUnitFromParameter(param: any, defaultUnit: string): string {
  if (!param) return defaultUnit;
  if (typeof param === 'object' && param.unit) return param.unit;
  return defaultUnit;
}

// 根据产品类型获取前几个关键参数
export function getTopProductParameters(productData: any, productType: string, count: number = 3) {
  let parameters: Array<{
    label: { zh: string; en: string; };
    value: any;
    unit?: string;
  }> = [];
  
  // 浮选设备默认显示顺序
  if (productType === 'flotation') {
    // 1. 有效容积 - 最高优先级
    if (productData.effectiveVolume) {
      parameters.push({
        label: { zh: "有效容积", en: "Effective Volume" },
        value: productData.effectiveVolume,
        unit: getUnitFromParameter(productData.effectiveVolume, "m³")
      });
    }
    
    // 2. 处理能力 - 第二优先级
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: getUnitFromParameter(productData.capacity, "m³/min")
      });
    }
    
    // 3. 电机功率 - 第三优先级
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: getUnitFromParameter(productData.motorPower, "kW")
      });
    }
  } 
  // 磁选设备默认显示顺序
  else if (productType === 'magnetic-separation') {
    // 1. 处理能力 - 最高优先级
    if (productData.capacity) {
      parameters.push({
        label: { zh: "处理能力", en: "Processing Capacity" },
        value: productData.capacity,
        unit: getUnitFromParameter(productData.capacity, "t/h")
      });
    }
    
    // 2. 电机功率 - 第二优先级
    if (productData.motorPower) {
      parameters.push({
        label: { zh: "电机功率", en: "Motor Power" },
        value: productData.motorPower,
        unit: getUnitFromParameter(productData.motorPower, "kW")
      });
    }
    
    // 3. 磁场强度 - 第三优先级 (检查两种可能的参数名)
    if (productData.magneticIntensity) {
      parameters.push({
        label: { zh: "磁场强度", en: "Magnetic Intensity" },
        value: productData.magneticIntensity,
        unit: getUnitFromParameter(productData.magneticIntensity, "Gs")
      });
    } else if (productData.magneticFieldStrength) {
      parameters.push({
        label: { zh: "磁场强度", en: "Magnetic Field Strength" },
        value: productData.magneticFieldStrength,
        unit: getUnitFromParameter(productData.magneticFieldStrength, "Gs")
      });
    }
  }
  
  // 返回最多count个参数
  return parameters.slice(0, count);
}

// 处理磁选机硬编码参数
export const getMagneticSeparatorParams = (productId: string) => {
  const params: Record<string, any> = {
    'three-disc-belt-magnetic-separator': {
      capacity: {
        min: 80,
        max: 800,
        unit: 'kg/h'
      },
      motorPower: {
        min: 0.75,
        max: 1.5,
        unit: 'kW'
      },
      magneticFieldStrength: {
        min: 1700,
        max: 2000,
        unit: 'mt'
      }
    },
    'double-roller-permanent-magnetic-zircon-separator': {
      capacity: {
        min: 2,
        max: 8,
        unit: 't/h'
      },
      motorPower: {
        min: 3,
        max: 3,
        unit: 'kW'
      },
      magneticFieldStrength: {
        min: 10000,
        max: 14000,
        unit: 'Gs'
      }
    },
    'roller-type-high-intensity-wet-magnetic-separator': {
      capacity: {
        min: 0.5,
        max: 13,
        unit: 't/h'
      },
      motorPower: {
        min: 1.1,
        max: 1.5,
        unit: 'kW'
      },
      magneticFieldStrength: {
        min: 11000,
        max: 13500,
        unit: 'Gs'
      }
    }
  };
  
  return params[productId] || {};
}; 