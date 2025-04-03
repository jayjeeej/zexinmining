# 产品页面生成指南

本文档提供了如何添加新产品页面的详细说明，确保所有产品页面遵循统一的结构和样式。

## 一、产品数据结构

所有产品数据应存储在 `public/data/products/` 目录下，以产品ID命名的JSON文件中。

### 通用字段

所有产品类型都应包含以下基本字段：

```json
{
  "id": "product-id",
  "nameEn": "Product Name in English",
  "nameZh": "产品中文名称",
  "model": "型号范围，如XPE600-XPE1200",
  "capacity": { "min": 1, "max": 100, "unit": "t/h" },
  "motorPower": { "min": 7.5, "max": 160, "unit": "kW" },
  "overview": {
    "zh": "产品概述中文描述...",
    "en": "Product overview in English..."
  },
  "specifications": [
    // 规格数据，可以是表格行数据或键值对
    { "model": "XPE600", "capacity": "1-10", "motorPower": "7.5" },
    { "model": "XPE1200", "capacity": "50-100", "motorPower": "160" }
  ],
  "features": [
    {
      "zh": "产品特点1",
      "en": "Product feature 1"
    },
    {
      "zh": "产品特点2",
      "en": "Product feature 2"
    }
  ],
  "applications": {
    "title": {
      "zh": "应用领域",
      "en": "Application Areas"
    },
    "items": [
      {
        "icon": "⛏️",
        "title": { "zh": "应用领域1", "en": "Application Area 1" },
        "description": { "zh": "应用领域1描述", "en": "Description of application area 1" }
      }
    ]
  },
  "relatedProducts": ["related-product-id-1", "related-product-id-2"]
}
```

### 特定产品类型的额外字段

根据产品类型，可能需要添加以下额外字段：

#### 破碎机特有参数
```json
"maxFeedSize": { "min": 125, "max": 750, "unit": "mm" }
```

#### 振动筛特有参数
```json
"screenSize": { "min": 3, "max": 24, "unit": "m²" },
"aperture": { "min": 1, "max": 100, "unit": "mm" }
```

#### 磨矿设备特有参数
```json
"dischargeSize": { "min": 0.074, "max": 0.4, "unit": "mm" },
"maxBallLoad": { "min": 2.4, "max": 23.6, "unit": "t" }
```

#### 给料机和洗矿机特有参数
```json
"width": { "min": 650, "max": 2000, "unit": "mm" },
"length": { "min": 2000, "max": 6000, "unit": "mm" },
"height": { "min": 500, "max": 1200, "unit": "mm" }
```

## 二、添加新产品页面

### 方法一：使用动态路由（推荐）

最简单的方法是利用现有的动态路由页面。只需要在相应的产品类别目录下确保存在 `[id]/page.tsx` 文件，然后添加对应的产品数据JSON文件即可。

例如，添加一个新的磨矿设备产品：

1. 确保 `app/products/grinding-equipment/[id]/page.tsx` 文件存在
2. 创建产品数据文件 `public/data/products/new-mill-product.json`
3. 访问 `/products/grinding-equipment/new-mill-product` 即可查看新产品页面

### 方法二：使用模板创建单独页面

如果需要为特定产品创建单独的页面，可以使用提供的模板：

1. 在相应的产品类别目录下创建新的目录，如 `app/products/grinding-equipment/new-mill-product/`
2. 在该目录下创建 `page.tsx` 文件，使用以下模板：

```tsx
'use client';

import React from 'react';
import ProductPageTemplate from '@/app/templates/ProductPageTemplate';

export default function NewMillProductPage({ params }: { params: { id: string } }) {
  // 备用数据（可选）
  const fallbackData = {
    id: "new-mill-product",
    nameEn: "New Mill Product",
    nameZh: "新型磨矿设备",
    // ... 其他产品数据
  };
  
  return (
    <ProductPageTemplate
      params={{ id: "new-mill-product" }}
      productCategory="grinding"
      fallbackData={fallbackData}
    />
  );
}
```

## 三、添加新产品类别页面

如需添加新的产品类别列表页面，可使用提供的列表页面模板：

1. 在 `app/products/` 目录下创建新的目录，如 `app/products/new-category/`
2. 在该目录下创建 `page.tsx` 文件，使用以下模板：

```tsx
'use client';

import React from 'react';
import ProductListTemplate from '@/app/templates/ProductListTemplate';

export default function NewCategoryPage() {
  // 类别信息
  const categoryInfo = {
    title: { 
      zh: "新产品类别", 
      en: "New Product Category" 
    },
    description: { 
      zh: "新产品类别的描述文本...", 
      en: "Description text for the new product category..." 
    },
    coverImage: "/images/products/new-category.jpg"
  };
  
  // 备用数据（可选）
  const fallbackData = [
    {
      id: 'product-one',
      model: 'Model-A',
      series: {
        zh: '产品一',
        en: 'Product One'
      },
      capacity: { min: 1.5, max: 45, unit: 't/h' },
      motorPower: { min: 15, max: 245, unit: 'kW' }
    },
    // 更多备用产品...
  ];
  
  return (
    <ProductListTemplate
      productCategory="new-category"
      categoryInfo={categoryInfo}
      fallbackData={fallbackData}
    />
  );
}
```

3. 为支持动态路由，在新类别目录下创建 `[id]/page.tsx` 文件：

```tsx
'use client';

import React from 'react';
import ProductPageTemplate from '@/app/templates/ProductPageTemplate';

export default function NewCategoryProductPage({ params }: { params: { id: string } }) {
  return (
    <ProductPageTemplate
      params={params}
      productCategory="new-category"
    />
  );
}
```

## 四、产品图片规范

所有产品图片应按照以下规则放置：

1. 产品类别图片：`public/images/products/category-name.jpg`
2. 产品图片：`public/images/products/category-folder/product-id.jpg`

例如：
- 研磨设备类别图片：`public/images/products/grinding-equipment.jpg`
- 湿式格子型球磨机产品图片：`public/images/products/grinding/wet-grid-ball-mill.jpg`

图片应为高质量的产品照片，比例为16:9或4:3，分辨率不低于1200x800像素。

## 五、最佳实践

1. **统一产品ID命名**：使用连字符分隔的小写英文单词，如 `wet-grid-ball-mill`
2. **复用现有工具函数**：使用 `productUtils.ts` 中提供的工具函数处理产品数据
3. **保持数据一致性**：确保所有产品使用相同的数据结构和字段命名
4. **使用备用数据**：始终提供备用数据，以便在API请求失败时展示内容
5. **统一图片路径**：按照规范存放产品图片，确保所有产品图片路径遵循相同的模式

通过遵循上述指南，可以确保所有产品页面具有一致的样式和结构，同时简化未来添加新产品的过程。 