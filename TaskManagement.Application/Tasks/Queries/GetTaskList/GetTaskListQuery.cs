using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Application.Common.Models;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Application.CongViec.Queries.LayDanhSach
{
    /// <summary>
    /// Truy vấn lấy danh sách công việc có phân trang và hỗ trợ Cache
    /// </summary>
    public record TruyVanDanhSachCongViec(int IdNguoiDung, int SoTrang = 1, int KichThuocTrang = 10) 
        : IRequest<DanhSachPhanTrang<DtoCongViec>>;

    /// <summary>
    /// DTO chứa thông tin thu gọn của công việc để trả về API
    /// </summary>
    public record DtoCongViec(int Id, string TieuDe, string TrangThai, string DoUuTien, DateTime? HanChot);

    public class XuLyTruyVanDanhSachCongViec : IRequestHandler<TruyVanDanhSachCongViec, DanhSachPhanTrang<DtoCongViec>>
    {
        private readonly IKhoLuuTruCongViec _khoCongViec;
        private readonly IDistributedCache _cache;

        public XuLyTruyVanDanhSachCongViec(IKhoLuuTruCongViec khoCongViec, IDistributedCache cache)
        {
            _khoCongViec = khoCongViec;
            _cache = cache;
        }

        public async Task<DanhSachPhanTrang<DtoCongViec>> Handle(TruyVanDanhSachCongViec yeuCau, CancellationToken cancellationToken)
        {
            string cacheKey = $"cong_viec:danh_sach:nguoi_dung:{yeuCau.IdNguoiDung}:trang:{yeuCau.SoTrang}";

            // 1. Kiểm tra Cache (Chỉ áp dụng Cache cho trang 1 để giảm tải cho Redis và đảm bảo tính mới của dữ liệu)
            if (yeuCau.SoTrang == 1)
            {
                var duLieuCache = await _cache.GetStringAsync(cacheKey, cancellationToken);
                if (duLieuCache != null)
                {
                    return JsonSerializer.Deserialize<DanhSachPhanTrang<DtoCongViec>>(duLieuCache)!;
                }
            }

            // 2. Nếu không có cache hoặc là các trang sau, thực hiện truy vấn DB
            // Giả lập logic truy vấn và phân trang từ Repository
            var ketQua = await LayDuLieuTuDb(yeuCau);

            // 3. Lưu vào Cache nếu là trang 1 (Thời gian sống ngắn: 30 giây)
            if (yeuCau.SoTrang == 1)
            {
                var options = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30) };
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(ketQua), options, cancellationToken);
            }

            return ketQua;
        }

        private async Task<DanhSachPhanTrang<DtoCongViec>> LayDuLieuTuDb(TruyVanDanhSachCongViec yeuCau)
        {
            // Trong thực tế, bạn sẽ gọi phương thức phân trang của IKhoLuuTruCongViec
            // Ở đây tôi giả lập dữ liệu trả về
            var items = new List<DtoCongViec> 
            { 
                new DtoCongViec(1, "Kiểm tra xe định kỳ", "CanLam", "Cao", DateTime.UtcNow.AddDays(1)) 
            };
            
            return new DanhSachPhanTrang<DtoCongViec>(items, 100, yeuCau.SoTrang, yeuCau.KichThuocTrang);
        }
    }
}
