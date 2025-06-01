import { ReactNode } from 'react';
import Container from './Container';

interface HeroSectionProps {
  title: string;
  description?: string | ReactNode;
  backgroundColor?: string;
  textColor?: string;
  tabs?: ReactNode;
  showDecorationLine?: boolean;
  decorationLineColor?: string;
  titleColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  headingLevel?: 'h1' | 'h2';
}

/**
 * 统一的Hero区域组件
 * 
 * 提供一致的内边距、布局和样式，用于页面顶部标题区域
 * 支持自定义背景和文本颜色配置
 * 支持底部显示产品Tab导航
 * 支持装饰性线条显示
 * 支持配置标题级别，避免多个h1标签
 */
export default function HeroSection({ 
  title, 
  description, 
  backgroundColor = 'bg-white',
  textColor = 'text-gray-800',
  tabs,
  showDecorationLine = true,
  decorationLineColor = 'bg-gray-200',
  titleColor = 'text-black',
  textAlign = 'left',
  headingLevel = 'h1'
}: HeroSectionProps) {
  // 更新标题样式，与MiningEpcServiceClient.tsx保持一致
  const titleClass = `text-[40px] md:text-[80px] ${textAlign === 'center' ? 'text-center' : 'text-left'} font-display ${titleColor} leading-none mb-2 sm:mb-2 md:mb-3 text-balance`;
  const descriptionClass = `text-xs sm:text-sm md:text-base font-text ${textColor} z-10 relative`;
  const containerClass = textAlign === 'center' ? 'text-center' : '';

  // 根据headingLevel渲染不同的标题标签
  const HeadingTag = headingLevel;

  return (
    <>
    {/* 更新内边距，与MiningEpcServiceClient.tsx保持一致 */}
    <section className={`flex flex-col justify-center ${backgroundColor} relative py-10 md:py-14`}>
      {/* 渐变黑色遮罩已移除 */}
      
      <Container className={`relative z-10 ${containerClass}`}>
        {textAlign === 'center' ? (
          <div className="text-center w-full mx-auto">
            {/* 装饰性线条 */}
            {showDecorationLine && (
              <div className="flex justify-center items-center">
                <div className={`w-16 sm:w-20 h-1 ${decorationLineColor} mb-3 sm:mb-4 md:mb-6 -translate-x-[40%]`}></div>
              </div>
            )}
            <HeadingTag className={titleClass}>{title}</HeadingTag>
            {description && (
              <div className="w-full prose text-center mx-auto">
                {typeof description === 'string' ? (
                  <p className={descriptionClass}>{description}</p>
                ) : (
                  description
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-y-8 lg:grid-cols-6 justify-items-start items-center">
          <div className="lg:col-span-3">
              {showDecorationLine && (
                <div className="flex items-center">
                  <div className={`w-16 sm:w-20 h-1 ${decorationLineColor} mb-3 sm:mb-4 md:mb-6`}></div>
                </div>
              )}
            <HeadingTag className={titleClass}>{title}</HeadingTag>
          </div>
          {description && (
            <div className="w-full prose lg:col-span-2 lg:col-start-5 text-left">
              {typeof description === 'string' ? (
                <p className={descriptionClass}>{description}</p>
              ) : (
                description
              )}
            </div>
          )}
        </div>
        )}
        </Container>
      </section>
        
      {/* 产品Tab导航 - 移到hero背景区域外 */}
        {tabs && (
        <div className="bg-white py-4 border-b border-gray-100">
          <Container>
            {tabs}
          </Container>
          </div>
        )}
    </>
  );
} 