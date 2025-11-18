// 移动端菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siteNavMain = document.querySelector('.site-nav-main');
    
    // 桌面端：点击拥有子菜单的项，切换展开状态（支持二/三级）
    const dropdownToggles = document.querySelectorAll('.nav-item-dropdown > .nav-link-main, .nav-item-subdropdown > .nav-dropdown-link.has-children');
    
    if (mobileMenuToggle && siteNavMain) {
      mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        siteNavMain.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('active');
      });
      
      // 点击外部关闭菜单
      document.addEventListener('click', function(event) {
        if (!event.target.closest('.site-header')) {
          siteNavMain.classList.remove('mobile-open');
          mobileMenuToggle.classList.remove('active');
        }
      });
      
      // 点击导航链接关闭菜单（移动端）
      siteNavMain.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
          if (event.target.tagName === 'A') {
            siteNavMain.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
          }
        }
      });
    }

    // 切换展开、点击外部关闭（桌面端）
    dropdownToggles.forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        // 仅桌面端使用点击展开（移动端由样式直接展开）
        if (window.innerWidth > 768) {
          e.preventDefault();
          const parent = this.parentElement;
          const opened = document.querySelectorAll('.nav-item-dropdown.open, .nav-item-subdropdown.open');
          opened.forEach(function(el){ if (el !== parent) el.classList.remove('open'); });
          parent.classList.toggle('open');
        }
      });
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.site-nav-main')) {
        document.querySelectorAll('.nav-item-dropdown.open, .nav-item-subdropdown.open').forEach(function(el){
          el.classList.remove('open');
        });
      }
    });
  });