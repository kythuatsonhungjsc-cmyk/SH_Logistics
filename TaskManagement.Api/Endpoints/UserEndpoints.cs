using Microsoft.AspNetCore.Mvc;
using QuanLyCongViec.Infrastructure.Notifications;

namespace QuanLyCongViec.Api.Endpoints
{
    public static class EndpointsNguoiDung
    {
        public static void MapEndpointsNguoiDung(this IEndpointRouteBuilder app)
        {
            var nhomApi = app.MapGroup("/api/users").RequireAuthorization();

            /// <summary>
            /// API Lấy link liên kết Telegram
            /// </summary>
            nhomApi.MapGet("/telegram-link", async ([FromServices] DichVuLienKetTelegram dichVu) =>
            {
                // Giả lập lấy ID người dùng từ Token
                var idNguoiDung = 1; 
                
                var token = await dichVu.TaoLinkLienKetAsync(idNguoiDung);
                var botUsername = "QuanLyCongViec_Bot"; // Tên bot thật của bạn
                
                var link = $"https://t.me/{botUsername}?start={token}";
                
                return Results.Ok(new { Link = link, Token = token });
            });
        }
    }
}
