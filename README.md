# 🛩️ Hệ thống Quản lý Sự kiện Vietnam Airlines

Ứng dụng web quản lý sự kiện và hội nghị chuyên nghiệp của Vietnam Airlines, được xây dựng với công nghệ hiện đại Next.js 14, TypeScript và Tailwind CSS.

## 📋 Mục lục

- [🚀 Tính năng chính](#-tính-năng-chính)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📱 Giao diện người dùng](#-giao-diện-người-dùng)
- [🔧 Cài đặt và triển khai](#-cài-đặt-và-triển-khai)
- [📖 Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [🎯 Quy trình làm việc](#-quy-trình-làm-việc)
- [🔒 Bảo mật](#-bảo-mật)
- [📞 Hỗ trợ](#-hỗ-trợ)

## 🚀 Tính năng chính

### 📊 Dashboard Thống kê Tổng quan
- **Thống kê khách hàng**: Hiển thị tổng số khách đã upload, đăng ký tham gia và mua ghế
- **Báo cáo doanh thu**: Theo dõi tiền bán ghế, đồ ăn với tỷ lệ tăng trưởng
- **Biểu đồ trực quan**: Biểu đồ doanh thu theo tuần với hiệu ứng động
- **Thao tác nhanh**: Truy cập nhanh đến các module quản lý

### 👥 Quản lý Khách mời Toàn diện
- **Danh sách khách mời**: Hiển thị thông tin chi tiết với avatar, trạng thái VIP
- **Tìm kiếm thông minh**: Tìm kiếm theo tên, email, số điện thoại
- **Phân loại khách hàng**: Quản lý khách VIP và thường với màu sắc phân biệt
- **Upload avatar**: Tính năng upload ảnh với preview và xử lý base64
- **Import/Export CSV**: Nhập danh sách từ file CSV và xuất template
- **CRUD hoàn chỉnh**: Thêm, sửa, xóa với form validation và confirmation dialog
- **Phân trang**: Điều hướng trang với số lượng hiển thị tùy chỉnh

### ✈️ Quản lý Ghế Chuyên nghiệp
- **Sơ đồ ghế tương tác**: Hiển thị trực quan trạng thái ghế với màu sắc phân biệt
- **Phân loại ghế đa dạng**: 
  - VIP (vàng với icon sao) - Ghế hạng thương gia
  - NORMAL (xanh teal) - Ghế hạng phổ thông  
  - FREE (xanh lá) - Ghế miễn phí
  - BLOCK (xám) - Ghế bị khóa không thể chọn
- **Trạng thái ghế**: AVAILABLE (trống) và TAKEN (đã có người ngồi)
- **Quản lý giá vé**: Cập nhật giá theo từng loại ghế, hỗ trợ ghế miễn phí
- **Tìm kiếm thông minh**: Tìm theo số ghế hoặc loại ghế
- **Bộ lọc nâng cao**: Lọc theo loại ghế, ghế có giá, trạng thái
- **Sắp xếp linh hoạt**: Theo tên ghế, loại, giá, trạng thái
- **Phân trang**: Hiển thị 10 ghế mỗi trang với điều hướng dễ dàng
- **CRUD hoàn chỉnh**: Thêm, sửa, xóa ghế với validation
- **API Integration**: Tích hợp với RESTful API để đồng bộ dữ liệu
- **Responsive Design**: Tối ưu cho mọi thiết bị từ desktop đến mobile

### 🍽️ Quản lý Đồ ăn & Thức uống
- **Menu đa dạng**: Quản lý thực đơn với hình ảnh và mô tả
- **Phân loại món ăn**: Món chính, đồ uống, tráng miệng
- **Quản lý giá cả**: Món có phí và miễn phí với logic tự động
- **Theo dõi tồn kho**: Trạng thái còn hàng/hết hàng
- **Thống kê F&B**: Doanh thu từ dịch vụ ăn uống
- **Phân trang thông minh**: Điều hướng với số lượng tùy chỉnh

### 📄 Quản lý Tài liệu Số
- **Upload đa định dạng**: Hỗ trợ PDF, DOC, DOCX, XLS, XLSX, PPT
- **Phân loại tài liệu**: Hướng dẫn, Biểu mẫu, Báo cáo, Khác
- **Quản lý phiên bản**: Theo dõi ngày tạo và sửa đổi
- **Tìm kiếm nâng cao**: Tìm theo tên, loại, ngày tạo
- **Preview online**: Xem trước tài liệu không cần tải về
- **Quyền truy cập**: Kiểm soát quyền xem và chỉnh sửa

### 🔗 Quản lý Link Trực tuyến
- **Tạo link tùy chỉnh**: Tạo link tham gia sự kiện
- **Theo dõi truy cập**: Thống kê lượt click và thời gian truy cập
- **Phân loại link**: Meeting, Webinar, Document, Other
- **Quản lý trạng thái**: Active/Inactive với màu sắc phân biệt
- **Ghi chú chi tiết**: Thêm mô tả cho từng link
- **Sao chép nhanh**: Copy link với một click

### 📝 Quy trình Đăng ký hộ 4 bước
1. **Chọn khách hàng**: Tìm kiếm và chọn từ danh sách có sẵn
2. **Thu thập thông tin**: Nhập thông tin cá nhân và Face ID
3. **Upload ảnh**: Chụp/upload ảnh định danh với preview
4. **Chọn dịch vụ**: Chọn ghế và đồ ăn kèm theo

### 🔐 Hệ thống Xác thực
- **Giao diện split-screen**: Thiết kế hiện đại với hình ảnh Vietnam Airlines
- **Đăng nhập an toàn**: Xác thực với email/password
- **Dropdown menu**: Menu người dùng với tùy chọn đăng xuất
- **Điều hướng thông minh**: Tự động chuyển hướng sau đăng nhập
- **Session management**: Quản lý phiên đăng nhập

## 🛠️ Công nghệ sử dụng

### Frontend Framework
- **Next.js 14**: App Router với Server Components
- **TypeScript**: Type safety và IntelliSense
- **React 18**: Hooks và Concurrent Features

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **Shadcn/ui**: Component library với Radix UI
- **Lucide React**: Icon library với 1000+ icons
- **Recharts**: Thư viện biểu đồ responsive

### State Management & Data
- **React Hooks**: useState, useEffect, useCallback
- **Local Storage**: Lưu trữ dữ liệu tạm thời
- **FileReader API**: Xử lý upload file với base64

### Development Tools
- **ESLint**: Code linting và formatting
- **Prettier**: Code formatting tự động
- **TypeScript**: Static type checking

## 📱 Giao diện người dùng

### Responsive Design
- **Desktop**: 1024px+ - Layout đầy đủ với sidebar
- **Tablet**: 768px-1023px - Layout thu gọn
- **Mobile**: 320px-767px - Layout stack với hamburger menu

### Design System

#### Màu sắc chủ đạo
\`\`\`css
Primary Orange: #d97706    /* Màu chính Vietnam Airlines */
Secondary Blue: #0ea5e9    /* Màu phụ cho accents */
Success Green: #10b981     /* Thành công, xác nhận */
Warning Yellow: #f59e0b    /* Cảnh báo, chờ xử lý */
Error Red: #ef4444         /* Lỗi, từ chối */
Neutral Gray: #6b7280      /* Text phụ, borders */
\`\`\`

#### Typography
- **Font chính**: Inter (Google Fonts) - Dễ đọc, hiện đại
- **Heading**: Font weight 600-700, line-height 1.2
- **Body text**: Font weight 400-500, line-height 1.6
- **Small text**: Font size 14px, weight 400

#### Spacing & Layout
- **Container**: Max-width 1200px, padding responsive
- **Grid system**: CSS Grid và Flexbox
- **Spacing scale**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64px)

## 🔧 Cài đặt và triển khai

### Yêu cầu hệ thống
- **Node.js**: Phiên bản 18.0 trở lên
- **Package Manager**: npm, yarn, hoặc pnpm
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Cài đặt Development

\`\`\`bash
# 1. Clone repository
git clone https://github.com/vietnam-airlines/event-management.git
cd vietnam-airlines-event-management

# 2. Cài đặt dependencies
npm install
# hoặc
yarn install

# 3. Chạy development server
npm run dev
# hoặc
yarn dev

# 4. Mở browser tại http://localhost:3000
\`\`\`

### Build Production

\`\`\`bash
# Build ứng dụng
npm run build

# Chạy production server
npm start

# Hoặc export static files
npm run export
\`\`\`

### Environment Variables

\`\`\`env
# .env.local
NEXT_PUBLIC_API_URL=http://171.244.130.53:9082/api/v1
\`\`\`

## 📖 Hướng dẫn sử dụng

### Cho Quản trị viên

#### Đăng nhập hệ thống
1. Truy cập trang chủ (tự động chuyển đến `/login`)
2. Nhập email và mật khẩu
3. Click "Đăng nhập" để vào dashboard

#### Quản lý khách mời
1. **Thêm khách mới**: Click "Thêm mới" → Điền form → "Lưu"
2. **Import CSV**: Click "Import" → Tải template → Điền dữ liệu → Upload
3. **Sửa thông tin**: Click icon "Sửa" → Cập nhật → "Cập nhật"
4. **Xóa khách**: Click icon "Xóa" → Xác nhận trong dialog

#### Quản lý ghế
1. **Xem sơ đồ**: Màu sắc và icon thể hiện loại và trạng thái ghế
2. **Tìm kiếm ghế**: Nhập số ghế hoặc loại ghế vào ô tìm kiếm
3. **Lọc ghế**: Sử dụng bộ lọc để hiển thị ghế theo tiêu chí
4. **Sắp xếp**: Chọn tiêu chí sắp xếp từ dropdown
5. **Cập nhật thông tin**: Click "Sửa" → Chỉnh sửa → "Lưu thay đổi"
6. **Xóa ghế**: Click "Xóa" → Xác nhận trong dialog
7. **Xem chi tiết**: Click "Xem" để chuyển đến trang chi tiết ghế

#### Quản lý đồ ăn
1. **Thêm món**: Click "Thêm mới" → Điền thông tin → Chọn có phí/miễn phí
2. **Cập nhật menu**: Sửa tên, giá, mô tả món ăn
3. **Quản lý tồn kho**: Cập nhật trạng thái còn hàng

### Cho Nhân viên

#### Đăng ký hộ khách hàng
1. **Bước 1**: Tìm và chọn khách từ danh sách
2. **Bước 2**: Nhập thông tin cá nhân, upload ảnh Face ID
3. **Bước 3**: Chọn ghế từ sơ đồ
4. **Bước 4**: Chọn combo đồ ăn → Hoàn tất

#### Tra cứu thông tin
1. **Tìm khách**: Dùng thanh search theo tên/email/SĐT
2. **Lọc dữ liệu**: Sử dụng dropdown filter
3. **Xuất báo cáo**: Click "Export" để tải file CSV

## 🎯 Quy trình làm việc

### Workflow Đăng ký sự kiện

\`\`\`mermaid
graph TD
    A[Khách hàng liên hệ]  B[Nhân viên tạo profile]
    B  C[Upload thông tin cá nhân]
    C  D[Chọn ghế và dịch vụ]
    D  E[Xác nhận đăng ký]
    E  F[Thanh toán]
    F  G[Hoàn tất]
\`\`\`

### Quy trình quản lý dữ liệu

1. **Thu thập**: Nhập/import dữ liệu từ nhiều nguồn
2. **Xác thực**: Validate dữ liệu theo business rules
3. **Lưu trữ**: Lưu vào state management và local storage
4. **Xử lý**: Thực hiện các thao tác CRUD
5. **Báo cáo**: Xuất dữ liệu và thống kê

## 🔒 Bảo mật

### Frontend Security
- **Input Validation**: Validate tất cả input từ user
- **XSS Protection**: Sanitize HTML content
- **File Upload**: Kiểm tra file type và size
- **Session Management**: Timeout tự động

### Data Protection
- **Local Storage**: Mã hóa dữ liệu nhạy cảm
- **File Handling**: Base64 encoding cho images
- **Error Handling**: Không expose sensitive information

## 📂 Cấu trúc dự án chi tiết

\`\`\`
vietnam-airlines-management/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 dashboard/                # Trang dashboard chính
│   │   └── page.tsx                 # Dashboard với thống kê
│   ├── 📁 login/                    # Xác thực người dùng
│   │   └── page.tsx                 # Form đăng nhập
│   ├── 📁 dang-ky-ho/              # Quy trình đăng ký hộ
│   │   └── page.tsx                 # 4 bước đăng ký
│   ├── 📁 quan-ly-khach-moi/       # Quản lý khách mời
│   │   └── page.tsx                 # CRUD khách hàng
│   ├── 📁 quan-ly-ghe/             # Quản lý ghế
│   │   ├── page.tsx                 # Danh sách ghế
│   │   └── 📁 [id]/                # Chi tiết ghế
│   │       └── page.tsx
│   ├── 📁 quan-ly-do-an/           # Quản lý F&B
│   │   └── page.tsx                 # Menu và giá cả
│   ├── 📁 quan-ly-tai-lieu/        # Quản lý documents
│   │   └── page.tsx                 # Upload và quản lý files
│   ├── 📁 quan-ly-link-truc-tuyen/ # Quản lý links
│   │   └── page.tsx                 # Links và tracking
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   └── page.tsx                     # Redirect to login
├── 📁 components/                   # Shared components
│   ├── 📁 ui/                      # Shadcn UI components
│   │   ├── button.tsx              # Button variants
│   │   ├── card.tsx                # Card layouts
│   │   ├── dialog.tsx              # Modal dialogs
│   │   ├── input.tsx               # Form inputs
│   │   ├── select.tsx              # Dropdown selects
│   │   ├── table.tsx               # Data tables
│   │   ├── toast.tsx               # Notifications
│   │   └── ...                     # Các UI components khác
│   ├── client-layout.tsx           # Client wrapper
│   ├── sidebar.tsx                 # Navigation sidebar
│   ├── step-indicator.tsx          # Progress indicator
│   ├── customer-list.tsx           # Customer selection
│   ├── seat-map.tsx               # Interactive seat map
│   ├── stats-chart.tsx            # Revenue charts
│   ├── food-combo-modal.tsx       # Food selection modal
│   └── success-modal.tsx          # Success confirmations
├── 📁 lib/                        # Utilities
│   └── utils.ts                   # Helper functions
├── 📁 public/                     # Static assets
│   ├── vietnam-airlines-plane-flying-in-blue-sky.jpg
│   ├── business-man-avatar.png
│   ├── business-woman-avatar.png
│   └── ...                        # Các assets khác
├── package.json                   # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
├── next.config.mjs              # Next.js config
└── README.md                    # Documentation
\`\`\`

## 🔄 Luồng điều hướng

### Navigation Flow
\`\`\`
/ (Root) 
├── Redirect to → /login
│
/login
├── Success → /dashboard
├── Error → Stay on /login
│
/dashboard (Main Hub)
├── Thống kê → /dashboard
├── Quản lý khách mời → /quan-ly-khach-moi
├── Quản lý ghế → /quan-ly-ghe
├── Quản lý đồ ăn → /quan-ly-do-an
├── Quản lý tài liệu → /quan-ly-tai-lieu
├── Link trực tuyến → /quan-ly-link-truc-tuyen
└── Đăng ký hộ → /dang-ky-ho
\`\`\`

### User Journey
1. **Truy cập** → Tự động redirect đến login
2. **Đăng nhập** → Xác thực thành công → Dashboard
3. **Dashboard** → Overview và quick actions
4. **Quản lý** → Truy cập các module chức năng
5. **Thao tác** → CRUD operations với feedback
6. **Đăng xuất** → Confirmation → Về login

## 🚀 Tính năng sắp tới

### Phase 2 - Q2 2025
- [ ] **API Integration**: Kết nối backend RESTful API
- [ ] **Real-time Updates**: WebSocket cho cập nhật live
- [ ] **Advanced Search**: Full-text search với Elasticsearch
- [ ] **Bulk Operations**: Thao tác hàng loạt cho admin

### Phase 3 - Q3 2025
- [ ] **Mobile App**: React Native companion app
- [ ] **Push Notifications**: Thông báo real-time
- [ ] **Advanced Analytics**: Dashboard analytics nâng cao
- [ ] **Multi-language**: Hỗ trợ tiếng Anh

### Phase 4 - Q4 2025
- [ ] **Payment Integration**: Tích hợp VNPay, MoMo
- [ ] **Email Automation**: Gửi email tự động
- [ ] **Backup System**: Sao lưu dữ liệu định kỳ
- [ ] **Performance Optimization**: Tối ưu tốc độ loading

## 🤝 Đóng góp và phát triển

### Quy trình đóng góp
1. **Fork** repository về tài khoản cá nhân
2. **Clone** về máy local: `git clone [your-fork-url]`
3. **Branch** tạo nhánh mới: `git checkout -b feature/ten-tinh-nang`
4. **Develop** phát triển tính năng mới
5. **Test** kiểm tra kỹ lưỡng
6. **Commit** với message rõ ràng: `git commit -m "feat: thêm tính năng X"`
7. **Push** lên GitHub: `git push origin feature/ten-tinh-nang`
8. **Pull Request** tạo PR với mô tả chi tiết

### Coding Standards
- **TypeScript**: Sử dụng strict mode
- **ESLint**: Tuân thủ rules đã định
- **Prettier**: Format code tự động
- **Naming**: camelCase cho variables, PascalCase cho components
- **Comments**: Viết comment bằng tiếng Việt cho business logic

### Testing Guidelines
- **Unit Tests**: Test từng component riêng lẻ
- **Integration Tests**: Test luồng hoạt động
- **E2E Tests**: Test user journey hoàn chỉnh
- **Manual Testing**: Kiểm tra trên nhiều device/browser

## 📞 Hỗ trợ và liên hệ

### Đội ngũ phát triển
- **Tech Lead**: Nguyễn Văn A - nguyenvana@vietnamairlines.com
- **Frontend Developer**: Trần Thị B - tranthib@vietnamairlines.com
- **UI/UX Designer**: Lê Văn C - levanc@vietnamairlines.com

### Kênh hỗ trợ
- **Email hỗ trợ**: support@vietnamairlines.com
- **Hotline**: 1900 1100 (24/7)
- **Website**: https://www.vietnamairlines.com
- **Internal Slack**: #event-management-support

### Báo lỗi và góp ý
- **GitHub Issues**: Tạo issue với template có sẵn
- **Email**: Gửi chi tiết lỗi kèm screenshot
- **Slack**: Ping team trong channel #bugs

### Tài liệu kỹ thuật
- **API Documentation**: https://api.vietnamairlines.com/docs
- **Design System**: https://design.vietnamairlines.com
- **Deployment Guide**: https://wiki.vietnamairlines.com/deployment

---

## 📄 Thông tin bản quyền

**© 2025 Vietnam Airlines Corporation. All rights reserved.**

Dự án này thuộc sở hữu của Vietnam Airlines và được bảo vệ bởi luật bản quyền. 
Mọi hành vi sao chép, phân phối hoặc sử dụng mà không có sự cho phép bằng văn bản 
từ Vietnam Airlines đều bị nghiêm cấm.

**Phiên bản**: v2.1.0  
**Cập nhật lần cuối**: 24/09/2025  
**Tác giả**: Vietnam Airlines IT Department

---

*Tài liệu này được cập nhật thường xuyên. Vui lòng kiểm tra phiên bản mới nhất trên repository.*

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Running Tests

To run the unit tests for the project, use the following command:

```bash
npm test
```

This will execute all test files located in the `__tests__` directory using Jest.

### Test Coverage

The project includes comprehensive unit tests for:

- **Login functionality**: Component, service, and context tests
- **Dashboard functionality**: Component and statistics service tests
- **Authentication flow**: Complete user authentication workflow tests
- **Seat management**: Service, component, and page tests for seat functionality
- **Seat map component**: Interactive seat map with different seat types and statuses
- **API integration**: Seat service with proper error handling and data fetching

All tests follow industry best practices with proper mocking and isolation.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Sau khi build thành công, để chạy build đó bạn dùng lệnh:

## **Chạy build production:**
```bash
npm start
```

## **Chạy build UAT:**
```bash
npm run start:uat
```

## **Quy trình đầy đủ:**

1. **Build:**
   ```bash
   npm run build        # Build production
   # hoặc
   npm run build:uat    # Build UAT
   ```

2. **Chạy build đã build:**
   ```bash
   npm start            # Chạy production build
   # hoặc  
   npm run start:uat    # Chạy UAT build
   ```

## **Lưu ý:**
- `npm start` chạy build production (port mặc định 3000)
- `npm run start:uat` chạy build UAT với file `.env.uat`
- Build sẽ chạy trên port 3000 (có thể thay đổi bằng biến môi trường `PORT`)

Sau khi chạy `npm start`, bạn có thể truy cập ứng dụng tại `http://localhost:3000`