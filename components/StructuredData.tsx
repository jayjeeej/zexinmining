// 移除'use client'标记，确保这是一个服务器组件

interface StructuredDataProps {
  data: Record<string, any>;
  id?: string;
}

/**
 * 结构化数据组件
 * 用于在页面中注入schema.org结构化数据
 * 
 * @param data 要注入的结构化数据对象
 * @param id 可选的唯一ID
 */
export default function StructuredData({ data, id }: StructuredDataProps) {
  // 使用固定ID或基于内容的哈希值，而不是随机值
  const scriptId = id || `structured-data`;
  
  return (
    <script
      id={scriptId}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * 产品数据注入组件
 * 用于在页面中注入产品数据，类似于山特维克的实现
 * 
 * @param data 要注入的产品数据
 * @param id 脚本ID
 */
export function ProductDataScript({ 
  data, 
  id = 'product_data' 
}: { 
  data: Record<string, any>;
  id?: string;
}) {
  return (
    <script
      id={id}
      type="application/json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
