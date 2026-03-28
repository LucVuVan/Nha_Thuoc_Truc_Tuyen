/* ===== admin-statistics.js ===== */

const CHART_DATA = {
  '7days': {
    trend: { labels: ['T1','T2','T3','T4','T5','T6','T7'], revenue: [420,530,470,600,580,640,720], orders: [980,1150,1020,1400,1320,1560,1850] },
    hourly: { labels: ['6h','8h','10h','12h','14h','16h','18h','20h','22h'], data: [5,18,32,45,38,42,35,28,15] },
    stats: { revenue:'720M', orders:'1,850', newCust:'342', avgOrder:'389K', revGrow:12.5, orderGrow:8.3, custGrow:18.2, avgDrop:-2.1 },
  },
  '30days': {
    trend: { labels: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10'], revenue: [380,420,450,510,490,540,580,620,600,660], orders: [850,920,1000,1100,980,1150,1200,1350,1280,1420] },
    hourly: { labels: ['6h','8h','10h','12h','14h','16h','18h','20h','22h'], data: [8,22,38,52,44,48,40,32,18] },
    stats: { revenue:'2,850M', orders:'7,200', newCust:'1,240', avgOrder:'396K', revGrow:15.2, orderGrow:11.4, custGrow:22.1, avgDrop:1.8 },
  },
};

let trendChart = null, barChart = null;

function getDataByRange(range) {
  return CHART_DATA[range] || CHART_DATA['7days'];
}

// ── Trend Chart (line dual axis) ──
function initTrendChart(range) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  const data = getDataByRange(range);

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: data.trend.labels,
      datasets: [
        {
          label: 'Doanh thu (triệu)',
          data: data.trend.revenue,
          borderColor: '#3b82f6', borderWidth: 2.2, tension: 0.4,
          pointRadius: 3, pointBackgroundColor: '#3b82f6',
          yAxisID: 'y', fill: false,
        },
        {
          label: 'Đơn hàng',
          data: data.trend.orders,
          borderColor: '#1a8c4e', borderWidth: 2.2, tension: 0.4,
          pointRadius: 3, pointBackgroundColor: '#1a8c4e',
          yAxisID: 'y1', fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:'bottom', labels:{ boxWidth:10, font:{ size:11 } } } },
      scales: {
        x: { grid:{ display:false }, ticks:{ font:{ size:11 }, color:'#8aaa97' } },
        y: { position:'left', ticks:{ font:{ size:10 }, color:'#3b82f6', callback: v => v+'M' }, grid:{ color:'#edf5f0' } },
        y1: { position:'right', ticks:{ font:{ size:10 }, color:'#1a8c4e' }, grid:{ display:false } }
      }
    }
  });
}

// ── Pie Chart ──
function initPieChart() {
  const canvas = document.getElementById('pieChart');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Giảm đau, hạ sốt','Vitamin & Khoáng chất','Tiêu hóa','Kháng sinh','Khác'],
      datasets: [{
        data: [35, 25, 18, 12, 10],
        backgroundColor: ['#1a8c4e','#3b82f6','#f59e0b','#ef4444','#8b5cf6'],
        borderWidth: 2, borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend:{ display:false } }
    }
  });
}

// ── Bar Chart (hourly) ──
function initBarChart(range) {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const data = getDataByRange(range);

  if (barChart) barChart.destroy();

  barChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: data.hourly.labels,
      datasets: [{
        label: 'Đơn hàng',
        data: data.hourly.data,
        backgroundColor: 'rgba(26,140,78,0.8)',
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend:{ display:false } },
      scales: {
        x: { grid:{ display:false }, ticks:{ font:{ size:11 }, color:'#8aaa97' } },
        y: { ticks:{ font:{ size:11 }, color:'#8aaa97' }, grid:{ color:'#edf5f0' } }
      }
    }
  });
}

// ── Update stat cards ──
function updateStats(range) {
  const s = getDataByRange(range).stats;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setTrend = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    const isUp = val >= 0;
    el.innerHTML = `<i class="fa-solid fa-arrow-${isUp ? 'up' : 'down'}"></i> ${Math.abs(val)}% so với tháng trước`;
    el.className = `stat-card__trend ${isUp ? 'up' : 'down'}`;
  };
  set('statRevenue',  s.revenue + ' VND');
  set('statOrders',   s.orders);
  set('statNewCust',  s.newCust);
  set('statAvgOrder', s.avgOrder);
  setTrend('trendRevenue',  s.revGrow);
  setTrend('trendOrders',   s.orderGrow);
  setTrend('trendNewCust',  s.custGrow);
  setTrend('trendAvgOrder', s.avgDrop);
}

// ── Đổi khoảng thời gian ──
function changeRange(select) {
  const range = select.value === '7 ngày qua'  ? '7days' :
                select.value === '30 ngày qua' ? '30days' : '7days';
  updateStats(range);
  initTrendChart(range);
  initBarChart(range);
}

document.addEventListener('DOMContentLoaded', () => {
  updateStats('7days');
  initTrendChart('7days');
  initPieChart();
  initBarChart('7days');
});