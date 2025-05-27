'use client';

import { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

// 手风琴项定义
export interface AccordionItem {
  id: string;
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  expanded?: boolean;
}

// 手风琴组件属性
interface AccordionProps {
  items: AccordionItem[];
  defaultExpandedId?: string;
  defaultExpandedIds?: string[];
  expandAll?: boolean;
  allowMultiple?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconPosition?: 'left' | 'right';
}

export default function Accordion({
  items,
  defaultExpandedId,
  defaultExpandedIds = [],
  expandAll = false,
  allowMultiple = false,
  className = '',
  titleClassName = '',
  contentClassName = '',
  iconPosition = 'right'
}: AccordionProps) {
  // 追踪展开状态
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // 初始化展开状态
    const initialExpandedItems = new Set<string>();
    
    // 如果设置了expandAll属性，展开所有项
    if (expandAll) {
      items.forEach(item => initialExpandedItems.add(item.id));
      return initialExpandedItems;
    }
    
    // 首先检查defaultExpandedIds
    if (defaultExpandedIds.length > 0) {
      defaultExpandedIds.forEach(id => initialExpandedItems.add(id));
      return initialExpandedItems;
    }
    
    // 其次检查defaultExpandedId
    if (defaultExpandedId) {
      initialExpandedItems.add(defaultExpandedId);
      return initialExpandedItems;
    }
    
    // 最后检查每个item的expanded属性
    items.forEach(item => {
      if (item.expanded) {
        initialExpandedItems.add(item.id);
      }
    });
    
    return initialExpandedItems;
  });

  // 内容高度引用
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // 切换项目展开状态
  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      
      return newSet;
    });
  };

  // 添加数据属性以支持JS模块
  useEffect(() => {
    // 当组件卸载时清理引用
    return () => {
      contentRefs.current = {};
    };
  }, []);

  return (
    <div className={twMerge('divide-y divide-gray-100', className)} data-accordion>
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        
        return (
          <div key={item.id} className="py-3" data-accordion-item>
            <button
              type="button"
              className={twMerge(
                'flex w-full items-center justify-between py-2 text-left transition-colors',
                isExpanded ? 'font-medium text-primary' : 'text-gray-800',
                titleClassName
              )}
              onClick={() => toggleItem(item.id)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              data-accordion-trigger
            >
              {iconPosition === 'left' && (
                <span className="mr-2 text-primary">
                  {isExpanded ? (
                    <MinusIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </span>
              )}
              
              <span className={iconPosition === 'left' ? 'flex-1' : ''}>
                {item.title}
              </span>
              
              {iconPosition === 'right' && (
                <span className="ml-2 text-primary">
                  {isExpanded ? (
                    <MinusIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </span>
              )}
            </button>
            
            <div
              id={`accordion-content-${item.id}`}
              ref={(el) => {
                contentRefs.current[item.id] = el;
              }}
              className={twMerge(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
                contentClassName
              )}
              data-accordion-content
            >
              <div className="py-3">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 图标组件
function MinusIcon({ className = 'h-6 w-6' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

function PlusIcon({ className = 'h-6 w-6' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
    </svg>
  );
} 