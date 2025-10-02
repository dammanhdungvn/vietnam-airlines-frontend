# ✈️ Hướng Dẫn Quản Lý Ghế

## 📋 Tổng Quan

Quản lý ghế với sơ đồ tương tác, phân loại VIP/Thường/Free/Block và tracking trạng thái.

**URL**: `/quan-ly-ghe`

---

## 🎨 Loại Ghế

| Loại | Màu | Icon | Giá |
|------|-----|------|-----|
| **VIP** | 🟡 Vàng | ⭐ | Có giá |
| **NORMAL** | 🔵 Xanh teal | - | Có giá |
| **FREE** | 🟢 Xanh lá | - | Miễn phí |
| **BLOCK** | ⚪ Xám | 🔒 | Bị khóa |

## 📊 Trạng Thái

- **AVAILABLE**: Ghế trống ✅
- **TAKEN**: Đã đặt ❌

---

## ✨ Tính Năng

### 1. Sơ Đồ Ghế
- Visual seat map với 3 khối
- Màu sắc phân biệt rõ ràng
- Click để xem chi tiết

### 2. Danh Sách Chi Tiết
- Bảng với đầy đủ thông tin
- Badge màu cho loại & trạng thái
- Actions: Xem / Sửa / Xóa

### 3. Tìm Kiếm & Lọc
- 🔍 Tìm: Số ghế hoặc loại
- 📋 Lọc: VIP, Thường, Free, Block
- 📊 Sắp xếp: Số ghế, Loại, Giá, Trạng thái

### 4. Phân Trang
- 10 ghế/trang
- Navigation: ← Trước | Số trang | Sau →
- Hiển thị: "X đến Y trong Z ghế"

---

## 🔄 Thao Tác

### Xem Chi Tiết
```
1. Click icon "Xem" hoặc số ghế
2. Navigate → /quan-ly-ghe/[id]
3. Hiển thị full info + booking history
```

### Sửa Ghế
```
1. Click icon "Sửa"
2. Dialog với form:
   - Số ghế
   - Loại ghế (dropdown)
   - Giá gốc (VND)
3. Validation
4. Click "Lưu thay đổi"
5. API PUT → Reload
```

### Xóa Ghế
```
1. Click icon "Xóa"
2. Confirmation dialog
3. Hiển thị: "Xóa ghế [X]?"
4. Click "Xóa"
5. API DELETE → Reload
```

---

## 💾 Dữ Liệu

### ISeat Interface
```typescript
interface ISeat {
  id: number
  seatNumber: string       // "A1", "B12"
  type: SeatType          // VIP | NORMAL | FREE | BLOCK
  basePrice: number | null // null nếu FREE
  paidPrice?: number
  isBooked: boolean
  status: SeatStatus      // AVAILABLE | TAKEN
}
```

---

## 📝 API

### GET /seats
```
Response: {
  code: 200,
  data: {
    content: ISeat[],
    totalElements: number
  }
}
```

### PUT /seats/:id
```
Body: {
  seatNumber: string
  type: SeatType
  basePrice: number
}
```

### DELETE /seats/:id
```
Response: 200 OK
```

---

## 🔧 Troubleshooting

### Sơ Đồ Không Hiển Thị
```
Check:
1. API response có data?
2. Ghế có seatNumber hợp lệ?
3. Console có error?
```

### Giá Không Hiển Thị
```
Check:
1. basePrice có null?
2. Format currency đúng?
3. FREE seat → "Miễn phí"
```

### Filter Không Hoạt Động
```
Check:
1. Selected filters state?
2. Filter logic đúng?
3. Re-render triggered?
```

---

## 💡 Tips

- **VIP seats**: Luôn có basePrice
- **FREE seats**: basePrice = null
- **BLOCK seats**: Không thể book
- **Pagination**: Client-side với useMemo

---

<div align="center">
  📚 <a href="./QUAN_LY_KHACH_MOI_GUIDE.md">← Khách Mời</a> | <a href="../README.md">Trang Chủ</a> | <a href="./FOOD_MANAGEMENT_GUIDE.md">Đồ Ăn →</a>
</div>
