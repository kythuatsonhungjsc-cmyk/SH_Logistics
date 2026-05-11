using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using QuanLyCongViec.Infrastructure.Persistence;
using QuanLyCongViec.Infrastructure.Dashboard;
using QuanLyCongViec.Infrastructure.Security;
using QuanLyCongViec.Infrastructure.Notifications;
using QuanLyCongViec.Application.Common.Interfaces;
using QuanLyCongViec.Domain.Services;
using QuanLyCongViec.Api.Middleware;
using MediatR;
using QuanLyCongViec.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CẤU HÌNH CÁC DỊCH VỤ (Dependency Injection) ---

// Cơ sở dữ liệu PostgreSQL
builder.Services.AddDbContext<CoSoDuLieuApp>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cache và SignalR cho Dashboard thời gian thực
builder.Services.AddDistributedMemoryCache(); 
builder.Services.AddSignalR();

// Đăng ký MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(QuanLyCongViec.Application.Common.Interfaces.IKhoLuuTruCongViec).Assembly));

// Đăng ký các dịch vụ Domain & Security nâng cao
builder.Services.AddScoped<DichVuNguoiDungDomain>();
builder.Services.AddScoped<DichVuChongTanCongVetCan>();
builder.Services.AddScoped<DichVuXacThuc>();
builder.Services.AddScoped<QuanLyCongViec.Infrastructure.Notifications.DichVuLienKetTelegram>();

// Đăng ký Repository cho module Bảo dưỡng
builder.Services.AddScoped<IKhoLuuTruBaoDuong, KhoLuuTruBaoDuong>();

// Đăng ký bộ xử lý lỗi toàn cục (Global Exception Handling - NET 10)
builder.Services.AddExceptionHandler<BoXuLyLoiToanCuc>();
builder.Services.AddProblemDetails();

// Cấu hình xác thực JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "bi_mat_sieu_cap_dai_it_nhat_32_ky_tu_12345");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Phân quyền
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole("Admin", "Manager"));
});

// Swagger & OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// --- 2. CẤU HÌNH PIPELINE XỬ LÝ REQUEST (Middleware) ---

// Kích hoạt xử lý lỗi toàn cục
app.UseExceptionHandler();

// Khởi tạo cơ sở dữ liệu (bỏ qua nếu DB chưa sẵn sàng)
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<CoSoDuLieuApp>();
    db.Database.EnsureCreated();
}
catch (Exception ex)
{
    app.Logger.LogWarning("⚠️ Không thể kết nối cơ sở dữ liệu: {Message}. Ứng dụng vẫn khởi động bình thường.", ex.Message);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication(); 
app.UseAuthorization();  

// Route SignalR & API
app.MapHub<HubDashboard>("/hubs/dashboard");
app.MapEndpointsCongViec();
app.MapEndpointsNguoiDung();
app.MapEndpointsBaoDuong();

app.Run();
