using System.ComponentModel.DataAnnotations;
using QuanLyCongViec.Domain.Enum;
using QuanLyCongViec.Domain.SuKien;

namespace QuanLyCongViec.Domain.Entities
{
    /// <summary>
    /// Thực thể trung tâm đại diện cho một Công việc (Task)
    /// Chứa toàn bộ logic nghiệp vụ (Domain Logic) liên quan đến công việc.
    /// </summary>
    public class CongViec
    {
        // Các thuộc tính cơ bản của công việc
        public int Id { get; private set; }
        public string TieuDe { get; private set; }
        public string MoTa { get; private set; }
        public TrangThaiCongViec TrangThai { get; private set; }
        public DoUuTien MucDoUuTien { get; private set; }
        
        // Thông tin người liên quan
        public int IdNguoiTao { get; private set; }
        public int? IdNguoiDuocGiao { get; private set; }
        
        // Thời gian
        public DateTime? HanChot { get; private set; }
        public DateTime NgayTao { get; private set; }
        public DateTime? NgayCapNhat { get; private set; }
        
        // Cờ đánh dấu xóa mềm
        public bool DaXoa { get; private set; }

        // Các thuộc tính điều hướng (Dùng cho EF Core, không chứa logic nghiệp vụ)
        public NguoiDung NguoiTao { get; private set; }
        public NguoiDung NguoiDuocGiao { get; private set; }

        // Danh sách các sự kiện Domain phát sinh khi thực thể thay đổi
        private List<ISuKienDomain> _cacSuKienDomain = new();
        public IReadOnlyCollection<ISuKienDomain> CacSuKienDomain => _cacSuKienDomain.AsReadOnly();

        private CongViec() { } // Dành cho EF Core

        /// <summary>
        /// Tạo mới một công việc với các thông tin cơ bản ban đầu
        /// </summary>
        public static CongViec Tao(string tieuDe, string moTa, DoUuTien doUuTien, 
            int idNguoiTao, DateTime? hanChot)
        {
            if (string.IsNullOrWhiteSpace(tieuDe)) 
                throw new ArgumentNullException(nameof(tieuDe), "Tiêu đề công việc không được để trống.");

            var congViec = new CongViec
            {
                TieuDe = tieuDe,
                MoTa = moTa,
                MucDoUuTien = doUuTien,
                IdNguoiTao = idNguoiTao,
                TrangThai = TrangThaiCongViec.CanLam,
                HanChot = hanChot,
                NgayTao = DateTime.UtcNow,
                DaXoa = false
            };

            // Ghi nhận sự kiện tạo mới công việc
            congViec._cacSuKienDomain.Add(new SuKienCongViecDaTao(congViec));
            return congViec;
        }

        /// <summary>
        /// Giao công việc cho một người dùng cụ thể
        /// </summary>
        public void GiaoCho(int idNguoiDung, int idNguoiThucHienGiao)
        {
            if (DaXoa) throw new InvalidOperationException("Không thể sửa đổi công việc đã bị xóa.");
            if (idNguoiThucHienGiao == idNguoiDung) 
                throw new Exception("Quản lý không thể tự giao công việc cho chính mình.");

            IdNguoiDuocGiao = idNguoiDung;
            NgayCapNhat = DateTime.UtcNow;

            // Ghi nhận sự kiện giao việc
            _cacSuKienDomain.Add(new SuKienCongViecDaGiao(this, idNguoiDung));
        }

        /// <summary>
        /// Thay đổi trạng thái hiện tại của công việc
        /// </summary>
        public void ThayDoiTrangThai(TrangThaiCongViec trangThaiMoi, int idNguoiThayDoi, VaiTroNguoiDung vaiTro)
        {
            if (DaXoa) throw new InvalidOperationException("Không thể sửa đổi công việc đã bị xóa.");

            // Quy tắc nghiệp vụ: Chỉ Admin hoặc Quản lý mới có quyền Hủy công việc
            if (trangThaiMoi == TrangThaiCongViec.DaHuy && vaiTro != VaiTroNguoiDung.QuanTriVien && vaiTro != VaiTroNguoiDung.QuanLy)
                throw new Exception("Chỉ Quản trị viên hoặc Quản lý mới có quyền hủy công việc.");

            // Người dùng chỉ được thay đổi trạng thái công việc của chính mình (được giao)
            if (IdNguoiDuocGiao != idNguoiThayDoi && vaiTro != VaiTroNguoiDung.QuanTriVien && vaiTro != VaiTroNguoiDung.QuanLy)
                throw new Exception("Bạn chỉ có thể thay đổi trạng thái của công việc được giao cho mình.");

            var trangThaiCu = TrangThai;
            TrangThai = trangThaiMoi;
            NgayCapNhat = DateTime.UtcNow;

            // Ghi nhận sự kiện thay đổi trạng thái
            _cacSuKienDomain.Add(new SuKienTrangThaiCongViecThayDoi(this, trangThaiCu, trangThaiMoi, idNguoiThayDoi));
        }

        /// <summary>
        /// Cập nhật các thông tin chi tiết của công việc
        /// </summary>
        public void CapNhatChiTiet(string tieuDe, string moTa, DoUuTien doUuTien, DateTime? hanChot, int idNguoiThayDoi)
        {
            if (DaXoa) throw new InvalidOperationException("Công việc đã bị xóa.");

            TieuDe = tieuDe;
            MoTa = moTa;
            MucDoUuTien = doUuTien;
            HanChot = hanChot;
            NgayCapNhat = DateTime.UtcNow;

            _cacSuKienDomain.Add(new SuKienCongViecDaCapNhat(this, idNguoiThayDoi));
        }

        /// <summary>
        /// Thực hiện xóa mềm công việc khỏi hệ thống
        /// </summary>
        public void XoaMem(int idNguoiXoa)
        {
            DaXoa = true;
            NgayCapNhat = DateTime.UtcNow;
            _cacSuKienDomain.Add(new SuKienCongViecDaXoa(this, idNguoiXoa));
        }

        /// <summary>
        /// Làm sạch danh sách các sự kiện domain sau khi đã được xử lý
        /// </summary>
        public void XoaCacSuKien() => _cacSuKienDomain.Clear();
    }
}
