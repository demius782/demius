// 侧栏音乐组件初始化（PJAX兼容）
(function() {
  'use strict';

  // 初始化音乐播放器
  function initMusicPlayers() {
    // MetingJS 通过自定义元素自动初始化
    // 不需要额外的初始化代码，但我们需要确保在 PJAX 后重新加载
    if (typeof window.Meting !== 'undefined') {
      // MetingJS 已加载，会自动处理 meting-js 元素
      const metingElements = document.querySelectorAll('meting-js:not([data-loaded])');
      if (metingElements.length > 0) {
        // 触发 MetingJS 重新初始化
        metingElements.forEach(el => {
          el.setAttribute('data-loaded', 'true');
        });
      }
    }
  }

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicPlayers);
  } else {
    initMusicPlayers();
  }

  // PJAX 完成后重新初始化
  document.addEventListener('pjax:complete', function() {
    setTimeout(initMusicPlayers, 100);
  });
})();

