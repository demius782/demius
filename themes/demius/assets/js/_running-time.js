// ===== 页脚运行时间功能 =====

let runningTimeInterval = null;

// 初始化运行时间显示
function initRunningTime() {
  const container = document.querySelector('.footer-running-time');
  if (!container) return;
  
  const startDateStr = container.dataset.startDate;
  if (!startDateStr) return;
  
  // 解析开始日期
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) {
    return;
  }
  
  // 更新显示函数
  function updateRunningTime() {
    const now = new Date();
    const diff = now - startDate;
    
    // 计算时间差
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示
    const timeEl = container.querySelector('.running-time-value');
    if (timeEl) {
      timeEl.innerHTML = `<span class="time-unit">${days}</span> 天 <span class="time-unit">${hours}</span> 时 <span class="time-unit">${minutes}</span> 分 <span class="time-unit">${seconds}</span> 秒`;
    }
  }
  
  // 立即更新一次
  updateRunningTime();
  
  // 每秒更新
  runningTimeInterval = setInterval(updateRunningTime, 1000);
}

// 清理运行时间计时器
function cleanupRunningTime() {
  if (runningTimeInterval) {
    clearInterval(runningTimeInterval);
    runningTimeInterval = null;
  }
}

// 导出到全局（供PJAX使用）
window.initRunningTime = initRunningTime;
window.cleanupRunningTime = cleanupRunningTime;

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRunningTime);
} else {
  initRunningTime();
}

