using MediatR;
using System.Text.Json;
using QuanLyCongViec.Domain.SuKien;
using QuanLyCongViec.Domain.Entities;
using QuanLyCongViec.Infrastructure.Persistence;

namespace QuanLyCongViec.Infrastructure.Audit
{
    /// <summary>
    /// Bộ xử lý các sự kiện Domain để tự động ghi lại lịch sử hoạt động vào DB
    /// </summary>
    public class XuLyLichSuHoatDong : 
        INotificationHandler<SuKienCongViecDaTao>,
        INotificationHandler<SuKienCongViecDaGiao>,
        INotificationHandler<SuKienTrangThaiCongViecThayDoi>,
        INotificationHandler<SuKienCongViecDaCapNhat>,
        INotificationHandler<SuKienCongViecDaXoa>
    {
        private readonly CoSoDuLieuApp _db;

        public XuLyLichSuHoatDong(CoSoDuLieuApp db) => _db = db;

        public async Task Handle(SuKienCongViecDaTao thongBao, CancellationToken cancellationToken)
        {
            var nhatKy = new LichSuHoatDong
            {
                IdCongViec = thongBao.CongViec.Id,
                IdNguoiDung = thongBao.CongViec.IdNguoiTao,
                HanhDong = "Tạo mới",
                DuLieuThayDoi = JsonSerializer.Serialize(new { thongBao.CongViec.TieuDe }),
                ThoiDiem = DateTime.UtcNow
            };
            _db.CacLichSuHoatDong.Add(nhatKy);
        }

        public async Task Handle(SuKienCongViecDaGiao thongBao, CancellationToken cancellationToken)
        {
            var nhatKy = new LichSuHoatDong
            {
                IdCongViec = thongBao.CongViec.Id,
                IdNguoiDung = thongBao.IdNguoiDuocGiaoMoi,
                HanhDong = "Phân công",
                DuLieuThayDoi = JsonSerializer.Serialize(new { IdNguoiDuocGiao = thongBao.IdNguoiDuocGiaoMoi }),
                ThoiDiem = DateTime.UtcNow
            };
            _db.CacLichSuHoatDong.Add(nhatKy);
        }

        public async Task Handle(SuKienTrangThaiCongViecThayDoi thongBao, CancellationToken cancellationToken)
        {
            var nhatKy = new LichSuHoatDong
            {
                IdCongViec = thongBao.CongViec.Id,
                IdNguoiDung = thongBao.IdNguoiThayDoi,
                HanhDong = "Thay đổi trạng thái",
                DuLieuThayDoi = JsonSerializer.Serialize(new { thongBao.TrangThaiCu, thongBao.TrangThaiMoi }),
                ThoiDiem = DateTime.UtcNow
            };
            _db.CacLichSuHoatDong.Add(nhatKy);
        }

        public async Task Handle(SuKienCongViecDaCapNhat thongBao, CancellationToken cancellationToken)
        {
            var nhatKy = new LichSuHoatDong
            {
                IdCongViec = thongBao.CongViec.Id,
                IdNguoiDung = thongBao.IdNguoiThayDoi,
                HanhDong = "Cập nhật chi tiết",
                DuLieuThayDoi = JsonSerializer.Serialize(new { thongBao.CongViec.TieuDe, thongBao.CongViec.MoTa }),
                ThoiDiem = DateTime.UtcNow
            };
            _db.CacLichSuHoatDong.Add(nhatKy);
        }

        public async Task Handle(SuKienCongViecDaXoa thongBao, CancellationToken cancellationToken)
        {
            var nhatKy = new LichSuHoatDong
            {
                IdCongViec = thongBao.CongViec.Id,
                IdNguoiDung = thongBao.IdNguoiXoa,
                HanhDong = "Xóa",
                DuLieuThayDoi = "{}",
                ThoiDiem = DateTime.UtcNow
            };
            _db.CacLichSuHoatDong.Add(nhatKy);
        }
    }
}
