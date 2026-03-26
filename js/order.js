// ===== orders.js – NhàThuốc+ =====

const STATUS_MAP = {
  pending:    { label: 'Chờ xác nhận', cls: 'pending'    },
  confirmed:  { label: 'Đã xác nhận',  cls: 'confirmed'  },
  delivering: { label: 'Đang giao',    cls: 'delivering' },
  completed:  { label: 'Hoàn thành',   cls: 'completed'  },
  cancelled:  { label: 'Đã hủy',       cls: 'cancelled'  },
};

// ── Key theo user ──
function getUserKey(key) {
  try {
    const user = JSON.parse(localStorage.getItem('ntp_user') || 'null');
    const email = user?.email || 'guest';
    return key + '_' + email;
  } catch { return key + '_guest'; }
}

function getOrders() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_orders')) || '[]'); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem(getUserKey('ntp_orders'), JSON.stringify(orders));
}
function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// ── Tracking bar ──
function renderTrack(status) {
  const stepLabels = ['Đặt hàng', 'Xác nhận', 'Đang giao', 'Nhận hàng'];
  const stepKeys   = ['pending', 'confirmed', 'delivering', 'completed'];
  const curIdx     = stepKeys.indexOf(status);
  return `
    <div class="order-track">
      ${stepKeys.map((key, i) => {
        const cls  = i < curIdx ? 'done' : i === curIdx ? 'active' : '';
        const line = i < stepKeys.length - 1
          ? `<div class="order-track__line ${i < curIdx ? 'done' : ''}"></div>` : '';
        return `<div class="order-track__step ${cls}">
          <div class="order-track__dot"></div>
          <span>${stepLabels[i]}</span>
        </div>${line}`;
      }).join('')}
    </div>`;
}

// ── Thumbnails ──
function renderThumbs(items) {
  const visible = items.slice(0, 3);
  const more    = items.length - 3;
  let html = visible.map(item =>
    item.img
      ? `<div class="order-thumb"><img src="${item.img}" alt="${item.name}" /></div>`
      : `<div class="order-thumb" title="${item.name}">💊</div>`
  ).join('');
  if (more > 0) html += `<div class="order-thumb-more">+${more}</div>`;
  return html;
}

// ── Action buttons ──
function renderActions(order) {
  const { id, status } = order;
  switch (status) {
    case 'pending':
      return `<button class="btn-cancel" onclick="event.stopPropagation();cancelOrder('${id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Hủy đơn
      </button>`;
    case 'delivering':
      return `<button class="btn-track" onclick="event.stopPropagation();showToast('📦 Đơn hàng #${id} đang trên đường giao!')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        Theo dõi
      </button>`;
    case 'completed':
      return `
        <button class="btn-review" onclick="event.stopPropagation();showToast('⭐ Cảm ơn bạn đã đánh giá!')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          Đánh giá
        </button>
        <button class="btn-rebuy" onclick="event.stopPropagation();rebuyOrder('${id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Mua lại
        </button>`;
    default:
      return '';
  }
}

// ── Render 1 card ──
function renderCard(order) {
  const s           = STATUS_MAP[order.status] || STATUS_MAP.pending;
  const showTrack   = ['pending', 'confirmed', 'delivering'].includes(order.status);
  const totalItems  = order.items.reduce((sum, i) => sum + i.qty, 0);
  const firstName   = order.items[0]?.name || 'Sản phẩm';
  const displayName = order.items.length > 1
    ? `${firstName} & ${order.items.length - 1} sản phẩm khác`
    : firstName;

  return `
    <div class="order-card" data-status="${order.status}" data-id="${order.id}" onclick="openDetail('${order.id}')">
      <div class="order-card__top">
        <div class="order-card__left">
          <span class="order-card__id">#${order.id}</span>
          <span class="status-pill ${s.cls}">
            <span class="status-dot"></span>${s.label}
          </span>
        </div>
        <span class="order-card__date">${order.date}</span>
      </div>
      <div class="order-card__products">
        ${renderThumbs(order.items)}
        <div class="order-card__info">
          <div class="order-card__name">${displayName}</div>
          <div class="order-card__count">${totalItems} sản phẩm · ${order.method === 'ewallet' ? 'Ví điện tử' : 'Tiền mặt'}</div>
        </div>
        <div class="order-card__total">
          <div class="order-card__total-amount">${formatPrice(order.total)}</div>
          <div class="order-card__total-label">Tổng tiền</div>
        </div>
      </div>
      ${showTrack ? renderTrack(order.status) : ''}
      <div class="order-card__footer">
        ${renderActions(order)}
        <span class="order-card__detail-hint">Xem chi tiết →</span>
      </div>
    </div>`;
}

// ── Render danh sách ──
function renderOrders(filter = 'all') {
  const orders   = getOrders();
  const list     = document.getElementById('orderList');
  const empty    = document.getElementById('ordersEmpty');
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  if (filtered.length === 0) {
    list.innerHTML = ''; empty.style.display = 'block';
  } else {
    list.innerHTML = filtered.map(renderCard).join('');
    empty.style.display = 'none';
  }
  updateSummary(orders);
}

function updateSummary(orders) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('sum-total',      orders.length);
  set('sum-delivering', orders.filter(o => o.status === 'delivering').length);
  set('sum-completed',  orders.filter(o => o.status === 'completed').length);
  set('sum-pending',    orders.filter(o => o.status === 'pending').length);
}

// ── Modal chi tiết ──
function openDetail(id) {
  const orders = getOrders();
  const order  = orders.find(o => o.id === id);
  if (!order) return;
  const s = STATUS_MAP[order.status] || STATUS_MAP.pending;

  document.getElementById('od-id').textContent   = '#' + order.id;
  document.getElementById('od-date').textContent = order.date;

  const pill = document.getElementById('od-status-pill');
  pill.className = 'status-pill ' + s.cls;
  document.getElementById('od-status-text').textContent = s.label;

  const showTrack = !['cancelled'].includes(order.status);
  document.getElementById('od-track').innerHTML = showTrack ? renderTrack(order.status) : '';

  document.getElementById('od-items').innerHTML = order.items.map(item => `
    <div class="od-item">
      ${item.img
        ? `<img class="od-item__img" src="${item.img}" alt="${item.name}" />`
        : `<div class="od-item__img od-item__img--emoji">💊</div>`}
      <div class="od-item__info">
        <div class="od-item__name">${item.name}</div>
        <div class="od-item__qty">Số lượng: ${item.qty}</div>
      </div>
      <div class="od-item__price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  document.getElementById('od-name').textContent   = order.name || '—';
  document.getElementById('od-phone').textContent  = order.phone || '—';
  document.getElementById('od-addr').textContent   = order.addr || '—';
  document.getElementById('od-method').textContent = order.method === 'ewallet' ? '💳 Ví điện tử' : '💵 Tiền mặt (COD)';

  const noteRow = document.getElementById('od-note-row');
  if (order.note) {
    document.getElementById('od-note').textContent = order.note;
    noteRow.style.display = '';
  } else {
    noteRow.style.display = 'none';
  }

  document.getElementById('od-subtotal').textContent = formatPrice(order.subtotal);
  document.getElementById('od-shipping').textContent  = formatPrice(order.shipping);
  document.getElementById('od-total').textContent     = formatPrice(order.total);

  let footerHtml = '';
  if (order.status === 'pending') {
    footerHtml = `<button class="btn-cancel btn-full-modal" onclick="cancelOrderFromModal('${id}')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      Hủy đơn hàng
    </button>`;
  } else if (order.status === 'completed') {
    footerHtml = `
      <button class="btn-review" onclick="showToast('⭐ Cảm ơn bạn đã đánh giá!')">Đánh giá</button>
      <button class="btn-rebuy" onclick="rebuyOrder('${id}');closeDetail()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Mua lại
      </button>`;
  }
  document.getElementById('od-footer').innerHTML = footerHtml;

  document.getElementById('order-detail-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  document.getElementById('order-detail-modal').style.display = 'none';
  document.body.style.overflow = '';
}
function closeDetailIfBackdrop(e) {
  if (e.target.id === 'order-detail-modal') closeDetail();
}

function cancelOrderFromModal(id) {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
  const orders = getOrders();
  const order  = orders.find(o => o.id === id);
  if (!order) return;
  order.status = 'cancelled';
  saveOrders(orders);
  closeDetail();
  renderOrders(currentFilter);
  showToast('✅ Đã hủy đơn hàng #' + id);
}

function cancelOrder(id) {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
  const orders = getOrders();
  const order  = orders.find(o => o.id === id);
  if (!order) return;
  order.status = 'cancelled';
  saveOrders(orders);
  renderOrders(currentFilter);
  showToast('✅ Đã hủy đơn hàng #' + id);
}

// ── Mua lại – dùng cart theo user ──
function rebuyOrder(id) {
  const orders = getOrders();
  const order  = orders.find(o => o.id === id);
  if (!order) return;
  const cartKey = getUserKey('ntp_cart');
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  order.items.forEach(item => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) existing.qty += item.qty;
    else cart.push({ ...item });
  });
  localStorage.setItem(cartKey, JSON.stringify(cart));
  showToast('🛒 Đã thêm ' + order.items.length + ' sản phẩm vào giỏ hàng!');
}

// ── Filter tabs ──
let currentFilter = 'all';
document.querySelectorAll('.order-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderOrders(currentFilter);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDetail();
});

// ── Toast ──
function showToast(msg) {
  const old = document.querySelector('.ntp-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'ntp-toast';
  el.style.cssText = 'position:fixed;bottom:88px;right:24px;background:#fff;border:1px solid #e2ece7;border-radius:12px;padding:12px 16px;box-shadow:0 8px 32px rgba(26,140,78,0.15);max-width:300px;font-size:0.85rem;display:flex;align-items:center;gap:8px;z-index:9999;';
  el.innerHTML = '<span>' + msg + '</span>';
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderOrders('all');
  const orders = getOrders();
  const hasDelivering = orders.some(o => o.status === 'delivering');
  const toast = document.getElementById('deliveryToast');
  if (toast && !hasDelivering) toast.style.display = 'none';
  setTimeout(() => {
    const t = document.getElementById('deliveryToast');
    if (t) t.style.display = 'none';
  }, 6000);
});