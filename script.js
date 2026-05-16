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

// 音樂（佔位）
let musicPlaying = false;
function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    musicPlaying = !musicPlaying;
    btn.classList.toggle('playing', musicPlaying);
}

