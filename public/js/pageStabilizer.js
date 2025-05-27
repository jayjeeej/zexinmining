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
    var initialScrollY = 0;
    var initialPageHeight = 0;
    var pageTransitioning = false;
    var readyStateInteractive = false;
    var bodyStyleBackup = null;
    
    // 创建全局样式元素
    function createStyleElement() {
      var style = document.createElement('style');
      style.id = 'page-stabilizer-style';
      style.innerHTML = `
        body.page-transitioning * {
          transition: none !important;
          animation: none !important;
        }
        body.page-stabilizing {
          min-height: var(--min-page-height, 100vh);
          overflow: hidden !important;
          pointer-events: none;
          visibility: visible;
          opacity: 0;
        }
        body.page-stabilized {
          opacity: 1;
          transition: opacity 0.3s ease-out;
          min-height: var(--min-page-height, auto);
        }
        .page-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #fff;
          z-index: 9999;
          opacity: 1;
          pointer-events: none;
          transition: opacity 0.3s ease-out;
        }
        .page-loading-overlay.hidden {
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          body.page-stabilized {
            transition: none;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // 创建overlay元素
    function createOverlay() {
      var overlay = document.createElement('div');
      overlay.className = 'page-loading-overlay';
      document.body.appendChild(overlay);
      return overlay;
    }
    
    // 保存页面状态
    function savePageState() {
      if (pageTransitioning) return;
      
      try {
        // 获取主要内容区域
        var contentArea = document.querySelector('main') || document.body;
        var contentHeight = contentArea.offsetHeight;
        var scrollY = window.scrollY;
        
        // 保存到sessionStorage
        sessionStorage.setItem('pageScrollY', scrollY.toString());
        sessionStorage.setItem('pageHeight', contentHeight.toString());
        sessionStorage.setItem('pageTime', Date.now().toString());
        sessionStorage.setItem('pagePath', window.location.pathname);
      } catch (e) {
        // 出错时静默处理
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
        bodyStyleBackup = {
          minHeight: document.body.style.minHeight,
          overflow: document.body.style.overflow,
          opacity: document.body.style.opacity,
          visibility: document.body.style.visibility
        };
        
        // 添加过渡状态类
        document.body.classList.add('page-transitioning', 'page-stabilizing');
        
        // 获取保存的状态
        var savedHeight = sessionStorage.getItem('pageHeight');
        var savedScrollY = sessionStorage.getItem('pageScrollY');
        var savedTime = sessionStorage.getItem('pageTime');
        var savedPath = sessionStorage.getItem('pagePath');
        var currentPath = window.location.pathname;
        
        // 如果是同一页面且时间间隔短（30秒内），应用保存的状态
        var isRecentPage = savedTime && (Date.now() - parseInt(savedTime)) < 30000;
        var isSamePage = savedPath === currentPath;
        
        if (savedHeight && (isSamePage || isRecentPage)) {
          // 设置最小高度，防止布局跳动
          document.documentElement.style.setProperty('--min-page-height', savedHeight + 'px');
        }
        
        // 恢复滚动位置
        if (savedScrollY && (isSamePage || isRecentPage)) {
          initialScrollY = parseInt(savedScrollY);
        }
      } catch (e) {
        // 出错时静默处理
      }
    }
    
    // 页面完全加载后的处理
    function finalizePageAfterLoad() {
      try {
        // 防止重复执行
        if (!pageTransitioning) return;
        
        // 创建overlay
        var overlay = document.querySelector('.page-loading-overlay') || createOverlay();
        
        // 删除过渡状态类，添加稳定类
        document.body.classList.remove('page-transitioning', 'page-stabilizing');
        document.body.classList.add('page-stabilized');
        
        // 设置滚动位置
        if (initialScrollY > 0) {
          window.scrollTo(0, initialScrollY);
        }
        
        // 标记过渡完成
        pageTransitioning = false;
        
        // 延迟隐藏overlay
        setTimeout(function() {
          overlay.classList.add('hidden');
          
          // 清除overlay
          setTimeout(function() {
            if (overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
          }, 500);
        }, 100);
      } catch (e) {
        // 出错时静默处理
        
        // 恢复body样式
        if (bodyStyleBackup) {
          document.body.style.minHeight = bodyStyleBackup.minHeight;
          document.body.style.overflow = bodyStyleBackup.overflow;
          document.body.style.opacity = bodyStyleBackup.opacity;
          document.body.style.visibility = bodyStyleBackup.visibility;
        }
        
        // 移除所有类
        document.body.classList.remove('page-transitioning', 'page-stabilizing', 'page-stabilized');
      }
    }
    
    // 初始化
    function init() {
      // 创建样式
      createStyleElement();
      
      // 页面状态变化监听
      document.addEventListener('readystatechange', function() {
        if (document.readyState === 'interactive') {
          preparePageBeforeLoad();
        }
        
        if (document.readyState === 'complete') {
          // 等待所有资源加载完成，再处理DOM
          setTimeout(finalizePageAfterLoad, 50);
        }
      });
      
      // 如果页面已加载，直接执行
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        preparePageBeforeLoad();
        
        if (document.readyState === 'complete') {
          setTimeout(finalizePageAfterLoad, 50);
        }
      }
      
      // 页面退出前保存状态
      window.addEventListener('beforeunload', savePageState);
      
      // 定期保存状态（每2秒）
      setInterval(savePageState, 2000);
      
      // 滚动时保存状态
      window.addEventListener('scroll', function() {
        if (!pageTransitioning) {
          sessionStorage.setItem('pageScrollY', window.scrollY.toString());
        }
      }, { passive: true });
      
      // 窗口大小变化时保存页面高度
      window.addEventListener('resize', function() {
        if (!pageTransitioning) {
          var contentArea = document.querySelector('main') || document.body;
          sessionStorage.setItem('pageHeight', contentArea.offsetHeight.toString());
        }
      }, { passive: true });
    }
    
    // 执行初始化
    init();
    
    // 为单页应用添加路由事件监听
    function handleSPANavigation() {
      // 针对常见的SPA框架添加路由变化监听
      
      // Next.js Router事件
      if (typeof window.next !== 'undefined' && window.next.router) {
        var router = window.next.router;
        
        // 路由开始变化前
        router.events.on('routeChangeStart', function() {
          savePageState();
        });
        
        // 路由变化完成后
        router.events.on('routeChangeComplete', function() {
          preparePageBeforeLoad();
          setTimeout(finalizePageAfterLoad, 50);
        });
      }
      
      // 监听popstate事件（浏览器前进后退）
      window.addEventListener('popstate', function() {
        savePageState();
        setTimeout(function() {
          preparePageBeforeLoad();
          setTimeout(finalizePageAfterLoad, 50);
        }, 0);
      });
      
      // 通用URL变化监听（使用MutationObserver）
      var lastURL = window.location.href;
      setInterval(function() {
        var currentURL = window.location.href;
        if (currentURL !== lastURL) {
          lastURL = currentURL;
          savePageState();
          preparePageBeforeLoad();
          setTimeout(finalizePageAfterLoad, 50);
        }
      }, 100);
    }
    
    // 为SPA添加导航事件监听
    if (typeof window !== 'undefined') {
      setTimeout(handleSPANavigation, 1000); // 延迟执行，确保框架已初始化
    }
  } catch (err) {
    console.error('PageStabilizer initialization error:', err);
  }
})(); 