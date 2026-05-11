using Microsoft.EntityFrameworkCore;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Infrastructure.Persistence
{
    /// <summary>
    /// Lớp bối cảnh cơ sở dữ liệu (DbContext) chính của ứng dụng
    /// Chịu trách nhiệm quản lý kết nối và ánh xạ các thực thể (Entities) xuống SQL
    /// </summary>
    public class CoSoDuLieuApp : DbContext
    {
        public CoSoDuLieuApp(DbContextOptions<CoSoDuLieuApp> options) : base(options) { }

        /// <summary> Bảng danh sách người dùng </summary>
        public DbSet<NguoiDung> CacNguoiDung => Set<NguoiDung>();
        
        /// <summary> Bảng danh sách công việc </summary>
        public DbSet<CongViec> CacCongViec => Set<CongViec>();
        
        /// <summary> Bảng lịch sử hoạt động hệ thống </summary>
        public DbSet<LichSuHoatDong> CacLichSuHoatDong => Set<LichSuHoatDong>();

        /// <summary> Bảng lịch sử bảo dưỡng xe </summary>
        public DbSet<LichSuBaoDuong> CacLichSuBaoDuong => Set<LichSuBaoDuong>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình cho thực thể Công việc
            modelBuilder.Entity<CongViec>(entity => {
                // Thiết lập mối quan hệ với người tạo
                entity.HasOne(t => t.NguoiTao)
                    .WithMany()
                    .HasForeignKey(t => t.IdNguoiTao)
                    .OnDelete(DeleteBehavior.NoAction);

                // Thiết lập mối quan hệ với người được giao
                entity.HasOne(t => t.NguoiDuocGiao)
                    .WithMany()
                    .HasForeignKey(t => t.IdNguoiDuocGiao)
                    .OnDelete(DeleteBehavior.NoAction);

                // Bộ lọc toàn cục: Luôn ẩn các công việc đã bị xóa mềm
                entity.HasQueryFilter(t => !t.DaXoa);
                
                // Tạo Index để tăng tốc độ truy vấn
                entity.HasIndex(t => t.TrangThai);
                entity.HasIndex(t => t.IdNguoiDuocGiao);
            });

            // Cấu hình cho thực thể Lịch sử hoạt động
            modelBuilder.Entity<LichSuHoatDong>(entity => {
                // Sử dụng kiểu dữ liệu jsonb của PostgreSQL để lưu trữ dữ liệu động linh hoạt
                entity.Property(a => a.DuLieuThayDoi).HasColumnType("jsonb");
                
                entity.HasIndex(a => a.IdCongViec);
            });

            // Cấu hình cho thực thể Lịch sử bảo dưỡng
            modelBuilder.Entity<LichSuBaoDuong>(entity => {
                entity.HasIndex(e => e.IdHoaDon);
                entity.HasIndex(e => e.BienSoXe);
                entity.HasIndex(e => e.NgaySuaChua);
            });
        }
    }
}
