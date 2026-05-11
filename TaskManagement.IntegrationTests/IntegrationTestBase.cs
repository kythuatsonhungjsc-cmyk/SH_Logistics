using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using Testcontainers.Redis;
using QuanLyCongViec.Infrastructure.Persistence;
using Xunit;

namespace QuanLyCongViec.IntegrationTests
{
    /// <summary>
    /// Lớp cơ sở nâng cao cho kiểm tra tích hợp.
    /// Hỗ trợ Container cho cả DB (PostgreSQL) và Cache (Redis).
    /// </summary>
    public abstract class CoSoTestTichHop : IAsyncLifetime
    {
        protected HttpClient Client { get; private set; }
        private WebApplicationFactory<Program> _factory;

        // Định nghĩa các Docker Containers
        private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
            .WithImage("postgres:latest")
            .WithDatabase("db_test_tich_hop")
            .Build();

        private readonly RedisContainer _redisContainer = new RedisBuilder()
            .WithImage("redis:latest")
            .Build();

        public async Task InitializeAsync()
        {
            // Khởi động đồng thời các container
            await Task.WhenAll(_dbContainer.StartAsync(), _redisContainer.StartAsync());

            _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // 1. Thay thế Database thật bằng Container PostgreSQL
                    var dbDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<CoSoDuLieuApp>));
                    if (dbDescriptor != null) services.Remove(dbDescriptor);
                    services.AddDbContext<CoSoDuLieuApp>(options =>
                        options.UseNpgsql(_dbContainer.GetConnectionString()));

                    // 2. Thay thế Redis thật bằng Container Redis
                    services.AddStackExchangeRedisCache(options => 
                        options.Configuration = _redisContainer.GetConnectionString());
                });
            });

            Client = _factory.CreateClient();

            // Chạy Migration để chuẩn bị cấu trúc bảng
            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<CoSoDuLieuApp>();
            await db.Database.MigrateAsync();
        }

        public async Task DisposeAsync()
        {
            await Task.WhenAll(_dbContainer.StopAsync(), _redisContainer.StopAsync());
            _factory.Dispose();
        }
    }
}
