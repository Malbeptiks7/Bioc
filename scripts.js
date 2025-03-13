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
        img.onclick = (event) => toggleZoomPhoto(event, img);

        const caption = document.createElement('div');
        caption.className = 'photo-caption';
        caption.textContent = photo.caption;

        // Пробуем загрузить .jpg, если не работает — .png, .jpeg
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
    document.body.style.background = isDarkTheme
        ? 'linear-gradient(45deg, #000, #333, #666, #999)'
        : 'linear-gradient(45deg, #ff0000, #ff00cc, #00ffcc, #0000ff, #ff9900, #4b0082, #000000, #ffffff)';
    document.querySelectorAll('.btn, .theme-toggle').forEach(el => {
        el.style.background = isDarkTheme
            ? 'linear-gradient(90deg, #666, #000)'
            : 'linear-gradient(90deg, #ff00cc, #000)';
        el.style.borderColor = isDarkTheme ? '#666' : '#ff00cc';
    });
    document.querySelectorAll('h1, p, .photo-caption, .menu a').forEach(el => {
        el.style.color = isDarkTheme ? '#ccc' : '#fff';
    });
}

// Увеличение фото при клике
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
        setTimeout(() => zoomPhoto.remove(), 300); // Удаляем после анимации
        zoomPhoto = null;
    }
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
}
window.addEventListener('scroll', handleScroll);

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

function createPulsingStar() {
    const star = document.createElement('div');
    star.className = 'pulsing-star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 5000);
}
setInterval(createPulsingStar, 500);

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

// Инициализация
window.onload = () => {
    console.log("Страница загружена!");
    if (!document.querySelector('.container')) {
        console.error("Ошибка: контейнер не найден!");
    }
    updateVisitorCount();
    loadPhotos(); // Загружаем фото динамически

    // Добавляем кнопку переключения темы
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.textContent = 'Тема';
    themeToggle.onclick = toggleTheme;
    document.body.appendChild(themeToggle);

    // Создаём 10 пульсирующих звёзд
    for (let i = 0; i < 10; i++) {
        createPulsingStar();
    }
};