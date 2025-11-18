/* ===== 文章互动功能（点赞 + 转发） ===== */

(function() {
  'use strict';

  // ===== 点赞功能 =====
  class PostLike {
    constructor() {
      this.likeButton = document.getElementById('likeButton');
      this.likeCount = document.getElementById('likeCount');
      this.storageKey = 'post-likes';
      this.currentPostUrl = '';
      
      if (this.likeButton) {
        this.currentPostUrl = this.likeButton.getAttribute('data-post-url');
        this.init();
      }
    }
    
    init() {
      // 从localStorage加载点赞数据
      this.loadLikes();
      
      // 绑定点击事件
      this.likeButton.addEventListener('click', () => this.toggleLike());
    }
    
    // 获取所有点赞数据
    getAllLikes() {
      try {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
      } catch (error) {
        return {};
      }
    }
    
    // 保存点赞数据
    saveLikes(likes) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(likes));
      } catch (error) {
        // Silently fail if localStorage is unavailable
      }
    }
    
    // 加载点赞数据
    loadLikes() {
      const likes = this.getAllLikes();
      const postData = likes[this.currentPostUrl] || { count: 0, liked: false };
      
      // 更新UI
      this.updateUI(postData.count, postData.liked);
    }
    
    // 切换点赞状态
    toggleLike() {
      const likes = this.getAllLikes();
      const postData = likes[this.currentPostUrl] || { count: 0, liked: false };
      
      // 切换状态
      if (postData.liked) {
        // 取消点赞
        postData.count = Math.max(0, postData.count - 1);
        postData.liked = false;
      } else {
        // 点赞
        postData.count += 1;
        postData.liked = true;
      }
      
      // 保存数据
      likes[this.currentPostUrl] = postData;
      this.saveLikes(likes);
      
      // 更新UI
      this.updateUI(postData.count, postData.liked);
      
      // 播放动画
      if (postData.liked) {
        this.playLikeAnimation();
      }
    }
    
    // 更新UI
    updateUI(count, liked) {
      if (this.likeCount) {
        this.likeCount.textContent = count;
      }
      
      if (liked) {
        this.likeButton.classList.add('liked');
        const textSpan = this.likeButton.querySelector('.action-text');
        if (textSpan) {
          textSpan.textContent = window.siteConfig?.postActions?.like?.likedText || '已赞';
        }
      } else {
        this.likeButton.classList.remove('liked');
        const textSpan = this.likeButton.querySelector('.action-text');
        if (textSpan) {
          textSpan.textContent = window.siteConfig?.postActions?.like?.text || '点赞';
        }
      }
    }
    
    // 播放点赞动画
    playLikeAnimation() {
      // 创建飘心动画
      const heart = document.createElement('i');
      heart.className = 'fas fa-heart';
      heart.style.cssText = `
        position: fixed;
        left: ${event.clientX}px;
        top: ${event.clientY}px;
        color: #ff6b6b;
        font-size: 2rem;
        pointer-events: none;
        z-index: 9999;
        animation: floatHeart 1.5s ease-out forwards;
      `;
      
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 1500);
    }
    
    // 销毁（PJAX兼容）
    destroy() {
      if (this.likeButton) {
        this.likeButton.removeEventListener('click', () => this.toggleLike());
      }
    }
  }
  
  // 添加飘心动画样式
  if (!document.getElementById('like-animation-style')) {
    const style = document.createElement('style');
    style.id = 'like-animation-style';
    style.textContent = `
      @keyframes floatHeart {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-100px) scale(1.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // ===== 转发功能 =====
  class PostShare {
    constructor() {
      this.shareButton = document.getElementById('shareButton');
      this.sharePanel = document.getElementById('sharePanel');
      
      if (this.shareButton && this.sharePanel) {
        this.init();
      }
    }
    
    init() {
      // 绑定分享平台点击事件
      const platformItems = this.sharePanel.querySelectorAll('.share-platform-item');
      platformItems.forEach(item => {
        item.addEventListener('click', (e) => this.handleShare(e));
      });
    }
    
    // 处理分享
    handleShare(e) {
      e.preventDefault();
      
      const platform = e.currentTarget.getAttribute('data-platform');
      const urlTemplate = e.currentTarget.getAttribute('data-url');
      
      // 获取当前页面信息
      const pageUrl = encodeURIComponent(window.location.href);
      const pageTitle = encodeURIComponent(document.title);
      const pageDescription = encodeURIComponent(
        document.querySelector('meta[name="description"]')?.content || document.title
      );
      
      // 根据平台执行不同操作
      switch (platform) {
        case '微信':
          this.showWechatQRCode(window.location.href);
          break;
          
        case '复制链接':
          this.copyLink(window.location.href);
          break;
          
        default:
          // 其他平台：替换URL模板中的变量并打开新窗口
          if (urlTemplate) {
            const shareUrl = urlTemplate
              .replace('{url}', pageUrl)
              .replace('{title}', pageTitle)
              .replace('{description}', pageDescription);
            
            window.open(shareUrl, '_blank', 'width=600,height=400,menubar=no,toolbar=no');
          }
          break;
      }
    }
    
    // 显示微信分享二维码
    showWechatQRCode(url) {
      // 检查是否已存在二维码弹窗
      let popup = document.querySelector('.wechat-qrcode-popup');
      
      if (popup) {
        popup.remove();
      }
      
      // 创建新弹窗
      popup = document.createElement('div');
      popup.className = 'wechat-qrcode-popup';
      popup.innerHTML = `
        <div class="qrcode-overlay"></div>
        <div class="qrcode-content">
          <div class="qrcode-header">
            <span>微信扫一扫分享</span>
            <button class="qrcode-close">&times;</button>
          </div>
          <div class="qrcode-body">
            <div id="wechatQRCode"></div>
            <p class="qrcode-tip">打开微信扫一扫，分享到朋友圈</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(popup);
      
      // 生成二维码（使用简单的API服务）
      const qrcodeContainer = popup.querySelector('#wechatQRCode');
      const qrcodeImg = document.createElement('img');
      qrcodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      qrcodeImg.alt = '微信分享二维码';
      qrcodeContainer.appendChild(qrcodeImg);
      
      // 绑定关闭事件
      const closeBtn = popup.querySelector('.qrcode-close');
      const overlay = popup.querySelector('.qrcode-overlay');
      
      closeBtn.addEventListener('click', () => popup.remove());
      overlay.addEventListener('click', () => popup.remove());
      
      // 添加样式（如果不存在）
      if (!document.getElementById('wechat-qrcode-style')) {
        const style = document.createElement('style');
        style.id = 'wechat-qrcode-style';
        style.textContent = `
          .wechat-qrcode-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .qrcode-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            cursor: pointer;
          }
          
          .qrcode-content {
            position: relative;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 2rem;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 1;
          }
          
          .qrcode-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-color);
          }
          
          .qrcode-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-color-light);
            cursor: pointer;
            line-height: 1;
            padding: 0;
            width: 30px;
            height: 30px;
            transition: color 0.3s ease;
          }
          
          .qrcode-close:hover {
            color: var(--accent);
          }
          
          .qrcode-body {
            text-align: center;
          }
          
          #wechatQRCode {
            display: inline-block;
            padding: 1rem;
            background: #fff;
            border-radius: var(--border-radius);
            margin-bottom: 1rem;
          }
          
          #wechatQRCode img {
            display: block;
            width: 200px;
            height: 200px;
          }
          
          .qrcode-tip {
            color: var(--text-color-light);
            font-size: 0.9rem;
            margin: 0;
          }
          
          [data-theme="dark"] .qrcode-content {
            background: var(--dark-card-bg);
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // 复制链接
    copyLink(url) {
      // 尝试使用现代API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(() => this.showCopySuccess())
          .catch(() => this.fallbackCopy(url));
      } else {
        this.fallbackCopy(url);
      }
    }
    
    // 降级复制方案
    fallbackCopy(url) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.cssText = 'position: fixed; left: -9999px; top: -9999px;';
      document.body.appendChild(textarea);
      
      textarea.select();
      textarea.setSelectionRange(0, url.length);
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          this.showCopySuccess();
        } else {
          this.showCopyFail();
        }
      } catch (err) {
        this.showCopyFail();
      }
      
      document.body.removeChild(textarea);
    }
    
    // 显示复制成功提示
    showCopySuccess() {
      const tip = document.createElement('div');
      tip.className = 'copy-success-tip';
      tip.textContent = '✓ 链接已复制到剪贴板';
      document.body.appendChild(tip);
      
      setTimeout(() => tip.remove(), 2000);
    }
    
    // 显示复制失败提示
    showCopyFail() {
      const tip = document.createElement('div');
      tip.className = 'copy-success-tip';
      tip.textContent = '✗ 复制失败，请手动复制';
      tip.style.background = 'rgba(255, 0, 0, 0.8)';
      document.body.appendChild(tip);
      
      setTimeout(() => tip.remove(), 2000);
    }
    
    // 销毁（PJAX兼容）
    destroy() {
      const platformItems = this.sharePanel?.querySelectorAll('.share-platform-item');
      platformItems?.forEach(item => {
        item.removeEventListener('click', this.handleShare);
      });
    }
  }
  
  // ===== 打赏功能（保持原有逻辑） =====
  class PostReward {
    constructor() {
      this.rewardButton = document.getElementById('rewardButton');
      this.rewardPanel = document.getElementById('rewardPanel');
      
      if (this.rewardButton && this.rewardPanel) {
        this.init();
      }
    }
    
    init() {
      // 打赏按钮已通过CSS :hover 显示面板，无需额外JS
      // 这里保留接口以便未来扩展（如点击显示、统计等）
    }
    
    destroy() {
      // 预留销毁方法
    }
  }
  
  // ===== 初始化 =====
  let postLike, postShare, postReward;
  
  function initPostActions() {
    postLike = new PostLike();
    postShare = new PostShare();
    postReward = new PostReward();
  }
  
  function destroyPostActions() {
    postLike?.destroy();
    postShare?.destroy();
    postReward?.destroy();
    
    postLike = null;
    postShare = null;
    postReward = null;
  }
  
  // 首次加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostActions);
  } else {
    initPostActions();
  }
  
  // PJAX兼容
  if (window.siteConfig?.pjaxEnabled) {
    document.addEventListener('pjax:complete', () => {
      destroyPostActions();
      initPostActions();
    });
  }
  
})();

