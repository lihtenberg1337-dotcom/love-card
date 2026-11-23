// 1. Открытие конверта
const envelope = document.getElementById('envelope');
const envelopeHint = document.getElementById('envelope-hint');

envelope.addEventListener('click', (e) => {
    envelope.classList.toggle('open');
    if (envelope.classList.contains('open')) {
        envelopeHint.textContent = 'Нажми ещё раз, чтобы закрыть конверт';
        spawnBurst(e.clientX, e.clientY, 18);
    } else {
        envelopeHint.textContent = 'Нажми на печать, чтобы открыть письмо';
    }
});

// 2. Живой таймер отношений (демо-дата: 14 февраля 2024)
const startDate = new Date('2024-02-14T00:00:00');

function updateTimer() {
    const now = new Date();
    const diff = Math.max(0, now - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateTimer, 1000);
updateTimer();

// 3. Активация купонов
function activateCoupon(card, event) {
    card.classList.toggle('used');
    if (card.classList.contains('used')) {
        spawnBurst(event.clientX, event.clientY, 16);
    }
}

// 4. Финальная кнопка с салютом сердечек
const loveBtn = document.getElementById('love-btn');
const loveReply = document.getElementById('love-reply');

loveBtn.addEventListener('click', (e) => {
    loveReply.textContent = 'И я тебя безумно люблю! Ты моё счастье ❤️';
    spawnBurst(e.clientX, e.clientY, 45);
});

// 5. Оптимизированная векторная анимация сердечек на Canvas
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const bgHearts = [];
const burstHearts = [];
const MAX_BURST = 120;
const colors = ['#e11d48', '#fb7185', '#f43f5e', '#fda4af', '#be123c'];

for (let i = 0; i < 20; i++) {
    bgHearts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 8,
        speedY: Math.random() * 0.7 + 0.3,
        sway: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.3 + 0.12
    });
}

function spawnBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
        if (burstHearts.length >= MAX_BURST) {
            burstHearts.shift();
        }
        burstHearts.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.8) * 14,
            size: Math.random() * 10 + 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            gravity: 0.28
        });
    }
}

function drawVectorHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.3, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.3, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < bgHearts.length; i++) {
        const h = bgHearts[i];
        h.y -= h.speedY;
        h.sway += 0.02;
        h.x += Math.sin(h.sway) * 0.4;

        if (h.y < -20) {
            h.y = height + 20;
            h.x = Math.random() * width;
        }
        drawVectorHeart(h.x, h.y, h.size, '#fb7185', h.opacity);
    }

    for (let i = burstHearts.length - 1; i >= 0; i--) {
        const b = burstHearts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += b.gravity;
        b.alpha -= 0.018;

        if (b.alpha <= 0) {
            burstHearts.splice(i, 1);
        } else {
            drawVectorHeart(b.x, b.y, b.size, b.color, b.alpha);
        }
    }

    requestAnimationFrame(animate);
}

animate();
