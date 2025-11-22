// 说说页面交互功能
function renderTalks() {
    const talkContainer = document.querySelector('#talk');
    if (!talkContainer) return;
    talkContainer.innerHTML = '';
    
    const generateIconSVG = () => {
        return `<svg viewBox="0 0 512 512"xmlns="http://www.w3.org/2000/svg"class="is-badge icon"><path d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"fill="#1da1f2"></path></svg>`;
    }

    const waterfall = (a) => {
        function b(a, b) {
            var c = window.getComputedStyle(b);
            return parseFloat(c["margin" + a]) || 0
        }

        function c(a) {
            return a + "px"
        }

        function d(a) {
            return parseFloat(a.style.top)
        }

        function e(a) {
            return parseFloat(a.style.left)
        }

        function f(a) {
            return a.clientWidth
        }

        function g(a) {
            return a.clientHeight
        }

        function h(a) {
            return d(a) + g(a) + b("Bottom", a)
        }

        function i(a) {
            return e(a) + f(a) + b("Right", a)
        }

        function j(a) {
            a = a.sort(function (a, b) {
                return h(a) === h(b) ? e(b) - e(a) : h(b) - h(a)
            })
        }

        function k(b) {
            f(a) != t && (b.target.removeEventListener(b.type, arguments.callee), waterfall(a))
        }
        "string" == typeof a && (a = document.querySelector(a));
        var l = [].map.call(a.children, function (a) {
            return a.style.position = "absolute", a
        });
        a.style.position = "relative";
        var m = [];
        l.length && (l[0].style.top = "0px", l[0].style.left = c(b("Left", l[0])), m.push(l[0]));
        for (var n = 1; n < l.length; n++) {
            var o = l[n - 1],
                p = l[n],
                q = i(o) + f(p) <= f(a);
            if (!q) break;
            p.style.top = o.style.top, p.style.left = c(i(o) + b("Left", p)), m.push(p)
        }
        for (; n < l.length; n++) {
            j(m);
            var p = l[n],
                r = m.pop();
            p.style.top = c(h(r) + b("Top", p)), p.style.left = c(e(r)), m.push(p)
        }
        j(m);
        var s = m[0];
        a.style.height = c(h(s) + b("Bottom", s));
        var t = f(a);
        window.addEventListener ? window.addEventListener("resize", k) : document.body.onresize = k
    };

    const fetchAndRenderTalks = () => {
        // 从配置中获取API地址，如果未配置则使用空字符串（需要用户在hugo.toml中配置）
        const url = window.siteConfig?.topAnnouncement?.shuoshuo?.apiUrl || '';
        if (!url) {
            console.warn('[说说页面] 未配置API地址，请在 hugo.toml 中配置 params.topAnnouncement.shuoshuo.apiUrl');
            if (talkContainer) {
                talkContainer.innerHTML = '<div class="shuoshuo-error">请在配置文件中设置说说API地址</div>';
            }
            return;
        }
        const cacheKey = 'talksCache';
        const cacheTimeKey = 'talksCacheTime';
        const cacheDuration = 30 * 60 * 1000;

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const currentTime = new Date().getTime();

        if (cachedData && cachedTime && (currentTime - cachedTime < cacheDuration)) {
            const data = JSON.parse(cachedData);
            renderTalksData(data);
        } else {
            if (talkContainer) {
                talkContainer.innerHTML = '';
                fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            size: 30
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === 0 && data.data && Array.isArray(data.data.list)) {
                            localStorage.setItem(cacheKey, JSON.stringify(data.data.list));
                            localStorage.setItem(cacheTimeKey, currentTime.toString());
                            renderTalksData(data.data.list);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }
        }

        function renderTalksData(list) {
            if (Array.isArray(list)) {
                list.forEach(item => {
                    const formattedItem = formatTalk(item);
                    // 保留原始ID用于定位
                    formattedItem.id = item.id;
                    const talkElement = generateTalkElement(formattedItem);
                    talkContainer.appendChild(talkElement);
                });
                waterfall('#talk');
                
                // 检查URL参数，如果有id参数，滚动到对应的说说
                const urlParams = new URLSearchParams(window.location.search);
                const talkId = urlParams.get('id');
                if (talkId) {
                    setTimeout(() => {
                        const targetTalk = document.getElementById(`talk-${talkId}`);
                        if (targetTalk) {
                            targetTalk.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // 高亮显示目标说说
                            targetTalk.style.transition = 'all 0.3s ease';
                            targetTalk.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
                            setTimeout(() => {
                                targetTalk.style.boxShadow = '';
                            }, 2000);
                        }
                    }, 500); // 等待瀑布流布局完成
                }
            } else {
                console.error('Data is not an array:', list);
            }
        }
    };

    const formatTalk = (item) => {
        let date = formatTime(new Date(item.createdAt).toString());
        let content = item.content;
        let imgs = item.imgs ? item.imgs.split(',') : [];
        let text = content;
        
        content = text.replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2">@$1</a>`)
            .replace(/- \[ \]/g, '⚪')
            .replace(/- \[x\]/g, '⚫');
        
        content = content.replace(/\n/g, '<br>');
        content = `<div class="talk_content_text">${content}</div>`;
        
        if (imgs.length > 0) {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'zone_imgbox';
            imgs.forEach(e => {
                const imgLink = document.createElement('a');
                imgLink.href = e;
                imgLink.setAttribute('data-fancybox', 'gallery');
                imgLink.className = 'fancybox';
                imgLink.setAttribute('data-thumb', e);
                const imgTag = document.createElement('img');
                imgTag.src = e;
                imgLink.appendChild(imgTag);
                imgDiv.appendChild(imgLink);
            });
            content += imgDiv.outerHTML;
        }

        // 解析扩展数据
        let ext = {};
        try {
            ext = JSON.parse(item.ext || '{}');
        } catch (e) {
            ext = {};
        }

        // 处理音乐
        if (ext.music && ext.music.id && ext.music.server && ext.music.type) {
            const music = ext.music;
            const musicDiv = document.createElement('div');
            musicDiv.className = 'talk_music';
            
            // 创建 meting-js 元素
            const metingJs = document.createElement('meting-js');
            metingJs.setAttribute('server', music.server);
            metingJs.setAttribute('type', music.type);
            metingJs.setAttribute('id', music.id);
            if (music.api) {
                metingJs.setAttribute('api', music.api);
            }
            // 添加其他可选属性
            metingJs.setAttribute('autoplay', 'false');
            metingJs.setAttribute('theme', '#2980b9');
            metingJs.setAttribute('loop', 'all');
            metingJs.setAttribute('order', 'list');
            metingJs.setAttribute('volume', '0.7');
            
            musicDiv.appendChild(metingJs);
            content += musicDiv.outerHTML;
        }

        // 处理视频（B站、YouTube等）
        // 视频数据格式：{"type":"bilibili","value":"https://player.bilibili.com/player.html?bvid=BV..."}
        if (ext.video && ext.video.value && ext.video.type) {
            const video = ext.video;
            let videoHTML = '';
            
            // 判断视频类型
            if (video.type === 'bilibili') {
                // B站视频 - value字段已经是完整的播放器URL
                // 添加控制栏参数：高清晰度、显示弹幕开关、显示进度条等
                const videoUrl = video.value.includes('?') 
                    ? `${video.value}&high_quality=1&danmaku=0` 
                    : `${video.value}?high_quality=1&danmaku=0`;
                videoHTML = `
                    <div class="talk_video">
                        <div class="video-wrapper">
                            <iframe 
                                src="${videoUrl}" 
                                scrolling="no" 
                                border="0" 
                                frameborder="no" 
                                framespacing="0" 
                                allowfullscreen="true">
                            </iframe>
                        </div>
                    </div>
                `;
            } else if (video.type === 'youtube') {
                // YouTube视频 - value字段是完整的YouTube URL
                // 从value中提取视频ID
                let videoId = '';
                if (video.value.includes('youtube.com')) {
                    const match = video.value.match(/[?&]v=([^&]+)/);
                    videoId = match ? match[1] : '';
                } else if (video.value.includes('youtu.be')) {
                    const match = video.value.match(/youtu\.be\/([^?]+)/);
                    videoId = match ? match[1] : '';
                }
                
                if (videoId) {
                    videoHTML = `
                        <div class="talk_video">
                            <div class="video-wrapper">
                                <iframe 
                                    src="https://www.youtube.com/embed/${videoId}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    `;
                }
            } else if (video.type === 'video' || video.type === 'mp4') {
                // 直接视频文件
                videoHTML = `
                    <div class="talk_video">
                        <video 
                            controls 
                            preload="metadata"
                            style="width: 100%; max-height: 400px; border-radius: 8px; background: #000;">
                            <source src="${video.value}" type="video/mp4">
                            您的浏览器不支持视频播放。
                        </video>
                    </div>
                `;
            }
            
            // 将视频HTML添加到content
            if (videoHTML) {
                content += videoHTML;
            }
        }

        return {
            content: content,
            user: item.user.nickname || '匿名',
            avatar: item.user.avatarUrl || 'https://p.liiiu.cn/i/2024/03/29/66061417537af.png',
            date: date,
            location: item.location || '秦皇岛',
            tags: item.tags ? item.tags.split(',').filter(tag => tag.trim() !== '') : ['无标签'],
            text: content.replace(/\[(.*?)\]\((.*?)\)/g, '[链接]' + `${imgs.length ? '[图片]' : ''}`)
        };
    };

    const generateTalkElement = (item) => {
        const talkItem = document.createElement('div');
        talkItem.className = 'talk_item';
        // 添加ID属性，用于跳转定位
        if (item.id) {
            talkItem.id = `talk-${item.id}`;
            talkItem.setAttribute('data-talk-id', item.id);
        }

        const talkMeta = document.createElement('div');
        talkMeta.className = 'talk_meta';

        const avatar = document.createElement('img');
        avatar.className = 'no-lightbox avatar';
        avatar.src = item.avatar;

        const info = document.createElement('div');
        info.className = 'info';

        const talkNick = document.createElement('span');
        talkNick.className = 'talk_nick';
        talkNick.innerHTML = `${item.user} ${generateIconSVG()}`;

        const talkDate = document.createElement('span');
        talkDate.className = 'talk_date';
        talkDate.textContent = item.date;

        const talkContent = document.createElement('div');
        talkContent.className = 'talk_content';
        talkContent.innerHTML = item.content;

        const talkBottom = document.createElement('div');
        talkBottom.className = 'talk_bottom';

        const TagContainer = document.createElement('div');

        const talkTag = document.createElement('span');
        talkTag.className = 'talk_tag';
        talkTag.textContent = `🏷️${item.tags[0] || '无标签'}`;

        const locationTag = document.createElement('span');
        locationTag.className = 'location_tag';
        locationTag.textContent = `🌍${item.location}`;

        TagContainer.appendChild(talkTag);
        TagContainer.appendChild(locationTag);

        const commentLink = document.createElement('a');
        commentLink.href = 'javascript:;';
        commentLink.onclick = () => goComment(item.text);
        const commentIcon = document.createElement('span');
        commentIcon.className = 'icon';
        const commentIconInner = document.createElement('i');
        commentIconInner.className = 'fa-solid fa-message fa-fw';
        commentIcon.appendChild(commentIconInner);
        commentLink.appendChild(commentIcon);

        talkMeta.appendChild(avatar);
        info.appendChild(talkNick);
        info.appendChild(talkDate);
        talkMeta.appendChild(info);
        talkItem.appendChild(talkMeta);
        talkItem.appendChild(talkContent);
        talkBottom.appendChild(TagContainer);
        talkBottom.appendChild(commentLink);
        talkItem.appendChild(talkBottom);

        return talkItem;
    };

    const goComment = (e) => {
        const match = e.match(/<div class="talk_content_text">([\s\S]*?)<\/div>/);
        const textContent = match ? match[1] : "";
        
        // 滚动到评论区
        const commentSection = document.querySelector("#artalk-comment");
        if (commentSection) {
            commentSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // 等待滚动完成后再填充内容
            setTimeout(() => {
                const n = document.querySelector(".atk-textarea");
                if (n) {
                    n.value = `> ${textContent}\n\n`;
                    n.focus();
                    
                    // 如果有提示功能，显示提示
                    if (window.btf && window.btf.snackbarShow) {
                        window.btf.snackbarShow("已为您引用该说说，不删除空格效果更佳");
                    }
                }
            }, 500);
        }
    };

    const formatTime = (time) => {
        const d = new Date(time);
        const ls = [
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds(),
        ];
        const r = ls.map((a) => (a.toString().length === 1 ? '0' + a : a));
        return `${r[0]}-${r[1]}-${r[2]} ${r[3]}:${r[4]}`;
    };

    fetchAndRenderTalks();
}

// 首次加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTalks);
} else {
    renderTalks();
}

// 导出到全局供PJAX使用
window.renderTalks = renderTalks;