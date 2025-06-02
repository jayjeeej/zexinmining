(function() {
  try {
    // 检查环境
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // 在服务器端环境下不执行
    }
    
    // 避免重复初始化
    if (window._pageStabilizerInitialized) {
      return;
    }
    window._pageStabilizerInitialized = true;
    
    // 保存初始状态
    var pageTransitioning = false;
    var readyStateInteractive = false;
    var bodyStyleBackup = null;
    var bgLayer = null;
    
    // 创建全局样式元素 - 完全移除所有过渡效果
    function createStyleElement() {
      var style = document.createElement('style');
      style.id = 'page-stabilizer-style';
      style.innerHTML = `
        /* 完全禁用所有页面过渡效果，但排除带有animation-ready类的元素下的特定动画元素 */
        body.page-transitioning *:not(html.animation-ready .transition-all):not(html.animation-ready span[class*="transition-transform"]):not(html.animation-ready .category-card):not(html.animation-ready .product-card):not(html.animation-ready .dropdown-menu):not(html.animation-ready .dropdown-menu-content):not(html.animation-ready .scroll-progress-bar):not(html.animation-ready .mobile-menu):not(html.animation-ready .mobile-menu-content):not(html.animation-ready .search-dropdown):not(html.animation-ready .search-dropdown *):not(html.animation-ready .accordion):not(html.animation-ready .accordion *):not(html.animation-ready [data-accordion]):not(html.animation-ready [data-accordion] *):not(html.animation-ready .full-table):not(html.animation-ready .full-table *):not(html.animation-ready [data-full-table]):not(html.animation-ready [data-full-table] *):not([class*="table"]):not([class*="table"] *):not(html.animation-ready button):not(html.animation-ready button *):not([role="button"]):not([role="button"] *):not([class*="collapse"]):not([class*="collapse"] *):not([class*="expand"]):not([class*="expand"] *):not(dialog):not(dialog *):not(.dialog):not(.dialog *):not([role="dialog"]):not([role="dialog"] *):not(.modal):not(.modal *):not([class*="modal"]):not([class*="modal"] *):not(.popup):not(.popup *):not([class*="popup"]):not([class*="popup"] *):not(.drawer):not(.drawer *):not([class*="drawer"]):not([class*="drawer"] *),
        body *:not(html.animation-ready .transition-all):not(html.animation-ready span[class*="transition-transform"]):not(html.animation-ready .category-card):not(html.animation-ready .product-card):not(html.animation-ready .dropdown-menu):not(html.animation-ready .dropdown-menu-content):not(html.animation-ready .scroll-progress-bar):not(html.animation-ready .mobile-menu):not(html.animation-ready .mobile-menu-content):not(html.animation-ready .search-dropdown):not(html.animation-ready .search-dropdown *):not(html.animation-ready .accordion):not(html.animation-ready .accordion *):not(html.animation-ready [data-accordion]):not(html.animation-ready [data-accordion] *):not(html.animation-ready .full-table):not(html.animation-ready .full-table *):not(html.animation-ready [data-full-table]):not(html.animation-ready [data-full-table] *):not([class*="table"]):not([class*="table"] *):not(html.animation-ready button):not(html.animation-ready button *):not([role="button"]):not([role="button"] *):not([class*="collapse"]):not([class*="collapse"] *):not([class*="expand"]):not([class*="expand"] *):not(dialog):not(dialog *):not(.dialog):not(.dialog *):not([role="dialog"]):not([role="dialog"] *):not(.modal):not(.modal *):not([class*="modal"]):not([class*="modal"] *):not(.popup):not(.popup *):not([class*="popup"]):not([class*="popup"] *):not(.drawer):not(.drawer *):not([class*="drawer"]):not([class*="drawer"] *) {
          transition: none !important;
          animation: none !important;
        }
        
        /* 确保背景色始终为白色，避免闪黑 - 提高优先级 */
        html, body {
          background-color: #ffffff !important;
        }
        
        /* 页面加载和过渡期间的背景颜色控制 */
        html::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          z-index: -1;
        }
        
        /* 创建背景控制层 */
        #page-stabilizer-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          z-index: -2;
          pointer-events: none;
        }
        
        /* 移除所有页面稳定化效果 */
        body.page-stabilizing {
          overflow: visible !important;
          pointer-events: auto;
          visibility: visible;
        }
        
        /* 移除加载叠加层 */
        .page-loading-overlay {
          display: none !important;
        }
        
        /* 禁用所有页面过渡动画，但排除带有animation-ready类的元素 */
        .page-transition-enter:not(html.animation-ready *),
        .page-transition-enter-active:not(html.animation-ready *),
        .page-transition-exit:not(html.animation-ready *),
        .page-transition-exit-active:not(html.animation-ready *) {
          transition: none !important;
          animation: none !important;
          transform: none !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 创建背景控制层
    function createBackgroundLayer() {
      try {
        // 确保body元素存在
        if (!document.body) {
          console.log('[PageStabilizer] 等待body元素...');
          // 如果body不存在，则延迟创建
          setTimeout(createBackgroundLayer, 10);
          return null;
        }
        
        // 检查是否已经存在背景层
        if (document.getElementById('page-stabilizer-bg')) {
          return document.getElementById('page-stabilizer-bg');
        }
        
        bgLayer = document.createElement('div');
        bgLayer.id = 'page-stabilizer-bg';
        document.body.appendChild(bgLayer);
        console.log('[PageStabilizer] 背景层创建成功');
        return bgLayer;
      } catch (e) {
        console.error('[PageStabilizer] 创建背景层失败:', e);
        return null;
      }
    }
    
    // 创建overlay元素 - 但实际上不会显示
    function createOverlay() {
      try {
        // 确保body元素存在
        if (!document.body) {
          return null;
        }
        
        var overlay = document.createElement('div');
        overlay.className = 'page-loading-overlay hidden';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        return overlay;
      } catch (e) {
        console.error('[PageStabilizer] 创建overlay失败:', e);
        return null;
      }
    }
    
    // 预处理页面，在DOM可操作但资源尚未完全加载时执行
    function preparePageBeforeLoad() {
      try {
        if (readyStateInteractive) return;
        readyStateInteractive = true;
        
        // 标记页面处于过渡状态
        pageTransitioning = true;
        
        // 备份body样式
        if (document.body) {
          bodyStyleBackup = {
            overflow: document.body.style.overflow,
            visibility: document.body.style.visibility
          };
        }
        
        // 添加js类到html，表示JavaScript已启用
        document.documentElement.classList.add('js');
      } catch (e) {
        console.error('[PageStabilizer] 预处理页面失败:', e);
      }
    }
    
    // 页面完全加载后的处理
    function finalizePageAfterLoad() {
      try {
        // 防止重复执行
        if (!pageTransitioning) return;
        
        // 标记过渡完成
        pageTransitioning = false;
        
        // 触发页面过渡完成事件
        var transitionEndEvent = new CustomEvent('page-transition-end');
        document.dispatchEvent(transitionEndEvent);
        console.log('[PageStabilizer] 页面过渡完成');
      } catch (e) {
        console.error('[PageStabilizer] 完成页面加载处理失败:', e);
        
        // 恢复body样式
        if (bodyStyleBackup && document.body) {
          document.body.style.overflow = bodyStyleBackup.overflow;
          document.body.style.visibility = bodyStyleBackup.visibility;
        }
      }
    }
    
    // 初始化
    function init() {
      try {
        // 创建样式
        createStyleElement();
        
        // DOM内容加载后再创建背景控制层
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            createBackgroundLayer();
          });
        } else {
          createBackgroundLayer();
        }
        
        // 页面状态变化监听
        document.addEventListener('readystatechange', function() {
          if (document.readyState === 'interactive') {
            preparePageBeforeLoad();
          }
          
          if (document.readyState === 'complete') {
            // 立即处理DOM，不延迟
            finalizePageAfterLoad();
          }
        });
        
        // 如果页面已加载，直接执行
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          preparePageBeforeLoad();
          
          if (document.readyState === 'complete') {
            finalizePageAfterLoad();
          }
        }
        
        // 确保背景层存在
        window.addEventListener('load', function() {
          if (!bgLayer) {
            createBackgroundLayer();
          }
        });
      } catch (e) {
        console.error('[PageStabilizer] 初始化失败:', e);
      }
    }
    
    // 安全地初始化页面稳定器
    function safeInitialize() {
      try {
        // 首先尝试创建样式元素，这不依赖于body
        createStyleElement();
        
        // 检查DOM是否已准备好
        if (document.readyState === 'loading') {
          // 如果DOM还在加载，等待DOMContentLoaded事件
          document.addEventListener('DOMContentLoaded', function() {
            console.log('[PageStabilizer] DOM已加载，开始初始化');
            init();
          });
        } else {
          // DOM已经准备好，直接初始化
          console.log('[PageStabilizer] DOM已就绪，立即初始化');
          init();
        }
      } catch (e) {
        console.error('[PageStabilizer] 安全初始化失败:', e);
      }
    }
    
    // 导出全局函数
    window.pageStabilizer = {
      isTransitioning: function() {
        return pageTransitioning;
      },
      enableAnimations: function() {
        // 添加animation-ready类
        if (document.documentElement && !document.documentElement.classList.contains('animation-ready')) {
          document.documentElement.classList.add('animation-ready');
          console.log('[PageStabilizer] 启用动画效果');
        }
      },
      disableAnimations: function() {
        // 移除animation-ready类
        if (document.documentElement) {
          document.documentElement.classList.remove('animation-ready');
          console.log('[PageStabilizer] 禁用动画效果');
        }
      },
      // 手动初始化或重新初始化
      initialize: function() {
        try {
          console.log('[PageStabilizer] 手动初始化');
          // 如果背景层不存在，创建它
          if (!bgLayer) {
            bgLayer = createBackgroundLayer();
          }
          
          // 重置状态
          pageTransitioning = false;
          readyStateInteractive = false;
          
          return true;
        } catch (e) {
          console.error('[PageStabilizer] 手动初始化失败:', e);
          return false;
        }
      }
    };
    
    // 开始安全初始化
    safeInitialize();
  } catch (error) {
    console.error('[PageStabilizer] 初始化错误:', error);
  }
})(); 