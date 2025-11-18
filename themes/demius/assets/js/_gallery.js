// ===== 相册功能脚本 =====

(function() {
  'use strict';

  let galleryData = null;
  let currentAlbumIndex = -1;
  let currentPhotoIndex = -1;
  let lightboxOpen = false;

  // 初始化相册功能
  function initGallery() {
    // 检查是否在相册页面
    const galleryPage = document.querySelector('.gallery-page');
    if (!galleryPage) {
      return; // 不在相册页面，直接返回
    }

    // 读取相册数据
    const galleryDataEl = document.getElementById('gallery-data');
    if (!galleryDataEl) {
      return;
    }

    try {
      galleryData = JSON.parse(galleryDataEl.textContent);
    } catch (e) {
      console.error('解析相册数据失败:', e);
      return;
    }

    // 绑定事件
    bindAlbumCardEvents();
    bindBackButton();
    bindLightboxEvents();
    bindPhotoClickEvents();
  }

  // 绑定相册卡片点击事件
  function bindAlbumCardEvents() {
    const albumCards = document.querySelectorAll('.gallery-album-card');
    
    albumCards.forEach((card, index) => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const albumIndex = parseInt(this.dataset.albumIndex);
        showAlbumDetail(albumIndex);
      });
    });
  }

  // 显示相册详情
  function showAlbumDetail(albumIndex) {
    if (!galleryData || !galleryData.groups || !galleryData.groups[albumIndex]) {
      return;
    }

    currentAlbumIndex = albumIndex;
    const album = galleryData.groups[albumIndex];

    // 更新详情页标题和描述
    const titleEl = document.getElementById('gallery-detail-title');
    const descEl = document.getElementById('gallery-detail-desc');
    const countEl = document.getElementById('gallery-detail-count');
    
    if (titleEl) titleEl.textContent = album.name;
    if (descEl) descEl.textContent = album.description;
    if (countEl) countEl.textContent = `${album.photos.length} 张照片`;

    // 隐藏列表视图，显示详情视图
    const albumsView = document.getElementById('gallery-albums-view');
    const detailView = document.getElementById('gallery-detail-view');
    
    if (albumsView) albumsView.style.display = 'none';
    if (detailView) detailView.style.display = 'block';

    // 显示对应的照片网格
    const allPhotoGrids = detailView.querySelectorAll('.gallery-photos-grid');
    
    allPhotoGrids.forEach(grid => {
      grid.style.display = 'none';
    });

    const currentGrid = detailView.querySelector(
      `.gallery-photos-grid[data-album-index="${albumIndex}"]`
    );
    
    if (currentGrid) {
      currentGrid.style.display = 'grid';
    }

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 重新绑定照片点击事件
    bindPhotoClickEvents();
  }

  // 绑定返回按钮事件
  function bindBackButton() {
    const backBtn = document.getElementById('gallery-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', showAlbumsList);
    }
  }

  // 显示相册列表
  function showAlbumsList() {
    const albumsView = document.getElementById('gallery-albums-view');
    const detailView = document.getElementById('gallery-detail-view');
    
    albumsView.style.display = 'block';
    detailView.style.display = 'none';

    currentAlbumIndex = -1;

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 绑定照片点击事件（打开lightbox）
  function bindPhotoClickEvents() {
    const photoItems = document.querySelectorAll('.gallery-photo-item');
    photoItems.forEach(item => {
      // 移除旧的事件监听器（通过克隆节点）
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      
      newItem.addEventListener('click', function() {
        const photoIndex = parseInt(this.dataset.photoIndex);
        openLightbox(photoIndex);
      });
    });
  }

  // 绑定Lightbox事件
  function bindLightboxEvents() {
    const lightbox = document.getElementById('gallery-lightbox');
    const closeBtn = document.querySelector('.gallery-lightbox-close');
    const prevBtn = document.querySelector('.gallery-lightbox-prev');
    const nextBtn = document.querySelector('.gallery-lightbox-next');

    if (!lightbox) return;

    // 关闭按钮
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    // 点击背景关闭
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // 上一张
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevPhoto();
      });
    }

    // 下一张
    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextPhoto();
      });
    }

    // 键盘快捷键
    document.addEventListener('keydown', handleKeydown);
  }

  // 处理键盘事件
  function handleKeydown(e) {
    if (!lightboxOpen) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevPhoto();
        break;
      case 'ArrowRight':
        showNextPhoto();
        break;
    }
  }

  // 打开Lightbox
  function openLightbox(photoIndex) {
    if (currentAlbumIndex < 0 || !galleryData) return;

    const album = galleryData.groups[currentAlbumIndex];
    if (!album || !album.photos[photoIndex]) return;

    currentPhotoIndex = photoIndex;
    const photo = album.photos[photoIndex];

    const lightbox = document.getElementById('gallery-lightbox');
    const img = document.getElementById('lightbox-img');
    const title = document.getElementById('lightbox-title');
    const description = document.getElementById('lightbox-description');
    const date = document.getElementById('lightbox-date');

    if (img) img.src = photo.url;
    if (title) title.textContent = photo.title;
    if (description) description.textContent = photo.description;
    if (date) date.textContent = photo.date;

    if (lightbox) {
      lightbox.classList.add('active');
      lightboxOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  // 关闭Lightbox
  function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      lightboxOpen = false;
      document.body.style.overflow = '';
    }
  }

  // 显示上一张照片
  function showPrevPhoto() {
    if (currentAlbumIndex < 0 || !galleryData) return;

    const album = galleryData.groups[currentAlbumIndex];
    if (!album) return;

    currentPhotoIndex--;
    if (currentPhotoIndex < 0) {
      currentPhotoIndex = album.photos.length - 1;
    }

    updateLightboxPhoto();
  }

  // 显示下一张照片
  function showNextPhoto() {
    if (currentAlbumIndex < 0 || !galleryData) return;

    const album = galleryData.groups[currentAlbumIndex];
    if (!album) return;

    currentPhotoIndex++;
    if (currentPhotoIndex >= album.photos.length) {
      currentPhotoIndex = 0;
    }

    updateLightboxPhoto();
  }

  // 更新Lightbox中的照片
  function updateLightboxPhoto() {
    if (currentAlbumIndex < 0 || !galleryData) return;

    const album = galleryData.groups[currentAlbumIndex];
    if (!album || !album.photos[currentPhotoIndex]) return;

    const photo = album.photos[currentPhotoIndex];
    const img = document.getElementById('lightbox-img');
    const title = document.getElementById('lightbox-title');
    const description = document.getElementById('lightbox-description');
    const date = document.getElementById('lightbox-date');

    if (img) {
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = photo.url;
        img.style.opacity = '1';
      }, 150);
    }
    if (title) title.textContent = photo.title;
    if (description) description.textContent = photo.description;
    if (date) date.textContent = photo.date;
  }

  // 清理相册功能
  function cleanupGallery() {
    // 关闭lightbox
    closeLightbox();
    
    // 重置状态
    currentAlbumIndex = -1;
    currentPhotoIndex = -1;
    lightboxOpen = false;
    galleryData = null;

    // 移除键盘事件监听器
    document.removeEventListener('keydown', handleKeydown);

    // 恢复body滚动
    document.body.style.overflow = '';
  }

  // 暴露给全局以便PJAX调用
  window.initGallery = initGallery;
  window.cleanupGallery = cleanupGallery;

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
