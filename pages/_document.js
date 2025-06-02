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