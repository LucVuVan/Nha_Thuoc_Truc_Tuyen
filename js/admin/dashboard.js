/* ===== js/admin/dashboard.js ===== */

// ── Dữ liệu mẫu Top 5 ──
const TOP5_DATA = [
  { name: 'Paracetamol 500mg', sold: 1247 },
  { name: 'Vitamin C 1000mg',  sold: 982  },
  { name: 'Amoxicillin 500mg', sold: 856  },
  { name: 'Omeprazole 20mg',   sold: 723  },
  { name: 'Ibuprofen 400mg',   sold: 645  },
];

// ── Đọc đơn hàng từ localStorage (tất cả user) ──
function getAllOrders() {
  const orders = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ntp_orders_')) {
      try {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        orders.push(...items);
      } catch { /* bỏ qua */ }
    }
  }
  // Sắp xếp mới nhất lên trên
  return orders.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
}

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

const STATUS_LABEL = {
  pending:    'Chờ xác nhận',
  confirmed:  'Đã xác nhận',
  delivering: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
};

const STATUS_CLASS = {
  pending:    'pending',
  confirmed:  'delivering',
  delivering: 'delivering',
  completed:  'completed',
  cancelled:  'cancelled',
};

// ── Render bảng đơn hàng ──
function renderOrderTable() {
  const tbody = document.getElementById('orderTableBody');
  if (!tbody) return;

  const orders = getAllOrders().slice(0, 5);

  // SỬA Ở ĐÂY: Nếu không có đơn hàng thực, nạp dữ liệu mẫu để giao diện không bị trống
  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td><span class="order-id">DH-2024-1847</span></td>
        <td><span class="customer-name">Nguyễn Văn A</span></td>
        <td>Paracetamol 500mg</td>
        <td><span class="order-amount">450,000đ</span></td>
        <td><span class="status-badge pending">Chờ xác nhận</span></td>
        <td><button class="action-btn"><i class="fa-regular fa-eye"></i></button></td>
      </tr>
      <tr>
        <td><span class="order-id">DH-2024-1846</span></td>
        <td><span class="customer-name">Trần Thị B</span></td>
        <td>Vitamin C 1000mg</td>
        <td><span class="order-amount">1,200,000đ</span></td>
        <td><span class="status-badge delivering">Đang giao</span></td>
        <td><button class="action-btn"><i class="fa-regular fa-eye"></i></button></td>
      </tr>
      <tr>
        <td><span class="order-id">DH-2024-1845</span></td>
        <td><span class="customer-name">Lê Văn C</span></td>
        <td>Amoxicillin 500mg</td>
        <td><span class="order-amount">320,000đ</span></td>
        <td><span class="status-badge completed">Hoàn thành</span></td>
        <td><button class="action-btn"><i class="fa-regular fa-eye"></i></button></td>
      </tr>
      <tr>
        <td><span class="order-id">DH-2024-1844</span></td>
        <td><span class="customer-name">Phạm Thị D</span></td>
        <td>Omeprazole 20mg</td>
        <td><span class="order-amount">580,000đ</span></td>
        <td><span class="status-badge completed">Hoàn thành</span></td>
        <td><button class="action-btn"><i class="fa-regular fa-eye"></i></button></td>
      </tr>
      <tr>
        <td><span class="order-id">DH-2024-1843</span></td>
        <td><span class="customer-name">Hoàng Văn E</span></td>
        <td>Ibuprofen 400mg</td>
        <td><span class="order-amount">250,000đ</span></td>
        <td><span class="status-badge cancelled">Đã hủy</span></td>
        <td><button class="action-btn"><i class="fa-regular fa-eye"></i></button></td>
      </tr>`;
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const firstName = order.items?.[0]?.name || 'Sản phẩm';
    const cls   = STATUS_CLASS[order.status] || 'pending';
    const label = STATUS_LABEL[order.status] || order.status;
    return `
      <tr>
        <td><span class="order-id">${order.id}</span></td>
        <td><span class="customer-name">${order.name || '—'}</span></td>
        <td>${firstName}</td>
        <td><span class="order-amount">${formatPrice(order.total || 0)}</span></td>
        <td><span class="status-badge ${cls}">${label}</span></td>
        <td><button class="action-btn"><i class="fa-regular fa-eye"></i></button></td>
      </tr>`;
  }).join('');
}

// ── Render top 5 ──
function renderTop5() {
  const list = document.getElementById('top5List');
  if (!list) return;

  const max = TOP5_DATA[0].sold;
  const rankClass = ['r1','r2','r3','r4','r5'];

  list.innerHTML = TOP5_DATA.map((item, i) => `
    <div class="top5-item">
      <div class="top5-rank ${rankClass[i]}">${i + 1}</div>
      <div class="top5-info">
        <div class="top5-name">${item.name}</div>
        <div class="top5-sold">${item.sold.toLocaleString('vi-VN')} đã bán</div>
      </div>
      <div class="top5-bar-wrap">
        <div class="top5-bar-bg">
          <div class="top5-bar-fill" style="width:${Math.round(item.sold / max * 100)}%"></div>
        </div>
      </div>
    </div>`).join('');
}

// ── Revenue chart (Cấu hình y hệt bản gốc của bạn) ──
function initRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 240);
  grad.addColorStop(0, 'rgba(26,140,78,0.18)');
  grad.addColorStop(1, 'rgba(26,140,78,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['09/03','10/03','11/03','12/03','13/03','14/03','15/03'],
      datasets: [{
        data: [44, 51, 55, 60, 63, 66, 72.5],
        borderColor: '#1a8c4e',
        borderWidth: 2.5,
        backgroundColor: grad,
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#1a8c4e',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: c => `${c.parsed.y}M đồng` },
          backgroundColor: '#162620',
          titleColor: '#fff',
          bodyColor: '#5de89a',
          padding: 10,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#8aaa97', font: { size: 11 } }
        },
        y: {
          min: 0, max: 80,
          ticks: { color: '#8aaa97', font: { size: 11 }, callback: v => v + 'M' },
          grid: { color: '#edf5f0' }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRevenueChart();
  renderOrderTable();
  renderTop5();
});