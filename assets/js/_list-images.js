// 将无序/有序列表中“裸图片 URL”兜底转换为 <img>
// 典型情况：用户写了 `- https://xxx.com/a.png`，Markdown 只会生成链接/纯文本，而不会自动当图片渲染。
(function () {
  const IMG_EXT_RE = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i;

  function isImageUrl(url) {
    if (!url) return false;
    return IMG_EXT_RE.test(url.trim());
  }

  function stripTrailingPunct(text) {
    // 处理末尾带逗号/句号/括号等导致 url 不匹配的情况
    return text.replace(/[)\].,;!?]+$/g, '').trim();
  }

  function normalizeQuotedUrl(url) {
    return String(url || '').trim().replace(/^["']|["']$/g, '');
  }

  function getOnlyText(li) {
    // 只处理“列表项文本基本等于 URL”的场景，避免误伤其它链接/文字
    return (li.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function convertLi(li) {
    if (!li || li.dataset.listImagesConverted === 'true') return;
    li.dataset.listImagesConverted = 'true';

    if (li.querySelector('img')) return; // 已经渲染过则不处理

    const text = stripTrailingPunct(getOnlyText(li));
    if (isImageUrl(text)) {
      li.innerHTML = `<img src="${normalizeQuotedUrl(text)}" alt="" loading="lazy">`;
      return;
    }

    // 如果 Markdown 把裸 URL 自动变成了 <a href="...png">...</a>，也尝试兜底
    const anchors = Array.from(li.querySelectorAll('a[href]'));
    if (anchors.length !== 1) return;

    const a = anchors[0];
    const href = stripTrailingPunct(a.getAttribute('href') || '');
    const anchorText = stripTrailingPunct((a.textContent || '').trim());

    if (!isImageUrl(href)) return;

    // anchor 的可视文本通常就是 url 本身；这里要求两者一致，降低误判
    if (anchorText !== href) return;

    li.innerHTML = `<img src="${normalizeQuotedUrl(href)}" alt="" loading="lazy">`;
  }

  function initListImages() {
    const lis = Array.from(
      document.querySelectorAll('article.post .post-content ul > li, article.post .post-content ol > li')
    );
    for (const li of lis) convertLi(li);
  }

  window.initListImages = initListImages;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initListImages);
  } else {
    initListImages();
  }
})();

