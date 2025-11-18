// ===== 内容折叠功能脚本 =====

(function() {
  'use strict';

  // 初始化折叠功能
  function initCollapse() {
    const collapseHeaders = document.querySelectorAll('.collapse-header');
    
    collapseHeaders.forEach(header => {
      // 移除旧的事件监听器（通过克隆节点）
      const newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);
      
      // 添加点击事件
      newHeader.addEventListener('click', function() {
        toggleCollapse(this);
      });
      
      // 添加键盘事件（Enter和Space）
      newHeader.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCollapse(this);
        }
      });
    });
  }

  // 切换折叠状态
  function toggleCollapse(header) {
    const container = header.closest('.collapse-container');
    const content = container.querySelector('.collapse-content');
    const isActive = header.classList.contains('active');
    
    if (isActive) {
      // 折叠
      header.classList.remove('active');
      content.classList.remove('show');
      header.setAttribute('aria-expanded', 'false');
      content.setAttribute('aria-hidden', 'true');
    } else {
      // 展开
      header.classList.add('active');
      content.classList.add('show');
      header.setAttribute('aria-expanded', 'true');
      content.setAttribute('aria-hidden', 'false');
    }
  }

  // 展开所有折叠
  function expandAllCollapses() {
    const headers = document.querySelectorAll('.collapse-header');
    headers.forEach(header => {
      if (!header.classList.contains('active')) {
        toggleCollapse(header);
      }
    });
  }

  // 折叠所有折叠
  function collapseAllCollapses() {
    const headers = document.querySelectorAll('.collapse-header');
    headers.forEach(header => {
      if (header.classList.contains('active')) {
        toggleCollapse(header);
      }
    });
  }

  // 通过ID展开特定折叠
  function expandCollapseById(id) {
    const content = document.getElementById(id);
    if (content) {
      const header = content.previousElementSibling;
      if (header && header.classList.contains('collapse-header')) {
        if (!header.classList.contains('active')) {
          toggleCollapse(header);
        }
      }
    }
  }

  // 清理折叠功能
  function cleanupCollapse() {
    // 清理事件监听器已通过克隆节点实现
    // 这里可以添加其他清理逻辑
  }

  // 暴露给全局以便PJAX和外部调用
  window.initCollapse = initCollapse;
  window.cleanupCollapse = cleanupCollapse;
  window.expandAllCollapses = expandAllCollapses;
  window.collapseAllCollapses = collapseAllCollapses;
  window.expandCollapseById = expandCollapseById;

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollapse);
  } else {
    initCollapse();
  }
})();

