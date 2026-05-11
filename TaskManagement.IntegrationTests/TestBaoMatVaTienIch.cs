using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Xunit;
using System.Net.Http.Headers;

namespace QuanLyCongViec.IntegrationTests
{
    /// <summary>
    /// Kiểm tra các tính năng bảo mật và tiện ích mở rộng
    /// </summary>
    public class TestBaoMatVaTienIch : CoSoTestTichHop
    {
        [Fact]
        public async Task DangNhapSaiQua5Lan_PhaiTraVe423Locked()
        {
            // Sắp xếp: Thử đăng nhập sai 5 lần liên tiếp
            var email = "test@example.com";
            var thongTinDangNhap = new { Email = email, MatKhau = "sai_mat_khau" };

            for (int i = 0; i < 5; i++)
            {
                await Client.PostAsJsonAsync("/api/auth/login", thongTinDangNhap);
            }

            // Hành động: Lần đăng nhập thứ 6 (kể cả đúng mật khẩu)
            var phanHoiCuoi = await Client.PostAsJsonAsync("/api/auth/login", new { Email = email, MatKhau = "dung_mat_khau" });

            // Kiểm tra: Phải bị khóa (423 Locked)
            phanHoiCuoi.StatusCode.Should().Be(HttpStatusCode.Locked);
        }

        [Fact]
        public async Task XuatBáoCáoExcel_PhaiTraVeDinhDangDung()
        {
            // Giả lập quyền Admin
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "token_admin");

            // Hành động
            var phanHoi = await Client.GetAsync("/api/tasks/export");

            // Kiểm tra
            phanHoi.StatusCode.Should().Be(HttpStatusCode.OK);
            phanHoi.Content.Headers.ContentType.MediaType.Should().Be("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
    }
}
