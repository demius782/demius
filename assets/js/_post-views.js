/**
 * 文章浏览量统计
 * 支持 Umami API 和 localStorage 两种方案
 * API 不可用时自动切换到 localStorage 方案
 * 实现数据同步
 */

(function() {
  'use strict';

  // 初始化浏览量统计
  function initPostViews() {
    const viewCountElement = document.querySelector('.post-view-count .view-count-number');
    if (!viewCountElement) {
      return; // 不在文章详情页，直接返回
    }

    const pageUrl = document.querySelector('.post-view-count')?.dataset.pageUrl;
    if (!pageUrl) {
      return;
    }

    // 检查是否启用 Umami API
    const useUmami = window.siteConfig?.umamiUseForPostViews && window.siteConfig?.umamiApiUrl;
    
    if (useUmami) {
      // 优先使用 Umami API
      fetchUmamiViews(pageUrl, viewCountElement);
    } else {
      // 使用 localStorage 方案
      useLocalStorageViews(pageUrl, viewCountElement);
    }
  }

  // 使用 localStorage 方案
  function useLocalStorageViews(pageUrl, element) {
    const storageKey = `post_view_${pageUrl}`;
    let viewCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

    // 检查是否已经记录过本次访问（防止刷新重复计数）
    const sessionKey = `post_view_session_${pageUrl}`;
    const hasViewedThisSession = sessionStorage.getItem(sessionKey);

    if (!hasViewedThisSession) {
      // 增加浏览量
      viewCount += 1;
      localStorage.setItem(storageKey, viewCount.toString());
      sessionStorage.setItem(sessionKey, 'true');
    }

    // 更新显示
    updateViewCount(element, viewCount);
  }

  // 从 Umami API 获取浏览量
  async function fetchUmamiViews(pageUrl, element) {
    const storageKey = `post_view_${pageUrl}`;
    const sessionKey = `post_view_session_${pageUrl}`;
    
    // 先显示 localStorage 中的数据（如果有）
    const cachedCount = parseInt(localStorage.getItem(storageKey) || '0', 10);
    if (cachedCount > 0) {
      updateViewCount(element, cachedCount);
    }

    try {
      const apiUrl = window.siteConfig.umamiApiUrl;
      if (!apiUrl) {
        throw new Error('API URL 未配置');
      }

      // 构建完整的页面URL
      const fullUrl = window.location.origin + pageUrl;
      
      // 构建 API 请求URL
      // 根据 Umami API 的实际格式调整
      // 尝试多种可能的 API 端点格式
      const baseApiUrl = apiUrl.replace(/\/$/, '');
      let apiEndpoint = `${baseApiUrl}/pageviews?url=${encodeURIComponent(fullUrl)}`;
      
      // 如果上面格式失败，可以尝试其他格式
      // 例如：${baseApiUrl}?url=${encodeURIComponent(fullUrl)}
      // 或者：${baseApiUrl}/posts/${encodeURIComponent(pageUrl)}/views
      
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 解析 API 返回的数据
      // 可能的格式：{ views: 123 } 或 { pageviews: 123 } 或直接返回数字
      let apiViews = 0;
      if (typeof data === 'number') {
        apiViews = data;
      } else if (data && typeof data.views === 'number') {
        apiViews = data.views;
      } else if (data && typeof data.pageviews === 'number') {
        apiViews = data.pageviews;
      } else if (data && typeof data.count === 'number') {
        apiViews = data.count;
      } else if (Array.isArray(data) && data.length > 0) {
        // 如果返回数组，取第一个元素的 views 或 count
        const firstItem = data[0];
        apiViews = firstItem.views || firstItem.count || firstItem.pageviews || 0;
      }

      if (apiViews > 0) {
        // API 成功：使用 API 数据并同步到 localStorage
        updateViewCount(element, apiViews);
        localStorage.setItem(storageKey, apiViews.toString());
        
        // 记录本次访问（Umami 会自动记录，这里只是标记）
        sessionStorage.setItem(sessionKey, 'true');
      } else {
        // API 返回数据为空或格式不正确，降级到 localStorage
        useLocalStorageViews(pageUrl, element);
      }
    } catch (error) {
      // API 失败：自动降级到 localStorage 方案
      useLocalStorageViews(pageUrl, element);
    }
  }

  // 更新浏览量显示
  function updateViewCount(element, count) {
    if (!element) return;
    
    // 格式化数字（添加千分位分隔符）
    const formattedCount = formatNumber(count);
    
    // 获取当前显示的数字
    const currentText = element.textContent.replace(/[^\d]/g, '');
    const currentCount = currentText ? parseInt(currentText, 10) : 0;
    
    // 如果数字不同，使用动画更新；否则直接更新
    if (currentCount !== count) {
      animateNumber(element, currentCount || 0, count, 500);
    } else {
      element.textContent = formattedCount;
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

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostViews);
  } else {
    initPostViews();
  }

  // 支持 PJAX 重新初始化
  document.addEventListener('pjax:complete', initPostViews);
  
  // 导出全局函数供外部调用
  window.initPostViews = initPostViews;
})();