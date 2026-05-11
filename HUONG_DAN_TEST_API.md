# 📖 HƯỚNG DẪN KIỂM TRA (TEST) API - QUẢN LÝ CÔNG VIỆC

Tài liệu này hướng dẫn cách sử dụng các công cụ bên thứ ba (Postman, Insomnia) để kiểm tra các API của hệ thống.

---

## 1. Truy cập Tài liệu API tích hợp
Hệ thống sử dụng **Swagger** và **Scalar** để cung cấp giao diện thử nghiệm trực tiếp.
*   **Địa chỉ (Local):** `http://localhost:5000/swagger` hoặc `http://localhost:5000/scalar`
*   Tại đây, bạn có thể xem cấu trúc Request/Response và thử nhấn nút **"Try it out"**.

---

## 2. Quy trình Kiểm tra trên Postman / Insomnia

### Bước 1: Đăng nhập để lấy Token (JWT)
Hầu hết các API của hệ thống đều yêu cầu xác thực. Bạn cần lấy Token trước.
*   **Method:** `POST`
*   **URL:** `{{base_url}}/api/auth/login`
*   **Body (JSON):**
    ```json
    {
      "email": "admin@test.com",
      "password": "AdminPassword123"
    }
    ```
*   **Kết quả:** Bạn sẽ nhận được `accessToken`. Hãy copy chuỗi này.

### Bước 2: Thiết lập Header xác thực
Trong Postman, chuyển sang tab **Authorization**:
*   **Type:** `Bearer Token`
*   **Token:** Dán chuỗi `accessToken` vừa copy vào đây.
*   *(Hoặc thêm thủ công vào tab Headers: `Authorization` : `Bearer <your_token>`)*

---

## 3. Kiểm tra các API chính

### A. Phân công công việc (Assign Task)
*   **Method:** `PUT`
*   **URL:** `{{base_url}}/api/tasks/1/assign`
*   **Body (JSON):**
    ```json
    {
      "idCongViec": 1,
      "idNguoiDung": 2,
      "idQuanLy": 1
    }
    ```

### B. Lấy danh sách công việc (Phân trang & Cache)
*   **Method:** `GET`
*   **URL:** `{{base_url}}/api/tasks?soTrang=1&kichThuoc=10`
*   **Lưu ý:** Lần gọi đầu tiên sẽ lấy từ DB, các lần gọi tiếp theo (trong vòng 30 giây) sẽ trả về dữ liệu cực nhanh từ Redis Cache.

### C. Lấy link liên kết Telegram
*   **Method:** `GET`
*   **URL:** `{{base_url}}/api/users/telegram-link`
*   **Kết quả:** Trả về một link `https://t.me/...`. Bạn có thể dùng trình duyệt để mở link này nhằm giả lập thao tác của người dùng.

---

## 4. Kiểm tra Real-time (SignalR)
Để kiểm tra xem Dashboard có tự động cập nhật hay không:
1.  Sử dụng công cụ **SignalR Tester** hoặc Extension trên Chrome.
2.  Kết nối tới: `ws://localhost:5000/hubs/dashboard`
3.  Khi bạn thực hiện thay đổi trạng thái công việc qua Postman, bạn sẽ thấy một thông điệp `DashboardUpdated` được đẩy về công cụ tester này.

---

## 5. Kiểm tra Bảo mật (Brute-force)
1.  Gọi API Đăng nhập với mật khẩu sai 5 lần liên tiếp.
2.  Ở lần thứ 6, hệ thống sẽ trả về mã lỗi `423 Locked`, kể cả khi bạn nhập đúng mật khẩu.
3.  Đợi 15 phút để Redis tự động xóa khóa hoặc xóa thủ công trong Cache.

---

## 6. Xuất báo cáo Excel
*   **Method:** `GET`
*   **URL:** `{{base_url}}/api/tasks/export`
*   **Trên Postman:** Chọn **"Send and Download"** để nhận file `.xlsx` về máy.
