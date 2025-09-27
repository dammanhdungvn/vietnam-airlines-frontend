/**
 * @fileoverview Service để xử lý các tác vụ liên quan đến xác thực người dùng.
 * @version 1.0.0
 * @since 2025-09-27
 * @author Dũng Đàm
 */
import api from "@/lib/api"
import { ILoginPayload, ILoginResponse } from "@/types/auth.type"

/**
 * Gửi yêu cầu đăng nhập lên server.
 * @param {ILoginPayload} payload - Dữ liệu đăng nhập bao gồm username và password.
 * @returns {Promise<ILoginResponse>} - Promise chứa dữ liệu trả về từ API, bao gồm access token và thông tin người dùng.
 */
export const login = async (payload: ILoginPayload): Promise<ILoginResponse> => {
  const { data } = await api.post("/auth/login", payload)
  return data
}
