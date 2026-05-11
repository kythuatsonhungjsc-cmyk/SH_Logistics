using MediatR;
using Microsoft.AspNetCore.Mvc;
using QuanLyCongViec.Application.CongViec.Commands.PhanCong;

using QuanLyCongViec.Application.CongViec.Queries.LayDanhSach;

namespace QuanLyCongViec.Api.Endpoints
{
    /// <summary>
    /// Lớp định nghĩa các điểm cuối (Endpoints) cho API quản lý công việc
    /// </summary>
    public static class EndpointsCongViec
    {
        public static void MapEndpointsCongViec(this IEndpointRouteBuilder app)
        {
            // Tạo nhóm API /api/tasks yêu cầu phải đăng nhập
            var nhomApi = app.MapGroup("/api/tasks").RequireAuthorization();

            /// <summary>
            /// API Phân công công việc
            /// Yêu cầu quyền: Quản lý hoặc Quản trị viên
            /// </summary>
            nhomApi.MapPut("/{id}/assign", async (int id, [FromBody] LenhPhanCongCongViec lenh, [FromServices] IMediator mediator) =>
            {
                // Kiểm tra tính nhất quán giữa ID trên URL và ID trong Payload
                if (id != lenh.IdCongViec) return Results.BadRequest("ID công việc không khớp.");
                
                // Gửi lệnh xử lý qua MediatR
                await mediator.Send(lenh);
                
                return Results.NoContent();
            }).RequireAuthorization("ManagerOrAdmin");

            /// <summary>
            /// API Lấy danh sách công việc (có phân trang & cache)
            /// </summary>
            nhomApi.MapGet("/", async (int soTrang, int kichThuoc, [FromServices] IMediator mediator) =>
            {
                var idNguoiDung = 1; // Giả lập lấy từ Token
                var query = new TruyVanDanhSachCongViec(idNguoiDung, soTrang, kichThuoc);
                var ketQua = await mediator.Send(query);
                return Results.Ok(ketQua);
            });

            // Có thể thêm các API khác như: Lấy danh sách, Tạo mới, Xóa... ở đây
        }
    }
}
