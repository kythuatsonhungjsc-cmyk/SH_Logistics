/**
 * ============================================================================
 * SH Logistics - Bộ chuyển đổi dữ liệu API ↔ UI
 * Tập trung tất cả logic biến đổi dữ liệu từ API backend sang cấu trúc
 * mà các component UI cần hiển thị.
 * ============================================================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. MAINTENANCE TRACKING MODULE - Pivot từ flat list → ma trận xe × hạng mục
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bản đồ ánh xạ: Tên hạng mục bảo dưỡng (tiếng Việt) → tên trường trong bảng UI
 * 
 * API trả về: { hangMucBaoDuong: "Thay nhớt", kmBaoDuong: "26.381" }
 * UI cần:     { engineOil: "26.381" }
 */
const MAINTENANCE_FIELD_MAP = {
  'Kiểm tra xe':         'checkVehicle',
  'Bơm mỡ':             'grease',
  'Thay nhớt':           'engineOil',
  'Lọc nhớt':            'oilFilter',
  'Lọc dầu':             'fuelFilter',
  'Lọc gió':             'airFilter',
  'Dầu cầu':             'axleOil',
  'Dầu số':              'gearboxOil',
  'Dầu phanh':           'brakeFluid',
  'Xúc bô/EGR/Két gió': 'clutchFluid',
  'Xúc bô':              'clutchFluid',       // Tên rút gọn từ dữ liệu nhập
  'Dầu trợ lực':         'powerSteeringFluid',
  'BD điều hoà':         'acMaintenance',
  'BD củ đề':            'starterMaintenance',
  'BD máy phát':         'alternatorMaintenance',
  'Xúc két nước':        'radiatorFlush',
  'Lá côn':              'clutchDisc',
  'Bàn ép':              'pressurePlate',
  'Curoa trợ lực':       'powerSteeringBelt',
  'Curoa máy phát':      'alternatorBelt',
  'Curoa điều hoà':      'acBelt',
  'BD 2 bánh trước':     'frontWheels',
  'BD 2 bánh sau':       'rearWheels',
};

/**
 * Tất cả các trường bảo dưỡng có thể có (để khởi tạo giá trị mặc định)
 */
const ALL_TRACKING_FIELDS = [
  'checkVehicle', 'grease', 'engineOil', 'oilFilter', 'fuelFilter', 'airFilter',
  'axleOil', 'gearboxOil', 'brakeFluid', 'clutchFluid', 'powerSteeringFluid',
  'acMaintenance', 'starterMaintenance', 'alternatorMaintenance', 'radiatorFlush',
  'clutchDisc', 'pressurePlate', 'powerSteeringBelt', 'alternatorBelt', 'acBelt',
  'frontWheels', 'rearWheels',
];

/**
 * Chuyển đổi KM string thành số để so sánh
 * "105.900" → 105900
 * "26.381"  → 26381
 */
function parseKm(kmStr) {
  if (!kmStr || kmStr === '-' || kmStr === '0') return 0;
  return parseFloat(String(kmStr).replace(/\./g, '')) || 0;
}

/**
 * Hàm chính: Chuyển đổi danh sách phẳng từ API → dạng ma trận cho bảng theo dõi
 * 
 * Input (từ API /api/maintenance/history):
 * [
 *   { bienSoXe: "29E-043.44", hangMucBaoDuong: "Thay nhớt", kmBaoDuong: "105.900", ... },
 *   { bienSoXe: "29E-043.44", hangMucBaoDuong: "BD 2 bánh sau", kmBaoDuong: "105.900", ... },
 *   { bienSoXe: "29E-216.38", hangMucBaoDuong: "Thay nhớt", kmBaoDuong: "26.381", ... },
 * ]
 * 
 * Output (cho MaintenanceTrackingModule):
 * [
 *   { id: 1, plate: "29E-043.44", engineOil: "105.900", rearWheels: "105.900", ... },
 *   { id: 2, plate: "29E-216.38", engineOil: "26.381", ... },
 * ]
 */
export function transformMaintenanceToTracking(apiData) {
  if (!apiData || apiData.length === 0) return [];

  // Bước 1: Nhóm dữ liệu theo biển số xe
  const vehicleMap = {};

  apiData.forEach(record => {
    const plate = record.bienSoXe;
    if (!plate) return;

    // Khởi tạo bản ghi xe nếu chưa có
    if (!vehicleMap[plate]) {
      vehicleMap[plate] = {};
      ALL_TRACKING_FIELDS.forEach(field => {
        vehicleMap[plate][field] = '0';
      });
    }

    // Bước 2: Tìm tên trường UI tương ứng với hạng mục bảo dưỡng
    const hangMuc = record.hangMucBaoDuong;
    if (!hangMuc) return;

    const fieldName = MAINTENANCE_FIELD_MAP[hangMuc];
    if (!fieldName) return; // Hạng mục không có trong bản đồ → bỏ qua

    // Bước 3: Chỉ lưu KM cao nhất (lần bảo dưỡng gần nhất)
    const newKm = parseKm(record.kmBaoDuong);
    const existingKm = parseKm(vehicleMap[plate][fieldName]);

    if (newKm > existingKm) {
      vehicleMap[plate][fieldName] = record.kmBaoDuong;
    }
  });

  // Bước 4: Chuyển đổi từ Map → Array cho React render
  return Object.entries(vehicleMap).map(([plate, fields], index) => ({
    id: index + 1,
    plate,
    ...fields,
  }));
}


// ═══════════════════════════════════════════════════════════════════════════
// 2. MAINTENANCE MODULE - Chuyển đổi dữ liệu lịch sử bảo dưỡng
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chuyển đổi dữ liệu API sang định dạng bảng lịch sử bảo dưỡng
 * Và lọc theo tháng/năm chỉ định.
 * 
 * Input: Dữ liệu từ API + tháng + năm mục tiêu
 * Output: Mảng đã lọc theo tháng
 */
export function transformMaintenanceHistory(apiData, targetMonth, targetYear) {
  if (!apiData || apiData.length === 0) return [];

  return apiData
    .filter(record => {
      // Lọc theo tháng/năm (định dạng API: "dd/MM/yyyy")
      const dateParts = record.ngaySuaChua?.split('/');
      if (!dateParts || dateParts.length !== 3) return false;
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      return month === targetMonth && year === targetYear;
    })
    .map((record, index) => ({
      id: record.id || index + 1,
      idHoaDon: record.idHoaDon || '',
      ngaySuaChua: record.ngaySuaChua,
      bienSoXe: record.bienSoXe,
      noiDung: record.noiDung,
      hangMucBaoDuong: record.hangMucBaoDuong || '',
      kmBaoDuong: record.kmBaoDuong,
      soTien: record.soTien,
      vat: record.vat,
      tongTien: record.tongTien,
      gara: record.gara,
      hinhThuc: record.hinhThuc,
      phuTrach: record.phuTrach,
    }));
}

/**
 * Chuyển dữ liệu mock (format cũ) sang format API
 */
export function transformMockToApiFormat(mockData) {
  return mockData.map(item => ({
    id: item.id,
    idHoaDon: item.idHoaDon || `MOCK-${item.id}`,
    ngaySuaChua: item.date || item.ngaySuaChua,
    bienSoXe: item.plate || item.bienSoXe,
    noiDung: item.content || item.noiDung,
    hangMucBaoDuong: item.maintenancePart || item.hangMucBaoDuong || '',
    kmBaoDuong: item.km || item.kmBaoDuong,
    soTien: item.amount || item.soTien,
    vat: item.vat || '',
    tongTien: item.total || item.tongTien,
    gara: item.garage || item.gara,
    hinhThuc: item.method || item.hinhThuc,
    phuTrach: item.PIC || item.phuTrach,
  }));
}


// ═══════════════════════════════════════════════════════════════════════════
// 3. DASHBOARD MODULE - Tổng hợp thống kê từ dữ liệu thực
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tính toán số liệu thống kê dashboard từ danh sách xe và lịch sử bảo dưỡng
 * 
 * Input: { vehicles: [...], maintenanceHistory: [...] }
 * Output: { totalVehicles, active, inMaintenance, alerts, monthlyCost }
 */
export function calculateDashboardStats(vehicles = [], maintenanceHistory = []) {
  const totalVehicles = vehicles.length;
  const inMaintenance = vehicles.filter(v => v.status === 'maintenance').length;
  const active = vehicles.filter(v => v.status === 'active').length;
  const inactive = totalVehicles - active - inMaintenance;

  // Tính tổng chi phí bảo dưỡng tháng hiện tại
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const thisMonthRecords = maintenanceHistory.filter(record => {
    const dateParts = record.ngaySuaChua?.split('/');
    if (!dateParts || dateParts.length !== 3) return false;
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    return month === currentMonth && year === currentYear;
  });

  const monthlyCost = thisMonthRecords.reduce((sum, record) => {
    const cost = parseFloat(String(record.tongTien || record.total || '0').replace(/\./g, '')) || 0;
    return sum + cost;
  }, 0);

  return {
    totalVehicles,
    active,
    inMaintenance,
    inactive,
    monthlyCost,
    totalMaintenanceRecords: maintenanceHistory.length,
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// 4. VEHICLES MODULE - Chuyển đổi dữ liệu xe
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chuẩn hóa dữ liệu xe từ API (khi có endpoint)
 * Hiện tại dùng mock data, hàm này sẵn sàng cho khi backend mở rộng
 */
export function transformVehicleData(apiVehicle) {
  return {
    id: apiVehicle.id?.toString() || '',
    plate: apiVehicle.bienSoXe || apiVehicle.plate || '',
    company: apiVehicle.congTy || apiVehicle.company || '',
    team: apiVehicle.doiXe || apiVehicle.team || '',
    brand: apiVehicle.hangXe || apiVehicle.brand || '',
    capacity: apiVehicle.taiTrong || apiVehicle.capacity || '',
    dimensions: apiVehicle.kichThuoc || apiVehicle.dimensions || '',
    tire: apiVehicle.loaiLop || apiVehicle.tire || '',
    chassis: apiVehicle.soKhung || apiVehicle.chassis || '',
    engine: apiVehicle.soMay || apiVehicle.engine || '',
    year: apiVehicle.namSanXuat || apiVehicle.year || '',
    expiry: apiVehicle.nienHan || apiVehicle.expiry || '',
    color: apiVehicle.mauSon || apiVehicle.color || '',
    odo: apiVehicle.soKmHienTai || apiVehicle.odo || '',
    status: apiVehicle.trangThai || apiVehicle.status || 'active',
  };
}

/**
 * Chuyển đổi danh sách xe từ API
 */
export function transformVehicleList(apiData) {
  if (!apiData || apiData.length === 0) return [];
  return apiData.map(transformVehicleData);
}


// ═══════════════════════════════════════════════════════════════════════════
// 5. DRIVERS MODULE - Chuyển đổi dữ liệu lái xe
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chuẩn hóa dữ liệu lái xe từ API (khi có endpoint)
 */
export function transformDriverData(apiDriver) {
  return {
    id: apiDriver.id?.toString() || '',
    fullName: apiDriver.hoTen || apiDriver.fullName || '',
    avatarUrl: apiDriver.anhDaiDien || apiDriver.avatarUrl || '',
    phone: apiDriver.soDienThoai || apiDriver.phone || '',
    address: apiDriver.diaChi || apiDriver.address || '',
    citizenId: apiDriver.soCCCD || apiDriver.citizenId || '',
    licenseType: apiDriver.loaiBangLai || apiDriver.licenseType || '',
    licenseNumber: apiDriver.soGPLX || apiDriver.licenseNumber || '',
    licenseIssuePlace: apiDriver.noiCap || apiDriver.licenseIssuePlace || '',
    licenseIssueDate: apiDriver.ngayCap || apiDriver.licenseIssueDate || '',
    licenseExpiryDate: apiDriver.ngayHetHan || apiDriver.licenseExpiryDate || '',
    company: apiDriver.congTy || apiDriver.company || '',
    team: apiDriver.doiXe || apiDriver.team || '',
    status: apiDriver.trangThai || apiDriver.status || 'working',
  };
}

/**
 * Chuyển đổi danh sách lái xe từ API
 */
export function transformDriverList(apiData) {
  if (!apiData || apiData.length === 0) return [];
  return apiData.map(transformDriverData);
}


// ═══════════════════════════════════════════════════════════════════════════
// 6. UTILITY FUNCTIONS - Hàm tiện ích dùng chung
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format số tiền VNĐ
 * 1500000 → "1.500.000"
 */
export function formatVND(amount) {
  if (amount == null || isNaN(amount)) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Format số KM
 * 105900 → "105.900"
 */
export function formatKm(km) {
  if (km == null || isNaN(km)) return '0';
  return new Intl.NumberFormat('vi-VN').format(km);
}

/**
 * Xuất bản đồ hạng mục (để dùng trong các module khác nếu cần)
 */
export { MAINTENANCE_FIELD_MAP, ALL_TRACKING_FIELDS };
