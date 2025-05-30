# Zexin Mining Website

## Netlify部署指南

本项目使用Netlify进行部署。以下是部署步骤：

### 部署方式一：直接通过Netlify控制台

1. 登录[Netlify](https://app.netlify.com/)
2. 点击"Add new site" > "Import an existing project"
3. 选择对应的Git仓库
4. 部署设置：
   - 构建命令：`npm run build`
   - 发布目录：`.next`
5. 点击"Deploy site"

### 部署方式二：使用Netlify CLI

1. 安装Netlify CLI：
   ```bash
   npm install -g netlify-cli
   ```

2. 登录Netlify：
   ```bash
   netlify login
   ```

3. 初始化Netlify配置：
   ```bash
   netlify init
   ```

4. 部署网站：
   ```bash
   netlify deploy --prod
   ```

## 注意事项

- 确保已安装`@netlify/plugin-nextjs`插件，该插件会处理Next.js的SSR和静态路由
- 项目根目录下的`netlify.toml`文件已配置好Next.js所需的设置
- 如需调整Netlify设置，可编辑`netlify.toml`文件

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建

```bash
# 构建项目
npm run build

# 启动构建后的项目
npm start
``` 