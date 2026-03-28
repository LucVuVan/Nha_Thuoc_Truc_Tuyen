/**
 * livechat.js
 * Hệ thống tư vấn trực tuyến NhàThuốc+
 */
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('.chat-input-area input');
    const sendBtn = document.querySelector('.send-btn');
    const chatArea = document.querySelector('.chat-messages-area');

    // Tự động cuộn xuống cuối cùng khi vừa load trang
    if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // 1. Logic Gửi tin nhắn
    const performSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        const msgHtml = `
            <div class="msg-row user">
                <div>
                    <div class="msg-bubble">${text}</div>
                    <div class="msg-time">${timeStr} ✓✓</div>
                </div>
            </div>`;
        
        chatArea.insertAdjacentHTML('beforeend', msgHtml);
        chatInput.value = '';
        chatArea.scrollTop = chatArea.scrollHeight; // Cuộn xuống tin mới nhất
    };

    if (sendBtn) sendBtn.onclick = performSend;
    if (chatInput) {
        chatInput.onkeyup = (e) => { 
            if (e.key === 'Enter') performSend(); 
        };
    }

    // 2. Logic Câu trả lời nhanh (Quick Replies)
    document.querySelectorAll('.qr').forEach(btn => {
        btn.onclick = () => {
            // Lấy nội dung text và tự động xóa bỏ emoji ở đầu (VD: "👋 Xin chào" -> "Xin chào")
            const replyText = btn.textContent.replace(/^\S+\s/, '').trim();
            chatInput.value = replyText;
            chatInput.focus();
        };
    });

    // 3. Logic Chuyển đổi hội thoại bên trái
    document.querySelectorAll('.chat-item').forEach(item => {
        item.onclick = () => {
            // Xóa active cũ, thêm active mới
            document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Xóa badge thông báo đỏ khi đã đọc
            const badge = item.querySelector('.chat-badge');
            if (badge) badge.remove();

            // Cập nhật tên người dùng lên thanh Topbar
            const name = item.querySelector('.chat-item__name').textContent;
            const topbarName = document.querySelector('.chat-topbar__name');
            if(topbarName) topbarName.textContent = name;
            
            // Nếu muốn làm thật, bạn có thể gọi AJAX ở đây để lấy tin nhắn cũ
        };
    });

    // 4. Logic chuyển đổi Tab (Tất cả / Chưa đọc)
    document.querySelectorAll('.chat-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        };
    });
});