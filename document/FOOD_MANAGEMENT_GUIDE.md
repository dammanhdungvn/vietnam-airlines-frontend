# Hướng dẫn Chức năng Quản lý Đồ ăn

Tài liệu này cung cấp hướng dẫn chi tiết về chức năng Quản lý Đồ ăn trên trang quản trị của Vietnam Airlines.

## 1. Tổng quan

Chức năng này cho phép quản trị viên xem, tìm kiếm, và sắp xếp danh sách các sản phẩm (đồ ăn, thức uống, hàng hóa khác) được cung cấp trên các chuyến bay. Dữ liệu được lấy trực tiếp từ hệ thống backend thông qua API.

## 2. Giao diện chính

Trang Quản lý Đồ ăn có địa chỉ: `/quan-ly-do-an`

Giao diện chính bao gồm các thành phần sau:

-   **Thanh tiêu đề**: Hiển thị tên chức năng "Quản lý đồ ăn".
-   **Các nút hành động**:
    -   `Export`: (Chức năng chưa được cài đặt) Dùng để xuất danh sách sản phẩm ra file.
    -   `Thêm mới`: (Chức năng chưa được cài đặt) Dùng để thêm một sản phẩm mới vào hệ thống.
-   **Khu vực tìm kiếm và sắp xếp**:
    -   **Ô tìm kiếm**: Cho phép tìm kiếm sản phẩm theo tên (`itemName`). Hệ thống sẽ tự động gửi yêu cầu tìm kiếm khi người dùng nhập chữ.
    -   **Dropdown Sắp xếp**: Cho phép sắp xếp danh sách sản phẩm theo:
        -   `Tên món` (mặc định)
        -   `Giá`
        -   `Ngày tạo`
    -   **Dropdown Thứ tự**: Cho phép chọn thứ tự sắp xếp là `Tăng dần` (asc) hoặc `Giảm dần` (desc).
-   **Bảng danh sách sản phẩm**:
    -   Hiển thị danh sách các sản phẩm với các cột:
        -   `Tên món`: Tên của sản phẩm.
        -   `Giá`: Giá bán, được định dạng theo tiền tệ Việt Nam (VND).
        -   `Chi tiết`: Mô tả chi tiết về sản phẩm.
        -   `Ngày tạo`: Ngày sản phẩm được thêm vào hệ thống.
        -   `Ngày sửa`: Ngày thông tin sản phẩm được cập nhật lần cuối.
        -   `Thao tác`: Chứa các nút để `Xóa` và `Sửa` thông tin sản phẩm (chức năng hiện tại chỉ là giao diện, chưa kết nối API).
-   **Phân trang**:
    -   Các nút `Previous` và `Next` để chuyển trang.
    -   Danh sách các trang để điều hướng nhanh.

## 3. Các chức năng

### 3.1. Xem và Tìm kiếm Sản phẩm

1.  Khi người dùng truy cập trang, một yêu cầu API (GET `/api/v1/items`) sẽ được tự động gửi đi để lấy trang đầu tiên của danh sách sản phẩm.
2.  Trong khi tải dữ liệu, một thông báo "Đang tải dữ liệu..." sẽ được hiển thị.
3.  Nếu có lỗi xảy ra khi tải dữ liệu, một thông báo lỗi sẽ xuất hiện.
4.  Nếu không có sản phẩm nào, bảng sẽ hiển thị thông báo "Không tìm thấy sản phẩm nào."
5.  Người dùng có thể sử dụng ô tìm kiếm hoặc các dropdown sắp xếp để lọc và xem dữ liệu theo ý muốn. Mỗi thay đổi sẽ kích hoạt một yêu cầu API mới để cập nhật danh sách.
6.  Người dùng có thể điều hướng qua các trang của danh sách bằng cách sử dụng các nút phân trang.

### 3.2. Thêm mới Sản phẩm

1.  Nhấn nút **"Thêm mới"**.
2.  Một hộp thoại (dialog) sẽ xuất hiện yêu cầu nhập thông tin: Tên món, Giá (VND), và Chi tiết.
3.  Sau khi điền đủ thông tin, nhấn nút **"Tạo mới"**.
4.  Một yêu cầu `POST /api/v1/items` sẽ được gửi đi.
5.  Nếu thành công, hộp thoại sẽ đóng lại, một thông báo thành công xuất hiện và danh sách sản phẩm sẽ được tự động làm mới.

### 3.3. Chỉnh sửa Sản phẩm

1.  Trong bảng danh sách, nhấn vào biểu tượng **cây bút (Edit)** ở hàng của sản phẩm muốn sửa.
2.  Hộp thoại sẽ xuất hiện với các thông tin hiện tại của sản phẩm.
3.  Chỉnh sửa thông tin cần thiết và nhấn **"Lưu thay đổi"**.
4.  Một yêu cầu `POST /api/v1/items` (với `id` của sản phẩm trong body) sẽ được gửi đi.
5.  Nếu thành công, hộp thoại sẽ đóng, một thông báo thành công xuất hiện và danh sách sẽ được làm mới.

### 3.4. Xóa Sản phẩm

1.  Nhấn vào biểu tượng **thùng rác (Delete)** ở hàng của sản phẩm muốn xóa.
2.  Một hộp thoại xác nhận sẽ xuất hiện để hỏi lại.
3.  Nhấn nút **"Xóa"** để xác nhận.
4.  Một yêu cầu `DELETE /api/v1/items/{id}` sẽ được gửi đi.
5.  Nếu thành công, một thông báo thành công sẽ hiện ra và danh sách sản phẩm được làm mới.

## 4. Tích hợp API

### 4.1. Lấy danh sách sản phẩm

-   **Endpoint**: `GET /api/v1/items`
-   **Các tham số (Query Params)**:
    -   `page`: Số thứ tự trang (bắt đầu từ 0).
    -   `size`: Số lượng sản phẩm trên mỗi trang.
    -   `sortBy`: Tiêu chí sắp xếp (`itemName`, `price`, `createdAt`).
    -   `sortDir`: Thứ tự sắp xếp (`asc`, `desc`).
    -   `itemName`: Từ khóa tìm kiếm theo tên sản phẩm.
-   **Phản hồi (Response)**:
    -   Dữ liệu trả về có cấu trúc với thông tin phân trang và một mảng các sản phẩm trong trường `content`.

### 4.2. Thêm mới / Cập nhật sản phẩm

-   **Endpoint**: `POST /api/v1/items`
-   **Request Body**:
    ```json
    {
      "id": 0, // 0 hoặc bỏ qua cho việc tạo mới, id của sản phẩm cho việc cập nhật
      "itemName": "string",
      "price": 0,
      "description": "string"
    }
    ```

### 4.3. Xóa sản phẩm

-   **Endpoint**: `DELETE /api/v1/items/{id}`
-   **Path Variable**:
    -   `id`: ID của sản phẩm cần xóa.
