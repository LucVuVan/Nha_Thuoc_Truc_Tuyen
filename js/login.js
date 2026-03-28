/* ===== js/login.js ===== */

// Hàm chuyển tab Đăng nhập / Đăng ký
function switchTab(tabId) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    
    if (tabId === 'login') {
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
        document.getElementById('panel-login').classList.add('active');
    } else {
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
        document.getElementById('panel-register').classList.add('active');
    }
}

// Ẩn/hiện mật khẩu
function togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🔒';
    } else {
        input.type = 'password';
        btn.textContent = '👁';
    }
}

function handleLogin(e) {
    e.preventDefault(); 
    
    const email = document.querySelector('#panel-login input[type="text"]').value;
    const password = document.getElementById('pw-login').value;

    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
    }

    if (email === 'admin@nhathuoc.vn' && password === 'admin123') {
        const adminUser = {
            id: 'A01',
            name: 'Admin User',
            email: email,
            role: 'admin' 
        };
        localStorage.setItem('ntp_current_user', JSON.stringify(adminUser));
        alert('Đăng nhập Quản trị viên thành công!');
        window.location.href = 'index.html'; 
    } 
    else {
        const normalUser = {
            id: 'U01',
            name: 'Nguyễn Văn Khách',
            email: email,
            role: 'user'
        };
        localStorage.setItem('ntp_current_user', JSON.stringify(normalUser));
        alert('Đăng nhập thành công!');
        // Chuyển về trang chủ
        window.location.href = 'index.html'; 
    }
}

// Xử lý Đăng ký (Giả lập)
function handleRegister(e) {
    e.preventDefault();
    alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
    switchTab('login');
}