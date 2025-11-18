/**
 * 侧栏数据统计组件 - JavaScript逻辑
 */

(function() {
  'use strict';

  // 记录页面加载开始时间（用于计算响应耗时）
  let pageLoadStartTime = null;
  if (performance && performance.timing) {
    pageLoadStartTime = performance.timing.navigationStart;
  } else if (performance && performance.now) {
    pageLoadStartTime = Date.now() - performance.now();
  } else {
    pageLoadStartTime = Date.now();
  }

  function initDataStats() {
    // 检查组件是否存在
    const dataStatsCard = document.querySelector('.data-stats-card');
    if (!dataStatsCard) {
      return;
    }

    // 全站字数
    const totalWordsEl = document.querySelector('#sidebar-stat-total-words .data-stats-value');
    if (totalWordsEl) {
      const wordsAttr = totalWordsEl.dataset.words;
      if (wordsAttr) {
        const words = parseInt(wordsAttr, 10);
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
    const responseTimeEl = document.querySelector('#sidebar-stat-response-time .data-stats-value');
    if (responseTimeEl) {
      const responseTime = getResponseTime();
      responseTimeEl.classList.remove('loading-skeleton');
      responseTimeEl.textContent = responseTime;
    }

    // 最后更新时间
    const lastUpdateEl = document.querySelector('#sidebar-stat-last-update .data-stats-value');
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
    const commentCountEl = document.querySelector('#sidebar-stat-comment-count .data-stats-value');
    if (commentCountEl) {
      getCommentCount().then(count => {
        commentCountEl.classList.remove('loading-skeleton');
        commentCountEl.textContent = formatNumber(count);
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
      
      const posts = Array.isArray(data) ? data : (data.posts || []);
      
      if (Array.isArray(posts)) {
        posts.forEach(post => {
          if (post.description) {
            const text = post.description
              .replace(/<[^>]+>/g, '')
              .replace(/\n+/g, ' ')
              .trim();
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

  // 获取响应耗时
  function getResponseTime() {
    if (performance && performance.timing) {
      const timing = performance.timing;
      if (timing.loadEventEnd > 0) {
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        if (loadTime < 1000) {
          return loadTime.toFixed(0) + ' ms';
        } else {
          return (loadTime / 1000).toFixed(2) + ' s';
        }
      } else {
        const currentTime = Date.now() - pageLoadStartTime;
        if (currentTime < 1000) {
          return currentTime.toFixed(0) + ' ms';
        } else {
          return (currentTime / 1000).toFixed(2) + ' s';
        }
      }
    } else if (performance && performance.now) {
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
      
      const posts = Array.isArray(data) ? data : (data.posts || []);
      
      if (Array.isArray(posts)) {
        posts.forEach(post => {
          if (post.lastmod) {
            const postDate = new Date(post.lastmod);
            if (!lastUpdate || postDate > lastUpdate) {
              lastUpdate = postDate;
            }
          } else if (post.date) {
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
      const artalkConfig = window.artalkConfig || {};
      if (!artalkConfig.server) {
        throw new Error('未配置Artalk服务器');
      }
      
      const apiUrl = `${artalkConfig.server}/api/v2/stats/latest_comments?site_name=${encodeURIComponent(artalkConfig.site || 'default')}&limit=1000`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        return data.data.length;
      }
      
      return 0;
    } catch (error) {
      console.error('获取评论数目失败:', error);
      return 0;
    }
  }

  // 格式化数字（添加千分位分隔符）
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataStats);
  } else {
    initDataStats();
  }

  // 支持PJAX重新初始化
  document.addEventListener('pjax:complete', function() {
    setTimeout(initDataStats, 100);
  });
})();

