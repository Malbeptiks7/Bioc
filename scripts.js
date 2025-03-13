// Настройка Three.js для 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Простой куб с неоновым эффектом
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff00cc, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Добавим свет для атмосферы
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00ffcc, 1, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

// Адаптация размера канваса при изменении окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Динамическая загрузка фото с переходом на био
function loadPhotos() {
    const photoGrid = document.getElementById('photo-grid');
    if (!photoGrid) return;

    const mainPhotos = [
        { baseName: 'IMG-20250313-002030', alt: 'Вадимко', caption: 'Вадимко' },
        { baseName: 'IMG-20250313-001705-949', alt: 'Мандарин', caption: 'Мандарин' },
        { baseName: 'IMG-20250313-001822', alt: 'Актавиус', caption: 'Актавиус' }
    ];

    mainPhotos.forEach(photo => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'photo-container';
        imgContainer.style.position = 'relative';

        const img = document.createElement('img');
        img.className = 'photo';
        img.alt = photo.alt;
        img.onclick = () => window.open('https://t.me/biochca', '_blank');

        const caption = document.createElement('div');
        caption.className = 'photo-caption';
        caption.textContent = photo.caption;

        const tryExtensions = ['jpg', 'png', 'jpeg'];
        let loaded = false;

        const loadImage = (extIndex = 0) => {
            if (extIndex >= tryExtensions.length) {
                console.warn(`Фото ${photo.baseName} не найдено`);
                return;
            }

            const src = `images/${photo.baseName}.${tryExtensions[extIndex]}`;
            const testImg = new Image();
            testImg.onload = () => {
                if (!loaded) {
                    img.src = src;
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(caption);
                    photoGrid.appendChild(imgContainer);
                    loaded = true;
                }
            };
            testImg.onerror = () => {
                loadImage(extIndex + 1);
            };
            testImg.src = src;
        };

        loadImage();
    });
}

// Летающие фото
const floatingImages = [
    '2025031300224134.png', '2025031300224134.png', '2025031300224134.png', // Много копий
    '2025031300224134.png', '2025031300224134.png', '2025031300224134.png',
    '2025031300224134.png', '2025031300224134.png', '2025031300224134.png',
    'heart.png', 'leaf.png', 'mandarin-icon.png', 'butterfly.png', 'parallax-bg.jpg',
    'IMG-20250313-002030.jpg', 'IMG-20250313-001822.jpg'
];

function createFloatingImage() {
    const img = document.createElement('img');
    img.className = 'floating-image';
    img.src = `images/${floatingImages[Math.floor(Math.random() * floatingImages.length)]}`;
    img.style.width = Math.random() * 50 + 30 + 'px';
    img.style.left = Math.random() * 80 + 10 + 'vw';
    img.style.animationDelay = Math.random() * 5 + 's';
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 15000);
}
setInterval(createFloatingImage, 500);

// Таймеры
function updateTimers() {
    const now = new Date();
    const newYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    if (now > newYear) newYear.setFullYear(now.getFullYear() + 1);
    const newYearDiff = Math.ceil((newYear - now) / (1000 * 60 * 60 * 24));
    document.getElementById('new-year-days').textContent = newYearDiff;

    const birthday = new Date(now.getFullYear(), 8, 27, 23, 59, 59); // 27 сентября
    if (now > birthday) birthday.setFullYear(now.getFullYear() + 1);
    const birthdayDiff = Math.ceil((birthday - now) / (1000 * 60 * 60 * 24));
    document.getElementById('birthday-days').textContent = birthdayDiff;
}
setInterval(updateTimers, 1000);
updateTimers();

// Плейлист
const playlist = [
    'song1.mp3',
    'song2.mp3',
    'song3.mp3',
    'song4.mp3'
];
let currentTrackIndex = 0;
const audio = document.getElementById('background-audio');
audio.volume = 0.3;

function updateTrackDisplay() {
    const trackNameElement = document.getElementById('track-name');
    trackNameElement.textContent = playlist[currentTrackIndex];
}

function playCurrentTrack() {
    audio.src = playlist[currentTrackIndex];
    audio.play().then(() => {
        document.querySelector('.play-audio').textContent = 'Пауза';
        updateTrackDisplay();
    }).catch(error => {
        console.error('Ошибка воспроизведения:', error);
        alert('Ошибка: Проверь, есть ли файл ' + playlist[currentTrackIndex] + ' в корне проекта или разреши звук в браузере!');
    });
}

function toggleAudio() {
    if (audio.paused) {
        playCurrentTrack();
    } else {
        audio.pause();
        document.querySelector('.play-audio').textContent = 'Включить музыку';
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playCurrentTrack();
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playCurrentTrack();
}

// Автоматический переход к следующему треку
audio.addEventListener('ended', () => {
    nextTrack();
});

// Случайные цитаты
const quotes = [
    "Мандаринка всегда рядом! 🍊",
    "Актавиус говорит: Ты крут! 💪",
    "Неон вайб — это наш стиль! ✨",
    "Верь в себя, как я верю в тебя! 😄",
    "Каждый день — это новое приключение! 🌟",
    "Ты — часть нашего крутого мира! 🚀",
    "Улыбайся, как Мандаринка! 😺"
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quote-display');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.textContent = randomQuote;
}

// Эффект искр при клике
document.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';
        const dx = (Math.random() - 0.5) * 80 + 'px';
        const dy = (Math.random() - 0.5) * 80 + 'px';
        spark.style.setProperty('--dx', dx);
        spark.style.setProperty('--dy', dy);
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 800);
    }
});

// Случайное приветствие
const greetings = [
    'Привет, гость! 😄',
    'Добро пожаловать в мир Вадимко! 🌟',
    'Мандаринка приветствует тебя! 🍊',
    'Актавиус говорит: "Ты крут!" 💪',
    'Неон вайб активирован! ✨'
];
function showRandomGreeting() {
    const preview = document.getElementById('greeting-preview');
    const p = document.createElement('p');
    p.textContent = greetings[Math.floor(Math.random() * greetings.length)];
    preview.innerHTML = '';
    preview.appendChild(p);
    preview.classList.add('active');
    setTimeout(() => preview.classList.remove('active'), 3000);
}

// Инициализация
window.onload = () => {
    loadPhotos();
    updateTrackDisplay();
    console.log("Страница загружена!");
};