// 背景图控制功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化背景图
    initBackground();
    
    // 监听主题切换
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                updateBackgroundForTheme();
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// 初始化背景图
function initBackground() {
    const body = document.body;
    const siteBackgroundEnabled = getConfig('siteBackgroundEnabled') === 'true'; // 转换为布尔值
    const homeCoverEnabled = getConfig('homeCoverEnabled') === 'true'; // 转换为布尔值
    const effectMode = getConfig('effectMode') || 'glass';
    
    // 添加整站背景图
    if (siteBackgroundEnabled) {
        const siteBackground = document.createElement('div');
        siteBackground.className = 'site-background';
        siteBackground.id = 'site-background';
        body.appendChild(siteBackground);
        
        // 应用配置
        applyBackgroundConfig();
    }
    
    // 添加主页大图类
    if (homeCoverEnabled && isHomePage()) {
        body.classList.add('home-cover-enabled');
    } else {
        body.classList.add('home-cover-disabled');
    }
    
    // 添加整站背景类
    if (siteBackgroundEnabled) {
        body.classList.add('background-enabled');
    } else {
        body.classList.add('background-disabled');
    }
    
    // 应用背景效果模式
    applyEffectMode(effectMode);
}

// 应用背景图配置
function applyBackgroundConfig() {
    const siteBackground = document.getElementById('site-background');
    if (!siteBackground) return;
    
    const config = getBackgroundConfig();
    
    // 设置CSS变量
    document.documentElement.style.setProperty('--home-cover-image', `url('${config.homeCover.image}')`);
    document.documentElement.style.setProperty('--site-background-image', `url('${config.site.image}')`);
    document.documentElement.style.setProperty('--background-blur', `${config.site.blur}px`);
    document.documentElement.style.setProperty('--background-brightness', `${config.site.brightness}%`);
    document.documentElement.style.setProperty('--background-opacity', `${config.site.opacity / 100}`);
}

// 获取背景图配置
function getBackgroundConfig() {
    return {
        site: {
            enable: getConfig('siteBackgroundEnabled'),
            image: getConfig('siteBackgroundImage') || 'https://images.unsplash.com/photo-1497366216548-37526070297c',
            blur: parseInt(getConfig('siteBackgroundBlur')) || 0,
            brightness: parseInt(getConfig('siteBackgroundBrightness')) || 100,
            opacity: parseInt(getConfig('siteBackgroundOpacity')) || 80
        },
        homeCover: {
            enable: getConfig('homeCoverEnabled'),
            image: getConfig('homeCoverImage') || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            title: getConfig('homeCoverTitle') || document.title,
            subtitle: getConfig('homeCoverSubtitle') || ''
        },
        effectMode: getConfig('effectMode') || 'glass'
    };
}

// 获取配置值
function getConfig(key) {
    const config = window.siteConfig || {};
    return config[key];
}

// 检查是否为首页
function isHomePage() {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
}

// 根据主题更新背景
function updateBackgroundForTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    const siteBackground = document.getElementById('site-background');
    
    if (siteBackground) {
        if (theme === 'dark') {
            siteBackground.style.filter = 'brightness(0.8)';
        } else {
            siteBackground.style.filter = 'brightness(1)';
        }
    }
}

// 应用背景效果模式
function applyEffectMode(effectMode) {
    const siteWrap = document.querySelector('.site-wrap');
    if (!siteWrap) return;
    
    // 移除所有效果类
    siteWrap.classList.remove('effect-transparent', 'effect-glass', 'effect-translucent', 'effect-solid');
    
    // 添加当前效果类
    siteWrap.classList.add(`effect-${effectMode}`);
    
    // 如果是纯色模式，应用自定义颜色
    if (effectMode === 'solid') {
        const solidColor = getConfig('solidColor') || '#4fc3f7';
        siteWrap.style.backgroundColor = solidColor;
    } else {
        siteWrap.style.backgroundColor = '';
    }
}

// 背景图切换函数（供外部调用）
window.backgroundManager = {
    // 切换整站背景图
    toggleSiteBackground: function(enable) {
        const body = document.body;
        const siteBackground = document.getElementById('site-background');
        
        if (enable) {
            if (!siteBackground) {
                initBackground();
            }
            body.classList.remove('background-disabled');
            body.classList.add('background-enabled');
        } else {
            if (siteBackground) {
                siteBackground.remove();
            }
            body.classList.remove('background-enabled');
            body.classList.add('background-disabled');
        }
    },
    
    // 切换主页大图
    toggleHomeCover: function(enable) {
        const body = document.body;
        
        if (enable) {
            body.classList.remove('home-cover-disabled');
            body.classList.add('home-cover-enabled');
        } else {
            body.classList.remove('home-cover-enabled');
            body.classList.add('home-cover-disabled');
        }
    },
    
    // 更新背景图配置
    updateBackgroundConfig: function(config) {
        applyBackgroundConfig();
    },
    
    // 切换背景效果模式
    switchEffectMode: function(mode) {
        applyEffectMode(mode);
    }
};