using Microsoft.EntityFrameworkCore;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Infrastructure.Persistence
{
    /// <summary>
    /// Triển khai kho lưu trữ lịch sử bảo dưỡng sử dụng Entity Framework Core
    /// </summary>
    public class KhoLuuTruBaoDuong : IKhoLuuTruBaoDuong
    {
        private readonly CoSoDuLieuApp _db;

        public KhoLuuTruBaoDuong(CoSoDuLieuApp db)
        {
            _db = db;
        }

        public async Task<List<LichSuBaoDuong>> TimTheoTieuChiAsync(
            string bienSoXe, DateTime ngaySuaChua, string kmBaoDuong, string gara)
        {
            return await _db.CacLichSuBaoDuong
                .Where(x => x.BienSoXe == bienSoXe 
                         && x.NgaySuaChua.Date == ngaySuaChua.Date
                         && x.KmBaoDuong == kmBaoDuong
                         && x.Gara == gara)
                .ToListAsync();
        }

        public async Task<List<LichSuBaoDuong>> LayTatCaAsync()
        {
            return await _db.CacLichSuBaoDuong
                .OrderBy(x => x.NgaySuaChua)
                .ThenBy(x => x.IdHoaDon)
                .ToListAsync();
        }

        public async Task ThemNhieuAsync(List<LichSuBaoDuong> cacBanGhi)
        {
            _db.CacLichSuBaoDuong.AddRange(cacBanGhi);
            await _db.SaveChangesAsync();
        }
    }
}
