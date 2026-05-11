using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using QuanLyCongViec.Domain.SuKien;

namespace QuanLyCongViec.Infrastructure.Dashboard
{
    /// <summary>
    /// Hub SignalR dùng để đẩy thông báo thời gian thực về Dashboard
    /// </summary>
    public class HubDashboard : Hub { }

    /// <summary>
    /// Bộ xử lý để làm mới Cache và gửi thông báo SignalR khi dữ liệu công việc thay đổi
    /// Đã được tối ưu để xóa cache danh sách công việc của người dùng liên quan.
    /// </summary>
    public class XuLyCacheDashboard : 
        INotificationHandler<SuKienTrangThaiCongViecThayDoi>, 
        INotificationHandler<SuKienCongViecDaTao>,
        INotificationHandler<SuKienCongViecDaGiao>,
        INotificationHandler<SuKienCongViecDaCapNhat>
    {
        private readonly IDistributedCache _cache;
        private readonly IHubContext<HubDashboard> _hubContext;

        public XuLyCacheDashboard(IDistributedCache cache, IHubContext<HubDashboard> hubContext)
        {
            _cache = cache;
            _hubContext = hubContext;
        }

        public async Task Handle(SuKienTrangThaiCongViecThayDoi thongBao, CancellationToken cancellationToken)
        {
            await XoaCacheDanhSach(thongBao.CongViec.IdNguoiDuocGiao, cancellationToken);
            await LamMoiDashboard(cancellationToken);
        }

        public async Task Handle(SuKienCongViecDaTao thongBao, CancellationToken cancellationToken)
        {
            await XoaCacheDanhSach(thongBao.CongViec.IdNguoiTao, cancellationToken);
            await LamMoiDashboard(cancellationToken);
        }

        public async Task Handle(SuKienCongViecDaGiao thongBao, CancellationToken cancellationToken)
        {
            // Xóa cache của cả người giao và người được giao
            await XoaCacheDanhSach(thongBao.CongViec.IdNguoiTao, cancellationToken);
            await XoaCacheDanhSach(thongBao.IdNguoiDuocGiaoMoi, cancellationToken);
            await LamMoiDashboard(cancellationToken);
        }

        public async Task Handle(SuKienCongViecDaCapNhat thongBao, CancellationToken cancellationToken)
        {
            await XoaCacheDanhSach(thongBao.CongViec.IdNguoiDuocGiao, cancellationToken);
            await LamMoiDashboard(cancellationToken);
        }

        private async Task XoaCacheDanhSach(int? idNguoiDung, CancellationToken ct)
        {
            if (idNguoiDung.HasValue)
            {
                // Xóa cache trang 1 của người dùng này
                await _cache.RemoveAsync($"cong_viec:danh_sach:nguoi_dung:{idNguoiDung}:trang:1", ct);
            }
        }

        private async Task LamMoiDashboard(CancellationToken ct)
        {
            await _cache.RemoveAsync("dashboard:summary", ct);
            await _hubContext.Clients.All.SendAsync("DashboardUpdated", ct);
        }
    }
}
