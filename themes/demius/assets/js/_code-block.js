// 代码块功能增强
document.addEventListener('DOMContentLoaded', function() {
    // 处理所有代码块
    const codeBlocks = document.querySelectorAll('article.post .post-content pre');
    
    codeBlocks.forEach((pre, index) => {
      // 增强的代码语言检测
      const language = detectCodeLanguage(pre);
      const code = pre.textContent || '';
      
      // 创建代码容器
      const container = document.createElement('div');
      container.className = 'code-container';
      
      // 创建代码头部
      const header = document.createElement('div');
      header.className = 'code-header';
      
      // 语言显示
      const languageSpan = document.createElement('span');
      languageSpan.className = 'code-language';
      languageSpan.innerHTML = `<i class="fas fa-code"></i>${language}`;
      
      // 操作按钮容器
      const actions = document.createElement('div');
      actions.className = 'code-actions';
      
      // 复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-btn copy-btn';
      copyBtn.innerHTML = '<i class="far fa-copy"></i>复制';
      copyBtn.title = '复制代码';
      
      // 下载按钮
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'code-btn download-btn';
      downloadBtn.innerHTML = '<i class="fas fa-download"></i>下载';
      downloadBtn.title = '下载代码';
      
      // 折叠按钮
      const foldBtn = document.createElement('button');
      foldBtn.className = 'code-btn fold-btn';
      foldBtn.innerHTML = '<i class="fas fa-chevron-down"></i>折叠';
      foldBtn.title = '折叠代码';
      
      // 组装头部
      actions.appendChild(copyBtn);
      actions.appendChild(downloadBtn);
      actions.appendChild(foldBtn);
      header.appendChild(languageSpan);
      header.appendChild(actions);
      
      // 创建代码内容容器
      const content = document.createElement('div');
      content.className = 'code-content';
      
      // 移动原来的 pre 到新容器中
      content.appendChild(pre.cloneNode(true));
      container.appendChild(header);
      container.appendChild(content);
      
      // 替换原来的 pre
      pre.parentNode.replaceChild(container, pre);
      
      // 复制功能
      copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(code).then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fas fa-check"></i>已复制';
          copyBtn.style.background = 'var(--accent)';
          copyBtn.style.borderColor = 'var(--accent)';
          copyBtn.style.color = '#fff';
          
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
            copyBtn.style.borderColor = '';
            copyBtn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('复制失败:', err);
          copyBtn.innerHTML = '<i class="fas fa-times"></i>失败';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i>复制';
          }, 2000);
        });
      });
      
      // 下载功能
      downloadBtn.addEventListener('click', function() {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${language}-${Date.now()}.${getFileExtension(language)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      
      // 折叠功能
      let isCollapsed = false;
      const preElement = content.querySelector('pre');
      
      // 检查代码长度，超过20行自动折叠
      const lineCount = code.split('\n').length;
      if (lineCount > 20) {
        isCollapsed = true;
        preElement.classList.add('collapsed');
        foldBtn.innerHTML = '<i class="fas fa-chevron-down"></i>展开';
        
        // 添加展开按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'code-toggle collapsed';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>展开代码';
        content.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
          isCollapsed = !isCollapsed;
          preElement.classList.toggle('collapsed', isCollapsed);
          foldBtn.innerHTML = isCollapsed ? 
            '<i class="fas fa-chevron-down"></i>展开' : 
            '<i class="fas fa-chevron-up"></i>折叠';
          toggleBtn.classList.toggle('collapsed', isCollapsed);
          toggleBtn.innerHTML = isCollapsed ? 
            '<i class="fas fa-chevron-down"></i>展开代码' : 
            '<i class="fas fa-chevron-up"></i>收起代码';
        });
      }
      
      foldBtn.addEventListener('click', function() {
        isCollapsed = !isCollapsed;
        preElement.classList.toggle('collapsed', isCollapsed);
        foldBtn.innerHTML = isCollapsed ? 
          '<i class="fas fa-chevron-down"></i>展开' : 
          '<i class="fas fa-chevron-up"></i>折叠';
        
        // 更新或创建底部切换按钮
        let toggleBtn = content.querySelector('.code-toggle');
        if (!toggleBtn && isCollapsed) {
          toggleBtn = document.createElement('button');
          toggleBtn.className = 'code-toggle collapsed';
          content.appendChild(toggleBtn);
          
          toggleBtn.addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            preElement.classList.toggle('collapsed', isCollapsed);
            foldBtn.innerHTML = isCollapsed ? 
              '<i class="fas fa-chevron-down"></i>展开' : 
              '<i class="fas fa-chevron-up"></i>折叠';
            toggleBtn.classList.toggle('collapsed', isCollapsed);
            toggleBtn.innerHTML = isCollapsed ? 
              '<i class="fas fa-chevron-down"></i>展开代码' : 
              '<i class="fas fa-chevron-up"></i>收起代码';
          });
        }
        
        if (toggleBtn) {
          toggleBtn.classList.toggle('collapsed', isCollapsed);
          toggleBtn.innerHTML = isCollapsed ? 
            '<i class="fas fa-chevron-down"></i>展开代码' : 
            '<i class="fas fa-chevron-up"></i>收起代码';
          
          if (!isCollapsed) {
            setTimeout(() => {
              if (!isCollapsed && toggleBtn) {
                toggleBtn.remove();
              }
            }, 300);
          }
        }
      });
    });
    
    // 增强的代码语言检测函数
    function detectCodeLanguage(preElement) {
      let language = 'code';
      
      // 1. 检查pre元素的类名
      const preClasses = preElement.className.split(/\s+/);
      for (const cls of preClasses) {
        // 匹配 language-xxx 或 lang-xxx 格式
        const match = cls.match(/^(language|lang)-(.+)$/);
        if (match) {
          language = match[2];
          break;
        }
      }
      
      // 2. 如果pre元素没有语言类，检查内部的code元素
      if (language === 'code' && preElement.firstElementChild && preElement.firstElementChild.tagName === 'CODE') {
        const codeElement = preElement.firstElementChild;
        const codeClasses = codeElement.className.split(/\s+/);
        for (const cls of codeClasses) {
          const match = cls.match(/^(language|lang)-(.+)$/);
          if (match) {
            language = match[2];
            break;
          }
        }
      }
      
      // 3. 语言名称映射，使显示更友好
      const languageMap = {
        'js': 'JavaScript',
        'javascript': 'JavaScript',
        'ts': 'TypeScript',
        'typescript': 'TypeScript',
        'py': 'Python',
        'python': 'Python',
        'html': 'HTML',
        'css': 'CSS',
        'scss': 'SCSS',
        'sass': 'SASS',
        'less': 'LESS',
        'json': 'JSON',
        'xml': 'XML',
        'md': 'Markdown',
        'markdown': 'Markdown',
        'yml': 'YAML',
        'yaml': 'YAML',
        'bash': 'Bash',
        'shell': 'Shell',
        'sh': 'Shell',
        'zsh': 'Zsh',
        'powershell': 'PowerShell',
        'ps1': 'PowerShell',
        'cpp': 'C++',
        'c++': 'C++',
        'c': 'C',
        'cs': 'C#',
        'csharp': 'C#',
        'java': 'Java',
        'php': 'PHP',
        'rb': 'Ruby',
        'ruby': 'Ruby',
        'go': 'Go',
        'golang': 'Go',
        'rs': 'Rust',
        'rust': 'Rust',
        'sql': 'SQL',
        'mysql': 'MySQL',
        'pgsql': 'PostgreSQL',
        'dockerfile': 'Dockerfile',
        'docker': 'Dockerfile',
        'makefile': 'Makefile',
        'make': 'Makefile'
      };
      
      return languageMap[language] || language.charAt(0).toUpperCase() + language.slice(1);
    }
    
    // 获取文件扩展名
    function getFileExtension(language) {
      const extensions = {
        'javascript': 'js',
        'typescript': 'ts',
        'python': 'py',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'csharp': 'cs',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'php': 'php',
        'ruby': 'rb',
        'go': 'go',
        'rust': 'rs',
        'shell': 'sh',
        'bash': 'sh',
        'json': 'json',
        'xml': 'xml',
        'yaml': 'yml',
        'markdown': 'md'
      };
      
      // 反转查找，因为现在 language 可能是友好名称
      const reverseMap = {
        'JavaScript': 'js',
        'TypeScript': 'ts',
        'Python': 'py',
        'Java': 'java',
        'C++': 'cpp',
        'C': 'c',
        'C#': 'cs',
        'HTML': 'html',
        'CSS': 'css',
        'SCSS': 'scss',
        'SASS': 'sass',
        'LESS': 'less',
        'PHP': 'php',
        'Ruby': 'rb',
        'Go': 'go',
        'Rust': 'rs',
        'Shell': 'sh',
        'Bash': 'sh',
        'JSON': 'json',
        'XML': 'xml',
        'YAML': 'yml',
        'Markdown': 'md'
      };
      
      return reverseMap[language] || extensions[language.toLowerCase()] || 'txt';
    }
  });