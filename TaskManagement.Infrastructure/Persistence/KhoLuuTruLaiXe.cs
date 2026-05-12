using Microsoft.EntityFrameworkCore;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Infrastructure.Persistence
{
    /// <summary>
    /// Triển khai kho lưu trữ Lái xe sử dụng Entity Framework Core
    /// </summary>
    public class KhoLuuTruLaiXe : IKhoLuuTruLaiXe
    {
        private readonly CoSoDuLieuApp _db;

        public KhoLuuTruLaiXe(CoSoDuLieuApp db)
        {
            _db = db;
        }

        public async Task<List<LaiXe>> LayTatCaAsync()
        {
            return await _db.CacLaiXe
                .OrderBy(x => x.HoTen)
                .ToListAsync();
        }

        public async Task<LaiXe?> LayTheoIdAsync(int id)
        {
            return await _db.CacLaiXe.FindAsync(id);
        }

        public async Task ThemAsync(LaiXe laiXe)
        {
            _db.CacLaiXe.Add(laiXe);
            await _db.SaveChangesAsync();
        }

        public void CapNhat(LaiXe laiXe)
        {
            laiXe.NgayCapNhat = DateTime.UtcNow;
            _db.CacLaiXe.Update(laiXe);
            _db.SaveChanges();
        }
    }
}
