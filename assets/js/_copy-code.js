// 为所有代码块添加复制按钮
document.addEventListener('DOMContentLoaded', () => {
    // 遍历所有代码块
    document.querySelectorAll('.post-content pre').forEach(pre => {
      // 创建复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制';
      
      // 添加点击事件
      copyBtn.addEventListener('click', () => {
        // 获取代码块内容
        const code = pre.querySelector('code').innerText;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(code).then(() => {
          // 显示成功状态
          copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
          copyBtn.classList.add('success');
          
          // 2秒后恢复原始状态
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制';
            copyBtn.classList.remove('success');
          }, 2000);
        }).catch(err => {
          console.error('复制失败:', err);
          copyBtn.innerHTML = '<i class="fas fa-times"></i> 失败';
        });
      });
      
      // 将按钮添加到代码块
      pre.appendChild(copyBtn);
    });
  });