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

        /// <summary> Bảng danh sách phương tiện </summary>
        public DbSet<PhuongTien> CacPhuongTien => Set<PhuongTien>();

        /// <summary> Bảng danh sách lái xe </summary>
        public DbSet<LaiXe> CacLaiXe => Set<LaiXe>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình cho thực thể Công việc
            modelBuilder.Entity<CongViec>(entity => {
                entity.HasOne(t => t.NguoiTao)
                    .WithMany()
                    .HasForeignKey(t => t.IdNguoiTao)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(t => t.NguoiDuocGiao)
                    .WithMany()
                    .HasForeignKey(t => t.IdNguoiDuocGiao)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasQueryFilter(t => !t.DaXoa);
                entity.HasIndex(t => t.TrangThai);
                entity.HasIndex(t => t.IdNguoiDuocGiao);
            });

            // Cấu hình cho thực thể Lịch sử hoạt động
            modelBuilder.Entity<LichSuHoatDong>(entity => {
                entity.Property(a => a.DuLieuThayDoi).HasColumnType("jsonb");
                entity.HasIndex(a => a.IdCongViec);
            });

            // Cấu hình cho thực thể Lịch sử bảo dưỡng
            modelBuilder.Entity<LichSuBaoDuong>(entity => {
                entity.HasIndex(e => e.IdHoaDon);
                entity.HasIndex(e => e.BienSoXe);
                entity.HasIndex(e => e.NgaySuaChua);
            });

            // Cấu hình cho thực thể Phương tiện
            modelBuilder.Entity<PhuongTien>(entity => {
                entity.HasIndex(e => e.BienSoXe).IsUnique();
                entity.HasIndex(e => e.TrangThai);
            });

            // Cấu hình cho thực thể Lái xe
            modelBuilder.Entity<LaiXe>(entity => {
                entity.HasIndex(e => e.SoCCCD).IsUnique();
                entity.HasIndex(e => e.TrangThai);
            });
        }
    }
}
