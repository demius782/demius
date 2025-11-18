/* ===================================================================
   系列文章轮播功能
   =================================================================== */

function initSeriesPostsCarousel() {
  const widget = document.querySelector('.series-posts-widget');
  if (!widget) return;
  
  const enableCarousel = widget.getAttribute('data-carousel') === 'true';
  if (!enableCarousel) return;
  
  const interval = parseInt(widget.getAttribute('data-interval')) || 8000;
  const seriesItems = widget.querySelectorAll('.series-item');
  const indicators = widget.querySelectorAll('.series-indicator');
  const prevBtn = widget.querySelector('.series-prev');
  const nextBtn = widget.querySelector('.series-next');
  
  if (seriesItems.length <= 1) return;
  
  let currentIndex = 0;
  let autoplayTimer = null;
  let isPostDetailPage = false;
  
  // 检测是否为文章详情页，并找到当前文章所属的系列
  function detectCurrentSeries() {
    // 检查是否为文章详情页
    const postArticle = document.querySelector('article.post');
    if (!postArticle) return -1;
    
    // 获取当前页面 URL
    const currentUrl = window.location.pathname;
    
    // 遍历每个系列，检查当前文章是否在其中
    for (let i = 0; i < seriesItems.length; i++) {
      const seriesItem = seriesItems[i];
      const postLinks = seriesItem.querySelectorAll('.series-post-item');
      
      for (let link of postLinks) {
        const href = link.getAttribute('href');
        if (href && currentUrl.includes(href)) {
          return i; // 返回系列索引
        }
      }
    }
    
    return -1; // 未找到所属系列
  }
  
  // 检测当前系列
  const detectedSeriesIndex = detectCurrentSeries();
  if (detectedSeriesIndex !== -1) {
    // 如果当前页面是某个系列的文章，固定显示该系列并禁用轮播
    currentIndex = detectedSeriesIndex;
    isPostDetailPage = true;
  }
  
  // 切换到指定系列
  function showSeries(index) {
    // 确保索引在有效范围内
    if (index < 0) index = seriesItems.length - 1;
    if (index >= seriesItems.length) index = 0;
    
    // 移除所有active类
    seriesItems.forEach(item => item.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 添加active类到当前项
    seriesItems[index].classList.add('active');
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    currentIndex = index;
  }
  
  // 下一个系列
  function nextSeries() {
    showSeries(currentIndex + 1);
  }
  
  // 上一个系列
  function prevSeries() {
    showSeries(currentIndex - 1);
  }
  
  // 开始自动播放
  function startAutoplay() {
    // 如果是文章详情页，不启动自动播放
    if (isPostDetailPage) return;
    
    stopAutoplay();
    autoplayTimer = setInterval(nextSeries, interval);
  }
  
  // 停止自动播放
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }
  
  // 指示器点击事件（文章详情页不启用）
  if (!isPostDetailPage) {
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSeries(index);
        stopAutoplay();
        startAutoplay(); // 重启自动播放
      });
    });
  }
  
  // 上一个按钮（文章详情页不启用）
  if (prevBtn && !isPostDetailPage) {
    prevBtn.addEventListener('click', () => {
      prevSeries();
      stopAutoplay();
      startAutoplay(); // 重启自动播放
    });
  }
  
  // 下一个按钮（文章详情页不启用）
  if (nextBtn && !isPostDetailPage) {
    nextBtn.addEventListener('click', () => {
      nextSeries();
      stopAutoplay();
      startAutoplay(); // 重启自动播放
    });
  }
  
  // 鼠标悬停时暂停自动播放（仅在非文章详情页）
  if (!isPostDetailPage) {
    widget.addEventListener('mouseenter', stopAutoplay);
    widget.addEventListener('mouseleave', startAutoplay);
  }
  
  // 初始化显示当前系列
  showSeries(currentIndex);
  
  // 启动自动播放（文章详情页不启动）
  if (!isPostDetailPage) {
    startAutoplay();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSeriesPostsCarousel);
} else {
  initSeriesPostsCarousel();
}

// PJAX 支持
if (typeof window.initSeriesPostsCarousel === 'undefined') {
  window.initSeriesPostsCarousel = initSeriesPostsCarousel;
}

