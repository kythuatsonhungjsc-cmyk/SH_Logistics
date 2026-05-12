using Microsoft.EntityFrameworkCore;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Infrastructure.Persistence
{
    /// <summary>
    /// Triển khai kho lưu trữ Phương tiện sử dụng Entity Framework Core
    /// </summary>
    public class KhoLuuTruPhuongTien : IKhoLuuTruPhuongTien
    {
        private readonly CoSoDuLieuApp _db;

        public KhoLuuTruPhuongTien(CoSoDuLieuApp db)
        {
            _db = db;
        }

        public async Task<List<PhuongTien>> LayTatCaAsync()
        {
            return await _db.CacPhuongTien
                .OrderBy(x => x.BienSoXe)
                .ToListAsync();
        }

        public async Task<PhuongTien?> LayTheoIdAsync(int id)
        {
            return await _db.CacPhuongTien.FindAsync(id);
        }

        public async Task ThemAsync(PhuongTien phuongTien)
        {
            _db.CacPhuongTien.Add(phuongTien);
            await _db.SaveChangesAsync();
        }

        public void CapNhat(PhuongTien phuongTien)
        {
            phuongTien.NgayCapNhat = DateTime.UtcNow;
            _db.CacPhuongTien.Update(phuongTien);
            _db.SaveChanges();
        }
    }
}
