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

// Настройка чат-бота
const BOT_TOKEN = '7700508327:AAHdzeb88g8QsVU5Bv7L04TW6_ew16Tqm6w';
let CHAT_ID = null; // Будем определять динамически

const chatMessages = document.getElementById('chat-messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = messageInput.value.trim();
    if (messageText) {
        // Отображение сообщения пользователя
        addMessage(messageText, 'user-message');

        // Если CHAT_ID ещё не определён, получим его
        if (!CHAT_ID) {
            await getChatId();
        }

        // Отправка сообщения тебе в Telegram
        await sendMessageToBot(messageText);

        // Очистка поля ввода
        messageInput.value = '';
    }
});

// Получение CHAT_ID (выполняется один раз при первом сообщении)
async function getChatId() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.ok && data.result.length > 0) {
            const update = data.result[data.result.length - 1];
            CHAT_ID = update.message ? update.message.chat.id : update.my_chat_member.chat.id;
            console.log('CHAT_ID определён:', CHAT_ID);
        } else {
            console.error('Не удалось определить CHAT_ID. Отправь сообщение боту в Telegram (@VadimkoBot).');
            addMessage('Ошибка: Отправь сообщение боту в Telegram (@VadimkoBot), чтобы я мог ответить!', 'bot-message');
        }
    } catch (error) {
        console.error('Ошибка получения CHAT_ID:', error);
        addMessage('Ошибка: Не могу связаться с Telegram. Попробуй позже!', 'bot-message');
    }
}

// Отправка сообщения в Telegram
async function sendMessageToBot(message) {
    if (!CHAT_ID) {
        console.error('CHAT_ID не определён. Сначала отправь сообщение боту в Telegram.');
        addMessage('Ошибка: Отправь сообщение боту в Telegram (@VadimkoBot), чтобы я мог ответить!', 'bot-message');
        return;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: `Новое сообщение от пользователя:\n${message}`
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.ok) {
            console.log('Сообщение отправлено в Telegram:', data);
            addMessage('Сообщение отправлено Вадимко! Ожидай ответа...', 'bot-message');
        } else {
            console.error('Ошибка отправки:', data);
            addMessage('Ошибка: Не удалось отправить сообщение. Попробуй снова!', 'bot-message');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage('Ошибка: Проблемы с сетью. Попробуй позже!', 'bot-message');
    }
}

// Отображение сообщений в чате
function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Получение ответов от тебя (временно через getUpdates)
function checkUpdates() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                data.result.forEach(update => {
                    if (update.message && update.message.text && update.message.chat.id == CHAT_ID) {
                        const messageText = update.message.text;
                        if (!messageText.startsWith('Новое сообщение от пользователя')) {
                            addMessage(`Вадимко: ${messageText}`, 'bot-message');
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Ошибка получения обновлений:', error));
}

// Проверяем обновления каждые 5 секунд
setInterval(checkUpdates, 5000);