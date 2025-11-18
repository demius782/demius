// 图片全屏查看功能
let articleImages = [];
let currentImageIndex = 0;

// 打开全屏
function openFullscreen(index) {
    currentImageIndex = index;
    const img = articleImages[currentImageIndex];
    
    const fullscreenOverlay = document.querySelector('.img-fullscreen-overlay');
    const fullscreenImg = fullscreenOverlay.querySelector('img');
    const fullscreenInfo = fullscreenOverlay.querySelector('.img-fullscreen-info');
    const counter = fullscreenOverlay.querySelector('.img-fullscreen-counter');
    
    fullscreenImg.src = img.src;
    fullscreenImg.alt = img.alt;
    
    // 设置图片信息
    if (img.alt) {
        fullscreenInfo.textContent = img.alt;
        fullscreenInfo.style.display = 'block';
    } else {
        fullscreenInfo.style.display = 'none';
    }
    
    // 设置计数器（多图时显示）
    if (articleImages.length > 1) {
        counter.textContent = `${currentImageIndex + 1} / ${articleImages.length}`;
        counter.style.display = 'block';
        
        // 显示导航按钮
        fullscreenOverlay.querySelector('.img-fullscreen-prev').style.display = 'flex';
        fullscreenOverlay.querySelector('.img-fullscreen-next').style.display = 'flex';
    } else {
        counter.style.display = 'none';
        fullscreenOverlay.querySelector('.img-fullscreen-prev').style.display = 'none';
        fullscreenOverlay.querySelector('.img-fullscreen-next').style.display = 'none';
    }
    
    fullscreenOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭全屏
function closeFullscreen() {
    const fullscreenOverlay = document.querySelector('.img-fullscreen-overlay');
    fullscreenOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// 切换到上一张图片
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + articleImages.length) % articleImages.length;
    openFullscreen(currentImageIndex);
}

// 切换到下一张图片
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % articleImages.length;
    openFullscreen(currentImageIndex);
}

function initImageViewer() {
    // 检查是否已经创建全屏容器
    let fullscreenOverlay = document.querySelector('.img-fullscreen-overlay');
    
    if (!fullscreenOverlay) {
        // 创建全屏查看容器
        fullscreenOverlay = document.createElement('div');
        fullscreenOverlay.className = 'img-fullscreen-overlay';
        fullscreenOverlay.innerHTML = `
            <div class="img-fullscreen-container">
                <button class="img-fullscreen-close">&times;</button>
                <div class="img-fullscreen-counter"></div>
                <button class="img-fullscreen-nav img-fullscreen-prev">&lsaquo;</button>
                <img src="" alt="">
                <button class="img-fullscreen-nav img-fullscreen-next">&rsaquo;</button>
                <div class="img-fullscreen-info"></div>
            </div>
        `;
        document.body.appendChild(fullscreenOverlay);
        
        // 绑定全屏容器事件（只需绑定一次）
        fullscreenOverlay.addEventListener('click', function(e) {
            if (e.target === fullscreenOverlay) {
                closeFullscreen();
            }
        });

        fullscreenOverlay.querySelector('.img-fullscreen-close').addEventListener('click', closeFullscreen);
        fullscreenOverlay.querySelector('.img-fullscreen-prev').addEventListener('click', prevImage);
        fullscreenOverlay.querySelector('.img-fullscreen-next').addEventListener('click', nextImage);
    }

    // 获取文章图片
    articleImages = Array.from(document.querySelectorAll('article.post .post-content img'));
    let clickTimer = null;

    // 双击图片打开全屏
    articleImages.forEach((img, index) => {
        // 使用once选项避免重复绑定，但双击检测需要持续监听
        // 所以我们先移除可能存在的旧监听器
        const newClickHandler = function(e) {
            if (!this._clickTimer) {
                // 第一次点击，设置定时器
                this._clickTimer = setTimeout(() => {
                    this._clickTimer = null;
                }, 300);
            } else {
                // 第二次点击，执行双击操作
                clearTimeout(this._clickTimer);
                this._clickTimer = null;
                openFullscreen(index);
                e.preventDefault();
            }
        };
        
        // 移除旧的监听器（如果存在）
        if (img._imageClickHandler) {
            img.removeEventListener('click', img._imageClickHandler);
        }
        img._imageClickHandler = newClickHandler;
        img.addEventListener('click', newClickHandler);

        // 添加双击提示效果（首次悬停时）
        if (!img._hoverHandlerBound) {
            img.addEventListener('mouseenter', function() {
                if (!this.dataset.hintShown) {
                    this.classList.add('double-click-hint');
                    setTimeout(() => {
                        this.classList.remove('double-click-hint');
                    }, 300);
                    this.dataset.hintShown = 'true';
                }
            });
            img._hoverHandlerBound = true;
        }
    });

}

// 键盘支持（全局，只绑定一次）
if (!window._imageViewerKeyboardBound) {
    document.addEventListener('keydown', function(e) {
        const fullscreenOverlay = document.querySelector('.img-fullscreen-overlay');
        if (!fullscreenOverlay || !fullscreenOverlay.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeFullscreen();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    window._imageViewerKeyboardBound = true;
}

// 触摸滑动支持（全局，只绑定一次）
if (!window._imageViewerTouchBound) {
    let touchStartX = 0;
    document.body.addEventListener('touchstart', function(e) {
        const fullscreenOverlay = document.querySelector('.img-fullscreen-overlay');
        if (!fullscreenOverlay || !fullscreenOverlay.classList.contains('active')) return;
        touchStartX = e.changedTouches[0].screenX;
    });

    document.body.addEventListener('touchend', function(e) {
        const fullscreenOverlay = document.querySelector('.img-fullscreen-overlay');
        if (!fullscreenOverlay || !fullscreenOverlay.classList.contains('active')) return;
        
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        
        if (Math.abs(diffX) > 50) { // 滑动距离阈值
            if (diffX > 0) {
                prevImage();
            } else {
                nextImage();
            }
        }
    });
    window._imageViewerTouchBound = true;
}

// 首次加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageViewer);
} else {
    initImageViewer();
}

// 导出到全局供PJAX使用
window.initImageViewer = initImageViewer;