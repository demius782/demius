// 瀑布流无限滚动功能
class MasonryInfiniteScroll {
  constructor() {
    this.container = document.getElementById('masonry-container');
    this.columns = this.container?.querySelectorAll('.masonry-column') || [];
    this.loadMoreBtn = document.getElementById('load-more-btn');
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.currentPage = 2;
    this.totalPages = parseInt(this.loadMoreBtn?.dataset.totalPages) || 1;
    this.isLoading = false;
    // 总是允许加载更多，不受分页限制
    this.hasMorePages = true;

    this.init();
  }

  init() {
    if (!this.loadMoreBtn || !this.hasMorePages) {
      this.hideLoadMore();
      return;
    }

    // 初始化现有文章到瀑布流
    this.initializeExistingPosts();

    // 绑定加载更多按钮点击事件
    this.loadMoreBtn.addEventListener('click', () => this.loadMorePosts());

    // 绑定滚动加载
    window.addEventListener('scroll', () => this.handleScroll());

    this.checkMorePages();
  }

  // 初始化现有文章到瀑布流布局
  initializeExistingPosts() {
    const existingPosts = document.querySelectorAll('.masonry-item');
    existingPosts.forEach((post, index) => {
      // 检查文章是否已经在正确的列中
      const parentColumn = post.closest('.masonry-column');
      if (!parentColumn) {
        // 如果文章不在任何列中，添加到瀑布流
        this.addPostToMasonry(post, index);
      }
      // 不要移除原位置的文章，避免闪烁
    });
  }

  // 将文章按3列循环分配到正确的列
  addPostToMasonry(postElement, index) {
    if (this.columns.length === 0) return;

    // 计算应该分配到哪一列 (0,1,2 对应第1,2,3列)
    const columnIndex = index % 3;
    const targetColumn = this.columns[columnIndex];

    // 克隆并添加到目标列
    const clonedPost = postElement.cloneNode(true);
    targetColumn.appendChild(clonedPost);
  }

  async loadMorePosts() {
    if (this.isLoading || !this.hasMorePages) return;

    this.isLoading = true;
    this.showLoading();

    try {
      const response = await fetch(`/?page=${this.currentPage}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const html = await response.text();

      // 解析HTML获取新的文章卡片
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newPostsContainer = doc.querySelector('.masonry-grid');
      
      if (newPostsContainer) {
        const newPosts = newPostsContainer.querySelectorAll('.masonry-item');
        
        if (newPosts.length > 0) {
          // 获取当前已存在的文章链接用于去重
          const existingLinks = new Set();
          document.querySelectorAll('.masonry-item .post-title a').forEach(link => {
            existingLinks.add(link.href);
          });
          
          // 过滤掉已经存在的文章
          const uniqueNewPosts = newPosts.filter(post => {
            const postLink = post.querySelector('.post-title a').href;
            return !existingLinks.has(postLink);
          });
          
          if (uniqueNewPosts.length > 0) {
            // 计算当前已有的文章数量，用于确定新文章的起始索引
            const existingPosts = document.querySelectorAll('.masonry-item');
            const startIndex = existingPosts.length;
            
            uniqueNewPosts.forEach((post, index) => {
              this.addPostToMasonry(post, startIndex + index);
            });

            this.currentPage++;
            // 总是认为还有更多页面，直到服务器返回空结果
            this.hasMorePages = true;
            this.checkMorePages();
            
            // 触发自定义事件，通知其他组件有新内容加载
            window.dispatchEvent(new CustomEvent('masonryContentLoaded'));
          } else {
            // 如果没有新的唯一文章，继续尝试下一页
            this.currentPage++;
            this.hasMorePages = true;
            this.checkMorePages();
          }
        } else {
          // 如果服务器返回空结果，继续尝试下一页
          this.currentPage++;
          this.hasMorePages = true;
          this.checkMorePages();
        }
      }

    } catch (error) {
      console.error('加载更多文章失败:', error);
      // 即使出错也继续尝试加载
      this.currentPage++;
      this.hasMorePages = true;
    } finally {
      this.isLoading = false;
      this.hideLoading();
      this.checkMorePages();
    }
  }

  handleScroll() {
    if (this.isLoading || !this.hasMorePages) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 距离底部300px时自动加载
    if (scrollTop + windowHeight >= documentHeight - 300) {
      this.loadMorePosts();
    }
  }

  showLoading() {
    if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
    if (this.loadingSpinner) this.loadingSpinner.style.display = 'flex';
  }

  hideLoading() {
    if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'block';
    if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
  }

  hideLoadMore() {
    if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
    if (this.loadingSpinner) this.loadingSpinner.style.display = 'none';
  }

  checkMorePages() {
    if (!this.hasMorePages) {
      this.hideLoadMore();
    }
  }
}

// 初始化瀑布流功能
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.masonry-grid')) {
    new MasonryInfiniteScroll();
  }
});