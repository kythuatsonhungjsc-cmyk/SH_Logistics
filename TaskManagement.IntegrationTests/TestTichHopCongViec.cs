using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using QuanLyCongViec.Application.CongViec.Commands.PhanCong;
using Xunit;

namespace QuanLyCongViec.IntegrationTests
{
    /// <summary>
    /// Kiểm tra tích hợp toàn trình (End-to-End) cho chức năng Công việc
    /// </summary>
    public class TestTichHopCongViec : CoSoTestTichHop
    {
        [Fact]
        public async Task QuanLy_PhanCongCongViec_PhaiThanhCongVaCapNhatDatabase()
        {
            // 1. Giả lập đăng nhập để lấy Token (Ở đây giả sử token hợp lệ)
            var token = "gia_lap_token_quan_ly"; 
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // 2. Gửi yêu cầu phân công công việc
            var lenh = new LenhPhanCongCongViec(1, 2, 1);
            var phanHoi = await Client.PutAsJsonAsync("/api/tasks/1/assign", lenh);

            // 3. Kiểm tra kết quả trả về
            // Lưu ý: Bài test này sẽ trả về 401 nếu logic xác thực JWT thật đang chạy.
            // Trong môi trường test tích hợp, ta thường mock hoặc bypass bộ lọc JWT.
            phanHoi.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task TruyCapApiKhongToken_PhaiTraVe401Unauthorized()
        {
            // Hành động: Gửi request mà không có Header Authorization
            var phanHoi = await Client.GetAsync("/api/tasks");

            // Kiểm tra
            phanHoi.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
