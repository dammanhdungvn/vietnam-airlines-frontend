# 📄 Hướng Dẫn Quản Lý Tài Liệu

## 📋 Tổng Quan

Quản lý tài liệu số với upload, preview và phân loại đa dạng.

**URL**: `/quan-ly-tai-lieu`

---

## ✨ Tính Năng

### 1. Upload Tài Liệu
- **Formats**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Size**: Tối đa 10MB
- **Preview**: Icon theo file type

### 2. Danh Sách
- Bảng với icon file
- Tên tài liệu, tác giả
- Ngày tạo/sửa
- Phân trang: 10 items/page

### 3. Preview & Download
- 👁️ Preview: Mở tab mới
- ⬇️ Download: Tải file gốc

### 4. CRUD Operations
- ✏️ Sửa: Tên, tác giả, file
- 🗑️ Xóa: Với confirmation

---

## 🔄 Quy Trình

### Upload Tài Liệu
```
1. Click "Thêm tài liệu"
2. Dialog form:
   ├─ Tên tài liệu*
   ├─ Tác giả*
   └─ File đính kèm*
3. Chọn file:
   ├─ Drag & drop
   └─ Click "Chọn file"
4. Preview file selected
5. Click "Tải lên"
6. POST /documents → Reload
```

### Sửa Tài Liệu
```
1. Click icon "Sửa"
2. Modal với info hiện tại
3. Update:
   ├─ Tên/Tác giả
   └─ File mới (optional)
4. Click "Cập nhật"
5. PUT /documents/:id
```

### Xóa Tài Liệu
```
1. Click icon "Xóa"
2. Alert dialog confirmation
3. Hiển thị tên tài liệu
4. Click "Xóa" xác nhận
5. DELETE /documents/:id
```

---

## 💾 Dữ Liệu

### IDocument Interface
```typescript
interface IDocument {
  id: number
  documentName: string
  author: string
  filePath: string
  fileUrl: string
  createdAt: string
  updatedAt: string
}
```

---

## 📝 API

### GET /documents
```
Response: IDocument[]
```

### POST /documents
```
Body: FormData
  - documentName: string
  - author: string
  - file: File

Response: {
  id: number
  documentName: string
  filePath: string
  fileUrl: string
}
```

### PUT /documents/:id
```
Body: FormData (optional file)
```

### DELETE /documents/:id
```
Response: 200 OK
```

### GET /documents/:id/download
```
Response: File download
```

---

## 🎨 File Icons

### Icon Mapping
```typescript
// react-file-icon
const getFileIcon = (filePath: string) => {
  const ext = filePath.split('.').pop()
  return <FileIcon extension={ext} />
}
```

### Supported Extensions
- 📕 PDF
- 📘 DOC, DOCX
- 📗 XLS, XLSX
- 📙 PPT, PPTX
- 📄 Default

---

## 🔧 Troubleshooting

### Upload Failed
```
Check:
1. File size < 10MB?
2. Format supported?
3. FormData đúng?
4. Network stable?
```

### Preview Không Mở
```
Check:
1. fileUrl valid?
2. Popup blocker?
3. CORS configured?
```

### Icon Không Hiển Thị
```
Check:
1. Extension parsed đúng?
2. react-file-icon imported?
3. Default icon fallback?
```

---

## 💡 Tips

- **Drag & Drop**: User-friendly upload
- **Preview**: Xem trước không tải
- **File validate**: Client-side trước khi upload
- **Progress bar**: Hiển thị upload progress (optional)

---

<div align="center">
  📚 <a href="./FOOD_MANAGEMENT_GUIDE.md">← Đồ Ăn</a> | <a href="../README.md">Trang Chủ</a> | <a href="./STREAM_MANAGEMENT_GUIDE.md">Link Trực Tuyến →</a>
</div>
