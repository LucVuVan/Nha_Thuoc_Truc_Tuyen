// ===== CHAT WIDGET – chat.js =====

function nowTime() {
    const d = new Date();
    return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}

// ── Khởi tạo ──
document.addEventListener('DOMContentLoaded', () => {
    const initTime = document.getElementById('initTime');
    if (initTime) initTime.textContent = nowTime();
});

// ── Toggle mở/đóng ──
function toggleChat() {
    const win = document.getElementById('chatWindow');
    const fab = document.getElementById('chatFab');
    const isOpen = win.classList.contains('open');
    win.classList.toggle('open', !isOpen);
    fab.classList.toggle('open', !isOpen);
    if (!isOpen) document.getElementById('chatBadge').style.display = 'none';
}

// ── Chuyển state ──
function switchState(state) {
    document.querySelectorAll('.chat-state').forEach(s => s.classList.remove('active'));
    document.getElementById('state-' + state).classList.add('active');
}

// ── Data ──
const BOT_RESPONSES = {
    'ho khan': [
        'Bạn ho khan bao lâu rồi? Có kèm đau họng không?',
        'Dựa trên triệu chứng của bạn, tôi gợi ý các sản phẩm sau:',
    ],
    'sốt': [
        'Nhiệt độ của bạn là bao nhiêu độ? Có kèm ớn lạnh không?',
        'Dựa trên triệu chứng của bạn, tôi gợi ý các sản phẩm sau:',
    ],
    'đau đầu': [
        'Cơn đau đầu ở vùng nào? Kéo dài bao lâu rồi?',
        'Dựa trên triệu chứng của bạn, tôi gợi ý các sản phẩm sau:',
    ],
};

const PRODUCTS = {
    'ho khan': { name: 'Siro ho Prospan 100ml', price: '85.000đ', img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=80&h=80&fit=crop' },
    'sốt':    { name: 'Paracetamol 500mg',      price: '25.000đ', img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=80&h=80&fit=crop' },
    'đau đầu':{ name: 'Efferalgan 500mg',        price: '45.000đ', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop' },
};

let currentSymptom = null;
let chatStep = 0;

// ── Thêm tin nhắn ──
function appendMsg(containerId, role, content) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    const avatarIcon = role === 'bot' ? (containerId === 'liveMessages' ? '👩‍⚕️' : '🤖') : '';
    div.innerHTML = `
        ${role === 'bot' ? `<div class="msg__avatar">${avatarIcon}</div>` : ''}
        <div>
            <div class="msg__bubble">${content}</div>
            <div class="msg__time">${nowTime()}</div>
        </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ── Typing indicator ──
function showTyping(containerId) {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typing-indicator';
    div.innerHTML = `
        <div class="msg__avatar">🤖</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
function removeTyping() { document.getElementById('typing-indicator')?.remove(); }

// ── Chọn triệu chứng ──
function selectSymptom(symptom) {
    currentSymptom = symptom.toLowerCase();
    chatStep = 0;
    document.getElementById('quickReplies').style.display = 'none';
    appendMsg('chatMessages', 'user', symptom);
    showTyping('chatMessages');
    setTimeout(() => {
        removeTyping();
        const responses = BOT_RESPONSES[currentSymptom] || ['Tôi hiểu rồi, để tôi tư vấn cho bạn.'];
        appendMsg('chatMessages', 'bot', responses[0]);
        chatStep = 1;
    }, 1000);
}

// ── Gửi tin chatbot ──
function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    appendMsg('chatMessages', 'user', text);
    showTyping('chatMessages');
    setTimeout(() => {
        removeTyping();
        if (chatStep === 1 && currentSymptom) {
            appendMsg('chatMessages', 'bot', BOT_RESPONSES[currentSymptom][1]);
            const prod = PRODUCTS[currentSymptom];
            if (prod) {
                const container = document.getElementById('chatMessages');
                const suggestDiv = document.createElement('div');
                suggestDiv.innerHTML = `
                    <a class="product-suggest" href="product.html">
                        <img class="product-suggest__img" src="${prod.img}" alt="${prod.name}" />
                        <div>
                            <div class="product-suggest__name">${prod.name}</div>
                            <div class="product-suggest__price">${prod.price}</div>
                        </div>
                    </a>`;
                container.appendChild(suggestDiv);
                container.scrollTop = container.scrollHeight;
            }
            const qr = document.getElementById('quickReplies');
            qr.style.display = 'flex';
            qr.innerHTML = '<button class="qr-btn" onclick="connectDoctor()">🩺 Gặp Dược sĩ trực tiếp</button>';
            chatStep = 2;
        } else {
            appendMsg('chatMessages', 'bot', 'Bạn có muốn tôi kết nối với Dược sĩ để được tư vấn chi tiết hơn không?');
            const qr = document.getElementById('quickReplies');
            qr.style.display = 'flex';
            qr.innerHTML = '<button class="qr-btn" onclick="connectDoctor()">🩺 Gặp Dược sĩ ngay</button>';
        }
    }, 1200);
}
function onEnter(e) { if (e.key === 'Enter') sendMessage(); }

// ── Kết nối dược sĩ ──
function connectDoctor() {
    switchState('loading');
    document.getElementById('headerName').textContent = 'Đang kết nối...';
    document.getElementById('headerStatus').innerHTML = '<span class="chat-header__status-dot"></span>Vui lòng đợi';
    setTimeout(() => {
        switchState('live');
        document.getElementById('headerAvatar').innerHTML = '<img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face" alt="DS" />';
        document.getElementById('headerName').textContent = 'DS. Nguyễn Thị Mai';
        document.getElementById('headerStatus').innerHTML = '<span class="chat-header__status-dot"></span>Đang trực tuyến <span class="live-badge">LIVE</span>';
        setTimeout(() => appendMsg('liveMessages', 'bot', 'Xin chào! Tôi là Dược sĩ Mai. Tôi đã xem qua triệu chứng của bạn. Bạn cho tôi biết thêm chi tiết được không?'), 600);
    }, 2500);
}

// ── Gửi tin live chat ──
function sendLiveMessage() {
    const input = document.getElementById('liveInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    appendMsg('liveMessages', 'user', text);
    showTyping('liveMessages');
    setTimeout(() => {
        removeTyping();
        const replies = [
            'Tôi hiểu rồi. Dựa trên triệu chứng của bạn, tôi gợi ý bạn dùng thuốc theo chỉ định.',
            'Bạn có dị ứng với thuốc nào không? Điều này rất quan trọng.',
            'Nếu triệu chứng không cải thiện sau 3 ngày, bạn nên đến cơ sở y tế gần nhất.',
            'Tôi sẽ gửi đơn thuốc cho bạn ngay. Bạn có thể đặt hàng trực tiếp trên app nhé!',
        ];
        appendMsg('liveMessages', 'bot', replies[Math.floor(Math.random() * replies.length)]);
    }, 1500);
}
function onEnterLive(e) { if (e.key === 'Enter') sendLiveMessage(); }