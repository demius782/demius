/**
 * 网友圈功能
 * 展示友链站点的最新文章动态
 */

(function() {
  'use strict';

  // 全局变量（在函数外部定义，以便在任何情况下都能访问）
  let config;


  // 初始化函数（在任何情况下都定义，以便PJAX可以调用）
  function initFriendsCircle() {
    // 如果不是网友圈页面，直接返回
    if (!document.querySelector('.friends-circle-page')) {
      return;
    }
    
    // 每次调用都重新加载配置，确保配置是最新的（特别是PJAX切换时）
    if (!reloadConfig()) {
      console.error('[网友圈] 无法加载配置');
      showEmptyState();
      return;
    }
    
    // 清理旧状态
    cleanupFriendsCircle();
    
    // 加载数据
    loadFriendsData().then(() => {
      if (allArticles.length === 0) {
        showEmptyState();
        return;
      }

      // 按分组组织文章（必须在初始化选项卡之前，以便显示文章数量）
      organizeArticlesByGroup();

      // 初始化分组选项卡（即使没有文章也显示）
      initGroupTabs();

      // 显示初始文章列表（根据当前分组筛选）
      displayArticles(config.initialDisplayCount || 20);

      // 初始化加载更多按钮
      initLoadMoreButton();
    }).catch(error => {
      console.error('[网友圈] 加载数据失败:', error);
      showEmptyState();
    });
  }

  // 全局变量
  let allArticles = [];  // 所有文章数据
  let displayedCount = 0;  // 已显示的文章数量
  let currentGroupFilter = 'all';  // 当前分组筛选（'all'表示全部）
  let groups = [];  // 分组列表（包括没有文章的分组）
  let articlesByGroup = {};  // 按分组组织的文章
  let allGroups = [];  // 所有分组（从友链数据中提取，即使没有文章）
  let siteColorMap = {};  // 站点名称到颜色的映射（用于卡片随机颜色）
  let groupColorMap = {};  // 分组名称到颜色的映射（用于选项卡随机颜色）

  /**
   * 清理页面状态（用于PJAX切换时重置）
   */
  function cleanupFriendsCircle() {
    // 重置全局变量
    allArticles = [];
    displayedCount = 0;
    currentGroupFilter = 'all';
    groups = [];
    articlesByGroup = {};
    allGroups = [];
    siteColorMap = {};
    groupColorMap = {};
    
    // 清空DOM
    const grid = document.getElementById('articles-grid');
    if (grid) {
      grid.innerHTML = '';
    }
    
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
      loadingState.style.display = 'block';
    }
    
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
      emptyState.style.display = 'none';
    }
    
    const loadMoreContainer = document.getElementById('load-more-container');
    if (loadMoreContainer) {
      loadMoreContainer.style.display = 'none';
    }
  }

  /**
   * 重新获取配置（用于PJAX切换时更新配置）
   */
  function reloadConfig() {
    const configElement = document.getElementById('friends-circle-config');
    if (!configElement) {
      return false;
    }

    try {
      const configText = configElement.textContent;
      const newConfig = JSON.parse(configText);
      
      // 处理linksGroups：如果是字符串，尝试解析为JSON
      if (typeof newConfig.linksGroups === 'string') {
        try {
          newConfig.linksGroups = JSON.parse(newConfig.linksGroups);
        } catch (e) {
          newConfig.linksGroups = [];
        }
      }
      
      // 处理groupArticleDays：如果是字符串，尝试解析为JSON
      if (typeof newConfig.groupArticleDays === 'string') {
        try {
          newConfig.groupArticleDays = JSON.parse(newConfig.groupArticleDays);
        } catch (e) {
          newConfig.groupArticleDays = [];
        }
      }
      
      // 确保groupArticleDays是数组
      if (!Array.isArray(newConfig.groupArticleDays)) {
        newConfig.groupArticleDays = [];
      }
      
      // 清理配置值：移除可能的引号（Hugo jsonify 可能会双重转义）
      if (typeof newConfig.cardColorMode === 'string') {
        newConfig.cardColorMode = newConfig.cardColorMode.replace(/^["']+|["']+$/g, '');
      }
      if (typeof newConfig.tabColorMode === 'string') {
        newConfig.tabColorMode = newConfig.tabColorMode.replace(/^["']+|["']+$/g, '');
      }
      if (typeof newConfig.cardCustomColor === 'string') {
        newConfig.cardCustomColor = newConfig.cardCustomColor.replace(/^["']+|["']+$/g, '');
      }
      if (typeof newConfig.tabCustomColor === 'string') {
        newConfig.tabCustomColor = newConfig.tabCustomColor.replace(/^["']+|["']+$/g, '');
      }
      
      // 确保配置值存在，如果没有则使用默认值
      if (!newConfig.cardColorMode) {
        newConfig.cardColorMode = 'transparent';
      }
      if (!newConfig.tabColorMode) {
        newConfig.tabColorMode = 'default';
      }
      
      // 确保linksGroups是数组
      if (!Array.isArray(newConfig.linksGroups)) {
        newConfig.linksGroups = [];
      }
      
      // 更新全局配置
      config = newConfig;
      return true;
    } catch (e) {
      console.error('解析网友圈配置失败:', e);
      return false;
    }
  }

  /**
   * 加载友链数据
   * 全部从预生成的JSON文件获取数据
   */
  async function loadFriendsData() {
    allArticles = [];
    
    // 从预生成JSON加载数据
    if (config.preGeneratedJsonUrl && config.preGeneratedJsonUrl.trim()) {
      try {
        // 清理 URL，移除可能的引号
        let jsonUrl = String(config.preGeneratedJsonUrl).trim();
        // 移除首尾的引号（可能是 JSON 解析后的残留）
        jsonUrl = jsonUrl.replace(/^["']+|["']+$/g, '');
        
        const jsonArticles = await loadFromPreGeneratedJson(jsonUrl);
        // 添加所有JSON文章
        allArticles.push(...jsonArticles);
      } catch (error) {
        console.error('从JSON加载数据失败:', error.message);
        throw error;
      }
    }
    
    // 按日期排序所有文章（最新的在前）
    if (allArticles.length > 0) {
      allArticles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    }
  }

  /**
   * 从预生成的JSON文件加载数据
   * @param {string} jsonUrl - JSON文件URL
   * @returns {Array} 文章数组
   */
  async function loadFromPreGeneratedJson(jsonUrl) {
    const articles = [];
    
    try {
      const response = await fetch(jsonUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`JSON请求失败: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      
      // 兼容多种JSON格式
      let jsonArticles = [];
      if (Array.isArray(jsonData)) {
        jsonArticles = jsonData;
      } else if (jsonData.articles && Array.isArray(jsonData.articles)) {
        jsonArticles = jsonData.articles;
      } else if (jsonData.friends && Array.isArray(jsonData.friends)) {
        jsonArticles = jsonData.friends;
      } else {
        throw new Error('JSON格式不支持，期望包含 articles 数组或直接是数组');
      }

      // 转换所有文章数据
      jsonArticles.forEach(article => {
        if (article && (article.title || article.link)) {
          // 转换日期格式
          let articleDate = article.date;
          if (typeof articleDate === 'string') {
            articleDate = parseDate(articleDate);
          } else if (!(articleDate instanceof Date)) {
            articleDate = new Date();
          }

          articles.push({
            title: article.title || '无标题',
            link: article.link || article.url || '',
            date: articleDate,
            siteName: article.siteName || article.site || article.name || '未知站点',
            siteUrl: article.siteUrl || article.url || '',
            siteAvatar: article.siteAvatar || article.avatar || '/img/avatar.png',
            siteGroup: article.siteGroup || article.group || '未分组',
            description: article.description || '',
            author: article.author || ''
          });
        }
      });

      
    } catch (error) {
      console.error('加载预生成JSON失败:', error);
      throw error;
    }
    
    return articles;
  }
  /**
   * 解析日期字符串（从JSON加载时使用）
   */
  function parseDate(dateString) {
    if (!dateString) {
      return new Date();
    }
    
    // 如果是Date对象，直接返回
    if (dateString instanceof Date) {
      return dateString;
    }
    
    // 如果是字符串，尝试解析
    if (typeof dateString === 'string') {
      const cleaned = dateString.trim().replace(/\s+/g, ' ');
      const date = new Date(cleaned);
      
      // 如果解析失败，返回当前时间
      if (isNaN(date.getTime())) {
        return new Date();
      }
      
      return date;
    }
    
    return new Date();
  }

  /**
   * 获取分组对应的文章显示天数配置
   * @param {string} groupName - 分组名称
   * @returns {number} 天数
   */
  function getGroupArticleDays(groupName) {
    if (!groupName) {
      return config.defaultArticleDays || 3;
    }
    
    // 确保groupArticleDays是数组
    if (!config.groupArticleDays || !Array.isArray(config.groupArticleDays)) {
      return config.defaultArticleDays || 3;
    }
    
    // 查找匹配的分组配置（支持精确匹配和模糊匹配）
    for (const groupConfig of config.groupArticleDays) {
      if (groupConfig && groupConfig.name && typeof groupConfig.days === 'number') {
        const configName = String(groupConfig.name).trim();
        const currentGroupName = String(groupName).trim();
        
        // 优先精确匹配
        if (configName === currentGroupName) {
          return groupConfig.days;
        }
        
        // 模糊匹配：如果分组名称包含配置的名称，或者配置的名称包含分组名称
        if (currentGroupName.includes(configName) || configName.includes(currentGroupName)) {
          return groupConfig.days;
        }
      }
    }
    
    // 如果没有找到匹配的配置，使用默认值
    return config.defaultArticleDays || 3;
  }

  /**
   * 按分组组织文章（依据links.yaml中的分组配置，并按时间筛选）
   */
  function organizeArticlesByGroup() {
    articlesByGroup = {};
    
    // 从配置中获取links.yaml中的分组列表
    let linksGroups = config.linksGroups || [];
    
    // 确保linksGroups是数组
    if (!Array.isArray(linksGroups)) {
      linksGroups = [];
    }
    
    // 建立友链名称到分组的映射关系
    const siteNameToGroupMap = {};
    if (Array.isArray(linksGroups)) {
      linksGroups.forEach(group => {
        if (group && group.name && group.links && Array.isArray(group.links)) {
          group.links.forEach(link => {
            if (link && link.name) {
              // 使用友链名称作为key，分组名称作为value
              siteNameToGroupMap[link.name] = group.name;
            }
          });
        }
      });
    }
    
    // 从links.yaml中提取分组名称列表（保持原有顺序）
    const groupsFromLinks = Array.isArray(linksGroups) 
      ? linksGroups.map(group => group && group.name ? group.name : null).filter(name => name !== null)
      : [];
    
    // 如果links.yaml中没有分组配置，则从文章数据中提取分组（向后兼容）
    if (!groupsFromLinks || groupsFromLinks.length === 0) {
      const groupSet = new Set();
      allArticles.forEach(article => {
        const group = article.siteGroup || '未分组';
        groupSet.add(group);
      });
      groups = Array.from(groupSet).sort();
    } else {
      // 使用links.yaml中的分组配置
      groups = [...groupsFromLinks];
    }
    
    // 为每个分组初始化空数组
    groups.forEach(group => {
      articlesByGroup[group] = [];
    });
    
    // 获取当前日期用于时间筛选
    const now = new Date();
    
    // 遍历所有文章，根据友链名称匹配到对应的分组，并应用时间筛选
    allArticles.forEach(article => {
      // 优先使用文章中的siteGroup，如果没有则根据siteName匹配
      let articleGroup = article.siteGroup;
      
      // 如果文章没有siteGroup，尝试根据siteName从映射中查找
      if (!articleGroup && article.siteName) {
        articleGroup = siteNameToGroupMap[article.siteName];
      }
      
      // 如果仍然没有找到分组，使用"未分组"
      if (!articleGroup) {
        articleGroup = '未分组';
      }
      
      // 检查文章的分组是否在links.yaml的分组列表中
      // 如果不在，则放到"未分组"中（如果"未分组"不在列表中，则添加到列表中）
      if (!groups.includes(articleGroup)) {
        if (!groups.includes('未分组')) {
          groups.push('未分组');
          articlesByGroup['未分组'] = [];
        }
        articleGroup = '未分组';
      }
      
      // 确保分组数组存在
      if (!articlesByGroup[articleGroup]) {
        articlesByGroup[articleGroup] = [];
      }
      
      // 获取该分组的天数配置
      const days = getGroupArticleDays(articleGroup);
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      // 检查文章日期是否在时间范围内
      const articleDate = new Date(article.date);
      if (articleDate >= cutoffDate) {
        articlesByGroup[articleGroup].push(article);
      }
    });
    
    
    // 确保所有分组都有对应的数组（即使没有符合条件的文章）
    groups.forEach(group => {
      if (!articlesByGroup[group]) {
        articlesByGroup[group] = [];
      }
    });
    
    // 按日期排序每个分组的文章
    Object.keys(articlesByGroup).forEach(group => {
      if (articlesByGroup[group].length > 0) {
        articlesByGroup[group].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
      }
    });
    
    // 保存所有分组，用于显示选项卡（保持links.yaml中的顺序）
    allGroups = [...groups];
    
    // 按分组组织完成
  }

  /**
   * 获取当前筛选后的文章列表
   */
  function getFilteredArticles() {
    if (currentGroupFilter === 'all') {
      // "全部"模式：返回所有分组中符合条件的文章（已经过时间筛选）
      const allFilteredArticles = [];
      Object.keys(articlesByGroup).forEach(group => {
        if (articlesByGroup[group] && Array.isArray(articlesByGroup[group])) {
          allFilteredArticles.push(...articlesByGroup[group]);
        }
      });
      // 按日期排序（最新的在前）
      allFilteredArticles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      return allFilteredArticles;
    } else {
      return articlesByGroup[currentGroupFilter] || [];
    }
  }

  /**
   * 显示文章列表（根据当前分组筛选）
   */
  function displayArticles(count) {
    const grid = document.getElementById('articles-grid');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');

    if (!grid) return;

    // 隐藏加载状态
    if (loadingState) {
      loadingState.style.display = 'none';
    }

    // 获取当前筛选后的文章
    const filteredArticles = getFilteredArticles();

    if (filteredArticles.length === 0) {
      if (emptyState) {
        emptyState.style.display = 'block';
        if (currentGroupFilter === 'all') {
          emptyState.innerHTML = '<p>暂无文章数据</p>';
        } else {
          emptyState.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
              <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                分组"${escapeHtml(currentGroupFilter)}"暂无文章数据
              </p>
              <p style="font-size: 0.9rem; color: var(--text-tertiary); opacity: 0.8;">
                该分组下暂无文章数据
              </p>
            </div>
          `;
        }
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = 'none';
    }

    const articlesToShow = filteredArticles.slice(displayedCount, displayedCount + count);
    
    articlesToShow.forEach(article => {
      const card = createArticleCard(article);
      grid.appendChild(card);
    });

    displayedCount += articlesToShow.length;

    // 检查是否还有更多文章
    updateLoadMoreButton();
  }

  /**
   * 获取站点对应的颜色索引（用于随机颜色）
   */
  function getSiteColorIndex(siteName) {
    if (!siteName) return 1;
    
    // 如果已经为该站点分配了颜色，直接返回
    if (siteColorMap[siteName]) {
      return siteColorMap[siteName];
    }
    
    // 计算颜色索引（基于站点名称的哈希值，确保同一站点总是使用相同颜色）
    let hash = 0;
    for (let i = 0; i < siteName.length; i++) {
      hash = ((hash << 5) - hash) + siteName.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const colorIndex = Math.abs(hash % 8) + 1;
    
    // 保存映射关系
    siteColorMap[siteName] = colorIndex;
    
    return colorIndex;
  }

  /**
   * 获取分组对应的颜色索引（用于选项卡随机颜色）
   */
  function getGroupColorIndex(groupName) {
    if (!groupName) return 1;
    
    // 如果已经为该分组分配了颜色，直接返回
    if (groupColorMap[groupName]) {
      return groupColorMap[groupName];
    }
    
    // 计算颜色索引（基于分组名称的哈希值，确保同一分组总是使用相同颜色）
    let hash = 0;
    for (let i = 0; i < groupName.length; i++) {
      hash = ((hash << 5) - hash) + groupName.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const colorIndex = Math.abs(hash % 8) + 1;
    
    // 保存映射关系
    groupColorMap[groupName] = colorIndex;
    
    return colorIndex;
  }

  /**
   * 创建文章卡片
   */
  function createArticleCard(article) {
    const card = document.createElement('a');
    card.className = 'article-card';
    card.href = article.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    // 根据配置应用背景色样式
    const cardColorMode = String(config.cardColorMode || '').replace(/^["']+|["']+$/g, '');
    if (cardColorMode === 'random') {
      const colorIndex = getSiteColorIndex(article.siteName);
      card.classList.add(`color-${colorIndex}`);
    } else if (cardColorMode === 'custom' && config.cardCustomColor) {
      card.classList.add('custom-color');
      const customColor = String(config.cardCustomColor || '').replace(/^["']+|["']+$/g, '');
      card.style.backgroundColor = customColor;
    }

    card.innerHTML = `
      <div class="article-card-avatar">
        <img src="${article.siteAvatar || '/img/avatar.png'}" 
             alt="${article.siteName}" 
             onerror="this.src='/img/avatar.png'">
      </div>
      <div class="article-card-info">
        <div class="article-card-site">${escapeHtml(article.siteName)}</div>
        <h3 class="article-card-title">${escapeHtml(article.title)}</h3>
        <div class="article-card-date">${formatDate(article.date)}</div>
      </div>
    `;

    return card;
  }


  /**
   * 初始化分组选项卡
   */
  function initGroupTabs() {
    const groupsContainer = document.getElementById('friends-circle-groups');
    if (!groupsContainer) {
      return;
    }

    const tabsToShow = groups;

    // 添加分组选项卡（"全部"已经存在）
    tabsToShow.forEach(groupName => {
      // 检查是否已存在该选项卡
      if (groupsContainer.querySelector(`[data-group="${groupName}"]`)) {
        return;
      }
      
      const tab = document.createElement('button');
      tab.className = 'group-tab';
      tab.setAttribute('data-group', groupName);
      
      // 根据配置应用背景色样式
      const tabColorMode = String(config.tabColorMode || '').replace(/^["']+|["']+$/g, '');
      if (tabColorMode === 'random') {
        const colorIndex = getGroupColorIndex(groupName);
        tab.classList.add(`tab-color-${colorIndex}`);
      } else if (tabColorMode === 'custom' && config.tabCustomColor) {
        tab.classList.add('tab-custom-color');
        const customColor = String(config.tabCustomColor || '').replace(/^["']+|["']+$/g, '');
        tab.style.backgroundColor = customColor;
      }
      
      // 显示文章数量
      const articleCount = articlesByGroup[groupName] ? articlesByGroup[groupName].length : 0;
      const countBadge = articleCount > 0 ? `<span style="margin-left: 0.5rem; font-size: 0.75rem; opacity: 0.7;">(${articleCount})</span>` : '';
      
      tab.innerHTML = `<span>${escapeHtml(groupName)}${countBadge}</span>`;
      tab.addEventListener('click', () => switchGroup(groupName));
      groupsContainer.appendChild(tab);
    });

    // "全部"选项卡点击事件
    const allTab = groupsContainer.querySelector('[data-group="all"]');
    if (allTab) {
      allTab.addEventListener('click', () => switchGroup('all'));
    }

    // 如果当前筛选是"全部"，初始化时也显示所有选项卡的背景色
    if (currentGroupFilter === 'all') {
      groupsContainer.classList.add('show-all-active');
    }

  }

  /**
   * 切换分组
   */
  function switchGroup(groupName) {
    if (currentGroupFilter === groupName) return;

    currentGroupFilter = groupName;
    
    // 获取选项卡容器
    const groupsContainer = document.getElementById('friends-circle-groups');
    
    // 更新选项卡状态
    const tabs = document.querySelectorAll('.group-tab');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-group') === groupName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // 如果切换到"全部"，给容器添加类使所有选项卡显示背景色
    // 如果切换到分组，移除该类使只有激活的选项卡显示背景色
    if (groupName === 'all' && groupsContainer) {
      groupsContainer.classList.add('show-all-active');
    } else if (groupsContainer) {
      groupsContainer.classList.remove('show-all-active');
    }

    // 重置显示计数
    displayedCount = 0;
    
    // 清空当前显示的文章
    const grid = document.getElementById('articles-grid');
    if (grid) {
      grid.innerHTML = '';
    }


    // 显示新分组的文章
    displayArticles(config.initialDisplayCount || 20);
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  /**
   * 初始化加载更多按钮
   */
  function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
      const loadMoreCount = config.loadMoreCount || 10;
      displayArticles(loadMoreCount);
    });

    updateLoadMoreButton();
  }

  /**
   * 更新加载更多按钮显示状态
   */
  function updateLoadMoreButton() {
    const container = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (!container || !loadMoreBtn) return;

    // 获取当前筛选后的文章总数
    const filteredArticles = getFilteredArticles();

    if (displayedCount >= filteredArticles.length) {
      container.style.display = 'none';
    } else {
      container.style.display = 'block';
      const remaining = filteredArticles.length - displayedCount;
      const btnText = loadMoreBtn.querySelector('span');
      if (btnText) {
        btnText.textContent = `阅读更多 (还有 ${remaining} 篇)`;
      }
    }
  }

  /**
   * 显示空状态
   */
  function showEmptyState() {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');

    if (loadingState) {
      loadingState.style.display = 'none';
    }
    if (emptyState) {
      emptyState.style.display = 'block';
    }
  }

  /**
   * 工具函数：转义HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 工具函数：格式化日期
   */
  function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  // 将初始化函数暴露为全局函数，供PJAX主动调用
  window.initFriendsCircle = initFriendsCircle;

  // 初始化函数（带重试机制）
  let initAttempts = 0;
  const maxInitAttempts = 100; // 最多尝试100次（5秒）
  
  function tryInit() {
    // 如果不是网友圈页面，直接返回
    if (!document.querySelector('.friends-circle-page')) {
      return;
    }
    
    // 检查配置元素是否存在且有效
    const configElement = document.getElementById('friends-circle-config');
    const configText = configElement ? configElement.textContent : null;
    
    // 验证配置内容是否有效（尝试解析JSON）
    let configValid = false;
    if (configText && configText.trim()) {
      try {
        const testConfig = JSON.parse(configText);
        if (testConfig && typeof testConfig === 'object') {
          configValid = true;
        }
      } catch (e) {
        // JSON解析失败，配置无效
        configValid = false;
      }
    }
    
    if (configElement && configValid) {
      // 配置元素已准备好，执行初始化
      initAttempts = 0; // 重置计数器
      initFriendsCircle();
    } else {
      // 配置元素还未准备好，延迟后重试
      initAttempts++;
      if (initAttempts < maxInitAttempts) {
        setTimeout(tryInit, 50);
      } else {
        console.error('网友圈初始化失败：配置元素未找到或超时');
        if (configElement) {
          console.error('配置元素存在但内容无效:', configText);
        } else {
          console.error('配置元素不存在');
        }
        showEmptyState();
      }
    }
  }

  // 初始化（使用多种时机确保能执行）
  function startInit() {
    // 如果DOM还在加载中，等待DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(tryInit, 0);
      });
    } else {
      // DOM已准备好，尝试初始化
      // 使用 requestAnimationFrame 确保DOM完全渲染
      if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
          setTimeout(tryInit, 0);
        });
      } else {
        setTimeout(tryInit, 0);
      }
    }
    
    // 额外的保障：等待window.load事件（确保所有资源加载完成）
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        setTimeout(tryInit, 100);
      });
    }
  }

  // 开始初始化
  startInit();

  // 支持PJAX重新初始化（作为后备，主要依赖reinitializePage中的主动调用）
  document.addEventListener('pjax:complete', function() {
    // 重置重试计数器
    initAttempts = 0;
    // 延迟一下确保DOM完全更新，然后尝试初始化
    setTimeout(() => {
      tryInit();
    }, 100);
  });

})();

