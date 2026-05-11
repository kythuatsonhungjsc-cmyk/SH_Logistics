import React, { useState } from 'react';

// Dữ liệu giả lập từ file.md (Bảng 5)
const mockVehicles = [
  {
    id: '1',
    plate: '29H-192.00',
    company: 'Sơn Hùng',
    team: 'Đội 2',
    brand: 'HINO',
    capacity: '14.400 kg',
    dimensions: '9200 x 2330 x 2335',
    tire: '1100R20',
    chassis: 'RNGFL8JTSHXX19930',
    engine: 'J08EUF20885',
    year: '2017',
    expiry: '2042',
    color: 'Trắng',
    odo: '123.121 km',
    status: 'active'
  },
  {
    id: '2',
    plate: '29H-192.11',
    company: 'Sơn Hùng',
    team: 'Đội 1',
    brand: 'ISUZU',
    capacity: '7.950 kg',
    dimensions: '7280 x 2370 x 2150',
    tire: '1000R20',
    chassis: 'RLEFVR347JV000296',
    engine: '6HK1209171',
    year: '2018',
    expiry: '2043',
    color: 'Trắng',
    odo: '190.020 km',
    status: 'active'
  },
  {
    id: '3',
    plate: '29H-192.34',
    company: 'SHN',
    team: 'Đội 1',
    brand: 'ISUZU',
    capacity: '2.395 kg',
    dimensions: '3510 x 1760 x 1890',
    tire: '700R15',
    chassis: 'ISDSDFJ32146',
    engine: 'F22396',
    year: '2020',
    expiry: '2045',
    color: 'Trắng',
    odo: '95.000 km',
    status: 'maintenance'
  }
];

// Component Form Thêm Xe
const VehicleFormModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal" style={{ transform: 'translateY(100px)' }}>
        <div className="modal-header">
          <h3>THÊM PHƯƠNG TIỆN MỚI</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form className="vehicle-form">
            <div className="form-group">
              <label>Biển số xe *</label>
              <input type="text" placeholder="Ví dụ: 29H-192.00" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Công ty sở hữu</label>
              <input type="text" list="companies-list" placeholder="Chọn hoặc nhập tên công ty..." className="glass-input" />
              <datalist id="companies-list">
                <option value="Sơn Hùng" />
                <option value="SHN" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Đội xe</label>
              <input type="text" list="teams-list" placeholder="Chọn hoặc nhập đội xe..." className="glass-input" />
              <datalist id="teams-list">
                <option value="Đội 1" />
                <option value="Đội 2" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Hãng / Loại xe</label>
              <input type="text" list="brands-list" placeholder="Chọn hoặc nhập hãng xe..." className="glass-input" />
              <datalist id="brands-list">
                <option value="HINO" />
                <option value="ISUZU" />
                <option value="HYUNDAI" />
                <option value="THACO" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Tải trọng (Kg)</label>
              <input type="number" placeholder="Ví dụ: 14400" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Kích thước thùng (D x R x C)</label>
              <input type="text" placeholder="Ví dụ: 9200x2330x2335" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Loại lốp</label>
              <input type="text" placeholder="Ví dụ: 1100R20" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Màu sơn</label>
              <input type="text" placeholder="Ví dụ: Trắng" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Số khung</label>
              <input type="text" placeholder="Nhập số khung..." className="glass-input" />
            </div>

            <div className="form-group">
              <label>Số máy</label>
              <input type="text" placeholder="Nhập số máy..." className="glass-input" />
            </div>

            <div className="form-group">
              <label>Năm sản xuất</label>
              <input type="number" placeholder="Ví dụ: 2017" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Niên hạn sử dụng</label>
              <input type="number" placeholder="Ví dụ: 2042" className="glass-input" />
            </div>

            <div className="form-group full-width">
              <label>Kilomet hiện tại (ODO)</label>
              <input type="number" placeholder="Ví dụ: 123121" className="glass-input" />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-glass outline" onClick={onClose}>HỦY BỎ</button>
          <button className="btn-3d-action green sm-btn" style={{ width: 'auto', padding: '0 20px' }}>
            <div className="btn-content">
              <span className="btn-text">LƯU PHƯƠNG TIỆN</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Bảng Nhập Giấy Tờ Xe (Theo Bảng 6 file.md - Quản lý hạn định)
const VehicleDocumentsModal = ({ onClose }) => {
  const [docsData, setDocsData] = useState(mockVehicles.map(v => ({
    plate: v.plate,
    regExpiry: '10/05/2026',
    inspExpiry: '28/03/2026',
    badgeExpiry: '15/07/2026',
    tndsExpiry: '26/03/2026',
    tndsHotline: '1900969690',
    hullExpiry: '',
    hullHotline: ''
  })));

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal" style={{ maxWidth: '1250px', width: '98%' }}>
        <div className="modal-header">
          <h3>BẢNG 6: QUẢN LÝ HẠN ĐỊNH GIẤY TỜ XE</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body" style={{ overflowX: 'auto', padding: '15px' }}>
          <table className="maintenance-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1600px' }}>
            <thead>
              <tr style={{ background: 'rgba(56, 189, 248, 0.2)' }}>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Biển số xe</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hạn Đăng ký</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Ảnh ĐK</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hạn Đăng kiểm</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Ảnh ĐK</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hạn Phù hiệu</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Ảnh PH</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hạn BH TNDS</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Ảnh TNDS</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hotline TNDS</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hạn BH Thân vỏ</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Ảnh Thân vỏ</th>
                <th style={{ padding: '12px', border: '1px solid #334155', color: '#38bdf8' }}>Hotline Thân vỏ</th>
              </tr>
            </thead>
            <tbody>
              {docsData.map((doc, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '8px', border: '1px solid #334155', color: '#fbbf24', fontWeight: 'bold', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>{doc.plate}</td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.regExpiry} className="glass-input-sm" style={{ width: '100%', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>📷</button>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.inspExpiry} className="glass-input-sm" style={{ width: '100%', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>📷</button>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.badgeExpiry} className="glass-input-sm" style={{ width: '100%', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>📷</button>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.tndsExpiry} className="glass-input-sm" style={{ width: '100%', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>📷</button>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.tndsHotline} className="glass-input-sm" style={{ width: '100%' }} />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.hullExpiry} className="glass-input-sm" style={{ width: '100%', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>📷</button>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #334155' }}>
                    <input type="text" defaultValue={doc.hullHotline} className="glass-input-sm" style={{ width: '100%' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="btn-glass outline" onClick={onClose}>HỦY BỎ</button>
          <button className="btn-3d-action blue sm-btn" style={{ width: 'auto', padding: '0 20px' }}>
            <div className="btn-content">
              <span className="btn-text">LƯU THÔNG TIN GIẤY TỜ</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Bảng Nhập Công cụ kèm theo (Theo Bảng 7 & 8 file.md)
const VehicleEquipmentsModal = ({ onClose }) => {
  const [selectedPlate, setSelectedPlate] = useState(mockVehicles[0].plate);
  const [equips, setEquips] = useState([
    { id: 1, name: 'Bình chữa cháy', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 2, name: 'Túi cứu thương (5 loại)', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 3, name: 'Tam giác phản quang', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 4, name: 'Chèn lốp', qty: '2', status: 'TỐT', note: '', type: 'default' },
    { id: 5, name: 'Tấm dán phản quang quanh xe', qty: '', status: 'TỐT', note: '', type: 'default' },
    { id: 6, name: 'Lốp sơ cua', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 7, name: 'Tấm lót chải sàn cabin xe', qty: '', status: 'TỐT', note: '', type: 'default' },
    { id: 8, name: 'Chắn nắng', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 9, name: 'Chìa khoá xe (Chính + sơ cua)', qty: '1', status: 'TỐT', note: '1 bảo vệ', type: 'default' },
    { id: 10, name: 'Giá đỡ điện thoại', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 11, name: 'Thẻ định vị quẹt khi lái xe', qty: '1', status: 'TỐT', note: '', type: 'default' },
    { id: 12, name: 'Thẻ nghiệp vụ lái xe', qty: '', status: 'TỐT', note: '', type: 'default' },
    { id: 13, name: 'Bộ sửa chữa: Tô vít, Kìm, Mỏ lết, búa, kích...', qty: '/Bộ', status: 'TỐT', note: 'Kick, tay công, tay quay, tuyp lốp, tô vít', type: 'default' },
    { id: 14, name: 'Khoá thùng xe', qty: '', status: 'TỐT', note: '', type: 'default' },
    { id: 15, name: 'Gim bấm tài liệu, giấy tờ', qty: '', status: 'TỐT', note: '', type: 'default' },
    { id: 16, name: 'Thiết bị định vị GPS, camera hành trình', qty: '/Bộ', status: 'TỐT', note: 'GPS, cam hành trình', type: 'default' },
    { id: 17, name: 'Cam lùi, cam trước, màn hình quan sát', qty: '/Bộ', status: 'TỐT', note: '', type: 'default' },
    { id: 18, name: 'Cảm biến dầu', qty: '', status: 'TỐT', note: '(Coca)', type: 'customer' },
    { id: 19, name: 'Bạt lót sàn, bạt chống nhiệt', qty: '', status: 'TỐT', note: '', type: 'customer' },
    { id: 20, name: 'Pallet sắt kê hàng', qty: '', status: 'TỐT', note: '(Pepsi)', type: 'customer' },
    { id: 21, name: 'Bạt chống nhiệt thùng xe', qty: '', status: 'TỐT', note: '(Coca)', type: 'customer' },
    { id: 22, name: 'Xe đẩy hàng', qty: '', status: 'TỐT', note: '(Coca; Lavie Win, ST)', type: 'customer' },
    { id: 23, name: 'Gương cầu đầu xe', qty: '', status: 'TỐT', note: '(Coca - xe nhỏ)', type: 'customer' },
    { id: 24, name: 'Thanh V', qty: '', status: 'TỐT', note: '(Xe > 8t; Coca; Pepsi)', type: 'customer' },
    { id: 25, name: 'Dây tăng', qty: '', status: 'TỐT', note: '(Xe > 8t; Coca; Pepsi)', type: 'customer' },
    { id: 26, name: 'Băng chống trượt trên mép thùng xe', qty: '', status: 'TỐT', note: '(Coca)', type: 'customer' },
    { id: 27, name: 'Vách ngăn giữa, dọc thùng xe', qty: '', status: 'TỐT', note: '(Coca xe to)', type: 'customer' },
  ]);

  const addRow = () => {
    setEquips([...equips, { id: Date.now(), name: '', qty: '', status: 'TỐT', note: '', type: 'custom' }]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal" style={{ maxWidth: '1200px', width: '95%', maxHeight: '95vh', display: 'flex', flexDirection: 'column', transform: 'translateY(120px)' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h3>BẢNG 7 & 8: CÔNG CỤ, PHƯƠNG TIỆN KÈM THEO</h3>
            <div className="plate-selector" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '10px' }}>
              <span style={{ fontSize: '12px', color: '#aaa' }}>Biển số xe:</span>
              <select
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 'bold', outline: 'none', cursor: 'pointer', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '10px' }}
              >
                <option value="" style={{ background: '#1e293b' }}>-- Chọn xe --</option>
                {mockVehicles.map(v => <option key={v.id} value={v.plate} style={{ background: '#1e293b' }}>{v.plate}</option>)}
              </select>
              <input
                type="text"
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                placeholder="Hoặc nhập biển số..."
                className="glass-input-sm"
                style={{ width: '150px', background: 'transparent', border: 'none', color: '#fbbf24', fontWeight: 'bold', height: 'auto', padding: '0' }}
              />
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
          <table className="maintenance-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #64748b' }}>
            <thead>
              <tr style={{ background: 'rgba(251, 146, 60, 0.2)', position: 'sticky', top: 0, zIndex: 5 }}>
                <th style={{ width: '50px', padding: '12px', border: '1px solid #64748b', color: '#fb923c' }}>STT</th>
                <th style={{ width: '300px', padding: '12px', border: '1px solid #64748b', color: '#fb923c', textAlign: 'left' }}>Tên công cụ, phương tiện</th>
                <th style={{ width: '80px', padding: '12px', border: '1px solid #64748b', color: '#fb923c' }}>SL</th>
                <th style={{ width: '130px', padding: '12px', border: '1px solid #64748b', color: '#fb923c' }}>Tình trạng</th>
                <th style={{ padding: '12px', border: '1px solid #64748b', color: '#fb923c' }}>Ghi chú / Nhãn hàng</th>
                <th style={{ width: '50px', padding: '12px', border: '1px solid #64748b', color: '#fb923c' }}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {equips.map((item, index) => (
                <tr key={item.id} style={{ background: item.type === 'customer' ? 'rgba(56, 189, 248, 0.05)' : 'transparent' }}>
                  <td style={{ padding: '8px 15px', border: '1px solid #64748b', textAlign: 'center', color: '#fff' }}>{index + 1}</td>
                  <td style={{ padding: '8px 15px', border: '1px solid #64748b' }}>
                    <input type="text" defaultValue={item.name} className="glass-input-sm" style={{ width: '100%', color: item.type === 'customer' ? '#1d4ed8' : '#000' }} />
                  </td>
                  <td style={{ padding: '8px 15px', border: '1px solid #64748b' }}>
                    <input type="text" defaultValue={item.qty} className="glass-input-sm" style={{ width: '100%', textAlign: 'center' }} />
                  </td>
                  <td style={{ padding: '8px 15px', border: '1px solid #64748b' }}>
                    <select
                      defaultValue={item.status}
                      className="glass-input-sm"
                      style={{
                        width: '100%',
                        background: '#fff',
                        color: item.status === 'HỎNG' ? '#ef4444' : (item.status === 'BÌNH THƯỜNG' ? '#b45309' : '#15803d'),
                        fontWeight: 'bold'
                      }}
                    >
                      <option value="TỐT">TỐT</option>
                      <option value="BÌNH THƯỜNG">BÌNH THƯỜNG</option>
                      <option value="HỎNG">HỎNG</option>
                      <option value="THIẾU">THIẾU</option>
                    </select>
                  </td>
                  <td style={{ padding: '8px 15px', border: '1px solid #64748b' }}>
                    <input type="text" defaultValue={item.note} className="glass-input-sm" style={{ width: '100%' }} />
                  </td>
                  <td style={{ padding: '8px 15px', border: '1px solid #64748b', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => setEquips(equips.filter(e => e.id !== item.id))}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-glass sm" style={{ marginTop: '15px', color: '#fb923c' }} onClick={addRow}>+ Thêm mục mới</button>
        </div>

        <div className="modal-footer">
          <button className="btn-glass outline" onClick={onClose}>HỦY BỎ</button>
          <button className="btn-3d-action orange sm-btn" style={{ width: 'auto', padding: '0 20px' }}>
            <div className="btn-content">
              <span className="btn-text">Lưu/Cập nhật</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VehiclesModule() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);

  return (
    <div className="module-container">
      {isAddModalOpen && <VehicleFormModal onClose={() => setIsAddModalOpen(false)} />}
      {isDocsModalOpen && <VehicleDocumentsModal onClose={() => setIsDocsModalOpen(false)} />}
      {isEquipModalOpen && <VehicleEquipmentsModal onClose={() => setIsEquipModalOpen(false)} />}

      <div className="module-toolbar">
        <h2 className="module-title">QUẢN LÝ THÔNG TIN XE</h2>
        <div className="toolbar-actions">
          <input type="text" className="search-input glass" placeholder="🔍 Tìm theo biển số..." />
          <button className="btn-3d-action blue sm-btn" style={{ marginRight: '10px' }} onClick={() => setIsDocsModalOpen(true)}>
            <div className="btn-content">
              <span className="btn-icon">📄</span>
              <span className="btn-text">GIẤY TỜ XE</span>
            </div>
          </button>
          <button className="btn-3d-action orange sm-btn" style={{ marginRight: '10px' }} onClick={() => setIsEquipModalOpen(true)}>
            <div className="btn-content">
              <span className="btn-icon">🔧</span>
              <span className="btn-text">CÔNG CỤ KÈM THEO</span>
            </div>
          </button>
          <button className="btn-3d-action green sm-btn" onClick={() => setIsAddModalOpen(true)}>
            <div className="btn-content">
              <span className="btn-icon">➕</span>
              <span className="btn-text">THÊM XE</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid thẻ xe theo chuẩn Mobile First */}
      <div className="vehicles-grid">
        {mockVehicles.map((v) => (
          <div key={v.id} className="vehicle-card glass">

            {/* Header: Biển số & Trạng thái */}
            <div className="v-card-header">
              <div className="v-plate">
                <span className="plate-bg">{v.plate}</span>
              </div>
              <div className={`v-status ${v.status}`}>
                {v.status === 'active' ? '🟢 HOẠT ĐỘNG' : '🛠️ BẢO DƯỠNG'}
              </div>
            </div>

            {/* Body: Thông tin cơ bản */}
            <div className="v-card-body">
              <div className="v-badges">
                <span className="badge company">{v.company}</span>
                <span className="badge team">{v.team}</span>
                <span className="badge brand">{v.brand}</span>
              </div>

              <div className="v-main-info">
                <div className="info-block">
                  <span className="info-label">TẢI TRỌNG</span>
                  <span className="info-val highlight">{v.capacity}</span>
                </div>
                <div className="info-block text-right">
                  <span className="info-label">ODO HIỆN TẠI</span>
                  <span className="info-val">{v.odo}</span>
                </div>
              </div>
            </div>

            {/* Footer: Thông tin kỹ thuật chi tiết */}
            <div className="v-card-footer">
              <details className="v-details-dropdown">
                <summary>Xem chi tiết kỹ thuật ▾</summary>
                <div className="v-tech-grid">
                  <div className="tech-item"><span>Khung:</span> {v.chassis}</div>
                  <div className="tech-item"><span>Máy:</span> {v.engine}</div>
                  <div className="tech-item"><span>Kích thước:</span> {v.dimensions}</div>
                  <div className="tech-item"><span>Lốp:</span> {v.tire}</div>
                  <div className="tech-item"><span>SX:</span> {v.year} (Hạn: {v.expiry})</div>
                  <div className="tech-item"><span>Màu:</span> {v.color}</div>
                </div>
              </details>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

