/**
 * 弹窗公告功能
 * 支持多种弹出模式：modal（模态框）、toast（提示框）、banner（横幅）
 */

(function() {
  'use strict';

  // 工具函数：设置Cookie
  function setCookie(name, value, days) {
    if (days === 0) {
      // 会话级Cookie
      document.cookie = `${name}=${value}; path=/`;
    } else {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
  }

  // 工具函数：获取Cookie
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // 初始化弹窗
  function initPopup(popupElement) {
    if (!popupElement) return;

    const popupId = popupElement.getAttribute('data-popup-id');
    const mode = popupElement.getAttribute('data-mode') || 'modal';
    const position = popupElement.getAttribute('data-position') || 'center';
    const showCloseButton = popupElement.getAttribute('data-show-close') === 'true';
    const showOverlay = popupElement.getAttribute('data-show-overlay') === 'true';
    const closeOnOverlayClick = popupElement.getAttribute('data-close-on-overlay') === 'true';
    const closeOnEscape = popupElement.getAttribute('data-close-on-escape') === 'true';
    const autoCloseAttr = popupElement.getAttribute('data-auto-close');
    const delay = parseInt(popupElement.getAttribute('data-delay') || '0', 10);
    const cookieName = popupElement.getAttribute('data-cookie-name');
    const cookieExpire = parseInt(popupElement.getAttribute('data-cookie-expire') || '0', 10);
    const showOnce = popupElement.getAttribute('data-show-once') === 'true';

    // 检查是否已关闭（基于Cookie）
    // 如果 showOnce 为 true 且有 cookieName，检查 Cookie
    if (showOnce && cookieName && cookieName.trim() !== '') {
      if (getCookie(cookieName) === 'true') {
        return; // 已关闭过，不再显示
      }
    }

    // 关闭弹窗函数
    function closePopup() {
      popupElement.classList.remove('popup-show');
      popupElement.classList.add('popup-hide');
      
      setTimeout(() => {
        popupElement.style.display = 'none';
        popupElement.classList.remove('popup-hide');
      }, 300);

      // 设置Cookie
      // 如果 showOnce 为 true 且有 cookieName，设置 Cookie
      if (showOnce && cookieName && cookieName.trim() !== '') {
        setCookie(cookieName, 'true', cookieExpire);
      }
    }

    // 显示弹窗函数
    function showPopup() {
      popupElement.style.display = 'block';
      // 强制重排以触发动画
      popupElement.offsetHeight;
      popupElement.classList.add('popup-show');
    }

    // 延迟显示
    if (delay > 0) {
      setTimeout(showPopup, delay);
    } else {
      showPopup();
    }

    // 自动关闭
    // 处理 autoClose：false 字符串表示不自动关闭，数字字符串表示毫秒数
    if (autoCloseAttr && autoCloseAttr !== 'false') {
      const autoCloseTime = parseInt(autoCloseAttr, 10);
      if (!isNaN(autoCloseTime) && autoCloseTime > 0) {
        setTimeout(closePopup, autoCloseTime);
      }
    }

    // 关闭按钮事件
    const closeButton = popupElement.querySelector('.popup-close');
    if (closeButton) {
      closeButton.addEventListener('click', closePopup);
    }

    // 遮罩层点击关闭
    if (closeOnOverlayClick && showOverlay) {
      const overlay = popupElement.querySelector('.popup-overlay');
      if (overlay) {
        overlay.addEventListener('click', closePopup);
      }
    }

    // ESC键关闭
    if (closeOnEscape) {
      const escapeHandler = function(e) {
        if (e.key === 'Escape' && popupElement.classList.contains('popup-show')) {
          closePopup();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
  }

  // 初始化所有弹窗
  function initAllPopups() {
    const popups = document.querySelectorAll('.popup-container');
    popups.forEach(popup => {
      initPopup(popup);
    });
  }

  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllPopups);
  } else {
    initAllPopups();
  }

  // PJAX支持：页面切换后重新初始化
  document.addEventListener('pjax:complete', function() {
    setTimeout(initAllPopups, 100);
  });

})();

