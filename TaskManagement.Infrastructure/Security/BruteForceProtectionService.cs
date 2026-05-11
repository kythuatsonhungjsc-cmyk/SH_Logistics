using Microsoft.Extensions.Caching.Distributed;

namespace QuanLyCongViec.Infrastructure.Security
{
    /// <summary>
    /// Dịch vụ ngăn chặn các cuộc tấn công Brute-force (vét cạn mật khẩu)
    /// Sử dụng Redis để ghi nhớ số lần đăng nhập sai của một tài khoản.
    /// </summary>
    public class DichVuChongTanCongVetCan
    {
        private readonly IDistributedCache _cache;
        private const int SO_LAN_SAI_TOI_DA = 5;
        private const int THOI_GIAN_KHOA_PHUT = 15;

        public DichVuChongTanCongVetCan(IDistributedCache cache)
        {
            _cache = cache;
        }

        /// <summary>
        /// Kiểm tra xem địa chỉ email này có đang bị khóa do nhập sai nhiều lần hay không
        /// </summary>
        public async Task<bool> DangBiChanAsync(string email)
        {
            var soLanSai = await _cache.GetStringAsync($"dang_nhap_sai:{email}");
            return soLanSai != null && int.Parse(soLanSai) >= SO_LAN_SAI_TOI_DA;
        }

        /// <summary>
        /// Ghi nhận một lần đăng nhập sai mật khẩu
        /// </summary>
        public async Task GhiNhanDangNhapSaiAsync(string email)
        {
            var key = $"dang_nhap_sai:{email}";
            var giaTriHienTai = await _cache.GetStringAsync(key);
            
            int count = giaTriHienTai == null ? 1 : int.Parse(giaTriHienTai) + 1;

            // Lưu vào Cache với thời gian hết hạn (ví dụ: sau 15 phút sẽ tự động mở khóa)
            await _cache.SetStringAsync(key, count.ToString(), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(THOI_GIAN_KHOA_PHUT)
            });
        }

        /// <summary>
        /// Xóa bỏ lịch sử đăng nhập sai sau khi người dùng đăng nhập thành công
        /// </summary>
        public async Task XoaLichSuSaiAsync(string email)
        {
            await _cache.RemoveAsync($"dang_nhap_sai:{email}");
        }
    }
}
