namespace QuanLyCongViec.Domain.Entities
{
    /// <summary>
    /// Thực thể ghi lại lịch sử các hoạt động quan trọng trong hệ thống để đối soát (Audit Log)
    /// </summary>
    public class LichSuHoatDong
    {
        /// <summary> Mã định danh log </summary>
        public int Id { get; set; }
        
        /// <summary> ID của công việc liên quan </summary>
        public int IdCongViec { get; set; }
        
        /// <summary> ID của người thực hiện hành động </summary>
        public int IdNguoiDung { get; set; }
        
        /// <summary> Loại hành động (Tạo, Giao việc, Thay đổi trạng thái...) </summary>
        public string HanhDong { get; set; }
        
        /// <summary> Chi tiết các trường dữ liệu thay đổi (Định dạng JSON) </summary>
        public string DuLieuThayDoi { get; set; }
        
        /// <summary> Thời điểm xảy ra hành động </summary>
        public DateTime ThoiDiem { get; set; }
    }
}
