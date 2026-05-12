namespace QuanLyCongViec.Domain.Entities
{
    /// <summary>
    /// Thực thể lưu trữ các mẫu Email để Admin có thể tùy chỉnh nội dung thông báo
    /// </summary>
    public class MauEmail
    {
        public int Id { get; set; }
        public string LoaiTemplate { get; set; } = string.Empty; // Ví dụ: "GiaoViec", "ThayDoiTrangThai"
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDungHtml { get; set; } = string.Empty;
        public DateTime NgayCapNhat { get; set; }
    }
}
