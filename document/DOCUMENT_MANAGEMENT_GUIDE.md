# Hướng dẫn Chức năng Quản lý Tài liệu

Tài liệu này cung cấp hướng dẫn chi tiết về chức năng Quản lý Tài liệu trên trang quản trị của Vietnam Airlines.

## 1. Tổng quan

Chức năng này cho phép quản trị viên thực hiện các thao tác đầy đủ (CRUD - Create, Read, Update, Delete) đối với các tài liệu nội bộ, bao gồm việc tải lên các file đính kèm.

## 2. Giao diện chính

Trang Quản lý Tài liệu có địa chỉ: `/quan-ly-tai-lieu`

Giao diện bao gồm các thành phần chính:

-   **Thanh tiêu đề và nút hành động**:
    -   `Thêm tài liệu`: Mở hộp thoại (dialog) để tải lên một tài liệu mới.
-   **Thanh tìm kiếm**:
    -   Cho phép tìm kiếm nhanh chóng theo **Tên tài liệu** hoặc **Tác giả**. Danh sách sẽ tự động được lọc lại khi người dùng nhập.
-   **Bảng danh sách tài liệu**:
    -   Hiển thị các tài liệu hiện có với các thông tin: Tên tài liệu, Tác giả, Ngày tạo, Ngày sửa.
    -   Mỗi hàng trong bảng đi kèm với một bộ các nút thao tác:
        -   **Xóa (Trash Can)**: Xóa tài liệu khỏi hệ thống (có hộp thoại xác nhận).
        -   **Sửa (Pencil)**: Mở hộp thoại để cập nhật thông tin hoặc thay thế file đính kèm của tài liệu.
        -   **Xem chi tiết (Eye)**: Mở file tài liệu trong một tab mới của trình duyệt để xem trước.
        -   **Tải xuống (Download)**: Bắt đầu quá trình tải file tài liệu về máy.

## 3. Luồng hoạt động chi tiết

### 3.1. Xem danh sách và Tìm kiếm

-   Khi truy cập trang, hệ thống sẽ tự động gọi API để lấy và hiển thị toàn bộ danh sách tài liệu.
-   Trong khi tải, một chỉ báo "Đang tải dữ liệu..." sẽ xuất hiện.
-   Người dùng có thể nhập vào ô tìm kiếm để lọc danh sách một cách nhanh chóng.

### 3.2. Thêm mới Tài liệu

1.  Nhấn nút **"Thêm tài liệu"**.
2.  Hộp thoại "Thêm tài liệu mới" sẽ xuất hiện.
3.  Điền các thông tin bắt buộc: **Tên tài liệu**, **Tên tác giả**.
4.  Nhấn vào khu vực tải lên để **chọn file** từ máy tính (bắt buộc).
5.  Nhấn nút **"Thêm tài liệu"** để xác nhận.
6.  Hệ thống sẽ gửi yêu cầu API, nếu thành công, danh sách sẽ được làm mới và một thông báo thành công sẽ hiển thị.

### 3.3. Chỉnh sửa Tài liệu

1.  Nhấn vào biểu tượng **Sửa (cây bút)** ở hàng của tài liệu cần cập nhật.
2.  Hộp thoại "Sửa tài liệu" hiện ra với thông tin cũ đã được điền sẵn.
3.  Thay đổi Tên tài liệu hoặc Tác giả nếu cần.
4.  Nếu muốn thay thế file đính kèm, người dùng có thể chọn một file mới. Nếu không, file cũ sẽ được giữ lại.
5.  Nhấn nút **"Cập nhật"** để lưu thay đổi.

### 3.4. Xóa Tài liệu

1.  Nhấn vào biểu tượng **Xóa (thùng rác)**.
2.  Một hộp thoại xác nhận sẽ hiện ra để đảm bảo người dùng không xóa nhầm.
3.  Nhấn **"Xóa"** để xác nhận. Tài liệu sẽ bị xóa vĩnh viễn và danh sách được cập nhật.

### 3.5. Xem và Tải xuống

-   Nhấn vào biểu tượng **Xem (mắt)** sẽ mở trực tiếp `fileUrl` của tài liệu trong một tab mới, cho phép xem trước nhanh chóng.
-   Nhấn vào biểu tượng **Tải xuống (download)** sẽ kích hoạt việc tải file về máy tính của người dùng thông qua endpoint download của API.

## 4. Tích hợp API

### 4.1. Lấy danh sách tài liệu

-   **Endpoint**: `GET /api/v1/documents/all`
-   **Phương thức**: `GET`

### 4.2. Tạo mới / Cập nhật tài liệu

-   **Endpoint**: `POST /api/v1/documents`
-   **Phương thức**: `POST`
-   **Body**: `multipart/form-data`
    -   `document`: Một chuỗi JSON chứa `{ "documentName": "string", "author": "string", "id": number (chỉ khi cập nhật) }`.
    -   `file`: File được tải lên.

### 4.3. Xóa tài liệu

-   **Endpoint**: `DELETE /api/v1/documents/{id}`
-   **Phương thức**: `DELETE`
-   **Path Variable**: `id` - ID của tài liệu cần xóa.

### 4.4. Tải xuống tài liệu

-   **Endpoint**: `GET /api/v1/documents/{id}/download`
-   **Phương thức**: `GET`
-   **Path Variable**: `id` - ID của tài liệu cần tải.
