/**
 * 开发者工具防护脚本
 * 防止用户通过F12、右键菜单等方式打开开发者工具
 * 注意：这些防护措施都可以被绕过，只是增加难度
 */

(function() {
  'use strict';

  // 检查是否启用防护
  const config = window.devToolsProtectionConfig || {};
  if (!config.enabled) {
    return;
  }

  // 禁用F12、Ctrl+Shift+I、Ctrl+Shift+J、Ctrl+U等快捷键
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Ctrl+Shift+I (Windows/Linux) 或 Cmd+Option+I (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Ctrl+Shift+J (Windows/Linux) 或 Cmd+Option+J (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Ctrl+Shift+C (Windows/Linux) 或 Cmd+Option+C (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Ctrl+U (查看源代码)
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Ctrl+S (保存页面)
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // 禁用右键菜单
  if (config.disableRightClick !== false) {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);
  }

  // 禁用文本选择（可选）
  if (config.disableTextSelection) {
    document.addEventListener('selectstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);
    
    document.addEventListener('dragstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);
    
    // 禁用文本选择的CSS
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 检测开发者工具是否打开（通过定时器检测窗口尺寸变化）
  if (config.detectDevTools) {
    let devToolsOpen = false;
    let threshold = config.devToolsThreshold || 160;
    
    function detectDevTools() {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          // 可以在这里执行一些操作，比如清空页面、跳转等
          if (config.onDevToolsOpen === 'redirect') {
            window.location.href = config.redirectUrl || '/';
          } else if (config.onDevToolsOpen === 'clear') {
            document.body.innerHTML = '';
          } else if (config.onDevToolsOpen === 'close') {
            // 尝试关闭开发者工具（但通常无法做到）
            window.close();
          }
        }
      } else {
        devToolsOpen = false;
      }
    }
    
    setInterval(detectDevTools, 500);
  }

  // 禁用控制台（通过重定向console方法）
  if (config.disableConsole) {
    const noop = function() {};
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    
    methods.forEach(function(method) {
      if (window.console && window.console[method]) {
        window.console[method] = noop;
      }
    });
  }

  // 禁用调试器（通过debugger语句）
  if (config.disableDebugger) {
    setInterval(function() {
      debugger;
    }, 1000);
  }

  // 阻止通过iframe打开开发者工具
  if (config.preventIframe) {
    if (window.self !== window.top) {
      window.top.location = window.self.location;
    }
  }

})();

