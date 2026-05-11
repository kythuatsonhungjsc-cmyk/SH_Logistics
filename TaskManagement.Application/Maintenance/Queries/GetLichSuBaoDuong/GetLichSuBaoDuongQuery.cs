using System.Collections.Generic;
using System.Linq;
using MediatR;
using QuanLyCongViec.Application.Common.Interfaces;

namespace QuanLyCongViec.Application.Maintenance.Queries.GetLichSuBaoDuong
{
    /// <summary>
    /// Truy vấn lấy toàn bộ danh sách lịch sử bảo dưỡng xe
    /// </summary>
    public class TruyVanLichSuBaoDuong : IRequest<List<LichSuBaoDuongDto>>
    {
    }

    /// <summary>
    /// DTO chứa thông tin thu gọn của lịch sử bảo dưỡng để trả về API
    /// </summary>
    public class LichSuBaoDuongDto
    {
        public string Id { get; set; } = string.Empty;
        public string IdHoaDon { get; set; } = string.Empty;
        public string NgaySuaChua { get; set; } = string.Empty;
        public string BienSoXe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string HangMucBaoDuong { get; set; } = string.Empty;
        public string KmBaoDuong { get; set; } = string.Empty;
        public decimal SoTien { get; set; }
        public decimal Vat { get; set; }
        public decimal TongTien { get; set; }
        public string Gara { get; set; } = string.Empty;
        public string HinhThuc { get; set; } = string.Empty;
        public string PhuTrach { get; set; } = string.Empty;
    }

    /// <summary>
    /// Bộ xử lý truy vấn lịch sử bảo dưỡng
    /// Sử dụng IKhoLuuTruBaoDuong (Clean Architecture - không phụ thuộc Infrastructure)
    /// </summary>
    public class XuLyTruyVanLichSuBaoDuong : IRequestHandler<TruyVanLichSuBaoDuong, List<LichSuBaoDuongDto>>
    {
        private readonly IKhoLuuTruBaoDuong _khoBaoDuong;

        public XuLyTruyVanLichSuBaoDuong(IKhoLuuTruBaoDuong khoBaoDuong)
        {
            _khoBaoDuong = khoBaoDuong;
        }

        public async Task<List<LichSuBaoDuongDto>> Handle(TruyVanLichSuBaoDuong request, CancellationToken cancellationToken)
        {
            var duLieu = await _khoBaoDuong.LayTatCaAsync();

            return duLieu.Select(x => new LichSuBaoDuongDto
            {
                Id = x.Id.ToString(),
                IdHoaDon = x.IdHoaDon,
                NgaySuaChua = x.NgaySuaChua.ToString("dd/MM/yyyy"),
                BienSoXe = x.BienSoXe,
                NoiDung = x.NoiDung,
                HangMucBaoDuong = x.HangMucBaoDuong,
                KmBaoDuong = x.KmBaoDuong,
                SoTien = x.SoTien,
                Vat = x.Vat,
                TongTien = x.TongTien,
                Gara = x.Gara,
                HinhThuc = x.HinhThuc,
                PhuTrach = x.PhuTrach
            }).ToList();
        }
    }
}
