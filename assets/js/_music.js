// ===== 音乐播放器功能 (基于 MetingJS) =====

/**
 * MetingJS 自动处理音乐播放器的初始化和渲染
 * 无需额外的JavaScript代码
 * 
 * 支持的功能：
 * - 网易云音乐、QQ音乐、酷狗音乐、虾米音乐、百度音乐
 * - 单曲、播放列表、专辑、搜索、歌手
 * - 本地文件播放
 * - 自定义API端点
 */

// 全局初始化函数（为兼容性保留，实际上MetingJS会自动工作）
window.initMusicPlayers = function() {
  // MetingJS 通过自定义元素自动初始化
  // 不需要额外的初始化代码
  
};

// 页面加载时检查是否有音乐播放器
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initMusicPlayers);
} else {
  window.initMusicPlayers();
}
