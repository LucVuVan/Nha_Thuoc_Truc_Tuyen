// ===== checkout.js – NhàThuốc+ =====

const SHIPPING_FEE = 25000;

// ── Key theo user ──
function getUserKey(key) {
  try {
    const user = JSON.parse(localStorage.getItem('ntp_user') || 'null');
    const email = user?.email || 'guest';
    return key + '_' + email;
  } catch { return key + '_guest'; }
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_cart')) || '[]'); }
  catch { return []; }
}

function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// ── Render order summary ──
function renderOrderSummary() {
  const items = getCart();
  if (items.length === 0) { window.location.href = 'cart.html'; return; }

  const headerEl = document.getElementById('order-header');
  if (headerEl) headerEl.textContent = `🧾 Đơn hàng (${items.length} sản phẩm)`;

  const listEl = document.getElementById('order-items');
  if (listEl) {
    listEl.innerHTML = items.map(item => `
      <div class="checkout-order__item">
        <img class="checkout-order__img"
          src="${item.img || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop'}"
          alt="${item.name}" />
        <div>
          <div class="checkout-order__item-name">${item.name}</div>
          <div class="checkout-order__item-meta">SL: ${item.qty}</div>
        </div>
        <div class="checkout-order__item-price">${formatPrice(item.price * item.qty)}</div>
      </div>
    `).join('');
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total    = subtotal + SHIPPING_FEE;
  const el = (id) => document.getElementById(id);
  if (el('order-subtotal')) el('order-subtotal').textContent = formatPrice(subtotal);
  if (el('order-shipping')) el('order-shipping').textContent = formatPrice(SHIPPING_FEE);
  if (el('order-total'))    el('order-total').textContent    = formatPrice(total);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-badge-header');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
}

// ── Payment ──
function selectPayment(label) {
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  label.classList.add('selected');
}
function getSelectedMethod() {
  const selected = document.querySelector('.payment-option.selected');
  return selected ? selected.dataset.method : 'cod';
}

// ── QR modal ──
let qrTimer = null;
function openQR() {
  const modal = document.getElementById('qr-modal');
  const total = document.getElementById('order-total')?.textContent || '';
  document.getElementById('qr-total').textContent = total;
  modal.style.display = 'flex';
  let seconds = 300;
  clearInterval(qrTimer);
  qrTimer = setInterval(() => {
    seconds--;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    const el = document.getElementById('qr-countdown');
    if (el) el.textContent = `${m}:${s}`;
    if (seconds <= 0) { clearInterval(qrTimer); closeQR(); showToast('⏰ Mã QR đã hết hạn, vui lòng thử lại.'); }
  }, 1000);
}
function closeQR() {
  document.getElementById('qr-modal').style.display = 'none';
  clearInterval(qrTimer);
}
function confirmQR() { closeQR(); finishOrder(); }

// ── Đặt hàng ──
function placeOrder() {
  const name  = document.getElementById('input-name')?.value.trim();
  const phone = document.getElementById('input-phone')?.value.trim();
  const addr  = document.getElementById('input-address')?.value.trim();
  const note  = document.getElementById('input-note')?.value.trim();

  if (!name)  { alert('Vui lòng nhập họ và tên!');         document.getElementById('input-name')?.focus();    return; }
  if (!phone) { alert('Vui lòng nhập số điện thoại!');     document.getElementById('input-phone')?.focus();   return; }
  if (!addr)  { alert('Vui lòng nhập địa chỉ giao hàng!'); document.getElementById('input-address')?.focus(); return; }

  const method   = getSelectedMethod();
  const items    = getCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  window._pendingOrder = { name, phone, addr, note, method, items, subtotal, shipping: SHIPPING_FEE, total: subtotal + SHIPPING_FEE };

  if (method === 'ewallet') openQR();
  else finishOrder();
}

function finishOrder() {
  const order = window._pendingOrder;
  if (!order) return;

  // Lưu đơn hàng theo user
  const orders = JSON.parse(localStorage.getItem(getUserKey('ntp_orders')) || '[]');
  const newId  = 'DH-' + Date.now().toString().slice(-6);
  const newOrder = {
    id: newId, date: new Date().toLocaleDateString('vi-VN'),
    status: 'pending', name: order.name, phone: order.phone,
    addr: order.addr, note: order.note, method: order.method,
    items: order.items, subtotal: order.subtotal,
    shipping: order.shipping, total: order.total,
  };
  orders.unshift(newOrder);
  localStorage.setItem(getUserKey('ntp_orders'), JSON.stringify(orders));

  // Xóa cart của user
  localStorage.removeItem(getUserKey('ntp_cart'));

  window.location.href = 'order-confirm.html';
}

// ── Toast ──
function showToast(msg) {
  const old = document.querySelector('.ntp-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'ntp-toast';
  el.style.cssText = 'position:fixed;bottom:88px;right:24px;background:#fff;border:1px solid #e2ece7;border-radius:12px;padding:12px 16px;box-shadow:0 8px 32px rgba(26,140,78,0.15);max-width:300px;font-size:0.85rem;display:flex;align-items:center;gap:8px;z-index:999;';
  el.innerHTML = '<span>' + msg + '</span>';
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', renderOrderSummary);