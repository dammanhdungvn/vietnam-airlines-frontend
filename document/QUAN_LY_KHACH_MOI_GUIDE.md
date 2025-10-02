# 👥 Hướng Dẫn Quản Lý Khách Mời

## 📋 Tổng Quan

Quản lý thông tin khách mời tham gia sự kiện với đầy đủ tính năng CRUD, import/export và xử lý avatar.

**URL**: `/quan-ly-khach-moi`

---

## ✨ Tính Năng Chính

### 1. Xem Danh Sách
- Bảng hiển thị đầy đủ thông tin
- Badge VIP/Thường
- Trạng thái Hoạt động/Không hoạt động
- Avatar preview

### 2. Tìm Kiếm & Lọc
- 🔍 Tìm theo: Tên, Email, Chức vụ
- 📊 Sắp xếp: ID, Tên, Email (asc/desc)
- 📄 Phân trang: 10 items/page

### 3. Thêm Mới
- Form đầy đủ với validation
- Upload avatar (Base64)
- Phân loại: Siêu VIP / VIP / Thường

### 4. Import CSV
- Upload file Excel
- Batch create nhiều khách
- Download template

### 5. Chỉnh Sửa
- Modal popup (không reload page)
- Update avatar
- Real-time validation

### 6. Xóa
- Confirmation dialog
- Hiển thị thông tin đầy đủ
- Không thể hoàn tác

---

## 🔄 Quy Trình

### Thêm Mới

```
1. Click "Thêm mới"
2. Điền form:
   - Email* (required)
   - Họ tên* (required)
   - SĐT, Chức vụ
   - Giới tính, Trạng thái
   - Loại khách (VIP)
3. Upload avatar (optional)
4. Click "Thêm khách mời"
5. System: Tạo person → Upload avatar
6. Toast success → Reload list
```

### Chỉnh Sửa

```
1. Click icon "Edit"
2. System gọi API lấy thông tin đầy đủ (email)
3. Modal hiển thị:
   - Thông tin cơ bản
   - Ghế ngồi (nếu có)
   - Món ăn đã đặt (nếu có)
   - Avatar
4. Chỉnh sửa:
   - Thông tin cá nhân
   - Thay đổi/chọn ghế mới
   - Thêm/bớt món ăn
   - Upload avatar mới
5. Click "Cập nhật"
6. System: 
   - Kiểm tra thay đổi
   - Upload avatar (nếu có)
   - Update thông tin qua registration API
7. Toast success → Reload
```

### Import CSV

```
1. Click "Import"
2. Chọn file .xlsx/.xls
3. System validate format
4. Batch create
5. Toast kết quả
```

---

## 💾 Xử Lý Avatar

### Khi Thêm Mới
```
1. User chọn ảnh
2. Tạo person (personId = null)
3. API trả về personId mới
4. Upload ảnh với personId
5. Success
```

### Khi Chỉnh Sửa
```
1. User chọn ảnh mới
2. Upload ảnh trước (với personId)
3. Update thông tin person
4. Success
```

### Note
- Upload qua `/valid-upload-face`
- Param: `acsDevIndexCode=90`
- Fallback nếu upload failed

---

## 📊 Dữ Liệu

### Person Interface
```typescript
interface Person {
  personId: string
  fullName: string
  email: string
  phone: string
  position: string
  avatarUrl?: string
  status: boolean
  isVip: "SUPER_VIP" | "VIP" | "NORMAL"
  gender: "MALE" | "FEMALE" | "OTHER"
  seatInfo?: SeatInfo
  items?: Item[]
}
```

---

## 🔧 Troubleshooting

### Avatar Không Upload
```
Check:
1. File đúng format? (jpg, png)
2. Size < 5MB?
3. personId có hợp lệ?
4. API endpoint đúng?
```

### Import Failed
```
Check:
1. File đúng template?
2. Required fields đầy đủ?
3. Email không trùng?
```

### Không Thấy Danh Sách
```
F12 → Network:
1. API call success?
2. Response có data?
3. Pagination đúng?
```

---

## 📝 API Endpoints

### GET /core/persons/paginated
```
Params: page, size, sortBy, sortDir
Response: { content, totalElements, ... }
```

### GET /core/persons/registration/{email}
```
Lấy thông tin đầy đủ của person bao gồm:
- Thông tin cá nhân
- Ghế ngồi (seatInfo)
- Món ăn đã đặt (items)
Response: {
  personId, fullName, email, ...,
  seatInfo: { seatNumber, paidPrice },
  items: [{ id, itemName, quantity, ... }]
}
```

### POST /core/persons
```
Body: { email, fullName, ... }
Response: { personId, ... }
```

### POST /core/persons/registration
```
Cập nhật thông tin person (dùng email để identify)
Body: {
  email, fullName, position, phone,
  gender, status, isVip,
  seatInfo: { seatNumber, paidPrice } | null,
  items: [{ itemId, quantity, paidAmount }]
}
```

### POST /core/persons/valid-upload-face
```
Params: personId, acsDevIndexCode=90
Body: FormData (faceImage)
```

### DELETE /core/persons/:id
```
Response: 200 OK
```

---

## 🎯 Tính Năng Nâng Cao

### Quản Lý Ghế Ngồi (Edit Modal)
- **Xem ghế hiện tại**: Hiển thị số ghế và giá
- **Thay đổi ghế**: Chọn từ danh sách ghế available
- **Xóa ghế**: Hủy đăng ký ghế ngồi
- **Tự động cập nhật giá**: Theo thông tin ghế được chọn

### Quản Lý Món Ăn (Edit Modal)
- **Danh sách món đã chọn**: Hiển thị với số lượng và giá
- **Thêm món**: Chọn từ dropdown menu
- **Tăng/giảm số lượng**: Buttons +/-
- **Xóa món**: Giảm về 0 hoặc click remove
- **Tổng tiền**: Tự động tính toán real-time

### Change Detection
- **Thông minh**: Chỉ gọi API khi có thay đổi
- **So sánh**: Với dữ liệu gốc từ API
- **Tối ưu**: Tiết kiệm bandwidth và server load

---

## ✅ Best Practices

1. **Luôn validate** trước khi submit
2. **Upload ảnh** sau khi có personId
3. **Reload list** sau mọi thay đổi
4. **Xác nhận** trước khi xóa
5. **Handle errors** gracefully

---

<div align="center">
  📚 <a href="./DASHBOARD_GUIDE.md">← Dashboard</a> | <a href="../README.md">Trang Chủ</a> | <a href="./SEAT_MANAGEMENT_GUIDE.md">Quản Lý Ghế →</a>
</div>
