/**
 * 侧边栏最新评论
 * 依赖：data-recent-comments 属性容器
 */
(function () {
    // 读容器节点
    const box = document.querySelector('[data-recent-comments]');
    if (!box) return;
  
    // 读配置
    const enable   = box.dataset.enable === 'true';
    const limit    = Number(box.dataset.limit || 5);
    const server   = box.dataset.server;
    const siteName = box.dataset.siteName;
    const type     = box.dataset.gravatar || 'mp';
  
    if (!enable) {
      box.closest('.recent-comments-card').style.display = 'none';
      return;
    }
  
    /* ---- 工具函数 ---- */
    const getAvatar = (c) => {
      if (c.avatar_url?.trim()) return c.avatar_url;
      if (c.avatar?.trim())     return c.avatar;
      if (c.email_encrypted?.trim()) {
        return `https://weavatar.com/avatar/${c.email_encrypted}?d=${type}&s=240`;
      }
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZGRkIi8+PC9zdmc+';
    };
  
    /* ---- 请求数据 ---- */
    const api = `${server}/api/v2/stats/latest_comments?site_name=${encodeURIComponent(siteName)}&limit=${limit}`;
  
    fetch(api)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(json => {
        const list = json.data || [];
        if (!list.length) { box.innerHTML = '<p class="no-data">暂无评论</p>'; return; }
  
        const origin = location.origin;
  
        box.innerHTML = list.map(c => {
          let pageUrl = c.page_url || '';
          try {   // 同域则转相对路径
            const u = new URL(pageUrl);
            if (u.origin === origin) pageUrl = u.pathname + u.search + u.hash;
          } catch {}
  
          const avatar = getAvatar(c);
          const nick   = c.nick || '匿名用户';
          const date   = c.date ? new Date(c.date).toLocaleDateString() : '未知时间';
          const id     = c.id || '';
  
          let content = (c.content || '')
                        .replace(/<img[^>]*>/g, '[表情]')
                        .replace(/<[^>]*>/g, '')
                        .slice(0, 50);
  
          return `
            <a class="rc-item" href="${pageUrl}#atk-comment-${id}" title="查看评论">
              <img class="rc-avatar" src="${avatar}" alt="${nick}" loading="lazy">
              <div class="rc-body">
                <div class="rc-header">
                  <span class="rc-nick">${nick}</span>
                  <time>${date}</time>
                </div>
                <div class="rc-content">${content}</div>
              </div>
            </a>`;
        }).join('');
      })
      .catch(err => {
        console.error('[recent-comments]', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          box.innerHTML = '<p class="no-data">评论服务器暂时不可用</p>';
        } else {
          box.innerHTML = `<p class="no-data">加载失败: ${err.message}</p>`;
        }
      });
  })();