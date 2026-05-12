using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Entities;

namespace QuanLyCongViec.Api.Endpoints
{
    /// <summary>
    /// Điểm cuối API cho quản lý Lái xe
    /// </summary>
    public static class EndpointsLaiXe
    {
        public static void MapEndpointsLaiXe(this IEndpointRouteBuilder app)
        {
            var nhomApi = app.MapGroup("/api/drivers")
                           .WithTags("LaiXe");

            // GET /api/drivers - Lấy danh sách tất cả lái xe
            nhomApi.MapGet("/", async ([FromServices] IKhoLuuTruLaiXe kho) =>
            {
                var danhSach = await kho.LayTatCaAsync();
                return Results.Ok(danhSach);
            });

            // GET /api/drivers/{id} - Lấy thông tin 1 lái xe theo ID
            nhomApi.MapGet("/{id}", async (int id, [FromServices] IKhoLuuTruLaiXe kho) =>
            {
                var laiXe = await kho.LayTheoIdAsync(id);
                return laiXe is null ? Results.NotFound("Không tìm thấy lái xe.") : Results.Ok(laiXe);
            });

            // POST /api/drivers - Thêm lái xe mới
            nhomApi.MapPost("/", async ([FromBody] LaiXe laiXe, [FromServices] IKhoLuuTruLaiXe kho) =>
            {
                laiXe.NgayTao = DateTime.UtcNow;
                await kho.ThemAsync(laiXe);
                return Results.Created($"/api/drivers/{laiXe.Id}", laiXe);
            });

            // PUT /api/drivers/{id} - Cập nhật thông tin lái xe
            nhomApi.MapPut("/{id}", async (int id, [FromBody] LaiXe duLieuMoi, [FromServices] IKhoLuuTruLaiXe kho) =>
            {
                var laiXeHienTai = await kho.LayTheoIdAsync(id);
                if (laiXeHienTai is null) return Results.NotFound("Không tìm thấy lái xe.");

                laiXeHienTai.HoTen = duLieuMoi.HoTen;
                laiXeHienTai.AnhDaiDien = duLieuMoi.AnhDaiDien;
                laiXeHienTai.SoDienThoai = duLieuMoi.SoDienThoai;
                laiXeHienTai.DiaChi = duLieuMoi.DiaChi;
                laiXeHienTai.SoCCCD = duLieuMoi.SoCCCD;
                laiXeHienTai.LoaiBangLai = duLieuMoi.LoaiBangLai;
                laiXeHienTai.SoGPLX = duLieuMoi.SoGPLX;
                laiXeHienTai.NoiCap = duLieuMoi.NoiCap;
                laiXeHienTai.NgayCap = duLieuMoi.NgayCap;
                laiXeHienTai.NgayHetHan = duLieuMoi.NgayHetHan;
                laiXeHienTai.CongTy = duLieuMoi.CongTy;
                laiXeHienTai.DoiXe = duLieuMoi.DoiXe;
                laiXeHienTai.TrangThai = duLieuMoi.TrangThai;

                kho.CapNhat(laiXeHienTai);
                return Results.Ok(laiXeHienTai);
            });
        }
    }
}
