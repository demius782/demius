/**
 * 随机图片组件
 * 从配置的API列表中随机选择一个API加载图片
 */

(function() {
  'use strict';

  function initRandomImage() {
    // 检查是否启用
    const config = window.randomImageConfig || {};
    if (!config.enabled) {
      return;
    }

    const randomImageCard = document.querySelector('.random-image-card');
    if (!randomImageCard) {
      return;
    }

    // 检查API配置
    let apis = config.apis;
    
    // 如果apis是字符串（JSON字符串），尝试解析
    if (typeof apis === 'string') {
      try {
        const parsed = JSON.parse(apis);
        apis = parsed; // 使用解析后的值
      } catch (e) {
        // 如果解析失败，尝试作为单个URL处理
        apis = apis.trim() !== '' ? [apis.trim()] : [];
      }
    }
    
    // 处理API配置
    let apiList = [];
    if (apis) {
      if (Array.isArray(apis)) {
        apiList = apis.filter(api => {
          // 确保每个API都是有效的字符串URL
          if (typeof api !== 'string' || api.trim() === '') {
            return false;
          }
          // 如果API看起来像JSON字符串（包含引号和逗号），尝试再次解析
          if (api.trim().startsWith('[') || api.trim().startsWith('"')) {
            try {
              const parsedApi = JSON.parse(api);
              if (Array.isArray(parsedApi)) {
                // 如果是数组，展开并添加所有元素
                parsedApi.forEach(url => {
                  if (typeof url === 'string' && url.trim() !== '') {
                    apiList.push(url.trim());
                  }
                });
                return false; // 不添加原始字符串
              }
            } catch (e) {
              // 解析失败，跳过
            }
          }
          return true;
        }).map(api => api.trim());
      } else if (typeof apis === 'string' && apis.trim() !== '') {
        apiList = [apis.trim()];
      }
    }
    
    if (apiList.length === 0) {
      showError('未配置API');
      return;
    }

    const container = document.getElementById('random-image-container');
    const imageEl = document.getElementById('random-image');
    const loadingEl = container ? container.querySelector('.random-image-loading') : null;
    const errorEl = document.getElementById('random-image-error');
    const refreshBtn = document.getElementById('random-image-refresh');

    // 错误提示函数
    function showError(message) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (imageEl) imageEl.style.display = 'none';
      if (errorEl) {
        errorEl.style.display = 'flex';
        const errorText = errorEl.querySelector('span');
        if (errorText) errorText.textContent = message;
      }
    }

    // 加载图片函数
    function loadRandomImage() {
      if (!container || !imageEl) return;

      // 随机选择一个API
      const randomApi = apiList[Math.floor(Math.random() * apiList.length)];
      if (!randomApi) {
        showError('API配置无效');
        return;
      }

      // 显示加载状态
      if (loadingEl) loadingEl.style.display = 'flex';
      if (imageEl) imageEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      // 创建新的Image对象来加载图片
      const img = new Image();
      
      // 添加时间戳防止缓存
      const apiUrl = randomApi.includes('?') 
        ? `${randomApi}&t=${Date.now()}` 
        : `${randomApi}?t=${Date.now()}`;

      // 设置超时
      let timeout;
      let loadSuccess = false;

      img.onload = function() {
        if (loadSuccess) return; // 防止重复触发
        loadSuccess = true;
        clearTimeout(timeout);
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
        if (imageEl) {
          imageEl.src = img.src;
          imageEl.style.display = 'block';
          imageEl.style.opacity = '0';
          setTimeout(() => {
            imageEl.style.transition = 'opacity 0.3s ease';
            imageEl.style.opacity = '1';
          }, 10);
        }
      };

      img.onerror = function() {
        if (loadSuccess) return; // 防止重复触发
        clearTimeout(timeout);
        if (loadingEl) loadingEl.style.display = 'none';
        if (imageEl) imageEl.style.display = 'none';
        
        // 如果还有其他API，尝试下一个
        if (apiList.length > 1) {
          const currentIndex = apiList.indexOf(randomApi);
          const nextIndex = (currentIndex + 1) % apiList.length;
          const nextApi = apiList[nextIndex];
          if (nextApi && nextApi !== randomApi) {
            setTimeout(() => {
              const nextImg = new Image();
              const nextApiUrl = nextApi.includes('?') 
                ? `${nextApi}&t=${Date.now()}` 
                : `${nextApi}?t=${Date.now()}`;
              let nextLoadSuccess = false;
              
              nextImg.onload = function() {
                if (nextLoadSuccess) return;
                nextLoadSuccess = true;
                if (loadingEl) loadingEl.style.display = 'none';
                if (errorEl) errorEl.style.display = 'none';
                if (imageEl) {
                  imageEl.src = nextImg.src;
                  imageEl.style.display = 'block';
                  imageEl.style.opacity = '0';
                  setTimeout(() => {
                    imageEl.style.transition = 'opacity 0.3s ease';
                    imageEl.style.opacity = '1';
                  }, 10);
                }
              };
              
              nextImg.onerror = function() {
                if (nextLoadSuccess) return;
                showError('所有API加载失败');
              };
              
              nextImg.src = nextApiUrl;
            }, 500);
          } else {
            showError('加载失败');
          }
        } else {
          showError('加载失败');
        }
      };

      // 设置超时
      timeout = setTimeout(() => {
        if (!loadSuccess) {
          img.onerror = null;
          img.onload = null;
          showError('加载超时');
        }
      }, 10000); // 10秒超时

      // 开始加载
      img.src = apiUrl;
    }

    // 刷新按钮事件
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        loadRandomImage();
      });
    }

    // 初始加载
    loadRandomImage();

    // 如果设置了自动刷新间隔，则定时刷新
    if (config.refreshInterval && config.refreshInterval > 0) {
      setInterval(loadRandomImage, config.refreshInterval * 1000);
    }
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRandomImage);
  } else {
    initRandomImage();
  }

  // PJAX兼容
  if (typeof window !== 'undefined') {
    document.addEventListener('pjax:complete', function() {
      setTimeout(initRandomImage, 100);
    });
  }
})();

