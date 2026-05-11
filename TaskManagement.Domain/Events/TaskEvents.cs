using MediatR;
using QuanLyCongViec.Domain.Entities;
using QuanLyCongViec.Domain.Enum;

namespace QuanLyCongViec.Domain.SuKien
{
    /// <summary>
    /// Interface đại diện cho một sự kiện xảy ra trong Domain, hỗ trợ MediatR
    /// </summary>
    public interface ISuKienDomain : INotification { }

    /// <summary>
    /// Sự kiện xảy ra khi một công việc mới được tạo
    /// </summary>
    public record SuKienCongViecDaTao(CongViec CongViec) : ISuKienDomain;
    
    /// <summary>
    /// Sự kiện xảy ra khi công việc được giao cho một người dùng khác
    /// </summary>
    public record SuKienCongViecDaGiao(CongViec CongViec, int IdNguoiDuocGiaoMoi) : ISuKienDomain;
    
    /// <summary>
    /// Sự kiện xảy ra khi trạng thái công việc thay đổi
    /// </summary>
    public record SuKienTrangThaiCongViecThayDoi(CongViec CongViec, TrangThaiCongViec TrangThaiCu, TrangThaiCongViec TrangThaiMoi, int IdNguoiThayDoi) : ISuKienDomain;
    
    /// <summary>
    /// Sự kiện xảy ra khi chi tiết công việc được cập nhật
    /// </summary>
    public record SuKienCongViecDaCapNhat(CongViec CongViec, int IdNguoiThayDoi) : ISuKienDomain;
    
    /// <summary>
    /// Sự kiện xảy ra khi công việc bị xóa (xóa mềm)
    /// </summary>
    public record SuKienCongViecDaXoa(CongViec CongViec, int IdNguoiXoa) : ISuKienDomain;
}
