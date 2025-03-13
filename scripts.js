// Счётчик посетителей (с помощью localStorage для теста)
function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    document.getElementById('visitor-count').innerText = count;
}

// Меню
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Аудио
const mainAudio = document.createElement('audio');
mainAudio.loop = true;
mainAudio.innerHTML = `<source src="audio/LASKX3I_Protiv_carya.mp3" type="audio/mp3">`;
document.body.appendChild(mainAudio);

const hoverAudio = document.createElement('audio');
hoverAudio.innerHTML = `<source src="audio/ssstik.io_1741077266612-_mp3cut.net_-_1_.mp3" type="audio/mp3">`;
document.body.appendChild(hoverAudio);

function playMainAudio() {
    mainAudio.play().catch((err) => console.log("Ошибка воспроизведения:", err));
    document.querySelector('.play-audio-btn')?.style.display = 'none';
}

function playHoverAudio() {
    mainAudio.pause();
    hoverAudio.play().catch((err) => console.log("Ошибка воспроизведения второй песни:", err));
}

function stopHoverAudio() {
    hoverAudio.pause();
    hoverAudio.currentTime = 0;
}

hoverAudio.onended = function() {
    mainAudio.play();
};

// Эффекты
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    document.body.style.backgroundPosition = `${50 + x * 10}% ${50 + y * 10}%`;
});

const items = ['❄️', '🚀', '⭐', '🌟', '💥', 'neon-drop'];
function createFallingItem() {
    const item = document.createElement('div');
    const type = items[Math.floor(Math.random() * items.length)];
    item.className = type === 'neon-drop' ? 'neon-drop' : (Math.random() > 0.5 ? 'snowflake' : 'emoji');
    item.innerHTML = type === 'neon-drop' ? '' : items[Math.floor(Math.random() * (items.length - 1))];
    item.style.left = Math.random() * 100 + 'vw';
    item.style.animationDuration = Math.random() * 5 + 5 + 's';
    item.style.opacity = Math.random() * 0.5 + 0.5;
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 10000);
}
setInterval(createFallingItem, 300);

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDuration = Math.random() * 2 + 1 + 's';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 5000);
}
setInterval(createStar, 300);

function spawnConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDuration = Math.random() * 2 + 1 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

function spawnSparks(event) {
    const btn = event.target;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = rect.left + rect.width / 2 + 'px';
        spark.style.top = rect.top + rect.height / 2 + 'px';
        const dx = (Math.random() - 0.5) * 100 + 'px';
        const dy = (Math.random() - 0.5) * 100 + 'px';
        spark.style.setProperty('--dx', dx);
        spark.style.setProperty('--dy', dy);
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1000);
    }
}

function spawnMandarinBurst(event) {
    const photo = event.target;
    const rect = photo.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
        const burst = document.createElement('div');
        burst.className = 'mandarin-burst';
        burst.style.left = rect.left + rect.width / 2 + 'px';
        burst.style.top = rect.top + rect.height / 2 + 'px';
        const dx = (Math.random() - 0.5) * 200 + 'px';
        const dy = (Math.random() - 0.5) * 200 + 'px';
        burst.style.setProperty('--dx', dx);
        burst.style.setProperty('--dy', dy);
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 2000);
    }
}

function createLaser() {
    const laser = document.createElement('div');
    laser.className = 'laser';
    laser.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(laser);
    setTimeout(() => laser.remove(), 4000);
}
setInterval(createLaser, 2000);

function createSmoke() {
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    smoke.style.left = Math.random() * 80 + 10 + 'vw';
    document.body.appendChild(smoke);
    setTimeout(() => smoke.remove(), 8000);
}
setInterval(createSmoke, 3000);

const phrases = ['Мандарин крутецкий!', 'Вадимко топ!', 'Актавиус сила!', 'Мандарин вайб!', 'Против царя!'];
function createFloatText() {
    const text = document.createElement('div');
    text.className = 'float-text';
    text.innerHTML = phrases[Math.floor(Math.random() * phrases.length)];
    text.style.left = Math.random() * 80 + 10 + 'vw';
    document.body.appendChild(text);
    setTimeout(() => text.remove(), 10000);
}
setInterval(createFloatText, 2000);

function createNeonPulse() {
    const pulse = document.createElement('div');
    pulse.className = 'neon-pulse';
    pulse.style.left = Math.random() * 100 + 'vw';
    pulse.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(pulse);
    setTimeout(() => pulse.remove(), 3000);
}
setInterval(createNeonPulse, 2000);

function createNeonWave() {
    const wave = document.createElement('div');
    wave.className = 'neon-wave';
    document.body.appendChild(wave);
    setTimeout(() => wave.remove(), 5000);
}
setInterval(createNeonWave, 3000);

function createNeonSpiral() {
    const spiral = document.createElement('div');
    spiral.className = 'neon-spiral';
    spiral.style.left = Math.random() * 90 + 5 + 'vw';
    spiral.style.top = Math.random() * 90 + 5 + 'vh';
    document.body.appendChild(spiral);
    setTimeout(() => spiral.remove(), 4000);
}
setInterval(createNeonSpiral, 2500);

function toggleLyrics() {
    const fullLyrics = document.querySelector('.lyrics-full');
    fullLyrics.style.display = fullLyrics.style.display === 'block' ? 'none' : 'block';
}

// Инициализация
window.onload = () => {
    console.log("Страница загружена!");
    if (!document.querySelector('.container')) {
        console.error("Ошибка: контейнер не найден!");
    }
    updateVisitorCount();
};