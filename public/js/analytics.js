// Google Analytics 4 初始化代码
(function() {
  // 只在浏览器环境中执行
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());

  // 实际的 Google Analytics 4 测量 ID
  gtag('config', 'G-EC13FTDBEK', {
    'anonymize_ip': true, // 增加IP匿名化
    'send_page_view': true
  });
})(); 