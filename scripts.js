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
    'heart.png', 'leaf.png', 'mandarin-icon.png', 'butterfly.png', 'parallax-bg.jpg',
    '20250313-002414.jpg', 'IMG-20250313-002030.jpg', 'IMG-20250313-001822.jpg'
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
setInterval(createFloatingImage, 2000);

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

// Настройка чат-бота
const BOT_TOKEN = '7700508327:AAHdzeb88g8QsVU5Bv7L04TW6_ew16Tqm6w';
let CHAT_ID = null;

const chatMessages = document.getElementById('chat-messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const nicknameSection = document.getElementById('nickname-section');

nicknameSection.style.display = 'none'; // Убираем секцию ника

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    if (messageText) {
        addMessage(`Ты: ${messageText}`, 'user-message');
        if (!CHAT_ID) {
            addMessage('Проверяю настройки чата...', 'bot-message');
            await getChatId();
        }
        if (CHAT_ID) {
            await sendMessageToBot(messageText);
        } else {
            addMessage('Ошибка: Не удалось настроить чат. Отправь сообщение боту в Telegram (@malbept_bot)!', 'bot-message');
        }
        messageInput.value = '';
    } else {
        addMessage('Напиши сообщение!', 'bot-message');
    }
});

async function getChatId() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        const data = await response.json();
        console.log('Ответ от Telegram API (getUpdates):', data);

        if (data.ok && data.result.length > 0) {
            const update = data.result[data.result.length - 1];
            CHAT_ID = update.message?.chat?.id || update.my_chat_member?.chat?.id;
            console.log('CHAT_ID определён:', CHAT_ID);
            if (CHAT_ID) {
                addMessage('Чат настроен! Теперь могу отправлять сообщения.', 'bot-message');
            } else {
                addMessage('Ошибка: Не удалось определить CHAT_ID. Отправь сообщение @malbept_bot.', 'bot-message');
            }
        } else {
            console.error('Нет обновлений или ошибка:', data);
            addMessage('Ошибка: Бот не получил сообщений. Напиши @malbept_bot в Telegram!', 'bot-message');
        }
    } catch (error) {
        console.error('Ошибка при получении CHAT_ID:', error);
        addMessage(`Ошибка: Не могу связаться с Telegram. Проверь интернет или токен! (${error.message})`, 'bot-message');
    }
}

async function sendMessageToBot(message) {
    if (!CHAT_ID) {
        addMessage('Ошибка: CHAT_ID не определён. Напиши @malbept_bot!', 'bot-message');
        return;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: message
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        const data = await response.json();
        console.log('Ответ от Telegram API (sendMessage):', data);

        if (data.ok) {
            addMessage('Сообщение отправлено Вадимко! Ожидай ответа...', 'bot-message');
        } else {
            console.error('Ошибка отправки:', data);
            addMessage(`Ошибка: Не удалось отправить сообщение. ${data.description}`, 'bot-message');
        }
    } catch (error) {
        console.error('Ошибка при отправке:', error);
        addMessage(`Ошибка: Проблемы с сетью или токеном. (${error.message})`, 'bot-message');
    }
}

function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function checkUpdates() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                data.result.forEach(update => {
                    if (update.message && update.message.chat.id === CHAT_ID) {
                        const messageText = update.message.text;
                        const replyTo = update.message.reply_to_message?.text;
                        if (replyTo && messageText) {
                            addMessage(`Вадимко: ${messageText}`, 'bot-message');
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Ошибка обновлений:', error));
}
setInterval(checkUpdates, 5000);

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

// Фоновая музыка
function playAudio() {
    const audio = document.getElementById('background-audio');
    audio.volume = 0.3;
    if (audio.paused) {
        audio.play().then(() => {
            document.querySelector('.play-audio').textContent = 'Выключить музыку';
        }).catch(error => {
            console.error('Ошибка воспроизведения:', error);
            addMessage('Ошибка: Проверь, есть ли song.mp3 в корне проекта или разреши звук в браузере!', 'bot-message');
        });
    } else {
        audio.pause();
        document.querySelector('.play-audio').textContent = 'Включить музыку';
    }
}

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
    console.log("Страница загружена!");
};