# TÀI LIỆU ĐẶC TẢ YÊU CẦU HỆ THỐNG
## SH LOGISTICS MANAGEMENT SUITE
**Phiên bản:** 2.0 – Kiến trúc sạch, bất khả tri về công nghệ  
**Ngày:** 07/05/2026

---

# 1. Tổng quan dự án

**Mục tiêu:**  
- Số hóa toàn bộ quy trình quản lý đội xe ~200 phương tiện.  
- Tăng cường an toàn vận hành, minh bạch trách nhiệm, giảm thất thoát.  
- Hệ thống phải được thiết kế để dễ bảo trì, mở rộng, không phụ thuộc vào framework cụ thể.

**Phạm vi giai đoạn 1:**  
- Quản lý danh mục (xe, lái xe, giấy tờ, thiết bị).  
- Checklist an toàn 20 hạng mục (bắt buộc trước khi nhận đơn).  
- Bàn giao xe số hóa (ký số).  
- Theo dõi GPS, nhập dầu, cảnh báo giấy tờ hết hạn.  
- Quản lý bảo dưỡng định kỳ và sửa chữa (có hóa đơn).  
- Phân quyền người dùng: Admin, Điều vận, Kỹ thuật, Lái xe, Kế toán.

---

# 2. Nhóm người dùng & phân quyền

| Vai trò        | Mô tả quyền hạn |
|----------------|-----------------|
| Quản trị viên  | Toàn quyền cấu hình, quản lý danh mục, xem báo cáo. |
| Điều vận       | Gán lái – xe, theo dõi checklist, vị trí GPS. |
| Kỹ thuật viên  | Quản lý bảo dưỡng, sửa chữa, phụ tùng. |
| Lái xe         | Thực hiện checklist, bàn giao xe, xem lịch sử cá nhân. |
| Kế toán        | Xem báo cáo chi phí, nhiên liệu, xuất dữ liệu. |

---

# 3. Yêu cầu chức năng chi tiết

## 3.1 Quản lý danh mục (Master Data)

- **Lái xe:** Họ tên, ảnh, SĐT, CCCD, bằng lái (hạng, số, ngày cấp, hết hạn), công ty, đội, trạng thái làm việc.  
- **Xe:** Biển số, công ty, đội, loại xe, tải trọng, kích thước thùng, số khung, số máy, năm SX, niên hạn sử dụng, ODO hiện tại.  
- **Giấy tờ xe:** Đăng ký, đăng kiểm, bảo hiểm TNDS, bảo hiểm thân vỏ (ngày hết hạn, ảnh scan).  
- **Công cụ/thiết bị:** Danh mục chuẩn (bình chữa cháy, túi cứu thương, …) và danh mục theo yêu cầu khách hàng (pallet, bạt, thanh V…).

## 3.2 Quy trình bàn giao xe

- Khi giao xe, tạo biên bản với danh sách thiết bị & tình trạng thực tế.  
- Hai bên ký số; biên bản bị khóa sau khi hoàn tất.  
- Khi trả xe, đối soát với biên bản giao, ghi nhận chênh lệch và quy trách nhiệm.

## 3.3 Checklist an toàn 20 hạng mục (cốt lõi)

### Quy trình nghiệp vụ (không phụ thuộc UI)

1. **Xác thực:** Kiểm tra lái xe được phân công cho xe hôm nay.  
2. **Ghi nhận ODO:** Chụp ảnh ODO (chỉ camera thật) và nhập số. ODO mới phải ≥ ODO cũ.  
3. **Kiểm tra 20 hạng mục** (theo bảng đính kèm). Mỗi mục phải chọn Đạt/Lỗi. Nếu Lỗi bắt buộc có ảnh hiện trạng.  
4. **Đánh giá kết quả (Domain Service):**
   - Có lỗi nghiêm trọng (phanh, lốp, lái) → khóa xe, tạo cảnh báo khẩn.  
   - Chỉ lỗi nhẹ → xe vẫn sẵn sàng, tạo yêu cầu sửa chữa.  
   - Hoàn toàn đạt → xe sẵn sàng nhận đơn.

### Yêu cầu phi chức năng đặc thù
- **Offline-first:** Lái xe có thể hoàn thành checklist khi không có mạng; dữ liệu đồng bộ sau.  
- **Chống gian lận:** Phát hiện GPS ảo, không cho chọn ảnh từ thư viện.  
- **Watermark:** Tự động đóng dấu (biển số, thời gian, tọa độ) lên ảnh trước khi lưu.

## 3.4 Quản lý GPS

- Nhận luồng tọa độ từ thiết bị gắn trên xe và từ app (mỗi 5-10 phút).  
- Lưu lịch sử: xe, thời gian, tọa độ, tốc độ, nguồn.  
- Domain Service: tính quãng đường, phát hiện vượt tốc độ.

## 3.5 Quản lý nhiên liệu

- Ghi nhận mỗi lần đổ dầu: xe, ngày, lít, đơn giá, ODO, ảnh hóa đơn.  
- Tính tiêu thụ thực tế (lít/100km) và cảnh báo nếu vượt định mức khoán.

## 3.6 Bảo dưỡng & sửa chữa

### 3.6.1 Cấu hình tần suất bảo dưỡng
- Mỗi hạng mục (23 mục chuẩn) có thể cấu hình theo km, theo ngày hoặc hybrid (cái nào đến trước).  
- Áp dụng mặc định cho loại xe (tải: theo km; nâng: theo ngày). Có thể ghi đè riêng cho từng xe.

### 3.6.2 Lịch sử bảo dưỡng
- Mỗi lần thực hiện bảo dưỡng thực tế được ghi nhận: xe, hạng mục, ngày, ODO, gara, chi phí.  
- Hệ thống tự động tính lần bảo dưỡng kế tiếp cho từng hạng mục dựa trên lịch sử và cấu hình.

### 3.6.3 Hóa đơn sửa chữa
- Hóa đơn bao gồm nhiều dòng công việc (linh kiện, nhân công).  
- Mỗi dòng có thể liên kết với một hạng mục bảo dưỡng (nếu là bảo dưỡng định kỳ) để tự động cập nhật lịch sử.  
- Lưu thông tin: gara, hình thức thanh toán, VAT, người phụ trách, ảnh hóa đơn.

### 3.6.4 Cảnh báo đến hạn
- `MaintenanceDueChecker` kiểm tra định kỳ trạng thái của tất cả xe, sinh cảnh báo khi sắp đến hạn bảo dưỡng (theo cấu hình trước hạn).

## 3.7 Cảnh báo & thông báo

- Domain định nghĩa các sự kiện: `CriticalChecklistFailed`, `DocumentExpiringSoon`, `MaintenanceDue`, …  
- Application Layer sẽ gửi thông báo qua Telegram/Email/In-app dựa trên các sự kiện đó.

## 3.8 Báo cáo & Dashboard

- Tổng hợp dữ liệu: tỉ lệ checklist đạt/lỗi, chi phí nhiên liệu, bảo dưỡng, hiệu suất đội xe.  
- Hỗ trợ xuất Excel/PDF.

---

# 4. Yêu cầu phi chức năng (Kiến trúc)

## 4.1 Độc lập framework
- **Domain layer** (Entities, Value Objects, Domain Services) không phụ thuộc vào bất kỳ thư viện ngoài nào. Có thể chạy trong môi trường test thuần túy.

## 4.2 Phân lớp rõ ràng (Clean Architecture)

| Tầng           | Vai trò | Phụ thuộc |
|----------------|--------|-----------|
| **Domain**     | Chứa toàn bộ logic nghiệp vụ, entity, event. | Không phụ thuộc gì. |
| **Application**| Use cases (command/query handler), interface repository, DTO. | Chỉ phụ thuộc Domain. |
| **Infrastructure** | Triển khai repository (ORM), file storage, GPS parser, notification. | Phụ thuộc Application & Domain. |
| **Presentation** | API controller, mobile UI, web dashboard. | Phụ thuộc Application. |

## 4.3 Tránh nợ kỹ thuật
- Mọi quy tắc nghiệp vụ nằm trong Domain, không nằm ở database trigger hay UI.  
- Thay đổi trạng thái entity chỉ qua phương thức có tên rõ ràng (vd: `vehicle.lock()`, không dùng setter public).  
- Sử dụng Inversion of Control (Dependency Injection) cho mọi phụ thuộc bên ngoài.  
- Phải có unit test 100% cho Domain layer.

## 4.4 Các yêu cầu khác
- **Hiệu năng:** Xử lý đồng thời 200 xe gửi dữ liệu; ứng dụng phải dùng hàng đợi/bất đồng bộ ở tầng infrastructure.  
- **Bảo mật:** Xác thực JWT; mọi thay đổi nhạy cảm được ghi vào Audit Log.  
- **Offline:** App lái xe phải có cơ chế đồng bộ trễ (eventual consistency).

---

# 5. Thiết kế Domain Model (trích)
Vehicle {
Id: VehicleId (UUID)
PlateNumber: string (immutable)
Odometer: int
Status: VehicleStatus (Available, Locked, InMaintenance)

lock(): void
unlock(): void
updateOdometer(newOdo: int): void // validation ODO mới >= ODO cũ
}

Driver {
Id: DriverId
LicenseNumber: string
Status: DriverStatus (Active, OnLeave, Resigned)
assignVehicle(vehicleId): void
}

Inspection {
Id: InspectionId
VehicleId: VehicleId
DriverId: DriverId
OdoValue: int
OdoPhoto: Image
Items: List<InspectionDetail>
}

InspectionDetail {
ItemNumber: 1..20
IsPassed: bool
Note: string?
Photo: Image?
}

MaintenanceHistory {
VehicleId
ItemTypeId
PerformedDate
Odometer
}

MaintenanceInvoice {
Id
VehicleId
InvoiceDate
TotalAmount
Details: List<InvoiceDetail>
}

text

Giao tiếp qua các interface ở Application:
interface IVehicleRepository {
getById(id: VehicleId): Vehicle
save(vehicle: Vehicle): void
}

interface IInspectionRepository {
save(inspection: Inspection): void
}

interface IMaintenanceHistoryRepository { ... }
interface IMaintenanceConfigRepository { ... }

text

---

# 6. Một số Use Case chính

## 6.1 Submit Daily Checklist

- **Actor:** Lái xe  
- **Precondition:** Đã được gán vào xe.  
- **Input:** VehicleId, ODO image metadata, ODO value, list of item statuses + optional images.  
- **Steps:**
  1. App gửi `SubmitChecklistCommand` lên server.
  2. Handler nạp Vehicle, kiểm tra phân công.
  3. Domain Service đánh giá ODO, kiểm tra critical items.
  4. Tạo Inspection và InspectionDetail.
  5. Nếu critical fail → `Vehicle.lock()`.
  6. Lưu Inspection, publish `ChecklistSubmitted` event.
- **Postcondition:** Inspection được lưu, vehicle có thể bị khóa.

## 6.2 Record Maintenance History & Invoice

- **Actor:** Kỹ thuật viên / Kế toán  
- **Input:** VehicleId, list of work items (each with item type, cost, …), gara, ngày, ODO.  
- **Steps:**
  1. Tạo `MaintenanceInvoice` và các `InvoiceDetail`.
  2. Với mỗi dòng liên kết đến hạng mục bảo dưỡng, tạo `MaintenanceHistory`.
  3. Lưu invoice và history.
- **Postcondition:** Lịch sử bảo dưỡng được cập nhật, tính toán kỳ bảo dưỡng tiếp theo.

---

# 7. Tổ chức mã nguồn gợi ý
src/
├── domain/
│ ├── entities/
│ ├── value-objects/
│ ├── services/
│ └── events/
├── application/
│ ├── commands/
│ ├── queries/
│ ├── handlers/
│ ├── interfaces/
│ └── dtos/
├── infrastructure/
│ ├── persistence/
│ ├── notifications/
│ ├── gps/
│ └── storage/
└── presentation/
├── api/ (REST controllers)
├── web/ (dashboard)
└── mobile/ (app)

text

---

# 8. Kế hoạch triển khai & Chuẩn mực cho Dev

- **Domain first:** Code Domain layer trước, viết unit test đầy đủ.  
- **Ngôn ngữ chung:** Mọi class/method đều dùng thuật ngữ nghiệp vụ (Ubiquitous Language).  
- **Không rò rỉ logic:** Tất cả điều kiện, ràng buộc nằm trong Domain; không dùng stored procedure cho logic nghiệp vụ.  
- **Tự động kiểm tra:** CI/CD phải chạy toàn bộ unit test Domain và integration test Application.

Bắt đầu ngay từ **Domain Model** và **Checklist Use Case** – đó là trái tim của hệ thống.
1. Kiến trúc tổng thể sau khi tích hợp các bước
Theo đặc tả yêu cầu (file SH_Logistics_Requirements_CleanArch.md), chúng ta có 4 tầng: Domain, Application, Infrastructure, Presentation. Bản thiết kế kỹ thuật của anh/chị đã gán đúng công nghệ cho từng tầng:

Tầng	Nội dung chính từ đặc tả	Công nghệ áp dụng (theo bản kỹ thuật)
Domain	Entities, Value Objects, Domain Services	POCO C#, không phụ thuộc EF Core hay ASP.NET
Application	Use Cases, DTOs, Interfaces (Repository)	Class libraries thuần C#, định nghĩa Contracts
Infrastructure	Triển khai Repository, DbContext, lưu trữ file	EF Core 10, SQL Server, JSON columns
Presentation	API endpoints, Mobile App, Web Dashboard	Minimal API (.NET 10), Flutter/PWA
Đây chính là Clean Architecture mà anh/chị đã mô tả ở Bước 1 & 2. Domain không hề biết đến database hay HTTP; mọi phụ thuộc đều hướng vào trong.

2. Điểm mấu chốt: Lưu trữ Checklist bằng JSON Column
Tài liệu Bước 3 đề xuất lưu 20 hạng mục checklist dưới dạng một cột JSON duy nhất thay vì tạo 20 cột Boolean. Đây là quyết định kiến trúc cực kỳ quan trọng, và tôi hoàn toàn đồng ý. Lý do:

Tránh nợ kỹ thuật: Sau này nếu khách hàng yêu cầu tăng lên 21 hoặc 25 hạng mục, chúng ta chỉ cần mở rộng Domain model và JSON schema, không phải thay đổi schema database (tránh migration phức tạp).

Phù hợp với Domain: Domain entity Inspection sẽ chứa một collection Details (kiểu IReadOnlyList<InspectionDetail>). Infrastructure sẽ serialize/deserialize collection đó thành JSON. Như vậy logic nghiệp vụ vẫn làm việc với object thuần túy, không biết gì về JSON.

Truy vấn linh hoạt: EF Core hỗ trợ truy vấn JSON, giúp dễ dàng thống kê tỉ lệ lỗi theo từng hạng mục mà không cần cột riêng.

Tôi lưu ý: cột JSON này chỉ là cách lưu trữ, không được phép làm lộ cấu trúc dữ liệu lên Application hay Presentation. DTO sẽ ánh xạ từ JSON thành danh sách InspectionDetailDto.

3. DTO và Minimal API – Bảo vệ Domain, tối ưu trải nghiệm lái xe
Bước 4 nói về Minimal API và DTO pattern. Tôi tóm lược cách áp dụng vào yêu cầu nghiệp vụ của chúng ta:

DTO InspectionRequest (payload từ mobile): Chứa VehicleId, OdoPhoto, OdoValue, danh sách ItemStatus (có thể chỉ gồm ItemNumber, IsPassed, Photo).

Controller (Minimal API): Nhận request → gọi Application layer (Command Handler), không xử lý nghiệp vụ.

Application Handler:

Map DTO → Domain objects (tạo Inspection và InspectionDetail).
Gọi Domain Service ChecklistEvaluator để đánh giá critical failure.
Dùng Repository để lưu.
Trả về Response DTO (kết quả cho lái xe: “Xe sẵn sàng” hoặc “Xe bị khóa”).
Tách biệt hoàn toàn: Domain không hề biết đến Minimal API hay DTO.

Với Minimal API, chúng ta có thể đạt được tốc độ phản hồi rất nhanh, quan trọng với mạng 4G yếu của lái xe. Đồng thời việc nhóm API theo nhóm (ví dụ /api/checklist) giúp dễ quản lý, áp dụng chính sách bảo mật riêng.

4. Giải đáp các câu hỏi then chốt (Key Questions) từ tài liệu kỹ thuật
4.1. Tại sao nên dùng Guid thay vì số nguyên cho ID?
Bảo mật: Guid không dễ đoán, tránh lộ thông tin số lượng bản ghi (vd: /api/vehicles/5 dễ bị dò).

Phân tán: Sau này nếu cần đồng bộ dữ liệu giữa nhiều server hoặc cho phép app tạo ID offline (khi lái xe check checklist không có mạng), Guid đảm bảo không trùng lặp.

Đối với bảng có hàng trăm triệu bản ghi, Guid có thể ảnh hưởng đến fragmentation, nhưng với quy mô 200 xe, điều này không đáng lo. Chúng ta vẫn chọn Guid (UUID).

4.2. Làm thế nào để API tự động từ chối nếu Checklist thiếu hạng mục?
Logic này nằm ở Application layer (hoặc Domain): ChecklistValidator trong Domain sẽ kiểm tra danh sách InspectionDetail phải có đủ số mục (hiện tại là 20) và mỗi mục phải có trạng thái không được null. Nếu không đủ, Domain sẽ ném ra ngoại lệ (hoặc trả về kết quả thất bại theo Result Pattern). Minimal API controller sẽ bắt lỗi và trả về HTTP 400 Bad Request với thông báo rõ ràng.

Không nên để kiểm tra ở controller vì như vậy logic nghiệp vụ bị phân tán.

4.3. Tại sao lưu Checklist dạng JSON tốt hơn 20 cột Boolean?
Như đã phân tích ở trên, linh hoạt khi thay đổi số lượng hạng mục, tránh alter table. Ngoài ra, JSON cho phép lưu kèm ghi chú, ảnh lỗi cho từng mục một cách tự nhiên.

4.4. Làm thế nào để EF Core tự động tạo Database khi ứng dụng khởi động lần đầu?
Sử dụng DbContext.Database.Migrate() trong lúc khởi động (có thể làm ở Infrastructure). Điều này đảm bảo tất cả các migration được áp dụng, tạo database nếu chưa có.

Đối với môi trường phát triển, có thể thêm dữ liệu mẫu (seed) cho danh mục.

4.5. Tại sao không để thuộc tính Vehicle phụ thuộc vào bảng Database?
Domain Entity phải là POCO, không kế thừa từ Entity của EF Core (nếu muốn triệt để). Ta có thể dùng “Separated Interface” hoặc EF Core Fluent API để ánh xạ mà không làm ô nhiễm Domain. Các thuộc tính như Status, Odometer chỉ thay đổi qua phương thức, không setter public. Điều này giúp khi đổi sang database khác, Domain không bị ảnh hưởng.

4.6. Làm thế nào để mở rộng thêm hạng mục thứ 21 mà không hỏng dữ liệu cũ?
Nhờ dùng JSON column và Domain entity linh hoạt: chỉ cần thêm hạng mục mới vào danh sách cấu hình (có thể là enum, hoặc bảng ChecklistItemTemplate), cập nhật Domain Service để chấp nhận 21 mục. Các bản ghi cũ vẫn giữ nguyên 20 mục trong JSON. Ngược lại, nếu dùng 20 cột, ta phải thêm cột mới (có thể gây khó khăn cho dữ liệu cũ). JSON columns cho phép dữ liệu không đồng nhất về số mục một cách tự nhiên.

5. Điều chỉnh nhỏ cho phù hợp với đặc tả của chúng ta
Trong đặc tả, checklist có 20 hạng mục chia thành 5 nhóm (Ngoại quan, Lốp, Đèn, Động cơ/Dầu, Phanh, Nội thất). Khi lưu JSON, chúng ta nên lưu kèm Category để dễ báo cáo.

Việc đánh giá critical failure: Domain Service cần biết hạng mục nào là critical. Có thể định nghĩa một enum ChecklistItemType kèm cờ IsCritical, hoặc ánh xạ từ ItemNumber (ví dụ: số 16,17,18 về Phanh là critical). Điều này nên nằm trong Domain.

Bảo mật: Minimal API cần xác thực JWT; các endpoint checklist chỉ cho phép vai trò Lái xe. DTO không được để lộ các trường nhạy cảm như Vehicle.LockedBy.

6. Kế hoạch hành động tiếp theo
Với bản thiết kế kỹ thuật này, tôi đề nghị đội Dev tiến hành theo trình tự:

Tạo Solution với 4 Projects: SHLogistics.Domain, SHLogistics.Application, SHLogistics.Infrastructure, SHLogistics.Api (Minimal API). Domain không tham chiếu gì. Application tham chiếu Domain. Infrastructure tham chiếu Application. Api tham chiếu Infrastructure và Application.

Xây dựng Domain trước: Định nghĩa Entities (Vehicle, Driver, Inspection, InspectionDetail value object, MaintenanceHistory... ), Domain Services (ChecklistEvaluator, MaintenanceDueChecker). Viết unit test kiểm tra các quy tắc (ví dụ: ODO mới >= cũ, critical failure lock xe).

Định nghĩa Application Contracts: Interface repository, Command/Queries và Handler. Tạo DTO cho Inspection request/response.

Triển khai Infrastructure: Cài đặt EF Core DbContext, cấu hình Fluent API, lưu ChecklistItem dưới dạng JSON column (sử dụng .HasConversion() hoặc EF Core 8/10 hỗ trợ tốt). Viết Migration và seed dữ liệu.

Xây dựng Minimal API endpoints: Map route, gọi Application Handler, trả về kết quả.

Tích hợp App Mobile (Flutter) và Web Dashboard sau khi API hoàn chỉnh.