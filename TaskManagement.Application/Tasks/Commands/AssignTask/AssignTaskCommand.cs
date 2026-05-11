using MediatR;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Application.CongViec.Commands.PhanCong
{
    /// <summary>
    /// Lệnh yêu cầu phân công công việc cho một người dùng
    /// </summary>
    /// <param name="IdCongViec">ID của công việc cần giao</param>
    /// <param name="IdNguoiDung">ID của người sẽ nhận việc</param>
    /// <param name="IdQuanLy">ID của người thực hiện việc giao (thường là Manager/Admin)</param>
    public record LenhPhanCongCongViec(int IdCongViec, int IdNguoiDung, int IdQuanLy) : IRequest;

    /// <summary>
    /// Bộ xử lý thực hiện logic phân công công việc
    /// </summary>
    public class XuLyLenhPhanCongCongViec : IRequestHandler<LenhPhanCongCongViec>
    {
        private readonly IKhoLuuTruCongViec _khoCongViec;
        private readonly IDonViCongViec _donViCongViec;
        private readonly IMediator _mediator;

        public XuLyLenhPhanCongCongViec(IKhoLuuTruCongViec khoCongViec, IDonViCongViec donViCongViec, IMediator mediator)
        {
            _khoCongViec = khoCongViec;
            _donViCongViec = donViCongViec;
            _mediator = mediator;
        }

        public async Task Handle(LenhPhanCongCongViec yeuCau, CancellationToken cancellationToken)
        {
            // 1. Tìm kiếm công việc trong cơ sở dữ liệu
            var congViec = await _khoCongViec.LayTheoIdAsync(yeuCau.IdCongViec);
            if (congViec == null) throw new Exception("Không tìm thấy công việc yêu cầu.");

            // 2. Thực hiện logic phân công trong Domain Entity
            // Phương thức GiaoCho sẽ kiểm tra các ràng buộc nghiệp vụ
            congViec.GiaoCho(yeuCau.IdNguoiDung, yeuCau.IdQuanLy);

            // 3. Lưu các thay đổi xuống cơ sở dữ liệu (Transaction)
            await _donViCongViec.LuuThayDoiAsync(cancellationToken);
            
            // 4. Phát tán các sự kiện Domain phát sinh (ví dụ: gửi mail thông báo, ghi log...)
            foreach (var suKien in congViec.CacSuKienDomain)
            {
                await _mediator.Publish(suKien, cancellationToken);
            }

            // 5. Làm sạch danh sách sự kiện sau khi đã xử lý xong
            congViec.XoaCacSuKien();
        }
    }
}
