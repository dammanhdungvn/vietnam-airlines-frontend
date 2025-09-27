/**
 * @fileoverview Định nghĩa các kiểu dữ liệu (TypeScript interfaces) cho module xác thực.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */

/**
 * Interface cho dữ liệu (payload) gửi đi khi thực hiện yêu cầu đăng nhập.
 */
export interface ILoginPayload {
  username?: string
  password?: string
}

/**
 * Interface cho dữ liệu (response) nhận về từ API sau khi đăng nhập thành công.
 */
export interface ILoginResponse {
  code: number
  message: string
  data: {
    accessToken: string
    refreshToken: string
    username: string
    role: string
  }
}
