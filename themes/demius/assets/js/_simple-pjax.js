/**
 * 简单稳定的PJAX实现
 * 不破坏原有功能，只在启用时提供无刷新切换
 */
(function() {
  'use strict';
  
  // 检查是否启用PJAX
  if (window.siteConfig?.pjaxEnabled !== 'true') {
    return;
  }
  
  
  
  let isLoading = false;
  const loadingClass = 'pjax-loading';
  
  // 创建简单的加载指示器
  function createLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'simple-pjax-loader';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #4fc3f7, #29b6f6, #03a9f4);
      z-index: 9999;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    `;
    document.body.appendChild(indicator);
  }
  
  // 显示加载指示器
  function showLoading() {
    if (isLoading) return;
    isLoading = true;
    const loader = document.getElementById('simple-pjax-loader');
    if (loader) {
      loader.style.transform = 'translateX(0)';
    }
    // 添加页面过渡效果
    document.body.classList.add(loadingClass);
  }
  
  // 隐藏加载指示器
  function hideLoading() {
    isLoading = false;
    const loader = document.getElementById('simple-pjax-loader');
    if (loader) {
      loader.style.transform = 'translateX(-100%)';
    }
    // 移除页面过渡效果
    setTimeout(() => {
      document.body.classList.remove(loadingClass);
    }, 100);
  }
  
  // 检查链接是否应该被拦截
  function shouldIntercept(link) {
    // 不拦截的情况
    if (link.target === '_blank') return false;
    if (link.download) return false;
    if (link.classList.contains('no-pjax')) return false;
    if (link.href.includes('#')) return false;
    
    // 检查是否为同域链接
    try {
      const url = new URL(link.href);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }
  
  // 加载页面内容（优化版 - 瞬间切换，无动画闪烁）
  async function loadPage(url) {
    if (isLoading) return;
    
    // 立即显示加载指示器
    showLoading();
    
    // 添加超时控制（10秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      // 开始加载新页面（不等待，不添加淡出动画）
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // 更新页面标题
      document.title = doc.title;
      
      // 瞬间更新主内容区域（无动画）
      const mainContent = document.querySelector('.site-main');
      const newMainContent = doc.querySelector('.site-main');
      
      if (mainContent && newMainContent) {
        // 直接替换内容，不添加任何动画类
        mainContent.innerHTML = newMainContent.innerHTML;
      }
      
      // 更新右侧侧边栏（包含目录组件）
      const rightSidebar = document.querySelector('.site-aside-right');
      const newRightSidebar = doc.querySelector('.site-aside-right');
      
      if (rightSidebar && newRightSidebar) {
        rightSidebar.innerHTML = newRightSidebar.innerHTML;
      }
      
      // 更新URL
      history.pushState({ pjax: true }, '', url);
      
      // 瞬间滚动到顶部
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // 重新初始化页面功能
      reinitializePage();
      
      // 触发页面加载完成事件
      document.dispatchEvent(new CustomEvent('pjax:complete', {
        detail: { url: url }
      }));
      
    } catch (error) {
      window.location.href = url;
    } finally {
      hideLoading();
    }
  }
  
  // 绑定事件
  function bindEvents() {
    // 拦截链接点击
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      
      if (shouldIntercept(link)) {
        e.preventDefault();
        loadPage(link.href);
      }
    });
    
    // 处理浏览器前进后退
    window.addEventListener('popstate', function(e) {
      if (e.state && e.state.pjax) {
        loadPage(window.location.href);
      }
    });
  }
  
  // 存储Artalk实例
  let artalkInstance = null;
  
  // 初始化评论系统（带重试机制）
  function initArtalkComment(retryCount = 0, maxRetries = 10) {
    const commentEl = document.getElementById('artalk-comment');
    
    // 如果没有评论容器，直接返回
    if (!commentEl) {
      return;
    }
    
    // 首次尝试时显示加载状态
    if (retryCount === 0) {
      commentEl.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> 正在加载评论系统...</p>';
    }
    
    // 检查Artalk是否已加载
    if (typeof Artalk === 'undefined') {
      if (retryCount < maxRetries) {
        // Artalk还未加载，等待100ms后重试
        setTimeout(() => {
          initArtalkComment(retryCount + 1, maxRetries);
        }, 100);
      } else {
        commentEl.innerHTML = '<p style="color: #f44336; text-align: center; padding: 20px;"><i class="fas fa-exclamation-triangle"></i> 评论系统加载超时，请刷新页面重试</p>';
      }
      return;
    }
    
    try {
      // 先销毁旧实例
      if (artalkInstance) {
        try {
          artalkInstance.destroy();
        } catch (e) {
          
        }
        artalkInstance = null;
      }
      
      // 清空评论容器
      commentEl.innerHTML = '';
      
      // 获取当前主题
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const isDarkMode = currentTheme === 'dark';
      
      // 重新初始化Artalk
      artalkInstance = Artalk.init({
        el: '#artalk-comment',
        pageKey: window.location.pathname,
        pageTitle: document.title,
        server: window.siteConfig?.artalkServer || 'https://site.demius.tech',
        site: window.siteConfig?.artalkSite || 'demius',
        placeholder: '说点什么吧~',
        darkMode: isDarkMode,
        locale: 'zh-CN',
        gravatar: { params: 'mp' },
        pagination: { pageSize: 10 },
        emoticons: true,
        heightLimit: 500
      });
      
      
    } catch (error) {
      console.error('PJAX: 评论系统初始化失败:', error);
      if (commentEl) {
        commentEl.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">评论系统暂时不可用，请稍后再试</p>';
      }
    }
  }
  
  // 重新初始化页面功能
  function reinitializePage() {
    // 更新body的class（PJAX不会自动更新body标签）
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || 
                       currentPath === '/index.html' ||
                       currentPath.startsWith('/page/');
    const isPostPage = currentPath.startsWith('/posts/');
    
    // 移除所有可能的body class
    document.body.classList.remove('home', 'single-post');
    
    // 添加正确的class
    if (isHomePage) {
      document.body.classList.add('home');
    } else if (isPostPage) {
      document.body.classList.add('single-post');
    }
    
    // 延迟初始化评论系统，确保DOM完全更新
    setTimeout(() => {
      initArtalkComment();
    }, 200);
    
    // 重新初始化其他功能
    if (window.initCodeBlocks) window.initCodeBlocks();
    if (window.initImageViewer) window.initImageViewer();
    if (window.initToc) window.initToc();
    if (window.initSearch) window.initSearch();
    if (window.initComments) window.initComments();
    if (window.initEncryption) window.initEncryption();
    
    // 清理并重新初始化相册功能
    if (window.cleanupGallery) {
      window.cleanupGallery();
    }
    if (window.initGallery) {
      window.initGallery();
    }
    
    // 重新初始化固定导航栏功能
    if (window.cleanupStickyHeader) {
      window.cleanupStickyHeader();
    }
    if (window.initStickyHeader) {
      window.initStickyHeader();
    }
    
    // 清理并重新初始化轮播图
    if (window.cleanupCarousel) {
      window.cleanupCarousel();
    }
    if (window.initCarousel) {
      window.initCarousel();
    }
    
    // 重新初始化系列文章轮播
    if (window.initSeriesPostsCarousel) {
      window.initSeriesPostsCarousel();
    }
    
    // 重新初始化打赏按钮
    if (window.initReward) {
      window.initReward();
    }
    
    // 重新初始化选项卡切换
    if (window.cleanupTabs) {
      window.cleanupTabs();
    }
    if (window.initTabs) {
      window.initTabs();
    }
    
    // 重新初始化内容折叠
    if (window.cleanupCollapse) {
      window.cleanupCollapse();
    }
    if (window.initCollapse) {
      window.initCollapse();
    }
    
    // 重新初始化时间线
    if (window.cleanupTimeline) {
      window.cleanupTimeline();
    }
    if (window.initTimeline) {
      window.initTimeline();
    }
    
    // 重新初始化音乐播放器
    if (window.cleanupMusicPlayers) {
      window.cleanupMusicPlayers();
    }
    if (window.initMusicPlayers) {
      window.initMusicPlayers();
    }
    
    // 重新初始化评论可见内容
    if (window.cleanupReplyVisible) {
      window.cleanupReplyVisible();
    }
    if (window.initReplyVisible) {
      window.initReplyVisible();
    }
    
    // 重新初始化运行时间显示
    if (window.cleanupRunningTime) {
      window.cleanupRunningTime();
    }
    if (window.initRunningTime) {
      window.initRunningTime();
    }
    
    // 重新初始化置顶文章样式
    if (window.initPinnedStyle) {
      window.initPinnedStyle();
    }
    
    // 重新设置侧栏宽度
    if (window.setAsideWidth) {
      window.setAsideWidth();
    }
    
    // 重新设置全站字体
    if (window.setFontFamily) {
      window.setFontFamily();
    }
    
    // 重新初始化说说页面
    if (window.renderTalks) {
      window.renderTalks();
    }
    
    // 重新初始化顶部公告栏
    if (window.initTopAnnouncement) {
      window.initTopAnnouncement();
    }
    
    // 重新初始化手机端功能
    if (window.cleanupMobile) {
      window.cleanupMobile();
    }
    if (window.cleanupHeaderScrollBehavior) {
      window.cleanupHeaderScrollBehavior();
    }
    if (window.cleanupMobileToc) {
      window.cleanupMobileToc();
    }
    if (window.initMobileNavigation) {
      window.initMobileNavigation();
    }
    if (window.initHeaderScrollBehavior) {
      window.initHeaderScrollBehavior();
    }
    // 延迟初始化侧栏按钮，确保DOM完全加载
    if (window.initMobileToc) {
      // 使用多次尝试机制，确保DOM完全渲染
      let tocInitAttempts = 0;
      const maxAttempts = 5;
      
      function tryInitMobileToc() {
        tocInitAttempts++;
        
        // 检查右侧栏是否存在且有内容
        const asideRight = document.querySelector('.site-aside-right');
        const hasContent = asideRight && asideRight.querySelector('.aside-card, .toc-content, .toc-widget, .aside-title');
        
        if (hasContent || tocInitAttempts >= maxAttempts) {
          // 右侧栏已渲染或已达最大尝试次数，执行初始化
          window.initMobileToc();
        } else {
          // 右侧栏还未渲染，100ms后重试
          setTimeout(tryInitMobileToc, 100);
        }
      }
      
      // 延迟150ms后开始首次尝试
      setTimeout(tryInitMobileToc, 150);
    }
    
    // 重新初始化数据页面功能
    if (window.initDataPage) {
      window.initDataPage();
    }
    
    // 重新初始化网友圈页面功能
    if (window.initFriendsCircle) {
      // 延迟一下确保DOM和配置元素完全更新
      setTimeout(() => {
        // 检查是否是网友圈页面，如果是则初始化
        if (document.querySelector('.friends-circle-page')) {
          window.initFriendsCircle();
        }
      }, 150);
    }
    
    // 重新初始化弹幕功能
    if (window.initDanmaku) {
      window.initDanmaku();
    }
    
    // 重新初始化主页大图功能
    // 使用之前定义的isHomePage变量
    
    if (isHomePage) {
      
      
      // 只有在首页第一页时才清除切换状态
      const isFirstPage = window.location.pathname === '/' || window.location.pathname === '/index.html';
      if (isFirstPage) {
        // 标记这是PJAX切换到首页
        sessionStorage.setItem('pjaxToHomePage', 'true');
        
        // 清除之前的切换状态，让大图重新显示
        sessionStorage.removeItem('homeBigImageSwitched');
      }
      
      // 清除打字机定时器
      if (window.cleanupTypewriter) {
        window.cleanupTypewriter();
      }
      // 重新初始化主页大图
      if (typeof initHomeBigImage === 'function') {
        initHomeBigImage();
      }
      // 重新初始化打字机效果（只在首页第一页）
      if (isFirstPage && window.initTypewriter) {
        window.initTypewriter();
      }
      
      // 清除PJAX标记
      setTimeout(() => {
        sessionStorage.removeItem('pjaxToHomePage');
      }, 100);
    }
  }

  // 初始化
  function init() {
    createLoadingIndicator();
    bindEvents();
  }
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
