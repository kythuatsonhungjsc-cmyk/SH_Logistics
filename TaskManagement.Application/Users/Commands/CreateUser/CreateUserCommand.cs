using MediatR;
using QuanLyCongViec.Application.Common.Interfaces;
using EntityNguoiDung = QuanLyCongViec.Domain.Entities.NguoiDung;
using QuanLyCongViec.Domain.Enum;

namespace QuanLyCongViec.Application.NguoiDung.Commands.TaoNguoiDung
{
    /// <summary>
    /// Lệnh tạo người dùng mới do Admin thực hiện
    /// </summary>
    public record LenhTaoNguoiDung(string Email, string HoTen, string MatKhau, VaiTroNguoiDung VaiTro) : IRequest<int>;

    public class XuLyLenhTaoNguoiDung : IRequestHandler<LenhTaoNguoiDung, int>
    {
        private readonly IKhoLuuTruNguoiDung _khoNguoiDung;
        private readonly IDonViCongViec _donViCongViec;

        public XuLyLenhTaoNguoiDung(IKhoLuuTruNguoiDung khoNguoiDung, IDonViCongViec donViCongViec)
        {
            _khoNguoiDung = khoNguoiDung;
            _donViCongViec = donViCongViec;
        }

        public async Task<int> Handle(LenhTaoNguoiDung yeuCau, CancellationToken cancellationToken)
        {
            // Kiểm tra email đã tồn tại chưa
            var tonTai = await _khoNguoiDung.LayTheoEmailAsync(yeuCau.Email);
            if (tonTai != null) throw new Exception("Địa chỉ Email đã tồn tại trên hệ thống.");

            // Giả sử mật khẩu được hash (TODO: Implement BCrypt hashing)
            var hashMatKhau = yeuCau.MatKhau; 

            var nguoiDung = EntityNguoiDung.Tao(yeuCau.Email, yeuCau.HoTen, hashMatKhau);
            nguoiDung.GanVaiTro(yeuCau.VaiTro);

            await _khoNguoiDung.ThemAsync(nguoiDung);
            await _donViCongViec.LuuThayDoiAsync(cancellationToken);

            return nguoiDung.Id;
        }
    }
}
