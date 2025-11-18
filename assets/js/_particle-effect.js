// 背景粒子特效功能
// 参考 BeaconNav 主题实现

(function() {
  'use strict';

  // 粒子特效类
  class ParticleEffect {
    constructor(options = {}) {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animationId = null;
      this.mouse = { x: 0, y: 0 };
      
      // 默认配置
      this.config = {
        enable: options.enable !== false,
        particleCount: options.particleCount || 80,
        particleColor: options.particleColor || 'rgba(255, 255, 255, 0.5)',
        lineColor: options.lineColor || 'rgba(255, 255, 255, 0.1)',
        lineDistance: options.lineDistance || 150,
        particleSpeed: options.particleSpeed || 0.5,
        particleRadius: options.particleRadius || 1.5,
        interactive: options.interactive !== false,
        zIndex: options.zIndex || 0
      };
      
      if (this.config.enable) {
        this.init();
      }
    }

    init() {
      // 创建 canvas 元素
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'particle-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = this.config.zIndex;
      this.canvas.style.opacity = '1';
      
      // 插入到 body 最前面
      document.body.insertBefore(this.canvas, document.body.firstChild);
      
      this.ctx = this.canvas.getContext('2d');
      
      // 设置 canvas 尺寸
      this.resize();
      
      // 创建粒子
      this.createParticles();
      
      // 绑定事件
      this.bindEvents();
      
      // 开始动画
      this.animate();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.config.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * this.config.particleSpeed,
          vy: (Math.random() - 0.5) * this.config.particleSpeed,
          radius: this.config.particleRadius
        });
      }
    }

    bindEvents() {
      // 窗口大小改变
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.resize();
          this.createParticles();
        }, 100);
      });

      // 鼠标移动（交互模式）
      if (this.config.interactive) {
        window.addEventListener('mousemove', (e) => {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
          this.mouse.x = -1000;
          this.mouse.y = -1000;
        });
      }

      // PJAX 页面切换时重新初始化
      document.addEventListener('pjax:complete', () => {
        if (this.canvas && this.canvas.parentNode) {
          // 页面切换时保持粒子特效运行
          this.resize();
        }
      });
    }

    draw() {
      // 清空画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 更新和绘制粒子
      for (let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i];
        
        // 更新粒子位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界检测
        if (particle.x < 0 || particle.x > this.canvas.width) {
          particle.vx = -particle.vx;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
          particle.vy = -particle.vy;
        }
        
        // 确保粒子在画布内
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        
        // 绘制粒子
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.particleColor;
        this.ctx.fill();
        
        // 绘制连线
        for (let j = i + 1; j < this.particles.length; j++) {
          const otherParticle = this.particles[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.config.lineDistance) {
            const opacity = (1 - distance / this.config.lineDistance) * 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            // 动态设置连线透明度
            let strokeColor = this.config.lineColor;
            if (strokeColor.includes('rgba')) {
              // 替换 rgba 中的透明度值
              strokeColor = strokeColor.replace(/rgba\(([^)]+)\)/, (match, content) => {
                const parts = content.split(',');
                if (parts.length === 4) {
                  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity.toFixed(2)})`;
                }
                return match;
              });
            }
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
        
        // 鼠标交互（如果启用）
        if (this.config.interactive && this.mouse.x !== 0 && this.mouse.y !== 0) {
          const dx = particle.x - this.mouse.x;
          const dy = particle.y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.config.lineDistance * 2) {
            const opacity = (1 - distance / (this.config.lineDistance * 2)) * 0.3;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            // 动态设置鼠标交互连线透明度
            let strokeColor = this.config.lineColor;
            if (strokeColor.includes('rgba')) {
              // 替换 rgba 中的透明度值
              strokeColor = strokeColor.replace(/rgba\(([^)]+)\)/, (match, content) => {
                const parts = content.split(',');
                if (parts.length === 4) {
                  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity.toFixed(2)})`;
                }
                return match;
              });
            }
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
    }

    animate() {
      this.draw();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // 初始化粒子特效
  function initParticleEffect() {
    // 检查配置
    if (!window.siteConfig) {
      console.warn('Particle Effect: siteConfig not found');
      return;
    }

    const particleEnable = window.siteConfig.particleEffectEnable === true || 
                          window.siteConfig.particleEffectEnable === 'true' || 
                          String(window.siteConfig.particleEffectEnable).toLowerCase() === 'true';

    if (!particleEnable) {
      return;
    }

    // 获取配置
    const config = {
      enable: true,
      particleCount: parseInt(window.siteConfig.particleEffectCount || '80', 10),
      particleColor: window.siteConfig.particleEffectColor || 'rgba(255, 255, 255, 0.5)',
      lineColor: window.siteConfig.particleEffectLineColor || 'rgba(255, 255, 255, 0.1)',
      lineDistance: parseInt(window.siteConfig.particleEffectLineDistance || '150', 10),
      particleSpeed: parseFloat(window.siteConfig.particleEffectSpeed || '0.5'),
      particleRadius: parseFloat(window.siteConfig.particleEffectRadius || '1.5'),
      interactive: window.siteConfig.particleEffectInteractive !== false,
      zIndex: parseInt(window.siteConfig.particleEffectZIndex || '0', 10)
    };

    // 根据主题调整颜色
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // 处理粒子颜色
    if (!config.particleColor || config.particleColor.trim() === '') {
      if (currentTheme === 'dark') {
        config.particleColor = 'rgba(255, 255, 255, 0.5)';
      } else {
        config.particleColor = 'rgba(0, 0, 0, 0.3)';
      }
    } else {
      // 如果提供了颜色但格式是十六进制，转换为 rgba
      if (config.particleColor.startsWith('#')) {
        const hex = config.particleColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        config.particleColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
      }
    }
    
    // 处理连线颜色
    if (!config.lineColor || config.lineColor.trim() === '') {
      if (currentTheme === 'dark') {
        config.lineColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        config.lineColor = 'rgba(0, 0, 0, 0.1)';
      }
    } else {
      // 如果提供了颜色但格式是十六进制，转换为 rgba
      if (config.lineColor.startsWith('#')) {
        const hex = config.lineColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        config.lineColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
      }
    }

    // 创建粒子特效实例
    window.particleEffect = new ParticleEffect(config);

    // 监听主题切换
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
          if (window.particleEffect) {
            // 根据新主题更新颜色（仅在未自定义颜色时）
            const customParticleColor = window.siteConfig.particleEffectColor && 
                                       window.siteConfig.particleEffectColor.trim() !== '';
            const customLineColor = window.siteConfig.particleEffectLineColor && 
                                  window.siteConfig.particleEffectLineColor.trim() !== '';
            
            if (!customParticleColor) {
              if (newTheme === 'dark') {
                window.particleEffect.config.particleColor = 'rgba(255, 255, 255, 0.5)';
              } else {
                window.particleEffect.config.particleColor = 'rgba(0, 0, 0, 0.3)';
              }
            }
            
            if (!customLineColor) {
              if (newTheme === 'dark') {
                window.particleEffect.config.lineColor = 'rgba(255, 255, 255, 0.1)';
              } else {
                window.particleEffect.config.lineColor = 'rgba(0, 0, 0, 0.1)';
              }
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleEffect);
  } else {
    initParticleEffect();
  }

  // PJAX 页面切换时重新初始化
  document.addEventListener('pjax:complete', () => {
    if (window.particleEffect) {
      // 页面切换时保持运行，只需要调整尺寸
      window.particleEffect.resize();
    } else {
      // 如果之前没有初始化，现在初始化
      initParticleEffect();
    }
  });
})();

