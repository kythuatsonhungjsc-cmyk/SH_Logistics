import React from 'react';

/**
 * Dashboard Component - Hệ thống điều hành đội xe
 */
const Dashboard = () => {
  // Dữ liệu giả lập
  const stats = [
    { label: 'TỔNG SỐ XE', value: 45, color: '#60a5fa', icon: '🚚' },
    { label: 'ĐANG HOẠT ĐỘNG', value: 38, color: '#4ade80', icon: '🟢' },
    { label: 'ĐANG BẢO DƯỠNG', value: 4, color: '#fb923c', icon: '🛠️' },
    { label: 'KHÔNG ĐỦ ĐIỀU KIỆN', value: 3, color: '#ef4444', icon: '⚠️' },
  ];

  const expiringDocs = [
    { plate: '29C-123.45', doc: 'Đăng kiểm', days: 3, color: '#ef4444' },
    { plate: '51D-987.65', doc: 'Bảo hiểm', days: 7, color: '#fb923c' },
    { plate: '43H-456.78', doc: 'Giấy phép vận tải', days: 12, color: '#4ade80' },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. Hàng thẻ số liệu tổng quát */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--accent': s.color }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Khu vực biểu đồ & Thời tiết */}
      <div className="charts-grid">
        {/* Biểu đồ Chi phí Bảo dưỡng (SVG) */}
        <div className="chart-box glass">
          <h3>CHI PHÍ BẢO DƯỠNG (TRIỆU VNĐ)</h3>
          <div className="svg-chart-wrapper">
            <svg viewBox="0 0 400 200">
              <rect x="50" y="100" width="30" height="60" fill="#60a5fa" rx="5" />
              <rect x="110" y="80" width="30" height="80" fill="#60a5fa" rx="5" />
              <rect x="170" y="120" width="30" height="40" fill="#60a5fa" rx="5" />
              <rect x="230" y="40" width="30" height="120" fill="#fb923c" rx="5" />
              <rect x="290" y="90" width="30" height="70" fill="#60a5fa" rx="5" />
              <line x1="40" y1="160" x2="350" y2="160" stroke="#444" />
            </svg>
            <div className="chart-labels">
              <span>Th2</span><span>Th3</span><span>Th4</span><span>Th5</span><span>Th6</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ Tiêu hao nhiên liệu (SVG Line) */}
        <div className="chart-box glass">
          <h3>TIÊU HAO NHIÊN LIỆU (LIT/100KM)</h3>
          <div className="svg-chart-wrapper">
            <svg viewBox="0 0 400 200">
              <path d="M50,140 Q150,80 250,110 T350,60" fill="none" stroke="#4ade80" strokeWidth="4" />
              <circle cx="50" cy="140" r="5" fill="#4ade80" />
              <circle cx="200" cy="95" r="5" fill="#4ade80" />
              <circle cx="350" cy="60" r="5" fill="#4ade80" />
              <line x1="40" y1="160" x2="350" y2="160" stroke="#444" />
            </svg>
            <div className="chart-labels">
              <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span>
            </div>
          </div>
        </div>

        {/* Widget Thời tiết */}
        <div className="weather-card glass">
          <div className="weather-main">
            <span className="temp">32°C</span>
            <span className="condition">☀️ Nắng nóng</span>
          </div>
          <div className="weather-details">
            <p>📍 TP. Hồ Chí Minh</p>
            <p>Độ ẩm: 65% | Gió: 12km/h</p>
          </div>
          <div className="forecast-mini">
            <div><span>Mai</span><span>⛈️</span></div>
            <div><span>Mốt</span><span>⛅</span></div>
          </div>
        </div>
      </div>

      {/* 3. Thẻ cảnh báo hết hạn giấy tờ */}
      <div className="alerts-section glass">
        <h3>⚠️ CẢNH BÁO GIẤY TỜ SẮP HẾT HẠN</h3>
        <div className="alerts-list">
          {expiringDocs.map((doc, i) => (
            <div key={i} className="alert-item" style={{ borderLeftColor: doc.color }}>
              <span className="plate">{doc.plate}</span>
              <span className="doc-type">{doc.doc}</span>
              <span className="days-left" style={{ color: doc.color }}>Còn {doc.days} ngày</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
