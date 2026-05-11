using System;
using System.Collections.Generic;
using System.Linq;
using MediatR;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Application.Maintenance.Commands.CreateHoaDonBaoDuong
{
    public class ChiTietBaoDuongDto
    {
        public string NoiDung { get; set; } = string.Empty;
        public string HangMucBaoDuong { get; set; } = string.Empty;
        public decimal SoTien { get; set; }
        public decimal Vat { get; set; }
        public decimal TongTien { get; set; }
    }

    /// <summary>
    /// Lệnh yêu cầu tạo mới hóa đơn bảo dưỡng / sửa chữa
    /// </summary>
    public class LenhTaoHoaDonBaoDuong : IRequest<KetQuaTaoHoaDonBaoDuong>
    {
        public string IdHoaDon { get; set; } = string.Empty;
        public DateTime NgaySuaChua { get; set; }
        public string BienSoXe { get; set; } = string.Empty;
        public string KmBaoDuong { get; set; } = string.Empty;
        public string Gara { get; set; } = string.Empty;
        public string HinhThuc { get; set; } = string.Empty;
        public string PhuTrach { get; set; } = string.Empty;

        /// <summary> Danh sách chi tiết các hạng mục sửa chữa </summary>
        public List<ChiTietBaoDuongDto> ChiTiet { get; set; } = new();
    }

    /// <summary>
    /// Kết quả trả về sau khi xử lý lệnh tạo hóa đơn
    /// </summary>
    public class KetQuaTaoHoaDonBaoDuong
    {
        public bool ThanhCong { get; set; }
        public string ThongBaoLoi { get; set; } = string.Empty;
        public bool NghiNgoTrungLap { get; set; }
        public object ThongTinTrungLap { get; set; }
    }

    /// <summary>
    /// Bộ xử lý lệnh tạo hóa đơn bảo dưỡng
    /// Sử dụng IKhoLuuTruBaoDuong (Clean Architecture - không phụ thuộc Infrastructure)
    /// </summary>
    public class XuLyLenhTaoHoaDonBaoDuong : IRequestHandler<LenhTaoHoaDonBaoDuong, KetQuaTaoHoaDonBaoDuong>
    {
        private readonly IKhoLuuTruBaoDuong _khoBaoDuong;

        public XuLyLenhTaoHoaDonBaoDuong(IKhoLuuTruBaoDuong khoBaoDuong)
        {
            _khoBaoDuong = khoBaoDuong;
        }

        public async Task<KetQuaTaoHoaDonBaoDuong> Handle(LenhTaoHoaDonBaoDuong request, CancellationToken cancellationToken)
        {
            // 1. Kiểm tra trùng lặp qua Repository
            var hoaDonTonTai = await _khoBaoDuong.TimTheoTieuChiAsync(
                request.BienSoXe, request.NgaySuaChua, request.KmBaoDuong, request.Gara);

            if (hoaDonTonTai.Any())
            {
                var hangMucCu = hoaDonTonTai.Select(x => x.HangMucBaoDuong).Where(x => !string.IsNullOrEmpty(x)).ToList();
                var hangMucMoi = request.ChiTiet.Select(x => x.HangMucBaoDuong).Where(x => !string.IsNullOrEmpty(x)).ToList();
                
                bool coNghiNgo = hangMucCu.Intersect(hangMucMoi).Any() || (!hangMucCu.Any() && !hangMucMoi.Any());

                if (coNghiNgo)
                {
                    return new KetQuaTaoHoaDonBaoDuong
                    {
                        ThanhCong = false,
                        NghiNgoTrungLap = true,
                        ThongBaoLoi = "Phát hiện hóa đơn có thể bị trùng lặp!",
                        ThongTinTrungLap = new 
                        {
                            IdHoaDon = hoaDonTonTai.First().IdHoaDon,
                            BienSoXe = request.BienSoXe,
                            Ngay = request.NgaySuaChua.ToString("dd/MM/yyyy"),
                            Km = request.KmBaoDuong,
                            Gara = request.Gara,
                            HangMucTrung = string.Join(", ", hangMucCu.Intersect(hangMucMoi))
                        }
                    };
                }
            }

            // 2. Tạo và lưu các bản ghi bảo dưỡng qua Repository
            var cacBanGhiMoi = request.ChiTiet.Select(chiTiet => new LichSuBaoDuong
            {
                IdHoaDon = request.IdHoaDon,
                NgaySuaChua = request.NgaySuaChua,
                BienSoXe = request.BienSoXe,
                KmBaoDuong = request.KmBaoDuong,
                Gara = request.Gara,
                HinhThuc = request.HinhThuc,
                PhuTrach = request.PhuTrach,
                NoiDung = chiTiet.NoiDung,
                HangMucBaoDuong = chiTiet.HangMucBaoDuong,
                SoTien = chiTiet.SoTien,
                Vat = chiTiet.Vat,
                TongTien = chiTiet.TongTien
            }).ToList();

            await _khoBaoDuong.ThemNhieuAsync(cacBanGhiMoi);

            return new KetQuaTaoHoaDonBaoDuong { ThanhCong = true };
        }
    }
}
