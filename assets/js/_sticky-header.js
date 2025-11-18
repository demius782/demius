/**
 * 导航栏固定功能
 * 页面下滑时将导航栏固定在顶部
 */

function initStickyHeader() {
  // 检查是否启用了sticky header功能
  if (!window.siteConfig || !window.siteConfig.stickyHeader) {
    return;
  }
  
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  let headerHeight = header.offsetHeight;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 检查是否在Mode2模式下且大图还在显示
    const isMode2Active = document.querySelector('.home-big-image-mode2.active') || 
                          document.body.classList.contains('home-big-image-active');
    
    // 如果Mode2大图激活，不固定导航栏
    if (isMode2Active) {
      if (header.classList.contains('sticky')) {
        header.classList.remove('sticky');
        document.body.classList.remove('header-fixed');
      }
      return;
    }
    
    // 向下滚动超过导航栏高度时，固定导航栏
    if (scrollTop > headerHeight) {
      if (!header.classList.contains('sticky')) {
        header.classList.add('sticky');
        document.body.classList.add('header-fixed');
      }
    } else {
      // 滚动到顶部时，取消固定
      if (header.classList.contains('sticky')) {
        header.classList.remove('sticky');
        document.body.classList.remove('header-fixed');
      }
    }
    
    lastScrollTop = scrollTop;
  }
  
  // 使用requestAnimationFrame优化性能
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  // 监听滚动事件
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // 清理函数
  window.cleanupStickyHeader = function() {
    window.removeEventListener('scroll', onScroll);
    header.classList.remove('sticky');
    document.body.classList.remove('header-fixed');
  };
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStickyHeader);
} else {
  initStickyHeader();
}

// 暴露到全局作用域，供 pjax 调用
window.initStickyHeader = initStickyHeader;

