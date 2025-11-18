// 友链页面交互功能
document.addEventListener('DOMContentLoaded', function() {
  // 随机颜色生成器
  const randomColors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#0984e3', '#a29bfe', '#fd79a8'
  ];

  // 为友链标签添加随机背景色
  const linkTags = document.querySelectorAll('.link-tag');
  linkTags.forEach(tag => {
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    tag.style.backgroundColor = randomColor;
  });

  // 友链卡片悬停效果增强
  const linkCards = document.querySelectorAll('.link-card');
  
  linkCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.02)';
      this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
    });

    // 防止点击事件冒泡到父元素
    card.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // 友链图片懒加载和错误处理
  const linkAvatars = document.querySelectorAll('.link-avatar img');
  
  linkAvatars.forEach(img => {
    // 如果图片加载失败，使用默认头像
    img.addEventListener('error', function() {
      this.src = '/img/avatar.png';
      this.alt = '默认头像';
    });
    
    // 懒加载处理
    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
    }
  });

  // 平滑滚动到评论区
  const commentSection = document.querySelector('.comment-section');
  if (commentSection) {
    const scrollToComment = document.createElement('button');
    scrollToComment.textContent = '前往评论区';
    scrollToComment.className = 'scroll-to-comment-btn';
    scrollToComment.style.cssText = `
      display: block;
      margin: 1.5rem auto;
      padding: 0.6rem 1.2rem;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    `;
    
    scrollToComment.addEventListener('mouseenter', function() {
      this.style.background = 'var(--accent-secondary)';
      this.style.transform = 'translateY(-1px)';
    });
    
    scrollToComment.addEventListener('mouseleave', function() {
      this.style.background = 'var(--accent-primary)';
      this.style.transform = 'translateY(0)';
    });
    
    scrollToComment.addEventListener('click', function() {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    const linksContainer = document.querySelector('.links-groups');
    if (linksContainer) {
      linksContainer.appendChild(scrollToComment);
    }
  }

  // 友链分组折叠功能（可选）
  const groupTitles = document.querySelectorAll('.group-title');
  
  groupTitles.forEach(title => {
    title.style.cursor = 'pointer';
    title.addEventListener('click', function() {
      const group = this.closest('.links-group');
      const grid = group.querySelector('.links-grid');
      grid.style.display = grid.style.display === 'none' ? 'grid' : 'none';
    });
  });

  // 友链通讯状态检测
  initLinkStatusCheck();
});

/**
 * 初始化友链通讯状态检测
 * 首次打开友链页面时自动检测每个友链链接的可用性
 */
function initLinkStatusCheck() {
  // 检查是否在友链页面
  if (!document.querySelector('.links-page')) {
    return;
  }

  const linkCards = document.querySelectorAll('.link-card[data-link-url]');
  if (linkCards.length === 0) {
    return;
  }

  // 检测所有友链的状态
  linkCards.forEach((card, index) => {
    // 添加延迟，避免并发过多
    setTimeout(() => {
      const url = card.getAttribute('data-link-url');
      if (url) {
        checkLinkStatus(card, url);
      }
    }, index * 150); // 每次检测间隔150ms
  });
}

/**
 * 检测单个友链链接的状态
 * @param {HTMLElement} card - 友链卡片元素
 * @param {string} url - 友链URL
 */
async function checkLinkStatus(card, url) {
  const badge = card.querySelector('.link-status-badge');
  if (!badge) {
    return;
  }

  // 检查localStorage中是否已有检测结果
  const storageKey = `link-status-${btoa(url).replace(/[+/=]/g, '')}`;
  const cachedStatus = localStorage.getItem(storageKey);
  
  if (cachedStatus) {
    // 如果有缓存，直接使用缓存结果
    const status = JSON.parse(cachedStatus);
    if (status.timestamp && Date.now() - status.timestamp < 24 * 60 * 60 * 1000) {
      // 缓存24小时内有效
      updateBadgeStatus(badge, status.status);
      return;
    }
  }

  // 开始检测，显示检测中状态
  badge.setAttribute('data-status', 'checking');
  
  try {
    // 首先尝试使用HEAD请求（cors模式）获取真实状态码
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',  // 尝试cors模式获取状态码
        signal: controller.signal,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      // 如果成功获取响应，检查状态码
      if (response.ok || response.status === 200) {
        const status = 'normal';
        updateBadgeStatus(badge, status);
        localStorage.setItem(storageKey, JSON.stringify({
          status: status,
          timestamp: Date.now()
        }));
        return;
      } else {
        // 状态码不是200，标记为异常
        const status = 'error';
        updateBadgeStatus(badge, status);
        localStorage.setItem(storageKey, JSON.stringify({
          status: status,
          timestamp: Date.now()
        }));
        return;
      }
    } catch (corsError) {
      // CORS失败，尝试使用no-cors模式（无法获取状态码，但可以检测是否能访问）
      clearTimeout(timeoutId);
      
      // 使用GET请求测试链接是否可访问
      const testController = new AbortController();
      const testTimeoutId = setTimeout(() => testController.abort(), 5000);
      
      try {
        const testResponse = await fetch(url, {
          method: 'GET',
          mode: 'no-cors',  // no-cors模式可以绕过CORS限制，但无法获取状态码
          signal: testController.signal,
          cache: 'no-cache'
        });
        
        clearTimeout(testTimeoutId);
        
        // no-cors模式下，如果请求没有抛出异常，说明链接可访问
        // 虽然无法获取真实状态码，但可以认为链接正常（至少能响应请求）
        const status = 'normal';
        updateBadgeStatus(badge, status);
        localStorage.setItem(storageKey, JSON.stringify({
          status: status,
          timestamp: Date.now()
        }));
      } catch (testError) {
        // no-cors请求也失败，标记为异常
        clearTimeout(testTimeoutId);
        const status = 'error';
        updateBadgeStatus(badge, status);
        localStorage.setItem(storageKey, JSON.stringify({
          status: status,
          timestamp: Date.now()
        }));
      }
    }
  } catch (error) {
    // 请求失败（超时、网络错误等），标记为异常
    const status = 'error';
    updateBadgeStatus(badge, status);
    
    localStorage.setItem(storageKey, JSON.stringify({
      status: status,
      timestamp: Date.now()
    }));
  }
}

/**
 * 更新状态徽章的显示
 * @param {HTMLElement} badge - 状态徽章元素
 * @param {string} status - 状态：checking/normal/error
 */
function updateBadgeStatus(badge, status) {
  badge.setAttribute('data-status', status);
  
  const statusText = badge.querySelector('.status-text');
  if (statusText) {
    if (status === 'normal') {
      statusText.textContent = '';
      statusText.style.display = 'none';
    } else if (status === 'error') {
      statusText.textContent = '异常';
    } else {
      statusText.textContent = '检测中';
    }
  }
}

// 导出友链相关功能
export { };