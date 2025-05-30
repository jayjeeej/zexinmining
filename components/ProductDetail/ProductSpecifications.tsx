'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect, useRef, useId } from 'react';
import CardAnimationProvider from '@/components/CardAnimationProvider';
import { usePathname } from 'next/navigation';

// 新增hooks来检测视窗宽度
function useMediaQuery(width: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setMatches(window.innerWidth < width);
      };
      
      // 初始检测
      handleResize();
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize);
      
      // 清理监听
      return () => window.removeEventListener('resize', handleResize);
    }
    
    return undefined;
  }, [width]);

  return matches;
}

interface Specification {
  name: string;
  value: string;
  imperialName?: string;  // 英制单位表头
  imperialValue?: string; // 英制单位值
}

interface UnitConfig {
    enabled: boolean;
    defaultUnit?: 'metric' | 'imperial';
    uiConfig?: {
      showUnitToggle?: boolean;
      position?: 'top-right' | 'top-left';
      labels?: {
        toggle?: string;
        metric?: string;
        imperial?: string;
      }
    }
}

// 新增响应式表格配置接口
interface ResponsiveTableConfig {
  type?: 'stacked' | 'scroll' | 'combined';
  mobileBreakpoint?: number;
  priorityColumns?: number[];
  fixedFirstColumn?: boolean;
  numericColumns?: number[];
  styles?: {
    cardBorderRadius?: string;
    cardShadow?: string;
    labelWidth?: string;
  }
}

interface ProductSpecificationsProps {
  specifications: Specification[];
  locale?: string;
  unitConversion?: UnitConfig;
  responsiveConfig?: ResponsiveTableConfig; // 新增响应式配置属性
  useInjectedData?: boolean;
}

/**
 * 产品规格组件 - 支持数据注入式结构和响应式设计
 */
export default function ProductSpecifications({ 
  specifications, 
  locale,
  unitConversion = { enabled: false },
  responsiveConfig = {
    type: 'stacked',
    mobileBreakpoint: 768,
    priorityColumns: [0, 1, 7],
    fixedFirstColumn: true,
    numericColumns: [1, 2, 3, 4, 5, 6, 7, 8],
    styles: {
      cardBorderRadius: '0.375rem',
      cardShadow: '0 1px 3px rgba(0,0,0,0.1)',
      labelWidth: '40%'
    }
  },
  useInjectedData = true
}: ProductSpecificationsProps) {
  // 优先使用传入的locale，如果没有则使用next-intl的locale
  const nextLocale = useLocale();
  const isZh = locale ? locale === 'zh' : nextLocale === 'zh';
  const pathname = usePathname(); // 添加路径监听
  const instanceId = useId(); // 创建组件实例唯一ID
  
  // 单位状态 (metric 或 imperial)
  const [unit, setUnit] = useState<'metric' | 'imperial'>(
    unitConversion.defaultUnit || 'metric'
  );

  // 规格数据
  const [specData, setSpecData] = useState<{
    names: string[];
    values: string[][];
    note?: string;
  }>({
    names: specifications.map(spec => 
      unit === 'imperial' && spec.imperialName ? spec.imperialName : spec.name
    ),
    values: useInjectedData ? [] : [specifications.map(spec => 
      unit === 'imperial' && spec.imperialValue ? spec.imperialValue : spec.value
    )],
    note: ''
  });
  
  // 单位转换配置
  const [unitConfig, setUnitConfig] = useState<UnitConfig>(unitConversion);
  
  // 响应式配置状态
  const [tableConfig, setTableConfig] = useState<ResponsiveTableConfig>(responsiveConfig);
  
  // 表格视图状态: 'full' 完整视图 或 'simplified' 简化视图
  const [tableView, setTableView] = useState<'full' | 'simplified'>('simplified');
  
  // 检测是否为移动设备视图
  const isMobile = useMediaQuery(tableConfig.mobileBreakpoint || 768);
  
  // 表格容器引用 - 用于水平滚动
  const tableRef = useRef<HTMLDivElement>(null);
  
  // 表格动画状态
  const [isExpanding, setIsExpanding] = useState(false);
  
  // 是否应该显示单位切换按钮
  const showUnitToggle = !isZh && 
    unitConfig.enabled && 
    (unitConfig.uiConfig?.showUnitToggle !== false);

  // 从JSON数据脚本中获取配置
  useEffect(() => {
    if (!useInjectedData || typeof document === 'undefined') return;
    
    console.log(`[ProductSpecifications] Initializing for path: ${pathname} with ID: ${instanceId}`);
    
    let attempts = 0;
    const maxAttempts = 5;
    
    // 添加一个函数来加载数据，可以在多个时机调用
    const loadProductData = () => {
      attempts++;
    
    try {
      // 尝试读取注入的产品数据
      const productDataScript = document.getElementById('product_data');
      
      if (productDataScript && productDataScript.textContent) {
        console.log('[ProductSpecifications] Loading product data from script, path:', pathname);
        const productData = JSON.parse(productDataScript.textContent);
        
        if (productData.specifications) {
          const specs = productData.specifications;
          
          // 根据当前单位选择表头和数据
          if (specs.tableHeaders && specs.tableData) {
              // 保存完整数据集，不丢失行
              const tableData = unit === 'imperial' && Array.isArray(specs.tableDataImperial) 
                ? specs.tableDataImperial 
                : specs.tableData;
              
              if (!Array.isArray(tableData) || tableData.length === 0) {
                console.error('无效规格数据');
                // 如果注入数据无效，回退到props提供的数据
                if (specifications.length > 0) {
                  setSpecData({
                    names: specifications.map(spec => 
                      unit === 'imperial' && spec.imperialName ? spec.imperialName : spec.name
                    ),
                    values: [specifications.map(spec => 
                      unit === 'imperial' && spec.imperialValue ? spec.imperialValue : spec.value
                    )],
                    note: ''
                  });
                }
                return;
              }
                
              // 确保完整数据集被使用
            setSpecData({
              names: unit === 'imperial' && specs.tableHeadersImperial 
                ? specs.tableHeadersImperial 
                : specs.tableHeaders,
                values: tableData,
              note: specs.note
              });
              
              // 数据加载成功，重置尝试计数
              attempts = 0;
          }
          
          // 更新单位转换配置
          if (productData.unitConversion) {
            setUnitConfig(productData.unitConversion);
          }
          
          // 更新响应式表格配置
          if (specs.responsiveStyle) {
            setTableConfig({
              ...tableConfig,
              ...specs.responsiveStyle
            });
          }
        }
        } else {
          // 如果注入数据不可用，回退到props提供的数据
          if (specifications.length > 0) {
            setSpecData({
              names: specifications.map(spec => 
                unit === 'imperial' && spec.imperialName ? spec.imperialName : spec.name
              ),
              values: [specifications.map(spec => 
                unit === 'imperial' && spec.imperialValue ? spec.imperialValue : spec.value
              )],
              note: ''
            });
          }
          
          // 如果还在尝试中且没有达到最大尝试次数，则过一会儿再试
          if (attempts < maxAttempts) {
            setTimeout(loadProductData, 500);
          }
      }
    } catch (error) {
      console.error('规格数据解析错误');
        
        // 出错时回退到props提供的数据
        if (specifications.length > 0) {
          setSpecData({
            names: specifications.map(spec => 
              unit === 'imperial' && spec.imperialName ? spec.imperialName : spec.name
            ),
            values: [specifications.map(spec => 
              unit === 'imperial' && spec.imperialValue ? spec.imperialValue : spec.value
            )],
            note: ''
          });
        }
      }
    };
    
    // 初始加载
    loadProductData();
    
    // 添加页面加载完成后的加载
    if (typeof window !== 'undefined') {
      // 如果页面已经加载完成
      if (document.readyState === 'complete') {
        setTimeout(loadProductData, 100); // 延迟一点以确保所有DOM元素都加载完毕
      } else {
        // 否则等待页面加载完成再次尝试
        window.addEventListener('load', () => setTimeout(loadProductData, 100));
        return () => window.removeEventListener('load', loadProductData);
      }
    }
  }, [unit, useInjectedData, specifications, pathname, instanceId]); // 添加instanceId作为依赖

  // 处理单位切换
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    
    // 如果使用注入的数据，单位变化时会通过useEffect更新
    // 如果使用传入的specifications，需要手动更新
    if (!useInjectedData) {
      setSpecData({
        names: specifications.map(spec => 
          newUnit === 'imperial' && spec.imperialName ? spec.imperialName : spec.name
        ),
        values: [specifications.map(spec => 
          newUnit === 'imperial' && spec.imperialValue ? spec.imperialValue : spec.value
        )],
        note: specData.note
      });
    }
  };
  
  // 切换表格视图
  const toggleTableView = () => {
    // 设置展开动画状态
    if (tableView === 'simplified') {
      setIsExpanding(true);
      // 动画结束后重置状态，增加动画持续时间至1000ms
      setTimeout(() => setIsExpanding(false), 500);
    }
    
    setTableView(prev => prev === 'full' ? 'simplified' : 'full');
  };
  
  // 处理表格水平滚动
  const handleScroll = (direction: 'left' | 'right') => {
    if (!tableRef.current) return;
    
    const scrollAmount = 200; // 每次滚动的像素
    const currentScroll = tableRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
      
    tableRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };
  
  // 获取要显示的列
  const getVisibleColumns = () => {
    if (!isMobile || tableView === 'full') {
      return specData.names.map((_, i) => i);
    }
    
    // 返回优先列
    return tableConfig.priorityColumns || [0, 1];
  };
  
  // 是否应该显示简化/完整视图切换按钮
  const showViewToggle = isMobile;
  
  // 确定当前视图类型
  const viewType = tableConfig.type || 'stacked';
  
  // 是否为堆叠式视图
  const isStackedView = isMobile && (viewType === 'stacked' || (viewType === 'combined' && tableView === 'simplified'));
  
  // 是否为水平滚动式视图
  const isScrollView = isMobile && (viewType === 'scroll' || (viewType === 'combined' && tableView === 'full'));

  return (
    <section id="specifications" className="mb-16 lg:mb-32 scroll-mt-32" key={`specs-${pathname}-${instanceId}`}>
      <CardAnimationProvider />
      <div className="contain">
        <h2 className="text-4xl mb-8 font-headline">{isZh ? '技术规格' : 'Specifications'}</h2>
        
        {/* 单位切换按钮容器 - 与表格分离 */}
        {showUnitToggle && (
          <div className="flex justify-end mb-4 space-x-2">
            <button
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 border font-text ${
                unit === 'metric' 
                  ? 'bg-primary text-white border-primary hover:bg-primary-dark' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleUnitChange('metric')}
            >
              {unitConfig.uiConfig?.labels?.metric || 'Metric'}
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 border font-text ${
                unit === 'imperial'
                  ? 'bg-primary text-white border-primary hover:bg-primary-dark'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleUnitChange('imperial')}
            >
              {unitConfig.uiConfig?.labels?.imperial || 'Imperial'}
            </button>
          </div>
        )}
        
        {/* 视图切换按钮 - 单独展示 */}
        {showViewToggle && (
          <div className="flex mb-4">
            <button
              className="px-4 py-2 text-sm border rounded-full transition-colors duration-200 bg-white text-gray-700 border-gray-200 hover:bg-gray-50 font-text"
              onClick={toggleTableView}
            >
              {tableView === 'full' ? 
                (isZh ? '显示简化视图' : 'Simplified View') : 
                (isZh ? '显示完整表格' : 'Full Table')}
            </button>
          </div>
        )}
        
        {/* 表格容器 */}
        <div className={`bg-white shadow-sm rounded-lg overflow-hidden table-animation-container ${isExpanding ? 'expanding animation-duration-1s' : ''}`}>
          {/* 水平滚动式表格 */}
          {isScrollView && (
            <div className="relative table-container">
              {/* 滚动指示及控制按钮 */}
              <div className="flex justify-between items-center absolute top-1/2 -translate-y-1/2 w-full px-2 z-10 pointer-events-none">
                <button 
                  onClick={() => handleScroll('left')}
                  className="bg-white rounded-full p-2 shadow pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
                  aria-label={isZh ? "向左滚动" : "Scroll left"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  className="bg-white rounded-full p-2 shadow pointer-events-auto opacity-70 hover:opacity-100 transition-opacity"
                  aria-label={isZh ? "向右滚动" : "Scroll right"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              
              {/* 滚动容器 */}
              <div 
                ref={tableRef}
                className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                <table className="w-full border-collapse min-w-[640px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {specData.names.map((name, index) => (
                        <th 
                          key={index} 
                          className="text-center p-4 font-medium text-gray-700 font-headline whitespace-nowrap"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specData.values.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((value, colIndex) => (
                          <td 
                            key={colIndex} 
                            className="text-center p-4 text-gray-600 font-text"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 堆叠式表格 */}
          {isStackedView && (
            <div className="divide-y table-container">
              {specData.values.map((row, rowIndex) => (
                <div 
                  key={rowIndex} 
                  className="p-4 hover:bg-gray-50 transition-colors"
                  style={{
                    borderRadius: tableConfig.styles?.cardBorderRadius,
                    boxShadow: tableConfig.styles?.cardShadow
                  }}
                >
                  {/* 显示首列作为卡片标题 */}
                  <h3 className="font-bold text-gray-900 mb-4 text-lg font-headline">{row[0]}</h3>
                  
                  {/* 显示其他选定列的数据 */}
                  <div className="grid grid-cols-1 gap-3">
                    {getVisibleColumns()
                      .filter(colIndex => colIndex !== 0) // 排除标题列
                      .map(colIndex => (
                        <div key={colIndex} className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span 
                            className="text-gray-500 font-medium font-headline"
                            style={{
                              width: tableConfig.styles?.labelWidth,
                              paddingRight: '8px'
                            }}
                          >
                            {specData.names[colIndex]}
                          </span>
                          <span className="font-text">
                            {row[colIndex]}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 默认标准表格 (非移动设备) */}
          {!isMobile && (
            <div className="table-container">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {specData.names.map((name, index) => (
                      <th key={index} className="text-center p-4 font-medium text-gray-700 font-headline">
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specData.values.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((value, colIndex) => (
                        <td key={colIndex} className="text-center p-4 text-gray-600 font-text">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 注释说明 */}
          {specData.note && (
            <div className="p-4 text-sm text-gray-500 italic font-text">
              {specData.note}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 