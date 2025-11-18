// ===== 手机端导航交互（Butterfly风格） =====

(function() {
  'use strict';
  
  // 初始化手机端导航
  function initMobileNavigation() {
    // 检查是否是手机端
    if (window.innerWidth > 768) return;
    
    // 创建或获取汉堡菜单按钮
    let navButton = document.querySelector('.mobile-nav-button');
    if (!navButton) {
      navButton = document.createElement('button');
      navButton.className = 'mobile-nav-button';
      navButton.innerHTML = '<span></span><span></span><span></span>';
      navButton.setAttribute('aria-label', '菜单');
      
      // 插入到header中
      const header = document.querySelector('.site-header');
      if (header) {
        header.appendChild(navButton);
      }
    }
    
    // 创建或获取遮罩层
    let overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-nav-overlay';
      document.body.appendChild(overlay);
    }
    
    // 获取导航菜单
    const navMain = document.querySelector('.site-nav-main');
    if (!navMain) return;
    
    // 确保初始状态是关闭的
    navMain.classList.remove('mobile-nav-open', 'mobile-open');
    navButton.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // 汉堡按钮点击事件
    navButton.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNav();
    });
    
    // 遮罩层点击事件
    overlay.addEventListener('click', closeNav);
    
    // 切换导航
    function toggleNav() {
      navButton.classList.toggle('active');
      navMain.classList.toggle('mobile-nav-open');
      overlay.classList.toggle('active');
      
      if (navMain.classList.contains('mobile-nav-open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    // 关闭导航
    function closeNav() {
      navButton.classList.remove('active');
      navMain.classList.remove('mobile-nav-open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // 处理二级菜单点击展开
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    
    dropdownItems.forEach(item => {
      const link = item.querySelector('.nav-link-main');
      
      if (link) {
        // 移除原有的点击事件（克隆节点）
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // 添加新的点击事件
        newLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 关闭其他展开的菜单
          dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('mobile-open');
            }
          });
          
          // 切换当前菜单
          item.classList.toggle('mobile-open');
        });
      }
    });
    
    // 点击导航链接后关闭菜单
    const navLinks = navMain.querySelectorAll('.nav-link-main, .nav-dropdown-link');
    navLinks.forEach(link => {
      // 如果不是有子菜单的链接
      if (!link.closest('.nav-item-dropdown') || link.classList.contains('nav-dropdown-link')) {
        link.addEventListener('click', function() {
          // 延迟关闭，让动画更流畅
          setTimeout(closeNav, 200);
        });
      }
    });
  }
  
  // 清理手机端功能
  function cleanupMobile() {
    // 移除汉堡按钮
    const navButton = document.querySelector('.mobile-nav-button');
    if (navButton) {
      navButton.remove();
    }
    
    // 移除遮罩层
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    // 恢复body滚动
    document.body.style.overflow = '';
    
    // 移除mobile-open和mobile-nav-open类
    const openItems = document.querySelectorAll('.mobile-open, .mobile-nav-open');
    openItems.forEach(item => {
      item.classList.remove('mobile-open', 'mobile-nav-open');
    });
    
    // 移除active类
    const activeItems = document.querySelectorAll('.mobile-nav-button.active, .mobile-nav-overlay.active');
    activeItems.forEach(item => item.classList.remove('active'));
  }
  
  // 初始化导航栏滚动隐藏/显示
  function initHeaderScrollBehavior() {
    // 检查是否是手机端
    if (window.innerWidth > 768) return;
    
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 10; // 滚动阈值
    let isScrolling = false;
    
    function handleScroll() {
      if (isScrolling) return;
      
      isScrolling = true;
      requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // 滚动状态类
        if (currentScroll > 50) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
        
        // 在顶部时总是显示
        if (currentScroll <= 100) {
          document.body.classList.add('at-top');
          header.classList.remove('header-hidden');
          header.classList.add('header-visible');
        } else {
          document.body.classList.remove('at-top');
          
          // 向下滚动超过阈值时隐藏
          if (currentScroll > lastScrollTop + scrollThreshold) {
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
          }
          // 向上滚动超过阈值时显示
          else if (currentScroll < lastScrollTop - scrollThreshold) {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
          }
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        isScrolling = false;
      });
    }
    
    // 防抖处理
    let scrollTimer;
    window.addEventListener('scroll', function() {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(handleScroll, 10);
    }, { passive: true });
    
    // 初始状态
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll <= 100) {
      document.body.classList.add('at-top');
    }
    if (currentScroll > 50) {
      header.classList.add('header-scrolled');
    }
  }
  
  // 初始化文章页右侧栏按钮
  function initMobileToc() {
    // 检查是否是手机端
    if (window.innerWidth > 768) return;
    
    // 首页不显示侧栏按钮（首页的侧栏正常显示在底部）
    // 使用URL检测，更可靠
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || 
                       currentPath === '/index.html' ||
                       currentPath.startsWith('/page/');
    
    if (isHomePage) return;
    
    // 检查是否有右侧栏
    const asideRight = document.querySelector('.site-aside-right');
    if (!asideRight) return;
    
    // 检查右侧栏是否有内容（任何组件）
    const hasContent = asideRight.querySelector('.aside-card, .toc-content, .toc-widget, .aside-title');
    if (!hasContent) return;
    
    // 创建或获取右侧栏按钮
    let sidebarButton = document.querySelector('.mobile-toc-button');
    if (!sidebarButton) {
      sidebarButton = document.createElement('button');
      sidebarButton.className = 'mobile-toc-button floating-btn';
      // 使用 SVG 图标，与其他悬浮按钮保持一致
      sidebarButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>';
      sidebarButton.setAttribute('aria-label', '目录');
      
      // 添加到浮动按钮组容器中
      const floatingButtons = document.querySelector('.floating-buttons');
      if (floatingButtons) {
        floatingButtons.appendChild(sidebarButton);
      } else {
        // 如果没有浮动按钮组，直接添加到body
        document.body.appendChild(sidebarButton);
      }
    }
    
    // 获取弹出模式配置
    const popupMode = (window.siteConfig && window.siteConfig.mobileTocPopupMode) || 'sidebar';
    
    // 创建或获取遮罩层
    let tocOverlay = document.querySelector('.mobile-toc-overlay');
    if (!tocOverlay) {
      tocOverlay = document.createElement('div');
      tocOverlay.className = 'mobile-toc-overlay';
      document.body.appendChild(tocOverlay);
    }
    
    // 仅目录模式：创建独立的目录弹窗容器（与右侧栏相同的样式和弹出方式）
    let tocOnlyContainer = null;
    if (popupMode === 'toc-only') {
      tocOnlyContainer = document.querySelector('.mobile-toc-only-container');
      if (!tocOnlyContainer) {
        tocOnlyContainer = document.createElement('div');
        tocOnlyContainer.className = 'mobile-toc-only-container';
        document.body.appendChild(tocOnlyContainer);
      }
      
      // 无论容器是新创建还是已存在，都要更新内容（PJAX切换后内容可能已改变）
      // 清空容器内容
      tocOnlyContainer.innerHTML = '';
      
      // 从右侧栏中提取目录内容
      const tocCard = asideRight.querySelector('.toc-card, .toc-widget, [class*="toc"]');
      if (tocCard) {
        const tocClone = tocCard.cloneNode(true);
        // 添加关闭按钮到目录容器顶部（与右侧栏关闭按钮位置一致）
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-toc-only-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', '关闭');
        tocOnlyContainer.appendChild(closeBtn);
        tocOnlyContainer.appendChild(tocClone);
      }
    } else {
      // 侧边栏模式：创建或获取关闭按钮
      let closeButton = asideRight.querySelector('.mobile-toc-close');
      if (!closeButton) {
        closeButton = document.createElement('button');
        closeButton.className = 'mobile-toc-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.setAttribute('aria-label', '关闭');
        asideRight.insertBefore(closeButton, asideRight.firstChild);
      }
    }
    
    // 移除旧的事件监听器（通过克隆元素）
    const newSidebarButton = sidebarButton.cloneNode(true);
    sidebarButton.parentNode.replaceChild(newSidebarButton, sidebarButton);
    sidebarButton = newSidebarButton;
    
    const newTocOverlay = tocOverlay.cloneNode(true);
    tocOverlay.parentNode.replaceChild(newTocOverlay, tocOverlay);
    tocOverlay = newTocOverlay;
    
    // 关闭函数
    function closePopup() {
      // 重新获取当前模式（可能在PJAX切换后配置已改变）
      const currentPopupMode = (window.siteConfig && window.siteConfig.mobileTocPopupMode) || 'sidebar';
      
      if (currentPopupMode === 'toc-only') {
        // 仅目录模式：关闭目录容器（重新获取引用以确保准确性）
        const container = document.querySelector('.mobile-toc-only-container');
        if (container) {
          container.classList.remove('mobile-toc-only-open');
        }
      } else {
        // 侧边栏模式：关闭整个右侧栏
        const aside = document.querySelector('.site-aside-right');
        if (aside) aside.classList.remove('mobile-toc-open');
      }
      const overlay = document.querySelector('.mobile-toc-overlay');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // 绑定事件监听器
    // 目录按钮点击事件 - 切换开关
    sidebarButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // 重新获取当前模式（可能在PJAX切换后配置已改变）
      const currentPopupMode = (window.siteConfig && window.siteConfig.mobileTocPopupMode) || 'sidebar';
      
      if (currentPopupMode === 'toc-only') {
        // 仅目录模式：重新获取容器引用（确保在PJAX切换后也能正常工作）
        let container = document.querySelector('.mobile-toc-only-container');
        if (!container) {
          // 如果容器不存在，重新创建
          container = document.createElement('div');
          container.className = 'mobile-toc-only-container';
          document.body.appendChild(container);
        }
        
        // 无论容器是新创建还是已存在，都要更新内容（PJAX切换后内容可能已改变）
        // 清空容器内容
        container.innerHTML = '';
        
        // 从右侧栏中提取目录内容
        const currentAsideRight = document.querySelector('.site-aside-right');
        if (currentAsideRight) {
          const tocCard = currentAsideRight.querySelector('.toc-card, .toc-widget, [class*="toc"]');
          if (tocCard) {
            const tocClone = tocCard.cloneNode(true);
            // 添加关闭按钮到目录容器顶部
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-toc-only-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.setAttribute('aria-label', '关闭');
            container.appendChild(closeBtn);
            container.appendChild(tocClone);
            
            // 绑定关闭按钮事件
            closeBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              closePopup();
            });
            
            // 点击目录链接后自动关闭
            const tocLinks = container.querySelectorAll('.toc-content a, .toc-widget a');
            tocLinks.forEach(link => {
              link.addEventListener('click', function(e) {
                setTimeout(closePopup, 300);
              });
            });
          }
        }
        
        const isOpen = container && container.classList.contains('mobile-toc-only-open');
        if (isOpen) {
          closePopup();
        } else {
          if (container) {
            container.classList.add('mobile-toc-only-open');
          }
          const overlay = document.querySelector('.mobile-toc-overlay');
          if (overlay) overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      } else {
        // 侧边栏模式
        const aside = document.querySelector('.site-aside-right');
        const isOpen = aside && aside.classList.contains('mobile-toc-open');
        if (isOpen) {
          closePopup();
        } else {
          if (aside) aside.classList.add('mobile-toc-open');
          const overlay = document.querySelector('.mobile-toc-overlay');
          if (overlay) overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
    
    // 遮罩层点击事件
    tocOverlay.addEventListener('click', function(e) {
      closePopup();
    });
    
    // 关闭按钮点击事件（使用事件委托，确保在动态创建的元素上也能工作）
    if (popupMode === 'toc-only') {
      // 仅目录模式：绑定目录容器的关闭按钮
      if (tocOnlyContainer) {
        const tocOnlyCloseBtn = tocOnlyContainer.querySelector('.mobile-toc-only-close');
        if (tocOnlyCloseBtn) {
          // 移除旧的事件监听器（通过克隆）
          const newCloseBtn = tocOnlyCloseBtn.cloneNode(true);
          tocOnlyCloseBtn.parentNode.replaceChild(newCloseBtn, tocOnlyCloseBtn);
          newCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
          });
        }
        
        // 点击目录链接后自动关闭
        const tocOnlyLinks = tocOnlyContainer.querySelectorAll('.toc-content a, .toc-widget a');
        tocOnlyLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            setTimeout(closePopup, 300);
          });
        });
        
        // 阻止目录容器点击事件冒泡
        tocOnlyContainer.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    } else {
      // 侧边栏模式：绑定右侧栏的关闭按钮
      const closeButton = asideRight.querySelector('.mobile-toc-close');
      if (closeButton) {
        // 移除旧的事件监听器（通过克隆）
        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);
        newCloseButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          closePopup();
        });
      }
      
      // 阻止右侧栏点击事件冒泡
      asideRight.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      // 点击目录链接后自动关闭
      const tocLinks = asideRight.querySelectorAll('.toc-content a, .toc-widget a');
      tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          setTimeout(closePopup, 300);
        });
      });
    }
  }
  
  // 清理目录功能
  function cleanupMobileToc() {
    const tocButton = document.querySelector('.mobile-toc-button');
    if (tocButton) {
      tocButton.remove();
    }
    
    const tocOverlay = document.querySelector('.mobile-toc-overlay');
    if (tocOverlay) {
      tocOverlay.remove();
    }
    
    const closeButton = document.querySelector('.mobile-toc-close');
    if (closeButton) {
      closeButton.remove();
    }
    
    const tocOnlyContainer = document.querySelector('.mobile-toc-only-container');
    if (tocOnlyContainer) {
      tocOnlyContainer.remove();
    }
    
    const asideRight = document.querySelector('.site-aside-right');
    if (asideRight) {
      asideRight.classList.remove('mobile-toc-open');
    }
  }
  
  // 清理滚动行为
  function cleanupHeaderScrollBehavior() {
    document.body.classList.remove('at-top');
    const header = document.querySelector('.site-header');
    if (header) {
      header.classList.remove('header-hidden', 'header-visible', 'header-scrolled');
    }
  }
  
  // 响应窗口大小变化
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768) {
        // 桌面端，清理手机端功能
        cleanupMobile();
        cleanupHeaderScrollBehavior();
        cleanupMobileToc();
      } else {
        // 手机端，重新初始化
        cleanupMobile();
        cleanupHeaderScrollBehavior();
        cleanupMobileToc();
        initMobileNavigation();
        initHeaderScrollBehavior();
        initMobileToc();
      }
    }, 250);
  });
  
  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initMobileNavigation();
      initHeaderScrollBehavior();
      initMobileToc();
    });
  } else {
    initMobileNavigation();
    initHeaderScrollBehavior();
    initMobileToc();
  }
  
  // 导出到全局供PJAX使用
  window.initMobileNavigation = initMobileNavigation;
  window.cleanupMobile = cleanupMobile;
  window.initHeaderScrollBehavior = initHeaderScrollBehavior;
  window.cleanupHeaderScrollBehavior = cleanupHeaderScrollBehavior;
  window.initMobileToc = initMobileToc;
  window.cleanupMobileToc = cleanupMobileToc;
  
})();

