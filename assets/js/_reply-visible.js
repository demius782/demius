// ===== 评论可见内容功能 =====

// 存储键名
const REPLY_VISIBLE_STORAGE_KEY = 'demius_reply_visible_items';
const REPLY_VISIBLE_PENDING_KEY = 'demius_reply_visible_pending';

// 初始化评论可见功能
function initReplyVisible() {
  const containers = document.querySelectorAll('.reply-visible-container');
  
  if (containers.length === 0) return;
  
  // 获取已查看的项目
  const viewedItems = getViewedItems();
  
  containers.forEach(container => {
    const id = container.id;
    
    // 检查是否已查看
    if (viewedItems.includes(id)) {
      showContent(container, false);
    }
    
    // 绑定按钮点击事件
    const button = container.querySelector('.reply-visible-button');
    if (button) {
      button.addEventListener('click', () => handleButtonClick(container));
    }
  });
}

// 处理按钮点击
function handleButtonClick(container) {
  const id = container.id;
  
  // 检查是否有评论功能
  if (!checkCommentSystem()) {
    // 如果没有评论系统，直接显示内容
    showContent(container, true);
    saveViewedItem(id);
    return;
  }
  
  // 检查评论区域
  const commentSection = findCommentSection();
  
  if (commentSection) {
    // 滚动到评论区
    commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 高亮评论区
    commentSection.classList.add('highlight-comment');
    setTimeout(() => {
      commentSection.classList.remove('highlight-comment');
    }, 2000);
    
    // 提示用户评论
    showNotification('请先发表评论，评论成功后即可查看隐藏内容');
    
    // 存储待解锁的容器ID，等待评论成功
    storePendingUnlock(id);
    
    // 开始监听评论系统
    startCommentListener(container);
  } else {
    // 没有找到评论区，直接显示
    showContent(container, true);
    saveViewedItem(id);
  }
}

// 检查评论系统是否存在
function checkCommentSystem() {
  return findCommentSection() !== null;
}

// 查找评论区域
function findCommentSection() {
  const commentSystems = [
    '#artalk',              // Artalk
    '.artalk',
    '#comments',
    '.comments',
    '#comment-container',
    '.comment-container',
    '#gitalk-container',
    '#disqus_thread',
    '#valine',
    '#twikoo',
    '#waline',
    '#utterances',
    '#giscus'
  ];
  
  for (const selector of commentSystems) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  
  return null;
}

// 显示内容
function showContent(container, animate = true) {
  const mask = container.querySelector('.reply-visible-mask');
  const content = container.querySelector('.reply-visible-content');
  
  if (!mask || !content) return;
  
  container.dataset.visible = 'true';
  
  if (animate) {
    // 淡出遮罩
    mask.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    mask.style.opacity = '0';
    mask.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      mask.style.display = 'none';
      content.style.display = 'block';
    }, 300);
  } else {
    mask.style.display = 'none';
    content.style.display = 'block';
  }
}

// 获取已查看的项目
function getViewedItems() {
  try {
    const stored = localStorage.getItem(REPLY_VISIBLE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

// 保存已查看的项目
function saveViewedItem(id) {
  try {
    const viewedItems = getViewedItems();
    if (!viewedItems.includes(id)) {
      viewedItems.push(id);
      localStorage.setItem(REPLY_VISIBLE_STORAGE_KEY, JSON.stringify(viewedItems));
    }
    // 清除待解锁标记
    clearPendingUnlock(id);
  } catch (e) {
    // localStorage 写入失败，静默处理
  }
}

// 存储待解锁的容器
function storePendingUnlock(id) {
  try {
    const pending = getPendingUnlocks();
    if (!pending.includes(id)) {
      pending.push(id);
      localStorage.setItem(REPLY_VISIBLE_PENDING_KEY, JSON.stringify(pending));
    }
  } catch (e) {
    // localStorage 写入失败，静默处理
  }
}

// 获取待解锁的容器
function getPendingUnlocks() {
  try {
    const stored = localStorage.getItem(REPLY_VISIBLE_PENDING_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

// 清除待解锁标记
function clearPendingUnlock(id) {
  try {
    let pending = getPendingUnlocks();
    pending = pending.filter(item => item !== id);
    localStorage.setItem(REPLY_VISIBLE_PENDING_KEY, JSON.stringify(pending));
  } catch (e) {
    // localStorage 写入失败，静默处理
  }
}

// 开始监听评论系统
function startCommentListener(container) {
  const id = container.id;
  
  // 检测Artalk评论系统
  if (window.Artalk || document.querySelector('#artalk, .artalk')) {
    listenArtalkComment(container);
    return;
  }
  
  // 检测Gitalk
  if (window.gitalk || document.querySelector('#gitalk-container')) {
    listenGitalkComment(container);
    return;
  }
  
  // 检测Valine/Waline
  if (window.Valine || window.Waline || document.querySelector('#valine, #waline')) {
    listenValineWalineComment(container);
    return;
  }
  
  // 检测Twikoo
  if (window.twikoo || document.querySelector('#twikoo')) {
    listenTwikooComment(container);
    return;
  }
  
  // 通用监听：定期检查评论数变化
  listenCommentChanges(container);
}

// 监听Artalk评论
function listenArtalkComment(container) {
  const id = container.id;
  
  // 获取初始评论数
  const getCommentCount = () => {
    const countEl = document.querySelector('.artalk .atk-comment-count, .artalk [data-comment-count]');
    return countEl ? parseInt(countEl.textContent) || 0 : 0;
  };
  
  let initialCount = getCommentCount();
  
  // 监听DOM变化
  const observer = new MutationObserver(() => {
    const currentCount = getCommentCount();
    if (currentCount > initialCount) {
      // 评论数增加，解锁内容
      showNotification('评论成功！内容已解锁');
      setTimeout(() => {
        showContent(container, true);
        saveViewedItem(id);
      }, 1000);
      observer.disconnect();
    }
  });
  
  const artalkContainer = document.querySelector('#artalk, .artalk');
  if (artalkContainer) {
    observer.observe(artalkContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // 30秒后自动停止监听
    setTimeout(() => observer.disconnect(), 30000);
  }
}

// 监听Gitalk评论
function listenGitalkComment(container) {
  const id = container.id;
  const gitalkContainer = document.querySelector('#gitalk-container');
  
  if (!gitalkContainer) return;
  
  const observer = new MutationObserver(() => {
    const comments = gitalkContainer.querySelectorAll('.gt-comment');
    if (comments.length > 0) {
      showNotification('评论成功！内容已解锁');
      setTimeout(() => {
        showContent(container, true);
        saveViewedItem(id);
      }, 1000);
      observer.disconnect();
    }
  });
  
  observer.observe(gitalkContainer, {
    childList: true,
    subtree: true
  });
  
  setTimeout(() => observer.disconnect(), 30000);
}

// 监听Valine/Waline评论
function listenValineWalineComment(container) {
  const id = container.id;
  const commentContainer = document.querySelector('#valine, #waline');
  
  if (!commentContainer) return;
  
  let initialCount = commentContainer.querySelectorAll('.vcontent, .wl-content').length;
  
  const observer = new MutationObserver(() => {
    const currentCount = commentContainer.querySelectorAll('.vcontent, .wl-content').length;
    if (currentCount > initialCount) {
      showNotification('评论成功！内容已解锁');
      setTimeout(() => {
        showContent(container, true);
        saveViewedItem(id);
      }, 1000);
      observer.disconnect();
    }
  });
  
  observer.observe(commentContainer, {
    childList: true,
    subtree: true
  });
  
  setTimeout(() => observer.disconnect(), 30000);
}

// 监听Twikoo评论
function listenTwikooComment(container) {
  const id = container.id;
  const twikooContainer = document.querySelector('#twikoo');
  
  if (!twikooContainer) return;
  
  let initialCount = twikooContainer.querySelectorAll('.tk-comment').length;
  
  const observer = new MutationObserver(() => {
    const currentCount = twikooContainer.querySelectorAll('.tk-comment').length;
    if (currentCount > initialCount) {
      showNotification('评论成功！内容已解锁');
      setTimeout(() => {
        showContent(container, true);
        saveViewedItem(id);
      }, 1000);
      observer.disconnect();
    }
  });
  
  observer.observe(twikooContainer, {
    childList: true,
    subtree: true
  });
  
  setTimeout(() => observer.disconnect(), 30000);
}

// 通用评论变化监听
function listenCommentChanges(container) {
  const id = container.id;
  const commentSection = findCommentSection();
  
  if (!commentSection) return;
  
  const initialHTML = commentSection.innerHTML;
  
  const observer = new MutationObserver(() => {
    const currentHTML = commentSection.innerHTML;
    if (currentHTML !== initialHTML && currentHTML.length > initialHTML.length) {
      showNotification('检测到评论变化！内容已解锁');
      setTimeout(() => {
        showContent(container, true);
        saveViewedItem(id);
      }, 1000);
      observer.disconnect();
    }
  });
  
  observer.observe(commentSection, {
    childList: true,
    subtree: true
  });
  
  setTimeout(() => observer.disconnect(), 30000);
}

// 显示通知
function showNotification(message) {
  // 检查是否已有通知元素
  let notification = document.querySelector('.reply-visible-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'reply-visible-notification';
    document.body.appendChild(notification);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .reply-visible-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @media (max-width: 480px) {
        .reply-visible-notification {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  notification.textContent = message;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.style.display = 'none';
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 300);
  }, 3000);
}

// 清理功能
function cleanupReplyVisible() {
  // 移除事件监听器（如果需要的话）
  const buttons = document.querySelectorAll('.reply-visible-button');
  buttons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });
}

// 评论区高亮样式
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
  .highlight-comment {
    animation: highlightPulse 2s ease;
  }
  
  @keyframes highlightPulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(0, 102, 204, 0);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(0, 102, 204, 0.2);
    }
  }
`;
document.head.appendChild(highlightStyle);

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReplyVisible);
} else {
  initReplyVisible();
}

// 导出函数供PJAX使用
window.initReplyVisible = initReplyVisible;
window.cleanupReplyVisible = cleanupReplyVisible;

