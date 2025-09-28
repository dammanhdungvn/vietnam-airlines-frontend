# Hướng dẫn Chức năng Đăng ký hộ

**Tác giả:** Dammand DUNG
**Ngày tạo:** 28/09/2025
**Phiên bản:** 1.0

---

## Giới thiệu

Trang "Đăng ký hộ" là một công cụ dành cho nhân viên hoặc quản trị viên để đăng ký tham gia sự kiện cho một khách hàng đã có trong hệ thống. Quy trình được thiết kế theo từng bước (multi-step form) để đảm bảo thu thập đầy đủ và chính xác thông tin cần thiết.

## Quy trình 4 bước

### Bước 1: Chọn Khách hàng

- **Mô tả:** Bước đầu tiên là tìm kiếm và chọn khách hàng cần đăng ký từ danh sách.
- **Tích hợp API:**
  - Danh sách khách hàng được tải tự động từ API `GET /api/v1/core/persons/paginated`.
  - Hỗ trợ **phân trang** để duyệt qua danh sách lớn một cách hiệu quả.
  - Có ô **tìm kiếm** cho phép lọc nhanh khách hàng theo tên hoặc chức vụ.
- **Cách thực hiện:**
  1. Sử dụng ô tìm kiếm để tìm khách hàng mong muốn.
  2. Duyệt qua các trang nếu cần thiết bằng các nút "Trang trước" / "Trang sau".
  3. Nhấp chuột vào thẻ thông tin của khách hàng để chọn. Khách hàng được chọn sẽ có viền màu cam.
  4. Nhấn nút **"Tiếp tục"** để sang bước tiếp theo.

### Bước 2: Lấy thông tin & Face ID

- **Mô tả:** Xác nhận lại thông tin cá nhân của khách hàng và thu thập ảnh Face ID để phục vụ cho việc check-in tự động tại sự kiện.
- **Tính năng:**
  - Thông tin **Họ và tên**, **Email** của khách hàng được chọn ở Bước 1 sẽ được tự động điền vào các ô tương ứng.
  - Người dùng cần tick vào ô "Tôi đồng ý đăng ký nhận thông tin tự động".
  - Nhấp vào khu vực tải ảnh để chọn hoặc kéo thả ảnh chân dung của khách hàng. Ảnh sẽ được hiển thị preview.
- **Cách thực hiện:**
  1. Kiểm tra lại thông tin cá nhân của khách hàng.
  2. Đồng ý với điều khoản đăng ký.
  3. Tải lên ảnh Face ID rõ nét.
  4. Nhấn **"Tiếp tục"**.

### Bước 3: Chọn Ghế ngồi

- **Mô tả:** Chọn vị trí ghế ngồi cho khách hàng trong khán phòng của hội nghị.
- **Tính năng:**
  - Giao diện hiển thị sơ đồ ghế ngồi trực quan, với các màu sắc phân biệt trạng thái (còn trống, đã có người, ghế VIP, v.v.).
- **Cách thực hiện:**
  1. Nhấp vào một ghế còn trống trên sơ đồ để chọn.
  2. Ghế được chọn sẽ được làm nổi bật.
  3. Nhấn **"Tiếp tục"**.

### Bước 4: Khu trải nghiệm (Đồ ăn, thức uống)

- **Mô tả:** Chọn các gói đồ ăn, thức uống (combo) cho khách hàng.
- **Tính năng:**
  - Hiển thị danh sách các combo có sẵn kèm hình ảnh, mô tả và giá tiền.
- **Cách thực hiện:**
  1. Nhấn vào nút `+` để tăng số lượng cho combo mong muốn.
  2. Nhấp vào một combo để xem chi tiết và chọn số lượng trong hộp thoại (modal).
  3. Sau khi chọn xong, nhấn nút **"Hoàn tất"**. Một thông báo thành công sẽ xuất hiện để xác nhận quy trình đăng ký đã hoàn tất.
