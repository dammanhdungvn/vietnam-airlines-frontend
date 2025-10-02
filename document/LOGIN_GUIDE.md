# 🔐 Hướng Dẫn Đăng Nhập

## 📋 Tổng Quan

Chức năng đăng nhập xác thực người dùng và quản lý phiên làm việc an toàn với cookie encryption.

---

## 🔄 Luồng Hoạt Động

### Quy Trình

```
1. Truy cập → Auto redirect /login
2. Nhập username & password
3. Validation client-side
4. POST /auth/login
5. Lưu tokens (encrypted cookies)
6. Redirect → /dashboard
```

### Chi Tiết

**Bước 1-2: Nhập Thông Tin**
- Form với 2 fields: username, password
- Validation real-time

**Bước 3-4: Xác Thực**
- Click "Sign in"
- Button loading state
- Gửi request đến API

**Bước 5-6: Phản Hồi**
- ✅ Thành công: Lưu cookie → toast → redirect
- ❌ Thất bại: Hiển thị lỗi → ở lại trang

---

## 🎨 Giao Diện

### Layout
- **Split screen**: Form (trái) + Hình ảnh VNA (phải)
- **Responsive**: Mobile-friendly

### Form
- Username (required)
- Password (required)
- Submit button với loading state

---

## 🛠️ Cấu Trúc Code

### Files

```
app/login/page.tsx          → UI Component
services/auth.service.ts    → API calls
context/AuthContext.tsx     → Global state
lib/cookies.ts              → Cookie utilities
```

### AuthContext

**State:**
```typescript
user: User | null
isAuthenticated: boolean
isLoading: boolean
```

**Methods:**
```typescript
login(data)   → Lưu cookies + update state
logout()      → Xóa cookies + redirect
```

**Persistence:**
- Đọc cookies khi app load
- Auto-restore session

---

## ⚠️ Xử Lý Lỗi

### Client Validation
- Zod schema validation
- Hiển thị lỗi dưới input

### Server Errors
| Status | Message |
|--------|---------|
| 400 | "Dữ liệu không hợp lệ" |
| 401 | "Sai thông tin đăng nhập" |
| 500 | "Lỗi server" |
| Network | "Không kết nối được" |

---

## 🔧 Troubleshooting

### Network Tab (F12)
```
POST /auth/login
├─ Payload: { username, password }
└─ Response: 200 OK / 401 Unauthorized
```

### Application Tab
```
Cookies (sau khi login):
├─ accessToken  [encrypted]
├─ refreshToken [encrypted]
└─ user        [encrypted JSON]
```

### Environment
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://171.244.130.53:9082/api/v1
```

---

## 🔒 Bảo Mật

- Cookie encryption (XOR + Base64)
- 7 days expiration
- Auto logout khi expired

---

## 📝 API

### POST /auth/login

**Request:**
```json
{
  "username": "admin",
  "password": "adminVNA123"
}
```

**Response:**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "username": "admin",
  "role": "ADMIN"
}
```

---

<div align="center">
  📚 <a href="../README.md">Trang Chủ</a> | <a href="./DASHBOARD_GUIDE.md">Dashboard →</a>
</div>
