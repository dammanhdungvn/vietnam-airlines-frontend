# Hướng dẫn Quản lý Link Trực tuyến

**Tác giả:** Dammand DUNG
**Ngày tạo:** 27/09/2025
**Phiên bản:** 1.0

---

## Giới thiệu

Trang "Quản lý Link Trực tuyến" cho phép quản trị viên quản lý danh sách các đường link (URL) stream. Chức năng này rất hữu ích để lưu trữ và truy cập nhanh các nguồn video, sự kiện trực tuyến, hoặc bất kỳ tài nguyên nào có thể truy cập qua URL.

Giao diện được thiết kế trực quan, dễ sử dụng, giúp quản trị viên thực hiện các thao tác một cách hiệu quả.

## Các chức năng chính

Trang quản lý cung cấp đầy đủ các chức năng CRUD (Create, Read, Update, Delete) cho các link stream.

### 1. Xem danh sách Link

- **Mô tả:** Khi truy cập trang, hệ thống sẽ tự động tải và hiển thị danh sách tất cả các link stream hiện có.
- **Cách thực hiện:**
  - Truy cập vào mục "Quản lý link trực tuyến" từ thanh điều hướng bên trái.
  - Danh sách các link sẽ được hiển thị trong một bảng, bao gồm các cột: Tên link, URL, và Thao tác.
  - URL có thể nhấp vào để mở trong một tab mới.

### 2. Thêm Link mới

- **Mô tả:** Cho phép tạo một link stream mới.
- **Cách thực hiện:**
  1. Nhấn vào nút **"Thêm link mới"** ở góc trên bên phải màn hình.
  2. Một hộp thoại (modal) sẽ xuất hiện.
  3. Nhập **Tên link** và **URL** vào các trường tương ứng.
  4. Nhấn nút **"Tạo mới"** để lưu link. Link mới sẽ xuất hiện trong danh sách.
  5. Nhấn **"Hủy"** để đóng hộp thoại mà không lưu.

### 3. Sửa thông tin Link

- **Mô tả:** Cho phép chỉnh sửa thông tin của một link đã tồn tại.
- **Cách thực hiện:**
  1. Trong danh sách, tìm link bạn muốn sửa và nhấn vào biểu tượng **cây bút (Edit)** ở cột "Thao tác".
  2. Hộp thoại sẽ xuất hiện với thông tin hiện tại của link.
  3. Chỉnh sửa **Tên link** hoặc **URL** theo ý muốn.
  4. Nhấn **"Lưu thay đổi"** để cập nhật.
  5. Nhấn **"Hủy"** để thoát mà không lưu.

### 4. Xóa Link

- **Mô tả:** Cho phép xóa một link khỏi hệ thống.
- **Cách thực hiện:**
  1. Tìm link bạn muốn xóa và nhấn vào biểu tượng **thùng rác (Delete)** ở cột "Thao tác".
  2. Một hộp thoại xác nhận sẽ hiện ra để đảm bảo bạn không xóa nhầm.
  3. Nhấn nút **"Xóa"** để xác nhận. Link sẽ bị xóa vĩnh viễn khỏi danh sách.
  4. Nhấn **"Hủy"** nếu bạn không muốn xóa nữa.

### 5. Tìm kiếm và Sắp xếp

- **Tìm kiếm:**
  - Sử dụng ô tìm kiếm ở phía trên bên phải của bảng.
  - Bạn có thể nhập từ khóa để tìm kiếm theo **Tên link** hoặc **URL**. Danh sách sẽ tự động được lọc lại.
- **Sắp xếp:**
  - Sử dụng hộp chọn (dropdown) bên cạnh ô tìm kiếm.
  - Bạn có thể sắp xếp danh sách theo **Tên link** hoặc **URL** theo thứ tự alphabet.

## Tích hợp API

Chức năng này được tích hợp với các API endpoint sau:

- `GET /api/v1/streams`: Lấy danh sách link.
- `POST /api/v1/streams`: Tạo mới hoặc cập nhật link.
- `GET /api/v1/streams/{id}`: Lấy chi tiết một link.
- `DELETE /api/v1/streams/{id}`: Xóa một link.

