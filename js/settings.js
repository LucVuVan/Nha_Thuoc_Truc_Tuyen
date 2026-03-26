/* ===== SETTINGS PAGE JS – NhàThuốc+ ===== */

// ── Helpers ──
function getUser() {
    try { return JSON.parse(localStorage.getItem('ntp_user') || 'null'); }
    catch { return null; }
}
function saveUser(data) {
    localStorage.setItem('ntp_user', JSON.stringify(data));
    if (data.email) {
        localStorage.setItem('ntp_profile_' + data.email, JSON.stringify(data));
    }
}
function getAddresses() {
    try { return JSON.parse(localStorage.getItem('ntp_addresses') || '[]'); }
    catch { return []; }
}
function saveAddresses(list) {
    localStorage.setItem('ntp_addresses', JSON.stringify(list));
}
function getNotifSettings() {
    try { return JSON.parse(localStorage.getItem('ntp_notif_settings') || '{}'); }
    catch { return {}; }
}
function saveNotifSettings(data) {
    localStorage.setItem('ntp_notif_settings', JSON.stringify(data));
}

// ── Push thông báo vào chuông ──
function pushNotif(icon, title, desc, link = '#') {
    const notifs = JSON.parse(localStorage.getItem('ntp_notifs') || '[]');
    notifs.unshift({
        id:     Date.now().toString(),
        icon,
        title,
        desc,
        link,
        time:   new Date().toLocaleDateString('vi-VN'),
        unread: true,
    });
    // Giữ tối đa 20 thông báo
    if (notifs.length > 20) notifs.pop();
    localStorage.setItem('ntp_notifs', JSON.stringify(notifs));
}

function logout() {
    if (!confirm('Bạn có chắc muốn đăng xuất không?')) return;
    localStorage.removeItem('ntp_user');
    localStorage.removeItem('ntp_cart');
    window.location.href = 'login.html';
}

// ── Sidebar navigation ──
function initNav() {
    document.querySelectorAll('.settings-nav__item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.settings-nav__item').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            const section = document.getElementById('section-' + btn.dataset.section);
            if (section) section.classList.add('active');
        });
    });
}

// ── Load user data ──
function loadProfile() {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    const letter   = (user.name || user.email || 'U').charAt(0).toUpperCase();
    const avatarEl = document.getElementById('avatarDisplay');
    const nameEl   = document.getElementById('sidebarName');
    const emailEl  = document.getElementById('sidebarEmail');
    if (avatarEl) avatarEl.textContent = letter;
    if (nameEl)   nameEl.textContent   = user.name  || 'Người dùng';
    if (emailEl)  emailEl.textContent  = user.email || '';

    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    set('profileName',  user.name);
    set('profilePhone', user.phone);
    set('profileEmail', user.email);
    set('profileDob',   user.dob);
    if (user.gender) {
        const radio = document.querySelector(`input[name="gender"][value="${user.gender}"]`);
        if (radio) radio.checked = true;
    }
}

// ── Save profile ──
function saveProfile() {
    const name   = document.getElementById('profileName')?.value.trim();
    const phone  = document.getElementById('profilePhone')?.value.trim();
    const email  = document.getElementById('profileEmail')?.value.trim();
    const dob    = document.getElementById('profileDob')?.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    if (!name)  { pushNotif('⚠️', 'Thiếu thông tin', 'Vui lòng nhập họ và tên!', 'settings.html'); return; }
    if (!email) { pushNotif('⚠️', 'Thiếu thông tin', 'Vui lòng nhập email!', 'settings.html'); return; }

    const user = getUser() || {};
    Object.assign(user, { name, phone, email, dob, gender });
    saveUser(user);

    document.getElementById('sidebarName').textContent   = name;
    document.getElementById('sidebarEmail').textContent  = email;
    document.getElementById('avatarDisplay').textContent = name.charAt(0).toUpperCase();

    pushNotif('✅', 'Cập nhật thông tin', 'Thông tin cá nhân đã được lưu thành công.', 'settings.html');
    showSuccessBanner('Đã lưu thông tin cá nhân!');
}

// ── Password strength ──
function checkPasswordStrength(pwd) {
    const bar      = document.getElementById('pwdStrength');
    const tipLen   = document.getElementById('tip-len');
    const tipUpper = document.getElementById('tip-upper');
    const tipNum   = document.getElementById('tip-num');
    if (!bar) return;

    const hasLen   = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum   = /[0-9]/.test(pwd);

    const mark = (el, ok) => {
        if (!el) return;
        el.classList.toggle('ok', ok);
        el.textContent = (ok ? '✓ ' : '✗ ') + el.textContent.slice(2);
    };
    mark(tipLen,   hasLen);
    mark(tipUpper, hasUpper);
    mark(tipNum,   hasNum);

    const score = [hasLen, hasUpper, hasNum].filter(Boolean).length;
    bar.className = 'pwd-strength ' + (score === 1 ? 'weak' : score === 2 ? 'medium' : score === 3 ? 'strong' : '');
}

// ── Save password ──
function savePassword() {
    const current = document.getElementById('currentPwd')?.value;
    const newPwd  = document.getElementById('newPwd')?.value;
    const confirm = document.getElementById('confirmPwd')?.value;

    if (!current) { showSuccessBanner('⚠️ Nhập mật khẩu hiện tại!'); return; }
    if (!newPwd || newPwd.length < 8) { showSuccessBanner('⚠️ Mật khẩu mới tối thiểu 8 ký tự!'); return; }
    if (newPwd !== confirm) { showSuccessBanner('⚠️ Mật khẩu xác nhận không khớp!'); return; }

    const user = getUser() || {};
    user.password = newPwd;
    saveUser(user);

    document.getElementById('currentPwd').value = '';
    document.getElementById('newPwd').value     = '';
    document.getElementById('confirmPwd').value = '';

    pushNotif('🔐', 'Mật khẩu đã đổi', 'Mật khẩu tài khoản đã được cập nhật.', 'settings.html');
    showSuccessBanner('Đã cập nhật mật khẩu!');
}

// ── Address list render ──
function renderAddresses() {
    const list      = getAddresses();
    const container = document.getElementById('addressList');
    if (!container) return;
    if (list.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = list.map((addr, i) => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}">
            <div class="address-card__icon">📍</div>
            <div class="address-card__body">
                <div class="address-card__name">${addr.name}</div>
                <div class="address-card__phone">${addr.phone}</div>
                <div class="address-card__detail">${addr.detail}</div>
                ${addr.isDefault ? '<div class="address-card__tags"><span class="address-tag default">Mặc định</span></div>' : ''}
            </div>
            <div class="address-card__actions">
                ${!addr.isDefault ? `<button class="btn-addr" onclick="setDefaultAddress(${i})">Mặc định</button>` : ''}
                <button class="btn-addr danger" onclick="deleteAddress(${i})">Xoá</button>
            </div>
        </div>
    `).join('');
}

function addAddress() {
    const name      = document.getElementById('addrName')?.value.trim();
    const phone     = document.getElementById('addrPhone')?.value.trim();
    const detail    = document.getElementById('addrDetail')?.value.trim();
    const isDefault = document.getElementById('addrDefault')?.checked;

    if (!name)   { showSuccessBanner('⚠️ Nhập họ tên người nhận!'); return; }
    if (!phone)  { showSuccessBanner('⚠️ Nhập số điện thoại!'); return; }
    if (!detail) { showSuccessBanner('⚠️ Nhập địa chỉ chi tiết!'); return; }

    const list = getAddresses();
    if (isDefault) list.forEach(a => a.isDefault = false);
    list.push({ name, phone, detail, isDefault });
    saveAddresses(list);

    document.getElementById('addrName').value      = '';
    document.getElementById('addrPhone').value     = '';
    document.getElementById('addrDetail').value    = '';
    document.getElementById('addrDefault').checked = false;

    renderAddresses();
    pushNotif('📍', 'Địa chỉ mới', `Đã thêm địa chỉ: ${detail.slice(0, 40)}...`, 'settings.html');
    showSuccessBanner('Đã thêm địa chỉ!');
}

function setDefaultAddress(index) {
    const list = getAddresses();
    list.forEach((a, i) => a.isDefault = (i === index));
    saveAddresses(list);
    renderAddresses();
    showSuccessBanner('Đã đặt địa chỉ mặc định!');
}

function deleteAddress(index) {
    if (!confirm('Xoá địa chỉ này?')) return;
    const list = getAddresses();
    list.splice(index, 1);
    saveAddresses(list);
    renderAddresses();
    showSuccessBanner('Đã xoá địa chỉ!');
}

// ── Notification settings ──
function loadNotifications() {
    const settings = getNotifSettings();
    const toggles  = ['notif-order-confirm', 'notif-shipping', 'notif-delivered', 'notif-promo', 'notif-health'];
    toggles.forEach(id => {
        const el = document.getElementById(id);
        if (el && settings[id] !== undefined) el.checked = settings[id];
    });
}

function saveNotifications() {
    const toggles  = ['notif-order-confirm', 'notif-shipping', 'notif-delivered', 'notif-promo', 'notif-health'];
    const settings = {};
    toggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) settings[id] = el.checked;
    });
    saveNotifSettings(settings);
    pushNotif('🔔', 'Cài đặt thông báo', 'Tuỳ chọn thông báo đã được lưu.', 'settings.html');
    showSuccessBanner('Đã lưu cài đặt thông báo!');
}

// ── Password toggle ──
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (!input) return;
            input.type      = input.type === 'password' ? 'text' : 'password';
            btn.textContent = input.type === 'password' ? '👁' : '🙈';
        });
    });
}

// ── Banner nhỏ ngay trong trang (thay toast) ──
function showSuccessBanner(msg) {
    const old = document.querySelector('.settings-banner');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'settings-banner';
    el.style.cssText = `
        position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
        background:#1a8c4e;color:white;
        border-radius:10px;padding:10px 20px;
        font-size:0.85rem;font-weight:600;
        box-shadow:0 4px 20px rgba(26,140,78,0.3);
        z-index:9999;white-space:nowrap;
        animation:fadeUp .3s ease;
    `;
    el.textContent = msg;
    if (!document.querySelector('#banner-style')) {
        const s = document.createElement('style');
        s.id = 'banner-style';
        s.textContent = '@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
        document.head.appendChild(s);
    }
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 2500);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    loadProfile();
    renderAddresses();
    loadNotifications();
    initPasswordToggles();
    document.getElementById('newPwd')?.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
});