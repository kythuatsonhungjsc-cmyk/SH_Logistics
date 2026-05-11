using System;

namespace QuanLyCongViec.Domain.Entities
{
    public class LichSuBaoDuong
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        /// <summary>
        /// ID hóa đơn, có thể lưu dạng chuỗi (vd: INV-12345)
        /// Các hạng mục cùng ID hóa đơn sẽ thuộc về 1 lần sửa chữa
        /// </summary>
        public string IdHoaDon { get; set; } = string.Empty;

        public DateTime NgaySuaChua { get; set; }
        
        public string BienSoXe { get; set; } = string.Empty;
        
        public string NoiDung { get; set; } = string.Empty;
        
        public string HangMucBaoDuong { get; set; } = string.Empty;
        
        /// <summary>
        /// Tổng số kilomet xe đi được từ lúc mua về đến ngày đi bảo dưỡng sửa chữa
        /// </summary>
        public string KmBaoDuong { get; set; } = string.Empty;
        
        public decimal SoTien { get; set; }
        
        public decimal Vat { get; set; }
        
        public decimal TongTien { get; set; }
        
        public string Gara { get; set; } = string.Empty;
        
        public string HinhThuc { get; set; } = string.Empty;
        
        public string PhuTrach { get; set; } = string.Empty;
    }
}
