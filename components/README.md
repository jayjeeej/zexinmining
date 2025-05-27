# 泽鑫组件库

## 布局系统组件

### Container 容器组件

`Container` 是标准容器组件，提供一致的最大宽度和内边距。

#### 使用方式

```jsx
import Container from './components/Container';

// 基本用法
<Container>
  内容
</Container>

// 带背景色
<Container backgroundColor="bg-gray-50">
  内容
</Container>

// 带内边距
<Container withPadding>
  内容
</Container>

// 自定义元素类型
<Container as="section" className="my-custom-class">
  内容
</Container>
```

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|------|------|-------|------|
| children | ReactNode | - | 容器内容 |
| className | string | "" | 额外的类名 |
| withPadding | boolean | false | 是否添加上下内边距 |
| backgroundColor | string | "" | 背景颜色类名 |
| as | ElementType | "div" | 渲染元素类型 |

### Grid 网格组件

`Grid` 是标准网格布局组件，提供响应式网格布局。

#### 使用方式

```jsx
import Grid from './components/Grid';

// 基本用法 - 默认中等屏幕2列，大屏幕3列
<Grid>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Grid>

// 自定义列数
<Grid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
  内容
</Grid>

// 自定义间距
<Grid gap="gap-4">
  内容
</Grid>

// 不需要容器和外边距
<Grid withContainer={false} withMargins={false}>
  内容
</Grid>
```

#### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|------|------|-------|------|
| children | ReactNode | - | 网格内容 |
| className | string | "" | 额外的类名 |
| backgroundColor | string | "" | 背景颜色类名 |
| withContainer | boolean | true | 是否包含标准容器 |
| withMargins | boolean | true | 是否添加上下外边距 |
| cols | { sm?: number, md?: number, lg?: number, xl?: number } | { md: 2, xl: 3 } | 不同屏幕尺寸下的列数 |
| gap | string | "gap-8" | 网格间距类名 |
| as | ElementType | "div" | 渲染元素类型 |

## 组件使用指南

### 页面布局

对于页面布局，推荐使用以下组件组合：

```jsx
<PageTitle 
  title="页面标题" 
  description="页面描述" 
/>

<Grid>
  {items.map(item => (
    <ProductCard key={item.id} {...item} />
  ))}
</Grid>

<ContactCard 
  title="联系我们" 
  description="联系描述" 
  buttonText="联系按钮" 
  linkUrl="/contact" 
/>
```

### 旧组件向新组件的迁移

为保持向后兼容性，以下旧组件被保留，但内部实现已更新为使用新组件：

- `ProductGrid` - 现在是 `Grid` 的封装
- `PageTitle` - 现在使用 `Container` 
- `ContactCard` - 现在使用 `Container`

在新代码中，推荐直接使用 `Container` 和 `Grid` 组件，以便获得更大的灵活性。 