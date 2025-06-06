/**
 * 泽鑫网站懒加载和性能优化脚本
 * 参考Sandvik实现，针对性能优化
 */
(function() {
  'use strict';
  
  // 确保只执行一次
  if (window._zexinLazyLoadInit) return;
  window._zexinLazyLoadInit = true;
  
  // 配置项
  const config = {
    imgSelector: 'img[data-src]',
    videoSelector: 'video[data-src]',
    iframeSelector: 'iframe[data-src]',
    rootMargin: '200px 0px',
    threshold: 0.01
  };
  
  /**
   * 图片懒加载实现
   */
  function initLazyLoad() {
    // 检查是否支持IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      loadAllLazy(); // 降级方案
      return;
    }
    
    // 创建观察者
    const observer = new IntersectionObserver(onIntersection, {
      rootMargin: config.rootMargin,
      threshold: config.threshold
    });
    
    // 观察所有懒加载元素
    const lazyElements = document.querySelectorAll(
      `${config.imgSelector}, ${config.videoSelector}, ${config.iframeSelector}`
    );
    
    lazyElements.forEach(el => observer.observe(el));
    
    // 元素进入视口时加载
    function onIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          loadLazyElement(el);
          observer.unobserve(el);
        }
      });
    }
  }
  
  /**
   * 加载单个懒加载元素
   */
  function loadLazyElement(el) {
    const src = el.getAttribute('data-src');
    if (!src) return;
    
    if (el.tagName.toLowerCase() === 'img') {
      // 图片特殊处理
      const img = new Image();
      img.onload = function() {
        el.src = src;
        el.removeAttribute('data-src');
        el.classList.add('zx-loaded');
      };
      img.src = src;
    } else {
      // 视频和iframe
      el.src = src;
      el.removeAttribute('data-src');
      el.classList.add('zx-loaded');
    }
  }
  
  /**
   * 降级：直接加载所有懒加载元素
   */
  function loadAllLazy() {
    const lazyElements = document.querySelectorAll(
      `${config.imgSelector}, ${config.videoSelector}, ${config.iframeSelector}`
    );
    
    lazyElements.forEach(loadLazyElement);
  }
  
  /**
   * 预加载关键资源
   */
  function preloadCriticalAssets() {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 创建链接预加载
    function createPreloadLink(href, as) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
    
    // 预加载字体
    const fontsToPreload = [
      '/fonts/zexinSansText-Regular.woff2',
      '/fonts/ZexinSansDisplay-Medium.woff2'
    ];
    
    fontsToPreload.forEach(font => {
      createPreloadLink(font, 'font');
    });
    
    // 预加载下一个可能页面的关键资源
    // 获取所有导航链接
    const navLinks = Array.from(document.querySelectorAll('header a'))
      .filter(link => {
        const href = link.getAttribute('href');
        // 只预加载当前站点的链接
        return href && href.startsWith('/') && !href.includes('#');
      })
      .map(link => link.getAttribute('href'));
    
    // 选择最多3个链接进行预加载
    const linksToPreload = navLinks.slice(0, isMobile ? 1 : 3);
    
    // 延迟预加载
    if (linksToPreload.length > 0) {
      setTimeout(() => {
        linksToPreload.forEach(href => {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        });
      }, 3000); // 3秒后开始预加载
    }
  }
  
  /**
   * 添加滚动性能优化
   */
  function optimizeScrollPerformance() {
    let ticking = false;
    let lastScrollY = window.scrollY;
    const scrollThreshold = 50; // 滚动阈值
    
    // 处理滚动事件
    function onScroll() {
      const currentScrollY = window.scrollY;
      
      // 只在滚动超过阈值时处理
      if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) {
        return;
      }
      
      lastScrollY = currentScrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollEffects(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    }
    
    // 处理滚动效果
    function handleScrollEffects(scrollY) {
      // 向下滚动时隐藏header，向上滚动时显示
      const header = document.querySelector('[data-header]');
      if (header) {
        if (scrollY > 200) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }
      
      // 处理渐入效果
      const fadeElements = document.querySelectorAll('[data-fade-in]:not(.visible)');
      fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          el.classList.add('visible');
        }
      });
    }
    
    // 添加滚动事件
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // 初始检查
    setTimeout(() => {
      handleScrollEffects(window.scrollY);
    }, 100);
  }
  
  /**
   * 等待DOM加载完成后初始化
   */
  function init() {
    initLazyLoad();
    
    // 当页面所有资源加载完成后，执行非关键操作
    if (document.readyState === 'complete') {
      preloadCriticalAssets();
      optimizeScrollPerformance();
    } else {
      window.addEventListener('load', () => {
        preloadCriticalAssets();
        optimizeScrollPerformance();
      });
    }
  }
  
  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 