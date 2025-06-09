import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* 页面稳定器脚本 - 防止页面刷新时位移和闪烁 */}
          <script src="/js/pageStabilizer.js" />
          {/* 页面稳定器初始化脚本 - 确保滚动记忆和动画效果正常工作 */}
          <script src="/js/pageStabilizerInit.js" />
          {/* 加载自定义字体 */}
          <link rel="stylesheet" href="/css/fonts.css" />
          
          {/* Favicon标签 */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 