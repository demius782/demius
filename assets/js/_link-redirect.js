(function() {
  'use strict';

  const SHORTCODE_BLOCKLIST_SELECTORS = [
    '[data-shortcode]',
    '.shortcode-button',
    '.collapse-container',
    '.color-text',
    '.video-container',
    '.encrypted-content',
    '.reply-visible-container',
    '.tabs-container',
    '.tab-pane',
    '.timeline-container',
    '.timeline-item',
    'meting-js'
  ];

  const FALLBACK_CONTAINERS = [
    '.post-content',
    'article .content',
    '.content',
    'main article'
  ];

  function parseList(value, defaultValue) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        // ignore parse error
      }
      if (value.trim().length > 0) {
        return value.split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    return defaultValue;
  }

  function getConfig() {
    const raw = window.siteConfig?.linkRedirect;
    if (!raw) {
      return {
        enable: false
      };
    }
    return {
      enable: raw.enable === true || raw.enable === 'true',
      pagePath: raw.pagePath || '/go.html',
      countdown: raw.countdown ?? 3,
      showCountdown: raw.showCountdown !== false,
      showButton: raw.showButton !== false,
      safeMessage: raw.safeMessage || '',
      processShortcodeLinks: raw.processShortcodeLinks !== false && raw.processShortcodeLinks !== 'false',
      skipPatterns: parseList(raw.skipPatterns, []),
      pageWhitelist: parseList(raw.pageWhitelist, []),
      elementWhitelist: parseList(raw.elementWhitelist, []),
      safeWhitelist: parseList(raw.safeWhitelist, [])
    };
  }

  function isInternalLink(url) {
    if (!url) {
      return false;
    }
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin === window.location.origin;
    } catch (e) {
      return url.startsWith('/') || url.startsWith('#');
    }
  }

  function matchesPattern(url, patterns) {
    if (!patterns || patterns.length === 0) {
      return false;
    }
    return patterns.some(pattern => {
      if (!pattern || !url) {
        return false;
      }
      try {
        const regex = new RegExp(pattern);
        return regex.test(url);
      } catch (e) {
        return url.includes(pattern);
      }
    });
  }

  function isLinkInsideShortcode(link) {
    if (!link) {
      return false;
    }
    for (let i = 0; i < SHORTCODE_BLOCKLIST_SELECTORS.length; i += 1) {
      const selector = SHORTCODE_BLOCKLIST_SELECTORS[i];
      try {
        if (link.closest(selector)) {
          return true;
        }
      } catch (e) {
        // ignore invalid selector
      }
    }
    return false;
  }

  function getContainers(config) {
    const containers = [];
    if (config.elementWhitelist && config.elementWhitelist.length > 0) {
      config.elementWhitelist.forEach(selector => {
        if (!selector || selector.trim() === '') {
          return;
        }
        const nodes = document.querySelectorAll(selector);
        nodes.forEach(node => {
          if (node && !containers.includes(node)) {
            containers.push(node);
          }
        });
      });
    }
    if (containers.length === 0) {
      FALLBACK_CONTAINERS.forEach(selector => {
        const el = document.querySelector(selector);
        if (el && !containers.includes(el)) {
          containers.push(el);
        }
      });
    }
    return containers;
  }

  function shouldProcessPage(config) {
    if (!config.pageWhitelist || config.pageWhitelist.length === 0) {
      return true;
    }
    const currentPath = window.location.pathname;
    return config.pageWhitelist.some(pattern => {
      if (!pattern || pattern.trim() === '') {
        return false;
      }
      try {
        const regex = new RegExp(pattern);
        return regex.test(currentPath);
      } catch (e) {
        return currentPath.includes(pattern);
      }
    });
  }

  function rewriteLink(link, config) {
    const href = link.getAttribute('href');
    if (!href || href.trim() === '') {
      return;
    }
    if (link.hasAttribute('data-no-redirect')) {
      return;
    }
    if (link.classList.contains('no-redirect')) {
      return;
    }
    if (link.hasAttribute('data-fancybox')) {
      return;
    }
    if (link.closest('.link-card-container')) {
      return;
    }
    if (!config.processShortcodeLinks && isLinkInsideShortcode(link)) {
      return;
    }
    if (href.includes(`${config.pagePath}?goUrl=`)) {
      return;
    }
    if (isInternalLink(href)) {
      return;
    }
    if (matchesPattern(href, config.skipPatterns)) {
      return;
    }

    let redirectPath = config.pagePath || '/go.html';
    if (!redirectPath.startsWith('/')) {
      redirectPath = `/${redirectPath}`;
    }
    const goUrl = `${redirectPath}?goUrl=${encodeURIComponent(href)}&type=goDown`;
    link.dataset.originalHref = href;
    link.href = goUrl;

    if (matchesPattern(href, config.safeWhitelist)) {
      link.dataset.redirectSafe = 'true';
    }
  }

  function processLinks(config) {
    const containers = getContainers(config);
    containers.forEach(container => {
      const links = container.querySelectorAll('a[href]');
      links.forEach(link => rewriteLink(link, config));
    });
  }

  function init() {
    const config = getConfig();
    if (!config.enable) {
      return;
    }
    if (!shouldProcessPage(config)) {
      return;
    }
    setTimeout(() => {
      processLinks(config);
    }, 200);

    document.addEventListener('pjax:complete', () => {
      setTimeout(() => {
        if (!shouldProcessPage(config)) {
          return;
        }
        processLinks(config);
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

