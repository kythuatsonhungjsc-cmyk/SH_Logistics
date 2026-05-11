using Microsoft.EntityFrameworkCore;
using QuanLyCongViec.Domain.Entities;
using QuanLyCongViec.Infrastructure.Persistence;
using System.Security.Cryptography;

namespace QuanLyCongViec.Infrastructure.Security
{
    /// <summary>
    /// Dịch vụ xử lý cấp phát và làm mới Token (JWT + Refresh Token Rotation)
    /// </summary>
    public class DichVuXacThuc
    {
        private readonly CoSoDuLieuApp _db;

        public DichVuXacThuc(CoSoDuLieuApp db)
        {
            _db = db;
        }

        /// <summary>
        /// Tạo một Refresh Token ngẫu nhiên và lưu vào database
        /// </summary>
        public async Task<string> TaoTokenLamMoiAsync(int idNguoiDung)
        {
            var chuoiNgauNhien = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            
            var tokenMoi = new TokenLamMoi
            {
                IdNguoiDung = idNguoiDung,
                TokenHash = chuoiNgauNhien, // Thực tế nên hash chuỗi này trước khi lưu
                NgayTao = DateTime.UtcNow,
                NgayHetHan = DateTime.UtcNow.AddDays(7)
            };

            _db.Set<TokenLamMoi>().Add(tokenMoi);
            await _db.SaveChangesAsync();

            return chuoiNgauNhien;
        }

        /// <summary>
        /// Thực hiện xoay vòng token: Thu hồi token cũ và cấp token mới
        /// </summary>
        public async Task<(string AccessToken, string RefreshToken)> LamMoiTokenAsync(string tokenCu)
        {
            var storedToken = await _db.Set<TokenLamMoi>()
                .FirstOrDefaultAsync(t => t.TokenHash == tokenCu);

            if (storedToken == null || !storedToken.ConHieuLuc)
                throw new Exception("Token làm mới không hợp lệ hoặc đã hết hạn.");

            // Thu hồi token cũ (Rotation)
            storedToken.ThuHoi();
            
            // Cấp token mới
            var tokenMoi = await TaoTokenLamMoiAsync(storedToken.IdNguoiDung);
            
            // Giả lập tạo AccessToken (JWT)
            var accessMoi = "jwt_access_token_moi"; 

            return (accessMoi, tokenMoi);
        }
    }
}
