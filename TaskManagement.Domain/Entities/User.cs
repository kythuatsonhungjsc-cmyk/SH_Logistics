using QuanLyCongViec.Domain.Enum;

namespace QuanLyCongViec.Domain.Entities
{
    /// <summary>
    /// Thực thể người dùng với các tính năng bảo mật nâng cao (Khóa tài khoản, Vai trò)
    /// </summary>
    public class NguoiDung
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string HoTen { get; set; }
        public string MatKhauHash { get; set; }
        public VaiTroNguoiDung VaiTro { get; set; }
        public string? IdChatTelegram { get; set; }
        
        /// <summary> Cờ đánh dấu tài khoản bị khóa </summary>
        public bool DangBiKhoa { get; private set; }
        
        /// <summary> Thời điểm hết hạn khóa (nếu có) </summary>
        public DateTime? ThoiDiemHetHanKhoa { get; private set; }

        public static NguoiDung Tao(string email, string hoTen, string matKhauHash)
        {
            return new NguoiDung
            {
                Email = email,
                HoTen = hoTen,
                VaiTro = VaiTroNguoiDung.NguoiDung,
                MatKhauHash = matKhauHash,
                DangBiKhoa = false
            };
        }

        public void GanVaiTro(VaiTroNguoiDung vaiTroMoi) => VaiTro = vaiTroMoi;

        public void KhoaTaiKhoan(int soPhut = 10)
        {
            DangBiKhoa = true;
            ThoiDiemHetHanKhoa = DateTime.UtcNow.AddMinutes(soPhut);
        }

        public void MoKhoaTaiKhoan()
        {
            DangBiKhoa = false;
            ThoiDiemHetHanKhoa = null;
        }
    }

    /// <summary>
    /// Thực thể lưu trữ Refresh Token để hỗ trợ cơ chế Rotation (xoay vòng token)
    /// </summary>
    public class TokenLamMoi
    {
        public int Id { get; set; }
        public string TokenHash { get; set; }
        public int IdNguoiDung { get; set; }
        public DateTime NgayHetHan { get; set; }
        public bool DaThuHoi { get; private set; }
        public DateTime NgayTao { get; set; }

        public void ThuHoi() => DaThuHoi = true;
        public bool ConHieuLuc => !DaThuHoi && NgayHetHan > DateTime.UtcNow;
    }
}
