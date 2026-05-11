using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using MediatR;
using QuanLyCongViec.Application.Maintenance.Commands.CreateHoaDonBaoDuong;
using QuanLyCongViec.Application.Maintenance.Queries.GetLichSuBaoDuong;
using Microsoft.AspNetCore.Authorization;

namespace QuanLyCongViec.Api.Endpoints
{
    /// <summary>
    /// Lớp định nghĩa các điểm cuối (Endpoints) cho API quản lý bảo dưỡng xe
    /// </summary>
    public static class EndpointsBaoDuong
    {
        public static void MapEndpointsBaoDuong(this IEndpointRouteBuilder app)
        {
            var nhomApi = app.MapGroup("/api/maintenance")
                           .WithTags("BaoDuong");

            // Điểm cuối lấy danh sách lịch sử bảo dưỡng
            nhomApi.MapGet("/history", async (IMediator mediator) =>
            {
                var ketQua = await mediator.Send(new TruyVanLichSuBaoDuong());
                return Results.Ok(ketQua);
            });

            // Điểm cuối thêm mới hóa đơn bảo dưỡng
            nhomApi.MapPost("/invoice", async (LenhTaoHoaDonBaoDuong lenh, IMediator mediator) =>
            {
                var ketQua = await mediator.Send(lenh);
                if (!ketQua.ThanhCong && ketQua.NghiNgoTrungLap)
                {
                    return Results.Conflict(new { 
                        ThongBao = ketQua.ThongBaoLoi, 
                        ThongTinTrungLap = ketQua.ThongTinTrungLap 
                    });
                }

                if (!ketQua.ThanhCong)
                {
                    return Results.BadRequest(ketQua.ThongBaoLoi);
                }

                return Results.Ok(new { ThongBao = "Lưu hóa đơn thành công" });
            });
        }
    }
}
