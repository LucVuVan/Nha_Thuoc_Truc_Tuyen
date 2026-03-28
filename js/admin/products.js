/* ===== admin-products.js ===== */

const PRODUCTS_DATA = [
  { code:'SP-001', name:'Paracetamol 500mg',    brand:'Dược phẩm Hà Nội', cat:'Giảm đau, hạ sốt',      stock:1250, min:500, price:25000,   expiry:'2026-12-15', status:'in'  },
  { code:'SP-002', name:'Vitamin C 1000mg',     brand:'GHG Pharma',        cat:'Vitamin & Khoáng chất', stock:850,  min:300, price:180000,  expiry:'2027-03-20', status:'in'  },
  { code:'SP-003', name:'Amoxicillin 500mg',    brand:'Pymepharco',         cat:'Kháng sinh',            stock:420,  min:400, price:85000,   expiry:'2026-08-10', status:'low' },
  { code:'SP-004', name:'Omeprazole 20mg',      brand:'Sanofi Vietnam',     cat:'Tiêu hóa',              stock:180,  min:200, price:120000,  expiry:'2026-05-30', status:'low' },
  { code:'SP-005', name:'Ibuprofen 400mg',      brand:'Dược phẩm Hà Nội', cat:'Giảm đau, hạ sốt',      stock:95,   min:500, price:45000,   expiry:'2026-04-25', status:'out' },
  { code:'SP-006', name:'Cetirizine 10mg',      brand:'Texa Vietnam',       cat:'Dị ứng',                stock:680,  min:300, price:35000,   expiry:'2027-01-15', status:'in'  },
  { code:'SP-007', name:'Efferalgan 500mg',     brand:'Traphaco',           cat:'Giảm đau, hạ sốt',      stock:540,  min:300, price:95000,   expiry:'2027-04-10', status:'in'  },
  { code:'SP-008', name:'Decolgen Forte',       brand:'United Pharma',      cat:'Cảm cúm',               stock:320,  min:200, price:135000,  expiry:'2026-07-20', status:'in'  },
  { code:'SP-009', name:'Aspirin 100mg',        brand:'Bayer',              cat:'Tim mạch',              stock:760,  min:300, price:65000,   expiry:'2026-10-15', status:'in'  },
  { code:'SP-010', name:'Vitamin D3 2000IU',    brand:'Sanofi Vietnam',     cat:'Vitamin & Khoáng chất', stock:290,  min:200, price:175000,  expiry:'2026-11-30', status:'in'  },
  { code:'SP-011', name:'Nasonex Spray',        brand:'Bayer',              cat:'Thuốc xịt mũi',         stock:145,  min:150, price:185000,  expiry:'2026-10-01', status:'low' },
  { code:'SP-012', name:'Sterimar Baby',        brand:'United Pharma',      cat:'Thuốc xịt mũi',         stock:480,  min:200, price:95000,   expiry:'2027-12-15', status:'in'  },
  { code:'SP-013', name:'Omega-3 Fish Oil',     brand:'United Pharma',      cat:'Vitamin & Khoáng chất', stock:55,   min:200, price:210000,  expiry:'2026-08-05', status:'out' },
  { code:'SP-014', name:'Canxi Nano MK7',       brand:'Traphaco',           cat:'Vitamin & Khoáng chất', stock:410,  min:200, price:290000,  expiry:'2027-03-10', status:'in'  },
  { code:'SP-015', name:'Thuốc ho Bảo Thanh',  brand:'Traphaco',           cat:'Thuốc không kê đơn',    stock:620,  min:300, price:85000,   expiry:'2026-05-10', status:'in'  },
];

const STATUS_CONFIG = {
  in:  { label: 'Còn hàng',     cls: 'completed' },
  low: { label: 'Sắp hết',      cls: 'pending'   },
  out: { label: 'Tồn kho thấp', cls: 'cancelled' },
};

// ── State ──
let state = {
  tab:   'all',
  query: '',
  page:  1,
  perPage: 8,
};

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

// ── Lọc dữ liệu ──
function getFiltered() {
  return PRODUCTS_DATA.filter(p => {
    const matchTab   = state.tab === 'all' || p.status === state.tab;
    const matchQuery = !state.query ||
      p.name.toLowerCase().includes(state.query) ||
      p.code.toLowerCase().includes(state.query) ||
      p.cat.toLowerCase().includes(state.query);
    return matchTab && matchQuery;
  });
}

// ── Render bảng ──
function renderTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  const filtered = getFiltered();
  const total    = filtered.length;
  const start    = (state.page - 1) * state.perPage;
  const paged    = filtered.slice(start, start + state.perPage);

  // Update count
  const countEl = document.getElementById('tableCount');
  if (countEl) countEl.textContent = `Hiển thị ${Math.min(start + paged.length, total)} / ${total} sản phẩm`;

  if (paged.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted);">
          <i class="fa-solid fa-box-open" style="font-size:2rem;margin-bottom:10px;display:block;"></i>
          Không tìm thấy sản phẩm nào
        </td>
      </tr>`;
    renderPagination(0);
    return;
  }

  tbody.innerHTML = paged.map(p => {
    const st = STATUS_CONFIG[p.status];
    const stockColor = p.status === 'low' ? 'color:var(--warning);' :
                       p.status === 'out' ? 'color:var(--error);' : '';
    return `
      <tr>
        <td style="font-weight:700;color:var(--text-muted);font-size:0.78rem">${p.code}</td>
        <td>
          <div style="font-weight:600;font-size:0.85rem">${p.name}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${p.brand}</div>
        </td>
        <td style="font-size:0.82rem">${p.cat}</td>
        <td>
          <div style="font-size:0.82rem;font-weight:600;${stockColor}">${p.stock.toLocaleString('vi-VN')} hộp</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">Tối thiểu: ${p.min}</div>
        </td>
        <td style="font-weight:700;font-family:var(--font-display)">${formatPrice(p.price)}</td>
        <td style="font-size:0.82rem">${p.expiry}</td>
        <td><span class="status-badge ${st.cls}">${st.label}</span></td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="action-btn" title="Xem"><i class="fa-regular fa-eye"></i></button>
            <button class="action-btn" title="Sửa" onclick="openModal('${p.code}')"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="action-btn danger" title="Xóa" onclick="deleteProduct('${p.code}')">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  renderPagination(total);
}

// ── Pagination ──
function renderPagination(total) {
  const el = document.getElementById('paginationEl');
  if (!el) return;

  const totalPages = Math.ceil(total / state.perPage);
  if (totalPages <= 1) { el.innerHTML = ''; return; }

  let html = `<button class="btn btn-ghost btn-sm" ${state.page === 1 ? 'disabled' : ''}
    onclick="goPage(${state.page - 1})">‹ Trước</button>`;

  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    html += `<button class="btn btn-sm ${i === state.page ? 'btn-primary' : 'btn-ghost'}"
      onclick="goPage(${i})">${i}</button>`;
  }
  if (totalPages > 5) html += `<span style="padding:0 6px;color:var(--text-muted)">...</span>
    <button class="btn btn-ghost btn-sm" onclick="goPage(${totalPages})">${totalPages}</button>`;

  html += `<button class="btn btn-ghost btn-sm" ${state.page === totalPages ? 'disabled' : ''}
    onclick="goPage(${state.page + 1})">Sau ›</button>`;

  el.innerHTML = html;
}

function goPage(p) {
  state.page = p;
  renderTable();
}

// ── Tab filter ──
function setTab(el, tab) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  state.tab  = tab;
  state.page = 1;
  renderTable();
}

// ── Search ──
function filterTable() {
  const input = document.getElementById('searchInput');
  state.query = input ? input.value.toLowerCase() : '';
  state.page  = 1;
  renderTable();
}

// ── Xóa (demo) ──
function deleteProduct(code) {
  if (!confirm(`Xóa sản phẩm ${code}?`)) return;
  const idx = PRODUCTS_DATA.findIndex(p => p.code === code);
  if (idx !== -1) {
    PRODUCTS_DATA.splice(idx, 1);
    renderTable();
    showToast(`✅ Đã xóa ${code}`);
  }
}

// ── Modal Thêm/Sửa ──
function openModal(code = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  modal.style.display = 'flex';

  if (code) {
      document.getElementById('modalTitle').textContent = 'Chỉnh sửa sản phẩm';
      const p = PRODUCTS_DATA.find(x => x.code === code);
      
      document.getElementById('editCode').value = p.code;
      document.getElementById('pCode').value = p.code;
      document.getElementById('pCode').disabled = true;
      document.getElementById('pName').value = p.name;
      document.getElementById('pBrand').value = p.brand;
      document.getElementById('pCat').value = p.cat;
      document.getElementById('pPrice').value = p.price;
      document.getElementById('pStock').value = p.stock;
      document.getElementById('pMin').value = p.min;
      document.getElementById('pExpiry').value = p.expiry;
  } else {
      document.getElementById('modalTitle').textContent = 'Thêm sản phẩm mới';
      form.reset();
      document.getElementById('editCode').value = '';
      document.getElementById('pCode').disabled = false;
      const nextId = PRODUCTS_DATA.length + 1;
      document.getElementById('pCode').value = `SP-0${nextId}`;
  }
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
}

// Xử lý Form Submit
document.getElementById('productForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const editCode = document.getElementById('editCode').value;
  const code = document.getElementById('pCode').value;
  const name = document.getElementById('pName').value;
  const brand = document.getElementById('pBrand').value;
  const cat = document.getElementById('pCat').value;
  const price = parseInt(document.getElementById('pPrice').value);
  const stock = parseInt(document.getElementById('pStock').value);
  const min = parseInt(document.getElementById('pMin').value);
  const expiry = document.getElementById('pExpiry').value;

  let status = 'in';
  if (stock <= 0) status = 'out';
  else if (stock <= min) status = 'low';

  if (editCode) {
      const p = PRODUCTS_DATA.find(x => x.code === editCode);
      p.name = name; p.brand = brand; p.cat = cat;
      p.price = price; p.stock = stock; p.min = min;
      p.expiry = expiry; p.status = status;
      showToast(`✅ Đã cập nhật: ${name}`);
  } else {
      PRODUCTS_DATA.unshift({
          code, name, brand, cat, price, stock, min, expiry, status
      });
      showToast(`✅ Đã thêm mới: ${name}`);
  }
  
  closeModal();
  renderTable();
});

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

document.addEventListener('DOMContentLoaded', renderTable);