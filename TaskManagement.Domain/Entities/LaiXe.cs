namespace QuanLyCongViec.Domain.Entities
{
    /// <summary>
    /// Thực thể Lái xe - Đại diện cho một tài xế trong đội ngũ
    /// </summary>
    public class LaiXe
    {
        public int Id { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string AnhDaiDien { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string SoCCCD { get; set; } = string.Empty;

        // Giấy phép lái xe (GPLX)
        public string LoaiBangLai { get; set; } = string.Empty;
        public string SoGPLX { get; set; } = string.Empty;
        public string NoiCap { get; set; } = string.Empty;
        public string NgayCap { get; set; } = string.Empty;
        public string NgayHetHan { get; set; } = string.Empty;

        // Thông tin công tác
        public string CongTy { get; set; } = string.Empty;
        public string DoiXe { get; set; } = string.Empty;

        /// <summary> Trạng thái: working, on_leave, resigned </summary>
        public string TrangThai { get; set; } = "working";

        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
        public DateTime? NgayCapNhat { get; set; }
    }
}
