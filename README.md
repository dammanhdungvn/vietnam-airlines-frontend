# ✈️ Hệ Thống Quản Lý Sự Kiện Vietnam Airlines

> Ứng dụng web quản lý sự kiện và hội nghị chuyên nghiệp, được xây dựng với Next.js 14, TypeScript và Tailwind CSS.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)

---

## 📋 Mục Lục

- [✨ Tính Năng Chính](#-tính-năng-chính)
- [🚀 Bắt Đầu Nhanh](#-bắt-đầu-nhanh)
- [🛠️ Công Nghệ](#️-công-nghệ)
- [📖 Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [🧪 Testing](#-testing)
- [📞 Hỗ Trợ](#-hỗ-trợ)

---

## ✨ Tính Năng Chính

### 📊 Dashboard Thống Kê
- **Thống kê real-time**: Tổng số khách, đăng ký, đặt ghế
- **Doanh thu**: Theo dõi tiền bán ghế, đồ ăn với biểu đồ trực quan
- **Quick actions**: Truy cập nhanh các module quản lý

### 👥 Quản Lý Khách Mời
- ✅ CRUD hoàn chỉnh với modal hiện đại
- 🔍 Tìm kiếm thông minh theo tên, email, SĐT
- 🏷️ Phân loại VIP/Thường với badge màu sắc
- 📸 Upload & quản lý avatar (Base64)
- 📥 Import/Export CSV
- 📄 Phân trang thông minh

### ✈️ Quản Lý Ghế
- 🗺️ Sơ đồ ghế tương tác với màu sắc phân biệt
- 🎨 4 loại ghế: VIP (⭐), NORMAL, FREE, BLOCK
- 💰 Quản lý giá vé linh hoạt
- 🔍 Tìm kiếm & lọc nâng cao
- ⚡ Cập nhật trạng thái real-time

### 🍽️ Quản Lý Đồ Ăn & Thức Uống
- 🍔 Menu đa dạng với hình ảnh
- 💵 Phân loại món có phí/miễn phí
- 📊 Thống kê doanh thu F&B
- 🔄 CRUD với API integration

### 📄 Quản Lý Tài Liệu
- 📎 Upload đa định dạng (PDF, DOC, XLS, PPT)
- 👁️ Preview online không cần tải
- 🗂️ Phân loại: Hướng dẫn, Biểu mẫu, Báo cáo
- 🔐 Kiểm soát quyền truy cập

### 🔗 Quản Lý Link Trực Tuyến
- 🔗 Tạo & quản lý link sự kiện
- 📊 Theo dõi lượt truy cập
- 🏷️ Phân loại: Meeting, Webinar, Document
- 📋 Copy link một click

### 📝 Đăng Ký Hộ (4 Bước)
1. **Chọn khách**: Tìm kiếm từ danh sách
2. **Thông tin**: Nhập dữ liệu & Face ID
3. **Chọn ghế**: Từ sơ đồ tương tác
4. **Dịch vụ**: Chọn combo đồ ăn

---

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống
- Node.js ≥ 18.0
- npm / yarn / pnpm

### Cài Đặt

```bash
# 1. Clone repository
git clone https://github.com/dammanhdungvn/vietnam-airlines-frontend.git
cd vietnam-airlines-frontend

# 2. Cài đặt dependencies
npm install

# 3. Cấu hình environment
cp .env.example .env.local
# Chỉnh sửa NEXT_PUBLIC_API_URL trong .env.local

# 4. Chạy development server
npm run dev
```

Truy cập: **http://localhost:3000**

### Build Production

```bash
# Build
npm run build

# Chạy production
npm start

# Hoặc build UAT
npm run build:uat
npm run start:uat
```

---

## 🛠️ Công Nghệ

### Core
- **Next.js 14** - App Router & Server Components
- **TypeScript** - Type safety
- **React 18** - UI Library

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS
- **Shadcn/ui** - Component library
- **Lucide React** - Icons (1000+)
- **Recharts** - Data visualization

### State & Data
- **React Context** - Global state
- **Cookies** - Session storage (encrypted)
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Testing
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

---

## 📖 Hướng Dẫn Sử Dụng

### 🔐 Đăng Nhập

```
URL: /login
Username: admin
Password: adminVNA123
```

### 📚 Chi Tiết Từng Module

Xem hướng dẫn chi tiết trong thư mục `/document`:

- [`LOGIN_GUIDE.md`](./document/LOGIN_GUIDE.md) - Hướng dẫn đăng nhập
- [`DASHBOARD_GUIDE.md`](./document/DASHBOARD_GUIDE.md) - Dashboard & Thống kê
- [`QUAN_LY_KHACH_MOI_GUIDE.md`](./document/QUAN_LY_KHACH_MOI_GUIDE.md) - Quản lý khách mời
- [`SEAT_MANAGEMENT_GUIDE.md`](./document/SEAT_MANAGEMENT_GUIDE.md) - Quản lý ghế
- [`FOOD_MANAGEMENT_GUIDE.md`](./document/FOOD_MANAGEMENT_GUIDE.md) - Quản lý đồ ăn
- [`DOCUMENT_MANAGEMENT_GUIDE.md`](./document/DOCUMENT_MANAGEMENT_GUIDE.md) - Quản lý tài liệu
- [`STREAM_MANAGEMENT_GUIDE.md`](./document/STREAM_MANAGEMENT_GUIDE.md) - Quản lý link
- [`CUSTOMER_REGISTRATION_GUIDE.md`](./document/CUSTOMER_REGISTRATION_GUIDE.md) - Đăng ký hộ

### 🗺️ Sơ Đồ Điều Hướng

```
/                      → Redirect → /login
/login                 → /dashboard (sau khi đăng nhập)
/dashboard             → Hub chính
  ├── /quan-ly-khach-moi
  ├── /quan-ly-ghe
  ├── /quan-ly-do-an
  ├── /quan-ly-tai-lieu
  ├── /quan-ly-link-truc-tuyen
  └── /dang-ky-ho
```

---

## 🧪 Testing

### Unit Tests

```bash
# Chạy tất cả tests
npm test

# Chạy với coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests

```bash
# Cài đặt Playwright browsers (lần đầu)
npx playwright install

# Chạy E2E tests
npm run test:e2e

# Chạy với UI mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

### Test Coverage

✅ Authentication flow  
✅ Dashboard statistics  
✅ Seat management  
✅ Customer CRUD operations  
✅ API integration  

---

## 📂 Cấu Trúc Project

```
vietnam-airlines-frontend/
├── 📁 app/                    # Next.js App Router
│   ├── dashboard/             # Dashboard chính
│   ├── login/                 # Xác thực
│   ├── dang-ky-ho/           # Đăng ký hộ 4 bước
│   ├── quan-ly-khach-moi/    # Quản lý khách
│   ├── quan-ly-ghe/          # Quản lý ghế
│   ├── quan-ly-do-an/        # Quản lý F&B
│   ├── quan-ly-tai-lieu/     # Quản lý documents
│   └── quan-ly-link-truc-tuyen/ # Quản lý links
├── 📁 components/             # Shared components
│   ├── ui/                    # Shadcn UI components
│   ├── sidebar.tsx           # Navigation
│   ├── seat-map.tsx          # Interactive seat map
│   └── stats-chart.tsx       # Charts
├── 📁 context/               # React Context
│   └── AuthContext.tsx       # Auth state
├── 📁 services/              # API services
│   ├── auth.service.ts
│   ├── person.service.ts
│   ├── seat.service.ts
│   └── ...
├── 📁 types/                 # TypeScript types
├── 📁 lib/                   # Utilities
│   ├── api.ts                # Axios config
│   ├── cookies.ts            # Cookie utilities
│   └── utils.ts              # Helpers
├── 📁 __tests__/             # Tests
│   ├── app/                  # Component tests
│   ├── services/             # Service tests
│   └── context/              # Context tests
├── 📁 document/              # Documentation
└── 📁 public/                # Static assets
```

---

## 🎨 Design System

### Màu Sắc Chủ Đạo

| Color | Hex | Usage |
|-------|-----|-------|
| 🟠 Primary Orange | `#d97706` | Main brand color |
| 🔵 Secondary Blue | `#0ea5e9` | Accents |
| 🟢 Success Green | `#10b981` | Success states |
| 🟡 Warning Yellow | `#f59e0b` | Warnings |
| 🔴 Error Red | `#ef4444` | Errors |
| ⚪ Neutral Gray | `#6b7280` | Text & borders |

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 600-700, line-height 1.2
- **Body**: 400-500, line-height 1.6

---

## 🔒 Bảo Mật

- ✅ Cookie encryption (XOR cipher)
- ✅ Input validation (Zod)
- ✅ XSS protection
- ✅ File upload validation
- ✅ Secure session management
- ✅ JWT token authentication

---

## 🚧 Roadmap

### Phase 2 - Q2 2025
- [ ] Real-time updates (WebSocket)
- [ ] Advanced search (Elasticsearch)
- [ ] Bulk operations
- [ ] Email notifications

### Phase 3 - Q3 2025
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Multi-language support

### Phase 4 - Q4 2025
- [ ] Payment integration (VNPay, MoMo)
- [ ] Email automation
- [ ] Backup system
- [ ] Performance optimization

---

## 🤝 Đóng Góp

### Quy Trình

1. Fork repository
2. Tạo branch: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: thêm tính năng X"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

### Coding Standards
- ✅ TypeScript strict mode
- ✅ ESLint rules
- ✅ Prettier formatting
- ✅ Docstring tiếng Việt
- ✅ Component-based architecture

---

## 📞 Hỗ Trợ

### 📧 Liên Hệ
- **Email**: support@vietnamairlines.com
- **Hotline**: 1900 1100 (24/7)

### 📚 Tài Liệu
- [API Documentation](https://api.vietnamairlines.com/docs)
- [Testing Guide](./TESTING.md)
- [User Guides](./document/)

### 🐛 Báo Lỗi
- GitHub Issues: Sử dụng template có sẵn
- Email: Chi tiết lỗi + screenshot

---

## 📄 Bản Quyền

**© 2025 Vietnam Airlines Corporation. All rights reserved.**

Dự án thuộc sở hữu của Vietnam Airlines và được bảo vệ bởi luật bản quyền.

**Version**: 2.1.0  
**Last Updated**: 03/10/2025  
**Author**: Vietnam Airlines IT Department

---

<div align="center">
  <p>Được xây dựng với ❤️ bởi Vietnam Airlines IT Team</p>
  <p>
    <a href="#-mục-lục">↑ Về đầu trang</a>
  </p>
</div>
