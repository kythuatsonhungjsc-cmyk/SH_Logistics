import React, { useState, useEffect } from 'react';

// Dữ liệu giả lập từ Bảng 1 (file.md)
const mockMaintenanceData = [
  { id: 1, date: '07/03/2026', plate: '29E-043.44', content: 'Bi chữ thập các đăng', maintenancePart: '', km: '102.677', amount: '380.000', vat: '', total: '380.000', garage: 'Tuấn Anh', method: 'Cn', PIC: 'Tuấn Anh' },
  { id: 2, date: '07/03/2026', plate: '29E-043.44', content: 'Công thợ', maintenancePart: '', km: '102.677', amount: '150.000', vat: '', total: '150.000', garage: 'Tuấn Anh', method: 'Cn', PIC: 'Tuấn Anh' },
  { id: 3, date: '27/03/2026', plate: '29E-043.44', content: 'Bảo dưỡng toàn bộ moay ơ kiểm tra phanh', maintenancePart: 'BD 2 bánh sau', km: '105.900', amount: '800.000', vat: '64.000', total: '864.000', garage: 'ISZU TL', method: 'Cn', PIC: 'Tuấn' },
  { id: 4, date: '27/03/2026', plate: '29E-043.44', content: 'Nhân công thay cuppen phanh bánh xe', maintenancePart: '', km: '105.900', amount: '200.000', vat: '16.000', total: '216.000', garage: 'ISZU TL', method: 'Cn', PIC: 'Tuấn' },
  { id: 5, date: '27/03/2026', plate: '29E-043.44', content: 'Vệ sinh hệ thống ERG', maintenancePart: 'Xúc bô', km: '105.900', amount: '1.400.000', vat: '112.000', total: '1.512.000', garage: 'ISZU TL', method: 'Cn', PIC: 'Tuấn' },
  { id: 6, date: '27/03/2026', plate: '29E-043.44', content: 'Thay lọc gió động cơ', maintenancePart: '', km: '105.900', amount: '0', vat: '0', total: '-', garage: 'ISZU TL', method: 'Cn', PIC: 'Tuấn' },
  { id: 7, date: '09/03/2026', plate: '29E-216.38', content: 'Cứu hộ vá lốp tại bãi', maintenancePart: '', km: '24.765', amount: '300.000', vat: '', total: '300.000', garage: 'Đô lốp', method: 'ms Linh', PIC: 'Trung' },
  { id: 8, date: '23/03/2026', plate: '29E-216.38', content: 'Thay nhớt', maintenancePart: 'Thay nhớt', km: '26.381', amount: '399.000', vat: '31.920', total: '430.920', garage: 'Sơn Hùng', method: '', PIC: 'Bình' },
  { id: 9, date: '14/03/2026', plate: '29E-626.01', content: 'Nhíp 12.07.112', maintenancePart: '', km: '2.046', amount: '980.000', vat: '', total: '980.000', garage: 'Tuấn Anh', method: 'CN', PIC: 'Trung' },
  { id: 10, date: '19/03/2026', plate: '29E-626.01', content: 'Hàn khung giá hàng', maintenancePart: '', km: '2.050', amount: '1.800.000', vat: '144.000', total: '1.944.000', garage: 'Đại Dương Xanh', method: 'Cn', PIC: 'Trung' }
];
const mockVehicles = ['29E-043.44', '29E-138.73', '29E-216.38', '29E-216.49', '29E-626.01'];

const maintenanceItems = [
  'Kiểm tra xe', 'Bơm mỡ', 'Thay nhớt', 'Lọc nhớt', 'Lọc dầu', 'Lọc gió',
  'Dầu cầu', 'Dầu số', 'Dầu phanh', 'Xúc bô/EGR/Két gió', 'Dầu trợ lực',
  'BD điều hoà', 'BD củ đề', 'BD máy phát', 'Xúc két nước', 'Lá côn',
  'Bàn ép', 'Curoa trợ lực', 'Curoa máy phát', 'Curoa điều hoà',
  'BD 2 bánh trước', 'BD 2 bánh sau'
];

export default function MaintenanceModule() {
  // Trạng thái tháng hiện tại (Mặc định: Tháng hiện hành theo thời gian thực)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Trạng thái dữ liệu và loading mô phỏng API
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState(null);

  // Phân quyền
  const [currentUserRole, setCurrentUserRole] = useState('Admin'); // Giả lập Auth
  const canAddInvoice = ['Admin', 'Ketoan', 'KyThuat'].includes(currentUserRole);

  const openInvoiceModal = () => {
    if (!canAddInvoice) {
      alert("Bạn không có quyền thêm mới hóa đơn!");
      return;
    }
    setInvoiceForm({
      id: `INV-${Date.now()}`,
      plate: mockVehicles[0],
      date: new Date().toISOString().split('T')[0],
      km: '',
      garage: '',
      pic: '',
      method: '',
      details: [
        { id: Date.now(), content: '', maintenancePart: '', amount: '', vat: '0', total: 0 }
      ]
    });
    setIsInvoiceModalOpen(true);
  };

  const addDetailRow = () => {
    setInvoiceForm(prev => ({
      ...prev,
      details: [...prev.details, { id: Date.now(), content: '', maintenancePart: '', amount: '', vat: '0', total: 0 }]
    }));
  };

  const removeDetailRow = (idToRemove) => {
    setInvoiceForm(prev => ({
      ...prev,
      details: prev.details.filter(row => row.id !== idToRemove)
    }));
  };

  const updateDetailRow = (index, field, value) => {
    const newDetails = [...invoiceForm.details];
    newDetails[index][field] = value;
    
    const amount = parseFloat(newDetails[index].amount) || 0;
    const vatRate = parseFloat(newDetails[index].vat) || 0;
    newDetails[index].total = amount + (amount * (vatRate / 100));
    
    setInvoiceForm(prev => ({ ...prev, details: newDetails }));
  };

  const calculateGrandTotal = () => {
    if (!invoiceForm) return 0;
    return invoiceForm.details.reduce((sum, row) => sum + (row.total || 0), 0);
  };

  // Điều hướng phân trang
  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const monthDisplay = `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;

  const saveInvoice = async () => {
    const payload = {
      idHoaDon: invoiceForm.id,
      ngaySuaChua: invoiceForm.date,
      bienSoXe: invoiceForm.plate,
      kmBaoDuong: invoiceForm.km,
      gara: invoiceForm.garage,
      hinhThuc: invoiceForm.method,
      phuTrach: invoiceForm.pic,
      chiTiet: invoiceForm.details.map(d => ({
         noiDung: d.content,
         hangMucBaoDuong: d.maintenancePart,
         soTien: parseFloat(d.amount) || 0,
         vat: parseFloat(d.vat) || 0,
         tongTien: d.total
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/maintenance/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.status === 409) {
         const conflictData = await response.json();
         alert(`⚠️ CẢNH BÁO TRÙNG LẶP:\n\n${conflictData.thongBao}\n\nHóa đơn đã có: ${conflictData.thongTinTrungLap.idHoaDon}\nNgày: ${conflictData.thongTinTrungLap.ngay}\nKM: ${conflictData.thongTinTrungLap.km}\nGara: ${conflictData.thongTinTrungLap.gara}\nHạng mục trùng: ${conflictData.thongTinTrungLap.hangMucTrung}`);
         return;
      }
      
      if (response.ok) {
         alert('Lưu hóa đơn thành công!');
         setIsInvoiceModalOpen(false);
         setCurrentDate(new Date(currentDate.getTime())); 
      } else {
         alert('Có lỗi xảy ra khi lưu hóa đơn.');
      }
    } catch(e) {
       console.error(e);
       alert("Lỗi kết nối máy chủ");
    }
  };

  // Giả lập gọi API (Server-Side Pagination)
  useEffect(() => {
    const fetchMonthData = async () => {
      setIsLoading(true);
      try {
        const targetMonth = currentDate.getMonth() + 1;
        const targetYear = currentDate.getFullYear();

        const response = await fetch('http://localhost:5000/api/maintenance/history');
        if (response.ok) {
          const dbData = await response.json();
          
          if (dbData.length > 0) {
            const fetchedData = dbData.filter(row => {
              const [dayStr, monthStr, yearStr] = row.ngaySuaChua.split('/');
              return parseInt(monthStr, 10) === targetMonth && parseInt(yearStr, 10) === targetYear;
            });
            setTableData(fetchedData);
          } else {
            // Gom nhóm Mock Data nếu DB trống
            let mockGrouped = mockMaintenanceData.map(m => ({ ...m }));
            let groupedMap = {};
            mockGrouped.forEach(item => {
               const key = `${item.plate}_${item.date}_${item.km}_${item.garage}`;
               if (!groupedMap[key]) {
                  groupedMap[key] = `INV-MOCK-${Math.floor(Math.random()*1000)}`;
               }
               item.idHoaDon = groupedMap[key];
               item.ngaySuaChua = item.date;
               item.bienSoXe = item.plate;
               item.noiDung = item.content;
               item.hangMucBaoDuong = item.maintenancePart;
               item.kmBaoDuong = item.km;
               item.soTien = item.amount;
               item.vat = item.vat;
               item.tongTien = item.total;
               item.gara = item.garage;
               item.hinhThuc = item.method;
               item.phuTrach = item.PIC;
            });
            
            const fetchedMock = mockGrouped.filter(row => {
              const [dayStr, monthStr, yearStr] = row.ngaySuaChua.split('/');
              return parseInt(monthStr, 10) === targetMonth && parseInt(yearStr, 10) === targetYear;
            });
            setTableData(fetchedMock);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
      setIsLoading(false);
    };

    fetchMonthData();
  }, [currentDate]);

  return (
    <div className="module-container full-width-module">
      <div className="module-toolbar" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        
        {/* Nhóm Bên Trái: Tiêu đề + Phân trang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h2 className="module-title" style={{color: '#fff', margin: 0}}>LỊCH SỬ BẢO DƯỠNG</h2>
          {/* Mock Role Selector */}
          <select 
            value={currentUserRole} 
            onChange={e => setCurrentUserRole(e.target.value)}
            style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #38bdf8', padding: '5px 10px', borderRadius: '6px' }}
          >
            <option value="Admin">Role: Admin</option>
            <option value="Ketoan">Role: Kế toán</option>
            <option value="LaiXe">Role: Lái xe (No Access)</option>
          </select>
          
          {/* Nút Phân Trang Tháng */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1e293b', padding: '5px', borderRadius: '8px', border: '1px solid #475569' }}>
            <button 
              onClick={handlePrevMonth} 
              style={{ width: '40px', height: '40px', padding: 0, background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ff3333'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="16,4 6,12 16,20" />
              </svg>
            </button>
            
            <span style={{ color: '#fff', fontWeight: 'bold', padding: '0 10px', minWidth: '140px', textAlign: 'center', fontSize: '16px', letterSpacing: '1px' }}>
              {monthDisplay}
            </span>
            
            <button 
              onClick={handleNextMonth} 
              style={{ width: '40px', height: '40px', padding: 0, background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ff3333'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="8,4 18,12 8,20" />
              </svg>
            </button>
          </div>
        </div>

        {/* Nhóm Bên Phải: Nút Thêm mới */}
        <div className="toolbar-actions" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <button 
             className="btn-solid-action" 
             onClick={openInvoiceModal}
             style={{ opacity: canAddInvoice ? 1 : 0.5, cursor: canAddInvoice ? 'pointer' : 'not-allowed' }}
             title={canAddInvoice ? "" : "Bạn không có quyền sử dụng chức năng này"}
          >
            ➕ THÊM HÓA ĐƠN MỚI
          </button>
        </div>
      </div>

      <div className="maintenance-content" style={{ position: 'relative' }}>
        
        {/* Lớp phủ Loading - Không làm giật/tắt bảng */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        )}

        {/* DESKTOP VIEW: Bảng Excel */}
        <div className="excel-table-wrapper">
          <table className="excel-table">
            <thead>
              <tr>
                <th>ID Hóa đơn <span className="filter-icon">▼</span></th>
                <th>Ngày <span className="filter-icon">▼</span></th>
                <th>Biển số xe <span className="filter-icon">▼</span></th>
                <th>Nội dung sửa chữa <span className="filter-icon">▼</span></th>
                <th>Bảo dưỡng xe <span className="filter-icon">▼</span></th>
                <th className="t-right">KM Bảo dưỡng <span className="filter-icon">▼</span></th>
                <th className="t-right">Số tiền (VNĐ) <span className="filter-icon">▼</span></th>
                <th className="t-right">VAT (VNĐ) <span className="filter-icon">▼</span></th>
                <th className="t-right highlight-col">CỘNG (VNĐ) <span className="filter-icon">▼</span></th>
                <th>Gara <span className="filter-icon">▼</span></th>
                <th>Phụ trách <span className="filter-icon">▼</span></th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? tableData.map((row, index) => (
                <tr key={row.id || index}>
                  <td><span style={{color: '#38bdf8', fontWeight: 'bold'}}>{row.idHoaDon}</span></td>
                  <td>{row.ngaySuaChua}</td>
                  <td className="fw-bold">{row.bienSoXe}</td>
                  <td>{row.noiDung}</td>
                  <td>{row.hangMucBaoDuong}</td>
                  <td className="t-right">{row.kmBaoDuong}</td>
                  <td className="t-right">{row.soTien}</td>
                  <td className="t-right">{row.vat || '-'}</td>
                  <td className="t-right highlight-col fw-bold">{row.tongTien}</td>
                  <td><span className="solid-badge">{row.gara}</span></td>
                  <td>{row.phuTrach}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>
                    Không có dữ liệu phát sinh trong {monthDisplay}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Danh sách Thẻ */}
        <div className="mobile-cards-wrapper">
          {tableData.length > 0 ? tableData.map((row, index) => (
            <div key={row.id || index} className="m-solid-card">
              <div className="m-card-header">
                <span className="m-date">{row.ngaySuaChua}</span>
                <span className="m-plate">{row.bienSoXe} <span style={{fontSize: '12px', color: '#38bdf8'}}>({row.idHoaDon})</span></span>
              </div>
              <div className="m-card-body">
                <div className="m-content">{row.noiDung} <br/> <i>{row.hangMucBaoDuong}</i></div>
                <div className="m-details">
                  <div><span>KM:</span> {row.kmBaoDuong}</div>
                  <div><span>Gara:</span> {row.gara} ({row.phuTrach})</div>
                </div>
              </div>
              <div className="m-card-footer">
                <div className="m-cost-row">
                  <span>Tiền: {row.soTien}</span>
                  <span>VAT: {row.vat || '0'}</span>
                </div>
                <div className="m-total">CỘNG: {row.tongTien}</div>
              </div>
            </div>
          )) : (
            <div className="m-solid-card" style={{textAlign: 'center', color: '#888'}}>
              Không có dữ liệu trong {monthDisplay}
            </div>
          )}
        </div>

      </div>

      {/* Modal Mô phỏng Hóa Đơn */}
      {isInvoiceModalOpen && invoiceForm && (
        <div className="modal-overlay" onClick={() => setIsInvoiceModalOpen(false)}>
          <div className="glass-modal" onClick={e => e.stopPropagation()} style={{ width: '95%', maxWidth: '1200px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>📝 TẠO HÓA ĐƠN SỬA CHỮA / BẢO DƯỠNG</h3>
              <button className="close-btn" onClick={() => setIsInvoiceModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-body" style={{ color: '#fff', overflowY: 'auto', padding: '20px' }}>
              
              {/* Phần 1: Thông tin cố định */}
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#38bdf8', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>1. THÔNG TIN CHUNG (Cố định 1 lần)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>ID Hóa đơn (Tự sinh)</label>
                    <input type="text" value={invoiceForm.id} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#94a3b8' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Biển số xe *</label>
                    <select value={invoiceForm.plate} onChange={e => setInvoiceForm({...invoiceForm, plate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #38bdf8', color: '#fff', outline: 'none' }}>
                      {mockVehicles.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Ngày sửa chữa</label>
                    <input type="date" value={invoiceForm.date} onChange={e => setInvoiceForm({...invoiceForm, date: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#fff', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>KM Bảo dưỡng</label>
                    <input type="text" placeholder="Vd: 105.900" value={invoiceForm.km} onChange={e => setInvoiceForm({...invoiceForm, km: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#fff', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Gara sửa chữa</label>
                    <input type="text" placeholder="Tên Gara..." value={invoiceForm.garage} onChange={e => setInvoiceForm({...invoiceForm, garage: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#fff', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Phụ trách (PIC)</label>
                    <input type="text" placeholder="Người phụ trách..." value={invoiceForm.pic} onChange={e => setInvoiceForm({...invoiceForm, pic: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#fff', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Hình thức</label>
                    <input type="text" placeholder="Chuyển khoản/Tiền mặt..." value={invoiceForm.method} onChange={e => setInvoiceForm({...invoiceForm, method: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#fff', outline: 'none' }} />
                  </div>

                </div>
              </div>

              {/* Phần 2: Nội dung chi tiết */}
              <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#f59e0b' }}>2. NỘI DUNG SỬA CHỮA (Nhiều hàng)</h4>
                  <button onClick={addDetailRow} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Thêm nội dung
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table className="excel-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <thead>
                      <tr>
                        <th style={{ background: '#1e3a8a', padding: '10px', textAlign: 'left', width: '30%' }}>Nội dung sửa chữa</th>
                        <th style={{ background: '#1e3a8a', padding: '10px', textAlign: 'left', width: '20%' }}>Bảo dưỡng xe (Optional)</th>
                        <th style={{ background: '#1e3a8a', padding: '10px', textAlign: 'right', width: '15%' }}>Số tiền (VNĐ)</th>
                        <th style={{ background: '#1e3a8a', padding: '10px', textAlign: 'center', width: '10%' }}>VAT</th>
                        <th style={{ background: '#1e3a8a', padding: '10px', textAlign: 'right', width: '15%' }}>Cộng (VNĐ)</th>
                        <th style={{ background: '#1e3a8a', padding: '10px', textAlign: 'center', width: '10%' }}>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceForm.details.map((row, index) => (
                        <tr key={row.id}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #334155' }}>
                            <input type="text" placeholder="Nhập chi tiết..." value={row.content} onChange={(e) => updateDetailRow(index, 'content', e.target.value)} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #475569', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #334155' }}>
                            <select value={row.maintenancePart} onChange={(e) => updateDetailRow(index, 'maintenancePart', e.target.value)} style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px', outline: 'none' }}>
                              <option value="">-- Bỏ trống --</option>
                              {maintenanceItems.map(item => (
                                <option key={item} value={item} disabled={invoiceForm.details.some((d, idx) => idx !== index && d.maintenancePart === item)}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #334155' }}>
                            <input type="number" placeholder="0" value={row.amount} onChange={(e) => updateDetailRow(index, 'amount', e.target.value)} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #475569', color: '#fff', borderRadius: '4px', textAlign: 'right', outline: 'none' }} />
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #334155', textAlign: 'center' }}>
                            <select value={row.vat} onChange={(e) => updateDetailRow(index, 'vat', e.target.value)} style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #475569', color: '#fff', borderRadius: '4px', outline: 'none' }}>
                              <option value="0">0%</option>
                              <option value="5">5%</option>
                              <option value="8">8%</option>
                              <option value="10">10%</option>
                            </select>
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #334155', textAlign: 'right', fontWeight: 'bold', color: '#4ade80' }}>
                            {new Intl.NumberFormat('vi-VN').format(row.total)}
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #334155', textAlign: 'center' }}>
                            <button onClick={() => removeDetailRow(row.id)} disabled={invoiceForm.details.length === 1} style={{ background: '#ef4444', color: '#fff', border: 'none', width: '30px', height: '30px', borderRadius: '4px', cursor: invoiceForm.details.length === 1 ? 'not-allowed' : 'pointer', opacity: invoiceForm.details.length === 1 ? 0.5 : 1 }}>
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'right', padding: '15px 10px', fontWeight: 'bold', fontSize: '16px' }}>TỔNG HÓA ĐƠN:</td>
                        <td colSpan="2" style={{ textAlign: 'left', padding: '15px 10px', fontWeight: 'bold', fontSize: '18px', color: '#f59e0b' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateGrandTotal())}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button onClick={() => setIsInvoiceModalOpen(false)} style={{ padding: '12px 25px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy bỏ</button>
                <button onClick={saveInvoice} style={{ padding: '12px 25px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                  💾 LƯU HÓA ĐƠN
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
