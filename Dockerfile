# 1. Giai đoạn Xây dựng (Build Stage)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Sao chép các file dự án (.csproj) để restore dependencies trước (tận dụng cache của Docker)
COPY ["TaskManagement.Api/TaskManagement.Api.csproj", "TaskManagement.Api/"]
COPY ["TaskManagement.Domain/TaskManagement.Domain.csproj", "TaskManagement.Domain/"]
COPY ["TaskManagement.Application/TaskManagement.Application.csproj", "TaskManagement.Application/"]
COPY ["TaskManagement.Infrastructure/TaskManagement.Infrastructure.csproj", "TaskManagement.Infrastructure/"]

RUN dotnet restore "TaskManagement.Api/TaskManagement.Api.csproj"

# Sao chép toàn bộ mã nguồn và thực hiện Build
COPY . .
WORKDIR "/src/TaskManagement.Api"
RUN dotnet build "TaskManagement.Api.csproj" -c Release -o /app/build

# 2. Giai đoạn Publish (Publish Stage)
FROM build AS publish
RUN dotnet publish "TaskManagement.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. Giai đoạn Runtime (Final Stage)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Cấu hình biến môi trường
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "TaskManagement.Api.dll"]
