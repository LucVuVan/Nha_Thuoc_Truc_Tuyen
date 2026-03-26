// ===== search.js – NhàThuốc+ =====

const PRODUCTS = [
  // --- Thuốc không kê đơn ---
  { id: 50, name: 'Paracetamol 500mg',      ingredient: 'Paracetamol',                   price: 25000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'DHG Pharma',    sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop' },
  { id: 51, name: 'Ibuprofen 400mg',        ingredient: 'Ibuprofen',                     price: 85000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'Sanofi',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop' },
  { id: 52, name: 'Aspirin 100mg',          ingredient: 'Acetylsalicylic Acid',          price: 65000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'Bayer',         sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop' },
  { id: 53, name: 'Decolgen Forte',         ingredient: 'Paracetamol + Phenylephrine',   price: 135000, originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'United Pharma', sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' },
  { id: 54, name: 'Efferalgan 500mg',       ingredient: 'Paracetamol',                   price: 95000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'Traphaco',      sale: false, inStock: false, img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop' },
  { id: 55, name: 'Migralgin',              ingredient: 'Paracetamol + Caffeine',        price: 78000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'Taisho',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop' },
  { id: 56, name: 'Thuốc ho Bảo Thanh',    ingredient: 'Cao lá thường xuân',            price: 85000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'Traphaco',      sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop' },
  { id: 57, name: 'Thuốc nhỏ mắt Rohto',   ingredient: 'Naphazoline HCl',               price: 49000,  originalPrice: null, cat: 'thuoc-khong-ke-don', brand: 'Taisho',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop' },

  // --- Vitamin & TPCN ---
  { id: 58, name: 'Vitamin C 500mg',        ingredient: 'Ascorbic Acid',                 price: 145000, originalPrice: null, cat: 'vitamin-tpcn',       brand: 'DHG Pharma',    sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' },
  { id: 59, name: 'Vitamin D3 2000IU',      ingredient: 'Cholecalciferol',               price: 175000, originalPrice: null, cat: 'vitamin-tpcn',       brand: 'Sanofi',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1612776572997-76cc42e058c3?w=400&h=400&fit=crop' },
  { id: 60, name: 'Omega-3 Fish Oil',       ingredient: 'EPA + DHA 1000mg',              price: 210000, originalPrice: null, cat: 'vitamin-tpcn',       brand: 'United Pharma', sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop' },
  { id: 61, name: 'Canxi Nano MK7',         ingredient: 'Calcium + Vitamin K2',          price: 290000, originalPrice: null, cat: 'vitamin-tpcn',       brand: 'Traphaco',      sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop' },
  { id: 62, name: 'Siro Fitobimbi Ferro',   ingredient: 'Sắt hữu cơ + Vitamin C',       price: 168000, originalPrice: null, cat: 'vitamin-tpcn',       brand: 'DHG Pharma',    sale: false, inStock: false, img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop' },

  // --- Thiết bị y tế ---
  { id: 63, name: 'Nhiệt kế điện tử',      ingredient: 'Đo thân nhiệt chính xác',       price: 120000, originalPrice: null, cat: 'thiet-bi-y-te',      brand: 'Taisho',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop' },
  { id: 64, name: 'Máy đo huyết áp',       ingredient: 'Tự động, cổ tay',               price: 890000, originalPrice: null, cat: 'thiet-bi-y-te',      brand: 'Bayer',         sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop' },
  { id: 65, name: 'Băng gạc vô trùng',     ingredient: 'Hộp 20 miếng',                  price: 35000,  originalPrice: null, cat: 'thiet-bi-y-te',      brand: 'United Pharma', sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop' },
  { id: 66, name: 'Máy đo SpO2',           ingredient: 'Đo nồng độ oxy máu',            price: 350000, originalPrice: null, cat: 'thiet-bi-y-te',      brand: 'DHG Pharma',    sale: false, inStock: false, img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop' },

  // --- Chăm sóc cá nhân ---
  { id: 67, name: 'Kem dưỡng da',          ingredient: 'Niacinamide + Hyaluronic Acid', price: 320000, originalPrice: null, cat: 'cham-soc-ca-nhan',   brand: 'Sanofi',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop' },
  { id: 68, name: 'Kem chống nắng SPF50',  ingredient: 'Zinc Oxide + Titanium',         price: 195000, originalPrice: null, cat: 'cham-soc-ca-nhan',   brand: 'Taisho',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop' },
  { id: 69, name: 'Gel rửa tay khô',       ingredient: 'Cồn 70% kháng khuẩn',          price: 48000,  originalPrice: null, cat: 'cham-soc-ca-nhan',   brand: 'DHG Pharma',    sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1631549916768-4119b4220dcd?w=400&h=400&fit=crop' },

  // --- Mẹ & Bé ---
  { id: 70, name: 'Sữa bột Aptamil',       ingredient: 'Dinh dưỡng trẻ 0–12 tháng',    price: 580000, originalPrice: null, cat: 'me-be',              brand: 'Bayer',         sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
  { id: 71, name: 'Siro ăn ngon B1+Lysine',ingredient: 'Vitamin B1 + Lysine',           price: 125000, originalPrice: null, cat: 'me-be',              brand: 'Traphaco',      sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop' },
  { id: 72, name: 'Bột pha lắc DHA',       ingredient: 'DHA + Vitamin tổng hợp',        price: 210000, originalPrice: null, cat: 'me-be',              brand: 'United Pharma', sale: false, inStock: false, img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop' },

  // --- Thuốc xịt mũi ---
  { id: 73, name: 'Otrivin 0.1%',          ingredient: 'Xylometazoline HCl',            price: 72000,  originalPrice: null, cat: 'thuoc-xit-mui',      brand: 'Sanofi',        sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop' },
  { id: 74, name: 'Nasonex Spray',         ingredient: 'Mometasone Furoate',            price: 185000, originalPrice: null, cat: 'thuoc-xit-mui',      brand: 'Bayer',         sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop' },
  { id: 75, name: 'Sterimar Baby',         ingredient: 'Nước muối sinh lý',             price: 95000,  originalPrice: null, cat: 'thuoc-xit-mui',      brand: 'United Pharma', sale: false, inStock: true,  img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' },
];

// ── Flash Sale – id 1–10, ảnh local khớp với index.html ──
const FLASH_SALE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const FLASH_SALE_IMGS = {
  1:  '../image/C.webp',
  2:  '../image/P.png',
  3:  '../image/N.webp',
  4:  '../image/K.webp',
  5:  '../image/S.jpg',
  6:  '../image/o.png',
  7:  '../image/1.webp',
  8:  '../image/g.webp',
  9:  '../image/v.jpg',
  10: '../image/t.jpg',
};

const CATEGORY_NAMES = {
  'thuoc-khong-ke-don': 'Thuốc không kê đơn',
  'vitamin-tpcn':       'Vitamin & TPCN',
  'thiet-bi-y-te':      'Thiết bị y tế',
  'cham-soc-ca-nhan':   'Chăm sóc cá nhân',
  'me-be':              'Mẹ & Bé',
  'thuoc-xit-mui':      'Thuốc xịt mũi',
};

const ALL_BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort();
const ALL_CATS   = Object.keys(CATEGORY_NAMES);

// ── State ──
let state = {
  query:       '',
  cat:         '',
  sale:        false,
  brands:      [],
  maxPrice:    1000000,
  onlyInStock: false,
  sort:        'popular',
  page:        1,
  perPage:     9,
};

// ── Init ──
document.addEventListener('DOMContentLoaded', function () {
  readParams();
  renderFilters();
  renderHeader();
  updateCartBadge();
  bindEvents();
  renderResults();
});

function readParams() {
  const params = new URLSearchParams(window.location.search);
  state.query = params.get('q')    || '';
  state.cat   = params.get('cat')  || '';
  state.sale  = params.get('sale') === 'true';

  const input = document.querySelector('.search-bar input');
  if (input && state.query) input.value = state.query;
}

// ── Render sidebar filters ──
function renderFilters() {
  const catWrap = document.getElementById('filter-categories');
  if (catWrap) {
    catWrap.innerHTML = ALL_CATS.map(c => `
      <label class="form-check">
        <input type="checkbox" value="${c}" ${state.cat === c ? 'checked' : ''} onchange="onCatFilter(this)" />
        <label>${CATEGORY_NAMES[c]}</label>
      </label>
    `).join('');
  }

  const brandWrap = document.getElementById('filter-brands');
  if (brandWrap) {
    brandWrap.innerHTML = ALL_BRANDS.map(b => `
      <label class="form-check">
        <input type="checkbox" value="${b}" onchange="onBrandFilter(this)" />
        <label>${b}</label>
      </label>
    `).join('');
  }
}

// ── Lấy Flash Sale từ PRODUCTS_DATA ──
function getFlashSaleProducts() {
  if (typeof PRODUCTS_DATA === 'undefined') return [];
  return FLASH_SALE_IDS
    .map(id => {
      const p = PRODUCTS_DATA[id];
      if (!p) return null;
      return {
        id:            p.id,
        name:          p.name,
        ingredient:    p.ingredient,
        price:         p.price,
        originalPrice: p.originalPrice,
        discount:      p.discount,
        cat:           'flash-sale',
        brand:         'Flash Sale',
        sale:          true,
        inStock:       true,
        img:           FLASH_SALE_IMGS[p.id] || (p.imgs && p.imgs[0]) || '',
      };
    })
    .filter(Boolean);
}

// ── Filter & sort ──
function getFiltered() {
  if (state.sale) return getFlashSaleProducts();

  let list = [...PRODUCTS];
  if (state.cat)   list = list.filter(p => p.cat === state.cat);
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.ingredient.toLowerCase().includes(q)
    );
  }
  if (state.brands.length) list = list.filter(p => state.brands.includes(p.brand));
  list = list.filter(p => p.price <= state.maxPrice);
  if (state.onlyInStock)   list = list.filter(p => p.inStock);
  if (state.sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  return list;
}

// ── Render results ──
function renderResults() {
  const all   = getFiltered();
  const total = all.length;
  const start = (state.page - 1) * state.perPage;
  const paged = all.slice(start, start + state.perPage);

  const titleEl = document.getElementById('results-title');
  if (titleEl) {
    if (state.sale) {
      titleEl.innerHTML = '⚡ <span style="color:var(--primary)">Flash Sale</span>';
    } else if (state.cat && CATEGORY_NAMES[state.cat]) {
      titleEl.textContent = 'Danh mục: ' + CATEGORY_NAMES[state.cat];
    } else if (state.query) {
      titleEl.innerHTML = 'Kết quả tìm kiếm: <span style="color:var(--primary)">"' + state.query + '"</span>';
    } else {
      titleEl.textContent = 'Tất cả sản phẩm';
    }
  }

  const countEl = document.getElementById('results-count');
  if (countEl) countEl.textContent = 'Tìm thấy ' + total + ' sản phẩm';

  const grid = document.getElementById('results-grid');
  if (!grid) return;

  if (paged.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <div class="empty-state__title">Không tìm thấy sản phẩm</div>
        <div class="empty-state__desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
      </div>`;
    const pgEl = document.getElementById('pagination');
    if (pgEl) pgEl.innerHTML = '';
    return;
  }

  grid.innerHTML = paged.map(p => {
    const badge = p.discount
      ? `<span class="product-card__badge">-${p.discount}%</span>` : '';
    const origPrice = p.originalPrice
      ? `<span class="product-card__price-original">${formatPrice(p.originalPrice)}</span>` : '';
    return `
    <a href="product.html?id=${p.id}" class="product-card">
      <div class="product-card__image">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${badge}
        ${!p.inStock ? '<div class="product-card__out-of-stock"><span>HẾT HÀNG</span></div>' : ''}
      </div>
      <div class="product-card__body">
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__ingredient">${p.ingredient}</div>
        <div class="product-card__price">
          <span class="product-card__price-current" ${!p.inStock ? 'style="color:var(--text-muted)"' : ''}>
            ${formatPrice(p.price)}
          </span>
          ${origPrice}
        </div>
        <button class="btn-cart"
          ${!p.inStock ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}
          onclick="event.preventDefault(); ${p.inStock ? `addToCart(${p.id},'${p.name}',${p.price})` : ''}">
          ${p.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </a>`;
  }).join('');

  renderPagination(total);
}

// ── Pagination ──
function renderPagination(total) {
  const totalPages = Math.ceil(total / state.perPage);
  const el = document.getElementById('pagination');
  if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }

  let html = `<button class="pagination__btn" ${state.page === 1 ? 'disabled' : ''} onclick="goPage(${state.page - 1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="pagination__btn ${i === state.page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="pagination__btn" ${state.page === totalPages ? 'disabled' : ''} onclick="goPage(${state.page + 1})">›</button>`;
  el.innerHTML = html;
}

function goPage(p) {
  state.page = p;
  renderResults();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Event handlers ──
function bindEvents() {
  document.querySelector('.search-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    state.query = e.target.querySelector('input').value.trim();
    state.cat   = '';
    state.sale  = false;
    state.page  = 1;
    document.querySelectorAll('#filter-categories input').forEach(cb => cb.checked = false);
    renderResults();
  });

  document.getElementById('sort-select')?.addEventListener('change', function () {
    state.sort = this.value;
    state.page = 1;
    renderResults();
  });

  const range = document.getElementById('price-range');
  range?.addEventListener('input', function () {
    state.maxPrice = parseInt(this.value);
    state.page = 1;
    document.getElementById('price-max-label').textContent =
      new Intl.NumberFormat('vi-VN').format(state.maxPrice) + 'đ';
    renderResults();
  });

  const toggle = document.getElementById('toggle-instock');
  toggle?.addEventListener('click', function () {
    this.classList.toggle('on');
    state.onlyInStock = this.classList.contains('on');
    state.page = 1;
    renderResults();
  });
}

function onCatFilter(cb) {
  document.querySelectorAll('#filter-categories input').forEach(el => {
    if (el !== cb) el.checked = false;
  });
  state.cat  = cb.checked ? cb.value : '';
  state.sale = false;
  state.page = 1;
  renderResults();
}

function onBrandFilter(cb) {
  if (cb.checked) {
    state.brands.push(cb.value);
  } else {
    state.brands = state.brands.filter(b => b !== cb.value);
  }
  state.page = 1;
  renderResults();
}

// ── Helpers ──
function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
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
    document.getElementById('avatar-letter').textContent = letter;
    document.getElementById('menu-name').textContent     = user.name  || 'Người dùng';
    document.getElementById('menu-email').textContent    = user.email || '';
  } else {
    guestEl.style.display = 'block';
    userEl.style.display  = 'none';
  }
}

function logout() {
  localStorage.removeItem('ntp_user');
  localStorage.removeItem('ntp_cart');
  window.location.href = 'login.html';
}

function toggleUserMenu() {
  document.getElementById('user-menu')?.classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const wrap = document.querySelector('.header-avatar-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('user-menu')?.classList.remove('open');
  }
});

function getCart() {
  try { return JSON.parse(localStorage.getItem('ntp_cart') || '[]'); }
  catch { return []; }
}

function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function addToCart(id, name, price) {
  const items    = getCart();
  const existing = items.find(i => i.id === id);
  if (existing) {
    existing.qty = Math.min((existing.qty || 1) + 1, 10);
  } else {
    items.push({ id, name, price, qty: 1 });
  }
  localStorage.setItem('ntp_cart', JSON.stringify(items));
  updateCartBadge();
  showToast('✅ Đã thêm "' + name + '" vào giỏ hàng');
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