# Hướng dẫn Quản lý Ghế

## Tổng quan

Chức năng quản lý ghế cho phép người dùng xem, tìm kiếm, lọc và quản lý thông tin các ghế trong hệ thống. Trang quản lý ghế được truy cập tại `/quan-ly-ghe`.

## Tính năng chính

### 1. Hiển thị sơ đồ ghế
- **Mô tả**: Hiển thị sơ đồ trực quan của các ghế với các loại khác nhau
- **Các loại ghế**:
  - **VIP**: Ghế hạng thương gia (màu vàng với icon sao)
  - **NORMAL**: Ghế hạng phổ thông (màu xanh teal)
  - **FREE**: Ghế miễn phí (màu xanh lá)
  - **BLOCK**: Ghế bị khóa (màu xám, không thể chọn)
- **Trạng thái ghế**:
  - **AVAILABLE**: Ghế trống (có thể chọn)
  - **TAKEN**: Ghế đã có người ngồi (màu xám với icon X)

### 2. Danh sách ghế chi tiết
- **Bảng thông tin**: Hiển thị thông tin chi tiết của từng ghế
- **Các cột thông tin**:
  - ID ghế
  - Số ghế
  - Loại ghế (với badge màu sắc)
  - Giá gốc (hiển thị "Miễn phí" nếu không có giá)
  - Trạng thái (với badge màu sắc)
  - Thao tác (Xem, Sửa, Xóa)

### 3. Tìm kiếm và lọc
- **Tìm kiếm**: Tìm kiếm ghế theo số ghế hoặc loại ghế
- **Bộ lọc**: Lọc ghế theo:
  - Loại ghế (VIP, Thường, Free, Bị khóa)
  - Ghế có giá
- **Sắp xếp**: Sắp xếp theo:
  - Tên số ghế
  - Loại ghế
  - Giá
  - Trạng thái

### 4. Phân trang
- Hiển thị 10 ghế mỗi trang
- Điều hướng trang với nút "Trước" và "Sau"
- Hiển thị số trang hiện tại và tổng số trang

### 5. Thao tác ghế
- **Xem chi tiết**: Chuyển đến trang chi tiết ghế
- **Sửa thông tin**: Mở dialog để chỉnh sửa thông tin ghế
- **Xóa ghế**: Xóa ghế khỏi hệ thống (có xác nhận)

## Cấu trúc dữ liệu

### Interface ISeat
```typescript
interface ISeat {
  id: number;                    // ID duy nhất của ghế
  seatNumber: string;            // Số hiệu ghế (ví dụ: "A1", "B12")
  type: SeatType;               // Loại ghế (VIP, NORMAL, BLOCK, FREE)
  basePrice: number | null;     // Giá gốc của ghế (null nếu miễn phí)
  status: SeatStatus;           // Trạng thái ghế (AVAILABLE, TAKEN)
}
```

### Enums
```typescript
enum SeatStatus {
  AVAILABLE = 'AVAILABLE',      // Ghế trống
  TAKEN = 'TAKEN'              // Ghế đã có người ngồi
}

enum SeatType {
  VIP = 'VIP',                 // Ghế hạng thương gia
  NORMAL = 'NORMAL',           // Ghế hạng phổ thông
  BLOCK = 'BLOCK',             // Ghế bị khóa
  FREE = 'FREE'                // Ghế miễn phí
}
```

## API Integration

### Endpoint
- **URL**: `GET /api/v1/seats`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
```json
{
  "code": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "seatNumber": "A1",
      "type": "VIP",
      "basePrice": null,
      "status": "AVAILABLE"
    }
  ]
}
```

## Cách sử dụng

### 1. Truy cập trang quản lý ghế
- Đăng nhập vào hệ thống
- Chọn "Quản lý Ghế" từ menu sidebar
- Hoặc truy cập trực tiếp: `http://localhost:3000/quan-ly-ghe`

### 2. Xem sơ đồ ghế
- Sơ đồ ghế được hiển thị ở phần đầu trang
- Các ghế được sắp xếp theo hàng (A, B, C, ...)
- Click vào ghế để xem thông tin chi tiết

### 3. Tìm kiếm ghế
- Nhập từ khóa vào ô "Tìm kiếm ghế..."
- Hệ thống sẽ lọc theo số ghế hoặc loại ghế
- Kết quả được cập nhật ngay lập tức

### 4. Lọc ghế
- Click vào nút "Bộ lọc"
- Chọn các tiêu chí lọc mong muốn
- Kết quả sẽ được lọc theo các tiêu chí đã chọn

### 5. Sắp xếp ghế
- Chọn tiêu chí sắp xếp từ dropdown "Sắp xếp theo"
- Các tùy chọn: Tên số ghế, Loại ghế, Giá, Trạng thái

### 6. Thao tác với ghế
- **Xem chi tiết**: Click nút "Xem" để chuyển đến trang chi tiết
- **Sửa thông tin**: Click icon "Sửa" để mở dialog chỉnh sửa
- **Xóa ghế**: Click icon "Xóa" và xác nhận trong dialog

## Xử lý lỗi

### Lỗi tải dữ liệu
- Hiển thị thông báo lỗi khi không thể tải dữ liệu từ API
- Người dùng có thể thử lại bằng nút "Làm mới"

### Lỗi mạng
- Hiển thị toast notification với thông báo lỗi
- Ghi log lỗi vào console để debug

## Responsive Design

- **Desktop**: Hiển thị đầy đủ sơ đồ ghế và bảng danh sách
- **Tablet**: Sơ đồ ghế được thu nhỏ, bảng có thể cuộn ngang
- **Mobile**: Ưu tiên hiển thị bảng danh sách, sơ đồ ghế được thu nhỏ

## Performance

### Tối ưu hóa
- Sử dụng `useMemo` để tối ưu việc tính toán filtered seats
- Lazy loading cho các component không cần thiết
- Debounce cho tìm kiếm để giảm số lần gọi API

### Caching
- Dữ liệu ghế được cache trong state component
- Refresh dữ liệu khi cần thiết

## Testing

### Unit Tests
- Test service `getAllSeats`
- Test component `SeatMap`
- Test component `QuanLyGhePage`
- Test các chức năng tìm kiếm, lọc, sắp xếp

### Test Coverage
- Coverage cho tất cả các function chính
- Test error handling
- Test user interactions

## Troubleshooting

### Vấn đề thường gặp

1. **Không tải được dữ liệu ghế**
   - Kiểm tra kết nối mạng
   - Kiểm tra token authentication
   - Kiểm tra API endpoint

2. **Sơ đồ ghế không hiển thị đúng**
   - Kiểm tra dữ liệu từ API
   - Kiểm tra component SeatMap

3. **Tìm kiếm không hoạt động**
   - Kiểm tra state searchTerm
   - Kiểm tra logic filtering

### Debug
- Sử dụng React DevTools để kiểm tra state
- Kiểm tra console logs
- Sử dụng Network tab để kiểm tra API calls

## Mở rộng trong tương lai

### Tính năng có thể thêm
- Thêm ghế mới
- Import/Export dữ liệu ghế
- Thống kê ghế theo loại
- Đặt ghế trực tiếp từ sơ đồ
- Lịch sử thay đổi ghế

### Cải tiến UI/UX
- Drag & drop để sắp xếp ghế
- Animation khi chọn ghế
- Dark mode support
- Accessibility improvements
