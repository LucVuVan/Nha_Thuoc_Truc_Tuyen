/* ===== admin-categories.js ===== */

const CATEGORIES_DATA = [
  { icon:'💊', name:'Giảm đau, hạ sốt',      desc:'Các loại thuốc giảm đau và hạ sốt',        products:324, revenue:450, status:'active' },
  { icon:'💚', name:'Vitamin & Khoáng chất',  desc:'Vitamin và thực phẩm chức năng',            products:256, revenue:380, status:'active' },
  { icon:'💉', name:'Kháng sinh',             desc:'Thuốc kháng sinh các loại',                 products:189, revenue:290, status:'active' },
  { icon:'🫀', name:'Tiêu hóa',               desc:'Thuốc hỗ trợ tiêu hóa',                    products:167, revenue:235, status:'active' },
  { icon:'🤧', name:'Dị ứng',                 desc:'Thuốc điều trị dị ứng',                     products:143, revenue:198, status:'active' },
  { icon:'❤️', name:'Tim mạch',               desc:'Thuốc điều trị bệnh tim mạch',              products:134, revenue:425, status:'active' },
  { icon:'🧴', name:'Da liễu',                desc:'Thuốc và kem bôi da',                       products:98,  revenue:156, status:'active' },
  { icon:'🫁', name:'Hô hấp',                 desc:'Thuốc hỗ trợ đường hô hấp',                 products:87,  revenue:189, status:'active' },
  { icon:'👶', name:'Mẹ & Bé',               desc:'Sản phẩm cho mẹ và bé',                     products:112, revenue:312, status:'active' },
  { icon:'🩺', name:'Thiết bị y tế',         desc:'Dụng cụ và thiết bị y tế',                  products:76,  revenue:520, status:'active' },
  { icon:'✨', name:'Chăm sóc cá nhân',      desc:'Sản phẩm chăm sóc sức khoẻ cá nhân',       products:204, revenue:275, status:'active' },
  { icon:'💧', name:'Thuốc xịt mũi',          desc:'Thuốc và dung dịch xịt mũi',               products:63,  revenue:145, status:'active' },
];

let searchQuery = '';
let editingIndex = -1; // -1 nghĩa là đang thêm mới, >= 0 là đang sửa

function renderCategoryCards() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;

  const filtered = CATEGORIES_DATA.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery) || c.desc.toLowerCase().includes(searchQuery)
  );

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">Không tìm thấy danh mục nào</div>`;
    return;
  }

  grid.innerHTML = filtered.map((c, i) => `
    <div class="cat-card" onclick="viewCategory(${i})">
      <div class="cat-card__icon">${c.icon}</div>
      <div class="cat-card__name">${c.name}</div>
      <div class="cat-card__desc">${c.desc}</div>
      <div class="cat-card__meta">
        <span>Sản phẩm <strong>${c.products}</strong></span>
        <span class="cat-card__revenue">${c.revenue}M</span>
      </div>
      <a class="cat-card__link" onclick="event.stopPropagation()">Xem chi tiết →</a>
    </div>`).join('');
    
  // Cập nhật thẻ Stat "Tổng danh mục"
  const statTotal = document.getElementById('statTotalCat');
  if (statTotal) statTotal.textContent = CATEGORIES_DATA.length;
}

function renderCategoryTable() {
  const tbody = document.getElementById('catTableBody');
  if (!tbody) return;

  const filtered = CATEGORIES_DATA.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery)
  );

  tbody.innerHTML = filtered.map((c, i) => `
    <tr>
      <td>
        <span style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.1rem">${c.icon}</span>
          <span style="font-weight:600;font-size:0.85rem">${c.name}</span>
        </span>
      </td>
      <td style="font-size:0.82rem;color:var(--text-muted)">${c.desc}</td>
      <td style="font-weight:600">${c.products}</td>
      <td style="font-weight:700;color:var(--primary)">${c.revenue}.0M VND</td>
      <td><span class="status-badge completed">Hoạt động</span></td>
      <td style="display:flex;gap:4px;">
        <button class="action-btn" onclick="openCategoryModal(${i})"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="action-btn danger" onclick="deleteCategory(${i})"><i class="fa-regular fa-trash-can"></i></button>
      </td>
    </tr>`).join('');
}

function filterCategories() {
  const input = document.getElementById('catSearchInput');
  searchQuery = input ? input.value.toLowerCase() : '';
  renderCategoryCards();
  renderCategoryTable();
}

function viewCategory(i) {
  const c = CATEGORIES_DATA[i];
  showToast(`📂 ${c.name} — ${c.products} sản phẩm, doanh thu ${c.revenue}M`);
}

function deleteCategory(i) {
  const c = CATEGORIES_DATA[i];
  if (!confirm(`Bạn có chắc muốn xóa danh mục "${c.name}"?`)) return;
  CATEGORIES_DATA.splice(i, 1);
  renderCategoryCards();
  renderCategoryTable();
  showToast(`✅ Đã xóa danh mục`);
}

// ── LOGIC MODAL THÊM / SỬA DANH MỤC ──
function openCategoryModal(index = -1) {
    editingIndex = index;
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    modal.style.display = 'flex';
  
    if (index >= 0) {
        // Chế độ Sửa
        document.getElementById('catModalTitle').textContent = 'Chỉnh sửa danh mục';
        const c = CATEGORIES_DATA[index];
        document.getElementById('cIcon').value = c.icon;
        document.getElementById('cName').value = c.name;
        document.getElementById('cDesc').value = c.desc;
    } else {
        // Chế độ Thêm mới
        document.getElementById('catModalTitle').textContent = 'Thêm danh mục mới';
        form.reset();
    }
}

function closeCategoryModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

// Xử lý Form Submit
document.getElementById('categoryForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const icon = document.getElementById('cIcon').value;
    const name = document.getElementById('cName').value;
    const desc = document.getElementById('cDesc').value;
  
    if (editingIndex >= 0) {
        // Cập nhật
        CATEGORIES_DATA[editingIndex].icon = icon;
        CATEGORIES_DATA[editingIndex].name = name;
        CATEGORIES_DATA[editingIndex].desc = desc;
        showToast(`✅ Đã cập nhật danh mục: ${name}`);
    } else {
        // Thêm mới (Mặc định 0 sản phẩm, 0 doanh thu)
        CATEGORIES_DATA.unshift({
            icon: icon, name: name, desc: desc,
            products: 0, revenue: 0, status: 'active'
        });
        showToast(`✅ Đã thêm mới danh mục: ${name}`);
    }
    
    closeCategoryModal();
    renderCategoryCards();
    renderCategoryTable();
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

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryCards();
  renderCategoryTable();
});