/* ===== js/admin/admin-auth.js ===== */
(function () {
    const userStr = localStorage.getItem('ntp_current_user');
    
    if (!userStr) {
        alert('Truy cập bị từ chối! Bạn cần đăng nhập để tiếp tục.');
        // Sửa thành lùi 1 cấp
        window.location.replace('../login.html');
        return;
    }

    try {
        const currentUser = JSON.parse(userStr);
        if (currentUser.role !== 'admin') {
            alert('Cảnh báo bảo mật: Bạn không có quyền truy cập trang Quản trị viên!');
            // Sửa thành lùi 1 cấp
            window.location.replace('../index.html'); 
        }
    } catch (e) {
        localStorage.removeItem('ntp_current_user');
        window.location.replace('../login.html');
    }
})();
