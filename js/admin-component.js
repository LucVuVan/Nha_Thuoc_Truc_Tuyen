/**
 * admin-components.js
 * Inject sidebar trực tiếp — không dùng fetch, hoạt động cả file:// lẫn server.
 * Mỗi trang chỉ cần:
 * <div id="sidebar-placeholder"></div>
 * <script src="../../js/admin-components.js"></script>
 */

(function () {
  const SIDEBAR_HTML = `
<aside class="admin-sidebar">
  <div class="admin-sidebar__brand">
    <a href="../index.html" style="text-decoration: none; display: block; cursor: pointer;">
        <div class="admin-sidebar__brand-name">NhàThuốc+</div>
    </a>    
    <div class="admin-sidebar__brand-sub">Admin Dashboard</div>
  </div>
  <nav class="admin-sidebar__nav">
    <a href="dashboard.html" class="admin-nav-item" data-page="dashboard">
      <i class="fa-solid fa-gauge-high"></i> Dashboard
    </a>
    <a href="products.html" class="admin-nav-item" data-page="products">
      <i class="fa-solid fa-box-open"></i> Sản phẩm &amp; Kho
    </a>
    <a href="categories.html" class="admin-nav-item" data-page="categories">
      <i class="fa-solid fa-layer-group"></i> Danh mục
    </a>
    <a href="orders.html" class="admin-nav-item" data-page="orders">
      <i class="fa-solid fa-cart-flatbed"></i> Đơn hàng
    </a>
    <a href="livechat.html" class="admin-nav-item" data-page="livechat">
      <i class="fa-solid fa-comments"></i> Tư vấn Live Chat
    </a>
    <a href="statistics.html" class="admin-nav-item" data-page="statistics">
      <i class="fa-solid fa-chart-line"></i> Thống kê
    </a>
    <a href="chatbot.html" class="admin-nav-item" data-page="chatbot">
      <i class="fa-solid fa-robot"></i> Cài đặt Chatbot
    </a>
  </nav>
  <div class="admin-sidebar__footer">
    <div class="admin-sidebar__avatar">A</div>
    <div>
      <div class="admin-sidebar__user-name">Admin User</div>
      <div class="admin-sidebar__user-email">admin@nhathuoc.vn</div>
    </div>
  </div>
</aside>`;

  // Inject vào placeholder
  const placeholder = document.getElementById('sidebar-placeholder');
  if (!placeholder) return;
  placeholder.outerHTML = SIDEBAR_HTML;

  // Set active theo tên file hiện tại
  const page = location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
  document.querySelectorAll('.admin-nav-item').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });
})();