# 🍽️ Hướng Dẫn Quản Lý Đồ Ăn

## 📋 Tổng Quan

Quản lý menu đồ ăn, thức uống với giá cả và mô tả chi tiết.

**URL**: `/quan-ly-do-an`

---

## ✨ Tính Năng

### 1. Danh Sách Menu
- Bảng với đầy đủ thông tin
- Format giá VND
- Ngày tạo/cập nhật
- Phân trang: 10 món/page

### 2. Tìm Kiếm & Sắp Xếp
- 🔍 Tìm theo tên món
- 📊 Sắp xếp:
  - Tên món
  - Giá
  - Ngày tạo
- ⬆️⬇️ Thứ tự: Tăng dần / Giảm dần

### 3. Thêm Mới
- Form modal
- Upload hình ảnh
- Validation đầy đủ

### 4. Chỉnh Sửa & Xóa
- Edit inline trong modal
- Xóa với confirmation

---

## 🔄 Quy Trình

### Thêm Món Mới
```
1. Click "Thêm mới"
2. Dialog hiện form:
   ├─ Tên món* (required)
   ├─ Giá (VND)* (required)
   ├─ Chi tiết/Mô tả
   └─ Hình ảnh (optional)
3. Validation
4. Click "Tạo mới"
5. POST /items → Reload list
```

### Sửa Món
```
1. Click icon "Sửa"
2. Dialog với data hiện tại
3. Chỉnh sửa thông tin
4. Click "Cập nhật"
5. PUT /items/:id → Reload
```

### Xóa Món
```
1. Click icon "Xóa"
2. Confirmation dialog
3. Click "Xóa" xác nhận
4. DELETE /items/:id → Reload
```

---

## 💾 Dữ Liệu

### IItem Interface
```typescript
interface IItem {
  id: number
  itemName: string
  price: number
  description?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}
```

---

## 📝 API

### GET /items
```
Params: {
  page: number
  size: number
  sortBy: "itemName" | "price" | "createdAt"
  sortDir: "asc" | "desc"
  itemName?: string  // Search
}

Response: {
  content: IItem[]
  page: number
  totalElements: number
  totalPages: number
}
```

### POST /items
```
Body: {
  itemName: string
  price: number
  description?: string
  imageUrl?: string
}
```

### PUT /items/:id
```
Body: { itemName, price, description }
```

### DELETE /items/:id
```
Response: 200 OK
```

---

## 🎨 UI Features

### Hiển Thị Giá
```typescript
// Format VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
```

### Hiển Thị Ngày
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString)
    .toLocaleDateString('vi-VN')
}
```

### Pagination
- Client-side với API pagination
- Đồng bộ page state với API

---

## 🔧 Troubleshooting

### Giá Không Format
```
Check:
1. Price là number?
2. Intl.NumberFormat available?
3. Currency code đúng?
```

### Search Không Hoạt Động
```
Check:
1. searchTerm state updated?
2. API call với params đúng?
3. Debounce needed?
```

### Image Upload Failed
```
Check:
1. File size < 5MB?
2. Format: jpg, png?
3. Base64 encoding OK?
```

---

## 💡 Tips

- **Auto search**: Gửi API khi user nhập
- **Sort dropdown**: Trigger API mỗi lần thay đổi
- **Reset page**: Về page 1 khi search/sort
- **Loading state**: Hiển thị khi fetch

---

<div align="center">
  📚 <a href="./SEAT_MANAGEMENT_GUIDE.md">← Ghế</a> | <a href="../README.md">Trang Chủ</a> | <a href="./DOCUMENT_MANAGEMENT_GUIDE.md">Tài Liệu →</a>
</div>
