/**
 * 轮播图功能
 * 支持左右/上下切换、自动播放、触摸滑动
 */

function initCarousel() {
  const carousel = document.querySelector('.carousel-container');
  if (!carousel) return;
  
  const track = carousel.querySelector('.carousel-track');
  const items = carousel.querySelectorAll('.carousel-item');
  const prevBtn = carousel.querySelector('.carousel-nav-prev');
  const nextBtn = carousel.querySelector('.carousel-nav-next');
  const indicators = carousel.querySelectorAll('.carousel-indicator');
  
  if (!track || items.length === 0) return;
  
  // 获取配置
  const autoplay = carousel.dataset.autoplay === 'true';
  const interval = parseInt(carousel.dataset.interval) || 5000;
  const direction = carousel.dataset.direction || 'horizontal';
  
  // 高度由CSS根据data-height属性设置，JavaScript不再动态设置
  // 这样可以避免页面加载时的高度闪烁
  
  let currentIndex = 0;
  let autoplayTimer = null;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  
  // 初始化
  function init() {
    updateCarousel(0, false);
    
    if (autoplay) {
      startAutoplay();
    }
    
    // 绑定事件
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // 触摸/鼠标拖动支持
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag);
    
    // 鼠标悬停暂停自动播放
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', () => {
      if (autoplay) startAutoplay();
    });
    
    // 键盘导航
    document.addEventListener('keydown', handleKeyboard);
  }
  
  // 更新轮播图
  function updateCarousel(index, animated = true) {
    currentIndex = index;
    
    if (!animated) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    if (direction === 'horizontal') {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      track.style.transform = `translateY(-${currentIndex * 100}%)`;
    }
    
    // 更新指示器
    indicators.forEach((indicator, i) => {
      if (i === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
    
    prevTranslate = -currentIndex * 100;
  }
  
  // 显示上一个
  function showPrev() {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    updateCarousel(newIndex);
    resetAutoplay();
  }
  
  // 显示下一个
  function showNext() {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    updateCarousel(newIndex);
    resetAutoplay();
  }
  
  // 跳转到指定幻灯片
  function goToSlide(index) {
    updateCarousel(index);
    resetAutoplay();
  }
  
  // 开始自动播放
  function startAutoplay() {
    if (autoplayTimer) return;
    autoplayTimer = setInterval(showNext, interval);
  }
  
  // 停止自动播放
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }
  
  // 重置自动播放
  function resetAutoplay() {
    stopAutoplay();
    if (autoplay) {
      startAutoplay();
    }
  }
  
  // 拖动开始
  function dragStart(event) {
    isDragging = true;
    if (direction === 'horizontal') {
      startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    } else {
      startPos = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
    }
    track.style.cursor = 'grabbing';
    stopAutoplay();
  }
  
  // 拖动中
  function drag(event) {
    if (!isDragging) return;
    event.preventDefault();
    
    let currentPosition;
    if (direction === 'horizontal') {
      currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    } else {
      currentPosition = event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
    }
    
    const diff = currentPosition - startPos;
    
    let percentage;
    if (direction === 'horizontal') {
      percentage = (diff / carousel.offsetWidth) * 100;
    } else {
      percentage = (diff / carousel.offsetHeight) * 100;
    }
    
    currentTranslate = prevTranslate + percentage;
    
    if (direction === 'horizontal') {
      track.style.transform = `translateX(${currentTranslate}%)`;
    } else {
      track.style.transform = `translateY(${currentTranslate}%)`;
    }
  }
  
  // 拖动结束
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    
    const movedBy = currentTranslate - prevTranslate;
    
    // 如果移动超过20%，切换幻灯片
    if (movedBy < -20 && currentIndex < items.length - 1) {
      showNext();
    } else if (movedBy > 20 && currentIndex > 0) {
      showPrev();
    } else {
      updateCarousel(currentIndex);
    }
    
    resetAutoplay();
  }
  
  
  // 键盘导航
  function handleKeyboard(event) {
    if (!isCarouselInView()) return;
    
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      showPrev();
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      showNext();
    }
  }
  
  // 检查轮播图是否在视口内
  function isCarouselInView() {
    const rect = carousel.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  // 清理函数
  window.cleanupCarousel = function() {
    stopAutoplay();
    document.removeEventListener('keydown', handleKeyboard);
  };
  
  // 初始化
  init();
}

// 立即执行初始化，不等待DOMContentLoaded
// 因为轮播图在HTML中已经存在，可以立即初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  // DOM已经加载完成，立即初始化
  initCarousel();
}

// 暴露到全局作用域，供 pjax 调用
window.initCarousel = initCarousel;

