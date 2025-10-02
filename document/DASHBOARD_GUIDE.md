# 📊 Hướng Dẫn Dashboard

## 📋 Tổng Quan

Dashboard là trang chính hiển thị thống kê tổng quan về khách hàng, doanh thu và biểu đồ trực quan.

**URL**: `/dashboard`

---

## 📈 Chức Năng

### 1. Thống Kê Khách Hàng
- **Tổng khách**: Đã upload vào hệ thống
- **Đã đăng ký**: Đăng ký tham gia sự kiện
- **Đã đặt ghế**: Hoàn tất booking

### 2. Thống Kê Doanh Thu
- **Tiền bán ghế**: Revenue from seats
- **Tiền bán đồ ăn**: Revenue from F&B
- **Tổng doanh thu**: Total revenue

### 3. Biểu Đồ
- Bar chart doanh thu theo tuần
- Hover hiển thị chi tiết
- Format VND currency

### 4. Quick Actions
- Link nhanh đến các module quản lý
- Icons trực quan

---

## 🔄 Luồng Hoạt Động

```
1. Component mount
   ↓
2. Call API GET /statistics
   ↓
3. Loading skeleton hiển thị
   ↓
4. Nhận response
   ├─ Success: Cập nhật UI
   └─ Error: Toast thông báo
```

---

## 🛠️ Cấu Trúc Code

### Files
```
app/dashboard/page.tsx         → Component
services/statistics.service.ts → API
types/statistics.type.ts       → Types
components/stats-chart.tsx     → Chart
```

### State Management
```typescript
const [statisticsData, setStatisticsData] = 
  useState<IStatisticsData | null>(null)
const [isLoading, setIsLoading] = useState(true)
```

### API Integration
```typescript
const fetchStatistics = async () => {
  try {
    const data = await getStatistics()
    setStatisticsData(data)
  } catch (error) {
    toast.error("Lỗi tải thống kê")
  } finally {
    setIsLoading(false)
  }
}
```

---

## 📊 API Response

### Endpoint: GET /statistics

**Response:**
```json
{
  "code": 200,
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

---

## 🎨 UI States

### Loading
- Skeleton placeholders cho tất cả cards
- Spinner animation

### Success
- Hiển thị số liệu thực
- Format tiền VND
- Chart với data

### Error
- Toast error message
- UI trống (graceful degradation)

---

## 🔧 Troubleshooting

### Lỗi 401 Unauthorized
```
Check:
1. User đã đăng nhập?
2. Token còn hạn?
3. Token trong cookies?
```

### Lỗi Network
```
Check:
1. API server running?
2. Correct URL in .env?
3. Network connection?
```

### Dữ Liệu Không Hiển Thị
```
F12 → Network tab:
1. API call có gửi không?
2. Response structure đúng?
3. Console có error?
```

---

## ✅ Testing

```bash
# Unit tests
npm test __tests__/app/dashboard
npm test __tests__/services/statistics
```

**Test cases:**
- Loading state
- Success state
- Error handling
- Format currency
- Quick actions click

---

<div align="center">
  📚 <a href="./LOGIN_GUIDE.md">← Login</a> | <a href="../README.md">Trang Chủ</a> | <a href="./QUAN_LY_KHACH_MOI_GUIDE.md">Quản Lý Khách →</a>
</div>
