// ===== login.js – NhàThuốc+ =====

// ── Tab switching ──
function switchTab(tab) {
  const isLogin = tab === 'login';
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', isLogin ? i === 0 : i === 1);
  });
  document.getElementById('panel-login').classList.toggle('active', isLogin);
  document.getElementById('panel-register').classList.toggle('active', !isLogin);
}

// ── Password toggle ──
function togglePw(id, btn) {
  const input = document.getElementById(id);
  const show  = input.type === 'password';
  input.type  = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁';
}

// ── Đăng nhập ──
function handleLogin(e) {
  e.preventDefault();
  const form  = e.target;
  const email = form.querySelector('input[type="text"]').value.trim();
  const pw    = form.querySelector('input[type="password"]').value;

  if (!email || !pw) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  // Lấy profile đã lưu theo email
  const savedProfile = JSON.parse(localStorage.getItem('ntp_profile_' + email) || '{}');
  const user = {
    ...savedProfile,
    email,
    name: savedProfile.name || email.split('@')[0],
  };

  // Xóa data của session cũ nếu đang login user khác
  const prevUser = JSON.parse(localStorage.getItem('ntp_user') || 'null');
  if (prevUser && prevUser.email !== email) {
    // Không xóa data của prevUser, chỉ clear cart chung (không key)
    localStorage.removeItem('ntp_cart');
    localStorage.removeItem('ntp_orders');
    localStorage.removeItem('ntp_notifs');
    localStorage.removeItem('ntp_notifs_read');
  }

  localStorage.setItem('ntp_user', JSON.stringify(user));
  window.location.href = 'index.html';
}

// ── Đăng ký ──
function handleRegister(e) {
  e.preventDefault();
  const form  = e.target;
  const name  = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const pw    = document.getElementById('pw-reg').value;

  if (!name || !email || !pw) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  // Xóa data chung cũ khi đăng ký user mới
  localStorage.removeItem('ntp_cart');
  localStorage.removeItem('ntp_orders');
  localStorage.removeItem('ntp_notifs');
  localStorage.removeItem('ntp_notifs_read');

  const user = { name, email };
  localStorage.setItem('ntp_user', JSON.stringify(user));
  localStorage.setItem('ntp_profile_' + email, JSON.stringify(user));
  window.location.href = 'index.html';
}

// ── Nếu đã login rồi thì redirect về trang chủ ──
(function () {
  try {
    const user = JSON.parse(localStorage.getItem('ntp_user') || 'null');
    if (user) window.location.replace('index.html');
  } catch { /* ignore */ }
})();