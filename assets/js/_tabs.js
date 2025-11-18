/**
 * 选项卡切换功能
 */

function initTabs() {
  const tabsContainers = document.querySelectorAll('.tabs-container');
  
  if (!tabsContainers.length) return;

  tabsContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-button');
    const tabPanes = container.querySelectorAll('.tab-pane');
    const tabsNav = container.querySelector('.tabs-nav');

    // 检查是否需要滚动
    checkScrollable(tabsNav);

    // 为每个按钮添加点击事件
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabIndex = this.getAttribute('data-tab');
        const containerId = this.getAttribute('data-container');
        const currentContainer = document.getElementById(containerId);

        if (!currentContainer) return;

        // 移除所有激活状态
        const allButtons = currentContainer.querySelectorAll('.tab-button');
        const allPanes = currentContainer.querySelectorAll('.tab-pane');

        allButtons.forEach(btn => btn.classList.remove('active'));
        allPanes.forEach(pane => pane.classList.remove('active'));

        // 添加当前激活状态
        this.classList.add('active');
        const targetPane = currentContainer.querySelector(`.tab-pane[data-tab="${tabIndex}"]`);
        if (targetPane) {
          targetPane.classList.add('active');

          // 滚动到内容顶部（如果需要）
          const offset = currentContainer.getBoundingClientRect().top + window.pageYOffset - 80;
          if (window.pageYOffset > offset) {
            window.scrollTo({
              top: offset,
              behavior: 'smooth'
            });
          }
        }

        // 保存当前选项卡状态到 sessionStorage
        const containerId2 = currentContainer.id;
        if (containerId2) {
          sessionStorage.setItem(`tab-${containerId2}`, tabIndex);
        }
      });
    });

    // 恢复之前保存的选项卡状态
    const containerId = container.id;
    if (containerId) {
      const savedTab = sessionStorage.getItem(`tab-${containerId}`);
      if (savedTab) {
        const savedButton = container.querySelector(`.tab-button[data-tab="${savedTab}"]`);
        if (savedButton) {
          savedButton.click();
        }
      }
    }

    // 窗口大小改变时重新检查滚动
    window.addEventListener('resize', () => {
      checkScrollable(tabsNav);
    });
  });
}

/**
 * 检查选项卡导航是否可滚动
 */
function checkScrollable(nav) {
  if (!nav) return;

  if (nav.scrollWidth > nav.clientWidth) {
    nav.classList.add('has-scroll');
  } else {
    nav.classList.remove('has-scroll');
  }
}

/**
 * 清理选项卡事件监听器
 */
function cleanupTabs() {
  const tabsContainers = document.querySelectorAll('.tabs-container');
  
  tabsContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-button');
    
    // 移除所有事件监听器（通过克隆节点）
    tabButtons.forEach(button => {
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });
  });
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabs);
} else {
  initTabs();
}

// 导出函数供全局使用
window.initTabs = initTabs;
window.cleanupTabs = cleanupTabs;

