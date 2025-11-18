// ===== 置顶文章样式配置 =====

// 从配置中读取置顶徽章图标和文字颜色并设置CSS变量
function initPinnedStyle() {
  // 等待确保window.siteConfig已加载
  if (typeof window.siteConfig === 'undefined') {
    // 如果配置还未加载，延迟执行
    setTimeout(initPinnedStyle, 50);
    return;
  }
  
  const config = window.siteConfig || {};
  
  // 设置图标和文字颜色
  if (config.pinnedIconColor) {
    document.documentElement.style.setProperty('--pinned-icon-color', config.pinnedIconColor);
  }
  
  if (config.pinnedTextColor) {
    document.documentElement.style.setProperty('--pinned-text-color', config.pinnedTextColor);
  }
  
  // 暗色模式颜色（如果配置了）
  if (config.pinnedIconColorDark) {
    document.documentElement.style.setProperty('--pinned-icon-color-dark', config.pinnedIconColorDark);
  }
  
  if (config.pinnedTextColorDark) {
    document.documentElement.style.setProperty('--pinned-text-color-dark', config.pinnedTextColorDark);
  }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPinnedStyle);
} else {
  initPinnedStyle();
}

// 导出到全局（供PJAX使用）
window.initPinnedStyle = initPinnedStyle;

