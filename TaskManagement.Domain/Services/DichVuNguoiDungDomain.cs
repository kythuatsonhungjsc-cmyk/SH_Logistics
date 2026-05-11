using QuanLyCongViec.Domain.Entities;
using QuanLyCongViec.Domain.Enum;

namespace QuanLyCongViec.Domain.Services
{
    /// <summary>
    /// Dịch vụ Domain chứa các quy tắc nghiệp vụ phức tạp liên quan đến Người dùng
    /// mà bản thân thực thể NguoiDung không thể tự quyết định.
    /// </summary>
    public class DichVuNguoiDungDomain
    {
        /// <summary>
        /// Kiểm tra xem một Admin có quyền xóa một người dùng mục tiêu hay không
        /// </summary>
        public void KiemTraQuyenXoa(NguoiDung nguoiThucHien, NguoiDung nguoiMucTieu, bool laAdminCuoiCung)
        {
            // Quy tắc: Không được tự xóa chính mình
            if (nguoiThucHien.Id == nguoiMucTieu.Id)
                throw new Exception("Bạn không thể tự xóa tài khoản của chính mình.");

            // Quy tắc: Không được xóa Admin cuối cùng của hệ thống
            if (nguoiMucTieu.VaiTro == VaiTroNguoiDung.QuanTriVien && laAdminCuoiCung)
                throw new Exception("Không thể xóa Quản trị viên cuối cùng của hệ thống.");
        }

        /// <summary>
        /// Kiểm tra quyền thay đổi vai trò
        /// </summary>
        public void KiemTraQuyenThayDoiVaiTro(NguoiDung nguoiThucHien, NguoiDung nguoiMucTieu)
        {
            if (nguoiThucHien.Id == nguoiMucTieu.Id)
                throw new Exception("Bạn không thể tự thay đổi vai trò của chính mình.");
        }
    }
}
