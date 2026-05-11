using FluentAssertions;
using MediatR;
using Moq;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Application.CongViec.Commands.PhanCong;
using QuanLyCongViec.Domain.Entities;
using QuanLyCongViec.Domain.Enum;
using QuanLyCongViec.Domain.SuKien;
using Xunit;

namespace QuanLyCongViec.Application.Tests.CongViec.Commands
{
    /// <summary>
    /// Kiểm tra logic của bộ xử lý lệnh Phân công công việc (Application Layer)
    /// Sử dụng Mock để giả lập các phụ thuộc bên ngoài.
    /// </summary>
    public class TestXuLyLenhPhanCong
    {
        private readonly Mock<IKhoLuuTruCongViec> _mockKhoCongViec = new();
        private readonly Mock<IDonViCongViec> _mockDonViCongViec = new();
        private readonly Mock<IMediator> _mockMediator = new();
        private readonly XuLyLenhPhanCongCongViec _boXuLy;

        public TestXuLyLenhPhanCong()
        {
            // Khởi tạo bộ xử lý với các đối tượng giả (Mock)
            _boXuLy = new XuLyLenhPhanCongCongViec(
                _mockKhoCongViec.Object, 
                _mockDonViCongViec.Object, 
                _mockMediator.Object);
        }

        [Fact]
        public async Task Handle_LenhHopLe_PhaiThucHienPhanCongVaLuuDuLieu()
        {
            // Sắp xếp (Arrange)
            var congViec = Entities.CongViec.Tao("Test", "", DoUuTien.Thap, 1, null);
            _mockKhoCongViec.Setup(k => k.LayTheoIdAsync(1)).ReturnsAsync(congViec);
            
            var lenh = new LenhPhanCongCongViec(1, 2, 1); // IdCongViec=1, IdNguoiDung=2, IdQuanLy=1

            // Hành động (Act)
            await _boXuLy.Handle(lenh, CancellationToken.None);

            // Kiểm tra (Assert)
            congViec.IdNguoiDuocGiao.Should().Be(2);
            
            // Đảm bảo phương thức Lưu thay đổi được gọi đúng 1 lần
            _mockDonViCongViec.Verify(u => u.LuuThayDoiAsync(It.IsAny<CancellationToken>()), Times.Once);
            
            // Đảm bảo sự kiện Domain được phát tán (Publish)
            _mockMediator.Verify(m => m.Publish(It.IsAny<SuKienCongViecDaGiao>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Handle_CongViecKhongTonTai_PhaiQuangNgoaiLe()
        {
            // Sắp xếp: Trả về null khi tìm công việc ID 99
            _mockKhoCongViec.Setup(k => k.LayTheoIdAsync(99)).ReturnsAsync((Entities.CongViec)null);
            
            var lenh = new LenhPhanCongCongViec(99, 2, 1);

            // Hành động & Kiểm tra
            var hanhDong = () => _boXuLy.Handle(lenh, CancellationToken.None);
            
            await hanhDong.Should().ThrowAsync<Exception>().WithMessage("*Không tìm thấy công việc*");
        }
    }
}
