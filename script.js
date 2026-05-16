// 星空背景
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
let starAnimId = null;

function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    const count = window.innerWidth < 768 ? 60 : 150;
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.opacity += (Math.random() - 0.5) * 0.02;
        s.opacity = Math.max(0.1, Math.min(1, s.opacity));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();
    });
    starAnimId = requestAnimationFrame(drawStars);
}

function startStars() {
    if (!starAnimId) {
        starAnimId = requestAnimationFrame(drawStars);
    }
}

function stopStars() {
    if (starAnimId) {
        cancelAnimationFrame(starAnimId);
        starAnimId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

initStars();
drawStars();
window.addEventListener('resize', initStars);

// 花瓣飄落
let petalInterval = null;
let currentPage = 'loveLetterPage';

function createPetal() {
    const container = document.getElementById('petals');
    // 限制同時存在的花瓣數量
    if (container.children.length > 8) return;
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.textContent = ['🌸', '💗', '✨', '🩷', '💮'][Math.floor(Math.random() * 5)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (Math.random() * 15 + 12) + 'px';
    petal.style.animationDuration = (Math.random() * 4 + 5) + 's';
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 9000);
}

function startPetals() {
    if (!petalInterval) {
        petalInterval = setInterval(createPetal, 800);
    }
}

function stopPetals() {
    if (petalInterval) {
        clearInterval(petalInterval);
        petalInterval = null;
    }
    // 清除現有花瓣
    document.getElementById('petals').innerHTML = '';
}

startPetals();

// 計算在一起的天數
function calcDays() {
    const meetDate = new Date('2025-05-25');
    const today = new Date();
    const diff = Math.floor((today - meetDate) / (1000 * 60 * 60 * 24));
    const el = document.getElementById('daysTogether');
    if (el) {
        if (diff >= 0) {
            el.textContent = `我們已經相識 ${diff} 天 💕`;
        } else {
            el.textContent = `距離我們相遇還有 ${-diff} 天 💫`;
        }
    }
}

// 頁面切換
function showPage(pageId, pushState = true) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(pageId);
    target.classList.remove('hidden');
    currentPage = pageId;

    // 立即跳到頂部，不用 smooth（smooth 在手機上會與圖片加載衝突導致跳動）
    window.scrollTo(0, 0);

    // 時間線頁面關閉花瓣和星空動畫以節省手機性能
    if (pageId === 'timelinePage') {
        stopPetals();
        stopStars();
        calcDays();
    } else {
        startPetals();
        startStars();
    }

    // 記錄瀏覽器歷史，防止手機返回鍵回到第一頁
    if (pushState) {
        history.pushState({ page: pageId }, '', '#' + pageId);
    }

    if (pageId === 'finalPage') launchFireworks();
}

// 處理瀏覽器返回鍵
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        showPage(e.state.page, false);
    } else {
        // 返回到第一頁
        showPage('loveLetterPage', false);
    }
});

// 頁面載入時檢查 hash，恢復頁面狀態
window.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        showPage(hash, false);
        // 如果是情書頁，自動展開信件
        if (hash === 'loveLetterPage') {
            openLetter();
        }
    } else {
        history.replaceState({ page: 'loveLetterPage' }, '', '#loveLetterPage');
    }
});

function startJourney() {
    showPage('loveLetterPage');
}

// 打開情書
function openLetter() {
    document.getElementById('envelope').classList.add('hidden');
    document.getElementById('letterContent').classList.remove('hidden');
    document.getElementById('surpriseNote').classList.remove('hidden');
    document.getElementById('letterNext').classList.remove('hidden');
}

// 煙花效果
function launchFireworks() {
    let count = 0;
    const interval = setInterval(() => {
        createFirework();
        count++;
        if (count > 15) clearInterval(interval);
    }, 400);
}

function createFirework() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.6;
    const colors = ['#ff6b9d', '#ffcc5c', '#ffa8cc', '#ff85a2', '#ffd700', '#ff69b4'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        const angle = (Math.PI * 2 * i) / 20;
        const dist = Math.random() * 80 + 40;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        particle.style.transition = `all ${0.6 + Math.random() * 0.5}s ease-out`;
        document.body.appendChild(particle);

        requestAnimationFrame(() => {
            particle.style.left = (x + dx) + 'px';
            particle.style.top = (y + dy) + 'px';
            particle.style.opacity = '0';
        });

        setTimeout(() => particle.remove(), 1500);
    }
}

// 音樂播放器 & 歌詞
const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const progressFill = document.getElementById('progressFill');
const timeDisplay = document.getElementById('timeDisplay');
const lyricText = document.getElementById('lyricText');

// 歌詞配置 [時間(秒), 歌詞] — 方大同《特別的人》
const lyrics = [
    [0, ''],
    [15.03, '愛一個人或許要慷慨'],
    [20.03, '若只想要被愛'],
    [22.32, '最後沒有了對白'],
    [26.60, '必須有你我的情真'],
    [31.46, '不求計分的平等'],
    [34.27, '總有幸福有心疼'],
    [37.66, '生命的起伏要認可'],
    [42.38, '懂一個人也許要忍耐'],
    [47.47, '要經過了意外'],
    [49.68, '才了解所謂的愛'],
    [54.05, '今後的歲月'],
    [56.52, '讓我們一起了解'],
    [59.96, '多少天長地久'],
    [62.95, '有幾回細水長流'],
    [67.76, '我們是對方 特別的人'],
    [74.94, '奮不顧身 難捨難分'],
    [78.43, '不是一般人的認真'],
    [81.83, '若只有一天 愛一個人'],
    [88.63, '讓那時間每一刻在倒退'],
    [92.90, '生命中有萬事的可能'],
    [98.01, '你就是我要遇見的 特別的人'],
    [107.54, '懂一個人也許要忍耐'],
    [112.53, '要經過了意外'],
    [114.84, '才了解所謂的愛'],
    [119.15, '今後的歲月'],
    [121.68, '讓我們一起了解'],
    [125.15, '多少天長地久'],
    [128.06, '有幾回細水長流'],
    [132.92, '我們是對方 特別的人'],
    [140.08, '奮不顧身 難捨難分'],
    [143.52, '不是一般人的認真'],
    [146.92, '若只有一天 愛一個人'],
    [153.62, '讓那時間每一刻在倒退'],
    [157.98, '生命中有萬事的可能'],
    [163.18, '你就是我要遇見的 特別的人'],
    [170.11, '有時候我們都會寂寞'],
    [174.40, '有時也會失敗 怕被淘汰'],
    [178.63, '想去找一個明白'],
    [181.83, '而我曾經多次的等待未來'],
    [188.28, '你何時會來'],
    [190.52, '人山人海 總有你的存在'],
    [195.86, '有你我的愛'],
    [198.25, '我們是對方 特別的人'],
    [205.23, '奮不顧身 難捨難分'],
    [208.72, '不是一般人的認真'],
    [212.10, '若只有一天 愛一個人'],
    [218.93, '讓那時間每一刻在倒退'],
    [223.16, '生命中有萬事的可能'],
    [228.28, '你就是我要遇見的 特別的人 ❤️'],
    [237.5, '🎵 — 給最特別的你 —'],
];

let currentLyricIndex = 0;

// 自動播放音樂（循環）
audio.loop = true;

function tryAutoPlay() {
    audio.play().then(() => {
        playBtn.classList.add('playing');
    }).catch(() => {
        const handler = () => {
            audio.play().then(() => {
                playBtn.classList.add('playing');
            });
            document.removeEventListener('click', handler);
            document.removeEventListener('touchstart', handler);
        };
        document.addEventListener('click', handler);
        document.addEventListener('touchstart', handler);
    });
}

tryAutoPlay();

function toggleMusic() {
    if (audio.paused) {
        audio.play().then(() => {
            playBtn.classList.add('playing');
        });
    } else {
        audio.pause();
        playBtn.classList.remove('playing');
    }
}

// 更新進度條和歌詞
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + '%';

        const min = Math.floor(audio.currentTime / 60);
        const sec = Math.floor(audio.currentTime % 60);
        timeDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

        // 同步歌詞
        updateLyric(audio.currentTime);
    }
});

function updateLyric(time) {
    if (lyrics.length === 0) return;
    let idx = 0;
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (time >= lyrics[i][0]) {
            idx = i;
            break;
        }
    }
    if (idx !== currentLyricIndex) {
        currentLyricIndex = idx;
        lyricText.style.opacity = '0';
        setTimeout(() => {
            lyricText.textContent = lyrics[idx][1];
            lyricText.style.opacity = '1';
            // 如果歌詞太長就滾動
            if (lyricText.scrollWidth > lyricText.parentElement.clientWidth) {
                lyricText.classList.add('scrolling');
            } else {
                lyricText.classList.remove('scrolling');
            }
        }, 200);
    }
}

// 循環播放時重置歌詞
audio.addEventListener('seeking', () => {
    if (audio.currentTime < 1) {
        currentLyricIndex = 0;
        lyricText.textContent = lyrics[0][1];
    }
});

function seekMusic(e) {
    if (audio.duration) {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
    }
}

