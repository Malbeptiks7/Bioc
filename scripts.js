// Счётчик посетителей
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

// Динамическая загрузка фото с подписями
function loadPhotos() {
    const photoGrid = document.getElementById('photo-grid');
    if (!photoGrid) return;

    const photos = [
        { baseName: 'IMG-20250313-001705-949', alt: 'Мандарин', caption: 'Мандарин' },
        { baseName: 'IMG-20250313-001822', alt: 'Актавиус', caption: 'Актавиус' },
        { baseName: 'IMG-20250313-002030', alt: 'Вадимко', caption: 'Вадимко' }
    ];

    photos.forEach(photo => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'photo-container';
        imgContainer.style.position = 'relative';

        const img = document.createElement('img');
        img.className = 'photo';
        img.draggable = true;
        img.ondragstart = (e) => dragStart(e, img);
        img.onclick = (event) => toggleZoomPhoto(event, img);

        const caption = document.createElement('div');
        caption.className = 'photo-caption';
        caption.textContent = photo.caption;

        const tryExtensions = ['jpg', 'png', 'jpeg'];
        let loaded = false;

        for (let ext of tryExtensions) {
            const src = `img/${photo.baseName}.${ext}`;
            const testImg = new Image();
            testImg.onload = () => {
                if (!loaded) {
                    img.src = src;
                    img.alt = photo.alt;
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(caption);
                    photoGrid.appendChild(imgContainer);
                    loaded = true;
                }
            };
            testImg.onerror = () => {
                if (!loaded && ext === tryExtensions[tryExtensions.length - 1]) {
                    console.warn(`Фото ${photo.baseName} не найдено ни в одном формате`);
                }
            };
            testImg.src = src;
        }
    });
}

// Переключение темы
let isDarkTheme = false;
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
    document.querySelectorAll('.container, .photo, .easter-egg, .cat-egg, .floating-photo, .snowflake, .emoji, .neon-drop, .confetti, .spark, .mandarin-burst, .spinning-mandarin, .neon-line, .laser, .disco, .smoke, .float-text, .star, .pulsing-star, .rain-drop, .spinning-ring, .butterfly, .falling-leaf, .neon-frame, .floating-heart, .twinkling-star, .zoom-photo, .feedback-form input, .feedback-form textarea, .feedback-form button, .game-container, #game-input, #game-submit, #game-result, .to-top, .random-effect, .pause-effects, .theme-toggle').forEach(el => el.classList.toggle('dark-theme'));
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Увеличение фото
let zoomPhoto = null;
function toggleZoomPhoto(event, img) {
    if (!zoomPhoto) {
        zoomPhoto = document.createElement('img');
        zoomPhoto.className = 'zoom-photo';
        document.body.appendChild(zoomPhoto);
    }
    zoomPhoto.src = img.src;
    zoomPhoto.classList.toggle('active');
    if (!zoomPhoto.classList.contains('active')) {
        setTimeout(() => zoomPhoto.remove(), 300);
        zoomPhoto = null;
    }
}

// Перетаскивание фото
function dragStart(e, img) {
    e.dataTransfer.setData('text/plain', img.src);
}
function allowDrop(e) {
    e.preventDefault();
}
function drop(e) {
    e.preventDefault();
    const src = e.dataTransfer.getData('text');
    const img = document.createElement('img');
    img.src = src;
    img.className = 'floating-photo';
    img.style.left = e.clientX + 'px';
    img.style.top = e.clientY + 'px';
    document.body.appendChild(img);
}

// Анимация при скролле
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const elements = document.querySelectorAll('.container, .photo-grid, h1, p, .btn');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.style.animation = 'scrollEffect 1s forwards';
        }
    });
    document.querySelector('.to-top').classList.toggle('active', scrollTop > 200);
}
window.addEventListener('scroll', handleScroll);

// Пауза эффектов
let effectsPaused = false;
function toggleEffects() {
    effectsPaused = !effectsPaused;
    document.querySelector('.pause-effects').textContent = effectsPaused ? 'Возобновить эффекты' : 'Пауза эффектов';
}

// Случайный эффект
const effects = [spawnConfetti, spawnSparks, createLaser, createSmoke, createNeonPulse, createNeonWave, createNeonSpiral];
function randomEffect() {
    if (!effectsPaused) {
        const effect = effects[Math.floor(Math.random() * effects.length)];
        effect();
    }
}

// Кнопка "Наверх"
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Мини-игра "Угадай фото"
function startGame() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.add('active');
    const photos = [
        { src: 'img/IMG-20250313-001705-949.jpg', name: 'Мандарин' },
        { src: 'img/IMG-20250313-001822.jpg', name: 'Актавиус' },
        { src: 'img/IMG-20250313-002030.jpg', name: 'Вадимко' }
    ];
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    const gamePhoto = document.getElementById('game-photo');
    gamePhoto.src = randomPhoto.src;
    const gameInput = document.getElementById('game-input');
    const gameSubmit = document.getElementById('game-submit');
    const gameResult = document.getElementById('game-result');
    let attempts = 3;

    gameSubmit.onclick = (e) => {
        e.preventDefault();
        if (gameInput.value.toLowerCase() === randomPhoto.name.toLowerCase()) {
            gameResult.textContent = 'Правильно! 🎉';
            setTimeout(() => {
                gameContainer.classList.remove('active');
                gameInput.value = '';
                gameResult.textContent = '';
            }, 2000);
        } else {
            attempts--;
            gameResult.textContent = `Неверно! Осталось ${attempts} попыток.`;
            if (attempts === 0) {
                gameResult.textContent = `Поражение! Это ${randomPhoto.name}.`;
                setTimeout(() => {
                    gameContainer.classList.remove('active');
                    gameInput.value = '';
                    gameResult.textContent = '';
                }, 2000);
            }
        }
    };
}
document.querySelector('.btn').addEventListener('click', startGame);

// Форма обратной связи
document.getElementById('feedback-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('feedback-name').value;
    const message = document.getElementById('feedback-message').value;
    alert(`Спасибо, ${name}! Сообщение: ${message} отправлено.`);
    document.getElementById('feedback-form').reset();
});

// Эффекты
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    document.body.style.backgroundPosition = `${50 + x * 10}% ${50 + y * 10}%`;
});

const items = ['❄️', '🚀', '⭐', '🌟', '💥', 'neon-drop'];
function createFallingItem() {
    if (!effectsPaused) {
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
}
setInterval(createFallingItem, 300);

function createStar() {
    if (!effectsPaused) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = Math.random() * 2 + 1 + 's';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 5000);
    }
}
setInterval(createStar, 300);

function createPulsingStar() {
    if (!effectsPaused) {
        const star = document.createElement('div');
        star.className = 'pulsing-star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 5000);
    }
}
setInterval(createPulsingStar, 500);

function spawnConfetti() {
    if (!effectsPaused) {
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
}

function spawnSparks(event) {
    if (!effectsPaused) {
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
}

function spawnMandarinBurst(event) {
    if (!effectsPaused) {
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
}

function createLaser() {
    if (!effectsPaused) {
        const laser = document.createElement('div');
        laser.className = 'laser';
        laser.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(laser);
        setTimeout(() => laser.remove(), 4000);
    }
}
setInterval(createLaser, 2000);

function createSmoke() {
    if (!effectsPaused) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.left = Math.random() * 80 + 10 + 'vw';
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 8000);
    }
}
setInterval(createSmoke, 3000);

const phrases = ['Мандарин крутецкий!', 'Вадимко топ!', 'Актавиус сила!', 'Мандарин вайб!', 'Против царя!'];
function createFloatText() {
    if (!effectsPaused) {
        const text = document.createElement('div');
        text.className = 'float-text';
        text.innerHTML = phrases[Math.floor(Math.random() * phrases.length)];
        text.style.left = Math.random() * 80 + 10 + 'vw';
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 10000);
    }
}
setInterval(createFloatText, 2000);

function createNeonPulse() {
    if (!effectsPaused) {
        const pulse = document.createElement('div');
        pulse.className = 'neon-pulse';
        pulse.style.left = Math.random() * 100 + 'vw';
        pulse.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(pulse);
        setTimeout(() => pulse.remove(), 3000);
    }
}
setInterval(createNeonPulse, 2000);

function createNeonWave() {
    if (!effectsPaused) {
        const wave = document.createElement('div');
        wave.className = 'neon-wave';
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 5000);
    }
}
setInterval(createNeonWave, 3000);

function createNeonSpiral() {
    if (!effectsPaused) {
        const spiral = document.createElement('div');
        spiral.className = 'neon-spiral';
        spiral.style.left = Math.random() * 90 + 5 + 'vw';
        spiral.style.top = Math.random() * 90 + 5 + 'vh';
        document.body.appendChild(spiral);
        setTimeout(() => spiral.remove(), 4000);
    }
}
setInterval(createNeonSpiral, 2500);

function createRainDrop() {
    if (!effectsPaused) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 2000);
    }
}
setInterval(createRainDrop, 100);

function createSpinningRing() {
    if (!effectsPaused) {
        const ring = document.createElement('div');
        ring.className = 'spinning-ring';
        ring.style.top = Math.random() * 100 + 'vh';
        ring.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 4000);
    }
}
setInterval(createSpinningRing, 500);

function createButterfly() {
    if (!effectsPaused) {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';
        butterfly.style.left = Math.random() * 100 + 'vw';
        butterfly.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(butterfly);
        setTimeout(() => butterfly.remove(), 5000);
    }
}
setInterval(createButterfly, 1000);

function createFallingLeaf() {
    if (!effectsPaused) {
        const leaf = document.createElement('div');
        leaf.className = 'falling-leaf';
        leaf.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), 6000);
    }
}
setInterval(createFallingLeaf, 800);

function createNeonFrame() {
    if (!effectsPaused) {
        const frame = document.createElement('div');
        frame.className = 'neon-frame';
        document.body.appendChild(frame);
        setTimeout(() => frame.remove(), 3000);
    }
}
setInterval(createNeonFrame, 4000);

function createFloatingHeart() {
    if (!effectsPaused) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }
}
setInterval(createFloatingHeart, 1200);

function createTwinklingStar() {
    if (!effectsPaused) {
        const star = document.createElement('div');
        star.className = 'twinkling-star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1500);
    }
}
setInterval(createTwinklingStar, 300);

// Инициализация
window.onload = () => {
    console.log("Страница загружена!");
    if (!document.querySelector('.container')) {
        console.error("Ошибка: контейнер не найден!");
    }
    updateVisitorCount();
    loadPhotos();

    // Тема из localStorage
    if (localStorage.getItem('theme') === 'dark') {
        toggleTheme();
    }

    // Кнопки и эффекты
    const themeToggle = document.querySelector('.theme-toggle');
    document.body.addEventListener('dragover', allowDrop);
    document.body.addEventListener('drop', drop);
    document.querySelectorAll('.parallax').forEach(el => el.classList.add('parallax'));

    // Пульсирующие звёзды
    for (let i = 0; i < 10; i++) createPulsingStar();

    // Ленивая загрузка фото
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
};