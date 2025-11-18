/**
 * 文章阅读时长统计
 * 根据字数计算阅读时长
 */

(function() {
  'use strict';

  // 初始化阅读时长统计
  function initReadingTime() {
    const readingTimeElement = document.querySelector('.post-reading-time .reading-time-number');
    if (!readingTimeElement) {
      return; // 不在文章详情页，直接返回
    }

    const wordCountElement = document.querySelector('.post-reading-time');
    if (!wordCountElement) {
      return;
    }

    // 从 data 属性获取字数
    const wordCount = parseInt(wordCountElement.dataset.wordCount || '0', 10);
    
    if (wordCount <= 0) {
      // 如果没有字数，尝试从字数统计元素获取
      const wordCountText = document.querySelector('.post-word-count');
      if (wordCountText) {
        const text = wordCountText.textContent || '';
        const match = text.match(/(\d+)/);
        if (match) {
          const extractedWordCount = parseInt(match[1], 10);
          if (extractedWordCount > 0) {
            calculateReadingTime(readingTimeElement, extractedWordCount);
            return;
          }
        }
      }
      
      // 如果还是获取不到，显示默认值
      readingTimeElement.textContent = '1';
      return;
    }

    // 计算并显示阅读时长
    calculateReadingTime(readingTimeElement, wordCount);
  }

  // 计算阅读时长
  function calculateReadingTime(element, wordCount) {
    if (!element || wordCount <= 0) return;

    // 阅读速度设置（字/分钟）
    // 中文：通常 300-500 字/分钟，这里取 400 字/分钟
    // 英文：通常 200-250 字/分钟，这里取 200 字/分钟
    // 混合内容取平均值：300 字/分钟
    
    // 由于无法准确区分中英文，使用混合速度
    const readingSpeed = 300; // 字/分钟
    
    // 计算阅读时长（分钟）
    let readingTime = Math.ceil(wordCount / readingSpeed);
    
    // 最少 1 分钟
    if (readingTime < 1) {
      readingTime = 1;
    }
    
    // 更新显示
    element.textContent = readingTime.toString();
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingTime);
  } else {
    initReadingTime();
  }

  // 支持 PJAX 重新初始化
  document.addEventListener('pjax:complete', initReadingTime);
  
  // 导出全局函数供外部调用
  window.initReadingTime = initReadingTime;
})();
