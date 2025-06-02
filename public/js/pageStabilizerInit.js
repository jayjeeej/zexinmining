/**
 * 页面稳定器初始化脚本
 * 在页面加载后手动初始化页面稳定器
 */
(function() {
  try {
    // 检查环境
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // 在服务器端环境下不执行
    }
    
    // 等待页面完全加载
    window.addEventListener('load', function() {
      // 延迟一点执行，确保DOM已经完全准备好
      setTimeout(function() {
        // 检查页面稳定器是否已加载
        if (window.pageStabilizer) {
          console.log('[PageStabilizerInit] 页面已加载，初始化页面稳定器');
          
          // 手动初始化页面稳定器
          window.pageStabilizer.initialize();
          
          // 启用动画效果
          window.pageStabilizer.enableAnimations();
          
          // 添加DOMContentLoaded后的处理
          if (document.readyState === 'complete') {
            handleDOMReady();
          } else {
            document.addEventListener('DOMContentLoaded', handleDOMReady);
          }
        } else {
          console.error('[PageStabilizerInit] 页面稳定器未加载');
        }
      }, 100);
    });
    
    // DOM准备就绪后的处理
    function handleDOMReady() {
      try {
        // 确保animation-ready类被添加到html元素
        if (document.documentElement && !document.documentElement.classList.contains('animation-ready')) {
          document.documentElement.classList.add('animation-ready');
          console.log('[PageStabilizerInit] 添加animation-ready类');
        }
      } catch (e) {
        console.error('[PageStabilizerInit] DOM就绪处理失败:', e);
      }
    }
  } catch (error) {
    console.error('[PageStabilizerInit] 初始化错误:', error);
  }
})(); 