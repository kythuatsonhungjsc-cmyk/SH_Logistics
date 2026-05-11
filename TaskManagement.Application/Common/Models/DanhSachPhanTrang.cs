namespace QuanLyCongViec.Application.Common.Models
{
    /// <summary>
    /// Lớp bọc dữ liệu trả về hỗ trợ phân trang
    /// </summary>
    public class DanhSachPhanTrang<T>
    {
        public List<T> Items { get; set; }
        public int TrangHienTai { get; set; }
        public int TongSoTrang { get; set; }
        public int TongSoBanGhi { get; set; }
        public bool CoTrangTruoc => TrangHienTai > 1;
        public bool CoTrangSau => TrangHienTai < TongSoTrang;

        public DanhSachPhanTrang(List<T> items, int count, int pageNumber, int pageSize)
        {
            Items = items;
            TongSoBanGhi = count;
            TrangHienTai = pageNumber;
            TongSoTrang = (int)Math.Ceiling(count / (double)pageSize);
        }
    }
}
