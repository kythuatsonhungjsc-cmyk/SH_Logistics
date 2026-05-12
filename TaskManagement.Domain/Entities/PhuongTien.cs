namespace QuanLyCongViec.Domain.Entities
{
    /// <summary>
    /// Thực thể Phương tiện - Đại diện cho một xe trong đội xe logistics
    /// </summary>
    public class PhuongTien
    {
        public int Id { get; set; }
        public string BienSoXe { get; set; } = string.Empty;
        public string CongTy { get; set; } = string.Empty;
        public string DoiXe { get; set; } = string.Empty;
        public string HangXe { get; set; } = string.Empty;
        public string TaiTrong { get; set; } = string.Empty;
        public string KichThuoc { get; set; } = string.Empty;
        public string LoaiLop { get; set; } = string.Empty;
        public string SoKhung { get; set; } = string.Empty;
        public string SoMay { get; set; } = string.Empty;
        public string NamSanXuat { get; set; } = string.Empty;
        public string NienHan { get; set; } = string.Empty;
        public string MauSon { get; set; } = string.Empty;
        public string SoKmHienTai { get; set; } = string.Empty;

        /// <summary> Trạng thái: active, maintenance, inactive </summary>
        public string TrangThai { get; set; } = "active";

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
        public DateTime? NgayCapNhat { get; set; }
    }
}
