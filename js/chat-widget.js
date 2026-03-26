// ===== chat-widget.js – NhàThuốc+ =====
// Tự động inject chatbot FAB + window vào bất kỳ trang nào

(function () {
  // Không inject 2 lần
  if (document.getElementById('chatFab')) return;

  // Inject CSS chat nếu chưa có
  if (!document.querySelector('link[href*="chat.css"]')) {
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    // Tự động xác định đường dẫn tương đối
    const depth = window.location.pathname.split('/').length - 2;
    link.href = '../'.repeat(Math.max(depth - 1, 1)) + 'css/pages/chat.css';
    document.head.appendChild(link);
  }

  // HTML chatbot
  const html = `
  <button class="chat-fab" id="chatFab" onclick="toggleChat()">
    <span class="chat-fab__badge" id="chatBadge">1</span>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </button>

  <div class="chat-window" id="chatWindow">
    <div class="chat-header">
      <div class="chat-header__avatar" id="headerAvatar">🤖</div>
      <div class="chat-header__info">
        <div class="chat-header__name" id="headerName">Dược sĩ Bot</div>
        <div class="chat-header__status" id="headerStatus">
          <span class="chat-header__status-dot"></span>NhàThuốc+ AI Assistant
        </div>
      </div>
      <button class="chat-header__close" onclick="toggleChat()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="chat-state active" id="state-chatbot">
      <div class="chat-messages" id="chatMessages">
        <div class="msg bot">
          <div class="msg__avatar">🤖</div>
          <div>
            <div class="msg__bubble">Xin chào! Tôi là Dược sĩ Bot của NhàThuốc+. Bạn đang gặp triệu chứng gì?</div>
            <div class="msg__time" id="initTime"></div>
          </div>
        </div>
      </div>
      <div class="chat-quickreplies" id="quickReplies">
        <button class="qr-btn" onclick="selectSymptom('Ho khan')">Ho khan</button>
        <button class="qr-btn" onclick="selectSymptom('Sốt')">Sốt</button>
        <button class="qr-btn" onclick="selectSymptom('Đau đầu')">Đau đầu</button>
        <button class="qr-btn" onclick="connectDoctor()">Gặp Dược sĩ</button>
      </div>
      <div class="chat-input-bar">
        <input class="chat-input" id="chatInput" placeholder="Nhập tin nhắn..." onkeydown="onEnter(event)" />
        <button class="chat-send" onclick="sendMessage()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="chat-state" id="state-loading">
      <div class="chat-loading">
        <div class="loading-spinner"></div>
        <div class="loading-title">Đang kết nối với Dược sĩ...</div>
        <div class="loading-sub">Vui lòng đợi trong giây lát</div>
      </div>
    </div>

    <div class="chat-state" id="state-live">
      <div class="chat-messages" id="liveMessages"></div>
      <div class="chat-input-bar">
        <input class="chat-input" id="liveInput" placeholder="Nhập tin nhắn..." onkeydown="onEnterLive(event)" />
        <button class="chat-send" onclick="sendLiveMessage()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>`;

  // Inject vào cuối body
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // Load chat.js nếu chưa có
  if (typeof toggleChat === 'undefined') {
    const depth = window.location.pathname.split('/').length - 2;
    const base  = '../'.repeat(Math.max(depth - 1, 1));
    const script = document.createElement('script');
    script.src = base + 'js/chat.js';
    document.body.appendChild(script);
  }
})();