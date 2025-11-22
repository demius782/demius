// 顶部公告栏功能
(function() {
  'use strict';
  
  const announcementEl = document.getElementById('top-announcement');
  if (!announcementEl) return;
  
  const mode = announcementEl.getAttribute('data-mode');
  
  // 说说轮播模式
  if (mode === 'shuoshuo') {
    initShuoshuoCarousel();
  }
  
  function initShuoshuoCarousel() {
    const carouselTrack = document.getElementById('announcement-carousel-track');
    const indicators = document.getElementById('announcement-carousel-indicators');
    if (!carouselTrack || !indicators) return;
    
    // 从配置中获取参数（通过全局配置或从元素属性读取）
    const config = window.siteConfig?.topAnnouncement || {};
    const apiUrl = config.shuoshuo?.apiUrl || '';
    const count = Math.min(Math.max(config.shuoshuo?.count || 3, 1), 5); // 限制1-5条
    const interval = config.shuoshuo?.interval || 5000;
    const transitionDuration = Math.max(Math.min(config.shuoshuo?.transitionDuration || 500, 2000), 0); // 限制0-2000ms
    const showAvatar = config.shuoshuo?.showAvatar !== false;
    const showTime = config.shuoshuo?.showTime !== false;
    const cacheDuration = config.shuoshuo?.cacheDuration || 1800000;
    const clickable = config.shuoshuo?.clickable !== false; // 默认可点击
    const shuoshuoPageUrl = config.shuoshuo?.shuoshuoPageUrl || '/shuoshuo/';
    
    // 初始化时设置过渡时间
    carouselTrack.style.transition = `transform ${transitionDuration}ms ease`;
    
    let currentIndex = 0;
    let talks = [];
    let carouselTimer = null;
    
    // 格式化时间
    function formatTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 7) return `${days}天前`;
      
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
    
    // 格式化说说内容（简化版，只显示文字）
    function formatContent(content) {
      if (!content) return '';
      // 移除Markdown链接格式，只保留文字
      return content
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\n/g, ' ')
        .trim();
    }
    
    // 渲染轮播项
    function renderCarouselItems() {
      if (talks.length === 0) {
        carouselTrack.innerHTML = '<div class="announcement-carousel-item"><div class="announcement-carousel-item-content"><div class="announcement-carousel-item-text">暂无说说</div></div></div>';
        return;
      }
      
      const itemsToShow = talks.slice(0, count);
      carouselTrack.innerHTML = itemsToShow.map((talk, index) => {
        const content = formatContent(talk.content);
        const avatar = talk.user?.avatarUrl || '';
        const time = showTime ? formatTime(talk.createdAt) : '';
        const talkId = talk.id || '';
        const clickableClass = clickable ? 'announcement-carousel-item-clickable' : '';
        const clickableAttr = clickable && talkId ? `data-talk-id="${talkId}"` : '';
        
        return `
          <div class="announcement-carousel-item ${clickableClass}" data-index="${index}" ${clickableAttr}>
            <div class="announcement-carousel-item-content">
              ${showAvatar && avatar ? `<img src="${avatar}" alt="avatar" class="announcement-carousel-item-avatar" onerror="this.style.display='none'">` : ''}
              <div class="announcement-carousel-item-text">${content || '暂无内容'}</div>
              ${time ? `<div class="announcement-carousel-item-time">${time}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');
      
      // 绑定点击跳转事件
      if (clickable) {
        carouselTrack.querySelectorAll('.announcement-carousel-item-clickable').forEach((item) => {
          const talkId = item.getAttribute('data-talk-id');
          if (talkId) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
              // 阻止事件冒泡，避免影响轮播
              e.stopPropagation();
              // 跳转到说说页面，使用ID作为URL参数
              const targetUrl = `${shuoshuoPageUrl}?id=${talkId}`;
              // 直接使用普通跳转，确保URL参数正确传递
              window.location.href = targetUrl;
            });
          }
        });
      }
      
      // 渲染指示器
      indicators.innerHTML = itemsToShow.map((_, index) => 
        `<div class="announcement-carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
      ).join('');
      
      // 绑定指示器点击事件
      indicators.querySelectorAll('.announcement-carousel-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          goToSlide(index);
        });
      });
    }
    
    // 切换到指定幻灯片
    function goToSlide(index) {
      if (talks.length === 0) return;
      const itemsToShow = Math.min(talks.length, count);
      if (index < 0 || index >= itemsToShow) return;
      
      currentIndex = index;
      const translateX = -currentIndex * 100;
      // 动态设置过渡时间
      carouselTrack.style.transition = `transform ${transitionDuration}ms ease`;
      carouselTrack.style.transform = `translateX(${translateX}%)`;
      
      // 更新指示器
      indicators.querySelectorAll('.announcement-carousel-indicator').forEach((ind, i) => {
        ind.classList.toggle('active', i === currentIndex);
      });
    }
    
    // 下一张
    function nextSlide() {
      const itemsToShow = Math.min(talks.length, count);
      if (itemsToShow === 0) return;
      const nextIndex = (currentIndex + 1) % itemsToShow;
      goToSlide(nextIndex);
    }
    
    // 开始自动轮播
    function startCarousel() {
      if (carouselTimer) clearInterval(carouselTimer);
      if (talks.length <= 1) return;
      
      carouselTimer = setInterval(() => {
        nextSlide();
      }, interval);
    }
    
    // 停止自动轮播
    function stopCarousel() {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
    }
    
    // 鼠标悬停时暂停轮播
    announcementEl.addEventListener('mouseenter', stopCarousel);
    announcementEl.addEventListener('mouseleave', () => {
      if (talks.length > 1) startCarousel();
    });
    
    // 获取说说数据
    function fetchTalks() {
      const cacheKey = 'topAnnouncementTalksCache';
      const cacheTimeKey = 'topAnnouncementTalksCacheTime';
      
      // 检查缓存
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);
      const currentTime = Date.now();
      
      if (cachedData && cachedTime && (currentTime - parseInt(cachedTime) < cacheDuration)) {
        try {
          talks = JSON.parse(cachedData);
          renderCarouselItems();
          startCarousel();
          return;
        } catch (e) {
          console.error('Failed to parse cached talks:', e);
        }
      }
      
      // 从API获取
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size: count
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.code === 0 && data.data && Array.isArray(data.data.list)) {
          talks = data.data.list.slice(0, count);
          localStorage.setItem(cacheKey, JSON.stringify(talks));
          localStorage.setItem(cacheTimeKey, currentTime.toString());
          renderCarouselItems();
          startCarousel();
        } else {
          console.warn('Invalid API response:', data);
          talks = [];
          renderCarouselItems();
        }
      })
      .catch(error => {
        console.error('Error fetching talks:', error);
        talks = [];
        renderCarouselItems();
      });
    }
    
    // 初始化
    fetchTalks();
    
    // 导出到全局，供PJAX使用
    window.initTopAnnouncement = function() {
      fetchTalks();
    };
  }
})();

