// ===== NhàThuốc+ Main JavaScript =====

// ---- Cart State ----
const Cart = {
  items: JSON.parse(localStorage.getItem('ntp_cart') || '[]'),

  save() {
    localStorage.setItem('ntp_cart', JSON.stringify(this.items));
    this.updateBadge();
  },

  add(product, qty = 1) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      this.items.push({ ...product, qty });
    }
    this.save();
    showToast(`✅ Đã thêm "${product.name}" vào giỏ hàng`);
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  updateQty(id, qty) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      if (qty <= 0) {
        this.remove(id);
      } else {
        item.qty = Math.min(qty, 10);
        this.save();
      }
    }
  },

  clear() {
    this.items = [];
    this.save();
  },

  get count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  get subtotal() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.header__cart-badge');
    badges.forEach(b => {
      b.textContent = this.count;
      b.style.display = this.count > 0 ? 'flex' : 'none';
    });
  }
};

// ---- Format currency ----
function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// ---- Toast ----
function showToast(msg, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast__icon">💬</span>
    <span>${msg}</span>
    <span class="toast__close" onclick="this.parentElement.remove()">✕</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ---- Password toggle ----
function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-password-wrap').querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '🙈';
      } else {
        input.type = 'password';
        btn.innerHTML = '👁';
      }
    });
  });
}

// ---- Qty controls ----
function initQtyControls() {
  document.querySelectorAll('.qty-control').forEach(control => {
    const input = control.querySelector('input');
    const btnMinus = control.querySelector('[data-action="minus"]');
    const btnPlus = control.querySelector('[data-action="plus"]');
    const max = parseInt(input.getAttribute('max') || 10);

    btnMinus?.addEventListener('click', () => {
      const val = parseInt(input.value) - 1;
      if (val >= 1) input.value = val;
      input.dispatchEvent(new Event('change'));
    });

    btnPlus?.addEventListener('click', () => {
      const val = parseInt(input.value) + 1;
      if (val <= max) input.value = val;
      input.dispatchEvent(new Event('change'));
    });
  });
}

// ---- Tabs ----
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.target;
        if (target) {
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          const content = document.getElementById(target);
          if (content) content.classList.add('active');
        }
      });
    });
  });
}

// ---- Toggle filter ----
// ✅ FIX: bỏ qua #toggle-instock vì search.js tự xử lý
function initToggles() {
  document.querySelectorAll('.toggle').forEach(toggle => {
    if (toggle.id === 'toggle-instock') return; // search.js lo cái này
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
    });
  });
}

// ---- Flash sale countdown ----
function initCountdown(endMs) {
  const el = document.querySelector('.countdown');
  if (!el) return;

  function update() {
    const now = Date.now();
    const diff = Math.max(0, endMs - now);
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }

  update();
  setInterval(update, 1000);
}

// ---- Search (chỉ xử lý form submit, KHÔNG can thiệp vào search page) ----
function initSearch() {
  const form = document.querySelector('.search-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim();
    if (q) {
      window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
  });
  // ✅ FIX: bỏ đoạn xử lý search page ở đây — search.js tự lo
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initPasswordToggles();
  initQtyControls();
  initTabs();
  initToggles();
  initSearch();

  // Flash sale countdown: chỉ chạy nếu có .countdown trên trang
  const end = Date.now() + (2 * 3600 + 45 * 60 + 30) * 1000;
  initCountdown(end);
});