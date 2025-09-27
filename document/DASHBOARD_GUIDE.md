# Sách Hướng Dẫn Toàn Diện - Chức Năng Dashboard

Tài liệu này giải thích chi tiết về chức năng Dashboard và việc tích hợp API thống kê, từ thiết kế kiến trúc, cách mã nguồn được xây dựng, cho đến cách kiểm tra và gỡ lỗi.

## 1. Tổng Quan Chức Năng

Trang Dashboard (http://localhost:3000/dashboard) là trang chính của hệ thống, hiển thị thống kê tổng quan về:

- **Thống kê khách hàng**: Tổng số khách trong hệ thống, số khách đã đăng ký, số khách đã đặt ghế
- **Thống kê doanh thu**: Doanh thu từ bán ghế, bán đồ ăn và tổng doanh thu
- **Biểu đồ thống kê**: Hiển thị dữ liệu doanh thu theo thời gian
- **Thao tác nhanh**: Các link điều hướng đến các trang quản lý khác

## 2. Luồng Hoạt Động (Workflow)

### 2.1. Tải Dữ Liệu Ban Đầu
1. Khi người dùng truy cập dashboard, component `DashboardPage` được mount
2. `useEffect` được trigger và gọi hàm `fetchStatistics()`
3. Trạng thái `isLoading` được set thành `true`, hiển thị skeleton loading
4. API `GET /statistics` được gọi thông qua `getStatistics()` service

### 2.2. Xử Lý Phản Hồi API
**Trường hợp thành công (code: 200):**
- Dữ liệu được lưu vào state `statisticsData`
- Các thẻ thống kê được cập nhật với số liệu thực từ API
- Trạng thái loading được tắt

**Trường hợp thất bại:**
- Hiển thị thông báo lỗi qua `toast`
- Dữ liệu vẫn ở trạng thái `null`, hiển thị UI trống
- Trạng thái loading được tắt

### 2.3. Hiển Thị Dữ Liệu
- Số liệu được format phù hợp (tiền tệ Việt Nam)
- Skeleton loading được thay thế bằng dữ liệu thực
- Biểu đồ và thao tác nhanh luôn hiển thị

## 3. Cấu Trúc Mã Nguồn

### 3.1. Các File Chính

```
app/dashboard/page.tsx          # Component chính
services/statistics.service.ts  # Service gọi API
types/statistics.type.ts        # Định nghĩa TypeScript interfaces
__tests__/app/dashboard/        # Unit tests
__tests__/services/statistics.  # Unit tests cho service
```

### 3.2. Kiến Trúc Phân Tầng

**Presentation Layer (UI):**
- `DashboardPage` component: Hiển thị giao diện và quản lý state
- Sử dụng shadcn/ui components (`Card`, `CardContent`, etc.)
- Responsive design với Tailwind CSS

**Business Logic Layer:**
- `fetchStatistics()`: Logic xử lý việc gọi API và cập nhật state
- `formatCurrency()`: Helper function format tiền tệ
- Error handling và loading state management

**Data Access Layer:**
- `statistics.service.ts`: Service gọi API, sử dụng axios instance từ `lib/api.ts`
- Tự động đính kèm `Authorization` header nếu user đã đăng nhập

**Type Safety:**
- `statistics.type.ts`: Định nghĩa chặt chẽ cấu trúc dữ liệu API
- TypeScript interfaces đảm bảo type safety

## 4. API Integration

### 4.1. Endpoint
```
GET /statistics
Authorization: Bearer <accessToken>
```

### 4.2. Response Format
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "totalCustomers": 5,
    "registeredCustomers": 4,
    "seatBookedCustomers": 1,
    "revenue": {
      "seatRevenue": 400000,
      "foodRevenue": 600000,
      "totalRevenue": 1000000
    }
  }
}
```

### 4.3. Error Handling
- **401 Unauthorized**: Hiển thị thông báo "Unauthorized"
- **Network Error**: Hiển thị thông báo "Đã có lỗi xảy ra khi tải dữ liệu thống kê"
- **Invalid Response**: Hiển thị message từ API hoặc thông báo mặc định

## 5. State Management

### 5.1. Local State
```typescript
const [statisticsData, setStatisticsData] = useState<IStatisticsData | null>(null)
const [isLoading, setIsLoading] = useState(true)
```

### 5.2. Derived State
- `customerStats`: Array được tính toán từ `statisticsData`
- `revenueStats`: Array được tính toán từ `statisticsData.revenue`

### 5.3. Loading States
- Skeleton loading cho tất cả cards khi `isLoading = true`
- Spinner animation với `Loader2` icon
- Animated placeholders với Tailwind CSS

## 6. Testing Strategy

### 6.1. Unit Tests Coverage
**Service Tests (`statistics.service.test.ts`):**
- Kiểm tra gọi đúng endpoint
- Kiểm tra xử lý response
- Kiểm tra xử lý error

**Component Tests (`dashboard/page.test.tsx`):**
- Kiểm tra loading state
- Kiểm tra hiển thị dữ liệu thành công
- Kiểm tra xử lý lỗi API
- Kiểm tra xử lý lỗi mạng
- Kiểm tra các thao tác nhanh

### 6.2. Mocking Strategy
- Mock `statistics.service` để cô lập logic component
- Mock `useToast` để kiểm tra thông báo
- Mock `StatsChart` để tránh lỗi recharts trong test environment

## 7. Performance Considerations

### 7.1. API Optimization
- Chỉ gọi API một lần khi component mount
- Sử dụng axios interceptor để tự động đính kèm token
- Error boundary để xử lý lỗi gracefully

### 7.2. UI Optimization
- Skeleton loading cho UX tốt hơn
- Conditional rendering để tránh re-render không cần thiết
- Memoization có thể được thêm vào sau nếu cần

### 7.3. Data Formatting
- `formatCurrency()` được gọi trong computed values, không trong render
- TypeScript giúp catch lỗi type checking ở compile time

## 8. Troubleshooting

### 8.1. API Issues
**Lỗi 401 Unauthorized:**
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra `accessToken` trong localStorage
- Kiểm tra expire time của token

**Lỗi Network:**
- Kiểm tra kết nối mạng
- Kiểm tra API server có đang chạy không
- Kiểm tra URL trong file `.env.development`

### 8.2. UI Issues
**Dữ liệu không hiển thị:**
- Mở Developer Tools → Network tab
- Kiểm tra API call có được gửi không
- Kiểm tra response structure có đúng không
- Kiểm tra console có error không

**Loading không kết thúc:**
- Kiểm tra API có response không
- Kiểm tra try/catch có được thực thi đúng không
- Kiểm tra `finally` block được chạy hay không

### 8.3. Test Issues
**ResizeObserver Error:**
- Đã được fix bằng global mock trong `jest.setup.js`
- Nếu vẫn lỗi, kiểm tra jest config

**React act() Warning:**
- Warning này không ảnh hưởng test results
- Có thể ignore hoặc wrap async operations trong `act()`

## 9. Future Enhancements

### 9.1. Potential Features
- Real-time updates với WebSocket
- Data export functionality
- Custom date range filtering
- Dashboard customization

### 9.2. Performance Improvements
- React Query để cache API responses
- Virtual scrolling cho large datasets
- Progressive loading cho charts

### 9.3. UX Enhancements
- Refresh button để manual reload
- Auto-refresh với configurable interval
- Better error states với retry functionality
