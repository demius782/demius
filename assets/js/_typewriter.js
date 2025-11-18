/**
 * 打字机效果 - Mode2 大图副标题
 * 仅在首页 Mode2 模式下启用
 */

function initTypewriter() {
  // 检查是否启用打字机效果
  const typewriterEnabled = window.siteConfig?.typewriterEnable === 'true';
  const homeBigImageEnabled = window.siteConfig?.homeBigImageEnabled === 'true';
  const homeBigImageMode = window.siteConfig?.homeBigImageMode || 'mode1';
  
  // 只在首页、启用大图、Mode2 模式且启用打字机效果时才执行
  if (!typewriterEnabled || !homeBigImageEnabled || homeBigImageMode !== 'mode2') {
    return;
  }
  
  // 只在首页执行
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    return;
  }
  
  const subtitleElement = document.querySelector('.home-big-image-mode2 .home-big-image-subtitle');
  if (!subtitleElement) return;
  
  // 获取配置
  const speed = parseInt(window.siteConfig?.typewriterSpeed || '100', 10);
  const delay = parseInt(window.siteConfig?.typewriterDelay || '1000', 10);
  const showCursor = window.siteConfig?.typewriterCursor === 'true';
  const loop = window.siteConfig?.typewriterLoop === 'true';
  
  // 获取原始文本
  const originalText = subtitleElement.textContent;
  
  // 清空文本
  subtitleElement.textContent = '';
  
  // 添加光标样式
  if (showCursor) {
    subtitleElement.classList.add('typewriter-cursor');
  }
  
  let currentIndex = 0;
  let typingTimer = null;
  
  // 打字函数
  function typeNextChar() {
    if (currentIndex < originalText.length) {
      subtitleElement.textContent = originalText.substring(0, currentIndex + 1);
      currentIndex++;
      typingTimer = setTimeout(typeNextChar, speed);
    } else {
      // 打字完成
      if (showCursor && !loop) {
        // 如果不循环，打字完成后移除光标
        setTimeout(() => {
          subtitleElement.classList.remove('typewriter-cursor');
        }, 500);
      } else if (loop) {
        // 如果循环，等待后重新开始
        setTimeout(() => {
          currentIndex = 0;
          subtitleElement.textContent = '';
          typeNextChar();
        }, delay * 2);
      }
    }
  }
  
  // 延迟后开始打字
  setTimeout(() => {
    typeNextChar();
  }, delay);
  
  // 清理函数，用于 pjax 切换时清理定时器
  window.cleanupTypewriter = function() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
  };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initTypewriter);

// 暴露到全局作用域，供 pjax 调用
window.initTypewriter = initTypewriter;

