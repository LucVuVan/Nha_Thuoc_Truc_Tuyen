// ===== index.js – NhàThuốc+ =====

const STATUS_LABELS = {
  pending:    'Chờ xác nhận',
  confirmed:  'Đã xác nhận',
  delivering: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
};
const STATUS_ICONS = {
  pending:    '🕐',
  confirmed:  '✅',
  delivering: '🚚',
  completed:  '🎉',
  cancelled:  '❌',
};

// ── Lấy key theo user hiện tại ──
function getUserKey(key) {
  try {
    const user = JSON.parse(localStorage.getItem('ntp_user') || 'null');
    const email = user?.email || 'guest';
    return key + '_' + email;
  } catch { return key + '_guest'; }
}

// ── Slider ──
const slides = [
  { tag:'🚀 Nhanh nhất Hà Nội', title:'Giao thuốc tận nhà<br/>trong <span>2 giờ</span>', desc:'Đặt thuốc online dễ dàng, nhận hàng nhanh chóng tại nhà', btn:'Mua ngay', link:'search.html', visual:'🚚', action: null },
  { tag:'💊 Flash Sale hôm nay', title:'Giảm đến <span>33%</span><br/>thuốc thông dụng', desc:'Hàng trăm sản phẩm giảm giá sâu, số lượng có hạn', btn:'Xem Flash Sale', link:'#flash-sale', visual:'⚡', action: null },
  { tag:'👨‍⚕️ Tư vấn miễn phí', title:'Dược sĩ đồng hành<br/><span>24/7</span> cùng bạn', desc:'Chat trực tiếp với dược sĩ, nhận tư vấn chuyên nghiệp ngay', btn:'Chat ngay', link:'#', visual:'👨‍⚕️', action: 'chat' },
];
let current = 0, dotEls = [];

function goTo(index) {
  current = (index + slides.length) % slides.length;
  const s = slides[current];
  const tagEl    = document.querySelector('.hero__tag');
  const titleEl  = document.querySelector('.hero__title');
  const descEl   = document.querySelector('.hero__desc');
  const visualEl = document.querySelector('.hero__visual');
  const btnEl    = document.querySelector('.btn-primary.btn-lg');
  if (tagEl)    tagEl.textContent    = s.tag;
  if (titleEl)  titleEl.innerHTML    = s.title;
  if (descEl)   descEl.textContent   = s.desc;
  if (visualEl) visualEl.textContent = s.visual;
  if (btnEl) {
    btnEl.textContent = s.btn;
    btnEl.href = s.link;
    if (s.action) {
      btnEl.setAttribute('data-action', s.action);
    } else {
      btnEl.removeAttribute('data-action');
    }
  }
  dotEls.forEach((dot, i) => dot.classList.toggle('active', i === current));
  const inner = document.querySelector('.hero__inner');
  if (inner) {
    inner.style.transition = 'none';
    inner.style.opacity = '0';
    inner.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      inner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      inner.style.opacity = '1';
      inner.style.transform = 'translateY(0)';
    }));
  }
}

function initSlider() {
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dotEls.push(dot);
    dot.addEventListener('click', () => goTo(i));
  });
  document.querySelector('.hero__nav-left')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.hero__nav-right')?.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-primary.btn-lg');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (action === 'chat') {
      e.preventDefault();
      if (typeof toggleChat === 'function') toggleChat();
      return;
    }
    const href = btn.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  goTo(0);
}

// ── Auth ──
function getUser() {
  try { return JSON.parse(localStorage.getItem('ntp_user') || 'null'); }
  catch { return null; }
}

function renderHeader() {
  const user    = getUser();
  const guestEl = document.getElementById('header-guest');
  const userEl  = document.getElementById('header-user');
  if (!guestEl || !userEl) return;
  if (user) {
    guestEl.style.display = 'none';
    userEl.style.display  = 'flex';
    const letter = (user.name || user.email || 'U').charAt(0).toUpperCase();
    const avatarLetter = document.getElementById('avatar-letter');
    const menuName     = document.getElementById('menu-name');
    const menuEmail    = document.getElementById('menu-email');
    if (avatarLetter) avatarLetter.textContent = letter;
    if (menuName)     menuName.textContent     = user.name  || 'Người dùng';
    if (menuEmail)    menuEmail.textContent    = user.email || '';
  } else {
    guestEl.style.display = 'block';
    userEl.style.display  = 'none';
  }
}

function logout() {
  // Xóa cart của user hiện tại trước khi logout
  localStorage.removeItem(getUserKey('ntp_cart'));
  localStorage.removeItem('ntp_user');
  window.location.href = 'login.html';
}

function toggleUserMenu() {
  document.getElementById('user-menu')?.classList.toggle('open');
}

// ── Cart ──
function getCart() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_cart')) || '[]'); }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(getUserKey('ntp_cart'), JSON.stringify(items));
  updateCartBadge();
}

function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function addToCart(id, name, price, img) {
  const items    = getCart();
  const existing = items.find(i => i.id === id);
  if (existing) {
    existing.qty = Math.min((existing.qty || 1) + 1, 10);
  } else {
    items.push({ id, name, price, qty: 1, img: img || '' });
  }
  saveCart(items);
  showToast('✅ Đã thêm "' + name + '" vào giỏ hàng');
}

// ══════════════════════════════════════
//  NOTIFICATION BELL – theo từng user
// ══════════════════════════════════════

function getOrders() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_orders')) || '[]'); }
  catch { return []; }
}
function getCustomNotifs() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_notifs')) || '[]'); }
  catch { return []; }
}
function getReadIds() {
  try { return JSON.parse(localStorage.getItem(getUserKey('ntp_notifs_read')) || '[]'); }
  catch { return []; }
}

function timeAgo(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length < 3) return dateStr;
  const d    = new Date(parts[2], parts[1] - 1, parts[0]);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  return days + ' ngày trước';
}

function buildNotifList() {
  const orders       = getOrders();
  const customNotifs = getCustomNotifs();

  const orderItems = orders.slice(0, 5).map(order => {
    const firstName = order.items?.[0]?.name || 'Sản phẩm';
    const desc      = order.items?.length > 1
      ? `${firstName} & ${order.items.length - 1} sản phẩm khác`
      : firstName;
    return {
      id:     'order_' + order.id,
      icon:   STATUS_ICONS[order.status] || '📦',
      iconBg: order.status === 'cancelled' ? 'cart' : 'order',
      title:  `Đơn #${order.id} – ${STATUS_LABELS[order.status] || order.status}`,
      desc,
      link:   'orders.html',
      time:   order.date,
    };
  });

  const customItems = customNotifs.slice(0, 5).map(n => ({
    id:     n.id,
    icon:   n.icon,
    iconBg: 'promo',
    title:  n.title,
    desc:   n.desc,
    link:   n.link || '#',
    time:   n.time,
    unread: n.unread,
  }));

  return [...customItems, ...orderItems];
}

function renderNotifs() {
  const allNotifs = buildNotifList();
  const readIds   = getReadIds();
  const list      = document.getElementById('notifList');
  const badge     = document.getElementById('notifBadge');
  if (!list) return;

  if (allNotifs.length === 0) {
    list.innerHTML = `
      <div class="notif-empty">
        <div class="notif-empty__icon">🔔</div>
        <div>Chưa có thông báo nào</div>
      </div>`;
    if (badge) badge.style.display = 'none';
    return;
  }

  const unreadCount = allNotifs.filter(n => !readIds.includes(n.id)).length;
  if (badge) {
    badge.textContent   = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  list.innerHTML = allNotifs.map(n => {
    const isUnread = !readIds.includes(n.id);
    return `
      <a class="notif-item ${isUnread ? 'notif-item--unread' : ''}" href="${n.link}">
        <div class="notif-item__icon ${n.iconBg}">${n.icon}</div>
        <div class="notif-item__body">
          <div class="notif-item__title">${n.title}</div>
          <div class="notif-item__desc">${n.desc}</div>
        </div>
        <div class="notif-item__time">${timeAgo(n.time)}</div>
      </a>`;
  }).join('');
}

function toggleNotif() {
  const dropdown = document.getElementById('notifDropdown');
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  document.getElementById('user-menu')?.classList.remove('open');
  dropdown.classList.toggle('open', !isOpen);
  if (!isOpen) renderNotifs();
}

function clearNotifs() {
  const allNotifs = buildNotifList();
  const allIds    = allNotifs.map(n => n.id);
  localStorage.setItem(getUserKey('ntp_notifs_read'), JSON.stringify(allIds));
  const customs = getCustomNotifs().map(n => ({ ...n, unread: false }));
  localStorage.setItem(getUserKey('ntp_notifs'), JSON.stringify(customs));
  renderNotifs();
}

document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.header-avatar-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('user-menu')?.classList.remove('open');
  }
  const notifWrap = document.getElementById('notifWrap');
  if (notifWrap && !notifWrap.contains(e.target)) {
    document.getElementById('notifDropdown')?.classList.remove('open');
  }
});

// ── Toast ──
function showToast(msg, duration) {
  duration = duration || 3000;
  const old = document.querySelector('.ntp-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'ntp-toast';
  el.style.cssText = [
    'position:fixed', 'bottom:88px', 'right:24px',
    'background:#fff', 'border:1px solid #e2ece7',
    'border-radius:12px', 'padding:12px 16px',
    'box-shadow:0 8px 32px rgba(26,140,78,0.15)',
    'max-width:300px', 'font-size:0.85rem',
    'display:flex', 'align-items:center', 'gap:8px',
    'z-index:999', 'animation:toastIn .3s ease',
    "font-family:'Be Vietnam Pro',sans-serif",
  ].join(';');
  el.innerHTML = '<span>' + msg + '</span>'
    + '<span style="margin-left:auto;cursor:pointer;color:#8aaa97" onclick="this.parentElement.remove()">✕</span>';
  if (!document.querySelector('#toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = '@keyframes toastIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(function() { if (el.parentNode) el.remove(); }, duration);
}

// ── Countdown ──
function initCountdown() {
  const el = document.querySelector('.countdown');
  if (!el) return;
  const end = Date.now() + (2 * 3600 + 45 * 60 + 30) * 1000;
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    el.textContent = h + ':' + m + ':' + s;
  }
  tick();
  setInterval(tick, 1000);
}

// ── Search ──
function initSearch() {
  document.querySelector('.search-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const q = e.target.querySelector('input').value.trim();
    if (q) window.location.href = 'search.html?q=' + encodeURIComponent(q);
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  updateCartBadge();
  initSlider();
  initCountdown();
  initSearch();
  renderNotifs();
});