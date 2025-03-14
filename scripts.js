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

// Адаптация размера канваса
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Динамическая загрузка фото
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
            testImg.onerror = () => loadImage(extIndex + 1);
            testImg.src = src;
        };

        loadImage();
    });
}

// Летающие фото
const floatingImages = [
    '2025031300224134.png', 'heart.png', 'leaf.png', 'mandarin-icon.png',
    'butterfly.png', 'parallax-bg.jpg', 'IMG-20250313-002030.jpg', 'IMG-20250313-001822.jpg'
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

    const birthday = new Date(now.getFullYear(), 8, 27, 23, 59, 59);
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
    document.getElementById('track-name').textContent = playlist[currentTrackIndex];
}

function playCurrentTrack() {
    audio.src = playlist[currentTrackIndex];
    audio.play()
        .then(() => {
            document.querySelector('.play-audio').textContent = 'Пауза';
            updateTrackDisplay();
        })
        .catch(error => {
            console.error('Ошибка воспроизведения:', error);
            alert('Ошибка: Проверь файл ' + playlist[currentTrackIndex]);
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

audio.addEventListener('ended', nextTrack);

// Видео
const videos = [
    { src: 'video1.mp4', thumbnail: 'images/video1-thumbnail.jpg' },
    { src: 'video2.mp4', thumbnail: 'images/video2-thumbnail.jpg' }
];

function loadVideos() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;

    videos.forEach(video => {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        const thumbnail = document.createElement('img');
        thumbnail.className = 'video-thumbnail';
        thumbnail.src = video.thumbnail || 'images/default-thumbnail.jpg';
        thumbnail.alt = 'Видео';
        thumbnail.onclick = () => openVideoModal(video.src);

        videoContainer.appendChild(thumbnail);
        videoGrid.appendChild(videoContainer);
    });
}

function openVideoModal(videoSrc) {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.src = videoSrc;
    modal.style.display = 'block';
    videoPlayer.play();
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.pause();
    videoPlayer.src = '';
    modal.style.display = 'none';
}

document.getElementById('close-video').onclick = closeVideoModal;
document.getElementById('video-modal').onclick = (e) => {
    if (e.target === document.getElementById('video-modal')) {
        closeVideoModal();
    }
};

// Уведомление в Telegram
const TELEGRAM_BOT_TOKEN = '7475609763:AAFYq6ZURw062S-8AIvX60uKoobdZR9HFww'; // Твой токен
const TELEGRAM_CHAT_ID = '5678878569'; // Твой chat_id

let visitorName = 'Аноним';

function submitName() {
    const nameInput = document.getElementById('visitor-name').value.trim();
    visitorName = nameInput || generateVisitorId();
    document.getElementById('welcome-form').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    initializeApp();
    sendVisitNotification();
}

function skipName() {
    visitorName = generateVisitorId();
    document.getElementById('welcome-form').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    initializeApp();
    sendVisitNotification();
}

function generateVisitorId() {
    const userAgent = navigator.userAgent;
    const ipResponse = fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip || 'unknown')
        .catch(() => 'unknown');
    return `User-${userAgent.split(' ')[0]}-${ipResponse}`;
}

async function sendVisitNotification() {
    try {
        // Получаем IP через внешний API
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip || 'Не определен';
        
        // Текущее время
        const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
        
        // User Agent
        const userAgent = navigator.userAgent;

        // Сообщение
        const message = `Новый посетитель!\nВремя: ${time}\nIP: ${ip}\nИдентификатор: ${visitorName}\nUser-Agent: ${userAgent}`;

        // Отправка в Telegram
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });
        console.log('Уведомление отправлено:', message);
    } catch (error) {
        console.error('Ошибка при отправке уведомления:', error);
    }
}

// Случайные цитаты
const quotes = [
    "Привет (не хейт)",
    "Привет (хейт)",
    "слава великому mc.primerise.ru♥️♥️♥️🙏🙏, заменит вам, маму, папу, дядю, тетю, отчима, станем всей дружной семьей♥️♥️♥️♥️♥️🙏🙏🙏🙏, великий mc.primerise.ru♥️♥️🙏🙏, о великий mc.primerise.ru♥️♥️🙏🙏🙏",
    "Актавиус крутой",
    "Пописял - покакай"
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quote-display');
    quoteDisplay.textContent = quotes[Math.floor(Math.random() * quotes.length)];
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
    "Дима петух",
    "С новым годом",
    "Мандаринка крут",
    "Привет",
    "Актавиус тигренок",
    "Беза"
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

// Инициализация приложения
function initializeApp() {
    loadPhotos();
    loadVideos();
    updateTrackDisplay();
    document.querySelector('.play-audio').addEventListener('click', toggleAudio);
    document.querySelector('.next-audio').addEventListener('click', nextTrack);
    document.querySelector('.prev-audio').addEventListener('click', previousTrack);
    document.querySelector('.random-greeting').addEventListener('click', showRandomGreeting);
    document.querySelector('.quote-btn').addEventListener('click', showRandomQuote);
    console.log("Приложение инициализировано!");
}

// Инициализация при загрузке
window.onload = () => {
    // Ничего не делаем здесь, все в submitName() и skipName()
};
