/**
 * 数据页面 - Umami 统计数据获取和显示 + 其他数据统计
 */

// 记录页面加载开始时间（用于计算响应耗时）
let pageLoadStartTime = null;
if (performance && performance.timing) {
  pageLoadStartTime = performance.timing.navigationStart;
} else if (performance && performance.now) {
  pageLoadStartTime = Date.now() - performance.now();
} else {
  pageLoadStartTime = Date.now();
}

// 全局初始化函数
window.initDataPage = function() {
  // 检查是否是数据页面
  const dataPage = document.querySelector('.data-page');
  if (!dataPage) {
    return; // 不是数据页面，直接返回
  }

  // ===== Umami统计数据获取 =====
  const analyticsGrid = document.getElementById('umami-analytics');
  if (analyticsGrid) {
    const apiUrl = analyticsGrid.dataset.apiUrl;
    if (apiUrl) {
      fetchUmamiAnalytics(apiUrl);
    }
  }

  // ===== 其他数据统计 =====
  initOtherStats();
};

// 获取Umami统计数据
async function fetchUmamiAnalytics(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    updateAnalyticsUI(data);
  } catch (error) {
    console.error('获取统计数据失败:', error);
    
    let errorMsg = '请稍后重试';
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      errorMsg = 'API服务器需要配置CORS跨域访问权限';
    } else if (error.message.includes('HTTP')) {
      errorMsg = error.message;
    }
    
    showError(errorMsg);
  }
}

// 更新Umami统计UI显示数据
function updateAnalyticsUI(data) {
  const statElements = {
    'today_uv': document.querySelector('[data-stat="today_uv"] .loading-skeleton'),
    'today_pv': document.querySelector('[data-stat="today_pv"] .loading-skeleton'),
    'yesterday_uv': document.querySelector('[data-stat="yesterday_uv"] .loading-skeleton'),
    'yesterday_pv': document.querySelector('[data-stat="yesterday_pv"] .loading-skeleton'),
    'last_month_pv': document.querySelector('[data-stat="last_month_pv"] .loading-skeleton'),
    'last_year_pv': document.querySelector('[data-stat="last_year_pv"] .loading-skeleton')
  };
  
  // 逐个更新数据，使用动画效果
  Object.keys(statElements).forEach((key, index) => {
    const element = statElements[key];
    if (element && data[key] !== undefined) {
      setTimeout(() => {
        element.classList.remove('loading-skeleton');
        animateNumber(element, 0, data[key], 1000);
      }, index * 100); // 错开动画时间
    }
  });

}

// 初始化其他统计数据
function initOtherStats() {
  // 全站字数（从Hugo模板计算的data属性获取）
  const totalWordsEl = document.querySelector('#stat-total-words .stat-value');
  if (totalWordsEl) {
    const wordsAttr = totalWordsEl.dataset.words;
    if (wordsAttr) {
      const words = parseInt(wordsAttr, 10);
      // 移除loading-skeleton类（如果存在）
      totalWordsEl.classList.remove('loading-skeleton');
      totalWordsEl.textContent = formatWords(words);
    } else {
      // 如果没有data属性，尝试从API获取（备选方案）
      calculateTotalWords().then(words => {
        totalWordsEl.classList.remove('loading-skeleton');
        totalWordsEl.textContent = formatWords(words);
      }).catch(() => {
        totalWordsEl.classList.remove('loading-skeleton');
        totalWordsEl.textContent = '--';
      });
    }
  }

  // 响应耗时
  const responseTimeEl = document.querySelector('#stat-response-time .stat-value');
  if (responseTimeEl) {
    const responseTime = getResponseTime();
    responseTimeEl.classList.remove('loading-skeleton');
    responseTimeEl.textContent = responseTime;
  }

  // 最后更新时间
  const lastUpdateEl = document.querySelector('#stat-last-update .stat-value');
  if (lastUpdateEl) {
    getLastUpdateTime().then(time => {
      lastUpdateEl.classList.remove('loading-skeleton');
      lastUpdateEl.textContent = time;
    }).catch(() => {
      lastUpdateEl.classList.remove('loading-skeleton');
      lastUpdateEl.textContent = '--';
    });
  }

  // 评论数目
  const commentCountEl = document.querySelector('#stat-comment-count .stat-value');
  if (commentCountEl) {
    getCommentCount().then(count => {
      commentCountEl.classList.remove('loading-skeleton');
      animateNumber(commentCountEl, 0, count, 1000);
    }).catch(() => {
      commentCountEl.classList.remove('loading-skeleton');
      commentCountEl.textContent = '--';
    });
  }
}

// 计算全站字数（备用方法，从index.json估算）
async function calculateTotalWords() {
  try {
    const response = await fetch('/index.json');
    if (!response.ok) {
      throw new Error('无法获取文章数据');
    }
    
    const data = await response.json();
    let totalChars = 0;
    
    // index.json可能是数组或对象
    const posts = Array.isArray(data) ? data : (data.posts || []);
    
    if (Array.isArray(posts)) {
      // 使用description估算（不准确，仅作为备选）
      posts.forEach(post => {
        if (post.description) {
          const text = post.description
            .replace(/<[^>]+>/g, '')
            .replace(/\n+/g, ' ')
            .trim();
          // 估算系数（实际应该从文章内容获取）
          const chars = text.length * 50;
          totalChars += chars;
        }
      });
    }
    
    return totalChars;
  } catch (error) {
    console.error('计算全站字数失败:', error);
    throw error;
  }
}

// 格式化字数显示
function formatWords(chars) {
  if (chars >= 10000) {
    return (chars / 10000).toFixed(2) + ' 万';
  } else if (chars >= 1000) {
    return (chars / 1000).toFixed(2) + ' 千';
  }
  return chars.toString();
}

// 获取在线人数（基于localStorage模拟）
function getOnlineUsers() {
  const now = Date.now();
  const timeout = 30 * 1000; // 30秒超时
  const storageKey = 'online_users';
  const userKey = 'user_id_' + now;
  
  try {
    // 获取所有在线用户
    let onlineUsers = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // 清理过期用户
    Object.keys(onlineUsers).forEach(key => {
      if (now - onlineUsers[key] > timeout) {
        delete onlineUsers[key];
      }
    });
    
    // 添加当前用户
    onlineUsers[userKey] = now;
    
    // 保存
    localStorage.setItem(storageKey, JSON.stringify(onlineUsers));
    
    // 返回在线人数（至少1人）
    const count = Math.max(1, Object.keys(onlineUsers).length);
    return count;
  } catch (error) {
    console.error('获取在线人数失败:', error);
    return 1; // 默认返回1
  }
}

// 获取响应耗时
function getResponseTime() {
  if (performance && performance.timing) {
    const timing = performance.timing;
    // 如果页面已经加载完成
    if (timing.loadEventEnd > 0) {
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      if (loadTime < 1000) {
        return loadTime.toFixed(0) + ' ms';
      } else {
        return (loadTime / 1000).toFixed(2) + ' s';
      }
    } else {
      // 页面还在加载中，计算当前已用时间
      const currentTime = Date.now() - pageLoadStartTime;
      if (currentTime < 1000) {
        return currentTime.toFixed(0) + ' ms';
      } else {
        return (currentTime / 1000).toFixed(2) + ' s';
      }
    }
  } else if (performance && performance.now) {
    // 使用performance.now()作为备选方案
    const loadTime = performance.now();
    if (loadTime < 1000) {
      return loadTime.toFixed(0) + ' ms';
    } else {
      return (loadTime / 1000).toFixed(2) + ' s';
    }
  }
  return '--';
}

// 获取最后更新时间
async function getLastUpdateTime() {
  try {
    const response = await fetch('/index.json');
    if (!response.ok) {
      throw new Error('无法获取文章数据');
    }
    
    const data = await response.json();
    let lastUpdate = null;
    
    // index.json可能是数组或对象
    const posts = Array.isArray(data) ? data : (data.posts || []);
    
    if (Array.isArray(posts)) {
      posts.forEach(post => {
        // 检查是否有lastmod字段
        if (post.lastmod) {
          const postDate = new Date(post.lastmod);
          if (!lastUpdate || postDate > lastUpdate) {
            lastUpdate = postDate;
          }
        } else if (post.date) {
          // 使用date作为备选
          const postDate = new Date(post.date);
          if (!lastUpdate || postDate > lastUpdate) {
            lastUpdate = postDate;
          }
        }
      });
    }
    
    if (lastUpdate) {
      const now = new Date();
      const diff = now - lastUpdate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) {
        return '今天';
      } else if (days === 1) {
        return '昨天';
      } else if (days < 7) {
        return days + ' 天前';
      } else if (days < 30) {
        return Math.floor(days / 7) + ' 周前';
      } else if (days < 365) {
        return Math.floor(days / 30) + ' 个月前';
      } else {
        return Math.floor(days / 365) + ' 年前';
      }
    }
    
    return '--';
  } catch (error) {
    console.error('获取最后更新时间失败:', error);
    throw error;
  }
}

// 获取评论数目（从Artalk API）
async function getCommentCount() {
  try {
    // 检查是否配置了Artalk
    const artalkConfig = window.artalkConfig || {};
    if (!artalkConfig.server) {
      throw new Error('未配置Artalk服务器');
    }
    
    // 使用Artalk的统计API（参考_recent-comments.js的实现）
    // Artalk v2 API: /api/v2/stats/latest_comments
    // 为了获取总数，我们需要获取所有评论或使用统计API
    // 这里使用一个简单的方案：获取大量评论并计数
    const apiUrl = `${artalkConfig.server}/api/v2/stats/latest_comments?site_name=${encodeURIComponent(artalkConfig.site || 'default')}&limit=1000`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Artalk API返回格式: { data: [...] }
    if (data.data && Array.isArray(data.data)) {
      // 如果返回的评论数少于请求的limit，说明已经获取了全部
      // 否则需要调用其他API获取总数
      // 这里先返回获取到的评论数（如果limit足够大，应该接近总数）
      return data.data.length;
    }
    
    // 尝试其他可能的API端点
    // Artalk可能提供统计API，但需要根据实际版本调整
    return 0;
  } catch (error) {
    console.error('获取评论数目失败:', error);
    // 如果API不可用，返回0
    return 0;
  }
}

// 数字递增动画
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  const difference = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用缓动函数
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + difference * easeOut);
    
    element.textContent = formatNumber(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatNumber(end);
    }
  }
  
  requestAnimationFrame(update);
}

// 格式化数字（添加千分位分隔符）
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 显示错误信息
function showError(message) {
  const errorEl = document.getElementById('analytics-error');
  const analyticsGrid = document.getElementById('umami-analytics');
  const errorDetail = errorEl?.querySelector('.error-detail');
  
  if (errorEl && analyticsGrid) {
    analyticsGrid.style.display = 'none';
    errorEl.style.display = 'block';
    
    if (errorDetail && message) {
      errorDetail.textContent = message;
    }
  }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initDataPage);
} else {
  window.initDataPage();
}

// 支持PJAX重新初始化
document.addEventListener('pjax:complete', function() {
  setTimeout(window.initDataPage, 100);
});

