import React, { useState, useEffect } from 'react';

// Dữ liệu giả lập theo file.md
const mockTrackingData = [
  { id: 1, plate: '29E-043.44', checkVehicle: '109.647', grease: '9.662', engineOil: '0', oilFilter: '0', fuelFilter: '3.747', airFilter: '3.747', axleOil: '33.705', gearboxOil: '33.705', brakeFluid: '3.747', clutchFluid: '109.647', powerSteeringFluid: '109.647', acMaintenance: '109.647', starterMaintenance: '33.705', alternatorMaintenance: '109.647', radiatorFlush: '109.647', clutchDisc: '30.240', pressurePlate: '109.647', powerSteeringBelt: '109.647', alternatorBelt: '109.647', acBelt: '109.647', frontWheels: '3.747', rearWheels: '3.747' },
  { id: 2, plate: '29E-138.73', checkVehicle: '44.708', grease: '44.708', engineOil: '42.502', oilFilter: '42.502', fuelFilter: '44.708', airFilter: '44.708', axleOil: '44.708', gearboxOil: '44.708', brakeFluid: '44.708', clutchFluid: '44.708', powerSteeringFluid: '44.708', acMaintenance: '44.708', starterMaintenance: '44.708', alternatorMaintenance: '44.708', radiatorFlush: '44.708', clutchDisc: '44.708', pressurePlate: '44.708', powerSteeringBelt: '44.708', alternatorBelt: '44.708', acBelt: '44.708', frontWheels: '44.708', rearWheels: '44.708' },
  { id: 3, plate: '29E-216.38', checkVehicle: '27.973', grease: '21.609', engineOil: '1.592', oilFilter: '11.802', fuelFilter: '27.973', airFilter: '27.973', axleOil: '27.973', gearboxOil: '27.973', brakeFluid: '27.973', clutchFluid: '27.973', powerSteeringFluid: '27.973', acMaintenance: '27.973', starterMaintenance: '27.973', alternatorMaintenance: '27.973', radiatorFlush: '27.973', clutchDisc: '27.973', pressurePlate: '27.973', powerSteeringBelt: '27.973', alternatorBelt: '27.973', acBelt: '27.973', frontWheels: '27.973', rearWheels: '27.973' },
  { id: 4, plate: '29E-216.49', checkVehicle: '17.343', grease: '17.343', engineOil: '11.720', oilFilter: '11.720', fuelFilter: '11.720', airFilter: '17.343', axleOil: '17.343', gearboxOil: '17.343', brakeFluid: '17.343', clutchFluid: '17.343', powerSteeringFluid: '17.343', acMaintenance: '17.343', starterMaintenance: '17.343', alternatorMaintenance: '17.343', radiatorFlush: '17.343', clutchDisc: '17.343', pressurePlate: '17.343', powerSteeringBelt: '17.343', alternatorBelt: '17.343', acBelt: '17.343', frontWheels: '11.720', rearWheels: '11.720' }
];

const configItems = [
  { label: 'Kiểm tra xe', km: '5.000', days: '30' },
  { label: 'Bơm mỡ', km: '5.000', days: '30' },
  { label: 'Thay nhớt', km: '10.000', days: '30' },
  { label: 'Lọc nhớt', km: '20.000', days: '60' },
  { label: 'Lọc dầu', km: '30.000', days: '90' },
  { label: 'Lọc gió', km: '60.000', days: '180' },
  { label: 'Dầu cầu', km: '60.000', days: '180' },
  { label: 'Dầu số', km: '60.000', days: '180' },
  { label: 'Dầu phanh', km: '60.000', days: '180' },
  { label: 'Xúc bô/EGR/Két gió', km: '60.000', days: '180' },
  { label: 'Dầu trợ lực', km: '60.000', days: '180' },
  { label: 'BD điều hoà', km: '60.000', days: '180' },
  { label: 'BD củ đề', km: '60.000', days: '180' },
  { label: 'BD máy phát', km: '60.000', days: '180' },
  { label: 'Xúc két nước', km: '60.000', days: '180' },
  { label: 'Lá côn', km: '60.000', days: '180' },
  { label: 'Bàn ép', km: '60.000', days: '180' },
  { label: 'Curoa trợ lực', km: '60.000', days: '180' },
  { label: 'Curoa máy phát', km: '60.000', days: '180' },
  { label: 'Curoa điều hoà', km: '60.000', days: '180' },
  { label: 'BD 2 bánh trước', km: '40.000', days: '180' },
  { label: 'BD 2 bánh sau', km: '40.000', days: '180' }
];

// Dữ liệu giả lập GPS (Tổng KM lớn nhất đến hiện tại)
const mockGpsData = {
  '29E-043.44': 116000,
  '29E-138.73': 50000,
  '29E-216.38': 35000,
  '29E-216.49': 20000,
  '29E-626.01': 5000
};

export default function MaintenanceTrackingModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedConfigPlate, setSelectedConfigPlate] = useState('default');

  useEffect(() => {
    // Mô phỏng tải dữ liệu API
    setIsLoading(true);
    setTimeout(() => {
      setTableData(mockTrackingData);
      setIsLoading(false);
    }, 500);
  }, []);

  const displayData = tableData.filter(row => {
    if (!searchTerm) return true;
    return row.plate.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Hàm helper để render ô và tính toán logic cảnh báo bảo dưỡng
  const renderCell = (lastMaintenanceKmStr, plate, configLabel) => {
    if (!lastMaintenanceKmStr || lastMaintenanceKmStr === '-' || lastMaintenanceKmStr === '0') {
      return lastMaintenanceKmStr;
    }

    // 1. Lấy tổng kilomet lớn nhất từ GPS
    const currentMaxKm = mockGpsData[plate] || 0;

    // 2. Chuyển đổi KM lịch sử ra số
    const lastKm = parseFloat(lastMaintenanceKmStr.replace(/\./g, ''));

    // 3. Tính Diff (Số KM đã đi kể từ lần bảo dưỡng đó)
    const diff = currentMaxKm - lastKm;

    // 4. Kiểm tra Cấu hình bảo dưỡng
    const config = configItems.find(c => c.label === configLabel);
    let isWarning = false;
    let thresholdStr = 'N/A';

    if (config) {
      thresholdStr = config.km;
      const threshold = parseFloat(config.km.replace(/\./g, ''));
      if (diff >= threshold) {
        isWarning = true;
      }
    }

    const diffDisplay = new Intl.NumberFormat('vi-VN').format(diff);

    if (isWarning) {
      return (
        <div title={`Cảnh báo: Đã vượt định mức bảo dưỡng (${thresholdStr} km).\nMốc bảo dưỡng cũ: ${lastMaintenanceKmStr} km`}>
          <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{diffDisplay} km</span>
          <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '3px', fontWeight: 'bold', background: 'rgba(239, 68, 68, 0.1)', padding: '2px', borderRadius: '4px' }}>
            ⚠️ Quá hạn
          </div>
        </div>
      );
    }

    return (
      <div title={`Mốc bảo dưỡng cũ: ${lastMaintenanceKmStr} km`}>
        <span style={{ color: '#f8fafc', fontWeight: '500', fontSize: '13px' }}>{diffDisplay} km</span>
      </div>
    );
  };

  return (
    <div className="module-container full-width-module">
      <div className="module-toolbar" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>

        {/* Nhóm Bên Trái: Tiêu đề */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h2 className="module-title" style={{ color: '#fff', margin: 0 }}>THEO DÕI LỊCH TRÌNH BẢO DƯỠNG</h2>
        </div>

        {/* Nhóm Bên Phải: Bộ lọc và Nút chức năng */}
        <div className="toolbar-actions" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 }}>
          <input
            type="text"
            className="search-input solid-input"
            placeholder="🔍 Nhập biển số xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '220px', flexShrink: 0 }}
          />
          <button className="btn-solid-action" onClick={() => setIsConfigModalOpen(true)} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)', flexShrink: 0, whiteSpace: 'nowrap' }}>
            ⚙️ CẤU HÌNH
          </button>
          <button className="btn-solid-action" onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
          }} style={{ flexShrink: 0, whiteSpace: 'nowrap', padding: '12px 20px' }}>
            🔄 LÀM MỚI
          </button>
        </div>
      </div>

      <div className="maintenance-content" style={{ position: 'relative' }}>

        {/* Lớp phủ Loading */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Bảng Excel */}
        <div className="excel-table-wrapper" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
          <table className="excel-table" style={{ tableLayout: 'fixed', width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: '130px' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
              <col style={{ width: 'calc((100% - 130px) / 11)' }} />
            </colgroup>
            <tbody>
              {displayData.length > 0 ? displayData.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Dòng 1: Tiêu đề nửa trên */}
                  <tr>
                    <td rowSpan={4} style={{ background: '#0f172a', border: '1px solid #d8c939ff', borderBottom: '3px solid #38bdf8', borderRight: '3px solid #38bdf8', textAlign: 'center', verticalAlign: 'middle', padding: '15px 10px' }}>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase' }}>Biển số xe</div>
                      <div className="fw-bold" style={{ color: '#38bdf8', fontSize: '18px', letterSpacing: '1px' }}>{row.plate}</div>
                      <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '10px', textTransform: 'uppercase' }}>Tổng KM (GPS)</div>
                      <div style={{ color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>
                        {new Intl.NumberFormat('vi-VN').format(mockGpsData[row.plate] || 0)}
                      </div>
                    </td>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Kiểm tra xe</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Bơm mỡ</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Thay nhớt</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Lọc nhớt</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Lọc dầu</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Lọc gió</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Dầu cầu</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Dầu số</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Dầu phanh</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Xúc bô/EGR/Két gió</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Dầu trợ lực</th>
                  </tr>
                  {/* Dòng 2: Số liệu nửa trên */}
                  <tr style={{ background: '#0f172a' }}>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.checkVehicle, row.plate, 'Kiểm tra xe')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.grease, row.plate, 'Bơm mỡ')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.engineOil, row.plate, 'Thay nhớt')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.oilFilter, row.plate, 'Lọc nhớt')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.fuelFilter, row.plate, 'Lọc dầu')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.airFilter, row.plate, 'Lọc gió')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.axleOil, row.plate, 'Dầu cầu')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.gearboxOil, row.plate, 'Dầu số')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.brakeFluid, row.plate, 'Dầu phanh')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.clutchFluid, row.plate, 'Xúc bô/EGR/Két gió')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff' }}>{renderCell(row.powerSteeringFluid, row.plate, 'Dầu trợ lực')}</td>
                  </tr>
                  {/* Dòng 3: Tiêu đề nửa dưới */}
                  <tr>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>BD điều hoà</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>BD củ đề</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>BD máy phát</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Xúc két nước</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Lá côn</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Bàn ép</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Curoa trợ lực</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Curoa máy phát</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>Curoa điều hoà</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>BD 2 bánh trước</th>
                    <th style={{ background: '#1e3a8a', color: '#f8fafc', fontSize: '11px', padding: '6px 5px', textAlign: 'right', border: '1px solid #d8c939ff', fontWeight: '600' }}>BD 2 bánh sau</th>
                  </tr>
                  {/* Dòng 4: Số liệu nửa dưới */}
                  <tr style={{ background: '#0f172a' }}>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.acMaintenance, row.plate, 'BD điều hoà')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.starterMaintenance, row.plate, 'BD củ đề')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.alternatorMaintenance, row.plate, 'BD máy phát')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.radiatorFlush, row.plate, 'Xúc két nước')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.clutchDisc, row.plate, 'Lá côn')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.pressurePlate, row.plate, 'Bàn ép')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.powerSteeringBelt, row.plate, 'Curoa trợ lực')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.alternatorBelt, row.plate, 'Curoa máy phát')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.acBelt, row.plate, 'Curoa điều hoà')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.frontWheels, row.plate, 'BD 2 bánh trước')}</td>
                    <td style={{ padding: '10px 5px', fontSize: '13px', textAlign: 'right', border: '1px solid #d8c939ff', borderBottom: '3px solid #0aa5ecff' }}>{renderCell(row.rearWheels, row.plate, 'BD 2 bánh sau')}</td>
                  </tr>
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    Không tìm thấy xe nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal Cấu hình bảo dưỡng */}
      {isConfigModalOpen && (
        <div className="modal-overlay" onClick={() => setIsConfigModalOpen(false)}>
          <div className="glass-modal" onClick={e => e.stopPropagation()} style={{ width: '95%', maxWidth: '1200px' }}>
            <div className="modal-header">
              <h3>⚙️ CẤU HÌNH ĐỊNH MỨC BẢO DƯỠNG XE</h3>
              <button className="close-btn" onClick={() => setIsConfigModalOpen(false)}>×</button>
            </div>
            <div className="modal-body" style={{ color: '#fff' }}>

              {/* Chọn biển số xe */}
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
                <label style={{ color: '#fff', fontWeight: 'bold' }}>Cấu hình cho xe:</label>
                <select
                  value={selectedConfigPlate}
                  onChange={e => setSelectedConfigPlate(e.target.value)}
                  style={{ padding: '10px 15px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #38bdf8', outline: 'none', fontWeight: 'bold', minWidth: '250px' }}
                >
                  <option value="default">⭐ MẶC ĐỊNH (Áp dụng chung)</option>
                  {mockTrackingData.map(car => (
                    <option key={car.id} value={car.plate}>{car.plate}</option>
                  ))}
                </select>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                  {selectedConfigPlate === 'default' ? '(Các xe không có cấu hình riêng sẽ dùng mốc này)' : '(Ghi đè cấu hình mặc định cho xe này)'}
                </span>
              </div>

              <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #334155', maxHeight: '50vh', overflowY: 'auto' }}>
                <table className="excel-table" style={{ width: '100%', minWidth: '2400px', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px', textAlign: 'center' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#1e3a8a', padding: '12px', borderBottom: '1px solid #334155', borderRight: '1px solid #334155', textAlign: 'left', position: 'sticky', left: 0, top: 0, zIndex: 3 }}>Loại định mức</th>
                      {configItems.map((item, idx) => (
                        <th key={idx} style={{ background: '#1e3a8a', padding: '12px', borderBottom: '1px solid #334155', borderRight: '1px solid #334155', position: 'sticky', top: 0, zIndex: 2 }}>{item.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#0f172a' }}>
                      <td style={{ padding: '15px 12px', borderBottom: '1px solid #334155', borderRight: '1px solid #334155', textAlign: 'left', fontWeight: 'bold', color: '#38bdf8', position: 'sticky', left: 0, zIndex: 1, background: '#1e293b' }}>Theo Kilomet (km)</td>
                      {configItems.map((item, idx) => (
                        <td key={idx} style={{ padding: '15px 12px', borderBottom: '1px solid #334155', borderRight: '1px solid #334155' }}>
                          <input type="text" defaultValue={item.km} style={{ width: '70px', background: 'transparent', border: '1px solid #475569', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '6px' }} />
                        </td>
                      ))}
                    </tr>
                    <tr style={{ background: '#0f172a' }}>
                      <td style={{ padding: '15px 12px', borderRight: '1px solid #334155', textAlign: 'left', fontWeight: 'bold', color: '#4ade80', position: 'sticky', left: 0, zIndex: 1, background: '#1e293b' }}>Theo Ngày (ngày)</td>
                      {configItems.map((item, idx) => (
                        <td key={idx} style={{ padding: '15px 12px', borderRight: '1px solid #334155' }}>
                          <input type="text" defaultValue={item.days} style={{ width: '70px', background: 'transparent', border: '1px solid #475569', color: '#fff', textAlign: 'center', borderRadius: '4px', padding: '6px' }} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button onClick={() => setIsConfigModalOpen(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy bỏ</button>
                <button onClick={() => setIsConfigModalOpen(false)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)' }}>💾 Lưu Cấu Hình</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
