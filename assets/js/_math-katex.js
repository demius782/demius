// 将正文里的 LaTeX ($...$ / $$...$$ / \(...\) / \[...\]) 自动渲染为 KaTeX
// 说明：Hugo 侧不一定开启 goldmark.math 时，页面会直接显示 `$...$` 源码；
// 这里通过 KaTeX auto-render 进行前端兜底渲染。
(function () {
  const katexRenderOptions = {
    delimiters: [
      { left: '$', right: '$', display: false },
      { left: '$$', right: '$$', display: true },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    throwOnError: false
  };

  function getContainers() {
    return Array.from(document.querySelectorAll('article.post .post-content'));
  }

  function tryRender() {
    const containers = getContainers();
    if (!containers.length) return { renderedAny: false, allReady: true };

    if (typeof window.renderMathInElement !== 'function') {
      // KaTeX 尚未加载完成
      return { renderedAny: false, allReady: false };
    }

    let renderedAny = false;
    for (const container of containers) {
      if (container.dataset.katexRendered === 'true') continue;

      window.renderMathInElement(container, katexRenderOptions);
      container.dataset.katexRendered = 'true';
      renderedAny = true;
    }

    return { renderedAny, allReady: true };
  }

  function initMath() {
    let tries = 0;
    const maxTries = 10;

    function tick() {
      tries++;
      const { renderedAny, allReady } = tryRender();

      if (renderedAny || allReady === true || tries >= maxTries) {
        return;
      }

      setTimeout(tick, 150);
    }

    tick();
  }

  window.initMath = initMath;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMath);
  } else {
    initMath();
  }
})();

