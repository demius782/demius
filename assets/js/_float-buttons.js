// 回到顶部、侧栏切换、亮暗切换和按钮显示控制
document.addEventListener('DOMContentLoaded', function() {
    const topBtn = document.getElementById('back-to-top');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const readingProgress = document.getElementById('reading-progress');
    const immersiveMode = document.getElementById('immersive-mode');
    const danmakuMode = document.getElementById('danmaku-mode');
    const body = document.body;
    const html = document.documentElement;
    const fabSettings = document.getElementById('fab-settings');
    const fabContainer = document.querySelector('.floating-buttons');
  
    // 初始化按钮状态
    function initButtons() {
      // 确保按钮存在
      const buttons = [topBtn, fabSettings, sidebarToggle, themeToggle, readingProgress, immersiveMode, danmakuMode];
      buttons.forEach(function(btn){ 
        if (btn) {
          btn.style.display = 'flex';
        }
      });
      
      // 初始为收起状态（只露出设置按钮；extra 在 CSS 中定位到屏外）
      if (fabContainer) {
        fabContainer.classList.remove('fab-open');
      }
    }
  
    // 滚动显示/隐藏回到顶部按钮和更新阅读进度
    function handleScroll() {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 300;
      const hasClass = body.classList.contains('scrolled');
      
      if (shouldShow && !hasClass) {
        body.classList.add('scrolled');
      } else if (!shouldShow && hasClass) {
        body.classList.remove('scrolled');
      }
      
      // 更新阅读进度
      updateReadingProgress();
    }
    
    // 计算并更新阅读进度
    function updateReadingProgress() {
      if (!readingProgress) return;
      
      // 获取页面总高度和当前滚动位置
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // 计算可滚动距离
      const scrollableDistance = documentHeight - windowHeight;
      
      // 计算进度百分比 (1-100)
      let progress = 0;
      if (scrollableDistance > 0) {
        progress = Math.round((scrollTop / scrollableDistance) * 100);
        // 确保在1-100范围内
        progress = Math.max(1, Math.min(100, progress));
      } else {
        // 如果页面内容不足一屏，显示100
        progress = 100;
      }
      
      // 更新显示
      const progressNumber = readingProgress.querySelector('.progress-number');
      if (progressNumber) {
        progressNumber.textContent = progress;
      }
    }
  
    // 回到顶部功能
    function setupBackToTop() {
      if (!topBtn) return;
      
      // 立即检查一次滚动状态
      handleScroll();
      
      // 绑定滚动事件
      window.addEventListener('scroll', handleScroll);
      
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 设置按钮展开/收起其它按钮
    function setupFabToggle(){
      if (!fabSettings || !fabContainer) return;
      
      fabSettings.addEventListener('click', function(){
        fabContainer.classList.toggle('fab-open');
      });
    }
  
    // 侧栏切换功能
    function setupSidebarToggle() {
      if (!sidebarToggle) return;
      
      // 检查本地存储中的侧栏状态
      const sidebarState = localStorage.getItem('sidebar-hidden');
      if (sidebarState === 'true') {
        body.classList.add('sidebar-hidden');
        updateSidebarIcon(true);
      }
  
      sidebarToggle.addEventListener('click', () => {
        const isHidden = body.classList.toggle('sidebar-hidden');
        localStorage.setItem('sidebar-hidden', isHidden);
        updateSidebarIcon(isHidden);
      });
    }
  
    // 更新侧栏切换按钮图标
    function updateSidebarIcon(isHidden) {
      // 支持 FontAwesome 图标
      const icon = sidebarToggle.querySelector('i');
      if (icon) {
        if (isHidden) {
          icon.className = 'fas fa-columns';
          sidebarToggle.title = '显示侧栏';
        } else {
          icon.className = 'fas fa-times';
          sidebarToggle.title = '隐藏侧栏';
        }
      }
      
      // 支持 SVG 图标
      const svg = sidebarToggle.querySelector('svg');
      if (svg) {
        if (isHidden) {
          // 显示侧栏图标（展开图标）
          svg.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line>';
          sidebarToggle.title = '显示侧栏';
        } else {
          // 隐藏侧栏图标（收起图标）
          svg.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>';
          sidebarToggle.title = '隐藏侧栏';
        }
      }
    }
  
    // 亮暗切换功能
    function setupThemeToggle() {
      if (!themeToggle) return;
      
      // 初始化主题
      initTheme();
      
      // 绑定点击事件
      themeToggle.addEventListener('click', () => {
        toggleTheme();
      });
    }
  
    // 初始化主题
    function initTheme() {
      // 尝试从本地存储获取主题
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      // 应用主题
      applyTheme(currentTheme);
    }
  
    // 更新评论区颜色
    function updateCommentColors(theme) {
      const textColor = theme === 'dark' ? '#fff' : '#000';
      const inputColor = theme === 'dark' ? '#fff' : '#000'; // 输入框字体根据主题设置
      
      // 更新留言页面评论区
      const messageCommentSection = document.querySelector('.message-comment-section');
      if (messageCommentSection) {
        const textElements = messageCommentSection.querySelectorAll('p, span, div, li, td, th');
        textElements.forEach(el => {
          // 只更新文本元素，保留链接和按钮的原有颜色
          if (!el.closest('a') && !el.closest('button') && !el.closest('input') && !el.closest('textarea') && !el.closest('.atk-submit')) {
            el.style.color = textColor;
          }
        });
        // 更新容器本身的颜色
        messageCommentSection.style.color = textColor;
        
        // 更新输入框颜色
        const inputs = messageCommentSection.querySelectorAll('input, textarea, .atk-input, .atk-textarea');
        inputs.forEach(input => {
          input.style.color = inputColor;
        });
      }
      
      // 更新单页评论区（关于本站等）
      const artalkComment = document.querySelector('article.post #artalk-comment');
      if (artalkComment) {
        const textElements = artalkComment.querySelectorAll('p, span, div, li, td, th');
        textElements.forEach(el => {
          // 只更新文本元素，保留链接和按钮的原有颜色
          if (!el.closest('a') && !el.closest('button') && !el.closest('input') && !el.closest('textarea') && !el.closest('.atk-submit')) {
            el.style.color = textColor;
          }
        });
        // 更新容器本身的颜色
        artalkComment.style.color = textColor;
        
        // 更新输入框颜色
        const inputs = artalkComment.querySelectorAll('input, textarea, .atk-input, .atk-textarea');
        inputs.forEach(input => {
          input.style.color = inputColor;
        });
      }
      
      // 更新通用评论区（友链页面等，不在article.post内的）
      const allArtalkComments = document.querySelectorAll('#artalk-comment');
      allArtalkComments.forEach(commentEl => {
        // 跳过已经在article.post内的（上面已经处理过了）
        if (commentEl.closest('article.post')) {
          return;
        }
        
        const textElements = commentEl.querySelectorAll('p, span, div, li, td, th');
        textElements.forEach(el => {
          // 只更新文本元素，保留链接和按钮的原有颜色
          if (!el.closest('a') && !el.closest('button') && !el.closest('input') && !el.closest('textarea') && !el.closest('.atk-submit')) {
            el.style.color = textColor;
          }
        });
        // 更新容器本身的颜色
        commentEl.style.color = textColor;
        
        // 更新输入框颜色
        const inputs = commentEl.querySelectorAll('input, textarea, .atk-input, .atk-textarea');
        inputs.forEach(input => {
          input.style.color = inputColor;
        });
      });
    }
    
    // 延迟更新评论区颜色（用于处理动态加载的内容）
    function updateCommentColorsDelayed(theme) {
      // 立即执行一次
      updateCommentColors(theme);
      
      // 延迟执行，确保动态内容已加载
      setTimeout(() => updateCommentColors(theme), 100);
      setTimeout(() => updateCommentColors(theme), 500);
      setTimeout(() => updateCommentColors(theme), 1000);
    }
    
    // 切换主题
    function toggleTheme() {
      // 获取当前主题
      const currentTheme = html.getAttribute('data-theme') || 
                          html.getAttribute('theme') || 
                          (document.body.classList.contains('dark') ? 'dark' : 'light');
      
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // 应用新主题
      applyTheme(newTheme);
      
      // 保存到本地存储
      localStorage.setItem('theme', newTheme);
    }
  
    // 应用主题
    function applyTheme(theme) {
      // 尝试多种设置主题的方式
      html.setAttribute('data-theme', theme);
      html.setAttribute('theme', theme);
      
      // 使用类名方式
      if (theme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
      
      // 更新按钮图标
      updateThemeIcon(theme);
      
      // 更新评论区颜色
      updateCommentColorsDelayed(theme);
    }
    
    // 在 PJAX 完成后也更新评论区颜色
    document.addEventListener('pjax:complete', function() {
      const currentTheme = html.getAttribute('data-theme') || 'light';
      updateCommentColorsDelayed(currentTheme);
    });
    
    // 监听评论区内容变化，自动更新颜色
    function setupCommentColorObserver() {
      const messageCommentSection = document.querySelector('.message-comment-section');
      const artalkComment = document.querySelector('article.post #artalk-comment');
      
      const observer = new MutationObserver(function(mutations) {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        updateCommentColors(currentTheme);
      });
      
      if (messageCommentSection) {
        observer.observe(messageCommentSection, {
          childList: true,
          subtree: true
        });
      }
      
      if (artalkComment) {
        observer.observe(artalkComment, {
          childList: true,
          subtree: true
        });
      }
    }
    
    // 初始化评论区颜色观察器
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupCommentColorObserver);
    } else {
      setupCommentColorObserver();
    }
    
    // PJAX 完成后重新设置观察器
    document.addEventListener('pjax:complete', function() {
      setTimeout(setupCommentColorObserver, 100);
    });
  
    // 更新主题切换按钮图标
    function updateThemeIcon(theme) {
      // 支持 FontAwesome 图标
      const icon = themeToggle.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
          themeToggle.title = '切换到浅色模式';
        } else {
          icon.className = 'fas fa-moon';
          themeToggle.title = '切换到深色模式';
        }
      }
      
      // 支持 SVG 图标
      const svg = themeToggle.querySelector('svg');
      if (svg) {
        if (theme === 'dark') {
          // 太阳图标（浅色模式）
          svg.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
          themeToggle.title = '切换到浅色模式';
        } else {
          // 月亮图标（暗色模式）
          svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
          themeToggle.title = '切换到深色模式';
        }
      }
    }
  
    // 沉浸阅读模式功能
    function setupImmersiveMode() {
      if (!immersiveMode) return;
      
      // 检查本地存储中的沉浸模式状态
      const immersiveState = localStorage.getItem('immersive-mode');
      if (immersiveState === 'true') {
        body.classList.add('immersive-mode');
      }
      
      immersiveMode.addEventListener('click', () => {
        const isImmersive = body.classList.toggle('immersive-mode');
        localStorage.setItem('immersive-mode', isImmersive);
      });
    }
  
    // 初始化所有功能
    function init() {
      initButtons();
      setupBackToTop();
      setupSidebarToggle();
      setupThemeToggle();
      setupImmersiveMode();
      setupFabToggle();
      
      // 再次确保滚动状态正确
      setTimeout(() => {
        handleScroll();
      }, 100);
    }
  
    init();
  });
  
  // 添加额外的滚动检测，确保不会漏掉
  window.addEventListener('load', function() {
    const body = document.body;
    const scrollY = window.scrollY;
    
    if (scrollY > 300) {
      body.classList.add('scrolled');
    }
  });