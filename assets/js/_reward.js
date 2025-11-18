/* ===================================================================
   打赏按钮功能 - 纯 CSS 悬停效果
   =================================================================== */

function initReward() {
  const rewardButton = document.getElementById('rewardButton');
  const rewardPanel = document.getElementById('rewardPanel');
  
  if (!rewardButton || !rewardPanel) return;
  
  // 移动端触摸支持（可选）
  // 在移动设备上，第一次点击显示面板，点击外部隐藏
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    let isShowingPanel = false;
    
    rewardButton.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      if (!isShowingPanel) {
        // 显示面板
        rewardPanel.style.opacity = '1';
        rewardPanel.style.visibility = 'visible';
        rewardPanel.style.transform = 'translateX(-50%) translateY(0)';
        isShowingPanel = true;
      } else {
        // 隐藏面板
        rewardPanel.style.opacity = '0';
        rewardPanel.style.visibility = 'hidden';
        rewardPanel.style.transform = 'translateX(-50%) translateY(-10px)';
        isShowingPanel = false;
      }
    });
    
    // 点击页面其他地方时隐藏面板
    document.addEventListener('click', function(e) {
      if (isShowingPanel && !rewardButton.contains(e.target) && !rewardPanel.contains(e.target)) {
        rewardPanel.style.opacity = '0';
        rewardPanel.style.visibility = 'hidden';
        rewardPanel.style.transform = 'translateX(-50%) translateY(-10px)';
        isShowingPanel = false;
      }
    });
    
    // 阻止面板点击事件冒泡
    rewardPanel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  // 桌面端完全依赖 CSS :hover 效果，不需要 JavaScript
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReward);
} else {
  initReward();
}

// PJAX 支持
if (typeof window.initReward === 'undefined') {
  window.initReward = initReward;
}

