// 主页大图功能控制 - 类似Butterfly主题效果
function initHomeBigImageGlobal() {
    // 初始化主页大图功能
    initHomeBigImage();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initHomeBigImageGlobal);

// 暴露到全局作用域，供pjax调用
window.initHomeBigImage = initHomeBigImageGlobal;

// 初始化主页大图功能
function initHomeBigImage() {
    const enabled = getConfig('homeBigImageEnabled') === 'true';
    const mode = getConfig('homeBigImageMode') || 'mode1';
    
    if (!enabled) return;
    
    // 设置CSS变量
    setHomeBigImageCSSVariables();
    
    if (mode === 'mode1') {
        initMode1();
    } else if (mode === 'mode2') {
        initMode2();
    }
}

// 设置CSS变量
function setHomeBigImageCSSVariables() {
    const mode1BackgroundImage = getConfig('homeBigImageMode1BackgroundImage');
    const overlayOpacity = getConfig('homeBigImageMode2OverlayOpacity') || '0.3';
    const siteBackgroundImage = getConfig('siteBackgroundImage');
    const siteBackgroundEnabled = getConfig('siteBackgroundEnabled') === 'true'; // 检查整站背景图是否启用
    const siteBackgroundBlur = getConfig('siteBackgroundBlur') || '0';
    const siteBackgroundBrightness = getConfig('siteBackgroundBrightness') || '100';
    const siteBackgroundOpacity = getConfig('siteBackgroundOpacity') || '80';
    const mode2CustomBackgroundImage = getConfig('homeBigImageMode2CustomBackgroundImage');
    
    // Mode1 使用单独的图片
    if (mode1BackgroundImage) {
        document.documentElement.style.setProperty('--home-big-image-mode1-bg', `url('${mode1BackgroundImage}')`);
    }
    
    // Mode2 背景图配置：
    // - 如果设置了独立背景图，大图区域使用独立背景图，内容区域使用整站背景图（如果启用）
    // - 如果没有设置独立背景图，大图和内容区域都使用整站背景图（如果启用）
    let mode2BackgroundImage = mode2CustomBackgroundImage;
    
    if (mode2BackgroundImage) {
        // 设置了独立背景图：大图区域使用独立背景图
        document.documentElement.style.setProperty('--mode2-big-image-bg', `url('${mode2BackgroundImage}')`);
        // 内容区域使用整站背景图（如果启用了整站背景图）
        if (siteBackgroundImage && siteBackgroundEnabled) {
            document.documentElement.style.setProperty('--site-background-image', `url('${siteBackgroundImage}')`);
        } else {
            document.documentElement.style.setProperty('--site-background-image', 'none');
        }
    } else if (siteBackgroundImage && siteBackgroundEnabled) {
        // 没有设置独立背景图，但设置了整站背景图且启用：都使用整站背景图
        document.documentElement.style.setProperty('--mode2-big-image-bg', `url('${siteBackgroundImage}')`);
        document.documentElement.style.setProperty('--site-background-image', `url('${siteBackgroundImage}')`);
    } else {
        // 都没有设置背景图或整站背景图未启用，使用默认黑色背景
        document.documentElement.style.setProperty('--mode2-big-image-bg', 'none');
        document.documentElement.style.setProperty('--site-background-image', 'none');
    }
    
    // 设置背景效果参数
    document.documentElement.style.setProperty('--background-blur', `${siteBackgroundBlur}px`);
    document.documentElement.style.setProperty('--background-brightness', `${siteBackgroundBrightness}%`);
    document.documentElement.style.setProperty('--background-opacity', `${siteBackgroundOpacity / 100}`);
    
    document.documentElement.style.setProperty('--home-big-image-overlay-opacity', overlayOpacity);
    
    // 设置卡片动画速度
    const cardAnimationSpeed = getConfig('homeBigImageMode1CardAnimationSpeed') || 'normal';
    const speedMap = {
        'slow': '1.2s',
        'normal': '0.8s',
        'fast': '0.4s'
    };
    document.documentElement.style.setProperty('--card-animation-duration', speedMap[cardAnimationSpeed] || '0.8s');
}

// 初始化模式一：中间栏大图点击切换效果（使用单独图片）
function initMode1() {
    const bigImageSection = document.getElementById('homeBigImageMode1');
    const homeContent = document.getElementById('homeContentMode1');
    
    if (!bigImageSection || !homeContent) return;
    
    // 检查是否是分页页面（非首页第一页）
    const isPaginationPage = window.location.pathname !== '/' && window.location.pathname !== '/index.html';
    
    // 检查是否已经切换过内容（使用sessionStorage记录状态）
    const hasSwitched = sessionStorage.getItem('homeBigImageSwitched') === 'true';
    
    let isContentVisible = false;
    const cardAnimationEnabled = getConfig('homeBigImageMode1CardAnimation') === 'true';
    
    // 初始状态判断
    if (isPaginationPage || hasSwitched) {
        // 分页页面或已经切换过：直接显示内容，隐藏大图（无动画）
        isContentVisible = true;
        
        // 禁用过渡动画，直接设置最终状态
        bigImageSection.style.transition = 'none';
        homeContent.style.transition = 'none';
        
        bigImageSection.classList.remove('active');
        homeContent.classList.add('active');
        
        // 强制浏览器重绘
        bigImageSection.offsetHeight;
    } else {
        // 首次访问首页：显示大图，隐藏内容
        isContentVisible = false;
        bigImageSection.classList.add('active');
        homeContent.classList.remove('active');
        // 给body添加class，用于隐藏轮播图
        document.body.classList.add('home-big-image-active');
    }
    
    // 点击大图区域切换内容
    bigImageSection.addEventListener('click', function(e) {
        // 阻止事件冒泡，避免点击到内部链接
        e.preventDefault();
        e.stopPropagation();
        toggleContent();
    });
    
    // 切换内容显示
    function toggleContent() {
        if (isContentVisible) {
            // 显示大图，隐藏内容
            showBigImage();
        } else {
            // 显示内容，隐藏大图
            showContent();
        }
    }
    
    // 显示内容
    function showContent() {
        isContentVisible = true;
        
        // 隐藏大图，显示内容
        bigImageSection.classList.remove('active');
        homeContent.classList.add('active');
        // 移除body class，显示轮播图
        document.body.classList.remove('home-big-image-active');
        
        // 记录切换状态到sessionStorage（浏览器会话期间有效）
        sessionStorage.setItem('homeBigImageSwitched', 'true');
        
        // 如果启用卡片动画，添加卡片汇聚效果
        if (cardAnimationEnabled) {
            setTimeout(() => {
                animateCardsConvergence();
            }, 100);
        }
    }
    
    // 显示大图
    function showBigImage() {
        isContentVisible = false;
        
        // 隐藏内容，显示大图
        homeContent.classList.remove('active');
        bigImageSection.classList.add('active');
        // 给body添加class，隐藏轮播图
        document.body.classList.add('home-big-image-active');
        
        // 清除切换状态
        sessionStorage.removeItem('homeBigImageSwitched');
    }
    
    // 卡片汇聚动画效果 - 从八个方向往中心汇聚
    function animateCardsConvergence() {
        // 获取视窗内的卡片元素
        const cards = getVisibleCards();
        
        // 定义八个方向的起始位置（相对于视窗中心）
        const directions = [
            { x: -200, y: -200, rotate: -15 }, // 左上
            { x: 0, y: -250, rotate: 0 },      // 上
            { x: 200, y: -200, rotate: 15 },   // 右上
            { x: -250, y: 0, rotate: -20 },    // 左
            { x: 250, y: 0, rotate: 20 },      // 右
            { x: -200, y: 200, rotate: -10 },  // 左下
            { x: 0, y: 250, rotate: 0 },       // 下
            { x: 200, y: 200, rotate: 10 }      // 右下
        ];
        
        // 获取视窗中心点
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        
        cards.forEach((card, index) => {
            // 重置卡片位置和样式
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.transition = 'none';
            
            // 计算卡片相对于视窗中心的位置
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            // 计算卡片应该从哪个方向汇聚
            const directionIndex = index % directions.length;
            const direction = directions[directionIndex];
            
            // 计算卡片应该移动的距离（从指定方向到当前位置）
            const targetX = cardCenterX - viewportCenterX;
            const targetY = cardCenterY - viewportCenterY;
            
            // 设置起始位置（从指定方向偏移）
            const startX = direction.x;
            const startY = direction.y;
            const startRotate = direction.rotate;
            
            // 设置卡片初始位置（从八个方向之一开始）
            card.style.transform = `translate(${startX}px, ${startY}px) rotate(${startRotate}deg) scale(0.8)`;
            
            // 动画效果 - 从八个方向汇聚到当前位置
            setTimeout(() => {
                card.style.transition = 'all var(--card-animation-duration, 0.8s) cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
            }, index * 80); // 每个卡片延迟80ms，形成波浪效果
        });
    }
    
    // 获取视窗内的卡片元素
    function getVisibleCards() {
        const allCards = document.querySelectorAll('.home-content-mode1 .post-item, .home-content-mode1 .post-card, .home-content-mode1 .article-card, .home-content-mode1 .card');
        const visibleCards = [];
        
        // 获取视窗高度
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        
        allCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // 检查卡片是否在视窗内（至少部分可见）
            if (rect.top < viewportHeight && rect.bottom > 0) {
                visibleCards.push(card);
            }
        });
        
        return visibleCards;
    }
}

// 初始化模式二：Butterfly风格全屏大图（使用整站背景图）
function initMode2() {
    const bigImageSection = document.getElementById('homeBigImageMode2');
    const homeContent = document.getElementById('homeContentMode2');
    const scrollArrow = document.querySelector('.home-big-image-scroll-arrow');
    
    if (!bigImageSection || !homeContent) return;
    
    // 检查是否是分页页面（通过URL判断）
    const isPaginationPage = window.location.pathname.includes('/page/') || 
                             (window.location.pathname !== '/' && window.location.pathname !== '/index.html');
    
    // 检查是否已经切换过内容（使用sessionStorage记录状态）
    const hasSwitched = sessionStorage.getItem('homeBigImageSwitched') === 'true';
    
    // 检查是否是PJAX切换到首页
    const isPjaxToHome = sessionStorage.getItem('pjaxToHomePage') === 'true';
    
    let isContentShown = false;
    
    // 如果是分页页面或已经切换过，直接显示内容（无动画）
    if (isPaginationPage || hasSwitched) {
        isContentShown = true;
        
        // 禁用过渡动画，直接设置最终状态
        bigImageSection.style.transition = 'none';
        homeContent.style.transition = 'none';
        
        bigImageSection.classList.add('scrolled');
        homeContent.classList.add('visible');
        
        // 强制浏览器重绘，确保transition: none生效
        bigImageSection.offsetHeight;
        
        // 不添加 home-big-image-active class，允许轮播图显示
        return; // 不需要监听滚动和箭头点击
    }
    
    // PJAX切换到首页时：立即显示全屏大图状态，无过渡动画
    if (isPjaxToHome) {
        // 禁用过渡动画
        bigImageSection.style.transition = 'none';
        homeContent.style.transition = 'none';
        
        // 设置全屏大图状态
        bigImageSection.classList.remove('scrolled');
        homeContent.classList.remove('visible');
        document.body.classList.add('home-big-image-active');
        
        // 强制浏览器重绘
        bigImageSection.offsetHeight;
        
        // 恢复过渡动画（延迟一帧）
        requestAnimationFrame(() => {
            bigImageSection.style.transition = '';
            homeContent.style.transition = '';
        });
    } else {
        // 首次访问首页：显示大图，内容隐藏（正常流程）
        bigImageSection.classList.remove('scrolled');
        homeContent.classList.remove('visible');
        // 给body添加class，隐藏轮播图
        document.body.classList.add('home-big-image-active');
    }
    
    // 滚动箭头点击事件 - 显示内容
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            showContent();
        });
    }
    
    // 监听滚动事件 - 用户手动滚动时也显示内容
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            handleMode2Scroll();
        }, 10);
    });
    
    // 处理模式二的滚动逻辑
    function handleMode2Scroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 用户开始滚动时显示内容
        if (scrollTop > 20 && !isContentShown) {
            showContent();
        }
    }
    
    // 显示内容区域
    function showContent() {
        if (isContentShown) return;
        
        isContentShown = true;
        
        // 隐藏大图，显示内容
        bigImageSection.classList.add('scrolled');
        homeContent.classList.add('visible');
        
        // 记录已切换状态，分页时不再显示大图
        sessionStorage.setItem('homeBigImageSwitched', 'true');
        
        // 延迟移除body class，确保大图完全上划后再显示轮播图
        // 等待大图的transition动画完成（0.8s）
        setTimeout(() => {
            document.body.classList.remove('home-big-image-active');
        }, 800);
        
        // 滚动到内容区域顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 添加一些视觉效果
    addMode2Effects();
}

// 添加模式二的视觉效果
function addMode2Effects() {
    const content = document.querySelector('.home-big-image-content');
    
    if (content) {
        // 添加鼠标移动视差效果
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            content.style.transform = `translate(${x * 0.02}px, ${y * 0.02}px)`;
        });
    }
}

// 获取配置值
function getConfig(key) {
    // 确保window.siteConfig已加载
    if (typeof window.siteConfig === 'undefined') {
        return null;
    }
    return window.siteConfig[key];
}

// 主页大图管理器（供外部调用）
window.homeBigImageManager = {
    // 切换模式
    switchMode: function(mode) {
        const currentMode = getConfig('homeBigImageMode');
        if (currentMode === mode) return;
        
        // 更新配置
        if (window.siteConfig) {
            window.siteConfig.homeBigImageMode = mode;
        }
        
        // 重新初始化
        initHomeBigImage();
    },
    
    // 更新背景图
    updateBackgroundImage: function(imageUrl) {
        if (window.siteConfig) {
            window.siteConfig.homeBigImageMode1BackgroundImage = imageUrl;
        }
        
        document.documentElement.style.setProperty('--home-big-image-mode1-bg', `url('${imageUrl}')`);
    },
    
    // 更新标题和副标题
    updateContent: function(title, subtitle) {
        const titleElements = document.querySelectorAll('.home-big-image-title');
        const subtitleElements = document.querySelectorAll('.home-big-image-subtitle');
        
        titleElements.forEach(el => el.textContent = title);
        subtitleElements.forEach(el => el.textContent = subtitle);
        
        if (window.siteConfig) {
            window.siteConfig.homeBigImageTitle = title;
            window.siteConfig.homeBigImageSubtitle = subtitle;
        }
    },
    
    // 切换启用状态
    toggle: function(enabled) {
        if (window.siteConfig) {
            window.siteConfig.homeBigImageEnabled = enabled.toString();
        }
        
        if (enabled) {
            initHomeBigImage();
        } else {
            // 隐藏大图区域
            const mode1Section = document.getElementById('homeBigImageMode1');
            const mode2Section = document.getElementById('homeBigImageMode2');
            
            if (mode1Section) mode1Section.style.display = 'none';
            if (mode2Section) mode2Section.style.display = 'none';
        }
    }
};
