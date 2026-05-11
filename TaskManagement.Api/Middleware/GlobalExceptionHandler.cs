using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace QuanLyCongViec.Api.Middleware
{
    /// <summary>
    /// Bộ xử lý lỗi tập trung cho toàn bộ ứng dụng (NET 10 IExceptionHandler)
    /// Chuyển đổi các Exception thành định dạng ProblemDetails chuẩn RFC 7807
    /// </summary>
    public class BoXuLyLoiToanCuc : IExceptionHandler
    {
        private readonly ILogger<BoXuLyLoiToanCuc> _logger;

        public BoXuLyLoiToanCuc(ILogger<BoXuLyLoiToanCuc> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext context, 
            Exception exception, 
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "Đã xảy ra lỗi không mong muốn: {Message}", exception.Message);

            // Tạo cấu trúc lỗi theo chuẩn ProblemDetails
            var chiTietLoi = new ProblemDetails
            {
                Instance = context.Request.Path,
                Title = "Đã xảy ra lỗi hệ thống",
                Detail = exception.Message
            };

            // Phân loại mã lỗi dựa trên kiểu Exception
            switch (exception)
            {
                case UnauthorizedAccessException:
                    chiTietLoi.Status = StatusCodes.Status401Unauthorized;
                    chiTietLoi.Title = "Không có quyền truy cập";
                    break;
                case InvalidOperationException:
                    chiTietLoi.Status = StatusCodes.Status400BadRequest;
                    chiTietLoi.Title = "Thao tác không hợp lệ";
                    break;
                case ArgumentException:
                    chiTietLoi.Status = StatusCodes.Status400BadRequest;
                    chiTietLoi.Title = "Dữ liệu đầu vào không đúng";
                    break;
                default:
                    chiTietLoi.Status = StatusCodes.Status500InternalServerError;
                    break;
            }

            context.Response.StatusCode = chiTietLoi.Status.Value;

            // Trả về JSON cho Client
            await context.Response.WriteAsJsonAsync(chiTietLoi, cancellationToken);

            return true;
        }
    }
}
