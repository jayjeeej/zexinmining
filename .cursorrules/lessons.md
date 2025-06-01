# 项目经验教训

## 前端开发

- 使用Next.js时，确保在服务器端和客户端的数据获取保持一致，避免水合错误
- 使用`next/image`组件时，必须为图片设置正确的宽度和高度，或者使用`fill`属性
- 在Next.js中，使用`usePathname()`和`useSearchParams()`钩子获取当前URL信息，而不是`window.location`
- 在服务器组件中不能使用客户端钩子，如`useState`、`useEffect`等
- 在Next.js 13+中，页面路由使用App Router，文件放在app目录下，而不是pages目录
- 使用Tailwind CSS时，确保在`tailwind.config.js`中正确配置内容路径
- 使用`next-sitemap`生成站点地图时，确保在`next-sitemap.config.js`中设置正确的域名

## 页面过渡和性能优化

- **避免使用opacity透明度变化来实现页面过渡效果，这会导致页面跳转时闪黑**
- **确保HTML和body元素有一致的背景色，特别是在页面过渡期间**
- **使用transform变换（如translateY、scale等）代替opacity实现过渡效果**
- **预加载关键资源，特别是首屏图片，使用`fetchPriority="high"`属性**
- **在页面过渡期间保持背景色不变，可以通过CSS类和样式控制**
- 使用`content-visibility: auto`和`contain-intrinsic-size`优化大型页面的渲染性能
- 图片使用`srcset`和`sizes`属性实现响应式加载，减少不必要的带宽消耗
- 使用`<link rel="preconnect">`预连接到关键资源，提前建立连接
- 使用`font-display: swap`确保字体加载不会阻塞页面渲染

## SEO优化

- 确保每个页面都有唯一的标题和描述
- 使用结构化数据（JSON-LD）增强搜索结果
- 确保所有图片都有alt属性
- 使用语义化HTML标签，如`<article>`、`<section>`、`<nav>`等
- 确保网站有正确的robots.txt和sitemap.xml文件
- 使用`next-sitemap`自动生成站点地图
- 使用`next/head`或metadata API添加元标签

## 调试技巧

- 使用Chrome DevTools的Network面板检查资源加载情况
- 使用Lighthouse检查页面性能、可访问性和SEO
- 使用React Developer Tools检查组件树和状态
- 在开发环境中使用`console.log`和`debugger`语句
- 使用Next.js的错误边界捕获和处理错误

## 部署和CI/CD

- 使用Vercel或Netlify部署Next.js应用
- 设置自动化测试和部署流程
- 使用环境变量管理不同环境的配置
- 确保生产环境中禁用开发工具和调试信息
- 使用CDN加速静态资源加载 