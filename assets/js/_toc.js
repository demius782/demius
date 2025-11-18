// 文章目录阅读进度高亮功能 - 修复版
function initToc() {
  const toc = document.querySelector('.aside-card .toc-content');
  if (!toc) return;

  // 获取所有标题元素
  const headings = Array.from(
    document.querySelectorAll('article h1[id], article h2[id], article h3[id], article h4[id]')
  );
  const tocLinks = toc.querySelectorAll('.toc-content a');
  
  if (headings.length === 0 || tocLinks.length === 0) return;

  // 创建观察器 - 使用更安全的配置
  const observer = new IntersectionObserver((entries) => {
    try {
      let currentActive = null;
      
      entries.forEach((entry) => {
        if (!entry.target || !entry.isIntersecting) return;
        
        const id = entry.target.getAttribute('id');
        if (!id) return;

        const tocLink = toc.querySelector(`.toc-content a[href="#${id}"]`);
        if (!tocLink) return;

        const listItem = tocLink.parentElement;
        if (!listItem) return;

        // 找到当前可见的标题
        if (!currentActive) {
          currentActive = listItem;
        } else if (entry.boundingClientRect && entry.boundingClientRect.top) {
          // 只有在有有效数据时才比较
          currentActive = listItem;
        }
      });

      // 移除所有active类
      toc.querySelectorAll('.toc-content li.active').forEach(item => {
        item.classList.remove('active');
      });

      // 为当前活动项添加active类
      if (currentActive && currentActive.classList) {
        currentActive.classList.add('active');
        
        // 可选：自动滚动到当前活动项
        const tocContent = toc.querySelector('.toc-content');
        if (tocContent && tocContent.scrollHeight > tocContent.clientHeight) {
          const scrollTop = currentActive.offsetTop - tocContent.offsetTop - 30;
          if (scrollTop >= 0) {
            tocContent.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            });
          }
        }
      }
    } catch (error) {
      // 目录高亮功能出错，静默处理
    }
  }, {
    rootMargin: '0px 0px -50% 0px',
    threshold: 0.1
  });

  // 观察所有标题
  headings.forEach(heading => {
    if (heading.id) {
      observer.observe(heading);
    }
  });

  // 点击目录项时的平滑滚动
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      if (!targetId) return;
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initToc);

// 暴露到全局作用域，供pjax调用
window.initToc = initToc;