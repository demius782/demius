/**
 * 悬浮音乐播放器初始化
 * 确保PJAX切换后正常显示
 * 支持拖拽、缩小、关闭功能
 */

(function() {
  'use strict';

  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  function initMusicFloatPlayer() {
    // 检查是否启用悬浮播放器
    if (!window.musicFloatPlayerConfig || !window.musicFloatPlayerConfig.enabled) {
      return;
    }

    const floatPlayer = document.getElementById('music-player-float');
    if (!floatPlayer) {
      return;
    }

    // 如果已经初始化过，跳过
    if (floatPlayer.dataset.initialized === 'true') {
      return;
    }

    // 标记已初始化
    floatPlayer.dataset.initialized = 'true';

    // 等待MetingJS和APlayer加载完成
    const checkAndInit = () => {
      if (typeof APlayer !== 'undefined' && typeof MetingJSElement !== 'undefined') {
        // MetingJS会自动初始化，确保容器可见
        floatPlayer.style.display = 'block';
        initInteractions(floatPlayer);
      } else {
        // 如果还没加载，延迟重试
        setTimeout(checkAndInit, 100);
      }
    };

    // 延迟初始化，确保DOM完全加载
    setTimeout(checkAndInit, 200);

    // 如果已经有MetingJS实例，直接显示
    if (typeof APlayer !== 'undefined') {
      floatPlayer.style.display = 'block';
      initInteractions(floatPlayer);
    }
  }

  function initInteractions(floatPlayer) {
    // 恢复状态（从localStorage读取）
    restorePlayerState(floatPlayer);

    // 拖拽手柄
    const dragHandle = floatPlayer.querySelector('.music-player-float-drag-handle');
    if (dragHandle) {
      initDrag(floatPlayer, dragHandle);
    }

    // 缩小按钮
    const minimizeBtn = floatPlayer.querySelector('.minimize-btn');
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMinimize(floatPlayer);
      });
    }

    // 关闭按钮
    const closeBtn = floatPlayer.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closePlayer(floatPlayer);
      });
    }
  }

  function initDrag(floatPlayer, dragHandle) {
    dragHandle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      isDragging = true;
      floatPlayer.classList.add('dragging');
      
      // 获取初始位置（使用getBoundingClientRect获取实际位置）
      const rect = floatPlayer.getBoundingClientRect();
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;
      
      // 添加全局事件监听
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    });
  }

  function handleDrag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const floatPlayer = document.getElementById('music-player-float');
    if (!floatPlayer) return;
    
    // 计算新位置（基于初始位置的偏移）
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    const newLeft = initialLeft + deltaX;
    const newTop = initialTop + deltaY;
    
    // 限制在视口内（允许拖动到全屏任意位置）
    const maxLeft = window.innerWidth - floatPlayer.offsetWidth;
    const maxTop = window.innerHeight - floatPlayer.offsetHeight;
    
    const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
    const clampedTop = Math.max(0, Math.min(newTop, maxTop));
    
    // 应用新位置（使用top和left定位，支持全屏拖动）
    floatPlayer.style.left = clampedLeft + 'px';
    floatPlayer.style.top = clampedTop + 'px';
    floatPlayer.style.bottom = 'auto';
    floatPlayer.style.right = 'auto';
  }

  function handleDragEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    const floatPlayer = document.getElementById('music-player-float');
    if (floatPlayer) {
      floatPlayer.classList.remove('dragging');
      
      // 保存位置到localStorage
      savePlayerPosition(floatPlayer);
    }
    
    // 移除全局事件监听
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }

  function toggleMinimize(floatPlayer) {
    const isMinimized = floatPlayer.classList.contains('minimized');
    
    if (isMinimized) {
      floatPlayer.classList.remove('minimized');
      localStorage.setItem('musicFloatPlayerMinimized', 'false');
    } else {
      floatPlayer.classList.add('minimized');
      localStorage.setItem('musicFloatPlayerMinimized', 'true');
    }
  }

  function closePlayer(floatPlayer) {
    // 停止所有音乐播放
    stopAllMusic(floatPlayer);
    
    // 隐藏播放器
    floatPlayer.classList.add('closed');
    localStorage.setItem('musicFloatPlayerClosed', 'true');
  }

  function stopAllMusic(floatPlayer) {
    // 方法1：通过全局APlayer.instances数组停止所有相关实例
    if (typeof APlayer !== 'undefined' && APlayer.instances) {
      APlayer.instances.forEach(function(instance) {
        // 检查实例是否在floatPlayer容器内
        if (floatPlayer.contains(instance.container)) {
          instance.pause();
        }
      });
    }

    // 方法2：停止所有audio元素（本地音频）
    const audioElements = floatPlayer.querySelectorAll('audio');
    audioElements.forEach(function(audio) {
      audio.pause();
      audio.currentTime = 0;
    });

    // 方法3：通过meting-js元素停止
    const metingElements = floatPlayer.querySelectorAll('meting-js');
    metingElements.forEach(function(element) {
      // MetingJS创建的播放器可能存储在element.aplayer或element._aplayer
      if (element.aplayer) {
        element.aplayer.pause();
      } else if (element._aplayer) {
        element._aplayer.pause();
      }
      
      // 也尝试查找内部的.aplayer元素并停止
      const aplayerEl = element.querySelector('.aplayer');
      if (aplayerEl && aplayerEl.aplayerInstance) {
        aplayerEl.aplayerInstance.pause();
      }
    });

    // 方法4：直接查找所有.aplayer元素并尝试停止
    const aplayerElements = floatPlayer.querySelectorAll('.aplayer');
    aplayerElements.forEach(function(element) {
      // 尝试多种方式获取APlayer实例
      if (element.aplayerInstance) {
        element.aplayerInstance.pause();
      }
      // 通过全局instances查找
      if (typeof APlayer !== 'undefined' && APlayer.instances) {
        APlayer.instances.forEach(function(instance) {
          if (instance.container === element) {
            instance.pause();
          }
        });
      }
    });
  }

  function savePlayerPosition(floatPlayer) {
    const rect = floatPlayer.getBoundingClientRect();
    const position = {
      left: rect.left,
      top: rect.top
    };
    localStorage.setItem('musicFloatPlayerPosition', JSON.stringify(position));
  }

  function restorePlayerState(floatPlayer) {
    // 恢复位置
    const savedPosition = localStorage.getItem('musicFloatPlayerPosition');
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        floatPlayer.style.left = position.left + 'px';
        floatPlayer.style.top = position.top + 'px';
        floatPlayer.style.bottom = 'auto';
        floatPlayer.style.right = 'auto';
      } catch (e) {
        console.warn('Failed to restore music player position:', e);
      }
    }

    // 恢复缩小状态
    const isMinimized = localStorage.getItem('musicFloatPlayerMinimized') === 'true';
    if (isMinimized) {
      floatPlayer.classList.add('minimized');
    }

    // 不恢复关闭状态（用户关闭后需要手动重新打开）
    // const isClosed = localStorage.getItem('musicFloatPlayerClosed') === 'true';
    // if (isClosed) {
    //   floatPlayer.classList.add('closed');
    // }
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    initMusicFloatPlayer();
  });

  // PJAX切换后重新初始化
  document.addEventListener('pjax:complete', function() {
    // 延迟初始化，确保新页面DOM完全加载
    setTimeout(initMusicFloatPlayer, 300);
  });

  // 监听MetingJS加载完成事件（如果存在）
  if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
      setTimeout(initMusicFloatPlayer, 500);
    });
  }

  // 导出函数供外部调用
  window.initMusicFloatPlayer = initMusicFloatPlayer;
})();

