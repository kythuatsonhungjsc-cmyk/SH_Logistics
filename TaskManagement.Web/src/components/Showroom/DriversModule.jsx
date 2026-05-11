import React, { useState } from 'react';

// Component Khu vực tải ảnh thông minh (Responsive Image Upload Zone)
const GlassUploadZone = ({ label, ratio = '16/9', isAvatar = false }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Giới hạn định dạng JPG, PNG
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Lỗi: Chỉ cho phép tải lên ảnh định dạng JPG hoặc PNG!');
      e.target.value = ''; // Reset input
      return;
    }

    // Xử lý nén và tối ưu kích thước ảnh bằng Canvas
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Tối ưu kích thước tối đa (Width)
        const MAX_HEIGHT = 800; // Tối ưu kích thước tối đa (Height)
        let width = img.width;
        let height = img.height;

        // Tính toán tỷ lệ thu nhỏ nếu ảnh quá lớn
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất ảnh ra Base64 định dạng JPEG với mức nén 70% (tối ưu dung lượng)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(compressedDataUrl);
      };
    };
  };

  return (
    <div className={`form-group ${isAvatar ? '' : 'full-width'}`}>
      <label>{label}</label>
      <div 
        className={`glass-upload-zone ${isAvatar ? 'avatar-zone' : ''}`} 
        style={{ aspectRatio: ratio }}
      >
        <input 
          type="file" 
          accept=".jpg,.jpeg,.png,image/jpeg,image/png" 
          className="upload-input" 
          onChange={handleImageChange}
        />
        {!preview && (
          <div className="upload-content">
            <span className="upload-icon">{isAvatar ? '👤' : '📸'}</span>
            <span className="upload-text">Nhấn hoặc Kéo thả ảnh (Chỉ JPG, PNG)</span>
          </div>
        )}
        {preview && (
          <img src={preview} alt="preview" className="upload-preview" />
        )}
      </div>
    </div>
  );
};

// Component Form Thêm Lái Xe
const DriverFormModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal" style={{ maxWidth: '850px' }}>
        <div className="modal-header">
          <h3>THÊM HỒ SƠ LÁI XE</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <form className="vehicle-form">
            
            {/* NHÓM 1: THÔNG TIN CÁ NHÂN */}
            <h4 className="form-section-title full-width">1. Thông tin cá nhân</h4>
            
            <GlassUploadZone label="Ảnh chân dung *" ratio="1/1" isAvatar={true} />
            
            <div className="form-group">
              <label>Họ và Tên lái xe *</label>
              <input type="text" placeholder="Ví dụ: Nguyễn Sơn Linh" className="glass-input" />
              
              <label style={{marginTop: '15px'}}>Số điện thoại *</label>
              <input type="tel" placeholder="Ví dụ: 094123546" className="glass-input" />
            </div>

            <div className="form-group full-width">
              <label>Địa chỉ thường trú</label>
              <input type="text" placeholder="Nhập địa chỉ đầy đủ..." className="glass-input" />
            </div>

            <div className="form-group">
              <label>Số CCCD *</label>
              <input type="text" placeholder="Nhập 12 số CCCD..." className="glass-input" />
            </div>
            <GlassUploadZone label="Ảnh mặt trước CCCD" ratio="3/2" />
            <GlassUploadZone label="Ảnh mặt sau CCCD" ratio="3/2" />


            {/* NHÓM 2: THÔNG TIN BẰNG LÁI (GPLX) */}
            <h4 className="form-section-title full-width" style={{marginTop: '20px'}}>2. Giấy phép lái xe (GPLX)</h4>

            <div className="form-group">
              <label>Loại Bằng Lái</label>
              <input type="text" list="license-types" placeholder="B2, C, E, FC..." className="glass-input" />
              <datalist id="license-types">
                <option value="B2" />
                <option value="C" />
                <option value="D" />
                <option value="E" />
                <option value="FC" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Số GPLX</label>
              <input type="text" placeholder="Nhập số bằng lái..." className="glass-input" />
            </div>

            <div className="form-group">
              <label>Ngày cấp</label>
              <input type="date" className="glass-input" />
            </div>

            <div className="form-group">
              <label>Ngày hết hạn</label>
              <input type="date" className="glass-input" />
            </div>

            <div className="form-group full-width">
              <label>Nơi cấp</label>
              <input type="text" placeholder="Ví dụ: Sở GTVT Hà Nội" className="glass-input" />
            </div>

            <GlassUploadZone label="Ảnh Bằng lái (Mặt trước)" ratio="3/2" />
            <GlassUploadZone label="Ảnh Bằng lái (Mặt sau)" ratio="3/2" />


            {/* NHÓM 3: CÔNG VIỆC */}
            <h4 className="form-section-title full-width" style={{marginTop: '20px'}}>3. Thông tin công tác</h4>

            <div className="form-group">
              <label>Công ty trực thuộc</label>
              <input type="text" list="companies-list" placeholder="Chọn công ty..." className="glass-input" />
            </div>

            <div className="form-group">
              <label>Đội xe</label>
              <input type="text" list="teams-list" placeholder="Chọn đội xe..." className="glass-input" />
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select className="glass-input">
                <option value="working">Đang làm việc</option>
                <option value="on_leave">Nghỉ phép</option>
                <option value="resigned">Đã nghỉ việc</option>
              </select>
            </div>

          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-glass outline" onClick={onClose}>HỦY BỎ</button>
          <button className="btn-3d-action green sm-btn" style={{width: 'auto', padding: '0 20px'}}>
            <div className="btn-content">
              <span className="btn-text">LƯU HỒ SƠ</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};


// Dữ liệu giả lập từ file.md (Bảng 4)
const mockDrivers = [
  {
    id: '1',
    fullName: 'Nguyễn Sơn Linh',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Placeholder Avatar
    phone: '094123546',
    address: '683 Nguyễn Khoái, Hoàng Mai, HN',
    citizenId: '025203001165',
    licenseType: 'B2',
    licenseNumber: '790220036551',
    licenseIssuePlace: 'GTVT Hà Nội',
    licenseIssueDate: '07/05/2025',
    licenseExpiryDate: '07/05/2035',
    company: 'SHN',
    team: 'Đội 2',
    status: 'working' // working, on_leave, resigned
  },
  {
    id: '2',
    fullName: 'Phan Văn Trung',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    phone: '0987654321',
    address: 'Hai Bà Trưng, Hà Nội',
    citizenId: '001090123456',
    licenseType: 'C',
    licenseNumber: '123456789012',
    licenseIssuePlace: 'GTVT Hà Nội',
    licenseIssueDate: '15/10/2020',
    licenseExpiryDate: '15/10/2030',
    company: 'Sơn Hùng',
    team: 'Đội 1',
    status: 'on_leave'
  }
];

export default function DriversModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="module-container">
      {isAddModalOpen && <DriverFormModal onClose={() => setIsAddModalOpen(false)} />}

      <div className="module-toolbar">
        <h2 className="module-title">QUẢN LÝ LÁI XE</h2>
        <div className="toolbar-actions">
          <input 
            type="text" 
            className="search-input glass" 
            placeholder="🔍 Tìm theo tên hoặc SĐT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-3d-action green sm-btn" onClick={() => setIsAddModalOpen(true)}>
            <div className="btn-content">
              <span className="btn-icon">👤+</span>
              <span className="btn-text">THÊM LÁI XE</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid thẻ tài xế */}
      <div className="drivers-grid">
        {mockDrivers.map((driver) => (
          <div key={driver.id} className="driver-card glass">
            
            {/* Header: Avatar, Name, Status */}
            <div className="d-card-header">
              <img src={driver.avatarUrl} alt="Avatar" className="d-avatar" />
              <div className="d-header-info">
                <h3 className="d-name">{driver.fullName}</h3>
                <div className={`d-status ${driver.status}`}>
                  {driver.status === 'working' ? '🟢 ĐANG LÀM VIỆC' : '🟡 NGHỈ PHÉP'}
                </div>
              </div>
            </div>

            {/* Body: Liên hệ & GPLX */}
            <div className="d-card-body">
              <div className="d-info-row">
                <span className="d-icon">📞</span>
                <span className="d-text highlight">{driver.phone}</span>
              </div>
              
              <div className="d-badges-row">
                <div className="d-license-badge">Bằng {driver.licenseType}</div>
                <div className="badge company">{driver.company}</div>
                <div className="badge team">{driver.team}</div>
              </div>
            </div>

            {/* Footer: Thông tin bảo mật (Dropdown) */}
            <div className="d-card-footer">
              <details className="v-details-dropdown">
                <summary>Xem hồ sơ chi tiết ▾</summary>
                <div className="v-tech-grid">
                  <div className="tech-item"><span>CCCD:</span> {driver.citizenId}</div>
                  <div className="tech-item"><span>Địa chỉ:</span> {driver.address}</div>
                  <div className="tech-item"><span>Số GPLX:</span> {driver.licenseNumber}</div>
                  <div className="tech-item"><span>Nơi cấp:</span> {driver.licenseIssuePlace}</div>
                  <div className="tech-item"><span>Ngày cấp:</span> {driver.licenseIssueDate}</div>
                  <div className="tech-item"><span>Hết hạn:</span> <strong style={{color: '#fb7185'}}>{driver.licenseExpiryDate}</strong></div>
                </div>
              </details>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
