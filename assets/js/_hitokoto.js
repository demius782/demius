/**
 * 侧栏一言组件 - JavaScript逻辑
 * 支持青桔API（nsmao）和今日诗词（jinrishici）
 */

(function() {
  'use strict';

  // 记录当前使用的API类型
  let currentApiType = null;
  let jinrishiciLoaded = false;

  function initHitokoto() {
    // 检查组件是否存在
    const hitokotoCard = document.querySelector('.hitokoto-card');
    if (!hitokotoCard) {
      return;
    }

    // 检查配置
    const config = window.hitokotoConfig || {};
    if (!config.enabled) {
      return;
    }

    const sentenceEl = document.getElementById('hitokoto-sentence');
    const fromEl = document.getElementById('hitokoto-from');

    if (!sentenceEl) {
      return;
    }

    // 获取一言
    const apiType = config.apiType || 'nsmao';
    currentApiType = apiType;

    if (apiType === 'nsmao' && config.nsmao && config.nsmao.apiKey) {
      // 使用青桔API
      fetchNsmaoHitokoto(config.nsmao, sentenceEl, fromEl, config.showFrom).catch(() => {
        // 如果青桔API失败，尝试使用备用API（今日诗词）
        fallbackToJinrishici(sentenceEl, fromEl, config.showFrom);
      });
    } else {
      // 直接使用今日诗词API
      loadJinrishici(sentenceEl, fromEl, config.showFrom);
    }
  }

  // 获取青桔API一言
  async function fetchNsmaoHitokoto(config, sentenceEl, fromEl, showFrom) {
    try {
      // 构建请求URL，直接在URL中传递key参数
      const apiUrl = config.apiUrl || 'https://api.nsmao.net/api/history/query';
      const url = `${apiUrl}?key=${encodeURIComponent(config.apiKey)}`;
      
      // 发送GET请求
      const response = await fetch(url, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // 检查是否有错误
      if (result.code && result.code !== 200) {
        throw new Error(result.msg || result.message || 'API返回错误');
      }
      
      // 解析响应：data是一个对象，键是年份，值是历史事件
      let content = null;
      let from = null;
      
      if (result.data && typeof result.data === 'object') {
        // 从data对象中随机选择一个条目
        const entries = Object.entries(result.data);
        if (entries.length > 0) {
          // 随机选择一个条目
          const randomIndex = Math.floor(Math.random() * entries.length);
          const [year, event] = entries[randomIndex];
          content = event;
          from = year;
        }
      }

      if (content) {
        sentenceEl.innerHTML = escapeHtml(content);
        if (showFrom && fromEl && from) {
          fromEl.textContent = from;
          fromEl.style.display = 'block';
        } else if (fromEl) {
          fromEl.style.display = 'none';
        }
      } else {
        console.error('API返回数据:', result);
        throw new Error('API返回格式不正确，未找到内容字段');
      }
    } catch (error) {
      console.error('获取青桔API一言失败:', error);
      throw error;
    }
  }


  // 加载今日诗词API
  function loadJinrishici(sentenceEl, fromEl, showFrom) {
    if (jinrishiciLoaded) {
      // 如果已经加载，直接调用
      if (window.jinrishici && window.jinrishici.load) {
        window.jinrishici.load(function(result) {
          if (result && result.data) {
            sentenceEl.innerHTML = escapeHtml(result.data.content);
            if (showFrom && fromEl && result.data.origin) {
              fromEl.textContent = result.data.origin.title || result.data.origin.dynasty + '·' + result.data.origin.author;
              fromEl.style.display = 'block';
            } else if (fromEl) {
              fromEl.style.display = 'none';
            }
          }
        });
      }
      return;
    }

    // 加载今日诗词SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.jinrishici.com/v2/browser/jinrishici.js';
    script.charset = 'utf-8';
    script.onload = function() {
      jinrishiciLoaded = true;
      if (window.jinrishici && window.jinrishici.load) {
        window.jinrishici.load(function(result) {
          if (result && result.data) {
            sentenceEl.innerHTML = escapeHtml(result.data.content);
            if (showFrom && fromEl && result.data.origin) {
              fromEl.textContent = result.data.origin.title || result.data.origin.dynasty + '·' + result.data.origin.author;
              fromEl.style.display = 'block';
            } else if (fromEl) {
              fromEl.style.display = 'none';
            }
          }
        });
      }
    };
    script.onerror = function() {
      sentenceEl.innerHTML = '<span class="hitokoto-error">加载失败，请稍后重试</span>';
    };
    document.head.appendChild(script);
  }

  // 备用方案：使用今日诗词
  function fallbackToJinrishici(sentenceEl, fromEl, showFrom) {
    if (currentApiType === 'jinrishici') {
      return; // 已经使用今日诗词，不需要再次尝试
    }
    loadJinrishici(sentenceEl, fromEl, showFrom);
  }

  // HTML转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHitokoto);
  } else {
    initHitokoto();
  }

  // 支持PJAX重新初始化
  document.addEventListener('pjax:complete', function() {
    setTimeout(initHitokoto, 100);
  });
})();

