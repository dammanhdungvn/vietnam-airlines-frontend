# Sách Hướng Dẫn Toàn Diện - Chức Năng Đăng Nhập

Tài liệu này là một cuốn sách hướng dẫn chi tiết, giải thích mọi khía cạnh của chức năng đăng nhập, từ ý tưởng thiết kế, cách mã nguồn được xây dựng, cho đến cách kiểm tra và gỡ lỗi.

## 1. Luồng Hoạt Động (Workflow)

Chức năng đăng nhập được thiết kế để đảm bảo tính bảo mật và trải nghiệm người dùng mượt mà. Luồng hoạt động cơ bản như sau:

1.  **Truy cập**: Người dùng truy cập vào trang web, hệ thống sẽ tự động chuyển hướng đến trang `/login`.
2.  **Nhập Thông Tin**: Người dùng nhập `username` và `password` vào biểu mẫu.
3.  **Xác thực phía Client**:
    *   Hệ thống sẽ kiểm tra ngay lập tức xem người dùng đã nhập đủ thông tin hay chưa.
    *   Nếu thiếu, một thông báo lỗi sẽ được hiển thị ngay bên dưới ô nhập liệu tương ứng.
4.  **Gửi Yêu Cầu**: Sau khi thông tin hợp lệ, người dùng nhấn nút "Sign in". Nút sẽ chuyển sang trạng thái "Đang đăng nhập..." để thông báo cho người dùng biết hệ thống đang xử lý.
5.  **Xử lý phía Server**: Yêu cầu được gửi đến API endpoint `/auth/login`. Backend sẽ kiểm tra thông tin đăng nhập.
6.  **Phản hồi từ Server**:
    *   **Thành công**: API trả về `accessToken`, `refreshToken`, và thông tin người dùng.
    *   **Thất bại**: API trả về một thông báo lỗi (ví dụ: "Thông tin đăng nhập không hợp lệ").
7.  **Xử lý phía Client**:
    *   **Thành công**:
        *   Một thông báo "Đăng nhập thành công!" sẽ hiện ra.
        *   Thông tin (`accessToken`, `refreshToken`, `user`) được lưu vào `localStorage` để duy trì phiên đăng nhập.
        *   Người dùng được tự động chuyển hướng đến trang `/dashboard`.
    *   **Thất bại**:
        *   Một thông báo lỗi chi tiết (từ API) sẽ được hiển thị.
        *   Người dùng vẫn ở lại trang đăng nhập để thử lại.

## 2. Cấu Trúc Mã Nguồn

Chức năng đăng nhập được xây dựng từ nhiều thành phần khác nhau, mỗi thành phần đảm nhận một nhiệm vụ cụ thể để đảm bảo tính module hóa và dễ bảo trì.

-   `app/login/page.tsx`: Component React chính, chứa giao diện người dùng (UI) của trang đăng nhập và logic xử lý sự kiện form.
-   `services/auth.service.ts`: Nơi định nghĩa các hàm gọi API liên quan đến xác thực. Nó đóng vai trò là một lớp trung gian (service layer) giữa UI và backend.
-   `context/AuthContext.tsx`: Quản lý trạng thái xác thực người dùng trên toàn bộ ứng dụng (global state). Nó giúp lưu trữ thông tin người dùng và token, đồng thời cung cấp các hàm `login`, `logout`.
-   `types/auth.type.ts`: Định nghĩa các kiểu dữ liệu (interfaces) cho `payload` và `response` của API đăng nhập, giúp đảm bảo an toàn kiểu dữ liệu (type safety).
-   `lib/api.ts`: Cấu hình một instance của `axios` để thực hiện các yêu cầu HTTP. Nó chứa một interceptor để tự động đính kèm `accessToken` vào header của mỗi yêu cầu được gửi đi sau khi người dùng đã đăng nhập.

## 3. Thành Phần Chính & Logic

### 3.1. Trang Đăng Nhập (`app/login/page.tsx`)

-   **Quản lý Form**: Sử dụng thư viện `react-hook-form` để quản lý trạng thái, validation và submission của form một cách hiệu quả.
-   **Validation**: Tích hợp với `zod` để định nghĩa các quy tắc xác thực (ví dụ: username không được để trống). `zodResolver` được sử dụng để kết nối `zod` với `react-hook-form`.
-   **Xử lý Submit**: Hàm `onSubmit` được gọi khi form được submit. Nó sẽ:
    1.  Gọi hàm `login` từ `auth.service.ts`.
    2.  Nếu thành công, gọi hàm `login` từ `AuthContext` để cập nhật trạng thái toàn cục.
    3.  Hiển thị thông báo (toast) cho người dùng.
    4.  Điều hướng (`router.push`) đến trang dashboard.

### 3.2. Context Xác Thực (`context/AuthContext.tsx`)

-   **State Management**: Sử dụng `useState` để lưu trữ thông tin người dùng (`user`) và trạng thái tải (`isLoading`).
-   **Persistence (Duy trì trạng thái)**: Sử dụng `useEffect` để đọc dữ liệu từ `localStorage` khi ứng dụng khởi động. Điều này giúp người dùng không cần đăng nhập lại mỗi khi tải lại trang.
-   **Hàm `login`**: Nhận dữ liệu từ API, lưu `accessToken`, `refreshToken`, và thông tin `user` vào `localStorage`, sau đó cập nhật state.
-   **Hàm `logout`**: Xóa toàn bộ dữ liệu xác thực khỏi `localStorage`, reset state và điều hướng người dùng về trang đăng nhập.
-   **Custom Hook `useAuth`**: Một hook tiện ích để các component khác có thể dễ dàng truy cập vào dữ liệu và các hàm của context.

## 4. Kiểm Thử (Sắp ra mắt)

Phần này sẽ được cập nhật sau khi hệ thống Unit Test được thiết lập. Các bài kiểm thử sẽ bao gồm:

-   Kiểm tra hiển thị đúng các thành phần của form.
-   Kiểm tra validation hoạt động chính xác.
-   Mô phỏng (mock) API call thành công và kiểm tra việc điều hướng.
-   Mô phỏng API call thất bại và kiểm tra việc hiển thị thông báo lỗi.

## 5. Gỡ Lỗi (Debugging)

Khi gặp sự cố với chức năng đăng nhập, hãy kiểm tra các điểm sau:

1.  **Network Tab trong Developer Tools**:
    *   Mở Developer Tools (F12) và chuyển đến tab "Network".
    *   Thực hiện đăng nhập và kiểm tra request `login`.
    *   Xem `Payload` (dữ liệu gửi đi) có đúng không.
    *   Xem `Response` (dữ liệu trả về) có khớp với mong đợi không. Trạng thái (Status) có phải là `200 OK` hay là lỗi `400`, `500`?
2.  **Console Tab**:
    *   Kiểm tra xem có bất kỳ lỗi JavaScript nào được ghi lại không.
3.  **Application Tab**:
    *   Chuyển đến tab "Application", chọn "Local Storage".
    *   Sau khi đăng nhập thành công, kiểm tra xem `accessToken`, `refreshToken`, và `user` đã được lưu đúng cách hay chưa.
4.  **Biến Môi Trường**:
    *   Đảm bảo file `.env.development` có biến `NEXT_PUBLIC_API_URL` được cấu hình chính xác và trỏ đến đúng địa chỉ backend.
