# 🔗 Hướng Dẫn Quản Lý Link Trực Tuyến

## 📋 Tổng Quan

Quản lý các link meeting, webinar và tài liệu trực tuyến cho sự kiện.

**URL**: `/quan-ly-link-truc-tuyen`

---

## ✨ Tính Năng

### 1. Danh Sách Link
- Bảng với tên & URL
- Click "Truy cập" → Mở tab mới
- Tên dài tự động xuống dòng
- Fixed width: 100vw

### 2. Tìm Kiếm & Sắp Xếp
- 🔍 Tìm theo tên hoặc URL
- 📊 Sắp xếp: Tên link, URL
- ⬆️⬇️ Tăng dần / Giảm dần

### 3. CRUD
- ➕ Thêm link mới
- ✏️ Sửa thông tin
- 🗑️ Xóa (confirmation)

### 4. Phân Trang
- 10 links/page
- Navigation: ← Trước | Sau →
- Hiển thị: "X đến Y trong Z link"

---

## 🔄 Quy Trình

### Thêm Link
```
1. Click "Thêm link mới"
2. Dialog form:
   ├─ Tên link*
   └─ URL*
3. Validation:
   ├─ URL format
   └─ Required fields
4. Click "Tạo"
5. POST /streams → Reload
```

### Sửa Link
```
1. Click icon "Sửa"
2. Dialog với data hiện tại
3. Chỉnh sửa
4. Click "Cập nhật"
5. PUT /streams/:id
```

### Xóa Link
```
1. Click icon "Xóa"
2. Confirmation dialog
3. Hiển thị tên link
4. Click "Xóa" confirm
5. DELETE /streams/:id
```

---

## 💾 Dữ Liệu

### Stream Interface
```typescript
interface Stream {
  id: number
  streamName: string
  streamUrl: string
}
```

---

## 📝 API

### GET /streams
```
Response: Stream[]
```

### POST /streams
```
Body: {
  streamName: string
  streamUrl: string
}
```

### PUT /streams/:id
```
Body: { streamName, streamUrl }
```

### DELETE /streams/:id
```
Response: 200 OK
```

---

## 🎨 UI Features

### Table Layout
```typescript
// Fixed width columns
<table className="w-full table-fixed">
  <th className="w-1/12">STT</th>
  <th className="w-5/12">Tên link</th>
  <th className="w-4/12">Đường dẫn</th>
  <th className="w-2/12">Thao tác</th>
</table>
```

### Link Display
```typescript
// Truncate & wrap long names
<p className="break-words">{streamName}</p>

// Access link
<a href={streamUrl} target="_blank">
  Truy cập →
</a>
```

---

## 🔧 Troubleshooting

### Scroll Ngang
```
Fix:
1. PageContainer wrapper
2. table-fixed layout
3. break-words cho text
```

### Link Không Mở
```
Check:
1. URL valid?
2. Protocol (http/https)?
3. target="_blank" set?
4. Popup blocker?
```

### Tên Không Wrap
```
Check:
1. break-words applied?
2. flex-1 min-w-0 set?
3. Table layout fixed?
```

---

## 💡 Tips

- **URL Validation**: Check format trước khi save
- **External Link**: Luôn mở tab mới
- **Long Names**: Break words để tránh scroll
- **Copy Link**: Thêm copy button (optional)

---

<div align="center">
  📚 <a href="./DOCUMENT_MANAGEMENT_GUIDE.md">← Tài Liệu</a> | <a href="../README.md">Trang Chủ</a> | <a href="./CUSTOMER_REGISTRATION_GUIDE.md">Đăng Ký Hộ →</a>
</div>
