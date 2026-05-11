using FluentAssertions;
using QuanLyCongViec.Domain.Entities;
using QuanLyCongViec.Domain.Enum;
using QuanLyCongViec.Domain.SuKien;
using Xunit;

namespace QuanLyCongViec.Domain.Tests.Entities
{
    /// <summary>
    /// Các bài kiểm tra đơn vị cho thực thể Công việc (CongViec)
    /// </summary>
    public class TestThucTheCongViec
    {
        [Fact]
        public void Tao_PhaiThietLapDungThuocTinhVaPhatSuKienTao()
        {
            // Sắp xếp & Hành động
            var congViec = CongViec.Tao("Tiêu đề", "Mô tả", DoUuTien.Cao, 1, DateTime.UtcNow.AddDays(1));

            // Kiểm tra (Assert)
            congViec.TieuDe.Should().Be("Tiêu đề");
            congViec.TrangThai.Should().Be(TrangThaiCongViec.CanLam);
            // Kiểm tra xem sự kiện Domain đã được ghi nhận chưa
            congViec.CacSuKienDomain.Should().ContainSingle(e => e is SuKienCongViecDaTao);
        }

        [Fact]
        public void GiaoCho_BoiQuanLy_PhaiCapNhatNguoiDuocGiaoVaPhatSuKien()
        {
            // Sắp xếp
            var congViec = CongViec.Tao("Việc 1", "", DoUuTien.TrungBinh, 1, null);

            // Hành động: Admin (ID 1) giao cho nhân viên (ID 2)
            congViec.GiaoCho(2, idNguoiThucHienGiao: 1);

            // Kiểm tra
            congViec.IdNguoiDuocGiao.Should().Be(2);
            congViec.CacSuKienDomain.Should().Contain(e => e is SuKienCongViecDaGiao);
        }

        [Fact]
        public void GiaoCho_TuGiaoChoChinhMinh_PhaiQuangNgoaiLe()
        {
            // Sắp xếp
            var congViec = CongViec.Tao("Việc 1", "", DoUuTien.TrungBinh, 1, null);

            // Hành động & Kiểm tra: Tự giao cho mình sẽ bị lỗi nghiệp vụ
            var hanhDong = () => congViec.GiaoCho(1, idNguoiThucHienGiao: 1);
            
            hanhDong.Should().Throw<Exception>().WithMessage("*không thể tự giao công việc cho chính mình*");
        }

        [Fact]
        public void ThayDoiTrangThai_NguoiDuocGiao_PhaiThanhCong()
        {
            // Sắp xếp
            var congViec = CongViec.Tao("Việc 1", "", DoUuTien.TrungBinh, 1, null);
            congViec.GiaoCho(2, 1);

            // Hành động: Người được giao (ID 2) chuyển trạng thái sang Đang làm
            congViec.ThayDoiTrangThai(TrangThaiCongViec.DangLam, idNguoiThayDoi: 2, VaiTroNguoiDung.NguoiDung);

            // Kiểm tra
            congViec.TrangThai.Should().Be(TrangThaiCongViec.DangLam);
        }

        [Fact]
        public void XoaMem_PhaiDatCoDaXoaVaPhatSuKien()
        {
            // Sắp xếp
            var congViec = CongViec.Tao("X", "", DoUuTien.Thap, 1, null);

            // Hành động
            congViec.XoaMem(idNguoiXoa: 1);

            // Kiểm tra
            congViec.DaXoa.Should().BeTrue();
            congViec.CacSuKienDomain.Should().Contain(e => e is SuKienCongViecDaXoa);
        }
    }
}
