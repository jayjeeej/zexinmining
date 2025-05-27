import { ReactNode, ElementType } from 'react';
import Container from './Container';

interface GridProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
  withContainer?: boolean; // 是否包含标准容器
  withMargins?: boolean; // 是否添加上下外边距
  cols?: {
    sm?: number; // 小屏幕列数
    md?: number; // 中等屏幕列数
    lg?: number; // 大屏幕列数
    xl?: number; // 超大屏幕列数
  };
  gap?: string; // 网格间距
  as?: ElementType; // 元素类型
}

/**
 * 标准网格布局组件 - 提供响应式网格布局
 * 使用方式示例: <Grid cols={{md: 2, xl: 3}}>网格项目</Grid>
 */
export default function Grid({ 
  children, 
  className = "", 
  backgroundColor = "",
  withContainer = true,
  withMargins = true,
  cols = { md: 2, xl: 3 },
  gap = "gap-8",
  as: Component = "div"
}: GridProps) {
  // 构建网格列类名
  let gridColsClasses = "";
  if (cols.sm) gridColsClasses += ` sm:grid-cols-${cols.sm}`;
  if (cols.md) gridColsClasses += ` md:grid-cols-${cols.md}`;
  if (cols.lg) gridColsClasses += ` lg:grid-cols-${cols.lg}`;
  if (cols.xl) gridColsClasses += ` xl:grid-cols-${cols.xl}`;
  
  // 计算上下外边距
  const margins = withMargins ? "mb-16 lg:mb-32" : "";
  
  // 构建网格元素
  const gridElement = (
    <Component className={`grid ${gap}${gridColsClasses} ${className}`}>
      {children}
    </Component>
  );
  
  // 如果需要包含容器，则包裹在Container中
  if (withContainer) {
    return (
      <section className={margins}>
        <Container backgroundColor={backgroundColor} withPadding>
          {gridElement}
        </Container>
      </section>
    );
  }
  
  // 否则直接返回网格元素
  return gridElement;
} 