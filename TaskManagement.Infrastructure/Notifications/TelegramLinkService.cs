using Microsoft.Extensions.Caching.Distributed;
using System.Security.Cryptography;

namespace QuanLyCongViec.Infrastructure.Notifications
{
    /// <summary>
    /// Dịch vụ quản lý việc liên kết tài khoản người dùng với Bot Telegram
    /// </summary>
    public class DichVuLienKetTelegram
    {
        private readonly IDistributedCache _cache;
        private const string PREFIX_KEY = "lien_ket_telegram:";

        public DichVuLienKetTelegram(IDistributedCache cache)
        {
            _cache = cache;
        }

        /// <summary>
        /// Tạo một mã liên kết duy nhất (Deep Link Token) cho người dùng
        /// </summary>
        public async Task<string> TaoLinkLienKetAsync(int idNguoiDung)
        {
            // Tạo một token ngẫu nhiên an toàn
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(16));
            
            // Lưu token vào cache với thời gian sống 15 phút
            var key = $"{PREFIX_KEY}{token}";
            await _cache.SetStringAsync(key, idNguoiDung.ToString(), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            });

            return token;
        }

        /// <summary>
        /// Xác thực mã token từ Telegram và trả về ID người dùng tương ứng
        /// </summary>
        public async Task<int?> XacThucTokenAsync(string token)
        {
            var key = $"{PREFIX_KEY}{token}";
            var giaTri = await _cache.GetStringAsync(key);
            
            if (giaTri == null) return null;

            // Xóa token sau khi đã sử dụng (chỉ được dùng 1 lần)
            await _cache.RemoveAsync(key);
            
            return int.Parse(giaTri);
        }
    }
}
