# Hướng dẫn sử dụng chức năng Quản lý Khách mời

Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng các tính năng trong trang Quản lý Khách mời của hệ thống Vietnam Airlines.

## Mục lục

1.  [Truy cập trang Quản lý Khách mời](#1-truy-cập-trang-quản-lý-khách-mời)
2.  [Giao diện chính](#2-giao-diện-chính)
3.  [Các chức năng chính](#3-các-chức-năng-chính)
    *   [3.1. Xem danh sách khách mời](#31-xem-danh-sách-khách-mời)
    *   [3.2. Tìm kiếm và Sắp xếp](#32-tìm-kiếm-và-sắp-xếp)
    *   [3.3. Phân trang](#33-phân-trang)
    *   [3.4. Thêm mới khách mời](#34-thêm-mới-khách-mời)
    *   [3.5. Import khách mời từ file Excel](#35-import-khách-mời-từ-file-excel)
    *   [3.6. Xem chi tiết khách mời](#36-xem-chi-tiết-khách-mời)
    *   [3.7. Chỉnh sửa thông tin khách mời](#37-chỉnh-sửa-thông-tin-khách-mời)
    *   [3.8. Xóa khách mời](#38-xóa-khách-mời)
    *   [3.9. Luồng xử lý ảnh đại diện](#39-luồng-xử-lý-ảnh-đại-diện)

---

### 1. Truy cập trang Quản lý Khách mời

Để truy cập trang, từ thanh điều hướng bên trái (sidebar), chọn mục **"Quản lý khách mời"**.

-   URL: `http://localhost:3000/quan-ly-khach-moi`

### 2. Giao diện chính

Giao diện chính bao gồm:
-   **Thanh chức năng:** Chứa các nút "Import" và "Thêm mới".
-   **Bộ lọc và tìm kiếm:** Cho phép tìm kiếm theo tên, email, chức vụ và sắp xếp danh sách.
-   **Bảng danh sách khách mời:** Hiển thị các thông tin cơ bản của khách mời.
-   **Thanh phân trang:** Dùng để điều hướng qua các trang của danh sách.

### 3. Các chức năng chính

#### 3.1. Xem danh sách khách mời

Khi truy cập, trang sẽ tự động tải và hiển thị danh sách khách mời đã đăng ký trong hệ thống.
Thông tin hiển thị trong bảng bao gồm:
-   **Tên khách mời** và **Email**
-   **Số điện thoại**
-   **Chức vụ**
-   **Giới tính**
-   **Trạng thái** (`Hoạt động` hoặc `Không hoạt động`)
-   **VIP:** Biểu tượng ngôi sao nếu là khách VIP.
-   **Thao tác:** Các nút để Chỉnh sửa hoặc Xóa.

#### 3.2. Tìm kiếm và Sắp xếp

-   **Tìm kiếm:** Nhập từ khóa (tên, email, hoặc chức vụ) vào ô tìm kiếm ở góc trên bên phải của bảng để lọc danh sách khách mời một cách nhanh chóng.
-   **Sắp xếp:** Sử dụng menu dropdown bên cạnh ô tìm kiếm để sắp xếp danh sách theo các tiêu chí như ID, Tên, Email theo thứ tự tăng dần hoặc giảm dần.

#### 3.3. Phân trang

Sử dụng các nút **"Previous"** và **"Next"** ở cuối bảng để di chuyển giữa các trang. Thông tin về trang hiện tại và tổng số trang cũng được hiển thị ở giữa.

#### 3.4. Thêm mới khách mời

1.  Nhấn nút **"Thêm mới"** ở góc trên bên phải.
2.  Một modal form sẽ hiện ra để nhập thông tin khách mời mới.
3.  Điền đầy đủ thông tin bắt buộc:
    -   **Email** (bắt buộc)
    -   **Họ và tên** (bắt buộc)
    -   **Số điện thoại**
    -   **Chức vụ**
    -   **Giới tính** (Nam/Nữ/Khác)
    -   **Trạng thái** (Hoạt động/Không hoạt động)
    -   **Loại khách** (Siêu VIP/VIP/Thường)
    -   **Ảnh đại diện** (tùy chọn)
4.  **Upload ảnh đại diện** (nếu có):
    -   Nhấn nút **"Chọn ảnh"** để chọn file ảnh từ máy tính
    -   Hệ thống sẽ hiển thị preview ảnh đã chọn
    -   Ảnh sẽ được upload tự động sau khi tạo khách mời thành công
5.  Nhấn **"Thêm khách mời"** để hoàn tất.
    -   Hệ thống sẽ tạo khách mời trước, sau đó tự động upload ảnh đại diện (nếu có)
    -   Thông báo thành công sẽ hiện ra khi hoàn tất

#### 3.5. Import khách mời từ file Excel

Chức năng này cho phép thêm hàng loạt khách mời vào hệ thống từ một file Excel.

1.  Nhấn nút **"Import"**.
2.  Một cửa sổ chọn file sẽ hiện ra.
3.  Chọn file Excel (`.xlsx` hoặc `.xls`) chứa danh sách khách mời cần import.
    -   *Lưu ý: File cần tuân thủ theo định dạng mẫu của hệ thống.*
4.  Hệ thống sẽ tự động xử lý file và thêm khách mời vào danh sách.
5.  Một thông báo sẽ xuất hiện để xác nhận việc import thành công hoặc báo lỗi nếu có.

#### 3.6. Xem chi tiết khách mời

Để xem thông tin đầy đủ của một khách mời, nhấn vào tên của họ trong bảng danh sách.
-   Trang chi tiết sẽ hiển thị tất cả thông tin cá nhân, thông tin vé, các sản phẩm đã mua và lịch sử hệ thống (ngày tạo, ngày cập nhật).

#### 3.7. Chỉnh sửa thông tin khách mời

1.  Từ **trang danh sách**, nhấn vào biểu tượng cây bút (`Edit`) ở cột "Thao tác" của khách mời bạn muốn sửa.
2.  Hoặc từ **trang chi tiết**, nhấn nút **"Chỉnh sửa"**.
3.  Giao diện sẽ chuyển sang chế độ chỉnh sửa, các trường thông tin sẽ trở thành các ô nhập liệu.
4.  **Thay đổi ảnh đại diện** (nếu cần):
    -   Nhấn vào biểu tượng cây bút nhỏ trên ảnh đại diện
    -   Chọn file ảnh mới từ máy tính
    -   Hệ thống sẽ hiển thị thông báo về ảnh đã chọn
    -   Ảnh sẽ được upload trước khi cập nhật thông tin khách mời
5.  Thay đổi thông tin cần thiết khác.
6.  Nhấn nút **"Lưu"** để xác nhận thay đổi hoặc **"Hủy"** để quay lại chế độ xem.
    -   Hệ thống sẽ upload ảnh trước (nếu có), sau đó cập nhật thông tin khách mời
    -   Thông báo thành công sẽ hiện ra khi hoàn tất

#### 3.8. Xóa khách mời

1.  Từ **trang danh sách**, nhấn vào biểu tượng thùng rác (`Delete`) ở cột "Thao tác" của khách mời bạn muốn xóa.
2.  Hoặc từ **trang chi tiết**, nhấn nút **"Xóa"**.
3.  Một hộp thoại xác nhận sẽ hiện ra.
4.  Nhấn **"Xóa"** để xác nhận vĩnh viễn xóa khách mời khỏi hệ thống, hoặc **"Hủy"** để đóng hộp thoại.
    -   **Cảnh báo:** Thao tác này không thể hoàn tác.

#### 3.9. Luồng xử lý ảnh đại diện

Hệ thống có hai luồng xử lý ảnh đại diện khác nhau tùy thuộc vào chức năng:

**A. Khi thêm mới khách mời:**
1.  Người dùng chọn ảnh trong form thêm mới
2.  Hệ thống tạo khách mời trước (với `personId = null`)
3.  API trả về `personId` mới được tạo
4.  Hệ thống tự động upload ảnh sử dụng `personId` vừa tạo
5.  Hiển thị thông báo thành công

**B. Khi chỉnh sửa khách mời:**
1.  Người dùng chọn ảnh mới trong chế độ chỉnh sửa
2.  Hệ thống upload ảnh trước (sử dụng `personId` hiện có)
3.  Sau khi upload thành công, hệ thống cập nhật thông tin khách mời
4.  Hiển thị thông báo thành công

**Lưu ý:**
-   Ảnh được upload qua API `valid-upload-face` với tham số `acsDevIndexCode=90`
-   Nếu upload ảnh thất bại nhưng tạo/cập nhật khách mời thành công, hệ thống sẽ hiển thị cảnh báo
-   Người dùng có thể cập nhật ảnh sau bằng chức năng chỉnh sửa
