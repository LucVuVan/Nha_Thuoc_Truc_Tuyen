/* ===== admin-orders.js ===== */

// Dữ liệu mẫu — khi localStorage có đơn thật sẽ ưu tiên hiển thị
const SAMPLE_ORDERS = [
  {
    id: 'DH-2024-1847', date: '15/03/2026', time: '14:30',
    status: 'pending', amount: 280000, payMethod: 'COD',
    customer: { name: 'Nguyễn Văn A', phone: '0912345678', address: '123 Nguyễn Huệ, Q1, TP.HCM' },
    products: ['Paracetamol 500mg x2', 'Vitamin C 1000mg x1'],
    note: 'Giao giờ hành chính',
  },
  {
    id: 'DH-2024-1846', date: '15/03/2026', time: '13:15',
    status: 'processing', amount: 255000, payMethod: 'Chuyển khoản',
    customer: { name: 'Trần Thị B', phone: '0987654321', address: '45 Lê Lợi, Q1, TP.HCM' },
    products: ['Vitamin C 1000mg x1', 'Omega-3 Fish Oil x1'],
    note: '',
  },
  {
    id: 'DH-2024-1845', date: '15/03/2026', time: '11:00',
    status: 'completed', amount: 320000, payMethod: 'COD',
    customer: { name: 'Lê Văn C', phone: '0901234567', address: '78 Hai Bà Trưng, Q3, TP.HCM' },
    products: ['Amoxicillin 500mg x2', 'Cetirizine 10mg x1'],
    note: '',
  },
  {
    id: 'DH-2024-1844', date: '15/03/2026', time: '09:30',
    status: 'delivering', amount: 580000, payMethod: 'Ví điện tử',
    customer: { name: 'Phạm Thị D', phone: '0923456789', address: '12 Đinh Tiên Hoàng, Q1, TP.HCM' },
    products: ['Omeprazole 20mg x2', 'Aspirin 100mg x1'],
    note: 'Để trước cửa nếu không có người',
  },
  {
    id: 'DH-2024-1843', date: '14/03/2026', time: '16:45',
    status: 'cancelled', amount: 250000, payMethod: 'COD',
    customer: { name: 'Hoàng Văn E', phone: '0934567890', address: '56 Nguyễn Thị Minh Khai, Q3, TP.HCM' },
    products: ['Ibuprofen 400mg x2'],
    note: '',
  },
];

const STATUS_CONFIG = {
  pending:    { label: 'Chờ xác nhận', cls: 'pending',   dot: '#f59e0b' },
  processing: { label: 'Đang xử lý',   cls: 'delivering', dot: '#3b82f6' }, // Dùng chung style delivering
  delivering: { label: 'Đang giao',    cls: 'delivering', dot: '#0369a1' },
  completed:  { label: 'Hoàn thành',   cls: 'completed',  dot: '#15803d' },
  cancelled:  { label: 'Đã hủy',       cls: 'cancelled',  dot: '#dc2626' },
};

let currentFilter = 'all';

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

// ── Lấy đơn hàng (localStorage ưu tiên, fallback dữ liệu mẫu) ──
function getOrders() {
  const all = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ntp_orders_')) {
      try { all.push(...JSON.parse(localStorage.getItem(key) || '[]')); }
      catch { /* bỏ qua */ }
    }
  }
  
  if (all.length > 0) {
    return all.sort((a, b) => (b.id || '').localeCompare(a.id || '')).map(o => ({
      id:        o.id,
      date:      o.date,
      time:      '',
      status:    o.status || 'pending',
      amount:    o.total || 0,
      payMethod: o.method === 'ewallet' ? 'Ví điện tử' : 'COD',
      customer:  { name: o.name || '—', phone: o.phone || '—', address: o.addr || '—' },
      products:  (o.items || []).map(it => `${it.name} x${it.qty}`),
      note:      o.note || '',
    }));
  }
  return SAMPLE_ORDERS;
}

function saveOrderStatus(id, newStatus) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ntp_orders_')) {
      try {
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex !== -1) {
          orders[orderIndex].status = newStatus;
          localStorage.setItem(key, JSON.stringify(orders));
          return;
        }
      } catch { /* bỏ qua */ }
    }
  }
}

// ── Render ──
function renderOrders() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  let orders = getOrders();
  
  // Update stat numbers
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('statPending',    orders.filter(o => o.status === 'pending').length);
  setEl('statProcessing', orders.filter(o => o.status === 'processing').length);
  setEl('statDelivering', orders.filter(o => o.status === 'delivering').length);
  setEl('statCompleted',  orders.filter(o => o.status === 'completed').length);

  // Lọc theo Tab
  if (currentFilter !== 'all') {
    orders = orders.filter(o => o.status === currentFilter);
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;background:var(--white);border-radius:var(--radius-lg);border:1px solid var(--border);">
        <i class="fa-solid fa-cart-flatbed" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:12px;display:block;"></i>
        <div style="font-weight:700;margin-bottom:6px;">Không có đơn hàng nào</div>
        <div style="font-size:0.82rem;color:var(--text-muted);">Thử chọn bộ lọc khác</div>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(order => renderOrderBlock(order)).join('');
}

function renderOrderBlock(order) {
  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const productList = order.products.map(p => `<div style="font-size:0.78rem;color:var(--text-muted);">• ${p}</div>`).join('');
  const noteHtml = order.note
    ? `<div style="padding:0 20px 14px"><div style="background:#fefce8;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:8px 12px;font-size:0.8rem;color:#92400e;">Ghi chú: ${order.note}</div></div>`
    : '';

  const actions = {
    pending: `
      <button class="btn btn-ghost btn-sm" onclick="viewOrder('${order.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
      <button class="btn btn-primary btn-sm" onclick="changeStatus('${order.id}','processing')">Xác nhận đơn</button>
      <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fecaca;" onclick="changeStatus('${order.id}','cancelled')">Hủy đơn</button>`,
    processing: `
      <button class="btn btn-ghost btn-sm" onclick="viewOrder('${order.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
      <button class="btn btn-primary btn-sm" onclick="changeStatus('${order.id}','delivering')">Giao cho shipper</button>
      <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fecaca;" onclick="changeStatus('${order.id}','cancelled')">Hủy đơn</button>`,
    delivering: `
      <button class="btn btn-ghost btn-sm" onclick="viewOrder('${order.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
      <button class="btn btn-primary btn-sm" onclick="changeStatus('${order.id}','completed')">Xác nhận đã giao</button>`,
    completed: `
      <button class="btn btn-ghost btn-sm" onclick="viewOrder('${order.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>`,
    cancelled: `
      <button class="btn btn-ghost btn-sm" onclick="viewOrder('${order.id}')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>`,
  };

  return `
    <div class="order-block" id="order-${order.id}">
      <div class="order-block__header">
        <div>
          <div class="order-block__id">${order.id}</div>
          <div class="order-block__date">${order.date}${order.time ? ' ' + order.time : ''}</div>
        </div>
        <span class="status-badge ${st.cls}">${st.label}</span>
        <div style="text-align:right;margin-left:auto;">
          <div class="order-block__amount">${formatPrice(order.amount)}</div>
          <div class="order-block__pay">${order.payMethod}</div>
        </div>
      </div>
      <div class="order-block__body">
        <div>
          <div class="order-block__info-label">Thông tin khách hàng</div>
          <div class="order-block__info-val">${order.customer.name}</div>
          <div class="order-block__info-sub">${order.customer.phone}</div>
          <div class="order-block__info-sub">${order.customer.address}</div>
        </div>
        <div>
          <div class="order-block__info-label">Sản phẩm</div>
          ${productList}
        </div>
      </div>
      ${noteHtml}
      <div class="order-block__footer">${actions[order.status] || actions.completed}</div>
    </div>`;
}

// ── Đổi trạng thái ──
function changeStatus(id, newStatus) {
  // Lưu vào localStorage nếu có
  saveOrderStatus(id, newStatus);

  // Cập nhật trong SAMPLE_ORDERS (nếu đang dùng data mẫu)
  const sample = SAMPLE_ORDERS.find(o => o.id === id);
  if (sample) sample.status = newStatus;

  renderOrders();
  showToast(`✅ Đã cập nhật trạng thái đơn ${id}`);
}

// ── Xem chi tiết ──
function viewOrder(id) {
  const order = getOrders().find(o => o.id === id);
  if (!order) return;
  const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  alert(`📦 Đơn hàng: ${order.id}\n👤 Khách: ${order.customer.name}\n📞 SĐT: ${order.customer.phone}\n📍 Địa chỉ: ${order.customer.address}\n\n💊 Sản phẩm:\n${order.products.join('\n')}\n\n💵 Tổng tiền: ${formatPrice(order.amount)}\n🚦 Trạng thái: ${st.label}`);
}

// ── Filter tabs ──
function setFilter(el, filter) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentFilter = filter;
  renderOrders();
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

document.addEventListener('DOMContentLoaded', renderOrders);