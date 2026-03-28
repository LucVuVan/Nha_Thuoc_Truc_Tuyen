/* ===== admin-chatbot.js ===== */

const QUICK_REPLIES = [
  { keyword: 'chào',       text: 'Xin chào! Tôi là trợ lý ảo của NhàThuốc+. Tôi có thể giúp gì cho bạn?' },
  { keyword: 'giờ mở cửa', text: 'Chúng tôi mở cửa từ 7:00 – 22:00 hằng ngày, kể cả ngày lễ.' },
  { keyword: 'giao hàng',  text: 'Chúng tôi giao hàng miễn phí cho đơn từ 200,000đ trong bán kính 5km. Thời gian giao hàng 30–60 phút.' },
  { keyword: 'thanh toán', text: 'Chúng tôi nhận thanh toán qua COD, Chuyển khoản, Ví điện tử (Momo, ZaloPay).' },
  { keyword: 'đổi trả',    text: 'Chính sách đổi trả trong 7 ngày nếu sản phẩm bị lỗi hoặc không đúng mô tả.' },
  { keyword: 'tư vấn',     text: 'Dược sĩ của chúng tôi trực tuyến 24/7, sẵn sàng tư vấn miễn phí cho bạn!' },
];

const AI_INTENTS = [
  { name:'Hỏi về sản phẩm',    keywords:'thuốc, giá, còn bán, tìm',        confidence:85 },
  { name:'Kiểm tra đơn hàng',  keywords:'đơn hàng, mã đơn, tracking',       confidence:92 },
  { name:'Hỏi về giao hàng',   keywords:'giao, ship, phí ship, khi nào',    confidence:88 },
  { name:'Tư vấn dược',        keywords:'cách dùng, liều dùng, tác dụng phụ', confidence:78 },
  { name:'Khiếu nại',          keywords:'khiếu nại, phàn nàn, không hài lòng', confidence:95 },
];

// ── Render quick replies ──
function renderQuickReplies() {
  const container = document.getElementById('quickRepliesList');
  if (!container) return;

  container.innerHTML = QUICK_REPLIES.map((qr, i) => `
    <div class="qr-item" id="qr-${i}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <div class="qr-item__keyword">Từ khóa: ${qr.keyword}</div>
        <div style="display:flex;gap:8px;">
          <span class="qr-item__edit" onclick="editReply(${i})">Sửa</span>
          <span class="qr-item__edit" style="color:var(--error)" onclick="deleteReply(${i})">Xóa</span>
        </div>
      </div>
      <div class="qr-item__text">${qr.text}</div>
    </div>`).join('');
}

// ── Render AI intents ──
function renderIntents() {
  const tbody = document.getElementById('intentsBody');
  if (!tbody) return;

  tbody.innerHTML = AI_INTENTS.map((intent, i) => `
    <tr>
      <td class="train-name">${intent.name}</td>
      <td class="train-keywords">${intent.keywords}</td>
      <td>
        <div class="train-bar-wrap">
          <div class="train-bar-bg">
            <div class="train-bar-fill" style="width:${intent.confidence}%"></div>
          </div>
          <div class="train-percent">${intent.confidence}%</div>
        </div>
      </td>
      <td><span class="train-action" onclick="trainIntent(${i})">Huấn luyện</span></td>
    </tr>`).join('');
}

// ── Toggle switch ──
function initToggles() {
  document.querySelectorAll('.toggle-switch').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });
}

// ── Add quick reply ──
function addQuickReply() {
  const kw   = prompt('Từ khóa kích hoạt:');
  if (!kw || !kw.trim()) return;
  const text = prompt('Nội dung trả lời:');
  if (!text || !text.trim()) return;
  QUICK_REPLIES.push({ keyword: kw.trim(), text: text.trim() });
  renderQuickReplies();
  showToast('✅ Đã thêm câu trả lời nhanh');
}

// ── Edit quick reply ──
function editReply(i) {
  const qr      = QUICK_REPLIES[i];
  const newText = prompt('Chỉnh sửa nội dung:', qr.text);
  if (newText && newText.trim()) {
    qr.text = newText.trim();
    renderQuickReplies();
    showToast('✅ Đã cập nhật câu trả lời');
  }
}

// ── Delete quick reply ──
function deleteReply(i) {
  if (!confirm(`Xóa câu trả lời cho từ khóa "${QUICK_REPLIES[i].keyword}"?`)) return;
  QUICK_REPLIES.splice(i, 1);
  renderQuickReplies();
  showToast('✅ Đã xóa câu trả lời');
}

// ── Train intent ──
function trainIntent(i) {
  const intent = AI_INTENTS[i];
  // Simulate training tăng confidence
  if (intent.confidence < 99) {
    intent.confidence = Math.min(99, intent.confidence + Math.floor(Math.random() * 3) + 1);
    renderIntents();
    showToast(`🧠 Đang huấn luyện "${intent.name}"... ${intent.confidence}%`);
  } else {
    showToast(`✅ "${intent.name}" đã đạt độ chính xác tối đa`);
  }
}

// ── Toggle chatbot on/off ──
function toggleChatbot(btn) {
  const statusEl  = document.getElementById('chatbotStatus');
  const isRunning = btn.textContent.includes('Tạm dừng');
  if (isRunning) {
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Khởi động';
    btn.style.background = '#dcfce7';
    btn.style.color = '#15803d';
    btn.style.borderColor = '#bbf7d0';
    if (statusEl) statusEl.innerHTML = '<span class="chatbot-status__dot" style="background:#f59e0b"></span>Đã tạm dừng';
    showToast('⏸ Chatbot đã tạm dừng');
  } else {
    btn.innerHTML = '<i class="fa-regular fa-circle-pause"></i> Tạm dừng';
    btn.style.background = '#fee2e2';
    btn.style.color = '#dc2626';
    btn.style.borderColor = '#fecaca';
    if (statusEl) statusEl.innerHTML = '<span class="chatbot-status__dot"></span>Đang hoạt động – Xử lý 247 hội thoại hôm nay';
    showToast('▶️ Chatbot đã được khởi động');
  }
}

// ── Save settings ──
function saveSettings() {
  showToast('✅ Đã lưu cài đặt chatbot');
}

// ── Toast ──
function showToast(msg) {
  const old = document.querySelector('.admin-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'admin-toast';
  el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1a8c4e;color:#fff;border-radius:10px;padding:10px 18px;font-size:0.85rem;font-weight:600;z-index:999;box-shadow:0 4px 20px rgba(26,140,78,0.3);';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuickReplies();
  renderIntents();
  initToggles();
});