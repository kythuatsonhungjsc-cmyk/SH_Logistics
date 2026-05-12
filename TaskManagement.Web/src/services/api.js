/**
 * ============================================================================
 * SH Logistics - API Service Layer (Tầng dịch vụ gọi API)
 * Tập trung tất cả các hàm gọi API backend tại đây.
 * Mỗi module UI chỉ cần import và sử dụng.
 * ============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Hàm gọi API chung với xử lý lỗi tập trung
 */
async function callApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Trả về response nguyên bản cho các trường hợp đặc biệt (409 Conflict)
    if (options.rawResponse) {
      return response;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API ${response.status}: ${errorText}`);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    if (error.message.startsWith('API ')) throw error;
    console.error(`❌ Lỗi kết nối API (${url}):`, error.message);
    throw new Error(`Không thể kết nối máy chủ. Vui lòng kiểm tra Backend đang chạy.`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// API cho Module Bảo dưỡng (Maintenance)
// ═══════════════════════════════════════════════════════════════════════════

export const maintenanceApi = {
  /**
   * Lấy toàn bộ lịch sử bảo dưỡng
   * GET /api/maintenance/history
   */
  getHistory: () => callApi('/maintenance/history'),

  /**
   * Tạo hóa đơn bảo dưỡng mới
   * POST /api/maintenance/invoice
   * Trả về raw response để xử lý 409 Conflict (trùng lặp)
   */
  createInvoice: (data) => fetch(`${API_BASE_URL}/maintenance/invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// API cho Module Công việc (Tasks)
// ═══════════════════════════════════════════════════════════════════════════

export const taskApi = {
  /**
   * Lấy danh sách công việc (có phân trang)
   * GET /api/tasks?soTrang=1&kichThuoc=10
   */
  getTasks: (page = 1, size = 10) => callApi(`/tasks?soTrang=${page}&kichThuoc=${size}`),

  /**
   * Phân công công việc
   * PUT /api/tasks/{id}/assign
   */
  assignTask: (id, data) => callApi(`/tasks/${id}/assign`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// API cho Module Xe (Vehicles) - Sẵn sàng khi backend mở rộng
// ═══════════════════════════════════════════════════════════════════════════

export const vehicleApi = {
  getAll: () => callApi('/vehicles'),
  getById: (id) => callApi(`/vehicles/${id}`),
  create: (data) => callApi('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => callApi(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// API cho Module Lái xe (Drivers) - Sẵn sàng khi backend mở rộng
// ═══════════════════════════════════════════════════════════════════════════

export const driverApi = {
  getAll: () => callApi('/drivers'),
  getById: (id) => callApi(`/drivers/${id}`),
  create: (data) => callApi('/drivers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// API cho Dashboard
// ═══════════════════════════════════════════════════════════════════════════

export const dashboardApi = {
  /**
   * Lấy thống kê tổng quan (hiện tại tổng hợp từ maintenance history)
   */
  getStats: () => callApi('/maintenance/history'),
};
