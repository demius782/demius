// ===== 时间线功能脚本 =====

(function() {
  'use strict';

  // 初始化时间线功能
  function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;

    // 观察时间线项目进入视口
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('timeline-item-visible');
            // 只触发一次动画
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      timelineItems.forEach(item => {
        // 移除默认动画，由观察器控制
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
      });

      // 添加可见性动画类
      const style = document.createElement('style');
      style.textContent = `
        .timeline-item-visible {
          animation: fadeInUp 0.6s ease forwards !important;
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 为时间线项添加序号数据属性（用于调试或其他用途）
    timelineItems.forEach((item, index) => {
      item.setAttribute('data-timeline-index', index + 1);
    });
  }

  // 清理时间线功能
  function cleanupTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.style.opacity = '';
      item.style.transform = '';
      item.classList.remove('timeline-item-visible');
    });
  }

  // 获取所有时间线项
  function getAllTimelineItems() {
    return document.querySelectorAll('.timeline-item');
  }

  // 按类型筛选时间线项
  function filterTimelineByType(type) {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
      if (type === 'all' || item.classList.contains(`timeline-item-${type}`)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // 重置筛选
  function resetTimelineFilter() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
      item.style.display = '';
    });
  }

  // 暴露给全局以便PJAX和外部调用
  window.initTimeline = initTimeline;
  window.cleanupTimeline = cleanupTimeline;
  window.getAllTimelineItems = getAllTimelineItems;
  window.filterTimelineByType = filterTimelineByType;
  window.resetTimelineFilter = resetTimelineFilter;

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
  } else {
    initTimeline();
  }
})();

