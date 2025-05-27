import { ReactNode, ElementType } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  withPadding?: boolean; // 是否添加上下内边距
  backgroundColor?: string; // 背景颜色
  as?: ElementType; // 使用 ElementType 正确定义组件类型
}

/**
 * 标准容器组件 - 提供一致的布局容器
 * 使用方式示例: <Container>内容</Container>
 */
export default function Container({ 
  children, 
  className = "", 
  withPadding = false,
  backgroundColor = "",
  as: Component = "div"
}: ContainerProps) {
  // 计算上下内边距类名
  const paddingY = withPadding ? "py-8 lg:py-16" : "";
  
  return (
    <Component className={`${backgroundColor} ${className}`}>
      <div className={`contain mx-auto ${paddingY} text-left`}>
        {children}
      </div>
    </Component>
  );
} 