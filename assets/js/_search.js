/**
 * 轻量本地搜索：基于生成的 /index.json
 * - 不改动任何现有样式；仅操作 #search-input, #search-results
 * - 侧栏搜索和导航搜索只需跳转到 /search?q=keyword 即可
 */
(function(){
  document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(location.search);
    const initialQ = (params.get('q') || '').trim();
    const input = document.getElementById('search-input');
    const resultList = document.getElementById('search-results');
    const resultCount = document.getElementById('search-result-count');

    // 模态触发/关闭
    const trigger = document.querySelector('.nav-search-trigger');
    const modal = document.getElementById('search-modal');
    const overlay = modal ? modal.querySelector('.search-overlay') : null;
    const closeBtn = modal ? modal.querySelector('.search-close') : null;
    if (trigger && modal) {
      trigger.addEventListener('click', function(){
        modal.classList.add('open');
        setTimeout(function(){ if (input) input.focus(); }, 50);
      });
    }
    if (overlay) overlay.addEventListener('click', function(){ modal.classList.remove('open'); });
    if (closeBtn) closeBtn.addEventListener('click', function(){ modal.classList.remove('open'); });

    if (input && initialQ) {
      input.value = initialQ;
    }

    // 引擎切换（预留 Algolia 等）
    const engine = (window.__SEARCH_ENGINE__) || 'local';
    if (engine !== 'local') return; // 其他引擎后续接入

    let indexCache = null;
    function loadIndex(){
      if (indexCache) return Promise.resolve(indexCache);
      return fetch('/index.json', { cache: 'no-store' })
        .then(function(res){ return res.json(); })
        .then(function(data){ indexCache = data; return data; });
    }

    function escapeRegExp(str){
      return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    function highlight(text, keyword){
      if (!keyword) return escapeHtml(text || '');
      const pattern = new RegExp('('+ escapeRegExp(keyword) +')', 'ig');
      return escapeHtml(text || '').replace(pattern, '<mark>$1</mark>');
    }

    function renderResults(keyword, data){
      if (!resultList || !resultCount) return;
      if (!keyword){
        resultCount.textContent = '';
        resultList.innerHTML = '';
        return;
      }
      const k = keyword.toLowerCase();
      const results = data.filter(function(item){
        const title = (item.title || '').toLowerCase();
        const desc  = (item.description || '').toLowerCase();
        const tags  = (item.tags || []).join(' ').toLowerCase();
        const cats  = (item.categories || []).join(' ').toLowerCase();
        return title.includes(k) || desc.includes(k) || tags.includes(k) || cats.includes(k);
      }).slice(0, 50);

      resultCount.textContent = '找到 ' + results.length + ' 条结果';
      resultList.innerHTML = results.map(function(item){
        return '<li class="search-item">'
          + '<a class="search-title" href="' + item.url + '">' + highlight(item.title, keyword) + '</a>'
          + '<p class="search-desc">' + highlight((item.description || '').slice(0, 160), keyword) + '</p>'
        + '</li>';
      }).join('');
      
      // 手机端：点击搜索结果后自动关闭搜索框
      if (window.innerWidth <= 768 && modal) {
        const searchLinks = resultList.querySelectorAll('.search-title');
        searchLinks.forEach(function(link){
          link.addEventListener('click', function(){
            // 延迟关闭，确保链接跳转先执行
            setTimeout(function(){
              modal.classList.remove('open');
            }, 100);
          });
        });
      }
    }

    // 输入即搜（防抖），弹窗打开不展示全部，仅输入后渲染
    let debounceTimer = null;
    if (input) {
      input.addEventListener('input', function(){
        const keyword = input.value.trim();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function(){
          if (!keyword){
            if (resultList) resultList.innerHTML = '';
            if (resultCount) resultCount.textContent = '';
            return;
          }
          loadIndex().then(function(data){ renderResults(keyword, data); });
        }, 150);
      });
      // 若 URL 中有 q，初始化渲染一次
      if (initialQ){
        input.value = initialQ;
        loadIndex().then(function(data){ renderResults(initialQ, data); });
      }
    } else if (initialQ){
      // 非弹窗页面（/search）也支持
      loadIndex().then(function(data){ renderResults(initialQ, data); });
    }

    function escapeHtml(str){
      return String(str).replace(/[&<>"]/g, function(s){
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]);
      });
    }
  });
})();


