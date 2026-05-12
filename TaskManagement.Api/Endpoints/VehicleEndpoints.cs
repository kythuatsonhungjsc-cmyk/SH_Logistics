using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Api.Endpoints
{
    /// <summary>
    /// Điểm cuối API cho quản lý Phương tiện (Xe)
    /// </summary>
    public static class EndpointsPhuongTien
    {
        public static void MapEndpointsPhuongTien(this IEndpointRouteBuilder app)
        {
            var nhomApi = app.MapGroup("/api/vehicles")
                           .WithTags("PhuongTien");

            // GET /api/vehicles - Lấy danh sách tất cả xe
            nhomApi.MapGet("/", async ([FromServices] IKhoLuuTruPhuongTien kho) =>
            {
                var danhSach = await kho.LayTatCaAsync();
                return Results.Ok(danhSach);
            });

            // GET /api/vehicles/{id} - Lấy thông tin 1 xe theo ID
            nhomApi.MapGet("/{id}", async (int id, [FromServices] IKhoLuuTruPhuongTien kho) =>
            {
                var xe = await kho.LayTheoIdAsync(id);
                return xe is null ? Results.NotFound("Không tìm thấy phương tiện.") : Results.Ok(xe);
            });

            // POST /api/vehicles - Thêm xe mới
            nhomApi.MapPost("/", async ([FromBody] PhuongTien xe, [FromServices] IKhoLuuTruPhuongTien kho) =>
            {
                xe.NgayTao = DateTime.UtcNow;
                await kho.ThemAsync(xe);
                return Results.Created($"/api/vehicles/{xe.Id}", xe);
            });

            // PUT /api/vehicles/{id} - Cập nhật thông tin xe
            nhomApi.MapPut("/{id}", async (int id, [FromBody] PhuongTien duLieuMoi, [FromServices] IKhoLuuTruPhuongTien kho) =>
            {
                var xeHienTai = await kho.LayTheoIdAsync(id);
                if (xeHienTai is null) return Results.NotFound("Không tìm thấy phương tiện.");

                xeHienTai.BienSoXe = duLieuMoi.BienSoXe;
                xeHienTai.CongTy = duLieuMoi.CongTy;
                xeHienTai.DoiXe = duLieuMoi.DoiXe;
                xeHienTai.HangXe = duLieuMoi.HangXe;
                xeHienTai.TaiTrong = duLieuMoi.TaiTrong;
                xeHienTai.KichThuoc = duLieuMoi.KichThuoc;
                xeHienTai.LoaiLop = duLieuMoi.LoaiLop;
                xeHienTai.SoKhung = duLieuMoi.SoKhung;
                xeHienTai.SoMay = duLieuMoi.SoMay;
                xeHienTai.NamSanXuat = duLieuMoi.NamSanXuat;
                xeHienTai.NienHan = duLieuMoi.NienHan;
                xeHienTai.MauSon = duLieuMoi.MauSon;
                xeHienTai.SoKmHienTai = duLieuMoi.SoKmHienTai;
                xeHienTai.TrangThai = duLieuMoi.TrangThai;

                kho.CapNhat(xeHienTai);
                return Results.Ok(xeHienTai);
            });
        }
    }
}
