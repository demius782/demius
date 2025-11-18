// 评论弹幕功能
(function() {
  'use strict';
  
  // 评论弹幕类
  class CommentDanmaku {
    constructor(container) {
      this.container = container;
      this.danmakuItems = [];
      this.comments = [];
      this.isActive = false;
      this.updateTimer = null;
      this.config = window.siteConfig?.danmaku || {};
      this.artalkConfig = window.siteConfig || {};
      
      // 弹幕配置
      this.speed = this.config.speed || 3;
      this.fontSize = this.config.fontSize || 16;
      this.opacity = this.config.opacity || 0.9;
      this.maxCount = this.config.maxCount || 50;
      this.updateInterval = this.config.updateInterval || 30000;
      this.showAvatar = this.config.showAvatar !== false;
      this.showTime = this.config.showTime !== false;
      this.loop = this.config.loop !== false;  // 循环播放
      this.randomPosition = this.config.randomPosition !== false;  // 随机位置
      this.colorful = this.config.colorful !== false;  // 彩色弹幕
      this.antiOverlap = this.config.antiOverlap !== false;  // 防重叠
      
      // 彩色弹幕颜色库
      this.colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B500', '#FF69B4', '#00CED1', '#FFD700',
        '#E74C3C', '#3498DB', '#2ECC71', '#F39C12',
        '#9B59B6', '#1ABC9C', '#E67E22', '#16A085'
      ];
      
      // 弹幕轨道
      this.tracks = [];
      this.trackHeight = 60; // 每条轨道高度
      this.initTracks();
      
      // 循环播放相关
      this.allComments = [];  // 存储所有评论
      this.displayedComments = new Set();  // 已显示的评论ID
      
      // 防重叠相关
      this.activeDanmakus = [];  // 当前屏幕上的弹幕信息
    }
    
    initTracks() {
      const trackCount = Math.floor((window.innerHeight - 100) / this.trackHeight);
      this.tracks = Array(trackCount).fill(null).map(() => ({
        occupied: false,
        lastDanmakuTime: 0
      }));
    }
    
    // 检测Y位置是否会重叠（完全不重叠版本）
    checkOverlap(y, danmakuHeight = 60) {
      if (!this.antiOverlap) return false;
      
      const now = Date.now();
      const safeDistance = 12; // 安全距离（像素）
      const totalHeight = danmakuHeight + safeDistance; // 70-72px
      
      // 检查当前屏幕上的弹幕
      for (let item of this.activeDanmakus) {
        // 计算垂直距离
        const distance = Math.abs(item.y - y);
        
        // 如果垂直距离小于总高度，需要检查水平位置
        if (distance < totalHeight) {
          // 计算前方弹幕的当前X位置
          const timeElapsed = (now - item.startTime) / 1000; // 秒
          const itemX = window.innerWidth - (item.speed * 50 * timeElapsed);
          
          // 计算新弹幕的预期X位置（从右侧开始）
          const newX = window.innerWidth;
          
          // 计算两个弹幕的水平间距
          const horizontalGap = newX - itemX;
          
          // 如果前方弹幕还在屏幕内
          if (itemX > -item.width) {
            // 计算弹幕宽度的安全系数（考虑弹幕可能很宽）
            const minHorizontalGap = Math.max(item.width, 200); // 至少200px或前方弹幕宽度
            
            // 如果水平间距不够，判定为重叠
            if (horizontalGap < minHorizontalGap) {
              return true;
            }
          }
        }
      }
      
      return false;
    }
    
    // 获取Y轴位置（带防重叠）
    getYPosition() {
      if (this.randomPosition) {
        // 随机位置模式：在整个可用高度内随机选择
        const minY = 50;
        const maxY = window.innerHeight - 100;
        
        // 如果启用防重叠，尝试多次找到不重叠的位置
        if (this.antiOverlap) {
          let attempts = 0;
          const maxAttempts = 50; // 增加到50次尝试
          
          while (attempts < maxAttempts) {
            const y = minY + Math.random() * (maxY - minY);
            if (!this.checkOverlap(y)) {
              return y;
            }
            attempts++;
          }
          
          // 如果50次都找不到，使用固定轨道模式
          // 找到一个未被占用的轨道
          for (let i = 0; i < this.tracks.length; i++) {
            if (!this.tracks[i].occupied) {
              return { trackIndex: i, y: 50 + i * this.trackHeight, fallback: true };
            }
          }
          
          // 如果所有轨道都被占用，找最早释放的轨道
          const now = Date.now();
          let oldestTrack = 0;
          let oldestTime = this.tracks[0].lastDanmakuTime;
          
          for (let i = 1; i < this.tracks.length; i++) {
            if (this.tracks[i].lastDanmakuTime < oldestTime) {
              oldestTime = this.tracks[i].lastDanmakuTime;
              oldestTrack = i;
            }
          }
          
          return { trackIndex: oldestTrack, y: 50 + oldestTrack * this.trackHeight, fallback: true };
        }
        
        return minY + Math.random() * (maxY - minY);
      } else {
        // 固定轨道模式：选择可用轨道
        const now = Date.now();
        for (let i = 0; i < this.tracks.length; i++) {
          if (!this.tracks[i].occupied && now - this.tracks[i].lastDanmakuTime > 2000) {
            return { trackIndex: i, y: 50 + i * this.trackHeight };
          }
        }
        // 如果没有可用轨道，随机选择一个
        const trackIndex = Math.floor(Math.random() * this.tracks.length);
        return { trackIndex: trackIndex, y: 50 + trackIndex * this.trackHeight };
      }
    }
    
    // 获取评论数据
    async fetchComments() {
      try {
        const server = this.artalkConfig.artalkServer;
        const site = this.artalkConfig.artalkSite;
        
        if (!server || !site) {
          return [];
        }
        
        // 根据scope配置选择不同的API
        const scope = this.config.scope || 'all';
        const currentPage = window.siteConfig?.currentPage || {};
        let url;
        
        if (scope === 'all') {
          // 全站评论 - 使用 latest_comments API
          url = `${server}/api/v2/stats/latest_comments?site_name=${encodeURIComponent(site)}&limit=${this.maxCount}`;
        } else {
          // 特定页面评论 - 使用 comments API
          const params = new URLSearchParams({
            site_name: site,
            limit: this.maxCount.toString(),
            offset: '0'
          });
          
          if (scope === 'page' && currentPage.url) {
            params.append('page_key', currentPage.url);
          } else if (scope === 'post' && currentPage.type === 'posts' && currentPage.url) {
            params.append('page_key', currentPage.url);
          }
          
          url = `${server}/api/v2/comments?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
      } catch (error) {
        return [];
      }
    }
    
    // 创建弹幕元素
    createDanmakuElement(comment) {
      const danmaku = document.createElement('div');
      danmaku.className = 'danmaku-item';
      danmaku.style.opacity = this.opacity;
      
      // 彩色弹幕
      if (this.colorful) {
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        danmaku.style.setProperty('--danmaku-color', randomColor);
        danmaku.classList.add('danmaku-colorful');
      }
      
      // 获取头像（参考侧栏评论的逻辑）
      const getAvatar = (c) => {
        if (c.avatar_url?.trim()) return c.avatar_url;
        if (c.avatar?.trim()) return c.avatar;
        if (c.email_encrypted?.trim()) {
          return `https://weavatar.com/avatar/${c.email_encrypted}?d=mp&s=80`;
        }
        return 'https://cravatar.cn/avatar/default?s=80';
      };
      
      // 头像
      if (this.showAvatar) {
        const avatar = document.createElement('img');
        avatar.className = 'danmaku-avatar';
        avatar.src = getAvatar(comment);
        avatar.alt = comment.nick || '匿名用户';
        avatar.onerror = () => {
          avatar.src = 'https://cravatar.cn/avatar/default?s=80';
        };
        danmaku.appendChild(avatar);
      }
      
      // 内容区
      const content = document.createElement('div');
      content.className = 'danmaku-content';
      
      // 作者信息
      const author = document.createElement('div');
      author.className = 'danmaku-author';
      
      const authorName = document.createElement('span');
      authorName.className = 'danmaku-author-name';
      authorName.textContent = comment.nick || '匿名用户';
      author.appendChild(authorName);
      
      // 时间（使用 date 字段，参考侧栏评论）
      if (this.showTime) {
        const time = document.createElement('span');
        time.className = 'danmaku-time';
        const timeStr = comment.date || comment.created_at;
        time.textContent = this.formatTime(timeStr);
        author.appendChild(time);
      }
      
      content.appendChild(author);
      
      // 评论文字
      const text = document.createElement('div');
      text.className = 'danmaku-text';
      
      // 提取纯文本内容（去除HTML和表情包）
      let textContent = this.stripHtml(comment.content || '');
      
      // 如果文本为空或只有空白，返回null（后续跳过此评论）
      if (!textContent || textContent.trim().length === 0) {
        return null; // 纯表情评论不显示
      }
      
      // 限制长度（防止弹幕过长）
      if (textContent.length > 100) {
        textContent = textContent.substring(0, 100) + '...';
      }
      
      text.textContent = textContent;
      content.appendChild(text);
      
      danmaku.appendChild(content);
      
      // 页面标识（如果是全站弹幕，使用 page_title）
      if (this.config.scope === 'all' && comment.page_title) {
        const page = document.createElement('span');
        page.className = 'danmaku-page';
        page.textContent = comment.page_title;
        danmaku.appendChild(page);
      }
      
      // 点击跳转到评论
      danmaku.style.cursor = 'pointer';
      danmaku.addEventListener('click', () => {
        this.jumpToComment(comment);
      });
      
      // 悬停暂停
      danmaku.addEventListener('mouseenter', () => {
        danmaku.classList.add('paused');
      });
      
      danmaku.addEventListener('mouseleave', () => {
        danmaku.classList.remove('paused');
      });
      
      return danmaku;
    }
    
    // 添加弹幕
    addDanmaku(comment) {
      // 防止重复添加：如果评论ID已显示，跳过
      if (comment.id && this.displayedComments.has(comment.id)) {
        // 检查是否已经在屏幕上（可能在动画中）
        const alreadyOnScreen = this.danmakuItems.some(item => 
          item.comment && item.comment.id === comment.id
        );
        if (alreadyOnScreen) {
          return;
        }
      }
      
      const danmaku = this.createDanmakuElement(comment);
      
      // 如果是纯表情评论，跳过
      if (!danmaku) {
        return;
      }
      
      // 获取Y轴位置
      const position = this.getYPosition();
      let y, trackIndex = null, isFallback = false;
      
      if (this.randomPosition) {
        // 随机位置模式
        if (typeof position === 'object' && position.fallback) {
          // 降级到固定轨道
          y = position.y;
          trackIndex = position.trackIndex;
          isFallback = true;
        } else {
          // 正常随机位置
          y = position;
        }
      } else {
        // 固定轨道模式：position是对象
        y = position.y;
        trackIndex = position.trackIndex;
        // 标记轨道占用
        this.tracks[trackIndex].occupied = true;
      }
      
      // 设置初始位置
      danmaku.style.top = `${y}px`;
      danmaku.style.left = `${window.innerWidth}px`;
      
      this.container.appendChild(danmaku);
      
      // 计算宽度和速度
      const width = danmaku.offsetWidth;
      const duration = (window.innerWidth + width) / (this.speed * 50); // 速度调整
      
      // 记录到活动弹幕列表（用于防重叠检测）
      const danmakuInfo = {
        y: y,
        speed: this.speed,
        startTime: Date.now(),
        width: width
      };
      this.activeDanmakus.push(danmakuInfo);
      
      // 动画
      const animation = danmaku.animate([
        { transform: 'translateX(0)' },
        { transform: `translateX(-${window.innerWidth + width}px)` }
      ], {
        duration: duration * 1000,
        easing: 'linear',
        fill: 'forwards'
      });
      
      // 动画结束移除
      animation.onfinish = () => {
        danmaku.remove();
        
        // 固定轨道模式才需要释放轨道
        if ((!this.randomPosition || isFallback) && trackIndex !== null) {
          this.tracks[trackIndex].occupied = false;
          this.tracks[trackIndex].lastDanmakuTime = Date.now();
        }
        
        // 从活动弹幕列表移除
        const activeIndex = this.activeDanmakus.indexOf(danmakuInfo);
        if (activeIndex > -1) {
          this.activeDanmakus.splice(activeIndex, 1);
        }
        
        const index = this.danmakuItems.findIndex(item => item.element === danmaku);
        if (index > -1) {
          this.danmakuItems.splice(index, 1);
        }
        
        // 如果启用循环且弹幕数量少于限制，从已显示列表中移除此评论ID，允许重新显示
        if (this.loop && comment.id) {
          this.displayedComments.delete(comment.id);
        }
      };
      
      this.danmakuItems.push({
        element: danmaku,
        animation: animation,
        comment: comment
      });
      
      // 标记此评论已显示
      if (comment.id) {
        this.displayedComments.add(comment.id);
      }
    }
    
    // 启动弹幕
    async start() {
      if (this.isActive) return;
      
      // 防止重复启动：清理可能存在的旧状态
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }
      if (this.loopTimer) {
        clearInterval(this.loopTimer);
        this.loopTimer = null;
      }
      
      // 清理所有现有弹幕
      this.danmakuItems.forEach(item => {
        if (item.animation) {
          item.animation.cancel();
        }
        if (item.element) {
          item.element.remove();
        }
      });
      this.danmakuItems = [];
      this.activeDanmakus = [];
      this.displayedComments.clear();
      this.allComments = [];
      
      // 重置轨道
      this.initTracks();
      
      this.isActive = true;
      this.container.style.display = 'block';
      
      // 淡入
      setTimeout(() => {
        this.container.classList.add('active');
      }, 10);
      
      // 延迟一下再获取评论，确保DOM完全准备好
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 获取并显示评论
      await this.updateComments();
      
      // 定时更新（获取新评论）
      this.updateTimer = setInterval(() => {
        if (this.isActive) {
          this.updateComments();
        }
      }, this.updateInterval);
      
      // 如果启用循环，每5秒检查一次，确保有足够的弹幕在屏幕上
      if (this.loop) {
        this.loopTimer = setInterval(() => {
          if (this.isActive && this.danmakuItems.length < this.maxCount / 2) {
            this.updateComments();
          }
        }, 5000);
      }
    }
    
    // 停止弹幕
    stop() {
      if (!this.isActive) return;
      
      this.isActive = false;
      this.container.classList.remove('active');
      
      // 清除定时器
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }
      
      // 清除循环定时器
      if (this.loopTimer) {
        clearInterval(this.loopTimer);
        this.loopTimer = null;
      }
      
      // 淡出后隐藏
      setTimeout(() => {
        this.container.style.display = 'none';
        
        // 清除所有弹幕
        this.danmakuItems.forEach(item => {
          if (item.animation) {
            item.animation.cancel();
          }
          if (item.element) {
            item.element.remove();
          }
        });
        this.danmakuItems = [];
        
        // 重置轨道
        this.tracks.forEach(track => {
          track.occupied = false;
          track.lastDanmakuTime = 0;
        });
      }, 300);
    }
    
    // 更新评论（防止重复调用导致重复弹幕）
    async updateComments() {
      // 如果正在更新中，跳过本次更新
      if (this._isUpdating) {
        return;
      }
      
      this._isUpdating = true;
      
      try {
        const newComments = await this.fetchComments();
        
        // 首次获取或定时更新时，更新评论库
        if (newComments.length > 0) {
          // 合并新评论到现有评论库（去重）
          const existingIds = new Set(this.allComments.map(c => c.id));
          const uniqueNewComments = newComments.filter(c => c.id && !existingIds.has(c.id));
          this.allComments = [...this.allComments, ...uniqueNewComments];
        }
        
        // 如果没有评论，直接返回
        if (this.allComments.length === 0) {
          return;
        }
        
        // 循环播放逻辑
        if (this.loop) {
          // 如果所有评论都已显示，重置显示记录
          if (this.displayedComments.size >= this.allComments.length) {
            this.displayedComments.clear();
          }
          
          // 获取未显示的评论
          const unshownComments = this.allComments.filter(c => c.id && !this.displayedComments.has(c.id));
          
          // 计算需要添加的数量（避免重复添加）
          const currentCount = this.danmakuItems.length;
          const remaining = this.maxCount - currentCount;
          
          if (remaining > 0 && unshownComments.length > 0) {
            // 如果当前弹幕数量少于最大值，继续添加
            const toAdd = unshownComments.slice(0, Math.min(remaining, unshownComments.length));
            
            // 添加弹幕（间隔添加，避免同时出现）
            toAdd.forEach((comment, index) => {
              setTimeout(() => {
                if (this.isActive && this.danmakuItems.length < this.maxCount) {
                  // 再次检查是否已显示（防止重复）
                  if (!this.displayedComments.has(comment.id)) {
                    this.addDanmaku(comment);
                  }
                }
              }, index * 500);
            });
          }
        } else {
          // 非循环模式：只显示未显示过的评论
          const fresh = this.allComments.filter(c => c.id && !this.displayedComments.has(c.id));
          
          // 计算需要添加的数量
          const currentCount = this.danmakuItems.length;
          const remaining = this.maxCount - currentCount;
          
          if (remaining > 0 && fresh.length > 0) {
            const toAdd = fresh.slice(0, Math.min(remaining, fresh.length));
            
            // 添加新评论（间隔添加，避免同时出现）
            toAdd.forEach((comment, index) => {
              setTimeout(() => {
                if (this.isActive && this.danmakuItems.length < this.maxCount) {
                  // 再次检查是否已显示（防止重复）
                  if (!this.displayedComments.has(comment.id)) {
                    this.addDanmaku(comment);
                  }
                }
              }, index * 500);
            });
          }
        }
      } finally {
        // 延迟重置更新标志，防止过于频繁的调用
        setTimeout(() => {
          this._isUpdating = false;
        }, 1000);
      }
    }
    
    // 跳转到评论
    jumpToComment(comment) {
      // 使用 page_url 字段（参考侧栏评论）
      const pageUrl = comment.page_url || comment.page_key || '';
      const commentId = comment.id || '';
      
      if (!pageUrl) {
        return;
      }
      
      try {
        // 转换为相对路径（如果是同域）
        const origin = location.origin;
        const url = new URL(pageUrl, origin);
        let targetUrl = url.href;
        
        if (url.origin === origin) {
          targetUrl = url.pathname + url.search + url.hash;
        }
        
        // 添加评论ID锚点
        if (commentId) {
          targetUrl += (targetUrl.includes('#') ? '' : '#') + `atk-comment-${commentId}`;
        }
        
        // 判断是否当前页面
        const currentPath = window.location.pathname;
        if (url.pathname === currentPath) {
          // 当前页面，滚动到评论
          const commentElement = document.getElementById(`atk-comment-${commentId}`);
          if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // 如果找不到具体评论，滚动到评论区
            const commentSection = document.querySelector('.artalk');
            if (commentSection) {
              commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        } else {
          // 其他页面，直接跳转
          window.location.href = targetUrl;
        }
      } catch (error) {
        // 降级处理：直接使用原始URL
        window.location.href = pageUrl;
      }
    }
    
    // 辅助函数：去除HTML标签
    stripHtml(html) {
      if (!html) return '';
      
      // 创建临时元素解析HTML
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      
      // 移除 <img>、<picture>、<atok-emoticon> 等标签（Artalk表情包）
      const removeSelectors = [
        'img', 
        'picture', 
        'atok-emoticon',  // Artalk表情包标签
        'emoji',
        'svg',
        'iframe',
        'video'
      ];
      
      removeSelectors.forEach(selector => {
        const elements = tmp.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      // 获取纯文本
      let text = tmp.textContent || tmp.innerText || '';
      
      // 移除多余空白
      text = text.replace(/\s+/g, ' ').trim();
      
      return text;
    }
    
    // 辅助函数：格式化时间
    formatTime(timestamp) {
      const now = new Date();
      const date = new Date(timestamp);
      const diff = Math.floor((now - date) / 1000);
      
      if (diff < 60) return '刚刚';
      if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
      
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
  }
  
  // 初始化弹幕功能（支持PJAX，防止重复初始化）
  function initDanmaku() {
    const danmakuBtn = document.getElementById('danmaku-mode');
    const danmakuContainer = document.getElementById('danmaku-container');
    
    if (!danmakuBtn || !danmakuContainer) {
      return;
    }
    
    // 获取配置
    const config = window.siteConfig?.danmaku || {};
    
    // 如果配置明确禁用，才隐藏按钮
    if (config.enable === false) {
      danmakuBtn.style.display = 'none';
      return;
    }
    
    // 防止重复初始化：如果已经初始化过，先清理
    if (danmakuBtn._danmakuInitialized) {
      // 移除旧的事件监听器
      if (danmakuBtn._danmakuClickHandler) {
        danmakuBtn.removeEventListener('click', danmakuBtn._danmakuClickHandler);
      }
      
      // 停止旧的弹幕实例
      if (danmakuBtn._danmakuInstance && danmakuBtn._danmakuInstance.isActive) {
        danmakuBtn._danmakuInstance.stop();
      }
      
      // 清理旧的resize监听器
      if (danmakuBtn._danmakuResizeHandler) {
        window.removeEventListener('resize', danmakuBtn._danmakuResizeHandler);
      }
    }
    
    // 创建弹幕实例
    let danmakuInstance = null;
    let isActive = false;
    
    // 切换弹幕（使用命名函数，便于后续移除）
    const clickHandler = async () => {
      if (!isActive) {
        // 开启弹幕
        // 如果实例存在且仍在运行，先停止并清理
        if (danmakuInstance && danmakuInstance.isActive) {
          danmakuInstance.stop();
          // 等待停止完成，确保所有动画和定时器都清理完毕
          await new Promise(resolve => setTimeout(resolve, 400));
        }
        
        // 创建新实例（每次都创建新实例，确保状态干净）
        if (danmakuInstance) {
          // 彻底清理旧实例
          if (danmakuInstance.updateTimer) {
            clearInterval(danmakuInstance.updateTimer);
            danmakuInstance.updateTimer = null;
          }
          if (danmakuInstance.loopTimer) {
            clearInterval(danmakuInstance.loopTimer);
            danmakuInstance.loopTimer = null;
          }
          // 清理所有弹幕元素
          if (danmakuInstance.danmakuItems) {
            danmakuInstance.danmakuItems.forEach(item => {
              if (item.animation) {
                item.animation.cancel();
              }
              if (item.element) {
                item.element.remove();
              }
            });
          }
        }
        
        // 创建全新的实例
        danmakuInstance = new CommentDanmaku(danmakuContainer);
        danmakuBtn._danmakuInstance = danmakuInstance;
        
        await danmakuInstance.start();
        isActive = true;
        danmakuBtn.classList.add('active');
      } else {
        // 关闭弹幕
        if (danmakuInstance) {
          danmakuInstance.stop();
        }
        isActive = false;
        danmakuBtn.classList.remove('active');
      }
    };
    
    // 保存handler引用，以便后续移除
    danmakuBtn._danmakuClickHandler = clickHandler;
    danmakuBtn.addEventListener('click', clickHandler);
    
    // 窗口大小改变时重新初始化轨道（使用命名函数，便于后续移除）
    let resizeTimer;
    const resizeHandler = () => {
      if (danmakuInstance) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          danmakuInstance.initTracks();
        }, 300);
      }
    };
    
    danmakuBtn._danmakuResizeHandler = resizeHandler;
    window.addEventListener('resize', resizeHandler);
    
    // 标记已初始化
    danmakuBtn._danmakuInitialized = true;
  }
  
  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDanmaku);
  } else {
    initDanmaku();
  }
  
  // 导出到全局供PJAX使用
  window.initDanmaku = initDanmaku;
})();
