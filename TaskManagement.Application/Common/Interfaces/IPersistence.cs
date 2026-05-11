using EntityCongViec = QuanLyCongViec.Domain.Entities.CongViec;
using EntityNguoiDung = QuanLyCongViec.Domain.Entities.NguoiDung;
using EntityBaoDuong = QuanLyCongViec.Domain.Entities.LichSuBaoDuong;

namespace QuanLyCongViec.Application.Common.Interfaces
{
    /// <summary>
    /// Giao diện kho lưu trữ dữ liệu cho thực thể Công việc
    /// </summary>
    public interface IKhoLuuTruCongViec
    {
        /// <summary> Lấy thông tin công việc theo ID </summary>
        Task<EntityCongViec?> LayTheoIdAsync(int id);
        
        /// <summary> Thêm mới một công việc vào kho </summary>
        Task ThemAsync(EntityCongViec congViec);
        
        /// <summary> Cập nhật thông tin công việc đã tồn tại </summary>
        void CapNhat(EntityCongViec congViec);
    }

    /// <summary>
    /// Giao diện kho lưu trữ người dùng
    /// </summary>
    public interface IKhoLuuTruNguoiDung
    {
        Task<EntityNguoiDung?> LayTheoIdAsync(int id);
        Task<EntityNguoiDung?> LayTheoEmailAsync(string email);
        Task ThemAsync(EntityNguoiDung nguoiDung);
    }

    /// <summary>
    /// Giao diện kho lưu trữ lịch sử bảo dưỡng / sửa chữa xe
    /// </summary>
    public interface IKhoLuuTruBaoDuong
    {
        /// <summary> Tìm các hóa đơn theo tiêu chí đối soát trùng lặp </summary>
        Task<List<EntityBaoDuong>> TimTheoTieuChiAsync(string bienSoXe, DateTime ngaySuaChua, string kmBaoDuong, string gara);
        
        /// <summary> Lấy toàn bộ lịch sử bảo dưỡng, sắp xếp theo ngày </summary>
        Task<List<EntityBaoDuong>> LayTatCaAsync();
        
        /// <summary> Thêm nhiều bản ghi bảo dưỡng cùng lúc (1 hóa đơn = nhiều hạng mục) </summary>
        Task ThemNhieuAsync(List<EntityBaoDuong> cacBanGhi);
    }

    public interface IDonViCongViec
    {
        /// <summary> Lưu tất cả thay đổi vào cơ sở dữ liệu </summary>
        Task<int> LuuThayDoiAsync(CancellationToken cancellationToken = default);
    }
}
