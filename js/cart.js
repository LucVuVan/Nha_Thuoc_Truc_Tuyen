// ===== cart.js – NhàThuốc+ =====

const SHIPPING_FEE = 25000;

// ── Lấy key theo user hiện tại ──
function getUserKey(key) {
  try {
    const user = JSON.parse(localStorage.getItem('ntp_user') || 'null');
    const email = user?.email || 'guest';
    return key + '_' + email;
  } catch { return key + '_guest'; }
}

// ── Đọc/ghi cart ──
function getCart() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_cart')) || '[]'); }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(getUserKey('ntp_cart'), JSON.stringify(items));
}

// ── Render toàn bộ trang cart ──
function renderCart() {
  const items    = getCart();
  const wrapper  = document.getElementById('cart-items-wrapper');
  const emptyEl  = document.getElementById('cart-empty');
  const layoutEl = document.getElementById('cart-layout');

  if (items.length === 0) {
    if (emptyEl)  emptyEl.style.display  = 'block';
    if (layoutEl) layoutEl.style.display = 'none';
    updateSummary(0);
    updateHeaderBadge(0);
    return;
  }

  if (emptyEl)  emptyEl.style.display  = 'none';
  if (layoutEl) layoutEl.style.display = 'grid';

  if (!wrapper) return;

  wrapper.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img class="cart-item__img"
        src="${item.img || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop'}"
        alt="${item.name}" />
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price-current">${formatPrice(item.price)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-control__btn" onclick="changeQty(${item.id}, -1)">−</button>
        <input type="number" value="${item.qty}" min="1" max="10"
          onchange="setQty(${item.id}, parseInt(this.value))" />
        <button class="qty-control__btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <div class="cart-item__subtotal">
        <div class="cart-item__subtotal-label">Thành tiền</div>
        <div class="cart-item__subtotal-value">${formatPrice(item.price * item.qty)}</div>
      </div>
      <button class="cart-item__remove" onclick="removeItem(${item.id})" title="Xóa">🗑</button>
    </div>
  `).join('');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  updateSummary(subtotal);
  updateHeaderBadge(items.reduce((sum, i) => sum + i.qty, 0));
}

// ── Cập nhật summary ──
function updateSummary(subtotal) {
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const total    = subtotal + shipping;
  const el = (id) => document.getElementById(id);
  if (el('summary-subtotal')) el('summary-subtotal').textContent = formatPrice(subtotal);
  if (el('summary-shipping')) el('summary-shipping').textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
  if (el('summary-total'))    el('summary-total').textContent    = formatPrice(total);
}

// ── Cập nhật badge header ──
function updateHeaderBadge(count) {
  const badge = document.getElementById('cart-badge-header');
  if (badge) {
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ── Actions ──
function changeQty(id, delta) {
  const items = getCart();
  const item  = items.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.min(Math.max(1, item.qty + delta), 10);
  saveCart(items);
  renderCart();
}

function setQty(id, qty) {
  if (isNaN(qty) || qty < 1) qty = 1;
  if (qty > 10) qty = 10;
  const items = getCart();
  const item  = items.find(i => i.id === id);
  if (!item) return;
  item.qty = qty;
  saveCart(items);
  renderCart();
}

function removeItem(id) {
  const items = getCart().filter(i => i.id !== id);
  saveCart(items);
  renderCart();
  showToast('🗑 Đã xóa sản phẩm khỏi giỏ hàng');
}

function clearCart() {
  if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
  saveCart([]);
  renderCart();
}

// ── Helpers ──
function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function showToast(msg) {
  const old = document.querySelector('.ntp-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'ntp-toast';
  el.style.cssText = 'position:fixed;bottom:88px;right:24px;background:#fff;border:1px solid #e2ece7;border-radius:12px;padding:12px 16px;box-shadow:0 8px 32px rgba(26,140,78,0.15);max-width:300px;font-size:0.85rem;display:flex;align-items:center;gap:8px;z-index:999;';
  el.innerHTML = '<span>' + msg + '</span><span style="margin-left:auto;cursor:pointer;color:#8aaa97" onclick="this.parentElement.remove()">✕</span>';
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', renderCart);