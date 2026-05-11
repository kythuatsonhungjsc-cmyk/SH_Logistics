namespace QuanLyCongViec.Domain.Enum
{
    /// <summary>
    /// Trạng thái của một công việc trong hệ thống
    /// </summary>
    public enum TrangThaiCongViec
    {
        /// <summary> Cần thực hiện </summary>
        CanLam = 0,
        /// <summary> Đang triển khai </summary>
        DangLam = 1,
        /// <summary> Đã hoàn thành </summary>
        HoanThanh = 2,
        /// <summary> Đã hủy bỏ </summary>
        DaHuy = 3
    }

    /// <summary>
    /// Mức độ ưu tiên của công việc
    /// </summary>
    public enum DoUuTien
    {
        /// <summary> Thấp </summary>
        Thap = 0,
        /// <summary> Trung bình </summary>
        TrungBinh = 1,
        /// <summary> Cao </summary>
        Cao = 2,
        /// <summary> Khẩn cấp </summary>
        KhanCap = 3
    }

    /// <summary>
    /// Các vai trò của người dùng trong hệ thống
    /// </summary>
    public enum VaiTroNguoiDung
    {
        /// <summary> Người dùng thông thường </summary>
        NguoiDung = 0,
        /// <summary> Quản lý </summary>
        QuanLy = 1,
        /// <summary> Quản trị viên </summary>
        QuanTriVien = 2
    }
}
